import api from './api';

const getVendorReviews = async (vendorId) => {
    const response = await api.get(`/public/vendors/${vendorId}/reviews`);
    return response.data;
};

const addReview = async (reviewData) => {
    const response = await api.post('/user/reviews', reviewData);
    return response.data;
};

const reviewService = {
    getVendorReviews,
    addReview
};

export default reviewService;
