import { NextRequest, NextResponse } from "next/server";

import { requireStudentAuth } from "@/server/auth/studentAuth";
import { completeStudentLesson } from "@/server/student/lesson/lesson.service";
import { handleApiError } from "@/server/errors/handleApiError";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { studentId } = await requireStudentAuth(req);

    return NextResponse.json(await completeStudentLesson(params.id, studentId));
  } catch (err) {
    return handleApiError(err);
  }
}
