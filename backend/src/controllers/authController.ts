import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import UserModel from '../models/UserModel'; 

const registerUser = async (req: Request, res: Response): Promise<void> => {
    const { firstName, lastName, email, password, role = 'participant' } = req.body;

    try {
        const existingUserByEmail = await UserModel.findByEmail(email); 
        if (existingUserByEmail) {
            res.status(400).json({ message: 'Email already in use' });
            return; 
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = await UserModel.create(firstName, lastName, email, hashedPassword, role); 

        res.status(201).json({ message: 'User registered successfully', userId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

export { registerUser };
