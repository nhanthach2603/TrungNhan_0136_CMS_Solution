import React, { useState } from 'react';
import CategoryProductList from '../components/CategoryProductList';
import ProductList from '../components/ProductList';
import ProductDetail from '../components/ProductDetail';

const ShopPage = () => {
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [selectedProductId, setSelectedProductId] = useState(null);

    return (
        <div className="row">
            <div className="col-md-3 mb-4">
                <CategoryProductList
                    onSelectCategory={setSelectedCategoryId}
                    selectedId={selectedCategoryId}
                />
            </div>
            <div className="col-md-9">
                <h4 className="mb-4 text-uppercase text-secondary font-weight-bold">
                    <i className="fa-solid fa-bag-shopping mr-2"></i>Cửa hàng thời trang
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
    );
};

export default ShopPage;
