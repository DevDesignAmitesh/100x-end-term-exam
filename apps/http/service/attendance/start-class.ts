import type { Request, Response } from "express";
import { responsePlate } from "../../utils";
import { startClassSchema, zodErrorMessage } from "@repo/types/types";
import { prisma } from "@repo/db/db";

export const startClassService = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;
    const { data, success, error } = startClassSchema.safeParse({
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

    const updatedClass = await prisma.class.update({
      where: {
        id: classId,
        teacherId: userId,
      },
      data: {
        startedAt: new Date(),
      },
    });

    return responsePlate({
      res,
      status: 201,
      success: true,
      data: {
        classId: updatedClass.id,
        startedAt: updatedClass.startedAt
      }
    })
  } catch (e) {
    console.log("error in startClassService ", e);

    return responsePlate({
      res,
      status: 500,
      success: false,
      error: "Internal server error",
    });
  }
};
