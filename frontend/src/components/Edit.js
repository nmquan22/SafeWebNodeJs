import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/authContext";
import axios from 'axios';
import "../styles/Settings.css";
import { appRoutes, routes } from "../constants/routes";
import { useNavigate } from "react-router-dom";

const Edit = () => {
  const [userSettings, setUserSettings] = useState(null);
  const [formData, setFormData] = useState({});
  const { isAuthenticated, username, target } = useAuth();  
  const [isPasswordRevealed, setIsPasswordRevealed] = useState(false);
  const Navigate = useNavigate();

  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        let response;
        const response2 = await axios.get(`http://localhost:5000/user/${username}`);
        if (target !== '') {
            response = await axios.get(`http://localhost:5000/user/${target}`);
        }
        else {
            response = await axios.get(`http://localhost:5000/empty-user`);
        }
        setUserSettings(response.data);
        setFormData({
          organ_id: response2.data.organ_id,
          personal_information: {
            name: response.data.personal_information.name,
            birthday: response.data.personal_information.birthday,
            account: response.data.personal_information.account,
          },
          role: "child",
          rules: {
            time_active: response.data.rules.time_active,
            time_limit: response2.data.rules.time_limit,
            block_website: response.data.rules.block_website,
            black_list_filter: response.data.rules.black_list_filter,
          },
          password: response2.data.password,
          username: response.data.username,
        });
        setConfirmPassword(response.data.password);
      } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Failed to load user information.");
      }
    };

    if (username && isAuthenticated) {
      fetchUserSettings();
    }
  }, [target]);

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
  };
  
  const handleSaveClick = async () => {
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
      username: formData.username,
      password: formData.password,
    };

    try {
      if (target !== '') {
        const response = await axios.put(
        `http://localhost:5000/user/${target}`,
        updatedData
      );
        }
        else {
            const response = await axios.post(
                `http://localhost:5000/add-user`,
                updatedData
              );
        }
      alert(response.data.message);
      Navigate("/app/children");
    } catch (error) {
      //console.log(formData);
      //console.error("Error updating user data:", error);
      //alert("There was an error updating your information.");
      Navigate("/app/children");
    }
  };

  const handleCancelClick = () => {
    // Reset form data to its initial state
    setFormData({
      organ_id: userSettings.organ_id,
      personal_information: {
        name: userSettings.personal_information.name,
        birthday: userSettings.personal_information.birthday,
        account: userSettings.personal_information.account,
      },
      role: userSettings.role,
      rules: {
        time_active: userSettings.rules.time_active,
        time_limit: userSettings.rules.time_limit,
        block_website: userSettings.rules.block_website,
        black_list_filter: userSettings.rules.black_list_filter,
      },
      username: userSettings.username,
      password: formData.password,
    });
    setIsPasswordRevealed(false);
    Navigate("/app/children");
  };

  const handlePasswordClick = () => {
    if (!isPasswordRevealed) {
      setIsPasswordRevealed(true);
    }
  };

  const [confirmPassword, setConfirmPassword] = useState(""); 

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "password") {
      setFormData((prev) => ({
        ...prev,
        password: value,
      }));
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
    }
  };

  return (
    <div className="SettingsSection" id="Settings">
      {userSettings ? (
        <div>
          <h1>{target === '' ? "Add Children Profile" : "Edit Children Profile"}</h1>
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
              <label>ID:</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                className={target === '' ? '' : "no-underline"}
                onChange={handleChange}
                disabled={target !== ''}
              />
            </div>

            <div className="table-row">
              <label>Birthday:</label>
              <input
                type="date"
                name="personal_information.birthday"
                value={formData.personal_information.birthday 
                  ? new Date(formData.personal_information.birthday).toISOString().split('T')[0] 
                  : ''}
                onChange={handleChange}
                data-nested="true"
              />
            </div>

            <div className="table-row">
                <label>Time Active:</label>
                <input
                  type="text"
                  name="rules.time_active"
                  value={formData.rules.time_active.join(", ")}
                  onChange={(e) => {
                    const value = e.target.value.split(",").map((v) => parseInt(v.trim(), 10));
                    setFormData((prev) => ({
                      ...prev,
                      rules: { ...prev.rules, time_active: value },
                    }));
                  }}
                />
              </div>

              <div className="table-row">
                <label>Time Limit:</label>
                <input
                  type="number"
                  name="rules.time_limit"
                  value={formData.rules.time_limit}
                  onChange={handleChange}
                  data-nested="true"
                />
              </div>

              <div className="table-row">
                <label>Blocked Websites (comma-separated):</label>
                <input
                  type="text"
                  name="rules.block_website"
                  value={formData.rules.block_website.join(", ")}
                  onChange={(e) => {
                    const value = e.target.value.split(",").map((v) => v.trim());
                    setFormData((prev) => ({
                      ...prev,
                      rules: { ...prev.rules, block_website: value },
                    }));
                  }}
                />
              </div>

              <div className="table-row">
                <label>Black List Filter (comma-separated):</label>
                <input
                  type="text"
                  name="rules.black_list_filter"
                  value={formData.rules.black_list_filter.join(", ")}
                  onChange={(e) => {
                    const value = e.target.value.split(",").map((v) => v.trim());
                    setFormData((prev) => ({
                      ...prev,
                      rules: { ...prev.rules, black_list_filter: value },
                    }));
                  }}
                />
              </div>

            <div className="buttons">
              <button type="submit" className="save-button" onClick={handleSaveClick}>Save</button>
              <button type="button" className="cancel-button" onClick={handleCancelClick}>Cancel</button>
            </div>
          </form>
        </div>
      ) : (
        <p>Loading your settings...</p>
      )}
    </div>
  );
};

export default Edit;
