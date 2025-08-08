import mongoose from 'mongoose';

const financialReportSchema = new mongoose.Schema({
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    required: true
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  expenses: {
    driverPayment: {
      amount: Number,
      description: String,
      paymentMethod: String,
      paymentDate: Date
    },
    mazdori: {
      amount: Number,
      description: String,
      paymentMethod: String,
      paymentDate: Date
    },
    loading: {
      amount: Number,
      description: String,
      paymentMethod: String,
      paymentDate: Date
    },
    unloading: {
      amount: Number,
      description: String,
      paymentMethod: String,
      paymentDate: Date
    },
    roadExpenses: [{
      amount: Number,
      description: String,
      category: String, // fuel, toll, maintenance, etc.
      location: String,
      date: Date
    }],
    tripExpenses: [{
      amount: Number,
      description: String,
      category: String,
      date: Date
    }],
    otherExpenses: [{
      amount: Number,
      description: String,
      category: String,
      date: Date
    }]
  },
  income: {
    amount: Number,
    description: String,
    paymentMethod: String,
    paymentDate: Date
  },
  notes: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const FinancialReport = mongoose.model('FinancialReport', financialReportSchema);

export default FinancialReport;