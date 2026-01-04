import type { Request, Response } from "express";
import { responsePlate } from "../../utils";
import { prisma } from "@repo/db/db";

export const getStudentsService = async (req: Request, res: Response) => {
  try {
    const students = await prisma.user.findMany({
      where: {
        role: "student",
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    return responsePlate({
      res,
      status: 200,
      success: true,
      data: students,
    });
  } catch (e) {
    console.log("error in getStudentsService ", e);

    return responsePlate({
      res,
      status: 500,
      success: false,
      error: "Internal server error",
    });
  }
};
