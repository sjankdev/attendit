import { User } from "./User";

export interface UserWithTokens extends User {
    token: string;
    refreshToken: string;
}
