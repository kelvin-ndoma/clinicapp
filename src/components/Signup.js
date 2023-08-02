import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    role: 0, // Set the default role to 0 (normal user)
  });

  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
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
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email address';
    }
    if (!formData.password.trim()) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }
    if (formData.password !== formData.passwordConfirmation) {
      errors.passwordConfirmation = 'Passwords do not match';
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
      const response = await fetch('/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // User registered successfully
        const userData = await response.json();
        console.log('User registered:', userData);
        // TODO: Redirect to another page or show a success message
        navigate('/login'); // Navigate to the login page after successful signup
      } else {
        // Error occurred while registering
        const errorData = await response.json();
        console.error('Registration error:', errorData);
        // TODO: Display error message to the user
      }
    } catch (error) {
      console.error('Error occurred during registration:', error);
      // TODO: Display error message to the user
    }
  };

  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const handleTogglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div>
      <h2>Sign Up</h2>
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
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {formErrors.email && <span>{formErrors.email}</span>}
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
        <div>
          <label htmlFor="passwordConfirmation">Confirm Password:</label>
          <input
            type="password"
            id="passwordConfirmation"
            name="passwordConfirmation"
            value={formData.passwordConfirmation}
            onChange={handleChange}
            required
          />
          {formErrors.passwordConfirmation && (
            <span>{formErrors.passwordConfirmation}</span>
          )}
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
