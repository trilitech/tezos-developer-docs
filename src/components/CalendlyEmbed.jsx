import React, { useState, useEffect } from 'react';
import { InlineWidget } from 'react-calendly';

export default function CalendlyEmbed() {
  const url = 'https://calendly.com/developer-success-on-tezos/15min';
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1000);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{ overflow: 'hidden' }}>
      {isMobile ? (
        <InlineWidget
          url={url}
          styles={{
            height: '1200px'
          }}
        />
      ) : (
        <InlineWidget
          url={url}
          styles={{
            height: '800px'
          }}
        />
      )}
    </div>
  );
}
