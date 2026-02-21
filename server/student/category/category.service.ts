import "server-only";

import { connectDB } from "@/server/db";
import { CategoryModel } from "@/server/models/category.model";
import { CourseModel } from "@/server/models/course.model";
import { AppError } from "@/server/errors/AppError";

import {
  mapCategoryDetail,
  mapCategoryForStudentList,
} from "./category.mapper";

export async function listStudentCategories() {
  await connectDB();

  const categories = await CategoryModel.find({
    isActive: true,
  })
    .sort({ createdAt: -1 })
    .lean();

  return {
    data: categories.map(mapCategoryForStudentList),
  };
}

export async function getStudentCategoryDetail(slug: string) {
  await connectDB();

  const category = await CategoryModel.findOne({
    slug,
    isActive: true,
  }).lean();

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  const courses = await CourseModel.find({
    category: category._id,
    isPublished: true,
  })
    .sort({ createdAt: -1 })
    .select("_id title slug image durationHours price")
    .lean();

  return mapCategoryDetail(category, courses);
}
