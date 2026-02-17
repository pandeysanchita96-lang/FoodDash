import api from './api';

const createOrder = async (orderData) => {
    const response = await api.post('/user/orders', orderData);
    return response.data;
};

const getUserOrders = async () => {
    const response = await api.get('/user/orders');
    return response.data;
};

const getVendorOrders = async () => {
    const response = await api.get('/vendor/orders');
    return response.data;
};

const getVendorStats = async () => {
    const response = await api.get('/vendor/stats');
    return response.data;
};

const getAllOrders = async () => {
    const response = await api.get('/vendor/all-orders');
    return response.data;
};

const getAllStats = async () => {
    const response = await api.get('/vendor/all-stats');
    return response.data;
};

const updateOrderStatus = async (orderId, status) => {
    const response = await api.patch(`/vendor/orders/${orderId}/status?status=${status}`);
    return response.data;
};

const createPaymentOrder = async (amount) => {
    const response = await api.post('/payment/create-order', { amount });
    return response.data;
};

const orderService = {
    createOrder,
    getUserOrders,
    getVendorOrders,
    updateOrderStatus,
    getVendorStats,
    getAllOrders,
    getAllStats,
    createPaymentOrder
};

export default orderService;
