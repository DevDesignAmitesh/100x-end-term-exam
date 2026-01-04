import { Router } from "express";
import { teacherMiddleware } from "../middleware/teacher";
import { startClassService } from "../service/attendance/start-class";

export const attendanceRouter = Router();

attendanceRouter.post("/start", teacherMiddleware, startClassService)