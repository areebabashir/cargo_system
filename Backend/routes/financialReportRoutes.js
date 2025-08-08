import express from 'express';
import {
  getAllFinancialReports,
  createFinancialReport,
  getFinancialReportById,
  updateFinancialReport,
  deleteFinancialReport,
  getReportsByTripId,
  getReportsByDriverId,
  getReportsByVehicleId,
  getTripExpenseSummary
} from '../controllers/financialReportController.js';

const router = express.Router();

// Basic CRUD routes
router.get('/', getAllFinancialReports);
router.post('/', createFinancialReport);
router.get('/:id', getFinancialReportById);
router.put('/:id', updateFinancialReport);
router.delete('/:id', deleteFinancialReport);

// Specialized routes
router.get('/trip/:tripId', getReportsByTripId);
router.get('/driver/:driverId', getReportsByDriverId);
router.get('/vehicle/:vehicleId', getReportsByVehicleId);
router.get('/summary/trip/:tripId', getTripExpenseSummary);

export default router;