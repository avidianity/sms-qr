import { User as UserModel } from '@prisma/client';

declare global {
    namespace Express {
        interface User extends UserModel {}
    }
}
