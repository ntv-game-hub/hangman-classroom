# Hàng Ngang Bí Ẩn

Hàng Ngang Bí Ẩn là game hangman phòng học realtime. Host tạo phòng, đặt từ/cụm bí ẩn hoặc chọn ngẫu nhiên từ kho 1000 mục có gợi ý; người chơi vào bằng mã phòng/link, đoán từng chữ cái tiếng Việt hoặc đoán cả đáp án.

## Features

- Không cần đăng nhập/đăng ký.
- Realtime bằng Socket.IO.
- Tạo phòng bằng mã ngắn, join bằng danh sách phòng hoặc link `?code=XXXXX`.
- Unicode tiếng Việt theo grapheme, giữ đúng dấu khi đoán.
- Kho 1000 mục gợi ý sinh sẵn trong client.
- Hai chế độ: cả lớp cùng đoán tự do có cooldown, hoặc từng người một lượt.
- State chung cho cả lớp: chữ đã đoán, số lần sai còn lại, lịch sử đoán, điểm người chơi.
- Đoán cả từ đúng sẽ thắng ngay và nhận điểm bonus.
- Session host/player lưu tạm bằng `localStorage`.

## Tech Stack

- Frontend: React, TypeScript, Vite
- Backend: Node.js, Express, Socket.IO
- Tests: Vitest
- Process manager: PM2

## Install

```bash
npm install
```

## Development

```bash
npm run dev
```

Backend chạy ở port `6671`; Vite client dùng `VITE_SOCKET_URL=http://localhost:6671`.

## Build / Test

```bash
npm test
npm run typecheck
npm run build
```

## Run Production Locally

```bash
HOST=0.0.0.0 PORT=6671 npm start
```

Mở `http://localhost:6671`.

## PM2

```bash
npm run pm2:start
npm run pm2:restart
npm run pm2:logs
npm run pm2:stop
npm run pm2:delete
```

## Project Structure

```text
client/
  src/
    data/wordBank.ts
    screens/
    components/
    utils/
server/
  app.js
  socketHandlers.js
  lib/
shared/
  gameLogic.js
tests/
```
