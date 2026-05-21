"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticationMiddleware_1 = __importDefault(require("../Middlewares/authenticationMiddleware"));
const authController_1 = require("../Controllers/authController");
const router = (0, express_1.Router)();
router.post("/signup", authController_1.postSignup);
router.post("/login", authController_1.postLogin);
router.post("/logout", authController_1.logout);
router.get("/me", authenticationMiddleware_1.default, authController_1.getMe);
exports.default = router;
