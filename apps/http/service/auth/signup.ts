import type { Request, Response } from "express";
import { responsePlate } from "../../utils";
import { signupSchema, zodErrorMessage } from "@repo/types/types";
import { hash } from "bcryptjs";
import { prisma } from "@repo/db/db";

export const signupService = async (req: Request, res: Response) => {
  try {
    const { data, success, error } = signupSchema.safeParse(req.body);

    if (!success) {
      return responsePlate({
        res,
        error: zodErrorMessage({ error }),
        success: false,
        status: 400,
      });
    }

    const { email, name, password, role } = data;

    const existingUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (existingUser) {
      return responsePlate({
        res,
        status: 400,
        success: false,
        error: "Email already exists",
      });
    }

    const hashedPassword = await hash(password, 4);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    return responsePlate({
      res,
      success: true,
      status: 201,
      data: {
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e) {
    console.log("error in signupService ", e);

    return responsePlate({
      res,
      status: 500,
      success: false,
      error: "Internal server error",
    });
  }
};
