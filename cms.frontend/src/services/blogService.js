import axiosClient from '../api/axiosClient';

const blogService = {
    getAllPosts: () => {
        const url = '/Posts';
        return axiosClient.get(url);
    },
    getPostById: (id) => {
        const url = `/Posts/${id}`;
        return axiosClient.get(url);
    },
    getBlogCategories: () => {
        const url = '/Categories';
        return axiosClient.get(url);
    }
};

export default blogService;
