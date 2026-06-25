import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import blogService from '../services/blogService';
import { formatDate } from '../utils/formatters';
import BreadcrumbNav from '../components/BreadcrumbNav';

const BlogPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await blogService.getAllPosts();
                setPosts(data || []);
            } catch (error) {
                console.error("Lỗi khi tải bài viết:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    if (loading) {
        return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;
    }

    return (
        <div className="blog-page py-4">
            <BreadcrumbNav items={[
                { label: 'Trang chủ', to: '/' },
                { label: 'Tin tức công nghệ' }
            ]} />

            <h1 className="mb-4" style={{ fontSize: '1.6rem', fontWeight: 700 }}>
                <i className="fa-solid fa-newspaper mr-2"></i> Tin tức công nghệ
            </h1>

            {posts.length === 0 ? (
                <div className="text-center py-5">
                    <i className="fa-solid fa-newspaper fa-3x text-muted mb-3"></i>
                    <p className="text-muted">Chưa có bài viết nào.</p>
                </div>
            ) : (
                <div className="row">
                    {posts.map(post => (
                        <div key={post.id} className="col-md-4 mb-4">
                            <div className="card h-100 shadow-sm" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                                {post.imageUrl && (
                                    <img
                                        src={post.imageUrl}
                                        className="card-img-top"
                                        alt={post.title}
                                        style={{ height: '200px', objectFit: 'cover' }}
                                    />
                                )}
                                <div className="card-body d-flex flex-column">
                                    <span className="badge bg-primary mb-2" style={{ width: 'fit-content', fontSize: '0.7rem' }}>
                                        {post.categoryName || 'Tin tức'}
                                    </span>
                                    <h5 className="card-title" style={{ fontSize: '1rem', fontWeight: 600 }}>
                                        {post.title}
                                    </h5>
                                    <p className="card-text text-muted flex-grow-1" style={{ fontSize: '0.85rem' }}>
                                        {post.content?.replace(/<[^>]+>/g, '').substring(0, 120)}...
                                    </p>
                                    <div className="d-flex justify-content-between align-items-center mt-auto pt-2" style={{ borderTop: '1px solid #eee' }}>
                                        <small className="text-muted">
                                            <i className="fa-regular fa-calendar mr-1"></i>
                                            {formatDate(post.createdDate)}
                                        </small>
                                        <Link to={`/post/${post.id}`} className="btn btn-sm btn-outline-primary" style={{ borderRadius: '20px', fontSize: '0.8rem' }}>
                                            Đọc thêm
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BlogPage;
