import React from 'react';

/**
 * LoadingSpinner — Component hiển thị trạng thái đang tải
 * @param {string} message - Thông báo hiển thị bên dưới spinner
 */
const LoadingSpinner = ({ message = 'Đang tải dữ liệu...' }) => {
    return (
        <div className="loading-spinner">
            <div className="spinner-border text-warning"></div>
            <p className="mt-2 text-muted">{message}</p>
        </div>
    );
};

export default LoadingSpinner;
