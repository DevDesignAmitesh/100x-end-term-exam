import { Router } from "express";
import { teacherMiddleware } from "../middleware/teacher";
import { createClassService } from "../service/class/create-class";
import { addStudentService } from "../service/class/add-student";
import { getClassService } from "../service/class/get-class";
import { commonMiddleware } from "../middleware/common";
import { studentMiddleware } from "../middleware/student";
import { getAttendanceService } from "../service/class/get-attendance";

export const classRouter = Router();

classRouter.post("/", teacherMiddleware, createClassService);

// id => classId
classRouter.post("/:id/add-student", teacherMiddleware, addStudentService);

// id => classId
classRouter.get("/:id", commonMiddleware, getClassService);

// id => classId
classRouter.get("/:id/my-attendance", studentMiddleware, getAttendanceService);
