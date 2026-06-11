import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import blogService from '../services/blogService';

const PostDetailPage = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const data = await blogService.getPostById(id);
                setPost(data);
            } catch (error) {
                console.error("Lỗi khi tải bài viết:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    if (loading) {
        return (
            <div className="text-center my-5">
                <div className="spinner-border text-primary"></div>
                <p className="mt-2 text-muted">Đang tải bài viết...</p>
            </div>
        );
    }

    if (!post) {
        return <div className="alert alert-danger">Không tìm thấy bài viết!</div>;
    }

    const formatDate = (date) => new Date(date).toLocaleDateString('vi-VN');

    return (
        <div>
            <Link to="/" className="btn btn-outline-secondary btn-sm mb-3">
                <i className="fa-solid fa-arrow-left mr-1"></i> Quay lại
            </Link>

            <article>
                <h2 className="font-weight-bold text-dark mb-3">{post.title}</h2>
                <div className="text-muted mb-3">
                    <i className="fa-regular fa-calendar mr-1"></i> {formatDate(post.createdDate)}
                    <span className="mx-2">|</span>
                    <i className="fa-solid fa-folder mr-1"></i> {post.categoryName}
                </div>

                {post.imageUrl && (
                    <img src={post.imageUrl} alt={post.title}
                         className="img-fluid rounded shadow-sm mb-4"
                         style={{ maxHeight: '450px', width: '100%', objectFit: 'cover' }} />
                )}

                <div className="post-content" style={{ lineHeight: '1.9', fontSize: '1.05rem', color: '#444' }}>
                    {post.content}
                </div>
            </article>
        </div>
    );
};

export default PostDetailPage;
