import axios from 'axios';

const API_URL = 'http://localhost:8000/api/vehicles';

export const getAllVehicles = async () => {
  const response = await axios.get(API_URL);
  return response.data.data;
};

export const getVehicleById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data.data;
};

export const createVehicle = async (vehicle) => {
  const response = await axios.post(API_URL, vehicle);
  return response.data.data;
};

export const updateVehicle = async (id, vehicle) => {
  const response = await axios.put(`${API_URL}/${id}`, vehicle);
  return response.data.data;
};

export const deleteVehicle = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};