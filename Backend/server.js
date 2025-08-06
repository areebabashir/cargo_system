import express from 'express';
import connectDB from './config/db.js';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js'; // Importing routes
import shipmentRoutes from './routes/shipmentRoutes.js'; // Importing shipment routes
import voucherRoutes from './routes/voucherRoutes.js'; // Importing voucher routes
import customerRoutes from './routes/customerRoutes.js'; // Importing customer routes
import driverRoutes from './routes/driverRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import tripRoutes from './routes/tripRoutes.js';
import shopRoutes from './routes/shopRoutes.js';
import rentPaymentRoutes from './routes/rentPaymentRoutes.js';
// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests

// Routes
app.use('/api/auth', authRoutes); // Mount auth routes
app.use('/api/shipments', shipmentRoutes); // Mount shipment routes
app.use('/api/vouchers', voucherRoutes); // Mount voucher routes
app.use('/api/customers', customerRoutes); // Mount customer routes
app.use('/api/drivers', driverRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/rent-payments', rentPaymentRoutes);
// Basic route
app.get('/', (req, res) => {
  res.send('<h1>Welcome to the E-commerce App</h1>');
});

// Set the PORT from environment variables or default to 8000
const PORT = process.env.PORT || 8000;

// Start server
app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});
