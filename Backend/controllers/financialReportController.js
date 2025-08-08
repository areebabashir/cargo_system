import FinancialReport from '../models/financialReportModel.js';
import Trip from '../models/tripModel.js';
import Driver from '../models/driverModel.js';
import Vehicle from '../models/vehicleModel.js';

// Get all financial reports
export const getAllFinancialReports = async (req, res) => {
  try {
    const reports = await FinancialReport.find()
      .populate('tripId')
      .populate('driverId')
      .populate('vehicleId');
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new financial report
export const createFinancialReport = async (req, res) => {
  try {
    // Validate trip, driver, and vehicle exist
    const trip = await Trip.findById(req.body.tripId);
    const driver = await Driver.findById(req.body.driverId);
    const vehicle = await Vehicle.findById(req.body.vehicleId);

    if (!trip || !driver || !vehicle) {
      return res.status(404).json({ message: 'Trip, driver, or vehicle not found' });
    }

    const report = new FinancialReport(req.body);
    const savedReport = await report.save();
    res.status(201).json(savedReport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a single financial report by ID
export const getFinancialReportById = async (req, res) => {
  try {
    const report = await FinancialReport.findById(req.params.id)
      .populate('tripId')
      .populate('driverId')
      .populate('vehicleId');

    if (!report) {
      return res.status(404).json({ message: 'Financial report not found' });
    }

    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a financial report
export const updateFinancialReport = async (req, res) => {
  try {
    const report = await FinancialReport.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('tripId')
     .populate('driverId')
     .populate('vehicleId');

    if (!report) {
      return res.status(404).json({ message: 'Financial report not found' });
    }

    res.status(200).json(report);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a financial report
export const deleteFinancialReport = async (req, res) => {
  try {
    const report = await FinancialReport.findByIdAndDelete(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Financial report not found' });
    }

    res.status(200).json({ message: 'Financial report deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get financial reports by trip ID
export const getReportsByTripId = async (req, res) => {
  try {
    const reports = await FinancialReport.find({ tripId: req.params.tripId })
      .populate('driverId')
      .populate('vehicleId');

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get financial reports by driver ID
export const getReportsByDriverId = async (req, res) => {
  try {
    const reports = await FinancialReport.find({ driverId: req.params.driverId })
      .populate('tripId')
      .populate('vehicleId');

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get financial reports by vehicle ID
export const getReportsByVehicleId = async (req, res) => {
  try {
    const reports = await FinancialReport.find({ vehicleId: req.params.vehicleId })
      .populate('tripId')
      .populate('driverId');

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Calculate total expenses for a trip
export const getTripExpenseSummary = async (req, res) => {
  try {
    const reports = await FinancialReport.find({ tripId: req.params.tripId });

    const summary = {
      totalDriverPayment: 0,
      totalMazdori: 0,
      totalLoading: 0,
      totalUnloading: 0,
      totalRoadExpenses: 0,
      totalTripExpenses: 0,
      totalOtherExpenses: 0,
      totalExpenses: 0,
      totalIncome: 0,
      netProfit: 0
    };

    reports.forEach(report => {
      summary.totalDriverPayment += report.expenses.driverPayment?.amount || 0;
      summary.totalMazdori += report.expenses.mazdori?.amount || 0;
      summary.totalLoading += report.expenses.loading?.amount || 0;
      summary.totalUnloading += report.expenses.unloading?.amount || 0;
      
      report.expenses.roadExpenses.forEach(exp => {
        summary.totalRoadExpenses += exp.amount || 0;
      });
      
      report.expenses.tripExpenses.forEach(exp => {
        summary.totalTripExpenses += exp.amount || 0;
      });
      
      report.expenses.otherExpenses.forEach(exp => {
        summary.totalOtherExpenses += exp.amount || 0;
      });
      
      summary.totalIncome += report.income?.amount || 0;
    });

    summary.totalExpenses = (
      summary.totalDriverPayment +
      summary.totalMazdori +
      summary.totalLoading +
      summary.totalUnloading +
      summary.totalRoadExpenses +
      summary.totalTripExpenses +
      summary.totalOtherExpenses
    );

    summary.netProfit = summary.totalIncome - summary.totalExpenses;

    res.status(200).json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};