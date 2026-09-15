import api from '../api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface RegistrationData {
    name: string;
    email: string;
    password: string;
}
interface LoginData {
    email: string;
    password: string;
}
export const registerUser = async (data: RegistrationData) => {
    const res = await api.post("/auth/v1/register", data);

    return res.data;
}
export const loginUser = async (data: LoginData) => {
    const res = await api.post("/auth/v1/login", data);

    await AsyncStorage.setItem("token", res.data.result.token);

    return res.data;
}
export const getMe = async () => {
    const res = await api.get("/auth/v1/me");
    
    return res.data;
}
