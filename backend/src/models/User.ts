import { RowDataPacket } from 'mysql2';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string; 
  role: string;
}

export default User;
