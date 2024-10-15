export interface JwtToken {
    id: number;
    userId: number;
    token: string;
    refreshToken: string;
}
