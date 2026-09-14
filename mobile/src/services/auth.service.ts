import api from '../api/client';

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

    return res.data;
}
