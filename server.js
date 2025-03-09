const express = require('express');
const NodeWebcam = require('node-webcam');
const path = require('path');

const app = express();
const port = 8080;

const webcamOptions = {
  width: 640,
  height: 480,
  delay: 0,
  saveShots: false,
  output: 'jpeg',
  device: false,
  callbackReturn: 'buffer',
  verbose: false,
  platform: 'mac' // Options are: 'linux', 'mac', 'windows'
};

const webcam = NodeWebcam.create(webcamOptions);


// MJPEG endpoint
app.get('/mjpeg', (req, res) => {
  // Set headers to tell the browser we’re sending a multipart stream
  res.writeHead(200, {
    'Content-Type': 'multipart/x-mixed-replace; boundary=frame',
    'Cache-Control': 'no-cache',
    'Connection': 'close',
    'Pragma': 'no-cache'
  });

  // Continuously capture frames and write to the response
  const sendFrame = () => {
    webcam.capture('frame', (err, buffer) => {
      if (err) {
        console.error('Error capturing image:', err);
        return;
      }
      res.write(`--frame\r\n`);
      res.write('Content-Type: image/jpeg\r\n');
      res.write(`Content-Length: ${buffer.length}\r\n\r\n`);
      res.write(buffer, 'binary');
      res.write('\r\n');
    });
  };

  // Capture frames at an interval (e.g. 100ms)
  const interval = setInterval(sendFrame, 100);

  // If the client closes the connection, stop sending frames
  req.on('close', () => {
    clearInterval(interval);
  });
});

// (Optional) Serve a basic HTML page with an <img> tag for testing
app.get('/', (req, res) => {
  res.send(`
    <html>
      <body style="text-align:center">
        <img src="/mjpeg" />
      </body>
    </html>
  `);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
