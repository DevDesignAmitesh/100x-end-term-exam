import type { Request, Response } from "express";
import { responsePlate } from "../../utils";
import { prisma } from "@repo/db/db";

export const meService = async (req: Request, res: Response) => {
  try {
    const { userId, role } = req.user;

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        role,
      },
    });

    if (!user) {
      return responsePlate({
        res,
        status: 400,
        success: false,
        error: "User not found",
      });
    }

    return responsePlate({
      res,
      status: 200,
      success: true,
      data: {
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e) {
    console.log("error in meService ", e);

    return responsePlate({
      res,
      status: 500,
      success: false,
      error: "Internal server error",
    });
  }
};
