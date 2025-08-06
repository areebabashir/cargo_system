import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  biltyNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ['cash', 'online', 'cod'],
    default: 'cash',
  },
  deliveryType: {
    type: String,
    required: true,
    enum: ['self_pickup', 'delivery_by_distributor'],
    default: 'delivery_by_distributor',
  },
  // Additional fields for better customer management
  phone: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  totalAmount: {
    type: Number,
    default: 0,
  },
  paidAmount: {
    type: Number,
    default: 0,
  },
  remainingAmount: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active',
  },
  notes: {
    type: String,
    trim: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for payment completion status
customerSchema.virtual('isFullyPaid').get(function() {
  return this.remainingAmount <= 0;
});

// Virtual for payment completion percentage
customerSchema.virtual('paymentPercentage').get(function() {
  if (this.totalAmount === 0) return 0;
  return Math.round((this.paidAmount / this.totalAmount) * 100);
});

// Pre-save middleware to calculate remaining amount
customerSchema.pre('save', function(next) {
  // Calculate remaining amount
  this.remainingAmount = this.totalAmount - this.paidAmount;
  
  // Ensure remaining amount is not negative
  if (this.remainingAmount < 0) {
    this.remainingAmount = 0;
  }
  
  next();
});

// Index for faster queries
customerSchema.index({ biltyNumber: 1 });
customerSchema.index({ name: 1 });
customerSchema.index({ date: -1 });
customerSchema.index({ paymentStatus: 1 });
customerSchema.index({ deliveryType: 1 });
customerSchema.index({ status: 1 });
customerSchema.index({ createdBy: 1 });

export default mongoose.model('Customer', customerSchema);