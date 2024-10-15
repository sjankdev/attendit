export interface EmailVerification {
    id: number;
    userId: number;
    verificationToken: string;
    verificationTokenExpiresAt: Date;
}
