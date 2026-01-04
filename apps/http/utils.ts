import type { Response } from "express";

interface responsePlateProps {
  res: Response;
  success: boolean;
  status: number;
  error?: any;
  data?: any;
}

export const responsePlate = ({
  res,
  success,
  data,
  error,
  status,
}: responsePlateProps) => {
  return res.status(status).json({
    data,
    success,
    error,
  });
};
