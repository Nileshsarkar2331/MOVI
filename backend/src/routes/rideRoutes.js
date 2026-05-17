const express = require('express');
const Ride = require('../models/Ride');

const router = express.Router();

// Mock route for searching a ride
router.post('/search', async (req, res) => {
  const { pickup, drop, rideType } = req.body;
  
  // Basic mock logic to return a simulated ride response
  try {
    // In a real scenario, this would query active rides in MongoDB using geo-queries
    // For now, we simulate a delay and return mock data
    setTimeout(() => {
      res.json({
        success: true,
        message: 'Rides found',
        data: {
          rideId: 'mock_ride_123',
          eta: '2 min',
          fare: rideType === 'shared' ? 65 : 110,
          driver: {
            name: 'Kiran',
            rating: 4.8,
            vehicle: 'KA-01-AB-1234',
          }
        }
      });
    }, 1500);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
