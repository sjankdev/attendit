import db from '../config/db';
import { ResultSetHeader } from 'mysql2';

class EmailVerificationModel {
    static async create(userId: number, verificationToken: string, expiresAt: Date): Promise<void> {
        await db.execute<ResultSetHeader>(
            'INSERT INTO email_verifications (userId, verificationToken, verificationTokenExpiresAt) VALUES (?, ?, ?)',
            [userId, verificationToken, expiresAt]
        );
    }

    static async updateToken(userId: number, verificationToken: string): Promise<void> {
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
        await db.execute<ResultSetHeader>(
            'UPDATE email_verifications SET verificationToken = ?, verificationTokenExpiresAt = ? WHERE userId = ?',
            [verificationToken, expiresAt, userId]
        );
    }

    static async verifyUser(id: number): Promise<void> {
        await db.execute<ResultSetHeader>(
            'UPDATE users SET isVerified = TRUE WHERE id = ?',
            [id]
        );
    }
}

export default EmailVerificationModel;
