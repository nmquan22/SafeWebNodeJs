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
        const response = await axios.get(`http://localhost:5000/user/${username}`);
        setUserSettings(response.data);
        setFormData({
          organ_id: response.data.organ_id,
          personal_information: {
            name: response.data.personal_information.name,
            birthday: response.data.personal_information.birthday,
            account: response.data.personal_information.account,
          },
          role: response.data.role,
          rules: {
            time_active: response.data.rules.time_active,
            time_limit: response.data.rules.time_limit,
            block_website: response.data.rules.block_website,
            black_list_filter: response.data.rules.black_list_filter,
          },
          password: response.data.password,
          username: response.data.username,
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
    const { name, value, type, checked, dataset } = e.target;
  
    setFormData((prev) => {
      if (dataset.nested) {
        const [parent, child] = name.split(".");
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: type === "checkbox" ? checked : value,
          },
        };
      }
  
      return {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = {
      organ_id: formData.organ_id,
      personal_information: {
        name: formData.personal_information.name,
        birthday: formData.personal_information.birthday,
        account: formData.personal_information.account,
      },
      role: formData.role,
      rules: {
        time_active: formData.rules.time_active,
        time_limit: formData.rules.time_limit,
        block_website: formData.rules.block_website,
        black_list_filter: formData.rules.black_list_filter,
      },
      password: formData.password,
      username: formData.username,
    };

    try {
      const response = await axios.put(
        `http://localhost:5000/user/${username}`,
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
          <form onSubmit={handleSubmit} className="settings-table">
            <div className="table-row">
              <label>Name:</label>
              <input
                type="text"
                name="personal_information.name"
                value={formData.personal_information.name}
                onChange={handleChange}
                data-nested="true"
              />
            </div>

            <div className="table-row">
              <label>Account:</label>
              <input
                type="text"
                name="personal_information.account"
                value={formData.personal_information.account}
                className={"no-underline"}
                onChange={handleChange}
                disabled
                data-nested="true"
              />
            </div>

            <div className="table-row">
              <label>Birthday:</label>
              <input
                type="date"
                name="personal_information.birthday"
                value={formData.personal_information.birthday}
                onChange={handleChange}
                data-nested="true"
              />
            </div>

            <div className="buttons">
              <button type="submit" className="save-button">Save</button>
              <button type="button" className="cancel-button" onClick={() => alert("Changes discarded")}>Cancel</button>
            </div>
          </form>
        </div>
      ) : (
        <p>Loading your settings...</p>
      )}
    </div>
  );
};

export default Settings;
