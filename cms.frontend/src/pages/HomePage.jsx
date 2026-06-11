import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import categoryProductService from '../services/categoryProductService';
import productService from '../services/productService';
import blogService from '../services/blogService';
import bannerService from '../services/bannerService';

const HomePage = () => {
    const [categories, setCategories] = useState([]);
    const [activeTab, setActiveTab] = useState(null);
    const [products, setProducts] = useState([]);
    const [posts, setPosts] = useState([]);
    const [banners, setBanners] = useState([]);
    const [currentBanner, setCurrentBanner] = useState(0);
    const [loading, setLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(8);
    const [blogOffset, setBlogOffset] = useState(0);
    const blogPerPage = 3;

    const shuffleArray = (arr) => {
        const shuffled = [...arr];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [catData, prodData, postData, bannerData] = await Promise.all([
                    categoryProductService.getAllCategoryProducts(),
                    productService.getAllProducts(),
                    blogService.getAllPosts(),
                    bannerService.getAll().catch(() => [])
                ]);
                setCategories(catData);
                setProducts(prodData);
                setPosts(postData);
                setBanners(shuffleArray(bannerData));
            } catch (error) {
                console.error("Lỗi tải dữ liệu:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (banners.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentBanner(prev => {
                let next;
                do {
                    next = Math.floor(Math.random() * banners.length);
                } while (next === prev && banners.length > 1);
                return next;
            });
        }, 5000);
        return () => clearInterval(timer);
    }, [banners.length]);

    useEffect(() => {
        setVisibleCount(8);
    }, [activeTab]);

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
            {/* HERO BANNER SLIDESHOW */}
            {banners.length > 0 ? (
                <div className="hero-banner">
                    {banners.map((banner, index) => (
                        <div
                            key={banner.id}
                            className={`hero-slide ${index === currentBanner ? 'active' : ''}`}
                            style={{ backgroundImage: `url(${banner.imageUrl})` }}
                        >
                            <div className="hero-overlay"></div>
                            <div className="hero-content">
                                <span className="hero-badge"><i className="fa-solid fa-star"></i> {banner.name}</span>
                                <h1 className="hero-title">THỜI TRANG <span>CÔNG SỞ</span> & DẠ HỘI</h1>
                                <p className="hero-desc">Phong cách thời trang hiện đại, sang trọng dành cho phái đẹp.<br/>Giảm đến 50% cho tất cả sản phẩm mới.</p>
                                <div className="hero-actions">
                                    {banner.linkUrl ? (
                                        <a href={banner.linkUrl} className="hero-btn-primary">
                                            <i className="fa-solid fa-bag-shopping"></i> Mua Sắm Ngay
                                        </a>
                                    ) : (
                                        <a href="#products" className="hero-btn-primary">
                                            <i className="fa-solid fa-bag-shopping"></i> Mua Sắm Ngay
                                        </a>
                                    )}
                                    <a href="#blog" className="hero-btn-outline">
                                        <i className="fa-solid fa-newspaper"></i> Xem Blog
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                    {banners.length > 1 && (
                        <div className="hero-dots">
                            {banners.map((_, index) => (
                                <button
                                    key={index}
                                    className={`hero-dot ${index === currentBanner ? 'active' : ''}`}
                                    onClick={() => setCurrentBanner(index)}
                                ></button>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div className="hero-banner">
                    <div className="hero-overlay"></div>
                    <div className="hero-content">
                        <span className="hero-badge"><i className="fa-solid fa-star"></i> BỘ SƯU TẬP MỚI 2026</span>
                        <h1 className="hero-title">THỜI TRANG <span>CÔNG SỞ</span> & DẠ HỘI</h1>
                        <p className="hero-desc">Phong cách thời trang hiện đại, sang trọng dành cho phái đẹp.<br/>Giảm đến 50% cho tất cả sản phẩm mới.</p>
                        <div className="hero-actions">
                            <a href="#products" className="hero-btn-primary">
                                <i className="fa-solid fa-bag-shopping"></i> Mua Sắm Ngay
                            </a>
                            <a href="#blog" className="hero-btn-outline">
                                <i className="fa-solid fa-newspaper"></i> Xem Blog
                            </a>
                        </div>
                    </div>
                </div>
            )}

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
            <div id="products" className="section-header">
                <h2 className="section-title">SẢN PHẨM NỔI BẬT</h2>
            </div>

            <div className="product-grid">
                {filteredProducts.length === 0 ? (
                    <p className="text-muted" style={{ gridColumn: '1/-1', textAlign: 'center' }}>Không có sản phẩm nào.</p>
                ) : (
                    filteredProducts.slice(0, visibleCount).map((item, index) => (
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

            {visibleCount < filteredProducts.length && (
                <div className="text-center my-4">
                    <button
                        className="btn-load-more"
                        onClick={() => setVisibleCount(prev => prev + 8)}
                    >
                        <i className="fa-solid fa-plus"></i> Xem thêm
                    </button>
                </div>
            )}

            {/* BLOG SECTION */}
            <div id="blog" className="section-title-center">
                <h2>XU HƯỚNG THỜI TRANG</h2>
                <div className="accent-line"></div>
                <p>Cập nhật xu hướng mới nhất trong làng thời trang công sở & dạ hội</p>
            </div>

            <div className="blog-slider-wrapper">
                {posts.length === 0 ? (
                    <p className="text-muted text-center">Chưa có bài viết nào.</p>
                ) : (
                    <>
                        <button
                            className="blog-arrow blog-arrow-left"
                            onClick={() => setBlogOffset(prev => Math.max(0, prev - 1))}
                            disabled={blogOffset === 0}
                        >
                            <i className="fa-solid fa-chevron-left"></i>
                        </button>

                        <div className="blog-slider">
                            <div
                                className="blog-slider-track"
                                style={{ transform: `translateX(-${blogOffset * (100 / blogPerPage)}%)` }}
                            >
                                {posts.map(post => (
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
                                ))}
                            </div>
                        </div>

                        <button
                            className="blog-arrow blog-arrow-right"
                            onClick={() => setBlogOffset(prev => Math.min(Math.ceil(posts.length / blogPerPage) - 1, prev + 1))}
                            disabled={blogOffset >= Math.ceil(posts.length / blogPerPage) - 1}
                        >
                            <i className="fa-solid fa-chevron-right"></i>
                        </button>
                    </>
                )}
            </div>
        </>
    );
};

export default HomePage;
