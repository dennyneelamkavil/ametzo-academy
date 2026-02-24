import "server-only";

import { connectDB } from "@/server/db";
import { CourseModel } from "@/server/models/course.model";
import { LessonModel } from "@/server/models/lesson.model";

import { mapCourse } from "./course.mapper";
import type { CreateCourseInput, UpdateCourseInput } from "./course.validation";

import { generateUniqueCategorySlug } from "@/server/utils/slug.util"; // reuse slug util
import { buildSortSpec } from "@/server/utils/build-sort-spec";
import {
  deleteFromCloudinary,
  moveMediaToFinalFolder,
} from "@/server/media/media.provider";
import { AppError } from "@/server/errors/AppError";

/* ================= CREATE ================= */
export async function createCourse(input: CreateCourseInput) {
  await connectDB();

  const slug = await generateUniqueCategorySlug(input.title);

  const image = input.image?.publicId.includes("/temp/")
    ? await moveMediaToFinalFolder(input.image, "courses")
    : input.image;

  if (input.seo?.ogImage?.publicId.includes("/temp/")) {
    input.seo.ogImage = await moveMediaToFinalFolder(input.seo.ogImage, "seo");
  }

  const course = await CourseModel.create({
    title: input.title,
    slug,
    description: input.description,
    category: input.category,
    level: input.level ?? "Beginner",
    durationHours: input.durationHours ?? 0,
    totalLessons: input.totalLessons ?? 0,
    price: input.price ?? 0,
    image,
    isPublished: input.isPublished ?? false,
    seo: input.seo,
  });

  return mapCourse(course);
}

export async function listCourses(params?: {
  page?: number;
  limit?: number;
  search?: string;
  all?: boolean;
  sortBy?: string;
  sortDir?: string;
  isPublished?: string;
}) {
  await connectDB();

  if (params?.all) {
    const courses = await CourseModel.find({}).sort({ createdAt: -1 }).lean();

    return {
      data: courses.map(mapCourse),
      pagination: null,
    };
  }

  const page = Math.max(1, params?.page ?? 1);
  const limit = Math.min(50, params?.limit ?? 10);
  const skip = (page - 1) * limit;

  const { sortSpec, sortBy, sortDir } = buildSortSpec({
    type: "course",
    sortBy: params?.sortBy,
    sortDir: params?.sortDir,
    defaultSortBy: "createdAt",
    defaultSortDir: "desc",
  });

  const query: any = {};

  if (params?.search) {
    query.title = { $regex: params.search, $options: "i" };
  }

  if (params?.isPublished === "true") {
    query.isPublished = true;
  } else if (params?.isPublished === "false") {
    query.isPublished = false;
  }

  const [courses, total] = await Promise.all([
    CourseModel.find(query).sort(sortSpec).skip(skip).limit(limit).lean(),
    CourseModel.countDocuments(query),
  ]);

  return {
    data: courses.map(mapCourse),
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

export async function getCourseById(id: string) {
  await connectDB();

  const course = await CourseModel.findById(id).lean();
  if (!course) throw new AppError("Course not found", 404);

  return mapCourse(course);
}

export async function updateCourse(id: string, input: UpdateCourseInput) {
  await connectDB();

  const existing = await CourseModel.findById(id);
  if (!existing) throw new AppError("Course not found", 404);

  const image = input.image?.publicId.includes("/temp/")
    ? await moveMediaToFinalFolder(input.image, "courses")
    : input.image;

  if (input.seo?.ogImage?.publicId.includes("/temp/")) {
    input.seo.ogImage = await moveMediaToFinalFolder(input.seo.ogImage, "seo");
  }

  const updateData: any = { ...input, image };

  if (input.title) {
    updateData.slug = await generateUniqueCategorySlug(input.title, id);
  }

  const updated = await CourseModel.findByIdAndUpdate(id, updateData, {
    new: true,
  });

  if (
    input.image &&
    existing.image?.publicId &&
    input.image.publicId !== existing.image.publicId
  ) {
    await deleteFromCloudinary(
      existing.image.publicId,
      existing.image.resourceType,
    );
  }

  return mapCourse(updated);
}

export async function deleteCourse(id: string) {
  await connectDB();

  const hasLessons = await LessonModel.exists({ course: id });
  if (hasLessons) {
    throw new AppError(
      "Cannot delete course: lessons are linked to this course",
      409,
    );
  }

  const course = await CourseModel.findByIdAndDelete(id);
  if (!course) throw new AppError("Course not found", 404);

  if (course.image?.publicId) {
    await deleteFromCloudinary(
      course.image.publicId,
      course.image.resourceType,
    );
  }

  if (course.seo?.ogImage?.publicId) {
    await deleteFromCloudinary(
      course.seo.ogImage.publicId,
      course.seo.ogImage.resourceType,
    );
  }

  return { success: true };
}
