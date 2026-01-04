import type { Request, Response } from "express";
import { responsePlate } from "../../utils";
import { getClassSchema, zodErrorMessage } from "@repo/types/types";
import { prisma } from "@repo/db/db";

export const getClassService = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;
    const { data, error, success } = getClassSchema.safeParse({ classId: id });

    if (!success) {
      return responsePlate({
        res,
        status: 400,
        success: false,
        error: zodErrorMessage({ error }),
      });
    }

    const { classId } = data;

    const exitingClass = await prisma.class.findFirst({
      where: {
        id: classId,
        OR: [
          { teacherId: userId },
          {
            students: {
              some: { id: userId },
            },
          },
        ],
      },
      include: {
        students: true,
      },
    });

    if (!exitingClass) {
      return responsePlate({
        res,
        status: 400,
        success: false,
        error: "Class not found",
      });
    }

    return responsePlate({
      res,
      status: 201,
      success: true,
      data: {
        _id: exitingClass.id,
        className: exitingClass.className,
        teacherId: exitingClass.teacherId,
        students: exitingClass.students,
      },
    });
  } catch (e) {
    console.log("error in getClassService ", e);

    return responsePlate({
      res,
      status: 500,
      success: false,
      error: "Internal server error",
    });
  }
};
