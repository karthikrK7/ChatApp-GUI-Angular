var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
const MAX_CLIENTS = 3;
const port = process.env.PORT || 3000;
var clients = new Array();
io.on('connection', (socket) => {
console.log('connection___')
  socket.on('storeClients', function (data) {
    console.log("AAAAA")
    var clientInfo = new Object();
    clientInfo.customId         = data;
    clientInfo.clientId     = socket.id;
    clients.push(clientInfo);
    console.log(clients)
});

  socket.on('ready', function (id) {
    
    socket.emit('ready', id);
  });
  socket.on('offer', function (id, message) {
    console.log('id :: '+id + ' '+message);
    socket.emit('offer', socket.id, message);
    console.log('after emit  :: '+socket.id + ' '+message);
  });
  socket.on('candidate', function (id, message) {
    socket.emit('candidate', socket.id, message);
    console.log('after candidate  :: '+socket.id + ' '+message);
  });
  socket.on('answer', function (id, message) {
    socket.emit('answer', socket.id, message);
  });
  
  socket.on('new-message', (message) => {
    console.log(message);
  });
  const rooms = io.nsps['/'].adapter.rooms;
  socket.on('join', function (room) {
    console.log(room);
    let numClients = 0;
    if (rooms[room]) {
      numClients = rooms[room].length;
    }
    if (numClients < MAX_CLIENTS) {

      socket.on('offer', function (id, message) {
        socket.to(id).emit('offer', socket.id, message);
      });
      socket.on('answer', function (id, message) {
        socket.to(id).emit('answer', socket.id, message);
      });
      socket.on('candidate', function (id, message) {
        socket.to(id).emit('candidate', socket.id, message);
      });
      socket.on('disconnect', function () {
        socket.broadcast.to(room).emit('bye', socket.id);
        clients=null;
      });
      socket.join(room);
    } else {
      socket.emit('full', room);
    }
  });


  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId);
    // messages
    socket.on('message', (message) => {
      //send message to the same room
      io.to(roomId).emit('createMessage', message)
  }); 

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })

});

server.listen(port, () => {
  console.log(`started on port: ${port}`);
});
