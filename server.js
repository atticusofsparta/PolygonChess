const express = require("express");
const cors = require("cors");
const app = express();
const http = require('http');
const server = http.createServer(app);
const bodyParser = require("body-parser");
const { Server } = require("socket.io");
const immer = require("immer");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["WS"]
  }
});

//middleware
app.use(cors());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

// //socket

let users = []; //users connected to server
let games = {};
let messages = { // messages on server
  General: [{sender: "test", content: "test"}],
  Spanish: [{sender: "test", content: "test"}]
}
io.on('connection', (socket) => {
  console.log('connected :', socket.id)
  //adds user to users list and gets all users in list
  socket.on('join server', (publicKey) => {
    const user = {
      publicKey,
      socket: socket.id,
    };
    if(users.map((u, i) => u.socket).includes(user.socket) === false){users.push(user)};

    io.emit('user list', users);
    socket.emit('lobby list', Object.keys(messages))
    socket.emit('game list', games)
  });
  // joins specified room and returns all messages in that room
  socket.on('join room', (roomName, cb) => {
    if (messages[roomName]){  //if room exists, joins that room and sends back messages
      socket.join(roomName);
    cb(messages[roomName]);
    console.log(socket.id, " has joined ", roomName)
  }
     else { // if room does not exist, this creates the room and sends back the messages
       messages[roomName] = [{sender:'Casper Chess', content:`You have created the "${roomName}" channel!`}];
       socket.join(messages[roomName]);
       cb(messages[roomName]);
       console.log(`the room ${roomName} has been created`)
       io.emit('lobby list', Object.keys(messages))
     }
});

socket.on('send message', ({content, to, sender, chatName, isChannel}) => {
  if (isChannel){
      const payload = {
          content,
          chatName,
          sender,
      };
      socket.to(to).emit("new message", payload)
      console.log("new message", payload)
  }
  else {
      const payload = {
          content,
          chatName: sender,
          sender,
      };
      socket.to(to).emit('new message', payload)
  };
  if (messages[chatName]) {
    messages[chatName].push({
      sender,
      content,
  }) 
  console.log(messages[chatName])
      
  };
});
//game creation
socket.on('create game', ({Name, Password, Details, Timer, White, Black}) => {
    if (Password === ''){
      let game = {
        Password: Password,
        Private: false,
        Details: Details,
        Timer: Timer,
        White: White,
        Black: null
      }
      games[Name] = game
    } else {
      let game = {
        Password: Password,
        Private: true,
        Details: Details,
        Timer: Timer,
        White: White,
        Black: null
      }
      games[Name] = game
    }
  socket.broadcast.emit('game list', games)
  console.log(games)
})
socket.on('cancel game', (game) => {
  delete games[game];
  socket.broadcast.emit('game list', games)

})
socket.on('join game', ({Name, Password}) => {
  games[Name].Black = socket.id;
  socket.broadcast.emit('game list', games)
  console.log(games)
})
socket.on('start game', (opponent, game) => {
  socket.to(opponent).emit('start game', socket.id)
  console.log(opponent, 'is black')
  delete games[game];
 io.emit('game list', games)
})
socket.on('move', (opponent, move) => {
  console.log(move, opponent)
  socket.to(opponent).emit('move', move)
})
socket.on('conceded', opponent => {
  socket.to(opponent).emit('conceded')
})
// disconnects user from server and removes user from users list
socket.on('disconnect', () => {
  users = users.filter(u => u.socket !== socket.id)
  io.emit('user list', users)
});
  
})



server.listen(6100, () => console.log("running on port 6100..."));

