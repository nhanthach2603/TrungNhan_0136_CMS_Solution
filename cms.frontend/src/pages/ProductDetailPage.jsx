import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import productService from '../services/productService';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';
import BreadcrumbNav from '../components/BreadcrumbNav';
import { formatPrice } from '../utils/formatters';

const ProductDetailPage = () => {
    const { id } = useParams();
    const { addToCart } = useCart();
    
    // States
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [recommendations, setRecommendations] = useState([]);
    
    // Frequently bought checkboxes state
    const [buyWithItems, setBuyWithItems] = useState({});

    useEffect(() => {
        const fetchProductAndRecommendations = async () => {
            try {
                setLoading(true);
                const [productData, allProducts] = await Promise.all([
                    productService.getProductById(id),
                    productService.getAllProducts().catch(() => [])
                ]);
                setProduct(productData);
                
                // Get 2 random products from same category or other categories
                const filtered = allProducts.filter(p => p.id !== Number(id) && p.id !== id);
                if (filtered.length > 0) {
                    const shuffled = filtered.sort(() => 0.5 - Math.random());
                    const selected = shuffled.slice(0, 2);
                    setRecommendations(selected);
                    
                    // Default to checked
                    const initialChecked = {};
                    selected.forEach(item => {
                        initialChecked[item.id] = true;
                    });
                    setBuyWithItems(initialChecked);
                }
            } catch (error) {
                console.error("Lỗi khi tải chi tiết sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProductAndRecommendations();
    }, [id]);

    // formatPrice imported from utils/formatters.js

    const handleCheckboxChange = (itemId) => {
        setBuyWithItems(prev => ({
            ...prev,
            [itemId]: !prev[itemId]
        }));
    };

    const handleAddComboToCart = () => {
        if (!product) return;
        if (product.stockQuantity <= 0) return;
        addToCart(product, quantity);
        recommendations.forEach(item => {
            if (buyWithItems[item.id] && item.stockQuantity > 0) {
                addToCart(item, 1);
            }
        });
    };

    if (loading) return <LoadingSpinner message="Đang tải chi tiết sản phẩm..." />;

    if (!product) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger">Không tìm thấy thông tin chi tiết sản phẩm!</div>
            </div>
        );
    }

    // Calculate Combo Total
    const getComboTotal = () => {
        let total = product.price * quantity;
        recommendations.forEach(item => {
            if (buyWithItems[item.id]) {
                total += item.price;
            }
        });
        return total;
    };

    return (
        <div className="product-detail-page-wrapper">
            <BreadcrumbNav items={[
                { label: 'Trang chủ', to: '/' },
                { label: product.categoryProductName || 'Máy ảnh', to: `/?category=${product.categoryProductId}` },
                { label: product.name }
            ]} />

            <div className="product-detail-card mt-3">
                <div className="row">
                    {/* LEFT COLUMN: IMAGES */}
                    <div className="col-md-5 text-center">
                        <div className="product-detail-image-box">
                            {product.imageUrl ? (
                                <img src={product.imageUrl} alt={product.name} className="img-fluid main-detail-image" />
                            ) : (
                                <div className="detail-empty-img">
                                    <i className="fa-solid fa-camera fa-5x"></i>
                                </div>
                            )}
                        </div>
                        {/* Thumbnail Row Mock */}
                        <div className="product-detail-thumbnails mt-3">
                            <div className="thumb-item active">
                                <img src={product.imageUrl || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=80&q=80'} alt="thumb" />
                            </div>
                            <div className="thumb-item">
                                <img src="https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=80&q=80" alt="thumb" />
                            </div>
                            <div className="thumb-item">
                                <img src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=80&q=80" alt="thumb" />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: INFORMATION */}
                    <div className="col-md-7">
                        <div className="product-detail-info-box">
                            <span className="badge badge-cat-gold mb-2">{product.categoryProductName}</span>
                            <h2 className="detail-product-title">{product.name}</h2>
                            
                            <div className="detail-rating-row mb-3">
                                <span className="stars-rating"><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i></span>
                                <span className="reviews-count text-muted ml-2">(4.9/5 dựa trên 32 đánh giá)</span>
                            </div>

                            <div className="detail-price-box mb-3">
                                <div className="detail-price-text">{formatPrice(product.price)}</div>
                                <div className="detail-status-text">
                                    Trạng thái: <span className={product.stockQuantity > 0 ? "text-success font-weight-bold" : "text-danger"}>
                                        {product.stockQuantity > 0 ? "Còn hàng" : "Hết hàng"} ({product.stockQuantity} sản phẩm tại cửa hàng)
                                    </span>
                                </div>
                            </div>

                            {/* Service Perks box */}
                            <div className="detail-perks-box mb-4">
                                <h5><i className="fa-solid fa-gift text-warning mr-2"></i> KHUYẾN MÃI & QUÀ TẶNG:</h5>
                                <ul>
                                    <li><i className="fa-solid fa-check"></i> Bảo hành chính hãng 12-24 tháng toàn quốc.</li>
                                    <li><i className="fa-solid fa-check"></i> Miễn phí vệ sinh máy ảnh & ống kính trọn đời tại hệ thống.</li>
                                    <li><i className="fa-solid fa-check"></i> Giảm 20% khi mua kèm kính lọc UV hoặc thẻ nhớ tốc độ cao.</li>
                                    <li><i className="fa-solid fa-check"></i> Tặng ngay cẩm nang hướng dẫn chụp ảnh và túi đựng máy chuyên nghiệp.</li>
                                </ul>
                            </div>

                            {/* Selector Quantity & Actions */}
                            <div className="detail-actions-section">
                                <div className="d-flex align-items-center mb-3">
                                    <span className="font-weight-bold mr-3" style={{ marginRight: '15px' }}>Số lượng:</span>
                                    <div className="qty-selector">
                                        <button 
                                            type="button"
                                            onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                            disabled={quantity <= 1}
                                        >
                                            <i className="fa-solid fa-minus"></i>
                                        </button>
                                        <input 
                                            type="number" 
                                            value={quantity} 
                                            readOnly 
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => setQuantity(prev => Math.min(product.stockQuantity, prev + 1))}
                                            disabled={quantity >= product.stockQuantity}
                                        >
                                            <i className="fa-solid fa-plus"></i>
                                        </button>
                                    </div>
                                </div>

                                <div className="d-flex gap-3 mt-4">
                                    <button 
                                        className="btn btn-warning btn-lg font-weight-bold text-white btn-add-cart-detail"
                                        onClick={() => addToCart(product, quantity)}
                                        disabled={product.stockQuantity <= 0}
                                        style={{ background: 'var(--mint)', borderColor: 'var(--mint)', display: 'flex', alignItems: 'center', gap: '8px', opacity: product.stockQuantity <= 0 ? 0.5 : 1 }}
                                    >
                                        <i className="fa-solid fa-cart-plus"></i> {product.stockQuantity <= 0 ? 'HẾT HÀNG' : 'THÊM VÀO GIỎ HÀNG'}
                                    </button>
                                    <button 
                                        className="btn btn-danger btn-lg font-weight-bold btn-buy-now-detail"
                                        onClick={() => addToCart(product, quantity)}
                                        disabled={product.stockQuantity <= 0}
                                        style={{ background: 'var(--red)', borderColor: 'var(--red)', marginLeft: '12px', opacity: product.stockQuantity <= 0 ? 0.5 : 1 }}
                                    >
                                        {product.stockQuantity <= 0 ? 'HẾT HÀNG' : 'MUA NGAY GIAO LIỀN 2H'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FREQUENTLY BOUGHT TOGETHER SECTION (MAYANH24H STYLE) */}
            {recommendations.length > 0 && (
                <div className="frequently-bought-wrapper mt-5">
                    <h3 className="section-title-frequent">
                        <i className="fa-solid fa-circle-nodes text-warning mr-2" style={{ marginRight: '8px' }}></i>
                        THƯỜNG ĐƯỢC MUA CÙNG NHAU (COMBO GỢI Ý)
                    </h3>
                    <div className="frequently-bought-content mt-3">
                        <div className="combo-images-flow">
                            {/* Main Product */}
                            <div className="combo-item-image">
                                <img src={product.imageUrl || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=120&q=80'} alt={product.name} />
                                <span>Gốc</span>
                            </div>

                            {recommendations.map((item, idx) => (
                                <React.Fragment key={`combo-img-${item.id}`}>
                                    <div className="combo-connector">
                                        <i className="fa-solid fa-plus"></i>
                                    </div>
                                    <div className={`combo-item-image ${!buyWithItems[item.id] ? 'unchecked' : ''}`}>
                                        <img src={item.imageUrl || 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=120&q=80'} alt={item.name} />
                                        <span>Gợi ý {idx + 1}</span>
                                    </div>
                                </React.Fragment>
                            ))}
                        </div>

                        <div className="combo-checkboxes-list">
                            <div className="combo-check-row active">
                                <input type="checkbox" checked disabled />
                                <span className="item-name font-weight-bold">Sản phẩm này: {product.name}</span>
                                <span className="item-price text-danger font-weight-bold">{formatPrice(product.price)}</span>
                            </div>
                            {recommendations.map(item => (
                                <div className="combo-check-row" key={`combo-check-${item.id}`}>
                                    <input 
                                        type="checkbox" 
                                        checked={buyWithItems[item.id] || false}
                                        onChange={() => handleCheckboxChange(item.id)}
                                    />
                                    <span className="item-name" onClick={() => handleCheckboxChange(item.id)}>{item.name}</span>
                                    <span className="item-price text-danger">{formatPrice(item.price)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="combo-action-box">
                            <div className="combo-total-label">Tổng tiền Combo:</div>
                            <div className="combo-total-price">{formatPrice(getComboTotal())}</div>
                            <button className="btn-add-combo" onClick={handleAddComboToCart}>
                                <i className="fa-solid fa-cart-shopping mr-1"></i> Mua Trọn Gói Combo
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* PRODUCT DESCRIPTION DESCRIPTION */}
            <div className="product-description-tabs-wrapper mt-5">
                <div className="tabs-header-strip">
                    <button className="desc-tab-btn active">MÔ TẢ CHI TIẾT SẢN PHẨM</button>
                </div>
                <div className="desc-tab-content">
                    <h5 className="mb-3 font-weight-bold text-dark">THÔNG SỐ KỸ THUẬT NỔI BẬT:</h5>
                    <ul className="detail-technical-specs mb-4">
                        <li><strong>Loại thiết bị:</strong> {product.categoryProductName || 'Máy quay / Máy ảnh kỹ thuật số'}</li>
                        <li><strong>Bộ xử lý ảnh:</strong> Cao cấp, giảm nhiễu tối ưu, cân bằng trắng tự động</li>
                        <li><strong>Hỗ trợ quay phim:</strong> 4K UHD, Full HD sắc nét từng chi tiết</li>
                        <li><strong>Kết nối không dây:</strong> Wi-Fi, Bluetooth kết nối nhanh với điện thoại</li>
                        <li><strong>Chế độ lấy nét:</strong> Lấy nét tự động theo mắt (Eye AF) thông minh</li>
                    </ul>

                    {product.description ? (
                        <div className="desc-text-content" style={{ whiteSpace: 'pre-line', lineHeight: '1.8', color: 'var(--text-gray)' }}>
                            {product.description}
                        </div>
                    ) : (
                        <p className="text-muted">Đang cập nhật nội dung giới thiệu chi tiết cho sản phẩm này từ hãng sản xuất...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
