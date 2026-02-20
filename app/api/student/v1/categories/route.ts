import { NextResponse } from "next/server";
import { listStudentCategories } from "@/server/student/category/category.service";
import { handleApiError } from "@/server/errors/handleApiError";

export async function GET() {
  try {
    return NextResponse.json(await listStudentCategories());
  } catch (err) {
    return handleApiError(err);
  }
}
