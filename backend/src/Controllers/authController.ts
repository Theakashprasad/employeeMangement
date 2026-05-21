import { Request, Response } from "express";
import User from "../Models/userModel";
import { comparePassword, hashPassword } from "../utils/passwordUtils";
import { generateAccessToken } from "../utils/jwtUtils";
import {
  validateSignup,
  validateLogin,
  sanitizeUser,
} from "../utils/authValidation";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const postSignup = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const validationError = validateSignup({ firstName, lastName, email, password });
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError, Message: validationError });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email",
        Message: "User already exists with this email",
      });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    const user = sanitizeUser(newUser.toObject() as unknown as Record<string, unknown>);

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      ...user,
      user,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      Message: "Internal Server Error",
    });
  }
};

export const postLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const validationError = validateLogin({ email, password });
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError, Message: validationError });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found with this email",
        Message: "User not found with this email",
      });
    }

    const isPasswordMatch = await comparePassword(password, existingUser.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
        Message: "Password does not match",
      });
    }

    const accessToken = await generateAccessToken({
      email: existingUser.email,
      userId: String(existingUser._id),
    });

    res.cookie("token", accessToken, COOKIE_OPTIONS);

    const existingUserSafe = sanitizeUser(
      existingUser.toObject() as unknown as Record<string, unknown>,
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      Message: "Authentication verified",
      existingUser: existingUserSafe,
      user: existingUserSafe,
      accessToken,
      token: accessToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      Message: "Internal Server Error",
    });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const email = (req as Request & { user?: string }).user;
    if (!email) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await User.findOne({ email }).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      user: sanitizeUser(user.toObject() as unknown as Record<string, unknown>),
    });
  } catch (error) {
    console.error("getMe error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const logout = async (_req: Request, res: Response) => {
  try {
    res.clearCookie("token", COOKIE_OPTIONS);
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Logout failed" });
  }
};
