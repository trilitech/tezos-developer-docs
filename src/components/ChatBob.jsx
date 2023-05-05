import React, { useState } from 'react';

import Fab from '@mui/material/Fab';
import ChatIcon from '@mui/icons-material/Chat';

export function ChatBob() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="chat"
        sx={{
          position: 'fixed',
          bottom: '23px',
          right: '28px',
        }}
        style={{ backgroundColor: '#0f172a' }}
        onClick={toggleVisibility}
      >
        <ChatIcon/>
      </Fab>
      (
        <div style={{ borderRadius: '100px'}}>
        <iframe
          src="https://tezosbot.vercel.app/chatbox?history_enabled=true"
          title="chatbox"
          key='0'
          style={{
            position: 'fixed',
            bottom: '100px',
            right: '50px',
            width: '500px',
            height: '500px',
            border: 'none',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
            borderRadius: '6px',
            display: isVisible ? 'block' : 'none',
          }}
        />
        </div>
      )
    </>
  );
};