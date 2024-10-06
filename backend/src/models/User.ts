import db from '../config/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2'; 

interface User {
  id: number;
  username: string;
  email: string;
  password: string; 
  role: string;
}

class UserModel {
  static async create(username: string, email: string, password: string, role: string): Promise<number> {
    const [result] = await db.execute<ResultSetHeader>(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, password, role]
    );

    return result.insertId; 
  }

  static async findByEmail(email: string): Promise<User | null> {
    const [rows] = await db.execute<RowDataPacket[]>('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0] as User; 
    return user || null; 
  }

  static async findByUsername(username: string): Promise<User | null> {
    const [rows] = await db.execute<RowDataPacket[]>('SELECT * FROM users WHERE username = ?', [username]);
    const user = rows[0] as User; 
    return user || null; 
  }
}

export default UserModel;
