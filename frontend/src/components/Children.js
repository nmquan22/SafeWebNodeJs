import React, { useState, useEffect } from "react";
import "../styles/Children.css";
import LoadingSpinner from "../components/LoadingSpinner"; // Import your spinner component
import ErrorPage from "../components/ErrorPage"; // Import your error page component

const Children = () => {
  const [childrenData, setChildrenData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from the API
  useEffect(() => {
    const fetchChildrenData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/children");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setChildrenData(data);
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

  if (error) {
    return <ErrorPage statusCode={parseInt(error)} />;
  }

  return (
    <div className="ChildrenTableContainer">
      <h2>Children Information</h2>
      <table className="ChildrenTable">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          {childrenData.map((child) => (
            <tr key={child._id}>
              <td>{child._id}</td>
              <td>{child.name}</td>
              <td>{child.age}</td>
              <td>{child.grade}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Children;
