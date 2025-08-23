import { Request, Response, NextFunction } from "express";

export function cacheControl(req: Request, res: Response, next: NextFunction) {
  if (req.method === "GET") {
    const isPrivate = req.path.startsWith("/tenants") || req.path.startsWith("/managers");
    const visibility = isPrivate ? "private" : "public";
    res.set(
      "Cache-Control",
      `${visibility}, max-age=60, stale-while-revalidate=120`
    );
  }
  next();
}
