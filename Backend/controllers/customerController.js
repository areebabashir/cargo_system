import Customer from '../models/customerModel.js';

// Create new customer
export const createCustomer = async (req, res) => {
  try {
    const {
      name,
      biltyNumber,
      date,
      quantity,
      paymentStatus,
      deliveryType,
      phone,
      address,
      totalAmount,
      paidAmount,
      notes
    } = req.body;

    // Validate required fields
    if (!name || !biltyNumber || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'Name, bilty number, and quantity are required'
      });
    }

    // Check if bilty number already exists
    const existingCustomer = await Customer.findOne({ biltyNumber });
    if (existingCustomer) {
      return res.status(400).json({
        success: false,
        message: 'Customer with this bilty number already exists'
      });
    }

    // Create customer data
    const customerData = {
      name: name.trim(),
      biltyNumber: biltyNumber.trim(),
      date: date ? new Date(date) : new Date(),
      quantity: parseInt(quantity),
      paymentStatus: paymentStatus || 'cash',
      deliveryType: deliveryType || 'delivery_by_distributor',
      phone: phone?.trim(),
      address: address?.trim(),
      totalAmount: parseFloat(totalAmount) || 0,
      paidAmount: parseFloat(paidAmount) || 0,
      notes: notes?.trim(),
      createdBy: req.user._id
    };

    const customer = new Customer(customerData);
    await customer.save();

    res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      data: customer
    });

  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating customer',
      error: error.message
    });
  }
};

// Get all customers with filtering and pagination
export const getCustomers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      paymentStatus,
      deliveryType,
      status,
      sortBy = 'date',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};

    // Search in name, bilty number, phone
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { biltyNumber: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by payment status
    if (paymentStatus && paymentStatus !== 'all') {
      filter.paymentStatus = paymentStatus;
    }

    // Filter by delivery type
    if (deliveryType && deliveryType !== 'all') {
      filter.deliveryType = deliveryType;
    }

    // Filter by status
    if (status && status !== 'all') {
      filter.status = status;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const customers = await Customer.find(filter)
      .populate('createdBy', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const totalCustomers = await Customer.countDocuments(filter);
    const totalPages = Math.ceil(totalCustomers / parseInt(limit));

    // Calculate summary statistics
    const totalAmount = await Customer.aggregate([
      { $match: filter },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const paidAmount = await Customer.aggregate([
      { $match: filter },
      { $group: { _id: null, total: { $sum: '$paidAmount' } } }
    ]);

    res.status(200).json({
      success: true,
      data: customers,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCustomers,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1
      },
      summary: {
        totalAmount: totalAmount[0]?.total || 0,
        paidAmount: paidAmount[0]?.total || 0,
        remainingAmount: (totalAmount[0]?.total || 0) - (paidAmount[0]?.total || 0)
      }
    });

  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching customers',
      error: error.message
    });
  }
};

// Get single customer by ID
export const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findById(id)
      .populate('createdBy', 'name email');

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    res.status(200).json({
      success: true,
      data: customer
    });

  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching customer',
      error: error.message
    });
  }
};

// Update customer
export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if customer exists
    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // If bilty number is being updated, check for duplicates
    if (updateData.biltyNumber && updateData.biltyNumber !== customer.biltyNumber) {
      const existingCustomer = await Customer.findOne({ 
        biltyNumber: updateData.biltyNumber,
        _id: { $ne: id }
      });
      
      if (existingCustomer) {
        return res.status(400).json({
          success: false,
          message: 'Customer with this bilty number already exists'
        });
      }
    }

    // Clean and validate update data
    const cleanUpdateData = {};
    
    if (updateData.name) cleanUpdateData.name = updateData.name.trim();
    if (updateData.biltyNumber) cleanUpdateData.biltyNumber = updateData.biltyNumber.trim();
    if (updateData.date) cleanUpdateData.date = new Date(updateData.date);
    if (updateData.quantity) cleanUpdateData.quantity = parseInt(updateData.quantity);
    if (updateData.paymentStatus) cleanUpdateData.paymentStatus = updateData.paymentStatus;
    if (updateData.deliveryType) cleanUpdateData.deliveryType = updateData.deliveryType;
    if (updateData.phone !== undefined) cleanUpdateData.phone = updateData.phone?.trim();
    if (updateData.address !== undefined) cleanUpdateData.address = updateData.address?.trim();
    if (updateData.totalAmount !== undefined) cleanUpdateData.totalAmount = parseFloat(updateData.totalAmount) || 0;
    if (updateData.paidAmount !== undefined) cleanUpdateData.paidAmount = parseFloat(updateData.paidAmount) || 0;
    if (updateData.status) cleanUpdateData.status = updateData.status;
    if (updateData.notes !== undefined) cleanUpdateData.notes = updateData.notes?.trim();

    // Update customer
    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      cleanUpdateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Customer updated successfully',
      data: updatedCustomer
    });

  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating customer',
      error: error.message
    });
  }
};

// Delete customer
export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findByIdAndDelete(id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Customer deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting customer',
      error: error.message
    });
  }
};

// Get customer statistics
export const getCustomerStats = async (req, res) => {
  try {
    // Total customers
    const totalCustomers = await Customer.countDocuments();

    // Customers by payment status
    const paymentStatusStats = await Customer.aggregate([
      {
        $group: {
          _id: '$paymentStatus',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' },
          paidAmount: { $sum: '$paidAmount' }
        }
      }
    ]);

    // Customers by delivery type
    const deliveryTypeStats = await Customer.aggregate([
      {
        $group: {
          _id: '$deliveryType',
          count: { $sum: 1 }
        }
      }
    ]);

    // Customers by status
    const statusStats = await Customer.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Recent customers (last 7 days)
    const recentCustomers = await Customer.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    // Financial summary
    const financialSummary = await Customer.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$totalAmount' },
          paidAmount: { $sum: '$paidAmount' },
          remainingAmount: { $sum: '$remainingAmount' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalCustomers,
        recentCustomers,
        paymentStatusStats,
        deliveryTypeStats,
        statusStats,
        financialSummary: financialSummary[0] || {
          totalAmount: 0,
          paidAmount: 0,
          remainingAmount: 0
        }
      }
    });

  } catch (error) {
    console.error('Error fetching customer statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching customer statistics',
      error: error.message
    });
  }
};

// Search customers by bilty number
export const searchCustomerByBilty = async (req, res) => {
  try {
    const { biltyNumber } = req.params;

    const customer = await Customer.findOne({ biltyNumber })
      .populate('createdBy', 'name email');

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer with this bilty number not found'
      });
    }

    res.status(200).json({
      success: true,
      data: customer
    });

  } catch (error) {
    console.error('Error searching customer:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching customer',
      error: error.message
    });
  }
};