import axios from 'axios';

const API_URL = 'http://localhost:8000/api/rent-payments';

// Get all rent payments
export const getAllRentPayments = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching rent payments:', error);
    throw error;
  }
};

// Get rent payments by shop ID
export const getRentPaymentsByShop = async (shopId) => {
  try {
    const response = await axios.get(`${API_URL}/shop/${shopId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching rent payments by shop:', error);
    throw error;
  }
};

// Create a new rent payment
export const createRentPayment = async (rentPaymentData) => {
  try {
    const response = await axios.post(API_URL, rentPaymentData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating rent payment:', error);
    throw error;
  }
};

// Get rent payment by ID
export const getRentPaymentById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching rent payment:', error);
    throw error;
  }
};

// Update rent payment
export const updateRentPayment = async (id, rentPaymentData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, rentPaymentData);
    return response.data.data;
  } catch (error) {
    console.error('Error updating rent payment:', error);
    throw error;
  }
};

// Delete rent payment
export const deleteRentPayment = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting rent payment:', error);
    throw error;
  }
}; 