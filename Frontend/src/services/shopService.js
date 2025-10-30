import axios from 'axios';

import { API_BASE_URL } from './config';
const API_URL = `${API_BASE_URL}/shops`;

// Get all shops
export const getAllShops = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching shops:', error);
    throw error;
  }
};

// Create a new shop
export const createShop = async (shopData) => {
  try {
    const response = await axios.post(API_URL, shopData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating shop:', error);
    throw error;
  }
};

// Get shop by ID
export const getShopById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching shop:', error);
    throw error;
  }
};

// Update shop
export const updateShop = async (id, shopData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, shopData);
    return response.data.data;
  } catch (error) {
    console.error('Error updating shop:', error);
    throw error;
  }
};

// Delete shop
export const deleteShop = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting shop:', error);
    throw error;
  }
};

// Get shop with rent payments
export const getShopWithRentPayments = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}/rent-payments`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching shop with rent payments:', error);
    throw error;
  }
}; 