const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const rideRoutes = require('./routes/rideRoutes');
const initializeSocket = require('./socket/socketHandlers');

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/rides', rideRoutes);

// Socket.io initialization
initializeSocket(io);

app.get('/', (req, res) => {
  res.send('MOVI Backend API is running');
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
