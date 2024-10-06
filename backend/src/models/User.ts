import db from '../config/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2'; 

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string; 
  role: string;
}

class UserModel {
  static async create(firstName: string, lastName: string, email: string, password: string, role: string): Promise<number> {
    const [result] = await db.execute<ResultSetHeader>(
      'INSERT INTO users (firstName, lastName, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [firstName, lastName, email, password, role]
    );

    return result.insertId; 
  }

  static async findByEmail(email: string): Promise<User | null> {
    const [rows] = await db.execute<RowDataPacket[]>('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0] as User; 
    return user || null; 
  }
}

export default UserModel;
