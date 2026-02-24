import { NextRequest, NextResponse } from "next/server";

import { requireStudentAuth } from "@/server/auth/studentAuth";
import { completeStudentLesson } from "@/server/student/lesson/lesson.service";
import { handleApiError } from "@/server/errors/handleApiError";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { studentId } = await requireStudentAuth(req);

    return NextResponse.json(await completeStudentLesson(id, studentId));
  } catch (err) {
    return handleApiError(err);
  }
}
