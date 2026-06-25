import axios from 'axios';

const axiosClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5175/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

axiosClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        console.error('Lỗi kết nối API:', error.message);
        return Promise.reject(error);
    }
);

export default axiosClient;
