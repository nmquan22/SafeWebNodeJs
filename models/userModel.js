// Simulated data from the database
const getUserData = () => {
    return {
        totalUsers: 40689,
        features: [
            { title: "Add Children Profile", icon: "👤" },
            { title: "Set Block Browser", icon: "📦" },
            { title: "Set Time Limit Browser", icon: "⏲️" },
            { title: "Set Filter", icon: "👥" },
            { title: "View Children Profile", icon: "📦" },
            { title: "View Block Browser", icon: "📊" },
        ],
    };
};

module.exports = { getUserData };
