import React from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
    const icons = {
        success: 'fa-solid fa-circle-check',
        error: 'fa-solid fa-circle-xmark',
        warning: 'fa-solid fa-triangle-exclamation',
        info: 'fa-solid fa-circle-info'
    };

    return (
        <div className={`toast-item toast-${type}`}>
            <i className={`${icons[type]} toast-icon`}></i>
            <span className="toast-message">{message}</span>
            <button className="toast-close" onClick={onClose}>
                <i className="fa-solid fa-xmark"></i>
            </button>
        </div>
    );
};

export default Toast;
