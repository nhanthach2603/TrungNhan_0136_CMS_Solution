import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import categoryProductService from '../services/categoryProductService';
import productService from '../services/productService';
import blogService from '../services/blogService';

const HomePage = () => {
    const [categories, setCategories] = useState([]);
    const [activeTab, setActiveTab] = useState(null);
    const [products, setProducts] = useState([]);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [catData, prodData, postData] = await Promise.all([
                    categoryProductService.getAllCategoryProducts(),
                    productService.getAllProducts(),
                    blogService.getAllPosts()
                ]);
                setCategories(catData);
                setProducts(prodData);
                setPosts(postData);
            } catch (error) {
                console.error("Lỗi tải dữ liệu:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredProducts = activeTab
        ? products.filter(p => p.categoryProductId === activeTab)
        : products;

    const formatPrice = (price) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    const formatDate = (date) =>
        new Date(date).toLocaleDateString('vi-VN');

    if (loading) {
        return (
            <div className="loading-spinner">
                <div className="spinner-border text-primary"></div>
                <p className="mt-2 text-muted">Đang tải dữ liệu...</p>
            </div>
        );
    }

    return (
        <>
            <div className="banner-dashed">Dành tự thực hành</div>

            {/* CATEGORY TABS */}
            <div className="category-tabs">
                <button
                    className={`tab-btn ${activeTab === null ? 'active' : ''}`}
                    onClick={() => setActiveTab(null)}
                >
                    TẤT CẢ SẢN PHẨM
                </button>
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        className={`tab-btn ${activeTab === cat.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(cat.id)}
                    >
                        {cat.name.toUpperCase()}
                    </button>
                ))}
            </div>

            {/* FEATURED PRODUCTS */}
            <div className="section-header">
                <h2 className="section-title">SẢN PHẨM NỔI BẬT</h2>
                <span className="section-count">Hiển thị ({filteredProducts.length}) sản phẩm</span>
            </div>

            <div className="product-grid">
                {filteredProducts.length === 0 ? (
                    <p className="text-muted" style={{ gridColumn: '1/-1', textAlign: 'center' }}>Không có sản phẩm nào.</p>
                ) : (
                    filteredProducts.map((item, index) => (
                        <div className="product-card" key={item.id}>
                            <div className="product-card-img">
                                {item.imageUrl ? (
                                    <img src={item.imageUrl} alt={item.name} />
                                ) : (
                                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                                        <i className="fa-solid fa-image fa-3x"></i>
                                    </div>
                                )}
                                {index < 3 && (
                                    <span className="product-badge">Bán chạy</span>
                                )}
                            </div>
                            <div className="product-card-body">
                                <h3 className="product-card-title">{item.name}</h3>
                                <div className="product-card-price">{formatPrice(item.price)}</div>
                                <div className="product-card-actions">
                                    <Link to={`/product/${item.id}`} className="btn-detail">
                                        <i className="fa-solid fa-eye"></i> Chi tiết
                                    </Link>
                                    <button className="btn-buy">
                                        <i className="fa-solid fa-cart-plus"></i> Mua ngay
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* BLOG SECTION */}
            <div className="section-title-center">
                <h2>XU HƯỚNG THỜI TRANG</h2>
                <div className="accent-line"></div>
                <p>Cập nhật xu hướng mới nhất trong làng thời trang công sở & dạ hội</p>
            </div>

            <div className="blog-grid">
                {posts.length === 0 ? (
                    <p className="text-muted" style={{ gridColumn: '1/-1', textAlign: 'center' }}>Chưa có bài viết nào.</p>
                ) : (
                    posts.slice(0, 6).map(post => (
                        <div className="blog-card" key={post.id}>
                            <div className="blog-card-img">
                                {post.imageUrl ? (
                                    <img src={post.imageUrl} alt={post.title} />
                                ) : (
                                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                                        <i className="fa-solid fa-newspaper fa-3x"></i>
                                    </div>
                                )}
                            </div>
                            <div className="blog-card-body">
                                <div className="blog-card-meta">
                                    <i className="fa-regular fa-calendar"></i> {formatDate(post.createdDate)}
                                </div>
                                <h3 className="blog-card-title">{post.title}</h3>
                                <p className="blog-card-desc">
                                    {post.shortDescription || 'Đọc ngay để cập nhật xu hướng thời trang mới nhất...'}
                                </p>
                                <a href={`/post/${post.id}`} className="blog-card-link">
                                    Đọc bài viết <i className="fa-solid fa-arrow-right"></i>
                                </a>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </>
    );
};

export default HomePage;
