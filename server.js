const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('hello');
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});

