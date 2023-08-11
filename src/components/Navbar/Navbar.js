import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser } from 'react-icons/fi';
import { FaBars, FaTimes } from 'react-icons/fa'; // Added import for FaBars and FaTimes icons
import './Navbar.css';

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch('/logout', {
        method: 'DELETE',
      });
      if (response.ok) {
        onLogout();
        navigate('/');
        window.location.reload();
      } else {
        console.error('Logout failed:', response);
        // Handle logout error
      }
    } catch (error) {
      console.error('Error occurred during logout:', error);
      // Handle logout error
    }
  };

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false); // State to manage mobile menu

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav>
      <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
        {mobileMenuOpen ? <FaTimes /> : <FaBars />}
      </div>
      <ul className={`menu-items ${mobileMenuOpen ? 'mobile-menu-open' : ''}`}>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/activities">Activities</Link>
        </li>
        <li>
          <Link to="/blogs">Blogs</Link>
        </li>
        <li>
          <Link to="/contact">Contact Us</Link>
        </li>
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
          <li>
            <Link to="/login" className="user-icon">
              <FiUser />
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
