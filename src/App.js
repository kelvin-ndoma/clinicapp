import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import Login from "./components/Login";
import Signup from "./components/Signup/Signup";
import Admindashboard from "./components/Admindashboard/Admindashboard";
import Activities from "./components/Activity/Activity";
import Blogs from "./components/Stories/Blogs";
import Myblogs from "./components/Stories/Myblogs";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // auto-login
    fetch("/current_user")
      .then((r) => {
        if (r.ok) {
          return r.json();
        }
        throw new Error("User not logged in");
      })
      .then((userData) => {
        setUser(userData);
      })
      .catch((error) => {
        setUser(null); // Set user to null on auto-login failure
        console.error("Auto-login failed:", error);
      });
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/logout", {
        method: "DELETE",
      });
      if (response.ok) {
        setUser(null);
      } else {
        console.error("Logout failed:", response);
        // TODO: Handle logout error
      }
    } catch (error) {
      console.error("Error occurred during logout:", error);
      // TODO: Handle logout error
    }
  };

  return (
    <Router>
      <>
        <Navbar user={user} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/admindashboard"
            element={<Admindashboard user={user} setUser={setUser} />}
          />
          <Route path="/activities" element={<Activities user={user} />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/login"
            element={<Login onLogin={handleLogin} />}
          />
          <Route path="/blogs" element={<Blogs user={user} />} />
          <Route path="/myblogs" element={<Myblogs user={user} />} />
        </Routes>
      </>
    </Router>
  );
}

export default App;
