<div align="center">

```
██████╗  ██████╗  ██████╗ ███╗   ███╗ ██████╗██╗  ██╗ █████╗ ████████╗
██╔══██╗██╔═══██╗██╔═══██╗████╗ ████║██╔════╝██║  ██║██╔══██╗╚══██╔══╝
██████╔╝██║   ██║██║   ██║██╔████╔██║██║     ███████║███████║   ██║
██╔══██╗██║   ██║██║   ██║██║╚██╔╝██║██║     ██╔══██║██╔══██║   ██║
██║  ██║╚██████╔╝╚██████╔╝██║ ╚═╝ ██║╚██████╗██║  ██║██║  ██║   ██║
╚═╝  ╚═╝ ╚═════╝  ╚═════╝ ╚═╝     ╚═╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝
```

**Private. Ephemeral. No accounts.**

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![WebSocket](https://img.shields.io/badge/WebSocket-010101?style=flat-square&logo=socket.io&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)

</div>

---

## What is RoomChat?

RoomChat is a **real-time, room-based chat application** built with WebSockets. No sign-up, no history, no tracking. You create a room, get a 6-character code, share it — and anyone with that code can join and chat privately in real time.

When everyone leaves, the room is gone. Forever.

---

## Demo flow

```
User A                          Server                        User B
  |                               |                               |
  |──── create room (ABC123) ────>|                               |
  |<─── joined room ABC123 ───────|                               |
  |                               |<──── join room (ABC123) ──────|
  |                               |───── joined room ABC123 ─────>|
  |──── "hey!" ──────────────────>|                               |
  |                               |───── "hey!" ─────────────────>|
  |                               |                               |
  |   [disconnects]               |                               |
  |──── socket.close() ──────────>|                               |
  |                               |── removed from allSockets ────|
```

---

## Features

| Feature | Description |
|---|---|
| Create a room | Generates a unique 6-character room code instantly |
| Join a room | Enter any code to join an existing room |
| Real-time messaging | Messages delivered instantly via WebSocket |
| Room isolation | Messages are only visible inside the same room |
| Self-render | Your own messages appear immediately without server echo |
| Disconnect cleanup | Leaving a room removes you from the server automatically |
| Copy room code | One-click copy to share with others |
| No accounts | Zero sign-up, zero persistence, zero tracking |
| Auto-scroll | Chat view scrolls to latest message automatically |
| Enter key support | Send messages and join rooms with Enter key |

---

## Tech stack

```
Frontend                          Backend
─────────────────────────         ─────────────────────────
React 18 + TypeScript             Node.js + TypeScript
Vite (dev server + build)         ws (WebSocketServer)
Tailwind CSS v4                   Pure WebSocket — no Express
useRef (WebSocket + input)        Room-based socket routing
useState (messages, screen)       In-memory user list
```

---

## Project structure

```
roomchat/
├── frontend/
│   ├── src/
│   │   ├── App.tsx          ← all UI + WebSocket logic
│   │   ├── main.tsx
│   │   └── index.css        ← tailwind import
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
└── backend/
    ├── src/
    │   └── index.ts         ← WebSocket server + room routing
    ├── tsconfig.json
    └── package.json
```

---

## Getting started

### 1. Clone and install

```bash
# backend
cd backend
npm install

# frontend
cd frontend
npm install
```

### 2. Run the backend

```bash
cd backend
npx ts-node src/index.ts
```

You should see:
```
WebSocket server running on ws://localhost:8080
```

### 3. Run the frontend

```bash
cd frontend
npm run dev
```

Open `http://localhost:5173` in your browser.

### 4. Test with multiple tabs

Open two browser tabs. In one tab, create a room and copy the code. In the other tab, paste the code and join. Send a message — it appears instantly in both tabs.

---

## Planned features

- [ ] Redis pub/sub for multi-server scaling
- [ ] Username prompt on room entry
- [ ] Room expiry after inactivity
- [ ] Message timestamps
- [ ] Online user count per room

---

## License

MIT — do whatever you want with it.

---

<div align="center">
  Built with Node.js, React, and WebSockets &nbsp;·&nbsp; No database. No accounts. Just chat.
</div>
