import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUser } from 'react-icons/fi'; // Import the FiUser icon from react-icons
import './Navbar.css';

function Navbar({ user, onLogout }) {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await fetch('/logout', {
        method: 'DELETE',
      });
      if (response.ok) {
        onLogout(); // Call the onLogout prop to set the user state to null
        window.location.reload(); // Refresh the page
      } else {
        console.error('Logout failed:', response);
        // TODO: Handle logout error
      }
    } catch (error) {
      console.error('Error occurred during logout:', error);
      // TODO: Handle logout error
    }
  };

  const handleDropdownToggle = () => {
    setShowDropdown((prevShowDropdown) => !prevShowDropdown);
  };

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/activities">Activities</Link>
        </li>
        <li>
          <Link to="/contact">Contact Us</Link>
        </li>
        {user && user.role === 'admin' && (
          <li>
            <Link to="/stories">Stories</Link>
          </li>
        )}
        {user && user.role === 'admin' && (
          <li>
            <Link to="/admindashboard">Admin Dashboard</Link>
          </li>
        )}
        {user ? (
          <li>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </li>
        ) : (
          <li className="account-icon-wrapper">
            <button className="account-icon" onClick={handleDropdownToggle}>
              {/* Replace the placeholder text with the FiUser icon */}
              <FiUser />
            </button>
            {showDropdown && (
              <ul className="dropdown-menu">
                {/* Show "Login" option only if the user is not logged in */}
                {!user && (
                  <li>
                    <Link to="/login">Login</Link>
                  </li>
                )}
              </ul>
            )}
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
