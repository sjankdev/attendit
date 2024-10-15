import db from "../config/db";
import { ResultSetHeader } from "mysql2";

class AdminModel {
  static async create(userId: number): Promise<void> {
    await db.execute<ResultSetHeader>(
      "INSERT INTO admins (userId) VALUES (?)",
      [userId]
    );
  }
}

export default AdminModel;
