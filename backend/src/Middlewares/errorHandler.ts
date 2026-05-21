import { Request, Response, NextFunction } from "express";

export const notFoundHandler = (_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: "Route not found" });
};

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
  });
};
