import React from 'react';

function App() {
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>Remote Camera Stream</h1>
      {/* The image source points to the MJPEG stream endpoint */}
      <img
        src="/stream"
        alt="Camera Stream"
        style={{ width: '640px', height: '480px', border: '2px solid #ccc' }}
      />
    </div>
  );
}

export default App;
