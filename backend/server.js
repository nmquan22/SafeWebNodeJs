const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB URI for your connection string
const mongoURI = 'mongodb+srv://nghednh:123@cluster0.5b7xo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

// User schema
const userSchema = new mongoose.Schema({
  organ_id: { type: String },
  personal_information: {
    name: { type: String },
    birthday: { type: String },
    account: { type: String },
  },
  role: { type: String },
  rules: {
    time_active: [{ type: Number }],
    time_limit: { type: mongoose.Schema.Types.Decimal128 },
    block_website: { type: [String] },
    black_list_filter: { type: [String] },
  },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },
});

// User model based on the schema
const User = mongoose.model('User', userSchema);

// Endpoint to get password for a specific user
app.get('/password/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (user) {
      res.json({ password: user.password });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/validate-user', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    const user = await User.findOne({ username: username });
    if (user && user.password === password) {
      return res.json({ success: true, message: 'Credentials are valid' });
    } else {
      return res.json({ success: false, message: 'Invalid username or password' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Endpoint to get personal information for a specific user
app.get('/personal-information/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (user) {
      res.json(user.personal_information);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to get rules for a specific user
app.get('/rules/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (user) {
      res.json(user.rules);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to get all information (entire document) for a specific user
app.get('/user/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// **UPDATE PASSWORD**
app.put('/password/:username', async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findOneAndUpdate(
      { username: req.params.username },
      { password: password },
      { new: true }  // Return the updated user document
    );
    if (user) {
      res.json({ message: 'Password updated successfully', user });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// **UPDATE PERSONAL INFORMATION**
app.put('/personal-information/:username', async (req, res) => {
  try {
    const { name, birthday, account } = req.body;
    const user = await User.findOneAndUpdate(
      { username: req.params.username },
      { 
        "personal_information.name": name,
        "personal_information.birthday": birthday,
        "personal_information.account": account
      },
      { new: true }
    );
    if (user) {
      res.json({ message: 'Personal information updated successfully', user });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Endpoint to get block_browsers for a specific user
app.get('/block_website/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (user) {
      res.json(user.rules.block_website); // Return block_browsers array
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


// **UPDATE RULES**
app.put('/rules/:username', async (req, res) => {
  try {
    const { time_active, time_limit, block_browsers, black_list_filter } = req.body;
    const user = await User.findOneAndUpdate(
      { username: req.params.username },
      { 
        "rules.time_active": time_active,
        "rules.time_limit": time_limit,
        "rules.block_browsers": block_browsers,
        "rules.black_list_filter": black_list_filter
      },
      { new: true }
    );
    if (user) {
      res.json({ message: 'Rules updated successfully', user });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// **UPDATE ENTIRE USER DOCUMENT**
app.put('/user/:username', async (req, res) => {
  try {
    const updateData = req.body; // Update the entire user document
    const user = await User.findOneAndUpdate(
      { username: req.params.username },
      updateData,
      { new: true }
    );
    if (user) {
      res.json({ message: 'User data updated successfully', user });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Endpoint to get time_active for a specific user
app.get('/time_active/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (user) {
      res.json(user.rules.time_active); // Return time_active array
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to get website_time_limit for a specific user
app.get('/website_time_limit/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (user) {
      res.json(user.rules.time_limit); // Return website_time_limit (time_limit field)
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Function to get usernames with the same organ_id
app.get('/childrenlist/:username', async (req, res) => {
  try {
    // Fetch the document for the input username
    const inputUser = await User.findOne({ username: req.params.username });

    if (!inputUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Use the organ_id of the input user's document to find related users with role "child"
    const relatedChildren = await User.find({
      organ_id: inputUser.organ_id,
      role: "child"
    }).select('username -_id');

    // Extract usernames
    const usernames = relatedChildren.map(user => user.username);

    return res.json(usernames); // Return list of usernames
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
