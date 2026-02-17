import api from './api';

const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
};

const registerVendor = async (registerData) => {
    const response = await api.post('/auth/register-vendor', registerData);
    return response.data;
};

const forgotPassword = async (email) => {
    const response = await api.post(`/auth/forgot-password?email=${email}`);
    return response.data;
};

const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

const authService = {
    login,
    logout,
    register,
    registerVendor,
    forgotPassword,
    getCurrentUser
};

export default authService;
