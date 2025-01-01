// src/axiosConfig.js
import axios from 'axios';
import { ADDRESS } from './constants/variables';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

// Create an instance of axios
const axiosInstance = axios.create({
  baseURL: `${BACKEND_URL}`, // Set the base URL
  timeout: 15000, // Optional: Set a timeout (in milliseconds)
});

export default axiosInstance;
