
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  token?: string;
  refreshToken?: string;
  revoked?: boolean;
  verificationToken?: string;
  isVerified?: boolean;
  verificationTokenExpiresAt?: Date;
}

export default User;
