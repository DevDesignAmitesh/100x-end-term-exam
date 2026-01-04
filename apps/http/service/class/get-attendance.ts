import type { Request, Response } from "express";
import { responsePlate } from "../../utils";
import { getAttendanceSchema, zodErrorMessage } from "@repo/types/types";
import { prisma } from "@repo/db/db";

export const getAttendanceService = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;

    const { data, error, success } = getAttendanceSchema.safeParse({
      classId: id,
    });

    if (!success) {
      return responsePlate({
        res,
        status: 400,
        success: false,
        error: zodErrorMessage({ error }),
      });
    }

    const { classId } = data;

    const attendance = await prisma.attendance.findFirst({
      where: {
        studentId: userId,
        classId,
      },
    });

    return responsePlate({
      res,
      status: 200,
      success: true,
      data: {
        classId: attendance?.classId,
        status: attendance?.status,
      },
    });
  } catch (e) {
    console.log("error in getAttendanceService ", e);

    return responsePlate({
      res,
      status: 500,
      success: false,
      error: "Internal server error",
    });
  }
};
