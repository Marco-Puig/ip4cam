// imports
const express = require('express');
const NodeWebcam = require('node-webcam');
const app = express();

const CAPTURE_INTERVAL_MS = 200; // cam interval for reducing load

// webcam args
const webcamOptions = {
  width: 320,       
  height: 240,     
  delay: 0,
  saveShots: false,
  output: "jpeg",
  device: false,
  callbackReturn: "buffer",
  verbose: false,
  platform: 'mac'
};

// webcam instance
const webcam = NodeWebcam.create(webcamOptions);

// configure the mjpeg route
app.get('/mjpeg', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'multipart/x-mixed-replace; boundary=frame',
    'Cache-Control': 'no-cache',
    'Connection': 'close',
    'Pragma': 'no-cache'
  });

  // send frame function, handles the capture and send of the frame from node cam instance
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

  // Use setInterval with the adjustable capture interval
  const interval = setInterval(sendFrame, CAPTURE_INTERVAL_MS);

  // Clear the interval when the client disconnects
  req.on('close', () => {
    clearInterval(interval);
  });
});

// Server side render html page
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>ip4cam Stream</title></head>
      <body style="text-align:center">
        <img src="/mjpeg" alt="MJPEG Stream" style="width:320px;height:240px;border:1px solid #ccc;" />
      </body>
    </html>
  `);
});


// Port to listen on
const port = 8080;

// Server on port (ex: http://localhost:8080)
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
