import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { verifyToken } from "../utils/jwtUtils";

export interface CustomRequest extends Request {
  user?: string;
  token?: string;
}

interface DecodedToken {
  email: string;
}

const authenticationMiddleware = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    let token =
      authHeader?.startsWith("Bearer ")
        ? authHeader.slice(7)
        : (req.headers.token as string | undefined);

    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: "Authentication failed. Token missing." });
    }

    const decoded = verifyToken(token) as DecodedToken;
    req.user = decoded.email;
    req.token = token;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "Token expired. Please log in again." });
    }
    return res.status(401).json({ message: "Authentication failed." });
  }
};

export default authenticationMiddleware;
