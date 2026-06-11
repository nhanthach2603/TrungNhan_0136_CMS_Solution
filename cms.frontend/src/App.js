import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CategoryProductList from './components/CategoryProductList';
import ProductList from './components/ProductList';
import PostList from './components/PostList';
import BlogCategoryList from './components/BlogCategoryList';
import ProductDetailPage from './pages/ProductDetailPage';
import './App.css';

function App() {
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

    return (
        <Router>
            <div className="container mt-5">
                <header className="pb-3 mb-4 border-bottom d-flex justify-content-between align-items-center">
                    <span className="fs-4 font-weight-bold text-dark text-uppercase">
                        👗 Fashion Boutique - Hệ Thống Quản Trị Nội Dung & Bán Hàng
                    </span>
                    <span className="badge badge-success px-3 py-2">Học Phần Chuyên Đề ASP.NET + ReactJS</span>
                </header>

                <Routes>
                    <Route path="/" element={
                        <div className="row">
                            <div className="col-md-4">
                                <CategoryProductList
                                    onSelectCategory={setSelectedCategoryId}
                                    selectedId={selectedCategoryId}
                                />
                                <BlogCategoryList />
                            </div>
                            <div className="col-md-8">
                                <h4 className="mb-4 text-uppercase text-secondary font-weight-bold">Bộ sưu tập mới nhất</h4>
                                <ProductList categoryId={selectedCategoryId} />
                                <hr className="my-5" />
                                <PostList />
                            </div>
                        </div>
                    } />
                    <Route path="/product/:id" element={<ProductDetailPage />} />
                </Routes>

                <footer className="pt-3 mt-5 text-muted border-top text-center small">
                    <p>© 2026 - Đồ án thực hành phân tầng ASP.NET Core Web API kết hợp ReactJS Client-side</p>
                </footer>
            </div>
        </Router>
    );
}

export default App;
