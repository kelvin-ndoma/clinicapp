import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Myblogs.css';

const MyBlogs = ({ user }) => {
  const [blogs, setBlogs] = useState([]);
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [editingBlogId, setEditingBlogId] = useState(null);

  useEffect(() => {
    if (user) {
      fetchBlogs();
    }
  }, [user]);

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/my_blogs', {
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

  const handleCreate = async () => {
    if (!user) {
      alert('Please log in to create a blog.');
      return;
    }

    try {
      const response = await fetch('/blogs', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newBlog = await response.json();
        setBlogs([...blogs, newBlog]);
        setFormData({ title: '', content: '' });

        // Fetch the updated list of blogs after creating a new blog
        fetchBlogs();
      } else {
        console.error('Error creating blog:', response.status);
      }
    } catch (error) {
      console.error('Error creating blog:', error);
    }
  };

  const handleEdit = (blogId) => {
    const blogToEdit = blogs.find((blog) => blog.id === blogId);
    if (blogToEdit) {
      setFormData({ title: blogToEdit.title, content: blogToEdit.content });
      setEditingBlogId(blogId);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`/blogs/${editingBlogId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedBlog = await response.json();
        const updatedBlogs = blogs.map((blog) =>
          blog.id === editingBlogId ? updatedBlog : blog
        );
        setBlogs(updatedBlogs);
        setFormData({ title: '', content: '' });
        setEditingBlogId(null);
      } else {
        console.error('Error updating blog:', response.status);
      }
    } catch (error) {
      console.error('Error updating blog:', error);
    }
  };

  const handleDelete = async (blogId) => {
    try {
      const response = await fetch(`/blogs/${blogId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        const updatedBlogs = blogs.filter((blog) => blog.id !== blogId);
        setBlogs(updatedBlogs);
      } else {
        console.error('Error deleting blog:', response.status);
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  return (
    <div className="my-blogs-container">
      <h1 className="my-blogs-title">My Blogs</h1>
      {user ? (
        <div className="my-blogs-section">
          <div className="create-blog-section">
            <h2>Create a New Blog</h2>
            <input
              className="blog-input"
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <textarea
              className="blog-textarea"
              placeholder="Content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
            {editingBlogId ? (
              <button className="action-button" onClick={handleUpdate}>Update</button>
            ) : (
              <button className="action-button" onClick={handleCreate}>Create</button>
            )}
          </div>
          <div className="blog-list-section">
            <h2>My Blog List</h2>
            <ul className="blog-list">
              {blogs.map((blog) => (
                <li className="blog-item" key={blog.id}>
                  <h3 className="blog-item-title">{blog.title}</h3>
                  <p className="blog-item-content">{blog.content}</p>
                  <p className="blog-item-likes">Likes: {blog.likes_count}</p>
                  <button className="action-button" onClick={() => handleEdit(blog.id)}>Edit</button>
                  <button className="action-button" onClick={() => handleDelete(blog.id)}>Delete</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p className="login-prompt">Please <Link to="/login">log in</Link> to create and manage your blogs.</p>
      )}
    </div>
  );
};

export default MyBlogs;
