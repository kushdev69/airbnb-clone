const mongoose = require('mongoose');
const crypto = require('crypto');

const bookingSchema = new mongoose.Schema({
  reference: { type: String, unique: true, default: () => `BK-${crypto.randomBytes(5).toString('hex').toUpperCase()}` },
  listing: { type: mongoose.Schema.Types.ObjectId, ref: 'listing', required: true },
  guest: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  paymentMethod: { type: String, enum: ['COD'], default: 'COD' }
}, { timestamps: true });

module.exports = mongoose.model('booking', bookingSchema);