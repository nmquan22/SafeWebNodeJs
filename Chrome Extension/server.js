const { GoogleGenerativeAI } = require('@google/generative-ai');
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
// Define the schema and model
const userSchema = new mongoose.Schema({
    personal_information: {
        name: String,
        birthday: Object,
        account: String,
    },
    rules: {
        time_active: [Number],
        time_limit: mongoose.Schema.Types.Decimal128,
        block_website: [String],
        black_list_filter: [String],
        website_time_limit: [
            {
                website: String,
                time_limit: mongoose.Schema.Types.Decimal128,
            },
        ],
    },
    password: String,
    username: String,
    role: String,
    organ_id: String,
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
            res.json(user.rules.time_active);
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
            res.json(user.rules.website_time_limit); // Return website_time_limit (time_limit field)
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

//GOT blocked website
app.get('/blocked_sites/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (user) {
            res.json(user.rules.block_website); 
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});


//GOT black list 
app.get('/black_list/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (user) {
            res.json(user.rules.black_list_filter);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});



//GEMINI SET UP
//import { GoogleGenerativeAI } from "@google/generative-ai"; 
//const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyBgFcu9iOvxmcAn54A_ojotSIJywxwufcY");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
/*
async function violateBlackList(url, black_list) {
    try {
        // Fetch image data from the URL
        const imageResp = await fetch(url);
        if (!imageResp.ok) {
            throw new Error(`Failed to fetch image from URL: ${url}`);
        }

        // Convert the image response to an ArrayBuffer
        const arrayBuffer = await imageResp.arrayBuffer();

        // Convert ArrayBuffer to base64 encoded string
        const base64Image = Buffer.from(arrayBuffer).toString('base64');

        // Convert the blacklist array to a comma-separated string
        const blacklistString = black_list.join(", ");

        // Dynamically build the prompt to check for any blacklist term in the image
        const prompt = `Is this picture contains any of the following features? ${blacklistString}. Return True or False.`;

        // Send the base64 image to the model for analysis
        const result = await model.generateContent([
            {
                inlineData: {
                    data: base64Image,
                    mimeType: "image/jpeg",
                },
            },
            prompt,  // Include the dynamically created prompt with blacklist terms
        ]);

        // Process the result from the model
        const resultText = result.response.text().toLowerCase().trim();

        // Check if the result from model is "true" or "false"
        if (resultText === 'true') {
            return true;  // Image violates the blacklist
        } else if (resultText === 'false') {
            return false;  // Image does not violate the blacklist
        } else {
            throw new Error('Invalid response from model');
        }
    } catch (error) {
        console.error('Error in violateBlackList function:', error);
        return false;  // Return false in case of an error
    }
}*/

// Endpoint to check if an image violates the blacklist
app.post('/check-violation', async (req, res) => {
    const { url, black_list } = req.body;

    if (!url || !black_list || !Array.isArray(black_list)) {
        return res.status(400).send({ error: 'Invalid request payload.' });
    }

    try {
        // Fetch the image from the URL
        const imageResp = await fetch(url);
        if (!imageResp.ok) {
            throw new Error(`Failed to fetch image from URL: ${url}`);
        }

        // Get the image MIME type from the response headers
        const contentType = imageResp.headers.get('Content-Type');
        const mediaType = contentType.split(';')[0];
        const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

        // Check if the image MIME type is supported
        if (!validImageTypes.includes(mediaType)) {
            throw new Error(`Unsupported image format: ${contentType}`);
        }

        // Convert the image to a Base64 string
        const arrayBuffer = await imageResp.arrayBuffer();
        const base64Image = Buffer.from(arrayBuffer).toString('base64');

        // Prepare the blacklist prompt
        const blacklistString = black_list.join(", ");
        const prompt = `Is this related to a thing in ${blacklistString}. Answer only 1 word: 'true' or 'false'`;
        console.log(blacklistString)

        // Call the model to check if the image violates the blacklist
        const result = await model.generateContent([
            {
                inlineData: {
                    data: base64Image,
                    mimeType: contentType, // Dynamically use the image's MIME type
                },
            },
            prompt,
        ]);

        // Extract and process the response text
        const resultText = result.response.text().toLowerCase().trim();
        console.log(resultText + ':' + url)
        // Interpret the result and send the appropriate response
        if (resultText === 'true') {
          
            res.send({ violates: true });
        } else if (resultText === 'false') {
            res.send({ violates: false });
        } else {
            throw new Error('Invalid response from model.');
        }

    } catch (error) {
        console.error('Error in /check-violation endpoint:', error + url);
        res.status(500).send({ error: 'Internal Server Error' });
    }

});


// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});