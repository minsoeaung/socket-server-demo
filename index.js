const express = require("express");
const {createServer} = require("http");
const {Server} = require("socket.io");
const fs = require('fs');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: "*"
});

io.on("connection", (socket) => {
  console.log(socket.id, 'connected');

  setInterval(() => {
    socket.emit('every_5_s', 'hello from server');
  }, 5000)

  socket.on('text_message', (text) => {
    console.log('TEXT', text);
  })

  socket.on("message_with_ack", (arg, callback) => {
    console.log("Message with Ack", arg);
    if (typeof callback === 'function') {
      callback({
        test: "Ok. Got it"
      });
    }
  });

  socket.on('json_message', (json) => {
    console.log('JSON', json);
  })

  socket.on('file_message', (file) => {
    const data = file.replace(/^data:image\/\w+;base64,/, "");
    const buf = Buffer.from(data, 'base64');
    fs.writeFile(__dirname + `/files/${Math.random()}.png`, buf, (error) => {
      if (error) {
        console.log('ERROR', error);
      } else {
        console.log('File saved')
      }
    });
  })
});

httpServer.listen(3000);