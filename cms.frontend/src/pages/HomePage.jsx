import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import categoryProductService from '../services/categoryProductService';
import productService from '../services/productService';
import blogService from '../services/blogService';
import bannerService from '../services/bannerService';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ProductCard from '../components/ProductCard';
import { formatPrice, formatDate } from '../utils/formatters';

const HomePage = () => {
    const { addToCart } = useCart();
    const [searchParams, setSearchParams] = useSearchParams();
    
    // States
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [posts, setPosts] = useState([]);
    const [banners, setBanners] = useState([]);
    const [currentBanner, setCurrentBanner] = useState(0);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(null); // category ID or null
    
    // Sorting & Filtering States (for Category View)
    const [sortBy, setSortBy] = useState('default'); // 'default' | 'priceAsc' | 'priceDesc'
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [innerSearch, setInnerSearch] = useState('');
    const [visibleCount, setVisibleCount] = useState(8);

    const urlCategory = searchParams.get('category');

    const shuffleArray = (arr) => {
        const shuffled = [...arr];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    // Load Initial Data
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
                console.error("Lỗi tải dữ liệu HomePage:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Sync active tab with URL search parameter
    useEffect(() => {
        if (urlCategory) {
            if (urlCategory === 'all') {
                setActiveTab('all');
            } else {
                setActiveTab(Number(urlCategory));
            }
        } else {
            setActiveTab(null);
        }
        // Reset category-specific filters on switch
        setSortBy('default');
        setInnerSearch('');
        setPriceRange({ min: '', max: '' });
        setVisibleCount(8);
    }, [urlCategory]);

    // Banner Slideshow Auto-play
    useEffect(() => {
        if (banners.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentBanner(prev => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [banners.length]);

    const handleSelectCategory = (catId) => {
        if (catId === null) {
            setSearchParams({});
        } else {
            setSearchParams({ category: catId });
        }
    };

    // formatPrice và formatDate imported từ utils/formatters.js

    // Filter and Sort Products for Category View
    const getFilteredProducts = () => {
        let list = [...products];

        // Filter by category
        if (activeTab && activeTab !== 'all') {
            list = list.filter(p => p.categoryProductId === activeTab);
        }

        // Filter by price range
        if (priceRange.min !== '') {
            list = list.filter(p => p.price >= Number(priceRange.min));
        }
        if (priceRange.max !== '') {
            list = list.filter(p => p.price <= Number(priceRange.max));
        }

        // Filter by inner search keyword
        if (innerSearch.trim() !== '') {
            list = list.filter(p => p.name.toLowerCase().includes(innerSearch.toLowerCase()));
        }

        // Sorting
        if (sortBy === 'priceAsc') {
            list.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'priceDesc') {
            list.sort((a, b) => b.price - a.price);
        }

        return list;
    };

    if (loading) return <LoadingSpinner message="Đang tải dữ liệu Camera Store..." />;

    const filteredCategoryProducts = getFilteredProducts();
    const activeCategoryName = activeTab === 'all' 
        ? 'Tất cả sản phẩm' 
        : categories.find(c => c.id === activeTab)?.name || 'Danh mục';

    return (
        <>
            {/* VIEW A: HOMEPAGE FULL (No category selected) */}
            {activeTab === null ? (
                <>
                    {/* HERO BANNERS SECTION - MAIN SLIDER + SIDE PROMOS */}
                    <div className="hero-section-wrapper">
                        <div className="hero-slider-main">
                            {banners.length > 0 ? (
                                <div className="hero-banner-slider">
                                    {banners.map((banner, index) => (
                                        <div
                                            key={banner.id}
                                            className={`hero-slide ${index === currentBanner ? 'active' : ''}`}
                                            style={{ backgroundImage: `url(${banner.imageUrl})` }}
                                        >
                                            <div className="hero-overlay"></div>
                                            <div className="hero-content">
                                                <span className="hero-badge"><i className="fa-solid fa-shield-halved"></i> Bảo hành chính hãng</span>
                                                <h1 className="hero-title">{banner.name || 'MÁY ẢNH CHUYÊN NGHIỆP'}</h1>
                                                <p className="hero-desc">Đầy đủ dòng máy Mirrorless, DSLR cao cấp.<br/>Giảm ngay 2.000.000đ khi mua kèm ống kính.</p>
                                                <div className="hero-actions">
                                                    <a href="#products" className="hero-btn-primary">
                                                        <i className="fa-solid fa-eye"></i> Khám phá ngay
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
                                <div className="hero-banner-slider">
                                    <div className="hero-slide active" style={{ backgroundColor: '#1e293b' }}>
                                        <div className="hero-overlay"></div>
                                        <div className="hero-content">
                                            <span className="hero-badge"><i className="fa-solid fa-camera"></i> CAMERA24H.SHOP</span>
                                            <h1 className="hero-title">THẾ GIỚI MÁY ẢNH CHÍNH HÃNG</h1>
                                            <p className="hero-desc">Chuyên phân phối Sony, Fujifilm, Canon, Nikon.<br/>Trả góp 0% lãi suất, thủ tục nhanh chóng.</p>
                                            <div className="hero-actions">
                                                <a href="#products" className="hero-btn-primary">Mua sắm ngay</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="hero-promos-side">
                            <div className="side-promo-card promo-lens" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1617005082133-548c4dd27f35?auto=format&fit=crop&w=400&q=80')` }}>
                                <div className="promo-overlay-dark"></div>
                                <div className="promo-card-content">
                                    <h4>ỐNG KÍNH ĐỈNH CAO</h4>
                                    <p>Sony GM, Canon L-Series, Fujifilm XF</p>
                                    <button onClick={() => handleSelectCategory('all')} className="btn-promo-action">Xem ngay <i className="fa-solid fa-circle-chevron-right"></i></button>
                                </div>
                            </div>
                            <div className="side-promo-card promo-studio" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80')` }}>
                                <div className="promo-overlay-dark"></div>
                                <div className="promo-card-content">
                                    <h4>PHỤ KIỆN STUDIO</h4>
                                    <p>Gimbal, Chân máy, Tủ chống ẩm giảm 30%</p>
                                    <button onClick={() => handleSelectCategory('all')} className="btn-promo-action">Xem ngay <i className="fa-solid fa-circle-chevron-right"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* QUICK CATEGORIES ICON ROW */}
                    <div className="quick-categories-section">
                        <div className="quick-cat-header text-center">
                            <h3>DANH MỤC NỔI BẬT</h3>
                            <div className="gold-accent-line"></div>
                        </div>
                        <div className="quick-categories-grid">
                            <div className="quick-cat-card" onClick={() => handleSelectCategory('all')}>
                                <div className="quick-cat-icon-wrapper">
                                    <i className="fa-solid fa-border-all"></i>
                                </div>
                                <span className="quick-cat-name">Tất cả sản phẩm</span>
                            </div>
                            {categories.map(cat => {
                                let iconClass = "fa-solid fa-camera";
                                const nameLower = cat.name.toLowerCase();
                                if (nameLower.includes('ống kính') || nameLower.includes('lens')) {
                                    iconClass = "fa-solid fa-circle-dot";
                                } else if (nameLower.includes('phụ kiện') || nameLower.includes('thiết bị')) {
                                    iconClass = "fa-solid fa-screwdriver-wrench";
                                } else if (nameLower.includes('quay') || nameLower.includes('action')) {
                                    iconClass = "fa-solid fa-video";
                                } else if (nameLower.includes('cũ') || nameLower.includes('used')) {
                                    iconClass = "fa-solid fa-arrows-rotate";
                                } else if (nameLower.includes('studio') || nameLower.includes('đèn')) {
                                    iconClass = "fa-solid fa-lightbulb";
                                }
                                return (
                                    <div key={cat.id} className="quick-cat-card" onClick={() => handleSelectCategory(cat.id)}>
                                        <div className="quick-cat-icon-wrapper">
                                            <i className={iconClass}></i>
                                        </div>
                                        <span className="quick-cat-name">{cat.name}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* MAIN CONTENT + SIDEBAR LAYOUT */}
                    <div className="homepage-content-layout">
                        <div className="homepage-main">
                            {/* BEST SELLERS */}
                            <div id="products" className="section-title-center">
                                <h2>SẢN PHẨM BÁN CHẠY</h2>
                                <div className="accent-line"></div>
                            </div>

                            <div className="product-grid">
                                {products.slice(0, 8).map((item) => (
                                    <ProductCard key={`bestseller-${item.id}`} item={item} badge="Bán chạy" showDetailIcon />
                                ))}
                            </div>

                            {/* DYNAMIC CATEGORY BLOCKS */}
                            {categories.map(cat => {
                                const catProducts = products.filter(p => p.categoryProductId === cat.id);
                                if (catProducts.length === 0) return null;

                                return (
                                    <div key={`cat-block-${cat.id}`} className="category-block-wrapper mt-5">
                                        <div className="cat-block-header">
                                            <h3>
                                                <i className="fa-solid fa-cube text-warning mr-2" style={{ marginRight: '8px' }}></i>
                                                {cat.name.toUpperCase()}
                                            </h3>
                                            <button onClick={() => handleSelectCategory(cat.id)} className="cat-block-see-all">
                                                Xem tất cả <i className="fa-solid fa-circle-chevron-right ml-1"></i>
                                            </button>
                                        </div>
                                        <div className="product-grid">
                                            {catProducts.slice(0, 4).map((item) => (
                                                <ProductCard key={`cat-prod-${item.id}`} item={item} />
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}

                            {/* BLOG */}
                            <div id="blog" className="section-title-center mt-5">
                                <h2>GÓC CÔNG NGHỆ & KINH NGHIỆM NHIẾP ẢNH</h2>
                                <div className="accent-line"></div>
                            </div>

                            <div className="blog-grid-home">
                                {posts.slice(0, 3).map(post => (
                                    <div className="blog-card" key={post.id}>
                                        <div className="blog-card-img">
                                            {post.imageUrl ? (
                                                <img src={post.imageUrl} alt={post.title} />
                                            ) : (
                                                <div className="empty-img-placeholder">
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
                                                {post.shortDescription || 'Xem bài viết để cùng trao đổi kiến thức nhiếp ảnh và sử dụng thiết bị...'}
                                            </p>
                                            <Link to={`/post/${post.id}`} className="blog-card-link">
                                                Đọc tiếp <i className="fa-solid fa-arrow-right-long ml-1"></i>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT SIDEBAR */}
                        <aside className="homepage-sidebar">
                            <div className="sidebar-widget">
                                <h4 className="widget-title">DANH MỤC SẢN PHẨM</h4>
                                <ul className="sidebar-cat-list">
                                    <li className={activeTab === 'all' ? 'active' : ''} onClick={() => handleSelectCategory('all')}>
                                        <i className="fa-solid fa-border-all mr-2"></i> Tất cả sản phẩm
                                    </li>
                                    {categories.map(cat => {
                                        let iconClass = "fa-solid fa-camera";
                                        const nameLower = cat.name.toLowerCase();
                                        if (nameLower.includes('ống kính') || nameLower.includes('lens')) iconClass = "fa-solid fa-circle-dot";
                                        else if (nameLower.includes('phụ kiện') || nameLower.includes('thiết bị')) iconClass = "fa-solid fa-screwdriver-wrench";
                                        else if (nameLower.includes('quay') || nameLower.includes('action')) iconClass = "fa-solid fa-video";
                                        else if (nameLower.includes('cũ') || nameLower.includes('used')) iconClass = "fa-solid fa-arrows-rotate";
                                        else if (nameLower.includes('studio') || nameLower.includes('đèn')) iconClass = "fa-solid fa-lightbulb";
                                        const count = products.filter(p => p.categoryProductId === cat.id).length;
                                        return (
                                            <li key={cat.id} onClick={() => handleSelectCategory(cat.id)}>
                                                <i className={`${iconClass} mr-2`}></i> {cat.name}
                                                <span className="sidebar-cat-count">{count}</span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>

                            <div className="sidebar-widget mt-4">
                                <h4 className="widget-title">LIÊN HỆ</h4>
                                <div className="sidebar-contact-info">
                                    <p><i className="fa-solid fa-phone mr-2"></i> 1900 6789</p>
                                    <p><i className="fa-solid fa-envelope mr-2"></i> support@thaicms.vn</p>
                                    <p><i className="fa-solid fa-clock mr-2"></i> T2-T7: 8:00 - 21:00</p>
                                </div>
                            </div>
                        </aside>
                    </div>
                </>
            ) : (
                /* VIEW B: CATEGORY LISTING VIEW (When a category is active) */
                <div className="category-listing-layout">
                    {/* BREADCRUMB */}
                    <div className="breadcrumb-nav">
                        <Link to="/" onClick={() => handleSelectCategory(null)}>Trang chủ</Link>
                        <i className="fa-solid fa-chevron-right mx-2"></i>
                        <span>{activeCategoryName}</span>
                    </div>

                    <div className="category-title-bar">
                        <h2>{activeCategoryName.toUpperCase()}</h2>
                        <span className="text-muted">({filteredCategoryProducts.length} sản phẩm)</span>
                    </div>

                    <div className="category-two-column mt-4">
                        {/* LEFT COLUMN: FILTERS SIDEBAR */}
                        <div className="category-sidebar">
                            {/* Subcategories widget */}
                            <div className="sidebar-widget">
                                <h4 className="widget-title">DANH MỤC</h4>
                                <ul className="sidebar-cat-list">
                                    <li 
                                        className={activeTab === 'all' ? 'active' : ''} 
                                        onClick={() => handleSelectCategory('all')}
                                    >
                                        Tất cả sản phẩm
                                    </li>
                                    {categories.map(c => (
                                        <li 
                                            key={c.id} 
                                            className={activeTab === c.id ? 'active' : ''}
                                            onClick={() => handleSelectCategory(c.id)}
                                        >
                                            {c.name}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Price range widget */}
                            <div className="sidebar-widget mt-4">
                                <h4 className="widget-title">KHOẢNG GIÁ (VNĐ)</h4>
                                <div className="price-range-inputs">
                                    <input 
                                        type="number" 
                                        placeholder="Từ giá" 
                                        value={priceRange.min}
                                        onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                                        className="form-control"
                                    />
                                    <span className="my-2 text-center text-muted">-</span>
                                    <input 
                                        type="number" 
                                        placeholder="Đến giá" 
                                        value={priceRange.max}
                                        onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                                        className="form-control"
                                    />
                                </div>
                                <button 
                                    className="btn-filter-price mt-3"
                                    onClick={() => setPriceRange({ min: '', max: '' })}
                                >
                                    Xóa bộ lọc giá
                                </button>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: MAIN PRODUCTS LIST */}
                        <div className="category-main-content">
                            {/* Sort Bar and In-category Search */}
                            <div className="listing-sort-bar">
                                <div className="sort-tabs-group">
                                    <button 
                                        className={`sort-tab-btn ${sortBy === 'default' ? 'active' : ''}`}
                                        onClick={() => setSortBy('default')}
                                    >
                                        Mặc định
                                    </button>
                                    <button 
                                        className={`sort-tab-btn ${sortBy === 'priceAsc' ? 'active' : ''}`}
                                        onClick={() => setSortBy('priceAsc')}
                                    >
                                        Giá thấp đến cao
                                    </button>
                                    <button 
                                        className={`sort-tab-btn ${sortBy === 'priceDesc' ? 'active' : ''}`}
                                        onClick={() => setSortBy('priceDesc')}
                                    >
                                        Giá cao đến thấp
                                    </button>
                                </div>
                                <div className="inner-category-search">
                                    <input 
                                        type="text" 
                                        placeholder={`Tìm trong ${activeCategoryName}...`}
                                        value={innerSearch}
                                        onChange={(e) => setInnerSearch(e.target.value)}
                                    />
                                    <i className="fa-solid fa-magnifying-glass"></i>
                                </div>
                            </div>

                            {/* Products Grid */}
                            {filteredCategoryProducts.length === 0 ? (
                                <div className="text-center py-5 bg-white rounded shadow-sm">
                                    <i className="fa-solid fa-camera-rotate fa-3x text-muted mb-3"></i>
                                    <p className="text-muted font-weight-bold">Không tìm thấy sản phẩm nào khớp bộ lọc!</p>
                                </div>
                            ) : (
                                <>
                                    <div className="product-grid">
                                        {filteredCategoryProducts.slice(0, visibleCount).map((item) => (
                                            <ProductCard key={`listing-${item.id}`} item={item} />
                                        ))}
                                    </div>

                                    {visibleCount < filteredCategoryProducts.length && (
                                        <div className="text-center mt-4">
                                            <button
                                                className="btn-load-more"
                                                onClick={() => setVisibleCount(prev => prev + 8)}
                                            >
                                                Xem thêm sản phẩm
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default HomePage;
