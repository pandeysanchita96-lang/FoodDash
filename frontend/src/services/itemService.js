import api from './api';

const getAllItems = async (search = '', category = '') => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category);

    const response = await api.get(`/public/items?${params.toString()}`);
    return response.data;
};

const getCategories = async () => {
    const response = await api.get('/public/items/categories');
    return response.data;
};

const getVendorItemsPublic = async (vendorId) => {
    const response = await api.get(`/public/vendors/${vendorId}/items`);
    return response.data;
};

const getVendorItems = async () => {
    const response = await api.get('/vendor/items');
    return response.data;
};

const addItem = async (itemData) => {
    const response = await api.post('/vendor/items', itemData);
    return response.data;
};

const updateItem = async (itemId, itemData) => {
    const response = await api.put(`/vendor/items/${itemId}`, itemData);
    return response.data;
};

const deleteItem = async (itemId) => {
    const response = await api.delete(`/vendor/items/${itemId}`);
    return response.data;
};

const itemService = {
    getAllItems,
    getCategories,
    getVendorItemsPublic,
    getVendorItems,
    addItem,
    updateItem,
    deleteItem
};

export default itemService;
