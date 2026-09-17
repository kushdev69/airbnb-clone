const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  listing: { type: mongoose.Schema.Types.ObjectId, ref: 'listing', required: true },
  guest: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  paymentMethod: { type: String, enum: ['COD'], default: 'COD' }
}, { timestamps: true });

module.exports = mongoose.model('booking', bookingSchema);