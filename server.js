// // const express = require('express');
// // const http = require('http');
// // const WebSocket = require('ws');

// // const app = express();
// // const port = process.env.PORT || 3000;

// // const server = http.createServer(app);
// // const wss = new WebSocket.Server({ server });

// // // Link GitHub Gist Raw chứa cấu hình chuẩn mà script Python đẩy lên
// // const GIST_RAW_URL = 'https://gist.githubusercontent.com/nguyenvandungvtdt-commits/b3440aa5a5ab9e6e69bb570b389c88cb/raw/config.json';

// // // 🟢 1. API CẤU HÌNH: LẤY TRỰC TIẾP TỪ GITHUB GIST ĐỂ ĐỒNG BỘ NGUYÊN BẢN
// // app.get('/config', async (req, res) => {
// //   try {
// //     const response = await fetch(`${GIST_RAW_URL}?t=${Date.now()}`);
// //     if (response.ok) {
// //       const data = await response.json();
// //       return res.json(data);
// //     }
// //   } catch (e) {
// //     console.error('Lỗi tải Gist từ Server:', e);
// //   }

// //   // Fallback nếu Gist bị nghẽn
// //   res.json({
// //     "project_info": { "name": "Dự Án Sa Bàn Tòa Nhà" },
// //     "d": [
// //       ["THÁP A", "TẦNG 01", "Shophouse-A101", 100, 0, "Shophouse khối đế | Thương mại dịch vụ"],
// //       ["THÁP A", "TẦNG 01", "Shophouse-A102", 100, 1, "Shophouse khối đế | Thương mại dịch vụ"],
// //       ["THÁP A", "TẦNG 01", "Shophouse-A103", 100, 2, "Shophouse khối đế | Thương mại dịch vụ"],
// //       ["THÁP A", "TẦNG 01", "Sảnh AB", 200, 3, "Sảnh Tòa Nhà"],
// //       ["THÁP A", "TẦNG 02", "BeautySalon A", 201, 4, "BeautySalon"],
// //       ["THÁP A", "TẦNG 02", "Gym-SHCĐ A", 202, 5, "Gym / SHCĐ"],
// //       ["THÁP A", "TẦNG 02", "Game", 203, 6, "Khu Game"],
// //       ["THÁP A", "TẦNG 02", "Meeting AB", 204, 7, "Phòng Lấy Ý Kiến / Trực"],
// //       ["THÁP A", "TẦNG 03", "A301-2BR", 2, 8, "Căn hộ 2 Phòng ngủ | Sẵn sàng điều khiển"],
// //       ["THÁP A", "TẦNG 03", "A302-3BR", 3, 9, "Căn hộ 3 Phòng ngủ | Sẵn sàng điều khiển"]
// //     ]
// //   });
// // });

// // // 🟢 2. TRANG WEB DASHBOARD CHO APPLE REVIEWER (TỰ ĐỘNG LẤY NÚT BẤM TỪ GIST)
// // app.get('/', (req, res) => {
// //   res.send(`
// //     <!DOCTYPE html>
// //     <html lang="vi">
// //     <head>
// //       <title>ESP32 Sa Ban - Live Mock Dashboard</title>
// //       <meta charset="utf-8">
// //       <meta name="viewport" content="width=device-width, initial-scale=1">
// //       <style>
// //         body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; background: #0f172a; color: #f8fafc; margin: 0; }
// //         .container { max-width: 1000px; margin: 0 auto; }
// //         .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #334155; padding-bottom: 15px; }
// //         .status-badge { padding: 6px 14px; background: #166534; color: #4ade80; border-radius: 20px; font-weight: bold; font-size: 13px; }
        
// //         .board { background: #1e293b; border-radius: 16px; padding: 24px; margin: 20px 0; border: 1px solid #334155; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3); }
// //         .led-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 14px; margin-top: 20px; }
        
// //         .led-card { background: #0f172a; border-radius: 12px; padding: 16px 8px; text-align: center; border: 1px solid #334155; transition: all 0.3s ease; }
// //         .led-icon { font-size: 38px; filter: grayscale(100%) opacity(0.25); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
// //         .led-card.active { border-color: #f59e0b; background: #1e1b4b; }
// //         .led-card.active .led-icon { filter: grayscale(0%) opacity(1); transform: scale(1.1); drop-shadow: 0 0 18px #f59e0b; }
// //         .led-label { font-size: 12px; font-weight: 600; margin-top: 8px; color: #94a3b8; word-break: break-word; }
// //         .led-card.active .led-label { color: #fef08a; }

// //         #logs { background: #020617; border: 1px solid #1e293b; height: 180px; overflow-y: auto; padding: 14px; font-family: 'Courier New', monospace; border-radius: 10px; font-size: 12px; color: #38bdf8; }
// //         .log-item { margin-bottom: 6px; line-height: 1.4; border-bottom: 1px dashed #1e293b; padding-bottom: 4px; }
// //       </style>
// //     </head>
// //     <body>
// //       <div class="container">
// //         <div class="header">
// //           <h2 id="project-title">🏛️ ESP32 Sa Ban Mock Dashboard</h2>
// //           <span class="status-badge">● ONLINE & WAITING FOR APP</span>
// //         </div>

// //         <div class="board">
// //           <h3 style="margin:0; color:#e2e8f0;">💡 Trạng Thái Đèn Sa Bàn Real-time</h3>
// //           <div id="led-grid" class="led-grid">
// //             <div style="color:#94a3b8; grid-column: 1/-1; text-align:center;">Đang tải danh sách không gian sa bàn từ Cloud...</div>
// //           </div>
// //         </div>

// //         <h3>📝 Nhật Ký Lệnh Từ App:</h3>
// //         <div id="logs"></div>
// //       </div>

// //       <script>
// //         const logDiv = document.getElementById('logs');
// //         const gridDiv = document.getElementById('led-grid');
// //         const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
// //         const ws = new WebSocket(protocol + '//' + window.location.host);

// //         // Tải danh sách phòng động từ API /config
// //         fetch('/config')
// //           .then(res => res.json())
// //           .then(data => {
// //             if (data.project_info && data.project_info.name) {
// //               document.getElementById('project-title').innerText = '🏛️ ' + data.project_info.name;
// //             }
// //             if (data.d && Array.isArray(data.d)) {
// //               gridDiv.innerHTML = '';
// //               data.d.forEach(row => {
// //                 const roomName = row[2];
// //                 const rType = row[3];
// //                 const hwIdx = row[4];
                
// //                 let icon = '🏠';
// //                 if (rType === 100) icon = '🏬';
// //                 else if (rType >= 200 && rType < 300) icon = '💅';
// //                 else if (rType === 5) icon = '🏰';
// //                 else if (rType === 6) icon = '🏢';

// //                 const card = document.createElement('div');
// //                 card.id = 'card-' + hwIdx;
// //                 card.className = 'led-card';
// //                 card.innerHTML = \`<div class="led-icon">\${icon}</div><div class="led-label">\${roomName} (\${hwIdx})</div>\`;
// //                 gridDiv.appendChild(card);
// //               });
// //             }
// //           })
// //           .catch(e => console.error('Lỗi nạp config:', e));

// //         ws.onmessage = (event) => {
// //           const dataStr = event.data;
          
// //           const item = document.createElement('div');
// //           item.className = 'log-item';
// //           item.innerText = \`[\${new Date().toLocaleTimeString()}] RECV: \${dataStr}\`;
// //           logDiv.appendChild(item);
// //           logDiv.scrollTop = logDiv.scrollHeight;

// //           try {
// //             const data = JSON.parse(dataStr);
// //             const ids = data.leds || data.pins || (data.hardwareIndex !== undefined ? [data.hardwareIndex] : []) || (data.led !== undefined ? [data.led] : []);
// //             const state = data.state ?? data.status === 'ON' ?? data.value === 1 ?? true;

// //             if (ids.length > 0) {
// //               ids.forEach(id => updateLed(id, state));
// //             } else {
// //               document.querySelectorAll('.led-card').forEach(el => {
// //                 if (state) el.classList.add('active');
// //                 else el.classList.remove('active');
// //               });
// //             }
// //           } catch(e) {
// //             document.querySelectorAll('.led-card').forEach(el => {
// //               const cardId = el.id.replace('card-', '');
// //               if (dataStr.includes(cardId) || dataStr.includes('ON') || dataStr.includes('ALL')) {
// //                 if (dataStr.includes('OFF')) el.classList.remove('active');
// //                 else el.classList.add('active');
// //               }
// //             });
// //           }
// //         };

// //         function updateLed(id, isOn) {
// //           const card = document.getElementById('card-' + id);
// //           if (card) {
// //             if (isOn) card.classList.add('active');
// //             else card.classList.remove('active');
// //           }
// //         }
// //       </script>
// //     </body>
// //     </html>
// //   `);
// // });

// // wss.on('connection', (ws) => {
// //   console.log('App connected!');
// //   ws.send(JSON.stringify({ status: "connected", device: "ESP32_MOCK_SERVER" }));

// //   ws.on('message', (message) => {
// //     const rawData = message.toString();
// //     wss.clients.forEach(client => {
// //       if (client.readyState === WebSocket.OPEN) {
// //         client.send(rawData);
// //       }
// //     });
// //   });
// // });

// // server.listen(port, () => console.log(`Server listening on port ${port}`));


// const express = require('express');
// const http = require('http');
// const https = require('https');
// const WebSocket = require('ws');

// const app = express();
// const port = process.env.PORT || 3000;

// const server = http.createServer(app);
// const wss = new WebSocket.Server({ server });

// // Link Gist chứa cấu hình chuẩn
// const GIST_RAW_URL = 'https://gist.githubusercontent.com/nguyenvandungvtdt-commits/b3440aa5a5ab9e6e69bb570b389c88cb/raw/config.json';

// // 🟢 1. API TRA LẠI CONFIG TỪ GIST
// app.get('/config', (req, res) => {
//   const gistUrl = `${GIST_RAW_URL}?t=${Date.now()}`;
//   https.get(gistUrl, (response) => {
//     let data = '';
//     response.on('data', (chunk) => { data += chunk; });
//     response.on('end', () => {
//       try {
//         const jsonConfig = JSON.parse(data);
//         res.setHeader('Access-Control-Allow-Origin', '*');
//         res.json(jsonConfig);
//       } catch (e) {
//         res.status(500).json({ error: "Lỗi parse JSON" });
//       }
//     });
//   }).on('error', () => {
//     res.status(500).json({ error: "Lỗi kết nối Gist" });
//   });
// });

// // 🟢 2. DASHBOARD MẶT BẰNG TÒA NHÀ REAL-TIME CHO WEBSOCKET DEMO
// app.get('/', (req, res) => {
//   res.send(`
//     <!DOCTYPE html>
//     <html lang="vi">
//     <head>
//       <title>Sa Bàn Demo - Live Control Dashboard</title>
//       <meta charset="utf-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1">
//       <style>
//         body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 15px; background: #0f172a; color: #f8fafc; margin: 0; }
//         .container { max-width: 1200px; margin: 0 auto; }
        
//         .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #334155; padding-bottom: 12px; margin-bottom: 15px; }
//         .status-badge { padding: 4px 12px; background: #166534; color: #4ade80; border-radius: 20px; font-weight: bold; font-size: 12px; }

//         /* BẢNG ĐIỀU KHIỂN NHÓM KIỂU FLUTTER APP */
//         .app-controls { background: #1e293b; border-radius: 14px; padding: 15px; margin-bottom: 20px; border: 1px solid #0284c7; text-align: center; }
//         .ctrl-title { color: #38bdf8; font-size: 13px; font-weight: bold; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
//         .btn-group { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-bottom: 12px; }
//         .btn-cmd { background: #f97316; color: white; border: none; padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: bold; cursor: pointer; transition: 0.2s; }
//         .btn-cmd:hover { background: #ea580c; transform: translateY(-1px); }
//         .btn-master { background: #0284c7; font-size: 13px; padding: 8px 20px; border-radius: 20px; }

//         /* KHU VỰC HIỂN THỊ CÁC TÒA NHÀ DẠNG TẦNG CHUẨN (TẦNG 1 Ở DƯỚI CÙNG) */
//         .buildings-flex { display: flex; gap: 15px; overflow-x: auto; padding-bottom: 10px; }
//         .building-col { flex: 1; min-width: 220px; background: #1e293b; border-radius: 12px; padding: 12px; border: 1px solid #334155; }
//         .building-header { text-align: center; font-weight: bold; color: #fef08a; padding-bottom: 8px; border-bottom: 1px solid #334155; margin-bottom: 10px; font-size: 14px; }
        
//         /* CỘT CÁC TẦNG - REVERSE ĐỂ TẦNG 1 NẰM Ở DƯỚI CÙNG */
//         .floors-stack { display: flex; flex-direction: column-reverse; gap: 6px; }
//         .floor-row { background: #0f172a; border-radius: 6px; padding: 6px; border: 1px solid #1e293b; }
//         .floor-name { font-size: 10px; color: #64748b; font-weight: bold; margin-bottom: 4px; text-transform: uppercase; }
        
//         .rooms-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(65px, 1fr)); gap: 5px; }
        
//         /* NÚT CĂN HỘ NHỎ GỌN TỐI ƯU */
//         .led-card { background: #1e293b; border-radius: 6px; padding: 6px 2px; text-align: center; border: 1px solid #334155; transition: all 0.2s; }
//         .led-icon { font-size: 16px; filter: grayscale(100%) opacity(0.3); }
//         .led-card.active { border-color: #f59e0b; background: #431407; box-shadow: 0 0 8px #f59e0b; }
//         .led-card.active .led-icon { filter: grayscale(0%) opacity(1); }
//         .led-label { font-size: 9px; font-weight: bold; color: #94a3b8; margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
//         .led-card.active .led-label { color: #fef08a; }

//         #logs { background: #020617; border: 1px solid #1e293b; height: 120px; overflow-y: auto; padding: 10px; font-family: monospace; border-radius: 8px; font-size: 11px; color: #38bdf8; }
//         .log-item { margin-bottom: 3px; }
//       </style>
//     </head>
//     <body>
//       <div class="container">
//         <div class="header">
//           <h3 id="project-title" style="margin:0;">🏛️ Sa Bàn Tòa Nhà (Real-time Demo)</h3>
//           <span class="status-badge">● KẾT NỐI SẴN SÀNG</span>
//         </div>

//         <!-- THIẾT KẾ BẢNG ĐIỀU KHIỂN GIỐNG FLUTTER APP -->
//         <div class="app-controls">
//           <button class="btn-cmd btn-master" onclick="sendCmd('ALL:1')">💡 TỔNG SA BÀN (BẬT)</button>
//           <button class="btn-cmd btn-master" style="background:#ef4444;" onclick="sendCmd('ALL:0')">🔌 TẮT TẤT CẢ</button>
//           <div style="height:10px;"></div>
//           <div class="ctrl-title">Tất Cả Các Phòng</div>
//           <div class="btn-group">
//             <button class="btn-cmd" onclick="sendCmd('TYPE:2:1')">2PN</button>
//             <button class="btn-cmd" onclick="sendCmd('TYPE:3:1')">3PN</button>
//             <button class="btn-cmd" onclick="sendCmd('TYPE:4:1')">4PN</button>
//             <button class="btn-cmd" onclick="sendCmd('TYPE:5:1')">PENTHOUSE</button>
//             <button class="btn-cmd" onclick="sendCmd('TYPE:6:1')">DUPLEX</button>
//           </div>
//           <div class="ctrl-title">Thương Mại Và Tiện Ích</div>
//           <div class="btn-group">
//             <button class="btn-cmd" style="background:#059669;" onclick="sendCmd('TYPE:100:1')">SHOPHOUSE</button>
//             <button class="btn-cmd" style="background:#059669;" onclick="sendCmd('TYPE:201:1')">BEAUTYSALON</button>
//             <button class="btn-cmd" style="background:#059669;" onclick="sendCmd('TYPE:202:1')">GYM-SHCĐ</button>
//             <button class="btn-cmd" style="background:#059669;" onclick="sendCmd('TYPE:203:1')">GAME</button>
//             <button class="btn-cmd" style="background:#059669;" onclick="sendCmd('TYPE:204:1')">MEETING</button>
//             <button class="btn-cmd" style="background:#059669;" onclick="sendCmd('TYPE:205:1')">CO-WORKING</button>
//             <button class="btn-cmd" style="background:#059669;" onclick="sendCmd('TYPE:206:1')">YOGA</button>
//           </div>
//         </div>

//         <!-- CÁC TÒA NHÀ ĐƯỢC XẾP THEO TẦNG 1 Ở DƯỚI CÙNG -->
//         <div id="buildings-container" class="buildings-flex">
//           <div style="color:#94a3b8; text-align:center; width:100%;">Đang nạp sơ đồ mặt bằng sa bàn...</div>
//         </div>

//         <h4 style="margin: 15px 0 5px 0;">📝 Nhật Ký Lệnh Từ App / Web:</h4>
//         <div id="logs"></div>
//       </div>

//       <script>
//         const logDiv = document.getElementById('logs');
//         const container = document.getElementById('buildings-container');
//         const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
//         const ws = new WebSocket(protocol + '//' + window.location.host);

//         function sendCmd(cmd) {
//           ws.send(cmd);
//         }

//         fetch('/config')
//           .then(res => res.json())
//           .then(data => {
//             if (data.project_info && data.project_info.name) {
//               document.getElementById('project-title').innerText = '🏛️ ' + data.project_info.name;
//             }
//             if (data.d && Array.isArray(data.d)) {
//               renderBuildingLayout(data.d);
//             }
//           })
//           .catch(e => console.error(e));

//         function renderBuildingLayout(rows) {
//           // Nhóm data theo Tòa -> Tầng
//           const bMap = {};
//           rows.forEach(r => {
//             const b = r[0], f = r[1], room = r[2], type = r[3], hw = r[4];
//             if (!bMap[b]) bMap[b] = {};
//             if (!bMap[b][f]) bMap[b][f] = [];
//             bMap[b][f].push({ room, type, hw });
//           });

//           container.innerHTML = '';
//           Object.keys(bMap).forEach(bName => {
//             const col = document.createElement('div');
//             col.className = 'building-col';
            
//             let html = \`<div class="building-header">\${bName}</div><div class="floors-stack">\`;
            
//             Object.keys(bMap[bName]).forEach(fName => {
//               html += \`<div class="floor-row"><div class="floor-name">\${fName}</div><div class="rooms-grid">\`;
//               bMap[bName][fName].forEach(rm => {
//                 let icon = '🏠';
//                 if (rm.type === 100) icon = '🏬';
//                 else if (rm.type >= 200 && rm.type < 300) icon = '🏬';
//                 else if (rm.type === 5) icon = '🏰';
//                 else if (rm.type === 6) icon = '🏢';

//                 html += \`
//                   <div id="card-\${rm.hw}" class="led-card" data-hw="\${rm.hw}" data-type="\${rm.type}">
//                     <div class="led-icon">\${icon}</div>
//                     <div class="led-label" title="\${rm.room}">\${rm.room}</div>
//                   </div>\`;
//               });
//               html += \`</div></div>\`;
//             });

//             html += \`</div>\`;
//             col.innerHTML = html;
//             container.appendChild(col);
//           });
//         }

//         // ws.onmessage = (event) => {
//         //   const dataStr = event.data;
//         //   const item = document.createElement('div');
//         //   item.className = 'log-item';
//         //   item.innerText = \`[\${new Date().toLocaleTimeString()}] \${dataStr}\`;
//         //   logDiv.appendChild(item);
//         //   logDiv.scrollTop = logDiv.scrollHeight;

//         //   // Xử lý bật tắt đèn linh hoạt
//         //   if (dataStr.startsWith('ALL:')) {
//         //     const state = dataStr.endsWith('1');
//         //     document.querySelectorAll('.led-card').forEach(c => state ? c.classList.add('active') : c.classList.remove('active'));
//         //   } else if (dataStr.startsWith('TYPE:')) {
//         //     const parts = dataStr.split(':');
//         //     const type = parseInt(parts[1]);
//         //     const state = parts[2] === '1';
//         //     document.querySelectorAll('.led-card').forEach(c => {
//         //       if (parseInt(c.dataset.type) === type) {
//         //         state ? c.classList.add('active') : c.classList.remove('active');
//         //       }
//         //     });
//         //   } else {
//         //     try {
//         //       const data = JSON.parse(dataStr);
//         //       const ids = data.leds || (data.hardwareIndex !== undefined ? [data.hardwareIndex] : []) || [];
//         //       const state = data.state ?? true;
//         //       ids.forEach(id => {
//         //         const card = document.getElementById('card-' + id);
//         //         if (card) state ? card.classList.add('active') : card.classList.remove('active');
//         //       });
//         //     } catch(e) {
//         //       // Parse đơn giản dạng hardwareIndex:state (VD: "0:1")
//         //       if (dataStr.includes(':')) {
//         //         const [hw, st] = dataStr.split(':');
//         //         const card = document.getElementById('card-' + hw.trim());
//         //         if (card) st.trim() === '1' ? card.classList.add('active') : card.classList.remove('active');
//         //       }
//         //     }
//         //   }
//         // };
//       </script>
//     </body>
//     </html>
//   `);
// });

// wss.on('connection', (ws) => {
//   ws.send(JSON.stringify({ status: "connected", device: "ESP32_MOCK_SERVER" }));
//   ws.on('message', (message) => {
//     const rawData = message.toString();
//     wss.clients.forEach(client => {
//       if (client.readyState === WebSocket.OPEN) {
//         client.send(rawData);
//       }
//     });
//   });
// });

// server.listen(port, () => console.log(`Server running on port ${port}`));


const express = require('express');
const http = require('http');
const https = require('https');
const WebSocket = require('ws');

const app = express();
const port = process.env.PORT || 3000;

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Link Gist chứa cấu hình chuẩn
const GIST_RAW_URL = 'https://gist.githubusercontent.com/nguyenvandungvtdt-commits/b3440aa5a5ab9e6e69bb570b389c88cb/raw/config.json';

// 🟢 1. API TRẢ LẠI CONFIG TỪ GIST
app.get('/config', (req, res) => {
  const gistUrl = `${GIST_RAW_URL}?t=${Date.now()}`;
  https.get(gistUrl, (response) => {
    let data = '';
    response.on('data', (chunk) => { data += chunk; });
    response.on('end', () => {
      try {
        const jsonConfig = JSON.parse(data);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(jsonConfig);
      } catch (e) {
        res.status(500).json({ error: "Lỗi parse JSON" });
      }
    });
  }).on('error', () => {
    res.status(500).json({ error: "Lỗi kết nối Gist" });
  });
});

// 🟢 2. DASHBOARD MẶT BẰNG TÒA NHÀ REAL-TIME CHO WEBSOCKET DEMO
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <title>Sa Bàn Demo - Live Control Dashboard</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 15px; background: #0f172a; color: #f8fafc; margin: 0; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #334155; padding-bottom: 12px; margin-bottom: 15px; }
        .status-badge { padding: 4px 12px; background: #166534; color: #4ade80; border-radius: 20px; font-weight: bold; font-size: 12px; }

        .app-controls { background: #1e293b; border-radius: 14px; padding: 15px; margin-bottom: 20px; border: 1px solid #0284c7; text-align: center; }
        .ctrl-title { color: #38bdf8; font-size: 13px; font-weight: bold; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
        .btn-group { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-bottom: 12px; }
        .btn-cmd { background: #f97316; color: white; border: none; padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: bold; cursor: pointer; transition: 0.2s; }
        .btn-cmd:hover { background: #ea580c; transform: translateY(-1px); }
        .btn-master { background: #0284c7; font-size: 13px; padding: 8px 20px; border-radius: 20px; }

        .buildings-flex { display: flex; gap: 15px; overflow-x: auto; padding-bottom: 10px; }
        .building-col { flex: 1; min-width: 220px; background: #1e293b; border-radius: 12px; padding: 12px; border: 1px solid #334155; }
        .building-header { text-align: center; font-weight: bold; color: #fef08a; padding-bottom: 8px; border-bottom: 1px solid #334155; margin-bottom: 10px; font-size: 14px; }
        
        .floors-stack { display: flex; flex-direction: column-reverse; gap: 6px; }
        .floor-row { background: #0f172a; border-radius: 6px; padding: 6px; border: 1px solid #1e293b; }
        .floor-name { font-size: 10px; color: #64748b; font-weight: bold; margin-bottom: 4px; text-transform: uppercase; }
        
        .rooms-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(65px, 1fr)); gap: 5px; }
        
        .led-card { background: #1e293b; border-radius: 6px; padding: 6px 2px; text-align: center; border: 1px solid #334155; transition: all 0.2s; }
        .led-icon { font-size: 16px; filter: grayscale(100%) opacity(0.3); }
        .led-card.active { border-color: #f59e0b; background: #431407; box-shadow: 0 0 8px #f59e0b; }
        .led-card.active .led-icon { filter: grayscale(0%) opacity(1); }
        .led-label { font-size: 9px; font-weight: bold; color: #94a3b8; margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .led-card.active .led-label { color: #fef08a; }

        #logs { background: #020617; border: 1px solid #1e293b; height: 120px; overflow-y: auto; padding: 10px; font-family: monospace; border-radius: 8px; font-size: 11px; color: #38bdf8; }
        .log-item { margin-bottom: 3px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h3 id="project-title" style="margin:0;">🏛️ Sa Bàn Tòa Nhà (Real-time Demo)</h3>
          <span class="status-badge">● KẾT NỐI SẴN SÀNG</span>
        </div>

        <div class="app-controls">
          <button class="btn-cmd btn-master" onclick="sendCmd('ALL:1')">💡 TỔNG SA BÀN (BẬT)</button>
          <button class="btn-cmd btn-master" style="background:#ef4444;" onclick="sendCmd('ALL:0')">🔌 TẮT TẤT CẢ</button>
          <div style="height:10px;"></div>
          <div class="ctrl-title">Tất Cả Các Phòng</div>
          <div class="btn-group">
            <button class="btn-cmd" onclick="sendCmd('TYPE:2:1')">2PN</button>
            <button class="btn-cmd" onclick="sendCmd('TYPE:3:1')">3PN</button>
            <button class="btn-cmd" onclick="sendCmd('TYPE:4:1')">4PN</button>
            <button class="btn-cmd" onclick="sendCmd('TYPE:5:1')">PENTHOUSE</button>
            <button class="btn-cmd" onclick="sendCmd('TYPE:6:1')">DUPLEX</button>
          </div>
          <div class="ctrl-title">Thương Mại Và Tiện Ích</div>
          <div class="btn-group">
            <button class="btn-cmd" style="background:#059669;" onclick="sendCmd('TYPE:100:1')">SHOPHOUSE</button>
            <button class="btn-cmd" style="background:#059669;" onclick="sendCmd('TYPE:201:1')">BEAUTYSALON</button>
            <button class="btn-cmd" style="background:#059669;" onclick="sendCmd('TYPE:202:1')">GYM-SHCĐ</button>
            <button class="btn-cmd" style="background:#059669;" onclick="sendCmd('TYPE:203:1')">GAME</button>
            <button class="btn-cmd" style="background:#059669;" onclick="sendCmd('TYPE:204:1')">MEETING</button>
            <button class="btn-cmd" style="background:#059669;" onclick="sendCmd('TYPE:205:1')">CO-WORKING</button>
            <button class="btn-cmd" style="background:#059669;" onclick="sendCmd('TYPE:206:1')">YOGA</button>
          </div>
        </div>

        <div id="buildings-container" class="buildings-flex">
          <div style="color:#94a3b8; text-align:center; width:100%;">Đang nạp sơ đồ mặt bằng sa bàn...</div>
        </div>

        <h4 style="margin: 15px 0 5px 0;">📝 Nhật Ký Lệnh Từ App / Web:</h4>
        <div id="logs"></div>
      </div>

      <script>
        const logDiv = document.getElementById('logs');
        const container = document.getElementById('buildings-container');
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const ws = new WebSocket(protocol + '//' + window.location.host);

        function sendCmd(cmd) {
          ws.send(cmd);
        }

        fetch('/config')
          .then(res => res.json())
          .then(data => {
            if (data.project_info && data.project_info.name) {
              document.getElementById('project-title').innerText = '🏛️ ' + data.project_info.name;
            }
            if (data.d && Array.isArray(data.d)) {
              renderBuildingLayout(data.d);
            }
          })
          .catch(e => console.error(e));

        function renderBuildingLayout(rows) {
          const bMap = {};
          rows.forEach(r => {
            const b = r[0], f = r[1], room = r[2], type = r[3], hw = r[4];
            if (!bMap[b]) bMap[b] = {};
            if (!bMap[b][f]) bMap[b][f] = [];
            bMap[b][f].push({ room, type, hw });
          });

          container.innerHTML = '';
          Object.keys(bMap).forEach(bName => {
            const col = document.createElement('div');
            col.className = 'building-col';
            
            let html = '<div class="building-header">' + bName + '</div><div class="floors-stack">';
            
            Object.keys(bMap[bName]).forEach(fName => {
              html += '<div class="floor-row"><div class="floor-name">' + fName + '</div><div class="rooms-grid">';
              bMap[bName][fName].forEach(rm => {
                let icon = '🏠';
                if (rm.type === 100) icon = '🏬';
                else if (rm.type >= 200 && rm.type < 300) icon = '🏬';
                else if (rm.type === 5) icon = '🏰';
                else if (rm.type === 6) icon = '🏢';

                html += '<div id="card-' + rm.hw + '" class="led-card" data-hw="' + rm.hw + '" data-type="' + rm.type + '">' +
                        '<div class="led-icon">' + icon + '</div>' +
                        '<div class="led-label" title="' + rm.room + '">' + rm.room + '</div>' +
                        '</div>';
              });
              html += '</div></div>';
            });

            html += '</div>';
            col.innerHTML = html;
            container.appendChild(col);
          });
        }

        function updateLedCard(hwIndex, isOn) {
          const card = document.getElementById('card-' + hwIndex);
          if (card) {
            if (isOn) card.classList.add('active');
            else card.classList.remove('active');
          }
        }

        ws.onmessage = (event) => {
          const dataStr = event.data.toString().trim();
          
          // Ghi nhật ký vào khung Log trên Web
          const item = document.createElement('div');
          item.className = 'log-item';
          item.innerText = '[' + new Date().toLocaleTimeString() + '] ' + dataStr;
          logDiv.appendChild(item);
          logDiv.scrollTop = logDiv.scrollHeight;

          // 🟢 1. XỬ LÝ LỆNH DẠNG JSON TỪ APP FLUTTER
          try {
            const data = JSON.parse(dataStr);
            
            // Nếu là lệnh điều khiển 1 phòng đơn lẻ: {"hardwareIndex": 0, "state": true}
            if (data.hardwareIndex !== undefined) {
              const state = (data.state === true || data.state === 1 || data.status === 'ON');
              updateLedCard(data.hardwareIndex, state);
              return;
            }
            
            // Nếu là lệnh điều khiển nhóm LED: {"leds": [0,1,2], "state": true}
            const ids = data.leds || data.pins || [];
            if (ids.length > 0) {
              const state = (data.state === true || data.state === 1 || data.status === 'ON');
              ids.forEach(id => updateLedCard(id, state));
              return;
            }
          } catch(e) {
            // Không phải JSON -> Xử lý tiếp dạng String thô
          }

          // 🟢 2. XỬ LÝ LỆNH "ALL:1" HOẶC "ALL:0" HOẶC "ALL:BẬT" / "ALL:TẮT"
          if (dataStr.startsWith('ALL:') || dataStr.startsWith('TOGGLE_ALL')) {
            const isOff = dataStr.includes(':0') || dataStr.includes('OFF') || dataStr.includes('FALSE') || dataStr.includes('TẮT');
            const isOn = !isOff; // Nếu không chứa cờ tắt thì mặc định là Bật

            document.querySelectorAll('.led-card').forEach(c => {
              if (isOn) c.classList.add('active');
              else c.classList.remove('active');
            });
          } 
          // 🟢 3. XỬ LÝ LỆNH THEO PHÂN LOẠI PHÒNG (2PN, 3PN, SHOPHOUSE): "TYPE:2:1" HOẶC "TYPE:100:1"
          else if (dataStr.startsWith('TYPE:')) {
            const parts = dataStr.split(':');
            const type = parseInt(parts[1]);
            const isOff = parts[2] === '0' || parts[2] === 'false';
            const isOn = !isOff;

            document.querySelectorAll('.led-card').forEach(c => {
              if (parseInt(c.dataset.type) === type) {
                if (isOn) c.classList.add('active');
                else c.classList.remove('active');
              }
            });
          } 
          // 🟢 4. XỬ LÝ LỆNH CHUỖI ĐƠN LẺ: "0:1" (Bật LED 0) hoặc "0:0" (Tắt LED 0)
          else if (dataStr.includes(':')) {
            const parts = dataStr.split(':');
            const hwIndex = parts[0].trim();
            const stateStr = parts[1].trim();
            const isOn = (stateStr === '1' || stateStr.toLowerCase() === 'true' || stateStr.toUpperCase() === 'ON');
            updateLedCard(hwIndex, isOn);
          }
        };
      </script>
    </body>
    </html>
  `);
});

wss.on('connection', (ws) => {
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

server.listen(port, () => console.log(`Server running on port ${port}`));