import { useNavigate, useLocation } from 'react-router-dom';

export const handleNavigateToParent = (navigate, location) => {
    const pathSections = location.pathname.split("/").filter(Boolean); // Split and remove empty strings
    if (pathSections.length > 1) {
      // Remove the last section of the path to get the parent route
      const parentPath = `/${pathSections.slice(0, -1).join("/")}`;
      navigate(parentPath);
    } else {
      console.warn("No parent route to navigate to.");
    }
  };