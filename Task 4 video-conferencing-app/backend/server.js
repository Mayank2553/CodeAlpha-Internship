const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/video-conferencing', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Socket.IO setup
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Video call handling
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', userId);

    socket.on('offer', (offer) => {
      socket.to(roomId).emit('offer', offer);
    });

    socket.on('answer', (answer) => {
      socket.to(roomId).emit('answer', answer);
    });

    socket.on('ice-candidate', (candidate) => {
      socket.to(roomId).emit('ice-candidate', candidate);
    });
  });

  // Screen sharing
  socket.on('start-screen-share', (roomId) => {
    socket.to(roomId).emit('screen-share-started');
  });

  socket.on('stop-screen-share', (roomId) => {
    socket.to(roomId).emit('screen-share-stopped');
  });

  // Whiteboard
  socket.on('draw', (data) => {
    socket.broadcast.emit('draw', data);
  });

  socket.on('clear-whiteboard', () => {
    socket.broadcast.emit('clear-whiteboard');
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
