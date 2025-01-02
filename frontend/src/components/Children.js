import React, { useState, useEffect } from "react";
import "../styles/Children.css";
import LoadingSpinner from "../components/LoadingSpinner"; 
import { useAuth } from "../contexts/authContext";// Import your spinner component
//import ErrorPage from "../components/ErrorPage"; // Import your error page component

const Children = () => {
  const [childrenData, setChildrenData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { username } = useAuth();
  // Fetch data from the API
  useEffect(() => {
    const fetchChildrenData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/childrenlist/${username}`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const usernames = await response.json();
        // Fetch full info for each username
        const childrenInfo = await Promise.all(
          usernames.map(async (childUsername) => {
            const childResponse = await fetch(`http://localhost:5000/personal-information/${childUsername}`);
            return childResponse.json();
          })
        );
        setChildrenData(childrenInfo);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChildrenData();
  }, []);

  if (loading) {
    return  <LoadingSpinner />;
  }
  const formatDate = (date) => {
    if (!(date instanceof Date) || isNaN(date)) return "Invalid Date";
    return date.toLocaleDateString("en-GB"); // Formats as dd/mm/yyyy
  };
  return (
    <div className="ChildrenTableContainer">
      <h2>Children Information</h2>
      <table className="ChildrenTable">
        <thead>
          <tr>
            <th>account</th>
            <th>Name</th>
            <th>Birthday</th>
          </tr>
        </thead>
        <tbody>
          {childrenData.map((child) => (
            <tr key={child.account}>
              <td>{child.account}</td>
              <td>{child.name}</td>
              <td>{child.birthday}</td>
            </tr>
          ))}
          <button type="addchildren" className="bg-zinc-500">
              Add children
          </button>
        </tbody>
      </table>
    </div>
  );
};

export default Children;
