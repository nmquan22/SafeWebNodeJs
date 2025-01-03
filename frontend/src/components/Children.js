import React, { useState, useEffect } from "react";
import "../styles/Children.css";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner"; 
import { useAuth } from "../contexts/authContext";
import { appRoutes, routes } from "../constants/routes";

const Children = () => {
  const [childrenData, setChildrenData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { username, target, setTarget } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChildrenData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/childrenlist/${username}`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const usernames = await response.json();

        const childrenInfo = await Promise.all(
          usernames.map(async (childUsername) => {
            const childResponse = await fetch(`http://localhost:5000/user/${childUsername}`);
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

  const formatDate = (date) => {
    if (!date) return "Unknown";
    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) return "Invalid Date";
    return parsedDate.toLocaleDateString("en-GB");
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="Error">{error}</div>;

  return (
    <div className="ChildrenListContainer">
      <div className="ChildrenButtonList">
        {childrenData.map((child) => (
          <button
            key={child.personal_information.account}
            className="ChildButton"
            onClick={() => {
              setTarget(child.username)
              console.log(location)
              navigate(appRoutes.EDIT)}}
          >
            <div className="ChildInfo">
              <p><strong>Name:</strong> {child.personal_information.name}</p>
              <p><strong>Birthday:</strong> {formatDate(child.personal_information.birthday)}</p>
            </div>
          </button>
        ))}
        <button
          className="AddButton"
          onClick={() => {
            setTarget('')
            console.log(location)
            navigate(appRoutes.EDIT)}}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default Children;
