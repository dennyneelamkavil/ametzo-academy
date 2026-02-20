import "server-only";

import { connectDB } from "@/server/db";
import { StudentModel } from "@/server/models/student.model";
import { AppError } from "@/server/errors/AppError";
import { mapStudent } from "./user.mapper";
import type { UpdateProfileInput } from "./user.validation";

export async function getCurrentStudent(studentId: string) {
  await connectDB();

  const student = await StudentModel.findById(studentId).lean();

  if (!student) throw new AppError("Student not found", 404);

  return mapStudent(student);
}

export async function updateProfile(
  studentId: string,
  input: UpdateProfileInput,
) {
  await connectDB();

  const updated = await StudentModel.findByIdAndUpdate(studentId, input, {
    new: true,
  }).lean();

  if (!updated) throw new AppError("Student not found", 404);

  return mapStudent(updated);
}
