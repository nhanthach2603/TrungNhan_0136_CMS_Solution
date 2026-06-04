import React, { useState, useEffect } from 'react';
import blogService from '../services/blogService';

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const data = await blogService.getAllPosts();
                setPosts(data);
            } catch (error) {
                console.error("Lỗi khi tải danh sách bài viết:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return (
            <div className="text-center my-5">
                <div className="spinner-border text-info" role="status">
                    <span className="sr-only">Đang tải...</span>
                </div>
                <p className="mt-2 text-muted">Đang tải danh sách bài viết...</p>
            </div>
        );
    }

    return (
        <div className="mt-5">
            <h4 className="mb-4 text-uppercase text-secondary font-weight-bold border-bottom pb-2">
                <i className="fa-solid fa-newspaper text-info mr-2"></i> Tin tức & Bài viết
            </h4>

            {posts.length === 0 ? (
                <div className="alert alert-info" role="alert">
                    Hệ thống chưa có bài viết nào. Vui lòng quay lại sau!
                </div>
            ) : (
                posts.map((post) => (
                    <div className="card shadow-sm bg-light mb-3" key={post.id}>
                        <div className="card-body">
                            <h5 className="card-title font-weight-bold mb-2">
                                <a href={`/post/${post.id}`} className="text-dark text-decoration-none">
                                    {post.title}
                                </a>
                            </h5>
                            <p className="card-text text-muted">
                                {post.shortDescription || 'Đang cập nhật nội dung tóm tắt cho bài viết...'}
                            </p>
                            <div className="d-flex justify-content-between align-items-center text-secondary small">
                                <span>
                                    <i className="fa-regular fa-calendar mr-1"></i>
                                    {new Date(post.createdDate).toLocaleDateString('vi-VN')}
                                </span>
                                {post.categoryName && (
                                    <span className="badge badge-info px-2 py-1">
                                        <i className="fa-solid fa-hashtag mr-1"></i>{post.categoryName}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default PostList;
