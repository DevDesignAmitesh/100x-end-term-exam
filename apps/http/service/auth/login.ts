import type { Request, Response } from "express";
import { responsePlate } from "../../utils";
import { loginSchema, zodErrorMessage } from "@repo/types/types";
import { prisma } from "@repo/db/db";
import { compare } from "bcryptjs";
import { generateToken } from "@repo/common/common";

export const loginService = async (req: Request, res: Response) => {
  try {
    const { data, success, error } = loginSchema.safeParse(req.body);

    if (!success) {
      return responsePlate({
        res,
        error: zodErrorMessage({ error }),
        status: 400,
        success: false,
      });
    }

    const { email, password } = data;

    const existingUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!existingUser) {
      return responsePlate({
        res,
        success: false,
        status: 400,
        error: "User not found",
      });
    }

    const isPasswordCorrect = await compare(password, existingUser.password);

    if (!isPasswordCorrect) {
      return responsePlate({
        res,
        success: false,
        status: 400,
        error: "Invalid password",
      });
    }

    const token = generateToken({
      jwt: {
        userId: existingUser.id,
        role: existingUser.role,
      },
      JWT_SECRET: process.env.JWT_SECRET!,
    });

    return responsePlate({
      res,
      status: 200,
      success: true,
      data: {
        token,
      },
    });
  } catch (e) {
    console.log("error in loginService ", e);
    return responsePlate({
      res,
      success: false,
      status: 500,
      error: "Internal server error",
    });
  }
};
