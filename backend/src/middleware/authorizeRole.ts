import { Request, Response, NextFunction } from "express";
import UserModel from "../models/UserModel";

export const authorizeRole = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const userRoles = await UserModel.getUserRoles(userId);
      const hasRole = roles.some((role) => userRoles.includes(role));

      if (!hasRole) {
        return res
          .status(403)
          .json({ message: "Forbidden: Insufficient role" });
      }

      next();
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error });
    }
  };
};
