import mongoose from 'mongoose';

const biltyItemSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  unitFare: {
    type: Number,
    required: true,
    default: 0,
  },
  totalFare: {
    type: Number,
    required: true,
    default: 0,
  }
}, { timestamps: true });

// Pre-save hook for individual items to calculate totalFare
biltyItemSchema.pre('save', function(next) {
  this.totalFare = (this.quantity || 0) * (this.unitFare || 0);
  next();
});

const shipmentSchema = new mongoose.Schema({
  biltyNumber: {
    type: String,
    required: true,
    unique: true,
  },
  senderName: {
    type: String,
    required: true,
  },
  addaName: {
    type: String,
    required: true,
  },
  cityName: {
    type: String,
    required: true,
  },
  receiverName: {
    type: String,
    required: true,
  },
  receiverPhone: {
    type: String,
    required: true,
  },
  receiverAddress: {
    type: String,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['paid', 'unpaid'],
    default: 'unpaid',
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  items: [biltyItemSchema],
  totalFare: {
    type: Number,
    required: true,
    default: 0,
  },
  mazdoori: {
    type: Number,
    default: 0,
  },
  biltyCharges: {
    type: Number,
    default: 0,
  },
  reriCharges: {
    type: Number,
    default: 0,
  },
  extraCharges: {
    type: Number,
    default: 0,
  },
  receivedFare: {
    type: Number,
    default: 0,
  },
  remainingFare: {
    type: Number,
    default: 0,
  },
  deliveryStatus: {
    type: String,
    enum: ['delivered', 'pending', 'returned'],
    default: 'pending',
  },
  dateTime: {
    type: String,
    required: true,
  },
  vehicleNumber: {
    type: String,
  },
  driverName: {
    type: String,
  },
  pickupType: {
    type: String,
    enum: ['self', 'delivery'],
    default: 'delivery',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, { timestamps: true });

// Pre-save middleware to calculate totals
shipmentSchema.pre('save', function(next) {
  // First, calculate totalFare for each item if not already calculated
  this.items.forEach(item => {
    if (!item.totalFare || item.totalFare === 0) {
      item.totalFare = (item.quantity || 0) * (item.unitFare || 0);
    }
  });
  
  // Calculate total fare from items
  this.totalFare = this.items.reduce((sum, item) => sum + (item.totalFare || 0), 0);
  
  // Calculate remaining fare
  const totalCharges = this.totalFare + (this.mazdoori || 0) + (this.biltyCharges || 0) + (this.reriCharges || 0) + (this.extraCharges || 0);
  this.remainingFare = totalCharges - (this.receivedFare || 0);
  
  next();
});

export default mongoose.model('Shipment', shipmentSchema); 