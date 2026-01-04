import { Router } from "express";
import { signupService } from "../service/auth/signup";
import { loginService } from "../service/auth/login";
import { commonMiddleware } from "../middleware/common";
import { meService } from "../service/auth/me";

export const authRouter = Router();

authRouter.post("/signup", signupService);
authRouter.post("/login", loginService);
authRouter.post("/me", commonMiddleware, meService);
