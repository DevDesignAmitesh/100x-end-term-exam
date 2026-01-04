import { verify, sign } from "jsonwebtoken";
import type { jwtPlayloadProps, generateTokenProps } from "@repo/types/types";

export const verifyToken = ({
  token,
  JWT_SECRET,
}: {
  token: string;
  JWT_SECRET: string;
}) => {
  try {
    return verify(token, JWT_SECRET) as jwtPlayloadProps;
  } catch (e) {
    console.log("error in verifyToken ", e);
    return null;
  }
};

export const generateToken = ({ jwt, JWT_SECRET }: generateTokenProps) => {
  try {
    return sign(jwt, JWT_SECRET);
  } catch (e) {
    console.log("error in genratetoken ", e);
    return null;
  }
};
