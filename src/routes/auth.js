import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Login from '../models/Login.js';
dotenv.config();

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Welcome to the API');
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Find user by username
    const login = await Login.findOne({ username });
    if (!login) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, login.password);
    if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // If user is found and password is matched, create a JWT
    const payload = {
        user: {
            _id: login._id
        }
    };

    jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '1h' },
        (err, token) => {
            if (err) throw err;
            res.cookie('token', token, { httpOnly: true });
            res.json({ msg: 'Logged in successfully', _id: login._id });
        }
    );
});

router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Check if user already exists
    let login = await Login
        .findOne({ username })
        .populate({
            path: '_id',
            model: User,
        });

    if (login) {
        return res.status(400).json({ msg: 'User already exists' });
    }


    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    login = new Login({
        username,
        password: hashedPassword
    });
    // Hash password and save user in DB
    await login.save();

    const user = new User({
        _id: login._id,
        username,
    });
    await user.save();

    // Create and return a JWT
    const payload = {
        user: {
            _id: user._id
        }
    };

    jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '1h' },
        (err, token) => {
            if (err) throw err;
            res.cookie('token', token, { httpOnly: true });
            res.json({ msg: 'User registered successfully', _id: user._id });
        }
    );
});

export default router;