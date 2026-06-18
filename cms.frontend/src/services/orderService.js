import axiosClient from '../api/axiosClient';

const orderService = {
    getByCustomer: (customerId) => {
        return axiosClient.get(`/Orders/customer/${customerId}`);
    }
};

export default orderService;
