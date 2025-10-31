import axios from 'axios';

const API_URL = 'http://localhost:8000/api/trips';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const getAllTrips = async () => {
  const token = getAuthToken();
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  console.log(response.data.data);
  return response.data.data;
};

export const getTripById = async (id) => {
  const token = getAuthToken();
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data.data;
};

export const createTrip = async (trip) => {
  const token = getAuthToken();
  const response = await axios.post(API_URL, trip, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data.data;
};

export const updateTrip = async (id, trip) => {
  const token = getAuthToken();
  const response = await axios.put(`${API_URL}/${id}`, trip, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data.data;
};

export const deleteTrip = async (id) => {
  const token = getAuthToken();
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};