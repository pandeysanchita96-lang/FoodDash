import api from './api';

const getAllUsers = async () => {
    const response = await api.get('/admin/users');
    return response.data;
};

const getAllVendors = async () => {
    const response = await api.get('/admin/vendors');
    return response.data;
};

const approveVendor = async (vendorId, approved) => {
    const response = await api.patch(`/admin/vendors/${vendorId}/approve?approved=${approved}`);
    return response.data;
};

const toggleUserActive = async (userId, active) => {
    const response = await api.patch(`/admin/users/${userId}/active?active=${active}`);
    return response.data;
};

const getAllOrders = async () => {
    const response = await api.get('/admin/orders');
    return response.data;
};

const getPlatformStats = async () => {
    const response = await api.get('/admin/stats');
    return response.data;
};

const adminService = {
    getAllUsers,
    getAllVendors,
    approveVendor,
    toggleUserActive,
    getAllOrders,
    getPlatformStats
};

export default adminService;
