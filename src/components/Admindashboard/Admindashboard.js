import React, { useState, useEffect } from 'react';
import './Admin.css';

const AdminDashboard = () => {
  const [activities, setActivities] = useState([]);
  const [newActivity, setNewActivity] = useState({
    name: '',
    picture: '',
    description: '',
    scheduled_time: '',
  });
  const [editingActivity, setEditingActivity] = useState(null);
  // convert to 12hrs format
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
    fetchActivitiesDetails();
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

  const fetchActivityDetails = async (activityId) => {
    try {
      const response = await fetch(`/activities/${activityId}`);
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.error('Error fetching activity details:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching activity details:', error);
    }
  };

  const fetchActivitiesDetails = async () => {
    try {
      const activityDetailsPromises = activities.map((activity) =>
        fetchActivityDetails(activity.id)
      );
      const activityDetails = await Promise.all(activityDetailsPromises);
      setActivities(activityDetails);
    } catch (error) {
      console.error('Error fetching activities details:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (editingActivity) {
      setEditingActivity((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else {
      setNewActivity((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let url = '/activities';
      let method = 'POST';
      let body = { activity: newActivity };

      if (editingActivity) {
        url = `/activities/${editingActivity.id}`;
        method = 'PATCH';
        body = { activity: editingActivity };
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();
        if (editingActivity) {
          setActivities((prevState) =>
            prevState.map((activity) =>
              activity.id === data.id ? data : activity
            )
          );
          setEditingActivity(null);
        } else {
          setActivities([...activities, data]);
          // Clear the form fields after successful submission
          setNewActivity({
            name: '',
            picture: '',
            description: '',
            scheduled_time: '',
          });
        }
      } else {
        console.error(
          `Error ${editingActivity ? 'updating' : 'creating'} activity:`,
          response.statusText
        );
      }
    } catch (error) {
      console.error(
        `Error ${editingActivity ? 'updating' : 'creating'} activity:`,
        error
      );
    }
  };

  const handleEdit = (activity) => {
    setEditingActivity(activity);
    setNewActivity({
      name: '',
      picture: '',
      description: '',
      scheduled_time: '',
    });
  };


  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/activities/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setActivities(activities.filter((activity) => activity.id !== id));
      } else {
        console.error('Error deleting activity:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting activity:', error);
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <div className="create-activity">
        <h3>Create New Activity</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={editingActivity ? editingActivity.name : newActivity.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="picture">Picture URL:</label>
            <input
              type="text"
              id="picture"
              name="picture"
              value={
                editingActivity ? editingActivity.picture : newActivity.picture
              }
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={
                editingActivity
                  ? editingActivity.description
                  : newActivity.description
              }
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="scheduled_time">Scheduled Time:</label>
            <input
              type="datetime-local"
              id="scheduled_time"
              name="scheduled_time"
              value={
                editingActivity
                  ? editingActivity.scheduled_time
                  : newActivity.scheduled_time
              }
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">
            {editingActivity ? 'Update Activity' : 'Create Activity'}
          </button>
        </form>
      </div>

      <div className="activity-list">
        <h3>All Activities</h3>
        <ul>
          {activities.map((activity) => (
            <li key={activity.id} className="activity-card">
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
              <div className="activity-comments unique-activity-comments">
                <strong>Comments:</strong>{' '}
                <ul>
                  {activity.comments.map((comment) => (
                    <li key={comment.id}>{comment.content}</li>
                  ))}
                </ul>
              </div>
              <div className="activity-ratings unique-activity-ratings">
                <strong>Ratings:</strong>{' '}
                <ul>
                  {activity.ratings.map((rating) => (
                    <li key={rating.id}>Rating: {rating.value}</li>
                  ))}
                </ul>
              </div>
              <div className="activity-actions">
                <button className="btn" onClick={() => handleEdit(activity)}>
                  Edit
                </button>
                <button className="btn" onClick={() => handleDelete(activity.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
