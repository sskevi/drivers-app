require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const connectDB = require('./backend/config/database');

// Routes
const authRoutes = require('./backend/routes/authRoutes');
const instructorRoutes = require('./backend/routes/instructorRoutes');
const bookingRoutes = require('./backend/routes/bookingRoutes');
const reviewRoutes = require('./backend/routes/reviewRoutes');
const messageRoutes = require('./backend/routes/messageRoutes');

// Initialize app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/instructors', instructorRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/messages', messageRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Socket.io for real-time messaging
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('join-conversation', (conversationId) => {
    socket.join(conversationId);
    console.log(`User joined conversation: ${conversationId}`);
  });

  socket.on('send-message', (data) => {
    io.to(data.conversationId).emit('new-message', data);
  });

  socket.on('typing', (data) => {
    socket.to(data.conversationId).emit('user-typing', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, io };
