const userModel = require('../models/userModel');

const getDashboard = (req, res) => {
    const data = userModel.getUserData();
    res.render('dashboard', { layout: 'layout', data });
}
module.exports = { getDashboard };
