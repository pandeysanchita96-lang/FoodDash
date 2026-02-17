import api from './api';

const getApprovedVendors = async () => {
    const response = await api.get('/public/vendors');
    return response.data;
};

const searchVendors = async (q, category) => {
    const params = {};
    if (q) params.q = q;
    if (category) params.category = category;
    const response = await api.get('/public/vendors/search', { params });
    return response.data;
};

const globalSearch = async (query) => {
    const response = await api.get('/public/search/global', { params: { q: query } });
    return response.data;
};

const vendorService = {
    getApprovedVendors,
    searchVendors,
    globalSearch
};

export default vendorService;
