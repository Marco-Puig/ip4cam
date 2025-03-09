const express = require('express');
const path = require('path');
const { spawn } = require('child_process');

const app = express();
const port = 8080;

// camera index 0:
const ffmpegArgs = [
  '-f', 'avfoundation',
  '-framerate', '30',
  '-i', '0', // might need '0:0' if you have both audio and video
  '-s:v', '640x480',
  '-c:v', 'libx264',
  '-preset', 'veryfast',
  '-tune', 'zerolatency',
  '-f', 'hls',
  '-hls_time', '2',          // segment length in seconds
  '-hls_list_size', '3',     // number of segments in the manifest
  '-hls_flags', 'delete_segments',
  path.join(__dirname, 'public', 'live.m3u8'),
];

const ffmpeg = spawn('ffmpeg', ffmpegArgs);

ffmpeg.stderr.on('data', (data) => {
  console.error(`FFmpeg error: ${data}`);
});

// 2) Serve the static React build
app.use(express.static(path.join(__dirname, 'build')));

// 3) Also serve the public folder where HLS files are stored
app.use(express.static(path.join(__dirname, 'public')));

// 4) For all other routes, serve the React index
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// 5) Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
