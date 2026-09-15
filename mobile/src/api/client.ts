import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'http://192.168.31.83:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async store => {
    const token = await AsyncStorage.getItem("token");
    if(token){
        store.headers.Authorization = `Bearer ${token}`;
    }
    return store;
})

export default api;
