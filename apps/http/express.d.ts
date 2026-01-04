import type { role } from "@repo/types/types";

declare global {
  namespace Express {
    interface Request {
      user: {
        userId: string;
        role: role;
      };
    }
  }
}
