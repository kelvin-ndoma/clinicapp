import React, { useState, useEffect } from 'react';
import './Activity.css';

const Activities = ({ user }) => {
  const [activities, setActivities] = useState([]);

  const formatTime12hr = (timeString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    return new Date(timeString).toLocaleString('en-US', options);
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await fetch('/activities');
      if (response.ok) {
        const data = await response.json();
        setActivities(data);
      } else {
        console.error('Error fetching activities:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const handleCommentSubmit = async (activityId, content) => {
    if (!user) {
      alert('Please log in to comment.'); // Alert the user to log in
      return;
    }

    try {
      const response = await fetch(`/activities/${activityId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        const data = await response.json();
        setActivities((prevActivities) =>
          prevActivities.map((activity) =>
            activity.id === activityId
              ? { ...activity, comments: [...activity.comments, data] }
              : activity
          )
        );
        alert('Comment submitted successfully!');
      } else {
        console.error('Error submitting comment:', response.statusText);
        alert('Error submitting comment. Please try again later.');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Error submitting comment. Please try again later.');
    }
  };

  const handleRatingSubmit = async (activityId, value) => {
    if (!user) {
      alert('Please log in to rate.'); // Alert the user to log in
      return;
    }

    try {
      const response = await fetch(`/activities/${activityId}/ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value }),
      });

      if (response.ok) {
        const data = await response.json();
        setActivities((prevActivities) =>
          prevActivities.map((activity) =>
            activity.id === activityId
              ? { ...activity, ratings: [...activity.ratings, data] }
              : activity
          )
        );
        alert('Rating submitted successfully!');
      } else {
        console.error('Error submitting rating:', response.statusText);
        alert('Error submitting rating. Please try again later.');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Error submitting rating. Please try again later.');
    }
  };

  const renderStars = (activity) => {
    const maxStars = 5;
    const ratingValue = activity.ratings.reduce(
      (sum, rating) => sum + rating.value,
      0
    );
    const averageRating = ratingValue / activity.ratings.length;
    const stars = [];

    for (let i = 1; i <= maxStars; i++) {
      stars.push(
        <span
          key={i}
          onClick={() => handleRatingSubmit(activity.id, i)}
          style={{
            cursor: 'pointer',
            color: i <= averageRating ? 'gold' : 'gray',
          }}
        >
          ★
        </span>
      );
    }

    return stars;
  };

  const renderComments = (activity) => {
    const isAdmin = user && user.role === 'admin';
    const comments = activity.comments || [];

    return (
      <div>
      {isAdmin && <strong>Comments:</strong>}
      <ul>
        {isAdmin &&
          comments.map((comment) => (
            <li key={comment.id}>{comment.content}</li>
          ))}
      </ul>
      {!isAdmin && user ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const content = e.target.comment.value;
            handleCommentSubmit(activity.id, content);
            e.target.reset();
          }}
          className="form-container" // Add the classname here
        >
          <input
            type="text"
            name="comment"
            placeholder="Add your comment..."
            required
          />
          <button type="submit" className="submit-button">Submit Comment</button>
        </form>
      ) : (
        // Show the login message and form for normal users
        !user && (
          <div>
            <form className="form-container"> {/* Add the classname here */}
              <input
                type="text"
                name="comment"
                placeholder="Add your comment..."
                required
              />
              <button type="submit" className="submit-button">Submit Comment</button>
            </form>
          </div>
        )
      )}
    </div>
  );
};


  const sortedActivities = activities.slice().sort((a, b) => {
    const timeA = new Date(a.scheduled_time).getTime();
    const timeB = new Date(b.scheduled_time).getTime();
    return timeB - timeA;
  });

  return (
    <div className="activities-container">
      <h2 className="activities-title">Activities Corner</h2>
      <div className="activities-section">
        <h3 className="activities-section-title">See the List of Our Activities Here</h3>
        <div className="activities-wrapper">
          <div className="activities-list">
            <ul className="activity-list">
              <li className="activity-item">Free Psychotherapy sessions</li>
              <li className="activity-item">Peer Support Groups</li>
              <li className="activity-item">Indoor Games</li>
              <li className="activity-item">Professional Skills Trainings</li>
              <li className="activity-item">Other Activities (e.g. Yoga, Nzumba, Thursday Movie nights, etc.)</li>
            </ul>
          </div>
          <div className="upcoming-events">
            <h1 className="upcoming-events-title">Upcoming Events</h1>
            <h6 className="upcoming-events-description">
              Explore the upcoming activities and leave a comment on what you
              expect from the activity
            </h6>
            <ul className="upcoming-events-list">
              {sortedActivities.map((activity) => (
                <li key={activity.id} className="upcoming-event">
                  <div className="activity-details">
                    <strong className="activity-details-label"></strong> {activity.name}
                    <div className="activity-image-container">
                      <strong className="activity-details-label"></strong>
                      <img
                        src={activity.picture}
                        alt={activity.name}
                        className="activity-image"
                      />
                    </div>
                    <strong className="activity-details-label">Description:</strong> {activity.description}
                    <strong className="activity-details-label">Scheduled Time:</strong> {formatTime12hr(activity.scheduled_time)}
                  </div>
                  {renderComments(activity)}
                  <div className="activity-rating">
                    <strong className="activity-rating-label">Rating:</strong> {renderStars(activity)}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Activities;