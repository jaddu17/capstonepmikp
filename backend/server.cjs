const http = require('http');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const PORT = process.env.PORT || 8000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const BRIDGE_PATH = path.join(__dirname, 'cli-bridge.php');
const PHP_BIN = process.env.PHP_BIN || 'php';

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
};

const server = http.createServer((req, res) => {
  const urlObj = new URL(req.url, `http://${req.headers.host || '127.0.0.1'}`);
  const pathname = decodeURIComponent(urlObj.pathname);

  // Check if static file exists in public dir
  const staticPath = path.join(PUBLIC_DIR, pathname);
  if (pathname !== '/' && fs.existsSync(staticPath) && fs.statSync(staticPath).isFile()) {
    const ext = path.extname(staticPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    return fs.createReadStream(staticPath).pipe(res);
  }

  // Collect request body
  const bodyChunks = [];
  req.on('data', chunk => bodyChunks.push(chunk));
  req.on('end', () => {
    const bodyBuffer = Buffer.concat(bodyChunks);

    const serverMeta = {
      REQUEST_METHOD: req.method,
      REQUEST_URI: req.url,
      PATH_INFO: pathname,
      QUERY_STRING: urlObj.search ? urlObj.search.slice(1) : '',
      SERVER_NAME: '127.0.0.1',
      SERVER_PORT: String(PORT),
      REMOTE_ADDR: req.socket.remoteAddress || '127.0.0.1',
      SCRIPT_FILENAME: path.join(PUBLIC_DIR, 'index.php'),
      SCRIPT_NAME: '/index.php',
      PHP_SELF: '/index.php',
    };

    for (const [key, val] of Object.entries(req.headers)) {
      const upperKey = key.toUpperCase().replace(/-/g, '_');
      if (key === 'content-type') {
        serverMeta.CONTENT_TYPE = val;
      } else if (key === 'content-length') {
        serverMeta.CONTENT_LENGTH = val;
      } else {
        serverMeta[`HTTP_${upperKey}`] = val;
      }
    }

    const php = spawn(PHP_BIN, [BRIDGE_PATH, JSON.stringify(serverMeta)], {
      cwd: __dirname,
      env: { ...process.env },
    });

    if (bodyBuffer.length > 0) {
      php.stdin.write(bodyBuffer);
    }
    php.stdin.end();

    let outputChunks = [];
    let errChunks = [];

    php.stdout.on('data', chunk => outputChunks.push(chunk));
    php.stderr.on('data', chunk => errChunks.push(chunk));

    php.on('close', code => {
      const rawOutput = Buffer.concat(outputChunks).toString('utf-8');
      const errOutput = Buffer.concat(errChunks).toString('utf-8');

      if (code !== 0 && !rawOutput.includes('---HTTP_STATUS:')) {
        console.error('PHP Error:', errOutput);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'PHP execution failed', details: errOutput }));
      }

      const statusMatch = rawOutput.match(/---HTTP_STATUS:(\d+)---\n/);
      const headersMatch = rawOutput.match(/---HTTP_HEADERS:(.*?)---\n/);

      const status = statusMatch ? parseInt(statusMatch[1], 10) : 200;
      const headersList = headersMatch ? JSON.parse(headersMatch[1]) : [];

      const markerEnd = rawOutput.indexOf('---\n', rawOutput.indexOf('---HTTP_HEADERS:')) + 4;
      const body = markerEnd >= 4 ? rawOutput.slice(markerEnd) : rawOutput;

      const responseHeaders = {};
      for (const h of headersList) {
        const colonIdx = h.indexOf(':');
        if (colonIdx > 0) {
          const name = h.slice(0, colonIdx).trim();
          const value = h.slice(colonIdx + 1).trim();
          responseHeaders[name] = value;
        }
      }

      res.writeHead(status, responseHeaders);
      res.end(body);
    });
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Backend server running at http://127.0.0.1:${PORT}`);
});
