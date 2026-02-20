import { NextRequest, NextResponse } from "next/server";
import { getStudentCategoryDetail } from "@/server/student/category/category.service";
import { handleApiError } from "@/server/errors/handleApiError";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    return NextResponse.json(await getStudentCategoryDetail(slug));
  } catch (err) {
    return handleApiError(err);
  }
}
