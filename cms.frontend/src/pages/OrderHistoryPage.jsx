import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import orderService from '../services/orderService';
import { formatPrice, formatDate } from '../utils/formatters';
import LoadingSpinner from '../components/LoadingSpinner';

const statusMap = {
    0: { label: 'Chờ duyệt', color: '#f59e0b', bg: '#fef3c7', icon: 'fa-clock' },
    1: { label: 'Đang giao', color: '#3b82f6', bg: '#dbeafe', icon: 'fa-truck' },
    2: { label: 'Đã hoàn thành', color: '#10b981', bg: '#d1fae5', icon: 'fa-circle-check' }
};

const OrderHistoryPage = () => {
    const { addToast } = useToast();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const customerId = localStorage.getItem('customerId');
    const fullName = localStorage.getItem('fullName');

    useEffect(() => {
        if (!customerId) {
            addToast('Vui lòng đăng nhập để xem lịch sử đơn hàng!', 'warning');
            setLoading(false);
            return;
        }

        const fetchOrders = async () => {
            try {
                setLoading(true);
                const data = await orderService.getByCustomer(customerId);
                setOrders(data);
            } catch (error) {
                console.error('Lỗi tải đơn hàng:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [customerId]);

    if (loading) return <LoadingSpinner message="Đang tải lịch sử đơn hàng..." />;

    if (!customerId) {
        return (
            <div className="text-center my-5">
                <i className="fa-solid fa-right-to-bracket fa-4x text-muted mb-3"></i>
                <h4>Vui lòng đăng nhập</h4>
                <p className="text-muted">Bạn cần đăng nhập để xem lịch sử đơn hàng.</p>
                <Link to="/login" className="btn btn-primary mt-2">
                    <i className="fa-solid fa-right-to-bracket mr-2"></i>Đăng nhập
                </Link>
            </div>
        );
    }

    return (
        <div>
            <div className="breadcrumb-nav mb-4">
                <Link to="/">Trang chủ</Link>
                <i className="fa-solid fa-chevron-right mx-2"></i>
                <span>Lịch sử đơn hàng</span>
            </div>

            <h3 className="mb-4">
                <i className="fa-solid fa-receipt mr-2 text-primary"></i>
                Đơn hàng của {fullName || 'bạn'}
            </h3>

            {orders.length === 0 ? (
                <div className="text-center py-5 bg-white rounded shadow-sm">
                    <i className="fa-solid fa-bag-shopping fa-4x text-muted mb-3"></i>
                    <h5 className="text-muted">Chưa có đơn hàng nào</h5>
                    <p className="text-muted">Hãy mua sắm để tạo đơn hàng đầu tiên!</p>
                    <Link to="/" className="btn btn-primary mt-2">
                        <i className="fa-solid fa-bag-shopping mr-2"></i>Mua sắm ngay
                    </Link>
                </div>
            ) : (
                <div className="order-history-list">
                    {orders.map(order => {
                        const status = statusMap[order.status] || statusMap[0];
                        return (
                            <div className="order-card" key={order.id}>
                                <div className="order-card-header">
                                    <div>
                                        <span className="order-id">#{order.id}</span>
                                        <span className="order-date">
                                            <i className="fa-regular fa-calendar mr-1"></i>
                                            {formatDate(order.orderDate)}
                                        </span>
                                    </div>
                                    <span className="order-status" style={{ color: status.color, background: status.bg }}>
                                        <i className={`fa-solid ${status.icon} mr-1`}></i>
                                        {status.label}
                                    </span>
                                </div>

                                <div className="order-card-items">
                                    {order.items.map((item, idx) => (
                                        <div className="order-item-row" key={idx}>
                                            <span className="order-item-name">{item.productName}</span>
                                            <span className="order-item-qty">x{item.quantity}</span>
                                            <span className="order-item-price">{formatPrice(item.unitPrice)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="order-card-footer">
                                    <span className="order-total">
                                        Tổng cộng: <strong>{formatPrice(order.totalAmount)}</strong>
                                    </span>
                                    {order.notes && (
                                        <span className="order-notes text-muted">
                                            <i className="fa-solid fa-sticky-note mr-1"></i>
                                            {order.notes}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default OrderHistoryPage;
