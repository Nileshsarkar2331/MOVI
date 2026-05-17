const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['searching', 'active', 'completed'], default: 'searching' },
  vehicleType: { type: String, enum: ['auto', 'mini', 'sedan'], default: 'auto' },
  totalCapacity: { type: Number, default: 3 },
  availableSeats: { type: Number, default: 3 },
  masterRoute: {
    type: { type: String, enum: ['LineString'] },
    coordinates: [[Number]], // [[lng, lat], [lng, lat], ...]
  },
  passengers: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    pickupPoint: [Number],
    dropPoint: [Number],
    farePaid: Number,
    status: { type: String, enum: ['waiting', 'picked_up', 'dropped_off'], default: 'waiting' }
  }],
}, { timestamps: true });

rideSchema.index({ masterRoute: '2dsphere' });

module.exports = mongoose.model('Ride', rideSchema);
