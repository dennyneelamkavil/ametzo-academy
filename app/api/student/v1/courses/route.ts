import { NextRequest, NextResponse } from "next/server";

import { listStudentCourses } from "@/server/student/course/course.service";
import { requireStudentAuth } from "@/server/auth/studentAuth";
import { handleApiError } from "@/server/errors/handleApiError";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 10);

    const search = searchParams.get("search") ?? undefined;
    const category = searchParams.get("category") ?? undefined;

    let studentId: string | undefined;

    try {
      const auth = await requireStudentAuth(req);
      studentId = auth.studentId;
    } catch {
      // ignore → allow guest browsing
    }

    return NextResponse.json(
      await listStudentCourses({
        page,
        limit,
        search,
        category,
        studentId,
      }),
    );
  } catch (err) {
    return handleApiError(err);
  }
}
