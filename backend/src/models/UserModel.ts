import db from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { User } from "./User";

class UserModel {
  static async create(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: string
  ): Promise<User> {
    const [result] = await db.execute<ResultSetHeader>(
      "INSERT INTO users (firstName, lastName, email, password, role, isVerified, roleChosen) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [firstName, lastName, email, password, role, false, false]
    );

    const insertId = result.insertId as number;

    return {
      id: insertId,
      firstName,
      lastName,
      email,
      password,
      role,
      isVerified: false,
      roleChosen: false,
    } as User;
  }

  static async setRoleChosen(userId: number): Promise<void> {
    await db.execute<ResultSetHeader>(
      "UPDATE users SET roleChosen = TRUE WHERE id = ?",
      [userId]
    );
  }

  static async findByVerificationToken(token: string): Promise<User | null> {
    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT u.* FROM users u JOIN email_verifications ev ON u.id = ev.userId WHERE ev.verificationToken = ? AND ev.verificationTokenExpiresAt > NOW()",
      [token]
    );
    const user = rows[0] as User;
    return user || null;
  }

  static async updateVerificationToken(
    id: number,
    verificationToken: string
  ): Promise<void> {
    const verificationTokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await db.execute<ResultSetHeader>(
      "UPDATE users SET verificationToken = ?, verificationTokenExpiresAt = ? WHERE id = ?",
      [verificationToken, verificationTokenExpiresAt, id]
    );
  }

  static async verifyUser(id: number): Promise<void> {
    await db.execute<ResultSetHeader>(
      "UPDATE users SET isVerified = TRUE WHERE id = ?",
      [id]
    );
  }

  static async setVerified(id: number): Promise<void> {
    await db.execute<ResultSetHeader>(
      "UPDATE users SET isVerified = TRUE WHERE id = ?",
      [id]
    );
  }

  static async findByEmail(email: string): Promise<User | null> {
    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    const user = rows[0] as User;
    return user || null;
  }

  static async findById(id: number): Promise<User | null> {
    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );
    const user = rows[0] as User;
    return user || null;
  }

  static async findByRefreshToken(refreshToken: string): Promise<User | null> {
    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT * FROM users WHERE refreshToken = ?",
      [refreshToken]
    );
    const user = rows[0] as User;
    return user || null;
  }

  static async updateRole(userId: number, role: string) {
    try {
      const [result] = await db.execute<ResultSetHeader>(
        "UPDATE users SET role = ? WHERE id = ?",
        [role, userId]
      );

      console.log("Update result:", result);

      if (result.affectedRows === 0) {
        console.warn(`No rows updated for userId ${userId}`);
      }
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  }
  static async userExists(userId: number): Promise<boolean> {
    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT COUNT(*) as count FROM users WHERE id = ?",
      [userId]
    );
    return rows[0].count > 0;
  }
}

export default UserModel;
