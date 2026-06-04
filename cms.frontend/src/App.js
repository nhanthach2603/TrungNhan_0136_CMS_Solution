import React from 'react';
import CategoryProductList from './components/CategoryProductList';
import ProductList from './components/ProductList';
import PostList from './components/PostList';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import './App.css';

function App() {
    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
                <div className="container">
                    <a className="navbar-brand font-weight-bold" href="#home">
                        👗 FASHION BOUTIQUE
                    </a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#mainNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="mainNav">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item"><a className="nav-link" href="#home"><i className="fa-solid fa-house mr-1"></i>Trang chủ</a></li>
                            <li className="nav-item"><a className="nav-link" href="#shop"><i className="fa-solid fa-bag-shopping mr-1"></i>Cửa hàng</a></li>
                            <li className="nav-item"><a className="nav-link" href="#blog"><i className="fa-solid fa-newspaper mr-1"></i>Tin tức</a></li>
                        </ul>
                        <ul className="navbar-nav">
                            <li className="nav-item"><a className="nav-link" href="#login"><i className="fa-solid fa-right-to-bracket mr-1"></i>Đăng nhập</a></li>
                            <li className="nav-item"><a className="nav-link" href="#register"><i className="fa-solid fa-user-plus mr-1"></i>Đăng ký</a></li>
                        </ul>
                    </div>
                </div>
            </nav>

            <div className="container mt-4">
                <section id="home" className="mb-5">
                    <div className="p-5 bg-light rounded shadow-sm text-center">
                        <h1 className="display-4 font-weight-bold">Chào mừng đến Fashion Boutique</h1>
                        <p className="lead text-secondary mt-3">Thời trang công sở & dạ hội — Cập nhật xu hướng mới nhất.</p>
                        <a href="#shop" className="btn btn-primary btn-lg mt-2"><i className="fa-solid fa-bag-shopping mr-2"></i>Mua sắm ngay</a>
                    </div>
                </section>

                <section id="shop" className="mb-5">
                    <div className="row">
                        <div className="col-md-3 mb-4">
                            <CategoryProductList />
                        </div>
                        <div className="col-md-9">
                            <h4 className="mb-4 text-uppercase text-secondary font-weight-bold">Bộ sưu tập mới nhất</h4>
                            <ProductList />
                        </div>
                    </div>
                </section>

                <section id="blog" className="mb-5">
                    <PostList />
                </section>

                <section id="login" className="mb-5">
                    <div className="row">
                        <div className="col-md-6 offset-md-3">
                            <LoginForm />
                        </div>
                    </div>
                </section>

                <section id="register" className="mb-5">
                    <div className="row">
                        <div className="col-md-8 offset-md-2">
                            <RegisterForm />
                        </div>
                    </div>
                </section>

                <footer className="text-center text-muted py-4 border-top mt-5">
                    <small>© 2026 Fashion Boutique — ASP.NET Core + ReactJS</small>
                </footer>
            </div>
        </div>
    );
}

export default App;
