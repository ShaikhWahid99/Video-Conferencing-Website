"use client";

import React from "react";

export default function Whiteboard({ 
  whiteboardRef, 
  startDrawing, 
  draw, 
  stopDrawing, 
  tool, 
  setTool, 
  color, 
  setColor, 
  clearWhiteboard, 
  sendWhiteboardData,
  isVisible,
  toggleVisible
}) {
  if (!isVisible) {
    return (
      <button 
        className="show-whiteboard-btn" 
        onClick={toggleVisible}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM11 12V9H13V12H16V14H13V17H11V14H8V12H11Z" fill="currentColor"/>
        </svg>
        <span>Show Whiteboard</span>
      </button>
    );
  }

  return (
    <div className="whiteboard-wrapper glassmorphism">
      <div className="whiteboard-header">
        <h3>Collaborative Whiteboard</h3>
        <button className="icon-btn" onClick={toggleVisible} title="Hide Whiteboard">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
          </svg>
        </button>
      </div>
      
      <div className="canvas-container">
        <canvas
          ref={whiteboardRef}
          width="800"
          height="450"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>

      <div className="whiteboard-toolbar">
        <div className="tool-group">
          <button
            type="button"
            className={`tool-btn ${tool === "pencil" ? "active" : ""}`}
            onClick={() => setTool("pencil")}
            title="Pencil"
          >
            ✏️
          </button>
          <button
            type="button"
            className={`tool-btn ${tool === "eraser" ? "active" : ""}`}
            onClick={() => setTool("eraser")}
            title="Eraser"
          >
            🧽
          </button>
        </div>

        <div className="color-picker-wrapper">
          <input
            type="color"
            className="color-picker"
            aria-label="Pick color"
            value={color}
            onChange={(event) => setColor(event.target.value)}
          />
        </div>

        <button
          className="clear-btn"
          type="button"
          onClick={() => {
            clearWhiteboard();
            sendWhiteboardData({ type: "clear" });
          }}
        >
          Clear All
        </button>
      </div>
    </div>
  );
}
