import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation();
    const fullName = localStorage.getItem('fullName');
    const customerId = localStorage.getItem('customerId');

    const handleLogout = () => {
        localStorage.removeItem('customerId');
        localStorage.removeItem('fullName');
        window.location.href = '/login';
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow">
            <div className="container">
                <Link className="navbar-brand font-weight-bold" to="/">
                    👗 FASHION BOUTIQUE
                </Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#mainNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="mainNav">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} to="/">
                                <i className="fa-solid fa-house mr-1"></i>Trang chủ
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname === '/shop' ? 'active' : ''}`} to="/shop">
                                <i className="fa-solid fa-bag-shopping mr-1"></i>Cửa hàng
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname.startsWith('/blog') ? 'active' : ''}`} to="/blog">
                                <i className="fa-solid fa-newspaper mr-1"></i>Tin tức
                            </Link>
                        </li>
                    </ul>
                    <ul className="navbar-nav">
                        {customerId ? (
                            <>
                                <li className="nav-item">
                                    <span className="nav-link">
                                        <i className="fa-solid fa-user mr-1"></i>{fullName}
                                    </span>
                                </li>
                                <li className="nav-item">
                                    <button className="nav-link btn btn-link text-danger" onClick={handleLogout}>
                                        <i className="fa-solid fa-right-from-bracket mr-1"></i>Đăng xuất
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`} to="/login">
                                        <i className="fa-solid fa-right-to-bracket mr-1"></i>Đăng nhập
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className={`nav-link ${location.pathname === '/register' ? 'active' : ''}`} to="/register">
                                        <i className="fa-solid fa-user-plus mr-1"></i>Đăng ký
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
