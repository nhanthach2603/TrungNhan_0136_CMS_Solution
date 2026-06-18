import React from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/formatters';
import { useCart } from '../context/CartContext';

/**
 * ProductCard — Component card sản phẩm tái sử dụng
 * @param {object} item    - Đối tượng sản phẩm
 * @param {string} badge   - (Tuỳ chọn) Nhãn badge hiển thị góc ảnh (VD: "Bán chạy", "Mới")
 * @param {boolean} showDetail - (Tuỳ chọn) Hiển thị icon trên nút chi tiết (default: false)
 *
 * @example
 * <ProductCard item={product} badge="Bán chạy" />
 */
const ProductCard = ({ item, badge = null, showDetailIcon = false }) => {
    const { addToCart } = useCart();

    return (
        <div className="product-card">
            <div className="product-card-img">
                {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} />
                ) : (
                    <div className="empty-img-placeholder">
                        <i className="fa-solid fa-camera fa-3x"></i>
                    </div>
                )}
                {badge && (
                    <span className="product-badge badge-bestseller">{badge}</span>
                )}
            </div>
            <div className="product-card-body">
                <h3 className="product-card-title">{item.name}</h3>
                <div className="product-card-price">{formatPrice(item.price)}</div>
                <div className="product-card-actions">
                    <Link to={`/product/${item.id}`} className="btn-detail">
                        {showDetailIcon && <i className="fa-solid fa-eye"></i>} Chi tiết
                    </Link>
                    <button className="btn-buy" onClick={() => addToCart(item, 1)}>
                        <i className="fa-solid fa-cart-plus"></i> Mua ngay
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
