import "server-only";

import { connectDB } from "@/server/db";
import { LessonModel } from "@/server/models/lesson.model";
import { EnrollmentModel } from "@/server/models/enrollment.model";
import { AppError } from "@/server/errors/AppError";

import { mapLessonDetail } from "./lesson.mapper";

export async function getStudentLesson(lessonId: string, studentId: string) {
  await connectDB();

  const lesson = await LessonModel.findById(lessonId).lean();

  if (!lesson) throw new AppError("Lesson not found", 404);

  const enrollment = await EnrollmentModel.findOne({
    student: studentId,
    course: lesson.course,
    status: "active",
  }).lean();

  if (!enrollment) {
    throw new AppError("You are not enrolled in this course", 403);
  }

  const isCompleted = enrollment.completedLessons?.some(
    (l: any) => l.toString() === lessonId,
  );

  return mapLessonDetail(lesson, enrollment, isCompleted);
}

export async function completeStudentLesson(
  lessonId: string,
  studentId: string,
) {
  await connectDB();

  const lesson = await LessonModel.findById(lessonId);

  if (!lesson) throw new AppError("Lesson not found", 404);

  const enrollment = await EnrollmentModel.findOne({
    student: studentId,
    course: lesson.course,
    status: "active",
  });

  if (!enrollment) {
    throw new AppError("You are not enrolled in this course", 403);
  }

  // prevent duplicate push
  const alreadyDone = enrollment.completedLessons.some(
    (l: any) => l.toString() === lessonId,
  );

  if (!alreadyDone) {
    enrollment.completedLessons.push(lesson._id);
  }

  enrollment.lastAccessedLesson = lesson._id;
  enrollment.lastActivityAt = new Date();

  // ---- recompute progress ----
  const totalLessons = await LessonModel.countDocuments({
    course: lesson.course,
  });

  enrollment.progressPercent = Math.round(
    (enrollment.completedLessons.length / totalLessons) * 100,
  );

  // auto mark completed
  if (enrollment.progressPercent === 100 && !enrollment.completedAt) {
    enrollment.completedAt = new Date();
    enrollment.status = "completed";
  }

  await enrollment.save();

  return {
    success: true,
    progress_percent: enrollment.progressPercent,
  };
}
