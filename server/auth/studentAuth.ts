import "server-only";
import jwt from "jsonwebtoken";

import { connectDB } from "@/server/db";
import { StudentModel } from "@/server/models/student.model";
import { AppError } from "@/server/errors/AppError";

const STUDENT_JWT_SECRET = process.env.STUDENT_JWT_SECRET!;

type StudentTokenPayload = {
  sub: string;
  type: "student";
  iat: number;
  exp: number;
};

export async function requireStudentAuth(req: Request) {
  await connectDB();

  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Authorization token missing", 401);
  }

  const token = authHeader.replace("Bearer ", "");

  let payload: StudentTokenPayload;
  try {
    payload = jwt.verify(token, STUDENT_JWT_SECRET) as StudentTokenPayload;
  } catch {
    throw new AppError("Invalid or expired token", 401);
  }

  if (payload.type !== "student") {
    throw new AppError("Invalid token type", 401);
  }

  const student = await StudentModel.findById(payload.sub).select(
    "_id isActive",
  );

  if (!student || !student.isActive) {
    throw new AppError("Student not found", 401);
  }

  return {
    studentId: student._id.toString(),
  };
}
