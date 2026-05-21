"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getSecret = () => {
    const secret = process.env.JWT_ACCESS_TOKEN_SECRET_KEY;
    if (!secret) {
        throw new Error("JWT_ACCESS_TOKEN_SECRET_KEY is not set in .env");
    }
    return secret;
};
const generateAccessToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, getSecret(), { expiresIn: "7d" });
};
exports.generateAccessToken = generateAccessToken;
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, getSecret());
};
exports.verifyToken = verifyToken;
