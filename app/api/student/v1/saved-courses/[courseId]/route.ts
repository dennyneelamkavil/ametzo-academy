import { NextRequest, NextResponse } from "next/server";
import { requireStudentAuth } from "@/server/auth/studentAuth";
import {
  addToSavedCourses,
  removeFromSavedCourses,
} from "@/server/student/saved-courses/saved-courses.service";
import { handleApiError } from "@/server/errors/handleApiError";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  try {
    const { courseId } = await params;
    const auth = await requireStudentAuth(req);

    return NextResponse.json(
      await addToSavedCourses(auth.studentId, courseId),
      {
        status: 201,
      },
    );
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  try {
    const { courseId } = await params;
    const auth = await requireStudentAuth(req);

    return NextResponse.json(
      await removeFromSavedCourses(auth.studentId, courseId),
    );
  } catch (err) {
    return handleApiError(err);
  }
}
