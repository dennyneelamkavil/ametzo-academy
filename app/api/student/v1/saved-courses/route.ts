import { NextResponse } from "next/server";
import { requireStudentAuth } from "@/server/auth/studentAuth";
import { listSavedCourses } from "@/server/student/saved-courses/saved-courses.service";
import { handleApiError } from "@/server/errors/handleApiError";

export async function GET(req: Request) {
  try {
    const auth = await requireStudentAuth(req);

    return NextResponse.json(await listSavedCourses(auth.studentId));
  } catch (err) {
    return handleApiError(err);
  }
}
