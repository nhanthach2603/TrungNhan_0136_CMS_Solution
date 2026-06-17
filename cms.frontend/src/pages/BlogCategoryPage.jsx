import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import blogService from '../services/blogService';

const BlogCategoryPage = () => {
    const { id } = useParams();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoryName, setCategoryName] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const allPosts = await blogService.getAllPosts();
                const categories = await blogService.getBlogCategories();
                const cat = categories.find(c => c.id === parseInt(id));
                setCategoryName(cat?.name || 'Không xác định');
                const filtered = allPosts.filter(p => p.categoryId === parseInt(id));
                setPosts(filtered);
            } catch (error) {
                console.error("Lỗi:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="text-center my-5">
                <div className="spinner-border text-info" role="status"></div>
                <p className="mt-2 text-muted">Đang tải...</p>
            </div>
        );
    }

    return (
        <div>
            <Link to="/blog" className="btn btn-outline-secondary btn-sm mb-3">
                <i className="fa-solid fa-arrow-left mr-1"></i> Quay lại blog
            </Link>

            <h4 className="mb-4 text-uppercase text-secondary font-weight-bold">
                <i className="fa-solid fa-hashtag text-info mr-2"></i>{categoryName}
            </h4>

            {posts.length === 0 ? (
                <div className="alert alert-info">Chưa có bài viết nào trong chuyên mục này.</div>
            ) : (
                posts.map((post) => (
                    <div className="card shadow-sm bg-light mb-3" key={post.id}>
                        <div className="card-body">
                            <h5 className="card-title font-weight-bold">
                                <Link to={`/post/${post.id}`} className="text-dark text-decoration-none">
                                    {post.title}
                                </Link>
                            </h5>
                            <p className="card-text text-muted">
                                {post.shortDescription || 'Đang cập nhật nội dung tóm tắt...'}
                            </p>
                            <div className="d-flex justify-content-between align-items-center text-secondary small">
                                <span>
                                    <i className="fa-regular fa-calendar mr-1"></i>
                                    {new Date(post.createdDate).toLocaleDateString('vi-VN')}
                                </span>
                                <span className="badge badge-info px-2 py-1">{post.categoryName}</span>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default BlogCategoryPage;
