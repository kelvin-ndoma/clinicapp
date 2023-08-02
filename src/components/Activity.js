import React, { useState, useEffect } from 'react';

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
    // Check if the logged-in user is an admin
    const isAdmin = user && user.role === 'admin';

    return (
      <div>
        {isAdmin && <strong>Comments:</strong>}
        <ul>
          {activity.comments.map((comment) => (
            // Only render comments for the admin user
            isAdmin ? (
              <li key={comment.id}>{comment.content}</li>
            ) : null // Hide the comments for normal users
          ))}
        </ul>
        {user && !isAdmin ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const content = e.target.comment.value;
              handleCommentSubmit(activity.id, content);
              e.target.reset();
            }}
          >
            <input
              type="text"
              name="comment"
              placeholder="Add your comment..."
              required
            />
            <button type="submit">Submit Comment</button>
          </form>
        ) : (
          // Show the login message and form for normal users
          !user && (
            <div>
              <p>Please log in to leave a comment.</p>
              <form>
                <input
                  type="text"
                  name="comment"
                  placeholder="Add your comment..."
                  required
                />
                <button type="submit">Submit Comment</button>
              </form>
            </div>
          )
        )}
      </div>
    );
  };

  return (
    <div>
      <h2>User Activities</h2>
      <div>
        <h3>All Activities</h3>
        <ul>
          {activities.map((activity) => (
            <li key={activity.id}>
              <div>
                <strong>Name:</strong> {activity.name}
              </div>
              <div>
                <strong>Picture:</strong>{' '}
                <img
                  src={activity.picture}
                  alt={activity.name}
                  style={{ maxWidth: '200px', maxHeight: '200px' }}
                />
              </div>
              <div>
                <strong>Description:</strong> {activity.description}
              </div>
              <div>
                <strong>Scheduled Time:</strong>{' '}
                {formatTime12hr(activity.scheduled_time)}
              </div>
              {renderComments(activity)}
              <div>
                <strong>Rating:</strong> {renderStars(activity)}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Activities;
