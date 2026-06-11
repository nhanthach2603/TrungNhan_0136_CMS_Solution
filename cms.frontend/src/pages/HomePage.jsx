import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CategoryProductList from '../components/CategoryProductList';
import ProductList from '../components/ProductList';
import ProductDetail from '../components/ProductDetail';

const HomePage = () => {
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [selectedProductId, setSelectedProductId] = useState(null);

    return (
        <div>
            <section className="mb-5">
                <div className="p-5 bg-gradient rounded shadow-sm text-center"
                     style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                    <h1 className="display-4 font-weight-bold text-white">Chào mừng đến Fashion Boutique</h1>
                    <p className="lead text-white-50 mt-3">Thời trang công sở & dạ hội — Cập nhật xu hướng mới nhất.</p>
                    <Link to="/shop" className="btn btn-light btn-lg mt-2 font-weight-bold">
                        <i className="fa-solid fa-bag-shopping mr-2"></i>Mua sắm ngay
                    </Link>
                </div>
            </section>

            <section className="mb-5">
                <div className="row">
                    <div className="col-md-3 mb-4">
                        <CategoryProductList
                            onSelectCategory={setSelectedCategoryId}
                            selectedId={selectedCategoryId}
                        />
                    </div>
                    <div className="col-md-9">
                        <h4 className="mb-4 text-uppercase text-secondary font-weight-bold">
                            <i className="fa-solid fa-fire text-danger mr-2"></i>Bộ sưu tập mới nhất
                        </h4>
                        {selectedProductId ? (
                            <ProductDetail
                                productId={selectedProductId}
                                onBack={() => setSelectedProductId(null)}
                            />
                        ) : (
                            <ProductList
                                categoryId={selectedCategoryId}
                                onViewProduct={setSelectedProductId}
                            />
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
