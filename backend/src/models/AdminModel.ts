import db from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { Admin } from "./Admin";

class AdminModel {
  static async create(userId: number): Promise<void> {
    await db.execute<ResultSetHeader>(
      "INSERT INTO admins (userId) VALUES (?)",
      [userId]
    );
  }

  static async findByUserId(userId: number): Promise<Admin | null> {
    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT * FROM admins WHERE userId = ?",
      [userId]
    );
    const admin = rows[0] as Admin;
    return admin || null;
  }
}

export default AdminModel;
