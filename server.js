const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const port = process.env.PORT || 3000;

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// 🟢 THÊM API TRẢ VỀ CONFIG JSON CHO APP FLUTTER
app.get('/config', (req, res) => {
  res.json({
    "assets": {
      "background": "assets/images/background.png"
    },
    "buildings": [
      {
        "id": "sa_ban",
        "name": "TỔNG SA BÀN",
        "floors": [
          {
            "id": "tien_ich",
            "name": "THƯƠNG MẠI VÀ TIỆN ÍCH",
            "rooms": [
              { "id": 100, "name": "SHOPHOUSE", "hardwareIndex": 100 },
              { "id": 201, "name": "BEAUTYSALON", "hardwareIndex": 201 },
              { "id": 202, "name": "GYM-SHCĐ", "hardwareIndex": 202 },
              { "id": 203, "name": "GAME", "hardwareIndex": 203 },
              { "id": 204, "name": "MEETING", "hardwareIndex": 204 },
              { "id": 205, "name": "CO-WORKING", "hardwareIndex": 205 },
              { "id": 206, "name": "YOGA", "hardwareIndex": 206 }
            ]
          }
        ]
      }
    ]
  });
});

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <title>ESP32 Sa Ban - Live Mock Dashboard</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; background: #0f172a; color: #f8fafc; margin: 0; }
        .container { max-width: 900px; margin: 0 auto; }
        .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #334155; padding-bottom: 15px; }
        .status-badge { padding: 6px 14px; background: #166534; color: #4ade80; border-radius: 20px; font-weight: bold; font-size: 13px; }
        
        .board { background: #1e293b; border-radius: 16px; padding: 24px; margin: 20px 0; border: 1px solid #334155; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3); }
        .led-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 16px; margin-top: 20px; }
        
        .led-card { background: #0f172a; border-radius: 12px; padding: 18px 10px; text-align: center; border: 1px solid #334155; transition: all 0.3s ease; }
        .led-icon { font-size: 48px; filter: grayscale(100%) opacity(0.25); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .led-card.active { border-color: #f59e0b; background: #1e1b4b; }
        .led-card.active .led-icon { filter: grayscale(0%) opacity(1); transform: scale(1.1); drop-shadow: 0 0 18px #f59e0b; }
        .led-label { font-size: 13px; font-weight: 600; margin-top: 10px; color: #94a3b8; }
        .led-card.active .led-label { color: #fef08a; }

        #logs { background: #020617; border: 1px solid #1e293b; height: 180px; overflow-y: auto; padding: 14px; font-family: 'Courier New', monospace; border-radius: 10px; font-size: 12px; color: #38bdf8; }
        .log-item { margin-bottom: 6px; line-height: 1.4; border-bottom: 1px dashed #1e293b; padding-bottom: 4px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>🏛️ ESP32 Sa Ban Mock Dashboard</h2>
          <span class="status-badge">● ONLINE & WAITING FOR APP</span>
        </div>

        <div class="board">
          <h3 style="margin:0; color:#e2e8f0;">💡 Trạng Thái Đèn Sa Bàn Real-time</h3>
          <div class="led-grid">
            <div id="card-100" class="led-card"><div class="led-icon">🏬</div><div class="led-label">SHOPHOUSE (100)</div></div>
            <div id="card-201" class="led-card"><div class="led-icon">💅</div><div class="led-label">BEAUTYSALON (201)</div></div>
            <div id="card-202" class="led-card"><div class="led-icon">🏋️</div><div class="led-label">GYM-SHCĐ (202)</div></div>
            <div id="card-203" class="led-card"><div class="led-icon">🎮</div><div class="led-label">GAME (203)</div></div>
            <div id="card-204" class="led-card"><div class="led-icon">🤝</div><div class="led-label">MEETING (204)</div></div>
            <div id="card-205" class="led-card"><div class="led-icon">💻</div><div class="led-label">CO-WORKING (205)</div></div>
            <div id="card-206" class="led-card"><div class="led-icon">🧘</div><div class="led-label">YOGA (206)</div></div>
          </div>
        </div>

        <h3>📝 Nhật Ký Lệnh Từ App:</h3>
        <div id="logs"></div>
      </div>

      <script>
        const logDiv = document.getElementById('logs');
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const ws = new WebSocket(protocol + '//' + window.location.host);

        ws.onmessage = (event) => {
          const dataStr = event.data;
          
          const item = document.createElement('div');
          item.className = 'log-item';
          item.innerText = \`[\${new Date().toLocaleTimeString()}] RECV: \${dataStr}\`;
          logDiv.appendChild(item);
          logDiv.scrollTop = logDiv.scrollHeight;

          try {
            const data = JSON.parse(dataStr);
            const ids = data.leds || data.pins || (data.hardwareIndex !== undefined ? [data.hardwareIndex] : []) || (data.led !== undefined ? [data.led] : []);
            const state = data.state ?? data.status === 'ON' ?? data.value === 1 ?? true;

            if (ids.length > 0) {
              ids.forEach(id => updateLed(id, state));
            } else {
              document.querySelectorAll('.led-card').forEach(el => {
                if (state) el.classList.add('active');
                else el.classList.remove('active');
              });
            }
          } catch(e) {
            document.querySelectorAll('.led-card').forEach(el => {
              const cardId = el.id.replace('card-', '');
              if (dataStr.includes(cardId) || dataStr.includes('ON') || dataStr.includes('ALL')) {
                if (dataStr.includes('OFF')) el.classList.remove('active');
                else el.classList.add('active');
              }
            });
          }
        };

        function updateLed(id, isOn) {
          const card = document.getElementById('card-' + id);
          if (card) {
            if (isOn) card.classList.add('active');
            else card.classList.remove('active');
          }
        }
      </script>
    </body>
    </html>
  `);
});

wss.on('connection', (ws) => {
  console.log('App connected!');
  ws.send(JSON.stringify({ status: "connected", device: "ESP32_MOCK_SERVER" }));

  ws.on('message', (message) => {
    const rawData = message.toString();
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(rawData);
      }
    });
  });
});

server.listen(port, () => console.log(`Server listening on port ${port}`));