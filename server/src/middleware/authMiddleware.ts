import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface DecodedToken extends JwtPayload {
  sub: string;
  "custom:role"?: string;
  "cognito:groups"?: string[];
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        roles: string[];
      };
    }
  }
}

export const authMiddleware = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    try {
      const decoded = jwt.decode(token) as DecodedToken;
      const roles =
        decoded["cognito:groups"] ||
        (decoded["custom:role"] ? [decoded["custom:role"]] : []);
      req.user = {
        id: decoded.sub,
        roles,
      };

      const userRolesLower = roles.map((r) => r.toLowerCase());
      const hasAccess = allowedRoles.some((role) =>
        userRolesLower.includes(role.toLowerCase())
      );
      if (!hasAccess) {
        res.status(403).json({ message: "Access Denied" });
        return;
      }
    } catch (err) {
      console.error("Failed to decode token:", err);
      res.status(400).json({ message: "Invalid token" });
      return;
    }

    next();
  };
};
