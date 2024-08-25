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
// User schema and model
const usersSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    purchasedGames: [String], // Array of purchased game names
});
const Users = mongoose.model('User', usersSchema);
const description= {
            gtavi:{
                'name': 'Grand Theft Auto VI',
                'description': 'Grand Theft Auto VI is an upcoming open-world action-adventure game developed by Rockstar Games. It is the sixth main installment in the Grand Theft Auto series.',
                'system_requirements': {
                    'Processor': 'AMD Ryzen 5 3600',
                    'Memory': '8 GB',
                    'Graphics': 'NVIDIA GeForce RTX 3070 or AMD Radeon RX 6800 XT',
                    'OS': 'Windows Vista/7/8/10 (64-bit)',
                   
                   
                }
            },
            gtav:{
                'name': 'Grand Theft Auto V',
                'description': "Grand Theft Auto V is a 2013 action-adventure game developed by Rockstar North and published by Rockstar Games. It is the seventh main entry in the Grand Theft Auto series, following 2008's Grand Theft Auto IV, and the fifteenth instalment overall. Set within the fictional state of San Andreas, based on Southern California, the single-player story follows three protagonists—retired bank robber Michael De Santa (Ned Luke), street gangster Franklin Clinton (Shawn Fonteno), and drug dealer and gunrunner Trevor Philips (Steven Ogg), and their attempts to commit heists while under pressure from a corrupt government agency and powerful criminals. Players freely roam San Andreas's open world countryside and fictional city of Los Santos, based on Los Angeles.The game world is navigated on foot and by vehicle, from either a third-person or first-person perspective. Players control the protagonists throughout single-player and switch among them, both during and outside missions. The story is centred on the heist sequences, and many missions involve shooting and driving gameplay. A 'wanted' system governs the aggression of law enforcement response to players who commit crimes. In Grand Theft Auto Online, the game's online multiplayer mode, up to 30 players engage in a variety of different cooperative and competitive game modes.",
                'system_requirements': {
                    'Processor': 'Pentium 4 3.0 GHz',
                    'Memory': '512 MB',
                    'Graphics': 'DirectX 9.0c or ATI Radeon X1600 or GeForce 6600 GT',
                    'OS': 'Windows Vista/7/8/10 (64-bit)',
                },
            },
            gtaiv:{
                'name': 'Grand Theft Auto IV',
                'description': 'Grand Theft Auto IV is an open-world action-adventure game developed by Rockstar North and published by Rockstar Games. It is the fourth main installment in the Grand Theft Auto series.',
                'system_requirements': {
                    'Processor': 'Intel Core 2 Duo E6600 2.4GHz',
                    'Memory': '1 GB',
                    'Graphics': 'NVIDIA GeForce 7800 GT or ATI X1600 XT',
                    'OS': 'Windows XP (SP3) / Vista (SP1)/ 7/ 8/ 10'
                }
            },
            rdr:{
                'name': 'Red Dead Redemption',
                'description': 'Red Dead Redemption is an open-world western action-adventure game developed by Rockstar Games. It is set in the late 1800s and follows the story of John Marston, a member of the Van der Linde gang, and his experiences in the American Old West.',
                'system_requirements': {
                    'Processor': 'Intel Pentium 4 3.0 GHz',
                    'Memory': '2 GB',
                    'Graphics': 'NVIDIA GeForce 6600/ATI Radeon X1600',
                    'OS': 'Windows XP/Vista/7/8/10'
                }
            },
            rdr2:{
                'name': 'Red Dead Redemption 2',
                'description': 'Red Dead Redemption 2 is an open-world western action-adventure game developed by Rockstar Games. It is the sequel to Red Dead Redemption and the latest installment in the Red Dead series.',
                'system_requirements': {
                    'Processor': 'Intel Core i5-2400',
                    'Memory': '8 GB',
                    'Graphics': 'NVIDIA GeForce GTX 660 or AMD Radeon HD 7870',
                    'OS': 'Windows 7/8/10'
                }
            },
            maxpayne:{
                'name': 'Max Payne',
                'description': 'Max Payne is an action-adventure game developed by Rockstar North and published by Rockstar Games. It is the first game in the Max Payne series and was released in 2012.',
                'system_requirements': {
                    'Processor': 'Intel Pentium 4 3.0 GHz',
                    'Memory': '512 MB',
                    'Graphics': 'DirectX 9',
                    'OS': 'Windows XP/Vista/7/8/10'
                }
            },
};


// Schema definition
const descSchema = new mongoose.Schema({
    // Allow dynamic keys with mixed types
    // The key will be the game name, and the value will be an object with the game's details
    detail: {
        type: Map,
        of: {
            name: String,
            description: String,
            system_requirements: {
                Processor: String,
                Memory: String,
                Graphics: String,
                OS: String
            }
        }
    }
});

const Desc = mongoose.model('Desc', descSchema);

// Object.values(description).forEach(async (desc) => {
//     const key = Object.keys(description).find(k => description[k] === desc);
    
//     const newDesc = new Desc({
//         detail: {
//             [key]: desc
//         }
//     });

//     // Save each new description to the database
//     await newDesc.save();
// });

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
            res.json({ accessToken,name:req.body.name });
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
app.get('/games/:game', async (req, res) => {
    const game = req.params.game;
    
    try {
        // Find the game in the database where the key matches the requested game
        const gameDetail = await Desc.findOne({ [`detail.${game}`]: { $exists: true } });

        if (gameDetail) {
            // Return the detail for the specific game
            res.json({ detail: gameDetail.detail.get(game) });
        } else {
            res.status(404).json({ error: 'Game not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
// Buy route
app.post('/buy', async (req, res) => {
    const  game  = req.body.game;
    const name = req.body.name;

    try {
        // Find the user by name
        const user = await Users.findOne({ name: name });

        if (user===null) {
            return res.json({ message: 'User not found' });
        }

        // Check if the game is already in the purchasedGames array
        if (user.purchasedGames.includes(game)) {
            return res.json({ message: 'Game already purchased' });
        }

        // Add the game to the purchasedGames array
        user.purchasedGames.push(game);
        await user.save();

        res.json({ message: 'Game purchased successfully' });
        console.log('Game purchased:', game);
    } catch (error) {
        console.error('Error processing purchase:', error);
        res.json({ message: 'Error processing purchase' });
    }
});
app.post('/cart', async (req, res) => {
    const name = req.body.name;

    try {
        const user = await Users.findOne({ name:name });
        if (user===null) {
            return res.json({ message: 'User not found' });
        }
        res.json({ cart: user.purchasedGames });
    } catch (error) {
        console.error('Error fetching purchased games:', error);
        res.json({message:'Error fetching purchased games'});
    }
});
// Start server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
