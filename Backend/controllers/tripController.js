import Trip from '../models/tripModel.js';
import Voucher from '../models/voucherModel.js';

export const getAllTrips = async (req, res) => {
  try {
    const trips = await Trip.find()
      .populate('driver')
      .populate('vehicle')
      .populate('vouchers'); // Populate vouchers as well

    res.json({ success: true, data: trips });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const createTrip = async (req, res) => {
  try {
    console.log('Received trip creation payload:', req.body);
    const { driver, vehicle, departureLocation, destinationLocation, vouchers = [] } = req.body;
    const trip = new Trip({ driver, vehicle, departureLocation, destinationLocation, vouchers });
    await trip.save();
    // Mark selected vouchers as trip_made=true
    if (Array.isArray(vouchers) && vouchers.length > 0) {
      await Voucher.updateMany({ _id: { $in: vouchers } }, { trip_made: true });
    }
    await trip.populate('driver');
    await trip.populate('vehicle');
    await trip.populate('vouchers');
    res.status(201).json({ success: true, data: trip });
  } catch (err) {
    console.error('Trip creation error:', err);
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id).populate('driver').populate('vehicle');
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
    res.json({ success: true, data: trip });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
    res.json({ success: true, data: trip });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findByIdAndDelete(req.params.id);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
    res.json({ success: true, message: 'Trip deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};