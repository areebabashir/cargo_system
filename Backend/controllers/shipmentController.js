import Shipment from '../models/shipmentModel.js';

// Create new shipment
export const createShipment = async (req, res) => {
  try {
    const shipmentData = req.body;
    
    // Validate required fields
    if (!shipmentData.biltyNumber || !shipmentData.senderName || !shipmentData.receiverName) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Check if bilty number already exists
    const existingShipment = await Shipment.findOne({ biltyNumber: shipmentData.biltyNumber });
    if (existingShipment) {
      return res.status(400).json({
        success: false,
        message: 'Bilty number already exists'
      });
    }

    // Add createdBy field
    shipmentData.createdBy = req.user._id;

    const shipment = new Shipment(shipmentData);
    await shipment.save();

    res.status(201).json({
      success: true,
      message: 'Shipment created successfully',
      data: shipment
    });

  } catch (error) {
    console.error('Error creating shipment:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating shipment',
      error: error.message
    });
  }
};

// Get all shipments
export const getShipments = async (req, res) => {
  try {
    const { search, status, paymentStatus } = req.query;
    
    const filter = {};
    
    if (search) {
      filter.$or = [
        { biltyNumber: { $regex: search, $options: 'i' } },
        { senderName: { $regex: search, $options: 'i' } },
        { receiverName: { $regex: search, $options: 'i' } }
      ];
    }

    if (status && status !== 'all') {
      filter.deliveryStatus = status;
    }

    if (paymentStatus && paymentStatus !== 'all') {
      filter.paymentStatus = paymentStatus;
    }

    const shipments = await Shipment.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: shipments
    });

  } catch (error) {
    console.error('Error fetching shipments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching shipments',
      error: error.message
    });
  }
};

// Get single shipment
export const getShipmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const shipment = await Shipment.findById(id).populate('createdBy', 'name email');

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: 'Shipment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: shipment
    });

  } catch (error) {
    console.error('Error fetching shipment:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching shipment',
      error: error.message
    });
  }
};

// Update shipment
export const updateShipment = async (req, res) => {
  try {
    const { id } = req.params;
    const shipment = await Shipment.findByIdAndUpdate(id, req.body, { new: true });

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: 'Shipment not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Shipment updated successfully',
      data: shipment
    });

  } catch (error) {
    console.error('Error updating shipment:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating shipment',
      error: error.message
    });
  }
};

// Delete shipment
export const deleteShipment = async (req, res) => {
  try {
    const { id } = req.params;
    const shipment = await Shipment.findByIdAndDelete(id);

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: 'Shipment not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Shipment deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting shipment:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting shipment',
      error: error.message
    });
  }
};

// Get shipment statistics
export const getShipmentStats = async (req, res) => {
  try {
    const stats = await Shipment.aggregate([
      {
        $group: {
          _id: null,
          totalShipments: { $sum: 1 },
          totalFare: { $sum: '$totalFare' },
          totalReceived: { $sum: '$receivedFare' },
          totalRemaining: { $sum: '$remainingFare' },
          avgFare: { $avg: '$totalFare' }
        }
      }
    ]);

    const statusStats = await Shipment.aggregate([
      {
        $group: {
          _id: '$deliveryStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    const paymentStats = await Shipment.aggregate([
      {
        $group: {
          _id: '$paymentStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    const monthlyStats = await Shipment.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 },
          totalFare: { $sum: '$totalFare' }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: stats[0] || {
          totalShipments: 0,
          totalFare: 0,
          totalReceived: 0,
          totalRemaining: 0,
          avgFare: 0
        },
        statusBreakdown: statusStats,
        paymentBreakdown: paymentStats,
        monthlyTrends: monthlyStats
      }
    });

  } catch (error) {
    console.error('Error fetching shipment stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching shipment statistics',
      error: error.message
    });
  }
};

// Generate bilty number
export const generateBiltyNumber = async (req, res) => {
  try {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    // Get count of shipments for today
    const todayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    
    const todayCount = await Shipment.countDocuments({
      createdAt: { $gte: todayStart, $lt: todayEnd }
    });
    
    const sequence = String(todayCount + 1).padStart(3, '0');
    const biltyNumber = `BLT-${year}-${month}${day}-${sequence}`;

    res.status(200).json({
      success: true,
      data: { biltyNumber }
    });

  } catch (error) {
    console.error('Error generating bilty number:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating bilty number',
      error: error.message
    });
  }
};

// Recalculate totals for existing shipments (utility function)
export const recalculateShipmentTotals = async (req, res) => {
  try {
    const shipments = await Shipment.find({});
    let updatedCount = 0;
    let itemsFixed = 0;

    for (const shipment of shipments) {
      let shipmentChanged = false;
      
      // First, fix individual item totals
      shipment.items.forEach(item => {
        const correctItemTotal = (item.quantity || 0) * (item.unitFare || 0);
        if (item.totalFare !== correctItemTotal) {
          console.log(`Fixing item in ${shipment.biltyNumber}: ${item.totalFare} → ${correctItemTotal}`);
          item.totalFare = correctItemTotal;
          shipmentChanged = true;
          itemsFixed++;
        }
      });
      
      // Calculate total fare from items
      const calculatedTotalFare = shipment.items.reduce((sum, item) => sum + (item.totalFare || 0), 0);
      
      // Check if shipment total needs updating
      if (shipment.totalFare !== calculatedTotalFare) {
        console.log(`Fixing shipment ${shipment.biltyNumber}: totalFare ${shipment.totalFare} → ${calculatedTotalFare}`);
        shipment.totalFare = calculatedTotalFare;
        shipmentChanged = true;
      }
      
      // Recalculate remaining fare
      const totalCharges = shipment.totalFare + (shipment.mazdoori || 0) + (shipment.biltyCharges || 0) + (shipment.reriCharges || 0) + (shipment.extraCharges || 0);
      const correctRemainingFare = totalCharges - (shipment.receivedFare || 0);
      
      if (shipment.remainingFare !== correctRemainingFare) {
        shipment.remainingFare = correctRemainingFare;
        shipmentChanged = true;
      }
      
      // Save if anything changed
      if (shipmentChanged) {
        await shipment.save();
        updatedCount++;
      }
    }

    res.status(200).json({
      success: true,
      message: `Recalculated totals for ${updatedCount} shipments and fixed ${itemsFixed} items`,
      totalShipments: shipments.length,
      updatedShipments: updatedCount,
      itemsFixed: itemsFixed
    });

  } catch (error) {
    console.error('Error recalculating shipment totals:', error);
    res.status(500).json({
      success: false,
      message: 'Error recalculating shipment totals',
      error: error.message
    });
  }
}; 