import React, { useState, useEffect } from 'react';
import productService from '../services/productService';

const ProductDetail = ({ productId, onBack }) => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const data = await productService.getProductById(productId);
                setProduct(data);
            } catch (error) {
                console.error("Lỗi khi tải chi tiết sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    if (loading) {
        return (
            <div className="text-center my-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Đang tải...</span>
                </div>
                <p className="mt-2 text-muted">Đang tải chi tiết sản phẩm...</p>
            </div>
        );
    }

    if (!product) {
        return <div className="alert alert-danger">Không tìm thấy sản phẩm!</div>;
    }

    return (
        <div className="card shadow-sm">
            <div className="card-body">
                <button className="btn btn-outline-secondary btn-sm mb-3" onClick={onBack}>
                    <i className="fa-solid fa-arrow-left mr-1"></i> Quay lại danh sách
                </button>

                <div className="row">
                    <div className="col-md-5 text-center">
                        {product.imageUrl ? (
                            <img src={product.imageUrl} alt={product.name}
                                 className="img-fluid rounded shadow-sm"
                                 style={{ maxHeight: '400px', objectFit: 'cover' }} />
                        ) : (
                            <div className="bg-light p-5 rounded text-muted">Không có ảnh</div>
                        )}
                    </div>
                    <div className="col-md-7">
                        <h3 className="font-weight-bold text-dark">{product.name}</h3>
                        <span className="badge badge-info mb-2">{product.categoryProductName}</span>

                        <h4 className="text-danger font-weight-bold mt-3">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                        </h4>

                        <p className="text-muted mt-3">
                            <strong>Tồn kho:</strong> {product.stockQuantity} sản phẩm
                        </p>

                        {product.description && (
                            <div className="mt-3">
                                <h6 className="font-weight-bold">Mô tả:</h6>
                                <p className="text-secondary">{product.description}</p>
                            </div>
                        )}

                        <button className="btn btn-primary btn-lg mt-3">
                            <i className="fa-solid fa-cart-plus mr-2"></i> Thêm vào giỏ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
