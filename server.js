const express = require('express');
const http = require('http');
const https = require('https');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const GIST_RAW_URL = 'https://gist.githubusercontent.com/nguyenvandungvtdt-commits/b3440aa5a5ab9e6e69bb570b389c88cb/raw/config.json';

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

// Trả về favicon giả để tránh lỗi 404 console
app.get('/favicon.ico', (req, res) => res.status(204).end());

// 🟢 1. API CONFIG
app.get('/config', (req, res) => {
  https.get(GIST_RAW_URL + '?t=' + Date.now(), (response) => {
    let data = '';
    response.on('data', (chunk) => { data += chunk; });
    response.on('end', () => {
      try { res.json(JSON.parse(data)); } 
      catch (e) { res.status(500).json({ error: "Parse error" }); }
    });
  }).on('error', () => res.status(500).json({ error: "Fetch error" }));
});

// 🟢 2. TRA FILE INDEX.HTML TỰ CÓ TRONG THƯ MỤC
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 🟢 3. WEBSOCKET LISTENER
wss.on('connection', function(ws) {
  console.log('🟢 [SERVER] Client kết nối');
  ws.send(JSON.stringify({ status: "connected", device: "ESP32_MOCK_SERVER" }));

  ws.on('message', function(message) {
    const rawData = message.toString().trim();
    wss.clients.forEach(function(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(rawData);
      }
    });
  });
});

server.listen(port, function() {
  console.log('Server running on port ' + port);
});