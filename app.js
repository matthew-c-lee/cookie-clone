const express = require('express');
const path = require('path');
const session = require('express-session');

const app = express();
const fs = require('fs'); // Require Node's file system module

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'static')));

app.use(session({
    secret: 'your_secret',  // used to sign the session ID cookie
    resave: false,  // forces the session to be saved back to the session store
    saveUninitialized: false,  // forces a session that is "uninitialized" to be saved to the store
    cookie: {
        secure: 'auto',  // marks the cookie to be used with HTTPS only
        httpOnly: true,  // indicates that the cookie is accessible only over the HTTP(S) protocol
        maxAge: null // sets the maximum age in milliseconds, this example is set to never expire
    }
}));

// Define a route to render your EJS page
app.get('/', (req, res) => {
    const filePath = path.join(__dirname, 'static/data/gameData.json');

    // Read the JSON file
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            return res.status(500).send('Error reading the file.');
        }

        try {
            // Parse the JSON data
            const gameData = JSON.parse(data);

            if (!req.session.gameData)
                req.session.gameData = gameData;

            // Render the EJS template with the data
            res.render('home', { gameData: req.session.gameData });
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            return res.status(500).send('Error parsing JSON.');
        }
    });
});

app.post('/update-game-data', (req, res) => {
    // Here you would get updated data from the client-side
    // This could be a new game state, scores, etc.
    const updates = req.body;

    // Now, update the session data with the new details
    // Assuming `updates` is an object with the same structure as your gameData
    if (req.session.gameData) {
        for (let key in updates) {
            if (req.session.gameData.hasOwnProperty(key)) {
                req.session.gameData[key] = updates[key];
            }
        }
    } else {
        // Handle case where gameData doesn't exist in the session
        req.session.gameData = updates; // Or initialize it as you prefer
    }

    // Send a response back to the client
    res.json({ message: 'Game data updated successfully!' });
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});