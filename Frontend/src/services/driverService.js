import axios from 'axios';

import { API_BASE_URL } from './config';
const API_URL = `${API_BASE_URL}/drivers`;

export const getAllDrivers = async () => {
  const response = await axios.get(API_URL);
  return response.data.data;
};

export const getDriverById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data.data;
};

export const createDriver = async (driver) => {
  const response = await axios.post(API_URL, driver);
  return response.data.data;
};

export const updateDriver = async (id, driver) => {
  const response = await axios.put(`${API_URL}/${id}`, driver);
  return response.data.data;
};

export const deleteDriver = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};