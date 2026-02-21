import "server-only";

import { connectDB } from "@/server/db";
import { StudentModel } from "@/server/models/student.model";
import { AppError } from "@/server/errors/AppError";
import { mapSavedCourses } from "./saved-courses.mapper";

export async function listSavedCourses(studentId: string) {
  await connectDB();

  const student = await StudentModel.findById(studentId)
    .populate("savedCourses")
    .lean();

  if (!student) throw new AppError("Student not found", 404);

  return student.savedCourses.map(mapSavedCourses);
}

export async function addToSavedCourses(studentId: string, courseId: string) {
  await connectDB();

  const student = await StudentModel.findById(studentId);
  if (!student) throw new AppError("Student not found", 404);

  if (!student.savedCourses.includes(courseId as any)) {
    student.savedCourses.push(courseId as any);
    await student.save();
  }

  return { success: true };
}

export async function removeFromSavedCourses(
  studentId: string,
  courseId: string,
) {
  await connectDB();

  const student = await StudentModel.findById(studentId);
  if (!student) throw new AppError("Student not found", 404);

  student.savedCourses = student.savedCourses.filter(
    (id: (typeof student.savedCourses)[number]) => id.toString() !== courseId,
  );

  await student.save();

  return { success: true };
}
