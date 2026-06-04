import axiosClient from '../api/axiosClient';

const blogService = {
    getAllPosts: () => {
        const url = '/Posts';
        return axiosClient.get(url);
    }
};

export default blogService;
