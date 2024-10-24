import db from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { User } from "./User";
import { sendPasswordResetEmail } from "../utils/mailer";
import * as crypto from "crypto";
import bcrypt from "bcrypt";

class UserModel {
  static async create(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    roles: string[],
    dob: Date | null = null
  ): Promise<User> {
    const [result] = await db.execute<ResultSetHeader>(
      "INSERT INTO users (firstName, lastName, email, password, isVerified, roleChosen, dob) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [firstName, lastName, email, password, false, false, dob]
    );

    const insertId = result.insertId as number;
    console.log(`User created with ID: ${insertId}. Roles: ${roles}`);

    for (const role of roles) {
      console.log(`Inserting role: ${role} for user ID: ${insertId}`);
      try {
        const [insertResult] = await db.execute<ResultSetHeader>(
          "INSERT INTO user_roles (user_id, role_id) SELECT ?, id FROM roles WHERE name = ?",
          [insertId, role]
        );
        console.log(`Insert result for role ${role}:`, insertResult);
      } catch (error) {
        console.error(
          `Error inserting role ${role} for user ID ${insertId}:`,
          error
        );
      }
    }

    return {
      id: insertId,
      firstName,
      lastName,
      email,
      password,
      roles,
      isVerified: false,
      roleChosen: false,
      dob,
    } as User;
  }

  static async getUserRoles(userId: number): Promise<string[]> {
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT r.name FROM user_roles ur 
       JOIN roles r ON ur.role_id = r.id 
       WHERE ur.user_id = ?`,
      [userId]
    );

    if (!Array.isArray(rows)) {
      console.error("Expected rows to be an array, but got:", rows);
      return [];
    }

    return rows.map((row) => row.name);
  }

  static async updateRole(userId: number, roles: string[]) {
    if (!Array.isArray(roles)) {
      console.error(`Expected roles to be an array, but got:`, roles);
      throw new TypeError("roles must be an array");
    }

    await db.execute<ResultSetHeader>(
      "DELETE FROM user_roles WHERE user_id = ?",
      [userId]
    );

    const roleInsertPromises = roles.map((role) => {
      return db.execute<ResultSetHeader>(
        "INSERT INTO user_roles (user_id, role_id) SELECT ?, id FROM roles WHERE name = ?",
        [userId, role]
      );
    });
    await Promise.all(roleInsertPromises);
  }

  static async updateDOB(userId: number, dob: string): Promise<void> {
    await db.execute<ResultSetHeader>("UPDATE users SET dob = ? WHERE id = ?", [
      dob,
      userId,
    ]);
  }

  static async findByResetToken(token: string): Promise<User | null> {
    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT * FROM users WHERE resetToken = ? AND resetTokenExpiresAt > NOW()",
      [token]
    );
    const user = rows[0] as User;
    return user || null;
  }

  static async requestPasswordReset(email: string): Promise<string | null> {
    const user = await this.findByEmail(email);
    if (!user) return null;

    const resetToken = crypto.randomBytes(32).toString("hex");

    const resetTokenExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000);
    await db.execute<ResultSetHeader>(
      "UPDATE users SET resetToken = ?, resetTokenExpiresAt = ? WHERE id = ?",
      [resetToken, resetTokenExpiresAt, user.id]
    );

    await sendPasswordResetEmail(email, resetToken);
    return resetToken;
  }

  static async resetPassword(
    token: string,
    newPassword: string
  ): Promise<boolean> {
    console.log("Reset Password called with token:", token);
    console.log("New password:", newPassword);

    const user = await this.findByResetToken(token);
    if (!user) {
      console.error("Invalid token:", token);
      return false;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.execute<ResultSetHeader>(
      "UPDATE users SET password = ?, resetToken = NULL, resetTokenExpiresAt = NULL WHERE id = ?",
      [hashedPassword, user.id]
    );
    console.log("Password reset successfully for user ID:", user.id);
    return true;
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

  static async emailExists(email: string): Promise<boolean> {
    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT COUNT(*) as count FROM users WHERE email = ?",
      [email]
    );
    return rows[0].count > 0;
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

  static async userExists(userId: number): Promise<boolean> {
    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT COUNT(*) as count FROM users WHERE id = ?",
      [userId]
    );
    return rows[0].count > 0;
  }
}

export default UserModel;
