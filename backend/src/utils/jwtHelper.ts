import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret';


export const signToken = (payload: object, expiresIn: string | number): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyToken = (token: string): object | string => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error: unknown) { 
        if (error instanceof Error) { 
            throw new Error('Invalid or expired token: ' + error.message);
        }
        throw new Error('Invalid or expired token'); 
    }
};

export const authenticateJWT = (req: any, res: any, next: any) => {
    const token = req.header('Authorization')?.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded; 
        next(); 
    } catch (error: unknown) { 
        if (error instanceof Error) { 
            return res.status(403).json({ message: error.message });
        }
        return res.status(403).json({ message: 'Invalid or expired token' }); 
    }
};
