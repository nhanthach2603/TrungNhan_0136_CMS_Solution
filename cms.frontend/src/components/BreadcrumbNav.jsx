import React from 'react';
import { Link } from 'react-router-dom';

/**
 * BreadcrumbNav — Component breadcrumb tái sử dụng
 * @param {Array} items - Danh sách breadcrumb item
 *   Mỗi item: { label: string, to?: string }
 *   Item cuối cùng (không có `to`) được coi là trang hiện tại
 *
 * @example
 * <BreadcrumbNav items={[
 *   { label: 'Trang chủ', to: '/' },
 *   { label: 'Máy ảnh', to: '/?category=1' },
 *   { label: 'Sony A7IV' }
 * ]} />
 */
const BreadcrumbNav = ({ items = [] }) => {
    if (!items.length) return null;

    return (
        <div className="breadcrumb-nav">
            {items.map((item, index) => (
                <React.Fragment key={index}>
                    {index > 0 && (
                        <i className="fa-solid fa-chevron-right mx-2"></i>
                    )}
                    {item.to ? (
                        <Link to={item.to}>{item.label}</Link>
                    ) : (
                        <span>{item.label}</span>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

export default BreadcrumbNav;
