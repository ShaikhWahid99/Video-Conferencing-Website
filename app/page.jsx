"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import ContactsList from "../components/ContactsList";
import VideoStreams from "../components/VideoStreams";
import Whiteboard from "../components/Whiteboard";

const peerConfig = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export default function Home() {
  const [username, setUsername] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [users, setUsers] = useState({});
  const [caller, setCaller] = useState([]);
  const [isCallActive, setIsCallActive] = useState(false);
  const [tool, setTool] = useState("pencil");
  const [color, setColor] = useState("#4f46e5");
  const [isWhiteboardVisible, setIsWhiteboardVisible] = useState(false);

  const socketRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const whiteboardChannelRef = useRef(null);
  const whiteboardRef = useRef(null);
  const whiteboardContextRef = useRef(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef({ x: 0, y: 0 });
  const toolRef = useRef(tool);
  const colorRef = useRef(color);

  useEffect(() => { toolRef.current = tool; }, [tool]);
  useEffect(() => { colorRef.current = color; }, [color]);

  const clearWhiteboard = useCallback(() => {
    const canvas = whiteboardRef.current;
    const context = whiteboardContextRef.current;
    if (!canvas || !context) return;
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const drawLine = useCallback((x0, y0, x1, y1, lineColor, lineWidth) => {
    const context = whiteboardContextRef.current;
    if (!context) return;
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = lineColor;
    context.lineWidth = lineWidth;
    context.stroke();
    context.closePath();
  }, []);

  const handleWhiteboardData = useCallback((data) => {
    if (data.type === "draw") {
      drawLine(data.x0, data.y0, data.x1, data.y1, data.color, data.lineWidth);
    }
    if (data.type === "clear") clearWhiteboard();
  }, [clearWhiteboard, drawLine]);

  const setupWhiteboardChannel = useCallback((channel) => {
    whiteboardChannelRef.current = channel;
    channel.onmessage = (event) => {
      try { handleWhiteboardData(JSON.parse(event.data)); }
      catch (error) { console.error("Whiteboard data error:", error); }
    };
  }, [handleWhiteboardData]);

  const getPeerConnection = useCallback(() => {
    if (peerConnectionRef.current) return peerConnectionRef.current;

    const pc = new RTCPeerConnection(peerConfig);
    const channel = pc.createDataChannel("whiteboard");
    setupWhiteboardChannel(channel);

    pc.ondatachannel = (e) => {
      if (e.channel.label === "whiteboard") setupWhiteboardChannel(e.channel);
    };

    localStreamRef.current?.getTracks().forEach((t) => pc.addTrack(t, localStreamRef.current));

    pc.ontrack = (e) => {
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = e.streams[0];
    };

    pc.onicecandidate = (e) => {
      if (e.candidate) socketRef.current?.emit("icecandidate", e.candidate);
    };

    peerConnectionRef.current = pc;
    return pc;
  }, [setupWhiteboardChannel]);

  const sendWhiteboardData = useCallback((data) => {
    const ch = whiteboardChannelRef.current;
    if (ch?.readyState === "open") ch.send(JSON.stringify(data));
  }, []);

  const endCall = useCallback(() => {
    whiteboardChannelRef.current?.close();
    whiteboardChannelRef.current = null;
    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;
    if (remoteVideoRef.current?.srcObject) {
      remoteVideoRef.current.srcObject.getTracks().forEach((t) => t.stop());
      remoteVideoRef.current.srcObject = null;
    }
    clearWhiteboard();
    setIsCallActive(false);
  }, [clearWhiteboard]);

  const joinUser = () => {
    const name = username.trim();
    if (!name) return;
    socketRef.current?.emit("join-user", name);
    setIsJoined(true);
  };

  const startCall = async (user) => {
    const pc = getPeerConnection();
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socketRef.current?.emit("offer", { from: username, to: user, offer: pc.localDescription });
  };

  useEffect(() => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
    const socket = io(backendUrl);

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected to signaling server");
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from signaling server");
      setIsConnected(false);
    });

    socket.on("joined", setUsers);
    socket.on("offer", async ({ from, to, offer }) => {
      const pc = getPeerConnection();
      await pc.setRemoteDescription(offer);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("answer", { from, to, answer: pc.localDescription });
      setCaller([from, to]);
    });
    socket.on("answer", async ({ from, to, answer }) => {
      const pc = getPeerConnection();
      await pc.setRemoteDescription(answer);
      socket.emit("end-call", { from, to });
      setCaller([from, to]);
      setIsCallActive(true);
    });
    socket.on("icecandidate", async (c) => {
      const pc = getPeerConnection();
      await pc.addIceCandidate(new RTCIceCandidate(c));
    });
    socket.on("end-call", () => setIsCallActive(true));
    socket.on("call-ended", endCall);

    return () => {
      socket.disconnect();
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      endCall();
    };
  }, [endCall, getPeerConnection, username]);

  useEffect(() => {
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Media error:", err);
      }
    })();
  }, [isJoined]); 

  useEffect(() => {
    if (isJoined && localStreamRef.current && localVideoRef.current && !localVideoRef.current.srcObject) {
      localVideoRef.current.srcObject = localStreamRef.current;
    }
  }, [isJoined]);

  useEffect(() => {
    const canvas = whiteboardRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    whiteboardContextRef.current = ctx;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = 2;
    clearWhiteboard();
  }, [clearWhiteboard, isWhiteboardVisible]);

  const getCanvasPoint = (e) => {
    const cvs = whiteboardRef.current;
    const rect = cvs.getBoundingClientRect();
    const ptr = e.touches?.[0] ?? e;
    return {
      x: (ptr.clientX - rect.left) * (cvs.width / rect.width),
      y: (ptr.clientY - rect.top) * (cvs.height / rect.height),
    };
  };

  const startDrawing = (e) => {
    isDrawingRef.current = true;
    lastPointRef.current = getCanvasPoint(e);
  };

  const draw = (e) => {
    if (!isDrawingRef.current) return;
    if (e.cancelable) e.preventDefault();
    const curr = getCanvasPoint(e);
    const prev = lastPointRef.current;
    const isEraser = toolRef.current === "eraser";
    const colorVal = isEraser ? "#FFFFFF" : colorRef.current;
    const width = isEraser ? 20 : 2;

    drawLine(prev.x, prev.y, curr.x, curr.y, colorVal, width);
    sendWhiteboardData({ type: "draw", x0: prev.x, y0: prev.y, x1: curr.x, y1: curr.y, color: colorVal, lineWidth: width });
    lastPointRef.current = curr;
  };

  const stopDrawing = () => { isDrawingRef.current = false; };

  if (!isJoined) {
    return (
      <main className="landing-page">
        <div className="login-card glassmorphism">
          <h1 className="h-font title-gradient">NEXUS</h1>
          <p>Professional Video Conferencing & Collaboration</p>

          {!isConnected && (
            <div className="status-badge connecting">
              <span className="dot pulse"></span>
              Connecting to signaling server...
            </div>
          )}

          {isConnected && (
            <div className="status-badge ready">
              <span className="dot"></span>
              Server Ready
            </div>
          )}

          <div className="login-form">
            <input
              value={username}
              type="text"
              placeholder="Enter your name"
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && joinUser()}
            />
            <button className="primary-btn" onClick={joinUser}>Join Workspace</button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="app-container">
      <ContactsList users={users} username={username} startCall={startCall} />

      <section className="main-content">
        <header className="app-header">
          <h2 className="title-gradient h-font">Workspace</h2>
        </header>

        <VideoStreams
          localVideoRef={localVideoRef}
          remoteVideoRef={remoteVideoRef}
          isCallActive={isCallActive}
          endCall={endCall}
          caller={caller}
          socketRef={socketRef}
          username={username}
        />

        <Whiteboard
          whiteboardRef={whiteboardRef}
          startDrawing={startDrawing}
          draw={draw}
          stopDrawing={stopDrawing}
          tool={tool}
          setTool={setTool}
          color={color}
          setColor={setColor}
          clearWhiteboard={clearWhiteboard}
          sendWhiteboardData={sendWhiteboardData}
          isVisible={isWhiteboardVisible}
          toggleVisible={() => setIsWhiteboardVisible(!isWhiteboardVisible)}
        />
      </section>
    </main>
  );
}
