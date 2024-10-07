
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import UserModel from '../models/UserModel'; 
import { signToken, signRefreshToken, verifyRefreshToken } from '../utils/jwtHelper';

const registerUser = async (req: Request, res: Response): Promise<Response> => {
    const { firstName, lastName, email, password, role = 'participant' } = req.body;

    try {
        const existingUserByEmail = await UserModel.findByEmail(email); 
        if (existingUserByEmail) {
            return res.status(400).json({ success: false, message: 'Email already in use' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await UserModel.create(firstName, lastName, email, hashedPassword, role); 
        
        const { password: _, ...userWithoutPassword } = user;
        
        const payload = { id: user.id, email: user.email, role: user.role };
        const token = signToken(payload, '1h');
        const refreshToken = signRefreshToken(payload, '7d'); 

        await UserModel.updateRefreshToken(user.id, refreshToken); 

        return res.status(201).json({ success: true, message: 'User registered successfully', user: userWithoutPassword, token, refreshToken });
    } catch (error) { 
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server error', error: (error as Error).message });
    }
};

const loginUser = async (req: Request, res: Response): Promise<Response> => {
    const { email, password } = req.body;
    const user = await UserModel.findByEmail(email);
    
    if (user && (await bcrypt.compare(password, user.password))) { 
        const payload = { id: user.id, email: user.email, role: user.role };
        const token = signToken(payload, '1h');
        const refreshToken = signRefreshToken(payload, '7d');

        await UserModel.updateRefreshToken(user.id, refreshToken);

        return res.json({ token, refreshToken });
    }

    return res.status(401).json({ message: 'Invalid email or password' });
};

const refreshAccessToken = async (req: Request, res: Response): Promise<Response> => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token is required' });
    }

    try {
        const decoded = verifyRefreshToken(refreshToken);
        const user = await UserModel.findByRefreshToken(refreshToken);

        if (!user) {
            return res.status(403).json({ message: 'User not found' });
        }

        const payload = { id: user.id, email: user.email, role: user.role };
        const newAccessToken = signToken(payload, '1h');

        return res.json({ token: newAccessToken });
    } catch (error) {
        return res.status(403).json({ message: (error as Error).message });
    }
};

export { registerUser, loginUser, refreshAccessToken };
