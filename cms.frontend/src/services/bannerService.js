import axiosClient from '../api/axiosClient';

const bannerService = {
    getAll: () => {
        return axiosClient.get('/BannerImages');
    }
};

export default bannerService;
