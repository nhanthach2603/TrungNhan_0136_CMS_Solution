import axiosClient from '../api/axiosClient';

const authService = {
    register: (data) => {
        return axiosClient.post('/Auth/CustomerRegister', data);
    },
    login: (data) => {
        return axiosClient.post('/Auth/CustomerLogin', data);
    }
};

export default authService;
