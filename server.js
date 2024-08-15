require('dotenv').config();
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

app.use(cors());
app.use(express.json());

const users = []; // In-memory user storage (replace with a database in production)

// Route to get all users (for testing purposes)
app.get('/users', (req, res) => {
    res.json(users);
});

// Signup route
app.post('/signup', async (req, res) => {
    try {
        const hashpass = await bcrypt.hash(req.body.password, 10);
        const user = { name: req.body.name, password: hashpass, email: req.body.email };
        users.push(user);
        res.status(201).send('User created');
        console.log('User created');
    } catch {
        res.status(500).send('Error creating user');
    }
});

// Login route
app.post('/login', async (req, res) => {
    // Find user by name
    const user = users.find(user => user.name === req.body.name);
    if (user == null) {
        return res.status(400).json({ message: 'Cannot find user' }); // User not found
    }

    try {
        // Compare provided password with stored hashed password
        if (await bcrypt.compare(req.body.password, user.password)) {
            // Password is correct, generate a JWT
            const accessToken = jwt.sign({ name: user.name }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
            res.json({ accessToken: accessToken });
            console.log('Login successful');
        } else {
            // Password is incorrect
            res.status(403).json({ message: 'Not allowed' });
        }
    } catch {
        res.status(500).json({ message: 'Error during authentication' });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
