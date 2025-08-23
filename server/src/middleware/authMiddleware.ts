import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, JwtHeader } from "jsonwebtoken";
import jwksClient from "jwks-rsa";

interface DecodedToken extends JwtPayload {
  sub: string;
  "custom:role"?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken;
    }
  }
}

const client = jwksClient({
  jwksUri: `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`,
  cache: true,
  cacheMaxEntries: 5,
  cacheMaxAge: 10 * 60 * 1000,
});

const getKey = (header: JwtHeader, callback: jwt.SigningKeyCallback) => {
  client.getSigningKey(header.kid as string, (err, key) => {
    if (err || !key) {
      callback(err as any, undefined);
      return;
    }
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
};

export const authMiddleware = (allowedRoles: string[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    try {
      const decoded = (await new Promise<DecodedToken>((resolve, reject) => {
        jwt.verify(token, getKey, { algorithms: ["RS256"] }, (err, decoded) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(decoded as DecodedToken);
        });
      })) as DecodedToken;

      req.user = decoded;
      const userRole = (decoded["custom:role"] || "").toLowerCase();

      if (allowedRoles.length && !allowedRoles.includes(userRole)) {
        res.status(403).json({ message: "Access Denied" });
        return;
      }

      next();
    } catch (err: any) {
      if (err.name === "TokenExpiredError") {
        res.status(401).json({ message: "Token expired" });
        return;
      }
      console.error("Failed to verify token:", err);
      res.status(401).json({ message: "Invalid token" });
    }
  };
};
