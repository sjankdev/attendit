import db from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { Participant } from "./Participant";

class ParticipantModel {
  static async create(userId: number): Promise<void> {
    await db.execute<ResultSetHeader>(
      "INSERT INTO participants (userId) VALUES (?)",
      [userId]
    );
  }

  static async deleteByUserId(userId: number): Promise<void> {
    await db.execute<ResultSetHeader>(
      "DELETE FROM participants WHERE userId = ?",
      [userId]
    );
  }

  static async findByUserId(userId: number): Promise<Participant | null> {
    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT * FROM participants WHERE userId = ?",
      [userId]
    );
    const participant = rows[0] as Participant;
    return participant || null;
  }
}

export default ParticipantModel;
