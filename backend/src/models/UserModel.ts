import db from '../config/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import User from './User';

class UserModel {

    static async create(firstName: string, lastName: string, email: string, password: string, role: string, verificationToken: string): Promise<User> {
        const verificationTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000);

        const [result] = await db.execute<ResultSetHeader>(
            'INSERT INTO users (firstName, lastName, email, password, role, verificationToken, verificationTokenExpiresAt, isVerified) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [firstName, lastName, email, password, role, verificationToken, verificationTokenExpiresAt, false]
        );

        const insertId = result.insertId as number;

        return {
            id: insertId,
            firstName,
            lastName,
            email,
            password,
            role,
            revoked: false,
            verificationToken,
            verificationTokenExpiresAt,
            isVerified: false
        } as User;
    }

    static async findByVerificationToken(token: string): Promise<User | null> {
        const [rows] = await db.execute<RowDataPacket[]>('SELECT * FROM users WHERE verificationToken = ? AND verificationTokenExpiresAt > NOW()', [token]);
        const user = rows[0] as User;
        return user || null;
    }

    static async updateVerificationToken(id: number, verificationToken: string): Promise<void> {
        const verificationTokenExpiresAt = new Date(Date.now() + 60 * 1000);
        await db.execute<ResultSetHeader>(
            'UPDATE users SET verificationToken = ?, verificationTokenExpiresAt = ? WHERE id = ?',
            [verificationToken, verificationTokenExpiresAt, id]
        );
    }

    static async verifyUser(id: number): Promise<void> {
        await db.execute<ResultSetHeader>(
            'UPDATE users SET verificationToken = NULL, isVerified = TRUE WHERE id = ?',
            [id]
        );
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
