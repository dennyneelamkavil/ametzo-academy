import "server-only";

import { connectDB } from "@/server/db";
import { EnrollmentModel } from "@/server/models/enrollment.model";
import { StudentModel } from "@/server/models/student.model";

import { mapHomeResponse } from "./home.mapper";

export async function getStudentHome(studentId: string) {
  await connectDB();

  const student = await StudentModel.findById(studentId)
    .select("fullName")
    .lean();

  const enrollments = await EnrollmentModel.find({
    student: studentId,
    status: "active",
  })
    .populate({
      path: "course",
      select: "title slug image",
    })
    .lean();

  const totalCourses = enrollments.length;

  const completedLessons = enrollments.reduce(
    (sum, e) => sum + (e.completedLessons?.length ?? 0),
    0,
  );

  return mapHomeResponse(student, enrollments, {
    totalCourses,
    completedLessons,
  });
}
