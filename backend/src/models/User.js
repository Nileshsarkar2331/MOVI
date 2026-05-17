const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  role: { type: String, enum: ['passenger', 'driver'], default: 'passenger' },
  rating: { type: Number, default: 5.0 },
  currentLocation: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
}, { timestamps: true });

userSchema.index({ currentLocation: '2dsphere' });

module.exports = mongoose.model('User', userSchema);
