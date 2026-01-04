import type { Request, Response } from "express";
import { responsePlate } from "../../utils";
import { createClassSchema, zodErrorMessage } from "@repo/types/types";
import { prisma } from "@repo/db/db";

export const createClassService = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user;
    const { data, success, error } = createClassSchema.safeParse(req.body);

    if (!success) {
      return responsePlate({
        res,
        status: 400,
        success: false,
        error: zodErrorMessage({ error }),
      });
    }

    const { className } = data;

    const createdClass = await prisma.class.create({
      data: {
        className,
        teacherId: userId,
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
        teacherId: createdClass.teacherId,
        studentIds: createdClass.students,
      },
    });
  } catch (e) {
    console.log("error in createClassService ", e);

    return responsePlate({
      res,
      status: 500,
      success: false,
      error: "Internal server error",
    });
  }
};
