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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Bổ sung thêm dòng này để phục vụ tài nguyên tĩnh nội bộ nếu có
app.use(express.static(path.join(__dirname)));

// Favicon rỗng để tránh lỗi 404 trên console trình duyệt
app.get('/favicon.ico', (req, res) => res.status(204).end());

// 🟢 1. API CONFIG CÓ CACHE BUSTING TRẢ CHO FLUTTER APP & WEB
app.get('/config', (req, res) => {
  const gistUrl = GIST_RAW_URL + '?t=' + Date.now();
  https.get(gistUrl, (response) => {
    let data = '';
    response.on('data', (chunk) => { data += chunk; });
    response.on('end', () => {
      try { 
        res.json(JSON.parse(data)); 
      } catch (e) { 
        res.status(500).json({ error: "Lỗi parse JSON từ Gist" }); 
      }
    });
  }).on('error', (err) => res.status(500).json({ error: "Lỗi kết nối Gist: " + err.message }));
});

// 🟢 2. TRẢ FILE INDEX.HTML GIAO DIỆN MẶT BẰNG
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 🟢 3. WEBSOCKET SERVER RELAY LỆNH MỚI CHUẨN ĐỊNH DẠNG
wss.on('connection', function(ws) {
  console.log('🟢 [SERVER] Client mới kết nối WebSocket');
  ws.send(JSON.stringify({ status: "connected", device: "ESP32_MOCK_SERVER" }));

  ws.on('message', function(message) {
    const rawData = message.toString().trim();
    console.log("📩 [SERVER RECEIVED]:", rawData);

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