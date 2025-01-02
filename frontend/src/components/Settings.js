// Settings.js

import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/authContext";
import axios from 'axios';
import "../styles/Settings.css";

const Settings = () => {
  const [userSettings, setUserSettings] = useState(null);
  const [formData, setFormData] = useState({});
  const { isAuthenticated, username } = useAuth();  

  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/personal-information/${username}`);
        setUserSettings(response.data);
        setFormData({
          name: response.data.name,
          birthdayT: response.data.birthday.t,
          birthdayI: response.data.birthday.i,
          account: response.data.account,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Failed to load user information.");
      }
    };

    if (username && isAuthenticated) {
      fetchUserSettings();
    }
  }, [username]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = {
      name: formData.name,
      birthday: {
        t: formData.birthdayT,
        i: formData.birthdayI,
      },
      account: formData.account,
    };

    try {
      const response = await axios.put(
        `http://localhost:5000/personal-information/${username}`,
        updatedData
      );
      alert(response.data.message);  // Show the success message returned from the API
    } catch (error) {
      console.error("Error updating user data:", error);
      alert("There was an error updating your information.");
    }
  };

  return (
    <div className="SettingsSection" id="Settings">
      {userSettings ? (
        <div>
          <h1>Settings</h1>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Birthday (t):</label>
              <input
                type="number"
                name="birthdayT"
                value={formData.birthdayT}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Birthday (i):</label>
              <input
                type="number"
                name="birthdayI"
                value={formData.birthdayI}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Account:</label>
              <input
                type="text"
                name="account"
                value={formData.account}
                onChange={handleChange}
              />
            </div>

            <button type="submit">Save Changes</button>
          </form>
        </div>
      ) : (
        <p>Loading your settings...</p>
      )}
    </div>
  );
};

export default Settings;
