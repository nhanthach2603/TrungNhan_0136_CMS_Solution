import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { useCart } from '../context/CartContext';
import categoryProductService from '../services/categoryProductService';

const Header = () => {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const { cartCount, toggleCart } = useCart();
    const fullName = localStorage.getItem('fullName');
    const isLoggedIn = !!localStorage.getItem('customerId');
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoryProductService.getAllCategoryProducts();
                setCategories(data);
            } catch (error) {
                console.error("Lỗi khi tải danh mục ở Header:", error);
            }
        };
        fetchCategories();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('customerId');
        localStorage.removeItem('fullName');
        addToast('Đăng xuất thành công!', 'info');
        setTimeout(() => {
            navigate('/');
            window.location.reload();
        }, 1000);
    };

    return (
        <>
            {/* TOP BAR ANNOUNCEMENT */}
            <div className="top-bar">
                <div className="container">
                    <div className="top-bar-left">
                        <span><i className="fa-solid fa-phone"></i> Hotline hỗ trợ: 1800 2424 (Miễn phí)</span>
                        <span><i className="fa-solid fa-clock"></i> Mở cửa: 8:00 - 21:30 cả CN</span>
                    </div>
                    <div className="top-bar-marquee">
                        <div className="marquee-content">
                            <span>🔥 KHUYẾN MÃI LỚN: Giảm tới 40% cho tất cả dòng máy ảnh Sony & Fujifilm | Trả góp 0% lãi suất! 🔥</span>
                        </div>
                    </div>
                    <div className="top-bar-right">
                        {isLoggedIn ? (
                            <>
                                <span className="top-bar-user">
                                    <i className="fa-solid fa-circle-user"></i> {fullName}
                                </span>
                                <Link to="/account/orders" className="top-bar-orders">
                                    <i className="fa-solid fa-receipt"></i> Đơn hàng
                                </Link>
                                <a href="#" onClick={handleLogout} className="top-bar-logout">
                                    <i className="fa-solid fa-right-from-bracket"></i> Đăng xuất
                                </a>
                            </>
                        ) : (
                            <>
                                <Link to="/login"><i className="fa-solid fa-right-to-bracket mr-1"></i> Đăng nhập</Link>
                                <Link to="/register"><i className="fa-solid fa-user-plus mr-1"></i> Đăng ký</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* MAIN HEADER */}
            <div className="main-header">
                <div className="container">
                    <Link to="/" className="logo">
                        <i className="fa-solid fa-camera-retro mr-2"></i>
                        Camera24h<span>.Shop</span>
                    </Link>
                    
                    <form className="search-box" onSubmit={handleSearch}>
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm máy ảnh, ống kính, phụ kiện..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit"><i className="fa-solid fa-magnifying-glass"></i> Tìm kiếm</button>
                    </form>

                    <div className="cart-icon" onClick={toggleCart}>
                        <i className="fa-solid fa-cart-shopping"></i>
                        <span className="cart-badge">{cartCount}</span>
                    </div>
                </div>
            </div>

            {/* NAVIGATION BAR WITH DROPDOWN */}
            <nav className="nav-bar">
                <div className="container">
                    <div className="nav-categories-dropdown">
                        <button className="nav-categories-btn">
                            <i className="fa-solid fa-bars mr-2"></i> TẤT CẢ DANH MỤC
                        </button>
                        <div className="dropdown-menu-list">
                            {categories.length === 0 ? (
                                <span className="dropdown-item text-muted">Đang tải danh mục...</span>
                            ) : (
                                categories.map(cat => (
                                    <Link key={cat.id} to={`/?category=${cat.id}`} className="dropdown-item">
                                        <i className="fa-solid fa-chevron-right mr-2 small-arrow"></i>
                                        {cat.name}
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>
                    
                    <div className="nav-links">
                        <Link to="/" className="nav-link-item active">
                            <i className="fa-solid fa-house mr-1"></i> Trang Chủ
                        </Link>
                        <Link to="/?category=7" className="nav-link-item">
                            <i className="fa-solid fa-camera mr-1"></i> Máy ảnh mới
                        </Link>
                        <Link to="/?category=8" className="nav-link-item">
                            <i className="fa-solid fa-bullseye mr-1"></i> Ống kính
                        </Link>
                        <Link to="/blog" className="nav-link-item">
                            <i className="fa-solid fa-newspaper mr-1"></i> Tin tức công nghệ
                        </Link>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Header;
