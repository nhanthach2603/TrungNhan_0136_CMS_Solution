import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import axiosClient from '../api/axiosClient';
import { formatPrice } from '../utils/formatters';

const CartDrawer = () => {
    const {
        cart,
        isCartOpen,
        setIsCartOpen,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount
    } = useCart();

    const { addToast } = useToast();

    // Steps: 'cart' | 'checkout' | 'success'
    const [step, setStep] = useState('cart');
    const [checkoutForm, setCheckoutForm] = useState({
        fullName: '',
        phone: '',
        address: '',
        paymentMethod: 'COD'
    });
    const [orderId, setOrderId] = useState('');
    const [loading, setLoading] = useState(false);

    // Pre-fill full name if customer is logged in
    useEffect(() => {
        if (isCartOpen) {
            const loggedInName = localStorage.getItem('fullName') || '';
            setCheckoutForm(prev => ({
                ...prev,
                fullName: prev.fullName || loggedInName
            }));
        } else {
            // Reset state when drawer closes
            setTimeout(() => {
                setStep('cart');
            }, 300);
        }
    }, [isCartOpen]);

    // formatPrice imported from utils/formatters.js

    const handleFormChange = (e) => {
        setCheckoutForm({
            ...checkoutForm,
            [e.target.name]: e.target.value
        });
    };

    const handleCheckoutSubmit = async (e) => {
        e.preventDefault();
        
        const customerId = localStorage.getItem('customerId');
        if (!customerId) {
            addToast('Vui lòng đăng nhập tài khoản trước khi thanh toán!', 'warning');
            return;
        }

        if (!checkoutForm.fullName || !checkoutForm.phone || !checkoutForm.address) {
            addToast('Vui lòng điền đầy đủ thông tin giao hàng!', 'warning');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                customerId: Number(customerId),
                notes: `SĐT: ${checkoutForm.phone} | Địa chỉ: ${checkoutForm.address} | PTTT: ${checkoutForm.paymentMethod}`,
                items: cart.map(item => ({
                    productId: item.id,
                    quantity: item.quantity
                }))
            };

            const response = await axiosClient.post('/Orders', payload);
            setOrderId(response.orderId || ('DH' + response.orderId));
            setStep('success');
            clearCart();
            addToast('Đặt hàng thành công! Cảm ơn quý khách.', 'success');
        } catch (err) {
            console.error('Lỗi đặt hàng API:', err);
            const errMsg = err.response?.data?.message || 'Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!';
            addToast(errMsg, 'error');
        } finally {
            setLoading(false);
        }
    };

    if (!isCartOpen) return null;

    return (
        <div className="cart-drawer-backdrop" onClick={() => setIsCartOpen(false)}>
            <div className="cart-drawer-container" onClick={(e) => e.stopPropagation()}>
                {/* DRAWER HEADER */}
                <div className="cart-drawer-header">
                    <h3>
                        <i className="fa-solid fa-bag-shopping mr-2 text-primary"></i> 
                        {step === 'cart' && 'Giỏ Hàng Của Bạn'}
                        {step === 'checkout' && 'Thông Tin Giao Hàng'}
                        {step === 'success' && 'Đặt Hàng Thành Công'}
                    </h3>
                    <button className="cart-drawer-close" onClick={() => setIsCartOpen(false)}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                {/* STEP 1: CART ITEMS LIST */}
                {step === 'cart' && (
                    <>
                        <div className="cart-drawer-body">
                            {cart.length === 0 ? (
                                <div className="cart-empty-state">
                                    <div className="empty-icon-wrapper">
                                        <i className="fa-solid fa-basket-shopping"></i>
                                    </div>
                                    <p className="empty-text">Giỏ hàng của bạn đang trống</p>
                                    <button className="btn-shop-now" onClick={() => setIsCartOpen(false)}>
                                        Mua sắm ngay
                                    </button>
                                </div>
                            ) : (
                                <div className="cart-items-list">
                                    {cart.map(item => (
                                        <div className="cart-item-row" key={item.id}>
                                            <div className="cart-item-img">
                                                {item.imageUrl ? (
                                                    <img src={item.imageUrl} alt={item.name} />
                                                ) : (
                                                    <div className="empty-img-placeholder">
                                                        <i className="fa-solid fa-image"></i>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="cart-item-info">
                                                <h4 className="cart-item-name">{item.name}</h4>
                                                <div className="cart-item-meta">{item.categoryProductName}</div>
                                                <div className="cart-item-price">{formatPrice(item.price)}</div>
                                                
                                                <div className="cart-item-actions">
                                                    <div className="qty-selector">
                                                        <button 
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            <i className="fa-solid fa-minus"></i>
                                                        </button>
                                                        <input 
                                                            type="number" 
                                                            value={item.quantity} 
                                                            readOnly 
                                                        />
                                                        <button 
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        >
                                                            <i className="fa-solid fa-plus"></i>
                                                        </button>
                                                    </div>
                                                    <button className="btn-remove-item" onClick={() => removeFromCart(item.id)}>
                                                        <i className="fa-solid fa-trash-can"></i> Xóa
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {cart.length > 0 && (
                            <div className="cart-drawer-footer">
                                <div className="cart-summary-row">
                                    <span>Tạm tính:</span>
                                    <strong className="cart-total-amount">{formatPrice(cartTotal)}</strong>
                                </div>
                                <div className="cart-actions-row">
                                    <button className="btn-checkout-submit" onClick={() => setStep('checkout')}>
                                        Tiến Hành Thanh Toán <i className="fa-solid fa-arrow-right ml-1"></i>
                                    </button>
                                    <button className="btn-clear-cart" onClick={clearCart}>
                                        <i className="fa-solid fa-broom mr-1"></i> Xóa tất cả
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* STEP 2: CHECKOUT FORM */}
                {step === 'checkout' && (
                    <form onSubmit={handleCheckoutSubmit} className="checkout-form-wrapper">
                        <div className="cart-drawer-body">
                            <div className="order-summary-box mb-4">
                                <h5>Tóm tắt đơn hàng</h5>
                                <div className="d-flex justify-content-between text-muted small py-1">
                                    <span>Số lượng mặt hàng:</span>
                                    <span>{cartCount} sản phẩm</span>
                                </div>
                                <div className="d-flex justify-content-between font-weight-bold pt-2 border-top">
                                    <span>Tổng số tiền:</span>
                                    <span className="text-danger">{formatPrice(cartTotal)}</span>
                                </div>
                            </div>

                            <div className="form-group mb-3">
                                <label className="form-label font-weight-bold">Họ và tên người nhận</label>
                                <input 
                                    type="text" 
                                    name="fullName" 
                                    value={checkoutForm.fullName} 
                                    onChange={handleFormChange} 
                                    className="form-control" 
                                    placeholder="Nguyễn Văn A" 
                                    required 
                                />
                            </div>

                            <div className="form-group mb-3">
                                <label className="form-label font-weight-bold">Số điện thoại</label>
                                <input 
                                    type="tel" 
                                    name="phone" 
                                    value={checkoutForm.phone} 
                                    onChange={handleFormChange} 
                                    className="form-control" 
                                    placeholder="09xx xxx xxx" 
                                    required 
                                />
                            </div>

                            <div className="form-group mb-3">
                                <label className="form-label font-weight-bold">Địa chỉ giao hàng</label>
                                <textarea 
                                    name="address" 
                                    value={checkoutForm.address} 
                                    onChange={handleFormChange} 
                                    className="form-control" 
                                    rows="3" 
                                    placeholder="Số 123, Đường ABC, Quận/Huyện, Tỉnh/Thành phố" 
                                    required 
                                ></textarea>
                            </div>

                            <div className="form-group mb-3">
                                <label className="form-label font-weight-bold">Phương thức thanh toán</label>
                                <div className="payment-options">
                                    <label className={`payment-option-label ${checkoutForm.paymentMethod === 'COD' ? 'active' : ''}`}>
                                        <input 
                                            type="radio" 
                                            name="paymentMethod" 
                                            value="COD" 
                                            checked={checkoutForm.paymentMethod === 'COD'}
                                            onChange={handleFormChange} 
                                        />
                                        <span className="ml-2">
                                            <i className="fa-solid fa-truck-ramp-box mr-1"></i>
                                            Thanh toán khi nhận hàng (COD)
                                        </span>
                                    </label>
                                    <label className={`payment-option-label ${checkoutForm.paymentMethod === 'BANK' ? 'active' : ''}`}>
                                        <input 
                                            type="radio" 
                                            name="paymentMethod" 
                                            value="BANK" 
                                            checked={checkoutForm.paymentMethod === 'BANK'}
                                            onChange={handleFormChange} 
                                        />
                                        <span className="ml-2">
                                            <i className="fa-solid fa-credit-card mr-1"></i>
                                            Chuyển khoản ngân hàng
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="cart-drawer-footer">
                            <button type="submit" className="btn-checkout-submit" disabled={loading}>
                                {loading ? (
                                    <><span className="spinner-border spinner-border-sm mr-2"></span>Đang xử lý...</>
                                ) : (
                                    <><i className="fa-solid fa-circle-check mr-1"></i> Đặt Hàng Ngay</>
                                )}
                            </button>
                            <button type="button" className="btn-back-to-cart" onClick={() => setStep('cart')}>
                                <i className="fa-solid fa-arrow-left mr-1"></i> Quay lại giỏ hàng
                            </button>
                        </div>
                    </form>
                )}

                {/* STEP 3: ORDER SUCCESS */}
                {step === 'success' && (
                    <div className="order-success-wrapper">
                        <div className="success-icon-container">
                            <i className="fa-solid fa-circle-check"></i>
                        </div>
                        <h4>Đặt Hàng Thành Công!</h4>
                        <p className="success-desc">
                            Cảm ơn quý khách đã tin tưởng và mua sắm tại <strong>camera24h.shop</strong>.
                        </p>
                        <div className="order-details-box">
                            <div className="detail-item">
                                <span>Mã đơn hàng:</span>
                                <strong>{orderId}</strong>
                            </div>
                            <div className="detail-item">
                                <span>Hình thức thanh toán:</span>
                                <span>{checkoutForm.paymentMethod === 'COD' ? 'COD (Thanh toán khi nhận hàng)' : 'Chuyển khoản ngân hàng'}</span>
                            </div>
                            {checkoutForm.paymentMethod === 'BANK' && (
                                <div className="bank-info mt-2">
                                    <p className="text-danger font-weight-bold mb-1">Thông tin chuyển khoản:</p>
                                    <div className="bank-detail">Nâng hàng: Vietcombank</div>
                                    <div className="bank-detail">STK: 1023948576</div>
                                    <div className="bank-detail">Chủ TK: CÔNG TY THAICMS FASHION</div>
                                    <div className="bank-detail">Cú pháp: Chuyển khoản {orderId}</div>
                                </div>
                            )}
                        </div>
                        <button className="btn-continue-shopping" onClick={() => setIsCartOpen(false)}>
                            Tiếp tục mua sắm
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartDrawer;
