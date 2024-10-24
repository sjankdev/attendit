export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roles: string[]; 
  isVerified: boolean;
  roleChosen: boolean;
  dob?: Date | null;
  confirmPassword?: string;
}
