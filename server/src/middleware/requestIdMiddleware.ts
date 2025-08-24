import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

declare global {
  namespace Express {
    interface Request {
      requestId: string;
    }
  }
}

export const requestIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const requestId = uuidv4();
  req.requestId = requestId;
  res.setHeader("X-Request-Id", requestId);

  const originalJson = res.json.bind(res);
  res.json = (body: any) => {
    if (body && typeof body === "object" && !body.requestId) {
      body.requestId = requestId;
    }
    return originalJson(body);
  };

  next();
};

