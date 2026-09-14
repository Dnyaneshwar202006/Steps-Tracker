import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.31.83:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
