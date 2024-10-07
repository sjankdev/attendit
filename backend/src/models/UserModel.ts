import db from '../config/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import User from './User';  

class UserModel {
    static async create(firstName: string, lastName: string, email: string, password: string, role: string): Promise<User> {
        const [result] = await db.execute<ResultSetHeader>(
            'INSERT INTO users (firstName, lastName, email, password, role) VALUES (?, ?, ?, ?, ?)',
            [firstName, lastName, email, password, role]
        );

        const insertId = result.insertId as number; 
        
        return {
            id: insertId,
            firstName,
            lastName,
            email,
            password, 
            role,
            revoked: false
        } as User;
    }

    static async findByEmail(email: string): Promise<User | null> {
        const [rows] = await db.execute<RowDataPacket[]>('SELECT * FROM users WHERE email = ?', [email]);
        const user = rows[0] as User; 
        return user || null; 
    }

    static async findById(id: number): Promise<User | null> {
        const [rows] = await db.execute<RowDataPacket[]>('SELECT * FROM users WHERE id = ?', [id]);
        const user = rows[0] as User;
        return user || null;
    }

    static async updateRefreshToken(id: number, refreshToken: string | null): Promise<void> {
        await db.execute<ResultSetHeader>(
            'UPDATE users SET refreshToken = ? WHERE id = ?',
            [refreshToken, id]
        );
    }

    static async revokeRefreshToken(id: number): Promise<void> {
        await db.execute<ResultSetHeader>(
            'UPDATE users SET revoked = TRUE WHERE id = ?',
            [id]
        );
    }

    static async findByRefreshToken(refreshToken: string): Promise<User | null> {
        const [rows] = await db.execute<RowDataPacket[]>('SELECT * FROM users WHERE refreshToken = ?', [refreshToken]);
        const user = rows[0] as User; 
        return user || null; 
    }
}

export default UserModel;
