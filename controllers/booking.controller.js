const bookingmodel = require('../models/bookings.js');
const listingmodel = require('../models/listings.js');

const dates = (checkIn, checkOut) => {
  const start = new Date(`${checkIn}T00:00:00.000Z`);
  const end = new Date(`${checkOut}T00:00:00.000Z`);
  if (!checkIn || !checkOut || Number.isNaN(start.valueOf()) || Number.isNaN(end.valueOf()) || start >= end) {
    return null;
  }
  return { start, end };
};

const overlap = (listing, start, end) => bookingmodel.findOne({
  listing,
  checkIn: { $lt: end },
  checkOut: { $gt: start }
});

module.exports.userBookings = async (req, res) => {
  const bookings = await bookingmodel.find({ guest: req.user._id })
    .populate('listing', 'title location country image price')
    .sort({ checkIn: 1 });
  res.json(bookings);
};

module.exports.checkAvailability = async (req, res) => {
  const range = dates(req.query.checkIn, req.query.checkOut);
  if (!range) return res.status(400).json({ available: false, message: 'Choose a valid date range' });
  const available = !(await overlap(req.params.id, range.start, range.end));
  res.json({ available });
};

module.exports.createBooking = async (req, res) => {
  const range = dates(req.body.checkIn, req.body.checkOut);
  if (!range) return res.status(400).json({ message: 'Choose a valid date range' });
  if (!(await listingmodel.exists({ _id: req.params.id }))) {
    return res.status(404).json({ message: 'Listing not found' });
  }
  if (await overlap(req.params.id, range.start, range.end)) {
    return res.status(409).json({ message: 'Those dates are already booked' });
  }
  const booking = await bookingmodel.create({
    listing: req.params.id,
    guest: req.user._id,
    checkIn: range.start,
    checkOut: range.end,
    paymentMethod: 'COD'
  });
  res.status(201).json(booking);
};