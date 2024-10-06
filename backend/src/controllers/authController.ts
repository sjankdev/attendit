import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';

const registerUser = async (req: Request, res: Response): Promise<void> => {
    const { username, email, password, role = 'participant' } = req.body;

    try {
        const existingUserByEmail = await User.findByEmail(email);
        if (existingUserByEmail) {
            res.status(400).json({ message: 'Email already in use' });
            return; 
        }

        const existingUserByUsername = await User.findByUsername(username);
        if (existingUserByUsername) {
            res.status(400).json({ message: 'Username already in use' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = await User.create(username, email, hashedPassword, role);

        res.status(201).json({ message: 'User registered successfully', userId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

export { registerUser };
