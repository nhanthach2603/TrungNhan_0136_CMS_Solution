import React, { useState } from 'react';
import CategoryProductList from './components/CategoryProductList';
import ProductList from './components/ProductList';
import PostList from './components/PostList';
import BlogCategoryList from './components/BlogCategoryList';
import './App.css';

function App() {
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

    return (
        <div className="container mt-5">
            {/* PHẦN HEADER */}
            <header className="pb-3 mb-4 border-bottom">
                <span className="fs-4 font-weight-bold text-dark text-uppercase">
                    👗 FASHION BOUTIQUE - THỜI TRANG CÔNG SỞ & DẠ HỘI
                </span>
            </header>

            {/* PHẦN 1: DANH MỤC SẢN PHẨM (TRÁI) + JUMBOTRON (PHẢI) */}
            <div className="row">
                <div className="col-md-3">
                    <CategoryProductList
                        onSelectCategory={setSelectedCategoryId}
                        selectedId={selectedCategoryId}
                    />
                </div>
                <div className="col-md-9">
                    <div className="jumbotron bg-light border p-5 rounded shadow-sm">
                        <h2 className="display-5 font-weight-normal">Chào mừng đến với Fashion Boutique!</h2>
                        <p className="lead mt-3 text-secondary">
                            Khối dữ liệu bên thanh điều hướng trái đang được tải <strong>Real-time</strong> trực tiếp từ bảng <strong>CategoryProduct</strong> trong Database SQL Server thông qua nền tảng ASP.NET Core Web API.
                        </p>
                        <hr className="my-4" />
                        <p className="text-muted">Hãy đảm bảo rằng bạn đã kích hoạt CORS ở Backend để dữ liệu không bị chặn hiển thị.</p>
                    </div>
                </div>
            </div>

            {/* PHẦN 2: DANH SÁCH SẢN PHẨM */}
            <div className="row">
                <div className="col-md-12">
                    <h4 className="mb-4 text-uppercase text-secondary font-weight-bold">
                        <i className="fa-solid fa-fire text-danger mr-2"></i>Bộ sưu tập mới nhất
                    </h4>
                    <ProductList
                        categoryId={selectedCategoryId}
                    />
                </div>
            </div>

            {/* PHẦN 3: BLOG & CHUYÊN MỤC TIN TỨC */}
            <div className="row mt-5">
                <div className="col-md-4">
                    <BlogCategoryList />
                </div>
                <div className="col-md-8">
                    <PostList />
                </div>
            </div>
        </div>
    );
}

export default App;
