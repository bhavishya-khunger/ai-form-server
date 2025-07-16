import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { configDotenv } from 'dotenv';
configDotenv();

const JWT_SECRET = process.env.JWT_SECRET;
// Create a user
export const signUp = async (req, res) => {
    const { username, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashed });

    try {
        await user.save();
        res.status(200).json({ message: 'User registered' });
    } catch (err) {
        res.status(400).json({ error: 'Something went wrong. Try changing the Email ID.' });
    }
}
// Get user
export const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    res.json({ token, user });
}