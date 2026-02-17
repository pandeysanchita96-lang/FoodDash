import api from './api';

const getFavorites = async () => {
    const response = await api.get('/user/favorites');
    return response.data;
};

const toggleFavorite = async (vendorId) => {
    const response = await api.post(`/user/favorites/${vendorId}`);
    return response.data;
};

const favoriteService = {
    getFavorites,
    toggleFavorite
};

export default favoriteService;
