import axiosClient from '../api/axiosClient';

const productService = {
    getAllProducts: () => {
        const url = '/Products';
        return axiosClient.get(url);
    },
    getProductsByCategory: (categoryProductId) => {
        const url = `/Products/category/${categoryProductId}`;
        return axiosClient.get(url);
    }
};

export default productService;
