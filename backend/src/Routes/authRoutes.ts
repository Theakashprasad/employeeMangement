import { Router } from "express";
import authenticationMiddleware from "../Middlewares/authenticationMiddleware";
import { postSignup, postLogin, getMe, logout } from "../Controllers/authController";

const router = Router();

router.post("/signup", postSignup);
router.post("/login", postLogin);
router.post("/logout", logout);
router.get("/me", authenticationMiddleware, getMe);

export default router;
