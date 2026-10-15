const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const port = process.env.PORT || 3000;

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Trang Web Dashboard mô phỏng trạng thái Sa bàn
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
          
          // Ghi Log tin nhắn nhận từ Flutter
          const item = document.createElement('div');
          item.className = 'log-item';
          item.innerText = \`[\${new Date().toLocaleTimeString()}] RECV: \${dataStr}\`;
          logDiv.appendChild(item);
          logDiv.scrollTop = logDiv.scrollHeight;

          try {
            const data = JSON.parse(dataStr);
            
            // Xử lý bật/tắt danh sách LEDs hoặc LED đơn lẻ
            if (Array.isArray(data.leds)) {
              data.leds.forEach(id => updateLed(id, data.state ?? data.status === 'ON'));
            } else if (data.hardwareIndex || data.led) {
              const id = data.hardwareIndex || data.led;
              updateLed(id, data.state ?? data.status === 'ON');
            } else if (data.command === 'TOGGLE_ALL') {
              document.querySelectorAll('.led-card').forEach(el => {
                if (data.state) el.classList.add('active');
                else el.classList.remove('active');
              });
            }
          } catch(e) {
            // Trường hợp chuỗi thô
            if (dataStr.includes("ON")) {
              document.querySelectorAll('.led-card').forEach(el => el.classList.add('active'));
            } else if (dataStr.includes("OFF")) {
              document.querySelectorAll('.led-card').forEach(el => el.classList.remove('active'));
            }
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

// Xử lý kết nối WebSocket từ App Flutter
wss.on('connection', (ws) => {
  console.log('App Reviewer đã kết nối!');
  ws.send(JSON.stringify({ status: "connected", device: "ESP32_MOCK_SERVER" }));

  ws.on('message', (message) => {
    const rawData = message.toString();
    console.log('Received payload:', rawData);

    // Broadcast tới Dashboard trình duyệt để đổi màu icon
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(rawData);
      }
    });

    // Phản hồi OK về App Flutter
    ws.send(JSON.stringify({ result: "OK", echo: rawData }));
  });
});

server.listen(port, () => console.log(`Server đang chạy trên port ${port}`));