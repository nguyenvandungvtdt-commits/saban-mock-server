const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const port = process.env.PORT || 3000;

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Link GitHub Gist Raw chứa cấu hình chuẩn mà script Python đẩy lên
const GIST_RAW_URL = 'https://gist.githubusercontent.com/nguyenvandungvtdt-commits/b3440aa5a5ab9e6e69bb570b389c88cb/raw/config.json';

// 🟢 1. API CẤU HÌNH: LẤY TRỰC TIẾP TỪ GITHUB GIST ĐỂ ĐỒNG BỘ NGUYÊN BẢN
app.get('/config', async (req, res) => {
  try {
    const response = await fetch(`${GIST_RAW_URL}?t=${Date.now()}`);
    if (response.ok) {
      const data = await response.json();
      return res.json(data);
    }
  } catch (e) {
    console.error('Lỗi tải Gist từ Server:', e);
  }

  // Fallback nếu Gist bị nghẽn
  res.json({
    "project_info": { "name": "Dự Án Sa Bàn Tòa Nhà" },
    "d": [
      ["THÁP A", "TẦNG 01", "Shophouse-A101", 100, 0, "Shophouse khối đế | Thương mại dịch vụ"],
      ["THÁP A", "TẦNG 01", "Shophouse-A102", 100, 1, "Shophouse khối đế | Thương mại dịch vụ"],
      ["THÁP A", "TẦNG 01", "Shophouse-A103", 100, 2, "Shophouse khối đế | Thương mại dịch vụ"],
      ["THÁP A", "TẦNG 01", "Sảnh AB", 200, 3, "Sảnh Tòa Nhà"],
      ["THÁP A", "TẦNG 02", "BeautySalon A", 201, 4, "BeautySalon"],
      ["THÁP A", "TẦNG 02", "Gym-SHCĐ A", 202, 5, "Gym / SHCĐ"],
      ["THÁP A", "TẦNG 02", "Game", 203, 6, "Khu Game"],
      ["THÁP A", "TẦNG 02", "Meeting AB", 204, 7, "Phòng Lấy Ý Kiến / Trực"],
      ["THÁP A", "TẦNG 03", "A301-2BR", 2, 8, "Căn hộ 2 Phòng ngủ | Sẵn sàng điều khiển"],
      ["THÁP A", "TẦNG 03", "A302-3BR", 3, 9, "Căn hộ 3 Phòng ngủ | Sẵn sàng điều khiển"]
    ]
  });
});

// 🟢 2. TRANG WEB DASHBOARD CHO APPLE REVIEWER (TỰ ĐỘNG LẤY NÚT BẤM TỪ GIST)
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
        .container { max-width: 1000px; margin: 0 auto; }
        .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #334155; padding-bottom: 15px; }
        .status-badge { padding: 6px 14px; background: #166534; color: #4ade80; border-radius: 20px; font-weight: bold; font-size: 13px; }
        
        .board { background: #1e293b; border-radius: 16px; padding: 24px; margin: 20px 0; border: 1px solid #334155; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3); }
        .led-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 14px; margin-top: 20px; }
        
        .led-card { background: #0f172a; border-radius: 12px; padding: 16px 8px; text-align: center; border: 1px solid #334155; transition: all 0.3s ease; }
        .led-icon { font-size: 38px; filter: grayscale(100%) opacity(0.25); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .led-card.active { border-color: #f59e0b; background: #1e1b4b; }
        .led-card.active .led-icon { filter: grayscale(0%) opacity(1); transform: scale(1.1); drop-shadow: 0 0 18px #f59e0b; }
        .led-label { font-size: 12px; font-weight: 600; margin-top: 8px; color: #94a3b8; word-break: break-word; }
        .led-card.active .led-label { color: #fef08a; }

        #logs { background: #020617; border: 1px solid #1e293b; height: 180px; overflow-y: auto; padding: 14px; font-family: 'Courier New', monospace; border-radius: 10px; font-size: 12px; color: #38bdf8; }
        .log-item { margin-bottom: 6px; line-height: 1.4; border-bottom: 1px dashed #1e293b; padding-bottom: 4px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2 id="project-title">🏛️ ESP32 Sa Ban Mock Dashboard</h2>
          <span class="status-badge">● ONLINE & WAITING FOR APP</span>
        </div>

        <div class="board">
          <h3 style="margin:0; color:#e2e8f0;">💡 Trạng Thái Đèn Sa Bàn Real-time</h3>
          <div id="led-grid" class="led-grid">
            <div style="color:#94a3b8; grid-column: 1/-1; text-align:center;">Đang tải danh sách không gian sa bàn từ Cloud...</div>
          </div>
        </div>

        <h3>📝 Nhật Ký Lệnh Từ App:</h3>
        <div id="logs"></div>
      </div>

      <script>
        const logDiv = document.getElementById('logs');
        const gridDiv = document.getElementById('led-grid');
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const ws = new WebSocket(protocol + '//' + window.location.host);

        // Tải danh sách phòng động từ API /config
        fetch('/config')
          .then(res => res.json())
          .then(data => {
            if (data.project_info && data.project_info.name) {
              document.getElementById('project-title').innerText = '🏛️ ' + data.project_info.name;
            }
            if (data.d && Array.isArray(data.d)) {
              gridDiv.innerHTML = '';
              data.d.forEach(row => {
                const roomName = row[2];
                const rType = row[3];
                const hwIdx = row[4];
                
                let icon = '🏠';
                if (rType === 100) icon = '🏬';
                else if (rType >= 200 && rType < 300) icon = '💅';
                else if (rType === 5) icon = '🏰';
                else if (rType === 6) icon = '🏢';

                const card = document.createElement('div');
                card.id = 'card-' + hwIdx;
                card.className = 'led-card';
                card.innerHTML = \`<div class="led-icon">\${icon}</div><div class="led-label">\${roomName} (\${hwIdx})</div>\`;
                gridDiv.appendChild(card);
              });
            }
          })
          .catch(e => console.error('Lỗi nạp config:', e));

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