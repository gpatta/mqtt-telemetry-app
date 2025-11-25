import dotenv from 'dotenv';
import User from '../model/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config(); // Load environment variables

// Generate JWT
const generateToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Register user
export const registerUser = async (req, res) => {
    const { name, username, password } = req.body;

    try {
        // Check if user exists
        let user = await User.findOne({ username });
        if (user) {
        return res.status(400).json({ msg: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        user = new User({ name, username, password: hashedPassword });
        await user.save();

        // Generate token and send response
        const token = generateToken(user);
        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
  
// Login user
export const loginUser = async (req, res) => {
    const { username, password } = req.body;

    console.log('Login request: ', req.body);

    const email = username;

    try {
        console.log('Searching user: ', email);
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User ', username, ' not found');
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        console.log('User found: ', user);

        // TODO: implement bcrypt password hash
        // const isMatch = await bcrypt.compare(password, user.password);
        // if (!isMatch) {
        //     console.log('Invalid password');
        //     return res.status(400).json({ msg: 'Invalid credentials' });
        // }

        if (password !== user.password) {
            console.log('Invalid password');
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        console.log('User authenticated successfully');

        const token = generateToken(user);
        res.json({ 
            'data': {
                'user': {
                    'username': user.username,
                }
            },
            token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get profile
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
