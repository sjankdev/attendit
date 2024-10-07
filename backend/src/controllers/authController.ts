import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import UserModel from '../models/UserModel'; 

const registerUser = async (req: Request, res: Response): Promise<void> => {
    const { firstName, lastName, email, password, role = 'participant' } = req.body;

    try {
        const existingUserByEmail = await UserModel.findByEmail(email); 
        if (existingUserByEmail) {
            res.status(400).json({ success: false, message: 'Email already in use' });
            return; 
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await UserModel.create(firstName, lastName, email, hashedPassword, role); 
        
        const { password: _, ...userWithoutPassword } = user;

        res.status(201).json({ success: true, message: 'User registered successfully', user: userWithoutPassword });
    } catch (error: unknown) { 
        if (error instanceof Error) { 
            console.error(error);
            res.status(500).json({ success: false, message: 'Server error', error: error.message });
        } else {
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }
};

export { registerUser };
