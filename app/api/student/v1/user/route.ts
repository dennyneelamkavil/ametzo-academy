import { NextResponse } from "next/server";
import { requireStudentAuth } from "@/server/auth/studentAuth";
import { getCurrentStudent } from "@/server/student/user/user.service";
import { handleApiError } from "@/server/errors/handleApiError";

export async function GET(req: Request) {
  try {
    const auth = await requireStudentAuth(req);

    return NextResponse.json(await getCurrentStudent(auth.studentId));
  } catch (err) {
    return handleApiError(err);
  }
}
