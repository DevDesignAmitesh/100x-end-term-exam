import { Router } from "express";
import { teacherMiddleware } from "../middleware/teacher";
import { getStudentsService } from "../service/student/get-student";

export const studentRouter = Router();

studentRouter.get("/", teacherMiddleware, getStudentsService)