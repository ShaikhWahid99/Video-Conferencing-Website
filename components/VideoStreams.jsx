"use client";

import React from "react";

export default function VideoStreams({ localVideoRef, remoteVideoRef, isCallActive, endCall, caller, socketRef }) {
  return (
    <div className="video-streams-container">
      <div className="video-grid">
        <div className="video-wrapper local-video">
          <video ref={localVideoRef} autoPlay muted playsInline />
          <div className="video-label">You</div>
        </div>
        <div className={`video-wrapper remote-video ${isCallActive ? 'active' : 'waiting'}`}>
          <video ref={remoteVideoRef} autoPlay playsInline />
          {!isCallActive && <div className="video-placeholder">Waiting for connection...</div>}
          {isCallActive && <div className="video-label">Remote Stream</div>}
        </div>
      </div>

      {isCallActive && (
        <div className="call-controls">
          <button
            type="button"
            className="end-call-btn"
            aria-label="End call"
            onClick={() => socketRef.current?.emit("call-ended", caller)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 9C10.16 9 8.35 9.3 6.67 9.87C6.01 10.08 5.48 10.51 5.15 11.08L4 12.35C3.76 12.63 3.65 13.01 3.73 13.38L4.54 17.5C4.64 18.06 5.11 18.48 5.68 18.48C9.53 18.48 13.1 17.29 16.03 15.28C16.48 14.97 16.73 14.47 16.73 13.93V11.23C16.4 10.66 15.87 10.23 15.21 10.02C14.18 9.69 13.11 9.4 12 9Z" fill="currentColor"/>
            </svg>
            <span>End Call</span>
          </button>
        </div>
      )}
    </div>
  );
}
