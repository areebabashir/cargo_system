import axios from 'axios';

const API_URL = 'http://localhost:8000/api/trips';

export const getAllTrips = async () => {
  const response = await axios.get(API_URL);
  return response.data.data;
};

export const getTripById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data.data;
};

export const createTrip = async (trip) => {
  const response = await axios.post(API_URL, trip);
  return response.data.data;
};

export const updateTrip = async (id, trip) => {
  const response = await axios.put(`${API_URL}/${id}`, trip);
  return response.data.data;
};

export const deleteTrip = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};