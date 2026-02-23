import { NextRequest, NextResponse } from "next/server";

import { requireStudentAuth } from "@/server/auth/studentAuth";
import { getStudentLesson } from "@/server/student/lesson/lesson.service";
import { handleApiError } from "@/server/errors/handleApiError";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { studentId } = await requireStudentAuth(req);

    return NextResponse.json(await getStudentLesson(params.id, studentId));
  } catch (err) {
    return handleApiError(err);
  }
}
