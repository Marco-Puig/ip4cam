import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

function App() {
  const videoRef = useRef(null);

  useEffect(() => {
    if (Hls.isSupported()) {
      const hls = new Hls();
      // Point to the HLS playlist that FFmpeg will generate
      hls.loadSource('/live.m3u8');
      hls.attachMedia(videoRef.current);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoRef.current.play();
      });
    } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari, iOS, etc. can play HLS without hls.js
      videoRef.current.src = '/live.m3u8';
    }
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>Remote Camera Feed (HLS)</h1>
      <video
        ref={videoRef}
        controls
        style={{ width: '640px', maxWidth: '100%', background: '#000' }}
      />
    </div>
  );
}

export default App;
