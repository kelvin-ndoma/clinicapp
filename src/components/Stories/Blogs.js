import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Blogs.css';

const Blogs = ({ user }) => {
  const [blogs, setBlogs] = useState([]);
  const [expandedBlogs, setExpandedBlogs] = useState([]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/blogs', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setBlogs(data);
      } else {
        console.error('Error fetching blogs:', response.status);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  const handleLike = async (blogId) => {
    try {
      if (!user) {
        alert('Please log in to like the blog.');
        return;
      }

      const response = await fetch(`/blogs/${blogId}/toggle_like`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        const updatedBlogs = blogs.map((blog) =>
          blog.id === blogId
            ? { ...blog, likes_count: blog.likes_count + 1, liked: true }
            : blog
        );
        setBlogs(updatedBlogs);
      } else {
        console.error('Error toggling like:', response.status);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const toggleExpand = (blogId) => {
    if (expandedBlogs.includes(blogId)) {
      setExpandedBlogs(expandedBlogs.filter(id => id !== blogId));
    } else {
      setExpandedBlogs([...expandedBlogs, blogId]);
    }
  };

  return (
    <div className="blogs-container">
      <h1 className="blogs-title">Blogs</h1>
      {user && (
        <div className="my-blogs-link">
          <p>
            <Link to="/myblogs">Go to My Blogs</Link>
          </p>
        </div>
      )}
      {blogs.map((blog) => (
        <div key={blog.id} className="blog-card">
          <h2 className="blog-title">Title: {blog.title}</h2>
          <p className="blog-author">Written By: {blog.author_name}</p>
          <div className={`blog-content ${expandedBlogs.includes(blog.id) ? 'expanded' : ''}`}>
            {blog.content}
          </div>
          {blog.content.split('.').length > 4 && (
            <div>
              <button className="read-more-button" onClick={() => toggleExpand(blog.id)}>
                {expandedBlogs.includes(blog.id) ? 'See Less' : 'Read More'}
              </button>
            </div>
          )}
          <p className="blog-likes">
            <span
              className={`heart-icon ${blog.liked ? 'liked' : ''}`}
              onClick={() => handleLike(blog.id)}
            >
              ❤️
            </span>
            {blog.likes_count}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Blogs;
