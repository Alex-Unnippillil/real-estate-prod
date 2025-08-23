import { Request, Response, NextFunction } from "express";
import { RateLimiterRedis } from "rate-limiter-flexible";
import Redis from "ioredis";

const redisClient = new Redis({
  enableOfflineQueue: false,
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6379,
});

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  points: 100,
  duration: 60,
  blockDuration: 300,
});

export const rateLimiterMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ip = req.ip || "";
  rateLimiter
    .consume(ip)
    .then(() => {
      next();
    })
    .catch((rejRes) => {
      const retrySecs = Math.ceil(rejRes.msBeforeNext / 1000);
      if (rejRes.consumedPoints > 0) {
        console.warn(`Rate limit exceeded for IP ${ip}`);
      }
      res.set("Retry-After", String(retrySecs));
      res.status(429).send("Too Many Requests");
    });
};
