import React from 'react';
import PostList from '../components/PostList';
import BlogCategoryList from '../components/BlogCategoryList';

const BlogPage = () => {
    return (
        <div className="row">
            <div className="col-md-4">
                <BlogCategoryList />
            </div>
            <div className="col-md-8">
                <PostList />
            </div>
        </div>
    );
};

export default BlogPage;
