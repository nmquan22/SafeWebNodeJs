const TitleMap = {
  "/login": "Đăng nhập",
};

const DynamicTitle = (path) => {
  if (TitleMap[path]) {
    return `${TitleMap[path]} | CBSV5`;
  }

  const parts = path.split("/");
  if (parts.length > 2 && parts[0] === "" && parts[1] === "app") {
    // Check TitleMap for section-specific titles (e.g., /app/comrades)
    const sectionPath = `/${parts[1]}/${parts[2]}`; // Construct section path
    if (TitleMap[sectionPath]) {
      return `${TitleMap[sectionPath]} | CBSV5`;
    } else {
      // Fallback to section name for unmatched section paths
      return `${parts[2]} | CBSV5`;
    }
  }

  return "Safe Web"; // Default title
};

export default DynamicTitle;
