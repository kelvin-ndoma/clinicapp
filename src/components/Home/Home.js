import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="landing-page">
      <div className="home-container">
      <div className="hero-section">
  <h1 className="home-title">Welcome to Mukuru Salama Youth Hub!</h1>
  <h4 className="home-subtitle">This is a safe space for all of us</h4>
  <div className="home-description">
    <p>
      We are a mental health haven dedicated to serving youth of Mukuru and its surrounding areas through creating a safe and inclusive space where youth can freely express themselves, grow emotionally, and nurture themselves in all spheres of life.
    </p>
  </div>
</div>


        <h2 className="section-title">Our Mission</h2>
        <div className="mission-section">
          <div className="image-wrapper">
            <img
              className="section-image"
              src="https://img.freepik.com/free-photo/top-view-assortment-optimism-concept-elements_23-2148861684.jpg?size=626&ext=jpg&ga=GA1.2.1191098058.1684769255&semt=country_rows_v2"
              alt="Mission"
            />
          </div>
          <p className="section-description">
            Transforming Minds, Inspiring lives. Our mission is to prioritize the mental well-being of young individuals by adopting a holistic approach that addresses the interconnected facets of their lives.
          </p>
        </div>

        <h2 className="section-title">Our Vision</h2>
        <div className="vision-section">
          <div className="image-wrapper">
            <img
              className="section-image"
              src="https://img.freepik.com/free-vector/self-love-sticker-set_23-2149632642.jpg?size=626&ext=jpg&ga=GA1.2.1191098058.1684769255&semt=country_rows_v2"
              alt="Vision"
            />
          </div>
          <p className="section-description">
            Our vision is to create a holistic youth mental health hub that empowers young individuals to embrace their unique potential, promoting mental well-being, resilience, and personal growth.
          </p>
        </div>

        <Link to="/activities">
          <button className="home-button">Explore Activities</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
