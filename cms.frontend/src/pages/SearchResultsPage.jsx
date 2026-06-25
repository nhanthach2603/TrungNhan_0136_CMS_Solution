import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import productService from '../services/productService';
import LoadingSpinner from '../components/LoadingSpinner';
import ProductCard from '../components/ProductCard';

const SearchResultsPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!query.trim()) {
                setProducts([]);
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const allProducts = await productService.getAllProducts();
                const keyword = query.toLowerCase().trim();
                const results = allProducts.filter(p =>
                    p.name.toLowerCase().includes(keyword) ||
                    (p.categoryProductName && p.categoryProductName.toLowerCase().includes(keyword)) ||
                    (p.description && p.description.toLowerCase().includes(keyword))
                );
                setProducts(results);
            } catch (error) {
                console.error("Lỗi khi tìm kiếm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSearchResults();
    }, [query]);

    if (loading) return <LoadingSpinner message="Đang tìm kiếm..." />;

    return (
        <div className="search-results-page-wrapper">
            <div className="breadcrumb-nav">
                <Link to="/">Trang chủ</Link>
                <i className="fa-solid fa-chevron-right mx-2"></i>
                <span>Tìm kiếm: "{query}"</span>
            </div>

            <div className="category-title-bar mt-3">
                <h2>KẾT QUẢ TÌM KIẾM: "{query.toUpperCase()}"</h2>
                <span className="text-muted">({products.length} sản phẩm)</span>
            </div>

            {products.length === 0 ? (
                <div className="text-center py-5 bg-white rounded shadow-sm mt-4">
                    <i className="fa-solid fa-magnifying-glass fa-3x text-muted mb-3"></i>
                    <p className="text-muted font-weight-bold">Không tìm thấy sản phẩm nào khớp với từ khóa "{query}"</p>
                    <Link to="/" className="btn btn-primary mt-3">Quay về trang chủ</Link>
                </div>
            ) : (
                <div className="product-grid mt-4">
                    {products.map((item) => (
                        <ProductCard key={`search-${item.id}`} item={item} showDetailIcon />
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchResultsPage;
