require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(
    process.env.MONGODB_URI, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
).then(() => console.log('MongoDB connected...'))
  .catch(err => console.error('MongoDB connection error:', err));

// User schema and model
const usersSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
});

const Users = mongoose.model('User', usersSchema);

// Signup route
app.post('/signup', async (req, res) => {
    try {
        const existingUser = await Users.findOne({ name: req.body.name });
        if (existingUser) {
            return res.json({ message: 'User already exists' });
        }
        
        const hashpass = await bcrypt.hash(req.body.password, 10);
        const newUser = new Users({
            name: req.body.name,
            email: req.body.email,
            password: hashpass,
        });
        
        await newUser.save();
        res.json({ message: true });
        console.log('User created');
        
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('Error creating user');
    }
});

// Login route
app.post('/login', async (req, res) => {
    try {
        const user = await Users.findOne({ name: req.body.name });
        if (!user) {
            return res.json({ message: 'No user exists' });
        }

        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
        if (isPasswordValid) {
            const accessToken = jwt.sign({ name: user.name }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
            res.json({ accessToken });
            console.log('Login successful');
        } else {
            res.json({ message: 'Incorrect password' });
        }
    } catch (error) {
        console.error('Error during authentication:', error);
        res.json({ message: 'Error during authentication' });
    }
});

// Test route to get all users (for testing purposes)
app.get('/users', async (req, res) => {
    try {
        const users = await Users.find({});
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Error fetching users');
    }
});

// Start server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
