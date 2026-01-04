import type { NextFunction, Request, Response } from "express";
import { responsePlate } from "../utils";
import { verifyToken } from "@repo/common/common";

export const teacherMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return responsePlate({
        res,
        status: 401,
        success: false,
        error: "token not found",
      });
    }

    const decoded = verifyToken({ token, JWT_SECRET: process.env.JWT_SECRET! });

    if (!decoded.userId) {
      return responsePlate({
        res,
        status: 401,
        success: false,
        error: "invalid token",
      });
    }

    if (decoded.role !== "teacher") {
      return responsePlate({
        res,
        status: 403,
        success: false,
        error: "Forbidden, teacher access required",
      });
    }

    req.user = decoded;
    next();
  } catch (e) {
    console.log("error in teacherMiddleware ", e);
    return responsePlate({
      res,
      success: false,
      status: 500,
      error: "Internal server error",
    });
  }
};
