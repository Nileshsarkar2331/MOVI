const initializeSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Passenger requests to join a ride
    socket.on('request_join_ride', (data) => {
      console.log('Join ride request:', data);
      
      // Simulate finding a match and broadcasting back to the user
      setTimeout(() => {
        socket.emit('new_match_found', {
          message: 'Match found! Driver is on the way.',
          driverLocation: [77.625, 12.940],
          eta: '2 mins'
        });
        
        // Simulate fare reduction for shared ride
        if (data.rideType === 'shared') {
          setTimeout(() => {
            socket.emit('fare_updated', {
              newFare: data.currentFare - 15,
              message: 'Co-passenger joined! Your fare decreased.'
            });
          }, 5000);
        }
      }, 3000);
    });

    // Driver location updates
    socket.on('update_location', (data) => {
      // Broadcast to passengers in the same ride room
      socket.broadcast.emit('driver_location_update', data);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

module.exports = initializeSocket;
