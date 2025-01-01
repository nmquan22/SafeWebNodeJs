const TitleMap = {
  "/login": "Login",
};

const DynamicTitle = (path) => {
  if (TitleMap[path]) {
    return `${TitleMap[path]} | Safe Web`;
  }

  const parts = path.split("/");
  if (parts.length > 2 && parts[0] === "" && parts[1] === "app") {
    // Check TitleMap for section-specific titles (e.g., /app/comrades)
    const sectionPath = `/${parts[1]}/${parts[2]}`; // Construct section path
    if (TitleMap[sectionPath]) {
      return `${TitleMap[sectionPath]} | Safe Web`;
    } else {
      // Fallback to section name for unmatched section paths
      return `${parts[2]} | Safe Web`;
    }
  }

  return "Safe Web"; // Default title
};

export default DynamicTitle;
