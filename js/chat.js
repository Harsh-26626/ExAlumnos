const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

const io = require('socket.io')(7000, {
    cors: {
        origin: "http://127.0.0.1:5500",
        methods: ["GET", "POST"], 
        allowedHeaders: ["my-custom-header"], 
        credentials: true 
    }
});

const users ={};

io.on('connection', socket => {
    console.log('A user connected');

    socket.on('new-user-joined', user =>{
        console.log("New User", user);
        users[socket.id] = user;
        socket.broadcast.emit('user-joined', user);
    })

    // Handle 'send' event from a client
    socket.on('send', message => {
        console.log(`Message received: ${message}`);
        
        // Broadcast the message to all other clients
        socket.broadcast.emit('receive', {message: message, user: users[socket.id]});
    });

    // Handle client disconnect
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});