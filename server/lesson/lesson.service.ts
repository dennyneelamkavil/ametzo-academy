import "server-only";

import { connectDB } from "@/server/db";
import { LessonModel } from "@/server/models/lesson.model";
import { CourseModel } from "@/server/models/course.model";

import { mapLesson } from "./lesson.mapper";
import type { CreateLessonInput, UpdateLessonInput } from "./lesson.validation";

import {
  moveMediaToFinalFolder,
  deleteFromCloudinary,
} from "@/server/media/media.provider";
import { buildSortSpec } from "@/server/utils/build-sort-spec";
import { AppError } from "@/server/errors/AppError";

async function syncCourseLessonCount(courseId: string) {
  const total = await LessonModel.countDocuments({ course: courseId });

  await CourseModel.findByIdAndUpdate(courseId, {
    totalLessons: total,
  });
}

/* ================= CREATE ================= */
export async function createLesson(input: CreateLessonInput) {
  await connectDB();

  const courseExists = await CourseModel.exists({ _id: input.course });
  if (!courseExists) {
    throw new AppError("Course not found", 404);
  }

  const videoUrl = input.videoUrl.publicId.includes("/temp/")
    ? await moveMediaToFinalFolder(input.videoUrl, "lessons")
    : input.videoUrl;

  const lesson = await LessonModel.create({
    title: input.title,
    course: input.course,
    videoUrl,
    durationMinutes: input.durationMinutes ?? 0,
    order: input.order ?? 0,
  });

  await syncCourseLessonCount(input.course);

  return mapLesson(lesson);
}

/* ================= LIST ================= */
export async function listLessons(params?: {
  page?: number;
  limit?: number;
  search?: string;
  all?: boolean;
  sortBy?: string;
  sortDir?: string;
  course?: string;
}) {
  await connectDB();

  if (params?.all) {
    const lessons = await LessonModel.find({}).sort({ order: 1 }).lean();

    return {
      data: lessons.map(mapLesson),
      pagination: null,
    };
  }

  const page = Math.max(1, params?.page ?? 1);
  const limit = Math.min(50, params?.limit ?? 10);
  const skip = (page - 1) * limit;

  const { sortSpec, sortBy, sortDir } = buildSortSpec({
    type: "lesson",
    sortBy: params?.sortBy,
    sortDir: params?.sortDir,
    defaultSortBy: "order",
    defaultSortDir: "asc",
  });

  const query: any = {};

  if (params?.search) {
    query.title = { $regex: params.search, $options: "i" };
  }

  if (params?.course) {
    query.course = params.course;
  }

  const [lessons, total] = await Promise.all([
    LessonModel.find(query).sort(sortSpec).skip(skip).limit(limit).lean(),
    LessonModel.countDocuments(query),
  ]);

  return {
    data: lessons.map(mapLesson),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    sort: {
      by: sortBy,
      dir: sortDir,
    },
  };
}

/* ================= GET ================= */
export async function getLessonById(id: string) {
  await connectDB();

  const lesson = await LessonModel.findById(id).lean();
  if (!lesson) throw new AppError("Lesson not found", 404);

  return mapLesson(lesson);
}

/* ================= UPDATE ================= */
export async function updateLesson(id: string, input: UpdateLessonInput) {
  await connectDB();

  const existing = await LessonModel.findById(id);
  if (!existing) throw new AppError("Lesson not found", 404);

  const videoUrl = input.videoUrl?.publicId.includes("/temp/")
    ? await moveMediaToFinalFolder(input.videoUrl, "lessons")
    : input.videoUrl;

  const updateData: any = { ...input, videoUrl };

  const updated = await LessonModel.findByIdAndUpdate(id, updateData, {
    new: true,
  });

  const oldCourseId = existing.course.toString();

  // sync counts properly
  await syncCourseLessonCount(oldCourseId);

  if (input.course && input.course !== oldCourseId) {
    await syncCourseLessonCount(input.course);
  }

  if (
    input.videoUrl &&
    existing.videoUrl?.publicId &&
    input.videoUrl.publicId !== existing.videoUrl.publicId
  ) {
    await deleteFromCloudinary(
      existing.videoUrl.publicId,
      existing.videoUrl.resourceType,
    );
  }

  return mapLesson(updated);
}

/* ================= DELETE ================= */
export async function deleteLesson(id: string) {
  await connectDB();

  const lesson = await LessonModel.findByIdAndDelete(id);
  if (!lesson) throw new AppError("Lesson not found", 404);

  await syncCourseLessonCount(lesson.course.toString());

  if (lesson.videoUrl?.publicId) {
    await deleteFromCloudinary(
      lesson.videoUrl.publicId,
      lesson.videoUrl.resourceType,
    );
  }

  return { success: true };
}
