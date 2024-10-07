import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '01628b90ce3680876d820a4c60e62d8a';

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

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || '11c5dcba7974cbc3932e30818b9f2f3b'; 

export const signRefreshToken = (payload: object, expiresIn: string | number): string => {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn });
};

export const verifyRefreshToken = (token: string): object | string => {
    try {
        return jwt.verify(token, REFRESH_TOKEN_SECRET);
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error('Invalid or expired refresh token: ' + error.message);
        }
        throw new Error('Invalid or expired refresh token');
    }
};