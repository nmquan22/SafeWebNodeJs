import React from "react";
import { useNavigate } from "react-router-dom";
import { appRoutes, routes } from "../constants/routes";
import "../styles/Sidebar.css";

const Sidebar = ({ activeSection }) => {
    const navigate = useNavigate();

    const menuItems = [
        { route: appRoutes.OVERVIEW, label: "Dashboard" },
        { route: appRoutes.COMRADES, label: "Child list" },

    ];

    const handleItemClick = (route) => {
        // Navigate to the clicked route
        navigate(route);
    };

    return (
        <ul>
            {menuItems.map((item) => (
                <li
                    key={item.route}
                    className={activeSection === item.route ? "active" : ""}
                    onClick={() => handleItemClick(item.route)}>
                    {item.label}
                </li>
            ))}
        </ul>
    );
};

export default Sidebar;
