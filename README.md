# Video Conferencing & Collaboration Suite

This is a real-time video conferencing application built with Next.js, WebRTC, and Socket.io. It features a collaborative whiteboard powered by WebRTC Data Channels, enabling seamless communication and visual brainstorming in a single interface.

## 🚀 Key Features

- **Real-time Video & Audio**: Low-latency communication using WebRTC peer-to-peer connections.
- **Collaborative Whiteboard**: Synchronized drawing area using RTCDataChannel for high-performance syncing.
- **Instant Messaging Signaling**: Real-time user discovery and call management via Socket.io.
- **Custom Signaling Server**: Integrated Express-based signaling server for robust connection handling.
- **Premium UI/UX**: Modern, glassmorphic design optimized for clarity and performance.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Real-time Communication**: [WebRTC](https://webrtc.org/)
- **Signaling & WebSockets**: [Socket.io](https://socket.io/)
- **Server**: [Express.js](https://expressjs.com/)
- **Styling**: Vanilla CSS (Custom Design System)
- **Language**: JavaScript (ES6+)

## 🌐 Deployment (Professional Setup)

To avoid the "cold start" screen on free hosting, this project is optimized for a split deployment:

### 1. Frontend (UI) - https://video-conferencing-website-two.vercel.app
- Import the repository into Vercel.
- Add an Environment Variable: 
  - `NEXT_PUBLIC_BACKEND_URL`: https://video-conferencing-website-ln0t.onrender.com.
- **Why?** Vercel provides instant loading for the UI, while Render handles the persistent Socket.io connections.

### 2. Backend (Signaling Server)
- Create a **Web Service** on Render.
- Build Command: `npm install && npm run build`
- Start Command: `npm run start`

---
*Created by Shaikh Wahid*
