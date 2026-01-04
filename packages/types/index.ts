import z, { ZodError } from "zod";

export interface generateTokenProps {
  jwt: jwtPlayloadProps;
  JWT_SECRET: string;
}

export interface jwtPlayloadProps {
  userId: string;
  role: role;
}

export type role = "student" | "teacher";

export type attendenceStatus = "present" | "absent";

export const zodErrorMessage = ({ error }: { error: ZodError }) => {
  return error.issues
    .map((er) => `${er.path.join(".")}: ${er.message}`)
    .join(", ");
};

export const signupSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string().min(6),
  role: z.enum(["student", "teacher"]),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export const createClassSchema = z.object({
  className: z.string(),
});

export const addStudentSchema = z.object({
  classId: z.uuid(),
  studentId: z.uuid(),
});

export const getClassSchema = z.object({
  classId: z.uuid(),
});

export const getAttendanceSchema = z.object({
  classId: z.uuid(),
});

export const startClassSchema = z.object({
  classId: z.uuid(),
});
