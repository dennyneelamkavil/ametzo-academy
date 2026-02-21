import { NextRequest, NextResponse } from "next/server";

import { getStudentCourseDetail } from "@/server/student/course/course.service";
import { requireStudentAuth } from "@/server/auth/studentAuth";
import { handleApiError } from "@/server/errors/handleApiError";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    let studentId: string | undefined;

    try {
      const auth = await requireStudentAuth(req);
      studentId = auth.studentId;
    } catch {}

    return NextResponse.json(await getStudentCourseDetail(slug, studentId));
  } catch (err) {
    return handleApiError(err);
  }
}
