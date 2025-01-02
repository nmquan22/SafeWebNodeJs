import React, { useState, useEffect } from "react";
import axios from "axios";
import '../styles/Addchildren.css';

const Addchildren = ({ currentUsername }) => {
  const [formData, setFormData] = useState({
    username: "",  // The username of the user whose organ_id you want to update
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [newOrganId, setNewOrganId] = useState("");

  useEffect(() => {
    // Fetch the organ_id for the currentUsername
    const fetchOrganId = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/organ_id/${currentUsername}`
        );
        setNewOrganId(response.data.password); // Assuming response contains the 'password' field as organ_id
      } catch (error) {
        setErrorMessage("Error fetching organ ID.");
      }
    };

    fetchOrganId();
  }, [currentUsername]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Step 1: Find the user by the entered username
      const userResponse = await axios.get(
        `http://localhost:5000/user/${formData.username}`
      );

      const user = userResponse.data;

      // Step 2: Check if the user's role is 'children'
      if (user.role !== "children") {
        setErrorMessage("The user is not a 'children' role.");
        setSuccessMessage("");
        return;
      }

      // Step 3: Send the updated organ_id to the backend
      const response = await axios.put(
        `http://localhost:5000/organ_id/${formData.username}`,
        { organ_id: newOrganId }
      );

      if (response.data.message === "Add children updated successfully") {
        setSuccessMessage(response.data.message);
        setErrorMessage("");
        setFormData({ username: "" });
      } else {
        setErrorMessage("Failed to update Organ ID.");
      }
    } catch (error) {
      console.error("Error updating organ ID:", error);
      setErrorMessage(
        error.response?.data?.error || "An error occurred while updating the Organ ID."
      );
    }
  };

  return (
    <div>
      <h1>Add children</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={!newOrganId}>
          Update 
        </button>
      </form>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
    </div>
  );
};

export default Addchildren;
