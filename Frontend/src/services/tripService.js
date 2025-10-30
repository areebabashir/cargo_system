import axios from 'axios';

import { API_BASE_URL } from './config';
const API_URL = `${API_BASE_URL}/trips`;

export const getAllTrips = async () => {
  const response = await axios.get(API_URL);
  console.log(response.data.data);
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