import { User as UserModelInterface } from '../../models/User';

declare global {
    namespace Express {
        interface User extends UserModelInterface {}
    }
}
