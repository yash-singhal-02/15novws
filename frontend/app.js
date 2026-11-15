(() => {
  // Use the frontend origin. Vercel and the local Node server proxy /api to Render,
  // keeping browser requests same-origin and avoiding CORS/preflight failures.
  const API = new URL('/', window.location.href);
  const $ = (selector, root = document) => root.querySelector(selector);
  let personas = [];
  try { personas = JSON.parse(localStorage.getItem('campusPulsePersonas') || '[]'); } catch { personas = []; }
  const state = { events: [], filter: 'all', search: '', selectedEvent: null, userId: localStorage.getItem('campusPulseUserId') || '', personas };
  const colors = ['#3730a3,#818cf8', '#b74a2d,#fb923c', '#0e7490,#2dd4bf', '#6d28d9,#c084fc', '#047857,#34d399'];
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const humanize = value => String(value || '').replace(/[_-]+/g, ' ').replace(/\b\w/g, ch => ch.toUpperCase());
  const idOf = event => event?.id ?? event?.event_id ?? event?.eventId ?? '';
  const titleOf = event => event?.title ?? event?.name ?? 'Untitled event';
  const statusOf = event => String(event?.status || 'open').toLowerCase();
  const isOpen = event => ['open', 'active', 'published', 'available', 'upcoming'].includes(statusOf(event));
  const dateOf = event => event?.starts_at ?? event?.start_at ?? event?.date ?? event?.event_date ?? event?.startsAt ?? '';
  const formatDate = value => { if (!value) return 'Date to be announced'; const date = new Date(value); return Number.isNaN(date.getTime()) ? String(value) : new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: value.includes?.('T') ? 'numeric' : undefined, minute: value.includes?.('T') ? '2-digit' : undefined }).format(date); };
  const unwrap = data => Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : Array.isArray(data?.events) ? data.events : Array.isArray(data?.registrations) ? data.registrations : Array.isArray(data?.items) ? data.items : data?.data && typeof data.data === 'object' ? data.data : data;
  async function api(path, options = {}) {
    const url = new URL(path.replace(/^\//, ''), API);
    const response = await fetch(url, { ...options, headers: { Accept: 'application/json', ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...options.headers } });
    const raw = await response.text();
    let data;
    try { data = raw ? JSON.parse(raw) : null; } catch { data = raw; }
    if (!response.ok) { const message = typeof data === 'string' ? data : data?.message || data?.error || `Request failed (${response.status})`; const error = new Error(message); error.status = response.status; throw error; }
    return data;
  }
  function showNotice(selector, message, type = 'info') { const node = $(selector); node.textContent = message; node.className = `notice ${type}`; node.hidden = false; }
  function clearNotice(selector) { const node = $(selector); node.hidden = true; node.textContent = ''; }
  function showToast(message) { const toast = $('#toast'); toast.textContent = message; toast.classList.add('show'); clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove('show'), 2900); }
  function persistPersonas() { localStorage.setItem('campusPulsePersonas', JSON.stringify(state.personas)); localStorage.setItem('campusPulseUserId', state.userId); }
  function renderPersonas() {
    $('#persona-list').innerHTML = state.personas.length ? state.personas.map((persona, index) => `<button class="persona-option ${persona.id === state.userId ? 'active' : ''}" type="button" data-persona-index="${index}"><span class="avatar">${esc((persona.name || 'U').slice(0, 1).toUpperCase())}</span><span><strong>${esc(persona.name)}</strong><small>${esc(persona.id.slice(0, 8))}…</small></span>${persona.id === state.userId ? '<span class="persona-check">✓</span>' : ''}</button>`).join('') : '<div class="empty-state">No saved people yet. Add each user below.</div>';
    const organizerId = state.events.find(event => event.organizer_id)?.organizer_id;
    const shortcut = $('#add-organizer-persona');
    shortcut.hidden = !organizerId || state.personas.some(persona => persona.id === organizerId);
    shortcut.dataset.organizerId = organizerId || '';
  }
  function updateUser() { const active = state.personas.find(persona => persona.id === state.userId); $('#user-label').textContent = active ? active.name : 'Switch user'; $('#registrations-hint').textContent = state.userId ? `Your registrations are linked to ${active?.name || 'the selected user'}.` : 'Choose or add a person with the button in the top right to load registrations.'; renderPersonas(); }
  function eventCard(event, index) {
    const closed = !isOpen(event), status = humanize(event.status || 'open'), id = idOf(event);
    const rawCapacity = Number(event.capacity), rawCount = Number(event.registration_count ?? event.registrations_count ?? event.attendee_count ?? 0);
    const spots = Number.isFinite(rawCapacity) && rawCapacity > 0 ? `${Math.max(0, rawCapacity - rawCount)} spots left` : (event.location || event.venue || 'Campus event');
    const description = event.description || event.summary || 'A chance to meet, learn, and make something memorable on campus.';
    const category = event.category || event.type || 'Campus event';
    return `<article class="event-card"><div class="event-cover" style="background:linear-gradient(140deg,${colors[index % colors.length]})"><span class="cover-tag">${esc(category)}</span><span class="cover-index">${String(index + 1).padStart(2, '0')}</span></div><div class="card-body"><div class="card-meta"><span>${esc(formatDate(dateOf(event)))}</span><span class="status-pill ${closed ? 'closed' : ''}">${esc(status)}</span></div><h3>${esc(titleOf(event))}</h3><p class="event-description">${esc(description)}</p><div class="event-card-foot"><span>${esc(spots)}</span><button class="text-action" type="button" data-event-id="${esc(id)}">View details ↗</button></div></div></article>`;
  }
  function filteredEvents() {
    const query = state.search.trim().toLowerCase();
    return state.events.filter(event => {
      const filterMatch = state.filter === 'all' || (state.filter === 'open' ? isOpen(event) : !isOpen(event));
      const text = [titleOf(event), event.description, event.category, event.location, event.venue].join(' ').toLowerCase();
      return filterMatch && (!query || text.includes(query));
    });
  }
  function renderEvents() {
    const events = filteredEvents();
    $('#event-grid').innerHTML = events.length ? events.map(eventCard).join('') : `<div class="empty-state"><b>${state.events.length ? 'No events match your search.' : 'Your campus calendar is ready.'}</b>${state.events.length ? 'Try another title or filter.' : 'Events will appear here as soon as they are available.'}</div>`;
    $('#organizer-event-count').textContent = String(state.events.length).padStart(2, '0');
  }
  async function loadEvents() {
    const button = $('#refresh-events'); button.disabled = true;
    showNotice('#event-status', 'Loading events…');
    try {
      const data = await api('api/events');
      state.events = unwrap(data).filter(item => item && typeof item === 'object');
      clearNotice('#event-status'); renderEvents(); renderOrganizerEvents(); renderPersonas();
      if (!state.events.length) showNotice('#event-status', 'No events have been published yet. Check back soon.', 'info');
    } catch (error) { state.events = []; renderEvents(); showNotice('#event-status', `Could not load events: ${error.message}. Please try again.`, 'error'); }
    finally { button.disabled = false; }
  }
  function renderOrganizerEvents() {
    $('#organizer-events').innerHTML = state.events.length ? state.events.map(event => `<div class="organizer-event"><div><strong>${esc(titleOf(event))}</strong><small>${esc(formatDate(dateOf(event)))}</small></div><button type="button" data-roster-id="${esc(idOf(event))}">Attendees ↗</button></div>`).join('') : '<div class="empty-state">Load events to choose an attendee list.</div>';
  }
  function eventDetails(event) {
    const capacity = event.capacity ? `${esc(event.capacity)} attendees` : 'Not specified';
    const colorIndex = Math.max(0, state.events.indexOf(event)) % colors.length;
    return `<div class="dialog-hero" style="background:linear-gradient(140deg,${colors[colorIndex]})"><h2>${esc(titleOf(event))}</h2></div><div class="dialog-content"><span class="status-pill ${isOpen(event) ? '' : 'closed'}">${esc(humanize(event.status || 'open'))}</span><p>${esc(event.description || event.summary || 'Join your campus community for this event.')}</p><div class="detail-row"><b>Date &amp; time</b><span>${esc(formatDate(dateOf(event)))}</span></div><div class="detail-row"><b>Location</b><span>${esc(event.location || event.venue || 'To be announced')}</span></div><div class="detail-row"><b>Capacity</b><span>${capacity}</span></div><div class="detail-row"><b>Organizer</b><span>${esc(event.organizer_name || event.organizer?.name || 'Campus organizer')}</span></div><div class="dialog-actions"><button class="button button-primary" id="register-event" ${!isOpen(event) ? 'disabled' : ''}>${isOpen(event) ? 'Register for event' : 'Registration closed'} <span>↗</span></button><button class="button button-outline" id="dialog-close-secondary">Close</button></div></div>`;
  }
  async function openEvent(event) {
    state.selectedEvent = event;
    const id = idOf(event), dialog = $('#event-dialog'), content = $('#dialog-content');
    content.innerHTML = eventDetails(event); dialog.showModal();
    $('#dialog-close-secondary').addEventListener('click', () => dialog.close());
    $('#register-event')?.addEventListener('click', () => registerForEvent(event));
    if (!id) return;
    try {
      const data = await api(`api/events/${encodeURIComponent(id)}`), details = unwrap(data);
      if (details && typeof details === 'object' && !Array.isArray(details)) {
        const updated = { ...event, ...details }; state.selectedEvent = updated; content.innerHTML = eventDetails(updated);
        $('#dialog-close-secondary').addEventListener('click', () => dialog.close());
        $('#register-event')?.addEventListener('click', () => registerForEvent(updated));
      }
    } catch { /* The event list still provides enough detail to render a useful screen. */ }
  }
  async function registerForEvent(event) {
    if (!state.userId) { $('#user-dialog').showModal(); showToast('Choose a user to register for an event.'); return; }
    const button = $('#register-event'); if (button) { button.disabled = true; button.textContent = 'Registering…'; }
    try {
      await api('api/registrations', { method: 'POST', body: JSON.stringify({ user_id: state.userId, event_id: idOf(event) }) });
      showToast('You’re registered!'); $('#event-dialog').close(); await loadRegistrations();
    } catch (error) { showToast(error.status === 409 ? 'You are already registered for this event.' : `Registration failed: ${error.message}`); if (button) { button.disabled = false; button.textContent = 'Register for event ↗'; } }
  }
  function registrationEvent(registration) {
    const id = registration.event_id ?? registration.eventId ?? registration.event?.id;
    return state.events.find(event => String(idOf(event)) === String(id)) || registration.event || {};
  }
  async function loadRegistrations() {
    if (!state.userId) { $('#registration-grid').innerHTML = '<div class="empty-state"><b>Choose a user to see their plans.</b>Use the user button at the top of the page.</div>'; return; }
    showNotice('#registration-status', 'Loading registrations…');
    try {
      const data = await api(`api/me/registrations?user_id=${encodeURIComponent(state.userId)}`);
      const registrations = unwrap(data); clearNotice('#registration-status');
      if (!Array.isArray(registrations) || !registrations.length) { $('#registration-grid').innerHTML = '<div class="empty-state"><b>No registrations yet.</b>Explore events above and save your spot.</div>'; return; }
      $('#registration-grid').innerHTML = registrations.map(reg => { const event = registrationEvent(reg); return `<article class="registration-card"><div><span class="status-pill">${esc(humanize(event.status || 'registered'))}</span><h3>${esc(titleOf(event))}</h3><p>${esc(formatDate(dateOf(event)))}</p><span class="registration-id">${esc(reg.id || reg.registration_id || 'Registration confirmed')}</span></div><span aria-hidden="true" style="font-size:22px;color:#6259e9">✓</span></article>`; }).join('');
    } catch (error) { $('#registration-grid').innerHTML = ''; showNotice('#registration-status', `Could not load registrations: ${error.message}.`, 'error'); }
  }
  async function loadRoster(eventId) {
    document.querySelector('.roster-list')?.remove();
    showNotice('#organizer-status', 'Loading attendee list…');
    try {
      if (!state.userId) { $('#user-dialog').showModal(); throw new Error('Choose the event organizer user first.'); }
      const data = await api(`api/events/${encodeURIComponent(eventId)}/registrations?user_id=${encodeURIComponent(state.userId)}`);
      const registrations = unwrap(data); clearNotice('#organizer-status');
      if (!Array.isArray(registrations) || !registrations.length) { showNotice('#organizer-status', 'No registrations found for this event.', 'info'); return; }
      showNotice('#organizer-status', `${registrations.length} attendee${registrations.length === 1 ? '' : 's'} registered.`, 'info');
      $('#organizer-status').insertAdjacentHTML('afterend', `<div class="roster-list">${registrations.map((reg, index) => `<div class="organizer-event"><div><strong>${esc(reg.email || reg.user?.email || `Attendee ${index + 1}`)}</strong><small>${esc(reg.created_at ? formatDate(reg.created_at) : reg.user_id || '')}</small></div></div>`).join('')}</div>`);
    } catch (error) { showNotice('#organizer-status', `Could not load attendees: ${error.message}. The endpoint is restricted to the event organizer.`, 'error'); }
  }
  $('#event-grid').addEventListener('click', event => { const button = event.target.closest('[data-event-id]'); if (!button) return; const match = state.events.find(item => String(idOf(item)) === button.dataset.eventId); if (match) openEvent(match); });
  $('#organizer-events').addEventListener('click', event => { const button = event.target.closest('[data-roster-id]'); if (button) loadRoster(button.dataset.rosterId); });
  $('#event-search').addEventListener('input', event => { state.search = event.target.value; renderEvents(); });
  $('#status-filters').addEventListener('click', event => { const button = event.target.closest('[data-filter]'); if (!button) return; state.filter = button.dataset.filter; document.querySelectorAll('.filter-chip').forEach(chip => chip.classList.toggle('active', chip === button)); renderEvents(); });
  $('#refresh-events').addEventListener('click', loadEvents);
  $('#refresh-registrations').addEventListener('click', loadRegistrations);
  $('#load-organizer-events').addEventListener('click', () => { document.querySelector('#organizer-events').scrollIntoView({ behavior: 'smooth', block: 'center' }); });
  $('#user-menu').addEventListener('click', () => $('#user-dialog').showModal());
  $('#close-dialog').addEventListener('click', () => $('#event-dialog').close());
  $('#close-user-dialog').addEventListener('click', () => $('#user-dialog').close());
  $('#persona-list').addEventListener('click', async event => { const button = event.target.closest('[data-persona-index]'); if (!button) return; const persona = state.personas[Number(button.dataset.personaIndex)]; if (!persona) return; state.userId = persona.id; persistPersonas(); updateUser(); $('#user-dialog').close(); await loadRegistrations(); showToast(`Switched to ${persona.name}.`); });
  $('#user-form').addEventListener('submit', async event => { event.preventDefault(); const input = $('#user-id-input').value.trim(), name = $('#user-name-input').value.trim(); if (!input || !name) { showToast('Enter a name and user UUID.'); return; } const existing = state.personas.findIndex(persona => persona.id === input); const persona = { name, id: input }; if (existing >= 0) state.personas[existing] = persona; else state.personas.push(persona); state.userId = input; persistPersonas(); updateUser(); $('#user-name-input').value = ''; $('#user-id-input').value = ''; $('#user-dialog').close(); await loadRegistrations(); showToast(`${name} saved on this device.`); });
  $('#clear-user').addEventListener('click', () => { state.userId = ''; persistPersonas(); updateUser(); $('#user-dialog').close(); $('#registration-grid').innerHTML = '<div class="empty-state"><b>Choose a user to see their plans.</b>Use the user button at the top of the page.</div>'; clearNotice('#registration-status'); showToast('User selection cleared.'); });
  $('#add-organizer-persona').addEventListener('click', async event => { const id = event.currentTarget.dataset.organizerId; if (!id) return; const persona = { name: 'Event organizer', id }; state.personas.push(persona); state.userId = id; persistPersonas(); updateUser(); $('#user-dialog').close(); await loadRegistrations(); showToast('Event organizer selected.'); });
  $('#event-dialog').addEventListener('click', event => { if (event.target === $('#event-dialog')) $('#event-dialog').close(); });
  updateUser(); loadEvents(); loadRegistrations();
})();
