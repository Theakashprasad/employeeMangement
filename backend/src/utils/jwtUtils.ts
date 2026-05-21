import jwt from "jsonwebtoken";

const getSecret = (): string => {
  const secret = process.env.JWT_ACCESS_TOKEN_SECRET_KEY;
  if (!secret) {
    throw new Error("JWT_ACCESS_TOKEN_SECRET_KEY is not set in .env");
  }
  return secret;
};

export const generateAccessToken = (payload: object): string => {
  return jwt.sign(payload, getSecret(), { expiresIn: "7d" });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, getSecret());
};
