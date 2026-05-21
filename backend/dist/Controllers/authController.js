"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.getMe = exports.postLogin = exports.postSignup = void 0;
const userModel_1 = __importDefault(require("../Models/userModel"));
const passwordUtils_1 = require("../utils/passwordUtils");
const jwtUtils_1 = require("../utils/jwtUtils");
const authValidation_1 = require("../utils/authValidation");
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};
const postSignup = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const validationError = (0, authValidation_1.validateSignup)({ firstName, lastName, email, password });
        if (validationError) {
            return res.status(400).json({ success: false, message: validationError, Message: validationError });
        }
        const normalizedEmail = email.trim().toLowerCase();
        const existingUser = await userModel_1.default.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists with this email",
                Message: "User already exists with this email",
            });
        }
        const hashedPassword = await (0, passwordUtils_1.hashPassword)(password);
        const newUser = await userModel_1.default.create({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: normalizedEmail,
            password: hashedPassword,
        });
        const user = (0, authValidation_1.sanitizeUser)(newUser.toObject());
        return res.status(201).json({
            success: true,
            message: "Account created successfully",
            ...user,
            user,
        });
    }
    catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            Message: "Internal Server Error",
        });
    }
};
exports.postSignup = postSignup;
const postLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const validationError = (0, authValidation_1.validateLogin)({ email, password });
        if (validationError) {
            return res.status(400).json({ success: false, message: validationError, Message: validationError });
        }
        const normalizedEmail = email.trim().toLowerCase();
        const existingUser = await userModel_1.default.findOne({ email: normalizedEmail });
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "User not found with this email",
                Message: "User not found with this email",
            });
        }
        const isPasswordMatch = await (0, passwordUtils_1.comparePassword)(password, existingUser.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
                Message: "Password does not match",
            });
        }
        const accessToken = await (0, jwtUtils_1.generateAccessToken)({
            email: existingUser.email,
            userId: String(existingUser._id),
        });
        res.cookie("token", accessToken, COOKIE_OPTIONS);
        const existingUserSafe = (0, authValidation_1.sanitizeUser)(existingUser.toObject());
        return res.status(200).json({
            success: true,
            message: "Login successful",
            Message: "Authentication verified",
            existingUser: existingUserSafe,
            user: existingUserSafe,
            accessToken,
            token: accessToken,
        });
    }
    catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            Message: "Internal Server Error",
        });
    }
};
exports.postLogin = postLogin;
const getMe = async (req, res) => {
    try {
        const email = req.user;
        if (!email) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const user = await userModel_1.default.findOne({ email }).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        return res.status(200).json({
            success: true,
            user: (0, authValidation_1.sanitizeUser)(user.toObject()),
        });
    }
    catch (error) {
        console.error("getMe error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
exports.getMe = getMe;
const logout = async (_req, res) => {
    try {
        res.clearCookie("token", COOKIE_OPTIONS);
        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Logout failed" });
    }
};
exports.logout = logout;
