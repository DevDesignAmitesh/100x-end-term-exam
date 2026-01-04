import type { Request, Response } from "express";
import { responsePlate } from "../../utils";
import { addStudentSchema, zodErrorMessage } from "@repo/types/types";
import { prisma } from "@repo/db/db";

export const addStudentService = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;
    const { data, success, error } = addStudentSchema.safeParse({
      ...req.body,
      classId: id,
    });

    if (!success) {
      return responsePlate({
        res,
        error: zodErrorMessage({ error }),
        status: 400,
        success: false,
      });
    }

    const { classId, studentId } = data;

    const [existingClass, existingStudent] = await Promise.all([
      prisma.class.findFirst({
        where: { id: classId, teacherId: userId },
      }),
      prisma.user.findFirst({
        where: { id: classId, role: "student" },
      }),
    ]);

    if (!existingClass || !existingStudent) {
      return responsePlate({
        res,
        status: 400,
        success: false,
        error: "Class or student not found",
      });
    }

    const createdClass = await prisma.class.update({
      where: {
        id: classId,
      },
      data: {
        students: {
          connect: {
            id: studentId,
          },
        },
      },
      include: {
        students: true,
      },
    });

    return responsePlate({
      res,
      status: 201,
      success: true,
      data: {
        _id: createdClass.id,
        className: createdClass.className,
        teachedId: createdClass.teacherId,
        studentIds: createdClass.students,
      },
    });
  } catch (e) {
    console.log("error in addStudentService ", e);

    return responsePlate({
      res,
      status: 500,
      success: false,
      error: "Internal server error",
    });
  }
};
