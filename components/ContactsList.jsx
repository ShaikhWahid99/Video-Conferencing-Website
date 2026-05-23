"use client";

import React from "react";

export default function ContactsList({ users, username, startCall }) {
  const usersList = Object.keys(users);

  return (
    <aside className="contacts-sidebar">
      <div className="sidebar-header">
        <h2 className="h-font">Contacts</h2>
        <div className="user-badge">
          <span className="status-indicator"></span>
          <span className="current-username">{username} (You)</span>
        </div>
      </div>
      
      <ul className="contacts-list">
        {usersList.length <= 1 ? (
          <li className="no-contacts">No other users online</li>
        ) : (
          usersList.map((user) => (
            user !== username && (
              <li key={user} className="contact-item">
                <div className="contact-info">
                  <div className="contact-avatar">{user.charAt(0).toUpperCase()}</div>
                  <span className="contact-name">{user}</span>
                </div>
                <button
                  className="call-btn-v2"
                  type="button"
                  aria-label={`Call ${user}`}
                  onClick={() => startCall(user)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 16.92V19.92C22 20.47 21.55 20.92 21 20.92C11.61 20.92 4 13.31 4 3.92C4 3.37 4.45 2.92 5 2.92H8C8.55 2.92 9 3.37 9.09 3.91L9.72 7.04C9.8 7.45 9.68 7.87 9.4 8.16L7.54 10.02C8.75 12.13 10.49 13.87 12.6 15.08L14.45 13.22C14.73 12.94 15.15 12.82 15.56 12.92L18.69 13.54C19.23 13.62 19.68 14.07 19.68 14.62V16.92H22Z" fill="currentColor"/>
                  </svg>
                  <span>Call</span>
                </button>
              </li>
            )
          ))
        )}
      </ul>
    </aside>
  );
}
