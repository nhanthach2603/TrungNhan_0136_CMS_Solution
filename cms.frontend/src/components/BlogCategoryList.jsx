import React, { useState, useEffect } from 'react';
import blogService from '../services/blogService';

const BlogCategoryList = () => {
    const [blogCategories, setBlogCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogCategories = async () => {
            try {
                setLoading(true);
                const data = await blogService.getBlogCategories();
                setBlogCategories(data);
            } catch (error) {
                console.error("Lỗi khi tải chuyên mục bài viết:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogCategories();
    }, []);

    if (loading) {
        return (
            <div className="card shadow-sm p-3 mt-4 bg-white rounded">
                <p className="text-center text-muted my-3">Đang nạp các chuyên mục bài viết...</p>
            </div>
        );
    }

    return (
        <div className="card shadow-sm p-3 mt-4 bg-white rounded">
            <h5 className="card-title text-uppercase font-weight-bold text-dark mb-3" style={{ letterSpacing: '0.5px', fontSize: '1.1rem' }}>
                <i className="fa-solid fa-tags text-info mr-2"></i> Chuyên mục bài viết
            </h5>

            {blogCategories.length === 0 ? (
                <p className="text-muted small">Chưa có chuyên mục nào.</p>
            ) : (
                <div className="list-group list-group-flush">
                    {blogCategories.map((cate) => (
                        <a
                            key={cate.id}
                            href={`/blog/category/${cate.id}`}
                            className="list-group-item list-group-item-action border-0 px-0 py-2"
                        >
                            <i className="fa-solid fa-hashtag text-info mr-2"></i>
                            {cate.name}
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BlogCategoryList;
