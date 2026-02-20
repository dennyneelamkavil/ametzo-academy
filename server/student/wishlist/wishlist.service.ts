import "server-only";

import { connectDB } from "@/server/db";
import { StudentModel } from "@/server/models/student.model";
import { AppError } from "@/server/errors/AppError";
import { mapWishlistProduct } from "./wishlist.mapper";

export async function listWishlist(studentId: string) {
  await connectDB();

  const student = await StudentModel.findById(studentId)
    .populate("wishlist")
    .lean();

  if (!student) throw new AppError("Student not found", 404);

  return student.wishlist.map(mapWishlistProduct);
}

export async function addToWishlist(studentId: string, productId: string) {
  await connectDB();

  const student = await StudentModel.findById(studentId);
  if (!student) throw new AppError("Student not found", 404);

  if (!student.wishlist.includes(productId as any)) {
    student.wishlist.push(productId as any);
    await student.save();
  }

  return { success: true };
}

export async function removeFromWishlist(
  studentId: string,
  productId: string,
) {
  await connectDB();

  const student = await StudentModel.findById(studentId);
  if (!student) throw new AppError("Student not found", 404);

  student.wishlist = student.wishlist.filter(
    (id: (typeof student.wishlist)[number]) => id.toString() !== productId,
  );

  await student.save();

  return { success: true };
}
