import React, { useState, useEffect } from 'react';

import Fab from '@mui/material/Fab';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';

export function ChatBob() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Ensure window object is defined
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth <= 768);

      function handleResize() {
        setIsMobile(window.innerWidth <= 768);
      }

      window.addEventListener('resize', handleResize);

      // Cleanup
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <>
      {!(isVisible&&isMobile)&&(<Fab
        color="primary"
        aria-label="chat"
        sx={{
          position: 'fixed',
          bottom: '23px',
          right: '28px',
        }}
        style={{ backgroundColor: '#0f172a', border: '1px solid white' }}
        onClick={toggleVisibility}
      >
        <ChatIcon />
      </Fab>)}
      <div style={{ borderRadius: '100px', zIndex: 100 }}>
        <iframe
          src="https://tezosbot.vercel.app/chatbox?history_enabled=true"
          title="chatbox"
          key="0"
          style={{
            position: 'fixed',
            bottom: isMobile ? '0px' : '100px',
            right: isMobile ? '0px' : '50px',
            width: isMobile ? '100%' : '500px',
            height: isMobile ? '100vh' : '500px',
            border: 'none',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
            borderRadius: '6px',
            display: isVisible ? 'block' : 'none',
            zIndex: 100,
          }}
        />
        {isVisible && isMobile && (
          <Fab
            color="primary"
            aria-label="close chat"
            sx={{
              position: 'fixed',
              top: '10px',
              right: '10px',
            }}
            style={{ backgroundColor: '#0f172a', border: '1px solid white' }}
            onClick={toggleVisibility}
          >
            <CloseIcon />
          </Fab>
        )}
      </div>
    </>
  );
}
