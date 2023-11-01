import React from 'react';

export default function LucidDiagram({
  width = '640px',
  height = '480px',
  src,
  id,
 }) {
  return (
    <div style={{width: width, height: height, margin: '10px', position: 'relative'}}>
      <iframe allowFullScreen frameBorder='0' style={{width: width, height: height}} src={src} id={id}></iframe>
    </div>
  )
}
