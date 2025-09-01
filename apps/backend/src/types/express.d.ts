import type { JwtUser } from '@auth/user.type';

declare global {
  namespace Express {
    // Passport attaches the deserialized user here
    interface User extends JwtUser {}
    interface Request {
      user: User; // In guarded routes, user is present
    }
  }
}

export {};
