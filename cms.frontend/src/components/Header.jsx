import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

const Header = () => {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const fullName = localStorage.getItem('fullName');
    const isLoggedIn = !!localStorage.getItem('customerId');

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
            {/* TOP BAR */}
            <div className="top-bar">
                <div className="container">
                    <div className="top-bar-left">
                        <span><i className="fa-solid fa-phone"></i> Hotline: 1900 6789</span>
                        <span><i className="fa-solid fa-envelope"></i> support@thaicms.vn</span>
                    </div>
                    <div className="top-bar-right">
                        {isLoggedIn ? (
                            <>
                                <span className="top-bar-user">
                                    <i className="fa-solid fa-circle-user"></i> {fullName}
                                </span>
                                <a href="#" onClick={handleLogout} className="top-bar-logout">
                                    <i className="fa-solid fa-right-from-bracket"></i> Đăng xuất
                                </a>
                            </>
                        ) : (
                            <>
                                <Link to="/login"><i className="fa-solid fa-right-to-bracket"></i> Đăng nhập</Link>
                                <Link to="/register"><i className="fa-solid fa-user-plus"></i> Đăng ký</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* MAIN HEADER */}
            <div className="main-header">
                <div className="container">
                    <Link to="/" className="logo">ThaiCMS<span>.Fashion</span></Link>
                    <div className="search-box">
                        <input type="text" placeholder="Tìm kiếm sản phẩm thời trang..." />
                        <button><i className="fa-solid fa-magnifying-glass"></i></button>
                    </div>
                    <div className="cart-icon">
                        <i className="fa-solid fa-cart-shopping"></i>
                        <span className="cart-badge">0</span>
                    </div>
                </div>
            </div>

            {/* NAV BAR */}
            <nav className="nav-bar">
                <div className="container">
                    <Link to="/" className="nav-link-item active"><i className="fa-solid fa-house mr-1"></i> Trang Chủ</Link>
                    <Link to="/" className="nav-link-item"><i className="fa-solid fa-bag-shopping mr-1"></i> Cửa Hàng</Link>
                    <Link to="/" className="nav-link-item"><i className="fa-solid fa-newspaper mr-1"></i> Tin Tức / Blog</Link>
                    <Link to="/" className="nav-link-item"><i className="fa-solid fa-circle-info mr-1"></i> Về Chúng Tôi</Link>
                </div>
            </nav>
        </>
    );
};

export default Header;
