import express from "express";
import { authRouter } from "./routes/auth";
import { classRouter } from "./routes/class";
import { studentRouter } from "./routes/student";
import { attendanceRouter } from "./routes/attendance";
import cors from "cors";

export const app = express();

app.use(express.json())
app.use(cors())

app.use("/auth", authRouter);
app.use("/class", classRouter);
app.use("/students", studentRouter);
app.use("/attendance", attendanceRouter);
