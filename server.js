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
            gow1:{
                'name': 'God of War',
                'description': 'God of War is an action-adventure game developed by Santa Monica Studio and published by Sony Computer Entertainment. It is the first game in the God of War series and was released in 2005.',
                'system_requirements': {
                    'Processor': 'Intel Pentium 4 2.4 GHz',
                    'Memory': '1 GB',
                    'Graphics': 'NVIDIA GeForce 6600',
                    'OS': 'Windows XP/Vista/7/8/10'
                }
            },
            gow2:{
                'name': 'God of War II',
                'description': 'God of War II is an action-adventure game developed by Santa Monica Studio and published by Sony Computer Entertainment. It is the second game in the God of War series and was released in 2007.',
                'system_requirements': {
                    'Processor': 'Intel Core 2 Duo 2.2 GHz',
                    'Memory': '2 GB',
                    'Graphics': 'NVIDIA GeForce 8600 GT',
                    'OS': 'Windows XP/Vista/7/8/10'
                }
            },
            gow3:{
                'name': 'God of War III',
                'description': 'God of War III is an action-adventure game developed by Santa Monica Studio and published by Sony Computer Entertainment. It is the third game in the God of War series and was released in 2010.',
                'system_requirements': {
                    'Processor': 'Intel Core 2 Duo 2.4 GHz',
                    'Memory': '4 GB',
                    'Graphics': 'NVIDIA GeForce GTX 260',
                    'OS': 'Windows XP/Vista/7/8/10'
                }
            },
            gow4:{
                'name': 'God of War ragnarok',
                'description': 'God of War Ragnarok is an upcoming action-adventure game developed by Santa Monica Studio and published by Sony Interactive Entertainment. It is the sequel to the 2018 game God of War.',
                'system_requirements': {
                    'Processor': 'Intel Core i5-2500K',
                    'Memory': '8 GB',
                    'Graphics': 'NVIDIA GeForce GTX 760',
                    'OS': 'Windows 7/8/10'
                }
            },
            bt1:{
                'name': 'Battlefield 1',
                'description': 'Battlefield 1 is a first-person shooter game developed by EA DICE and published by Electronic Arts. It is set during World War I and was released in 2016.',
                'system_requirements': {
                    'Processor': 'Intel Core i5 6600K',
                    'Memory': '8 GB',
                    'Graphics': 'NVIDIA GeForce GTX 660',
                    'OS': 'Windows 7/8/10'
                }
            },
            bt2:{
                'name': 'Battlefield 2',
                'description': 'Battlefield 2 is a first-person shooter game developed by EA DICE and published by Electronic Arts. It is set in the near future and was released in 2005.',
                'system_requirements': {
                    'Processor': 'Intel Pentium 4 1.7 GHz',
                    'Memory': '512 MB',
                    'Graphics': 'NVIDIA GeForce FX 5700',
                    'OS': 'Windows XP/Vista/7/8/10'
                }
            },
            bt5:{
                'name': 'Battlefield 5',
                'description': 'Battlefield 5 is a first-person shooter game developed by EA DICE and published by Electronic Arts. It is set during World War II and was released in 2018.',
                'system_requirements': {
                    'Processor': 'Intel Core i5 6600K',
                    'Memory': '8 GB',
                    'Graphics': 'NVIDIA GeForce GTX 660',
                    'OS': 'Windows 7/8/10'
                }
            },
            bt2042:{
                'name': 'Battlefield 2042',
                'description': 'Battlefield 2042 is an upcoming first-person shooter game developed by EA DICE and published by Electronic Arts. It is set in the near future and is the seventeenth installment in the Battlefield series.',
                'system_requirements': {
                    'Processor': 'Intel Core i5 6600K',
                    'Memory': '16 GB',
                    'Graphics': 'NVIDIA GeForce GTX 1060',
                    'OS': 'Windows 10'
                }
            },
            sm1:{
                'name': "Marvel's Spider-Man ",
                'description': " Marvel's Spider-Man is a 2018 action-adventure game developed by Insomniac Games and published by Sony Interactive Entertainment.",  
                'system_requirements': {
                    'Processor': 'Intel Core i5-2500K',
                    'Memory': '8 GB',
                    'Graphics': 'NVIDIA GeForce GTX 660',
                    'OS': 'Windows 7/8/10'
                }
            },
            sm2:{
                'name': "Marvel's Spiderman 2",
                'description': "Marvel's Spider-Man 2 is a 2023 action-adventure game developed by Insomniac Games and published by Sony Interactive Entertainment.",
                'system_requirements': {
                    'Processor': 'Intel Core i5-2500K',
                    'Memory': '8 GB',
                    'Graphics': 'NVIDIA GeForce GTX 660',
                    'OS': 'Windows 7/8/10'
                }
            },
            sm3:{
                'name': "Marvel's Spiderman 3",
                'description': "Marvel Spider-Man 3 is a 2007 action-adventure game based on the 2007 film of the same name. The game is the sequel to 2004's Spider-Man 2, itself based on the 2004 film of the same name.",
                'system_requirements': {
                    'Processor': 'Intel Core i5-2500K',
                    'Memory': '8 GB',
                    'Graphics': 'NVIDIA GeForce GTX 660',
                    'OS': 'Windows 7/8/10'
                }
            },
            som:{
                'name': 'Shadow of Mordor',
                'description': 'Middle-earth: Shadow of Mordor is an open-world action-adventure game developed by Monolith Productions and published by Warner Bros. Interactive Entertainment. It is set in J.R.R. Tolkien\'s Middle-earth and was released in 2014.',
                'system_requirements': {
                    'Processor': 'Intel Core i5-750',
                    'Memory': '4 GB',
                    'Graphics': 'NVIDIA GeForce GTX 460',
                    'OS': 'Windows 7/8/10'
                }
            },
            sow:{
                'name': 'Shadow of War',
                'description': 'Middle-earth: Shadow of War is an open-world action-adventure game developed by Monolith Productions and published by Warner Bros. Interactive Entertainment. It is the sequel to Middle-earth: Shadow of Mordor and was released in 2017.',
                'system_requirements': {
                    'Processor': 'Intel Core i5-2550K',
                    'Memory': '8 GB',
                    'Graphics': 'NVIDIA GeForce GTX 670',
                    'OS': 'Windows 7/8/10'
                }
            },
            ac1:{
                'name': 'Assassin\'s Creed',
                'description': 'Assassin\'s Creed is an action-adventure game developed by Ubisoft Montreal and published by Ubisoft. It is the first game in the Assassin\'s Creed series and was released in 2007.',
                'system_requirements': {
                    'Processor': 'Intel Core 2 Duo 2.6 GHz',
                    'Memory': '2 GB',
                    'Graphics': 'NVIDIA GeForce 8800 GT',
                    'OS': 'Windows XP/Vista/7/8/10'
                }
            },
            ac2:{
                'name': "Assassin's Creed II",
                'description': "Assassin's Creed II is an action-adventure game developed by Ubisoft Montreal and published by Ubisoft. It is the second game in the Assassin's Creed series and was released in 2009.",
                'system_requirements': {
                    'Processor': 'Intel Core 2 Duo E6700 2.6 GHz',
                    'Memory': '2 GB',
                    'Graphics': 'NVIDIA GeForce 8800 GT',
                    'OS': 'Windows XP/Vista/7/8/10'
                }
            },
            ac3:{
                'name': "Assassin's Creed III",
                'description': "Assassin's Creed III is an action-adventure game developed by Ubisoft Montreal and published by Ubisoft. It is the third game in the Assassin's Creed series and was released in 2012.",
                'system_requirements': {
                    'Processor': 'Intel Core 2 Duo E6700 2.6 GHz',
                    'Memory': '4 GB',
                    'Graphics': 'NVIDIA GeForce GTX 260',
                    'OS': 'Windows Vista/7/8/10'
                }
            },
            acv:{
                'name': "Assassin's Creed Valhalla",
                'description': "Assassin's Creed Valhalla is an action role-playing game developed by Ubisoft Montreal and published by Ubisoft. It is the twelfth major installment in the Assassin's Creed series and was released in 2020.",
                'system_requirements': {
                    'Processor': 'Intel Core i5-4460',
                    'Memory': '8 GB',
                    'Graphics': 'NVIDIA GeForce GTX 960',
                    'OS': 'Windows 10 (64-bit)'
                }
            },
            ds:{
                'name': 'Dark Souls',
                'description': 'Dark Souls is an action role-playing game developed by FromSoftware and published by Bandai Namco Entertainment. It is the first game in the Dark Souls series and was released in 2011.',
                'system_requirements': {
                    'Processor': 'Intel Core 2 Duo E6850',
                    'Memory': '2 GB',
                    'Graphics': 'NVIDIA GeForce 9600 GT',
                    'OS': 'Windows XP/Vista/7/8/10'
                }
            },
            bb:{
                'name': 'Bloodborne',
                'description': 'Bloodborne is an action role-playing game developed by FromSoftware and published by Sony Computer Entertainment. It is the first game in the Bloodborne series and was released in 2015.',
                'system_requirements': {
                    'Processor': 'Intel Core i3-2100',
                    'Memory': '4 GB',
                    'Graphics': 'NVIDIA GeForce GTX 750 Ti',
                    'OS': 'Windows 7/8/10'
                }
            },
            sekiro:{
                'name': 'Sekiro: Shadows Die Twice',
                'description': 'Sekiro: Shadows Die Twice is an action-adventure game developed by FromSoftware and published by Activision. It was released in 2019 and is set in a fictionalized late 1500s Sengoku period Japan.',
                'system_requirements': {
                    'Processor': 'Intel Core i3-2100',
                    'Memory': '4 GB',
                    'Graphics': 'NVIDIA GeForce GTX 760',
                    'OS': 'Windows 7/8/10'
                }
            },
            er:{
                'name': 'Elden Ring',
                'description': 'Elden Ring is an upcoming action role-playing game developed by FromSoftware and published by Bandai Namco Entertainment. It is a collaboration between game director Hidetaka Miyazaki and fantasy novelist George R. R. Martin.',
                'system_requirements': {
                    'Processor': 'Intel Core i5-2500K',
                    'Memory': '8 GB',
                    'Graphics': 'NVIDIA GeForce GTX 960',
                    'OS': 'Windows 7/8/10'
                }
            },
            re1:{
                'name': 'Resident Evil',
                'description': 'Resident Evil is a survival horror game developed by Capcom. It is the first game in the Resident Evil series and was released in 1996.',
                'system_requirements': {
                    'Processor': 'Intel Core i5-4460',
                    'Memory': '8 GB',
                    'Graphics': 'NVIDIA GeForce GTX 960',
                    'OS': 'Windows 10 (64-bit)'
                }
            },
            re2:{
                'name': 'Resident Evil 2',
                'description': 'Resident Evil 2 is a survival horror game developed by Capcom. It is a remake of the 1998 game Resident Evil 2 and was released in 2019.',
                'system_requirements': {
                    'Processor': 'Intel Core i5-4460',
                    'Memory': '8 GB',
                    'Graphics': 'NVIDIA GeForce GTX 960',
                    'OS': 'Windows 10 (64-bit)'
                }
            },
            re3:{
                'name': 'Resident Evil 3',
                'description': 'Resident Evil 3 is a survival horror game developed by Capcom. It is a remake of the 1999 game Resident Evil 3: Nemesis and was released in 2020.',
                'system_requirements': {
                    'Processor': 'Intel Core i5-4460',
                    'Memory': '8 GB',
                    'Graphics': 'NVIDIA GeForce GTX 960',
                    'OS': 'Windows 10 (64-bit)'
                }
            },
            re4:{
                'name': 'Resident Evil 4',
                'description': 'Resident Evil 4 is a survival horror game developed by Capcom. It is the fourth main installment in the Resident Evil series and was released in 2005.',
                'system_requirements': {
                    'Processor': 'Intel Core i5-4460',
                    'Memory': '8 GB',
                    'Graphics': 'NVIDIA GeForce GTX 960',
                    'OS': 'Windows 10 (64-bit)'
                }
            },
            cod1:{
                'name': 'Call of Duty',
                'description': 'Call of Duty is a first-person shooter game developed by Infinity Ward and published by Activision. It is the first game in the Call of Duty series and was released in 2003.',
                'system_requirements': {
                    'Processor': 'Intel Pentium III 600 MHz',
                    'Memory': '128 MB',
                    'Graphics': 'NVIDIA GeForce 256',
                    'OS': 'Windows 98/2000/ME/XP'
                }
            },
            cod2:{
                'name': 'Call of Duty 2',
                'description': 'Call of Duty 2 is a first-person shooter game developed by Infinity Ward and published by Activision. It is the second game in the Call of Duty series and was released in 2005.',
                'system_requirements': {
                    'Processor': 'Intel Pentium 4 1.4 GHz',
                    'Memory': '256 MB',
                    'Graphics': 'NVIDIA GeForce 6600',
                    'OS': 'Windows 2000/XP'
                }
            },
            cod3:{
                'name': 'Call of Duty 3',
                'description': 'Call of Duty 3 is a first-person shooter game developed by Treyarch and published by Activision. It is the third game in the Call of Duty series and was released in 2006.',
                'system_requirements': {
                    'Processor': 'Intel Pentium 4 2.0 GHz',
                    'Memory': '512 MB',
                    'Graphics': 'NVIDIA GeForce 6600',
                    'OS': 'Windows XP/Vista'
                }
            },
            cod4:{
                'name': 'Call of Duty 4: Modern Warfare',
                'description': 'Call of Duty 4: Modern Warfare is a first-person shooter game developed by Infinity Ward and published by Activision. It is the fourth game in the Call of Duty series and was released in 2007.',
                'system_requirements': {
                    'Processor': 'Intel Pentium 4 2.4 GHz',
                    'Memory': '512 MB',
                    'Graphics': 'NVIDIA GeForce 6600',
                    'OS': 'Windows XP/Vista'
                }
            },
            fo:{
                'name': 'Fallout',
                'description': 'Fallout is a post-apocalyptic role-playing game developed by Interplay Entertainment. It is the first game in the Fallout series and was released in 1997.',
                'system_requirements': {
                    'Processor': 'Intel Pentium 90 MHz',
                    'Memory': '16 MB',
                    'Graphics': 'SVGA',
                    'OS': 'DOS/Windows'
                }
            },
            fo3:{
                'name': 'Fallout 3',
                'description': 'Fallout 3 is a post-apocalyptic role-playing game developed by Bethesda Game Studios and published by Bethesda Softworks. It is the third game in the Fallout series and was released in 2008.',
                'system_requirements': {
                    'Processor': 'Intel Core 2 Duo 2.4 GHz',
                    'Memory': '2 GB',
                    'Graphics': 'NVIDIA GeForce 6800',
                    'OS': 'Windows XP/Vista'
                }
            },
            fo4:{
                'name': 'Fallout 4',
                'description': 'Fallout 4 is a post-apocalyptic role-playing game developed by Bethesda Game Studios and published by Bethesda Softworks. It is the fourth game in the Fallout series and was released in 2015.',
                'system_requirements': {
                    'Processor': 'Intel Core i5-2300',
                    'Memory': '8 GB',
                    'Graphics': 'NVIDIA GeForce GTX 550 Ti',
                    'OS': 'Windows 7/8/10'
                }
            },
            fo76:{
                'name': 'Fallout 76',
                'description': 'Fallout 76 is an online action role-playing game developed by Bethesda Game Studios and published by Bethesda Softworks. It is the ninth game in the Fallout series and was released in 2018.',
                'system_requirements': {
                    'Processor': 'Intel Core i7-4790',
                    'Memory': '8 GB',
                    'Graphics': 'NVIDIA GTX 970',
                    'OS': 'Windows 7/8/10'
                }
            }
    
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
