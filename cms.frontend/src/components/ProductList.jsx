import React, { useState, useEffect } from 'react';
import productService from '../services/productService';

const ProductList = ({ categoryId }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterName, setFilterName] = useState('Tất cả sản phẩm');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                let data;
                if (categoryId) {
                    data = await productService.getProductsByCategory(categoryId);
                    setFilterName(`Danh mục #${categoryId}`);
                } else {
                    data = await productService.getAllProducts();
                    setFilterName('Tất cả sản phẩm');
                }
                setProducts(data);
            } catch (error) {
                console.error("Lỗi khi tải danh sách sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [categoryId]);

    if (loading) {
        return <div className="text-center my-4">Đang tải danh sách sản phẩm thời trang...</div>;
    }

    return (
        <div>
            <p className="text-muted small mb-3">Đang hiển thị: <strong>{filterName}</strong> ({products.length} sản phẩm)</p>
            <div className="row">
                {products.length === 0 ? (
                    <div className="col-12"><p className="text-muted">Không có sản phẩm nào.</p></div>
                ) : (
                    products.map((item) => (
                        <div className="col-md-6 mb-4" key={item.id}>
                            <div className="card h-100 shadow-sm border">
                                <div className="card-body">
                                    <h5 className="card-title font-weight-bold text-dark">{item.name}</h5>
                                    <p className="card-text text-danger font-weight-bold">
                                        Giá bán: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                                    </p>
                                    <p className="card-text small text-muted">Số lượng tồn kho: {item.stockQuantity} sản phẩm</p>
                                    <span className="badge badge-secondary">{item.categoryProductName}</span>
                                </div>
                                <div className="card-footer bg-transparent border-top-0">
                                    <button className="btn btn-outline-primary btn-block btn-sm">
                                        <i className="fa-solid fa-cart-plus mr-1"></i> Xem chi tiết
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ProductList;
