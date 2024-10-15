import db from "../config/db";
import { ResultSetHeader } from "mysql2";

class ParticipantModel {
  static async create(userId: number): Promise<void> {
    await db.execute<ResultSetHeader>(
      "INSERT INTO participants (userId) VALUES (?)",
      [userId]
    );
  }
}

export default ParticipantModel;
