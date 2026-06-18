import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import blogService from '../services/blogService';
import LoadingSpinner from '../components/LoadingSpinner';
import BreadcrumbNav from '../components/BreadcrumbNav';
import { formatDate } from '../utils/formatters';

const PostDetailPage = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [popularPosts, setPopularPosts] = useState([]);

    useEffect(() => {
        const fetchPostAndPopular = async () => {
            try {
                setLoading(true);
                const [postData, allPosts] = await Promise.all([
                    blogService.getPostById(id),
                    blogService.getAllPosts().catch(() => [])
                ]);
                setPost(postData);
                
                // Get up to 3 other posts
                const otherPosts = allPosts.filter(p => p.id !== id && p.id !== Number(id));
                setPopularPosts(otherPosts.slice(0, 4));
            } catch (error) {
                console.error("Lỗi khi tải bài viết:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPostAndPopular();
    }, [id]);

    if (loading) return <LoadingSpinner message="Đang tải bài viết..." />;

    if (!post) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger">Không tìm thấy bài viết tin tức!</div>
            </div>
        );
    }


    return (
        <div className="post-detail-page-wrapper">
            <BreadcrumbNav items={[
                { label: 'Trang chủ', to: '/' },
                { label: 'Tin tức', to: '/' },
                { label: post.title }
            ]} />

            <div className="row mt-3">
                {/* LEFT COLUMN: ARTICLE CONTENT */}
                <div className="col-md-8">
                    <article className="post-detail-content-card">
                        <h2 className="post-detail-title">{post.title}</h2>
                        
                        <div className="post-detail-meta mb-4">
                            <span><i className="fa-regular fa-calendar mr-1"></i> {formatDate(post.createdDate)}</span>
                            <span className="mx-2">|</span>
                            <span><i className="fa-solid fa-folder mr-1"></i> {post.categoryName || 'Kiến thức nhiếp ảnh'}</span>
                            <span className="mx-2">|</span>
                            <span><i className="fa-solid fa-eye mr-1"></i> 1,208 lượt xem</span>
                        </div>

                        {post.imageUrl && (
                            <div className="post-detail-cover mb-4">
                                <img src={post.imageUrl} alt={post.title} className="img-fluid rounded" />
                            </div>
                        )}

                        <div className="post-content-body">
                            {post.content ? (
                                <div style={{ whiteSpace: 'pre-line' }}>{post.content}</div>
                            ) : (
                                <p className="text-muted">Nội dung chi tiết của bài viết đang được biên tập...</p>
                            )}
                        </div>
                    </article>
                </div>

                {/* RIGHT COLUMN: SIDEBAR */}
                <div className="col-md-4">
                    {/* Social community widget */}
                    <div className="sidebar-widget">
                        <h4 className="widget-title">THAM GIA CỘNG ĐỒNG</h4>
                        <div className="social-community-box">
                            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="community-link yt">
                                <i className="fa-brands fa-youtube"></i>
                                <span>Kênh Youtube Máy Ảnh (120K Sub)</span>
                            </a>
                            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="community-link fb">
                                <i className="fa-brands fa-facebook"></i>
                                <span>Cộng đồng Nhiếp ảnh Việt Nam</span>
                            </a>
                        </div>
                    </div>

                    {/* Popular articles widget */}
                    {popularPosts.length > 0 && (
                        <div className="sidebar-widget mt-4">
                            <h4 className="widget-title">BÀI VIẾT XEM NHIỀU</h4>
                            <div className="popular-posts-list">
                                {popularPosts.map(p => (
                                    <Link key={p.id} to={`/post/${p.id}`} className="popular-post-item">
                                        <div className="popular-post-img">
                                            {p.imageUrl ? (
                                                <img src={p.imageUrl} alt={p.title} />
                                            ) : (
                                                <div className="empty-thumb-placeholder">
                                                    <i className="fa-solid fa-newspaper"></i>
                                                </div>
                                            )}
                                        </div>
                                        <div className="popular-post-info">
                                            <h5 className="popular-post-title">{p.title}</h5>
                                            <span className="popular-post-date">{formatDate(p.createdDate)}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Keywords/Tags widget */}
                    <div className="sidebar-widget mt-4">
                        <h4 className="widget-title">TAGS TỪ KHÓA</h4>
                        <div className="tags-cloud">
                            <Link to="/" className="tag-link">Máy ảnh DSLR</Link>
                            <Link to="/" className="tag-link">Mirrorless Sony</Link>
                            <Link to="/" className="tag-link">Ống kính Canon</Link>
                            <Link to="/" className="tag-link">Kinh nghiệm chụp ảnh</Link>
                            <Link to="/" className="tag-link">Đánh giá máy ảnh</Link>
                            <Link to="/" className="tag-link">Setup Studio</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostDetailPage;
