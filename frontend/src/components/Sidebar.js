import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { appRoutes, routes } from "../constants/routes";
import "../styles/Sidebar.css";

const Sidebar = ({ activeSection }) => {
    const navigate = useNavigate();

    const menuItems = [
        { route: appRoutes.DASHBOARD, label: "Dashboard" },
        { route: appRoutes.CHILDREN, label: "Children" },

    ];

    const settingItems = [
        { route: appRoutes.DASHBOARD, label: "Dashboard" },
        { route: appRoutes.SIGNOUT, label: "Log out" },

    ];

    const handleNavigateToParent = () => {
        const pathSections = location.pathname.split("/").filter(Boolean); // Split and remove empty strings
        if (pathSections.length > 1) {
          // Remove the last section of the path to get the parent route
          const parentPath = `/${pathSections.slice(0, -1).join("/")}`;
          navigate(parentPath);
        } else {
          console.warn("No parent route to navigate to.");
        }
      };

    const handleItemClick = (route) => {

        console.log(location)
        //handleNavigateToParent()
        navigate(route);
    };

    return (
        <div className = "container"r>
            <div className="headerContainer">
                <h1>
                    SafeChild
                </h1>
            </div>
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
            <div className="footerContainer">
                <ul>
                    {settingItems.map((item) => (
                        <li
                            key={item.route}
                            className={activeSection === item.route ? "active" : ""}
                            onClick={() => handleItemClick(item.route)}>
                            {item.label}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
        
    );
};

export default Sidebar;
