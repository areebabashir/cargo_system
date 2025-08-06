import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  departureLocation: { type: String, required: true },
  destinationLocation: { type: String, required: true },
  // Add more fields as needed (date, fare, etc.)
}, { timestamps: true });

export default mongoose.model('Trip', tripSchema);