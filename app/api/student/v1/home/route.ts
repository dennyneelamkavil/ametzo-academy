import { NextRequest, NextResponse } from "next/server";

import { requireStudentAuth } from "@/server/auth/studentAuth";
import { getStudentHome } from "@/server/student/home/home.service";
import { handleApiError } from "@/server/errors/handleApiError";

export async function GET(req: NextRequest) {
  try {
    const { studentId } = await requireStudentAuth(req);

    return NextResponse.json(await getStudentHome(studentId));
  } catch (err) {
    return handleApiError(err);
  }
}
