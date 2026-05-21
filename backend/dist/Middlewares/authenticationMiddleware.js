"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtUtils_1 = require("../utils/jwtUtils");
const authenticationMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        let token = authHeader?.startsWith("Bearer ")
            ? authHeader.slice(7)
            : req.headers.token;
        if (!token && req.cookies?.token) {
            token = req.cookies.token;
        }
        if (!token) {
            return res.status(401).json({ message: "Authentication failed. Token missing." });
        }
        const decoded = (0, jwtUtils_1.verifyToken)(token);
        req.user = decoded.email;
        req.token = token;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return res.status(401).json({ message: "Token expired. Please log in again." });
        }
        return res.status(401).json({ message: "Authentication failed." });
    }
};
exports.default = authenticationMiddleware;
