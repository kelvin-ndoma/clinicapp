import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    password: '',
  });

  const [formErrors, setFormErrors] = useState({
    name: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    if (!formData.password.trim()) {
      errors.password = 'Password is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // User logged in successfully
        const userData = await response.json();
        console.log('User logged in:', userData);
        // Update the user state in the parent component
        onLogin(userData);

        // Check the role of the user and navigate accordingly
        if (userData.role === 'admin') {
          navigate('/admindashboard');
        } else {
          navigate('/activities');
        }
      } else {
        // Error occurred while logging in
        const errorData = await response.json();
        console.error('Login error:', errorData);
        // TODO: Display error message to the user
      }
    } catch (error) {
      console.error('Error occurred during login:', error);
      // TODO: Display error message to the user
    }
  };

  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const handleTogglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          {formErrors.name && <span>{formErrors.name}</span>}
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <div className="password-input-container">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="toggle-password-btn"
              onClick={handleTogglePassword}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {formErrors.password && <span>{formErrors.password}</span>}
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
