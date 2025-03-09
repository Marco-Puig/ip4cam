const express = require('express');
const NodeWebcam = require('node-webcam');
const path = require('path');

const app = express();
const port = 8080;

// Configure webcam options
const webcamOptions = {
  width: 640,
  height: 480,
  delay: 0,
  saveShots: false,
  output: "jpeg",
  device: false,
  callbackReturn: "buffer",
  verbose: false,
};

const webcam = NodeWebcam.create(webcamOptions);

// MJPEG streaming endpoint
app.get('/stream', (req, res) => {
  res.writeHead(200, {
    'Cache-Control': 'no-cache',
    'Connection': 'close',
    'Content-Type': 'multipart/x-mixed-replace; boundary=--frame',
  });

  // Function to capture a frame and send it to the client
  const sendFrame = () => {
    webcam.capture("frame", (err, buffer) => {
      if (err) {
        console.error("Error capturing image:", err);
        return;
      }
      res.write(`--frame\r\n`);
      res.write("Content-Type: image/jpeg\r\n");
      res.write("Content-Length: " + buffer.length + "\r\n\r\n");
      res.write(buffer, "binary");
      res.write("\r\n");
    });
  };

  // Capture and send a frame every 100ms (adjust as needed)
  const interval = setInterval(sendFrame, 100);

  // When the client disconnects, clear the interval
  req.on('close', () => {
    clearInterval(interval);
  });
});

// Serve the built React app static files
app.use(express.static(path.join(__dirname, 'build')));

// For any other requests, serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server on the specified port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
