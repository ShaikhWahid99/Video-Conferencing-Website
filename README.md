# NEXUS - Professional Video Conferencing & Collaboration Suite

NEXUS is a high-performance, real-time video conferencing application built with Next.js, WebRTC, and Socket.io. It features a collaborative whiteboard powered by WebRTC Data Channels, enabling seamless communication and visual brainstorming in a single interface.

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

## 🏁 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ShaikhWahid99/ShaikhWahid99-CodeAlpha_Video-Conferencing-Website.git
   cd ShaikhWahid99-CodeAlpha_Video-Conferencing-Website
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:8000](http://localhost:8000) in your browser.

## 📡 Architecture Overview

The application uses a custom Next.js server setup. The `server.js` file handles both the Next.js request processing and the Socket.io signaling server. WebRTC is used for the heavy lifting of video/audio and data channel synchronization, ensuring a scalable and low-latency experience.

---
*Created by Shaikh Wahid for CodeAlpha*
