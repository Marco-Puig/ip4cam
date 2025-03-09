import React from 'react';

function App() {
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      {/* The image source points to the MJPEG stream endpoint */}
      <img
        src="/stream"
        alt="Camera Stream"
        style={{ width: '100%', height: '100%', border: '2px solid #ccc' }}
      />
    </div>
  );
}

export default App;
