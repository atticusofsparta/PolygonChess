const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require('socket.io');
const io = socket(server);

//users connected to server
let users = [];
//messages on server
const messages = {
    general: [],
    random: [],
    jokes: [],
    javascript: [],
}

io.on('connection', socket => {
//joins server and adds user to users list
socket.on('join server', (username) => {
    const user = {
        username,
        socket: socket.id,
    };
    users.push(user);
    io.emit('new user', users)
});
//adds user to room specified in call and sends back messages for that room
socket.on('join room', (roomName, cb) => {
    socket.join(roomName);
    cb(messages[roomName]);
});
// takes message object, deconstructs, and routes it to appropriate room or socket
socket.on('send message', ({content, to, sender, chatName, isChannel}) => {
    if (isChannel){
        const payload = {
            content,
            chatName,
            sender,
        };
        socket.to(to).emit('new message', payload)
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
        messages.push({
            sender,
            content
        })
    };
});
// disconnects user from server and removes user from users list
socket.on('disconnect', () => {
    users = users.filter(u => u.id !== socket.id)
    io.emit('new user', users)
});


});

server.listen(1337, () => console.log('listening on port 1337'))