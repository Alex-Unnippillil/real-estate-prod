import { Request } from "express";

interface LogMeta {
  [key: string]: any;
}

const baseLog = (
  level: string,
  req: Request | null,
  message: string,
  meta: LogMeta = {}
) => {
  const logEntry: LogMeta = { level, message, ...meta };
  const requestId = (req as any)?.requestId;
  if (requestId) {
    logEntry.requestId = requestId;
  }
  console.log(JSON.stringify(logEntry));
};

export const logInfo = (
  req: Request | null,
  message: string,
  meta: LogMeta = {}
): void => baseLog("info", req, message, meta);

export const logError = (
  req: Request | null,
  message: string,
  meta: LogMeta = {}
): void => baseLog("error", req, message, meta);
