import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import PostDetailPage from './pages/PostDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import BlogPage from './pages/BlogPage';
import SearchResultsPage from './pages/SearchResultsPage';
import './App.css';

function App() {
    return (
        <Router>
            <ToastProvider>
                <CartProvider>
                    <div className="App">
                        <Header />
                        <div className="container" style={{ minHeight: '60vh' }}>
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/product/:id" element={<ProductDetailPage />} />
                                <Route path="/post/:id" element={<PostDetailPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/account/orders" element={<OrderHistoryPage />} />
                            <Route path="/blog" element={<BlogPage />} />
                            <Route path="/search" element={<SearchResultsPage />} />
                            </Routes>
                        </div>
                        <Footer />
                        <CartDrawer />
                    </div>
                </CartProvider>
            </ToastProvider>
        </Router>
    );
}

export default App;
