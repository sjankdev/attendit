import db from '../config/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { JwtToken } from './JwtToken';

class JwtTokenModel {

    static async create(userId: number, token: string, refreshToken: string): Promise<JwtToken> {
        const [result] = await db.execute<ResultSetHeader>(
            'INSERT INTO jwt_tokens (userId, token, refreshToken) VALUES (?, ?, ?) ' +
            'ON DUPLICATE KEY UPDATE token = VALUES(token), refreshToken = VALUES(refreshToken)',
            [userId, token, refreshToken]
        );

        const insertId = result.insertId;

        if (insertId === 0) {
            const existingToken = await this.findByUserId(userId);
            if (existingToken) {
                return existingToken;
            }
        }

        return {
            id: insertId || 0,
            userId,
            token,
            refreshToken,
        } as JwtToken;
    }

    static async findByUserId(userId: number): Promise<JwtToken | null> {
        const [rows] = await db.execute<RowDataPacket[]>(
            'SELECT * FROM jwt_tokens WHERE userId = ?',
            [userId]
        );

        if (rows.length === 0) return null;

        return {
            id: rows[0].id,
            userId: rows[0].userId,
            token: rows[0].token,
            refreshToken: rows[0].refreshToken,
        } as JwtToken;
    }

    static async update(userId: number, token: string | null, refreshToken: string | null): Promise<void> {
        await db.execute<ResultSetHeader>(
            'UPDATE jwt_tokens SET token = ?, refreshToken = ? WHERE userId = ?',
            [token, refreshToken, userId]
        );
    }

    static async findByRefreshToken(refreshToken: string): Promise<JwtToken | null> {
        const [rows] = await db.execute<RowDataPacket[]>(
            'SELECT * FROM jwt_tokens WHERE refreshToken = ?',
            [refreshToken]
        );

        if (rows.length === 0) return null;

        return {
            id: rows[0].id,
            userId: rows[0].userId,
            token: rows[0].token,
            refreshToken: rows[0].refreshToken,
        } as JwtToken;
    }

    static async updateRefreshToken(userId: number, token: string | null, refreshToken: string | null): Promise<void> {
        await db.execute<ResultSetHeader>(
            'INSERT INTO jwt_tokens (userId, token, refreshToken) VALUES (?, ?, ?) ' +
            'ON DUPLICATE KEY UPDATE token = VALUES(token), refreshToken = VALUES(refreshToken), updatedAt = CURRENT_TIMESTAMP',
            [userId, token, refreshToken]
        );
    }
}

export default JwtTokenModel;
