// Local static server and same-origin API proxy for the Campus Pulse frontend.
// Run with: node server.js
const http = require('node:http');
const https = require('node:https');
const fs = require('node:fs');
const path = require('node:path');

const HOST = '127.0.0.1';
const PORT = Number(process.env.PORT || 8000);
const BACKEND = new URL('https://one5novws.onrender.com/');
const ROOT = __dirname;
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.ico': 'image/x-icon' };

const server = http.createServer((req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host || `${HOST}:${PORT}`}`);
  if (requestUrl.pathname === '/api' || requestUrl.pathname.startsWith('/api/')) {
    const target = new URL(`${requestUrl.pathname.slice(1)}${requestUrl.search}`, BACKEND);
    const proxy = https.request(target, {
      method: req.method,
      headers: Object.fromEntries(Object.entries(req.headers).filter(([key]) => !['host', 'connection', 'content-length'].includes(key.toLowerCase())))
    }, upstream => {
      res.writeHead(upstream.statusCode || 502, upstream.headers);
      upstream.pipe(res);
    });
    proxy.on('error', error => {
      if (!res.headersSent) res.writeHead(502, { 'content-type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: `Could not reach backend: ${error.message}` }));
    });
    req.pipe(proxy);
    return;
  }

  let pathname;
  try { pathname = decodeURIComponent(requestUrl.pathname); } catch { res.writeHead(400).end('Bad request'); return; }
  if (pathname === '/') pathname = '/index.html';
  const file = path.resolve(ROOT, `.${pathname}`);
  if (!file.startsWith(`${ROOT}${path.sep}`) && file !== ROOT) { res.writeHead(403).end('Forbidden'); return; }
  fs.stat(file, (error, stat) => {
    if (error || !stat.isFile()) { res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }).end('Not found'); return; }
    res.writeHead(200, { 'content-type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream', 'cache-control': 'no-cache' });
    fs.createReadStream(file).pipe(res);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Campus Pulse running at http://${HOST}:${PORT}`);
  console.log(`API requests are proxied to ${BACKEND.origin}/`);
});
