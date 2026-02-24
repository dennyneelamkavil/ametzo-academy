import { NextRequest, NextResponse } from "next/server";

import { requireStudentAuth } from "@/server/auth/studentAuth";
import { getStudentLesson } from "@/server/student/lesson/lesson.service";
import { handleApiError } from "@/server/errors/handleApiError";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { studentId } = await requireStudentAuth(req);

    return NextResponse.json(await getStudentLesson(id, studentId));
  } catch (err) {
    return handleApiError(err);
  }
}
