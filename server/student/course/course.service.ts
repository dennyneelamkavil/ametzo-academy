import "server-only";

import { connectDB } from "@/server/db";
import { CourseModel } from "@/server/models/course.model";
import { LessonModel } from "@/server/models/lesson.model";
import { EnrollmentModel } from "@/server/models/enrollment.model";
import { AppError } from "@/server/errors/AppError";

import { mapCourseForStudentList, mapCourseDetail } from "./course.mapper";

type ListInput = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  studentId?: string;
};

export async function listStudentCourses(input: ListInput) {
  await connectDB();

  const page = input.page ?? 1;
  const limit = input.limit ?? 10;

  const query: any = { isPublished: true };

  if (input.search) {
    query.title = { $regex: input.search, $options: "i" };
  }

  if (input.category) {
    query.category = input.category;
  }

  const [courses, total] = await Promise.all([
    CourseModel.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),

    CourseModel.countDocuments(query),
  ]);

  let enrolledSet = new Set<string>();

  if (input.studentId) {
    const enrollments = await EnrollmentModel.find({
      student: input.studentId,
      course: { $in: courses.map((c) => c._id) },
    })
      .select("course")
      .lean();

    enrolledSet = new Set(enrollments.map((e) => e.course.toString()));
  }

  return {
    total,
    page,
    limit,
    data: courses.map((c) =>
      mapCourseForStudentList(c, enrolledSet.has(c._id.toString())),
    ),
  };
}

export async function getStudentCourseDetail(slug: string, studentId?: string) {
  await connectDB();

  const course = await CourseModel.findOne({
    slug,
    isPublished: true,
  }).lean();

  if (!course) {
    throw new AppError("Course not found", 404);
  }

  const lessons = await LessonModel.find({
    course: course._id,
  })
    .sort({ order: 1 })
    .lean();

  let enrollment = null;

  if (studentId) {
    enrollment = await EnrollmentModel.findOne({
      student: studentId,
      course: course._id,
    }).lean();
  }

  return mapCourseDetail(course, lessons, enrollment);
}
