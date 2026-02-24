import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/server/auth/rbac";
import {
  getLessonById,
  updateLesson,
  deleteLesson,
} from "@/server/lesson/lesson.service";
import { UpdateLessonSchema } from "@/server/lesson/lesson.validation";
import { handleApiError } from "@/server/errors/handleApiError";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await requirePermission("lesson:read");
    return NextResponse.json(await getLessonById(params.id));
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await requirePermission("lesson:update");

    const body = await request.json();
    const parsed = UpdateLessonSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }

    return NextResponse.json(await updateLesson(params.id, parsed.data));
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await requirePermission("lesson:delete");
    await deleteLesson(params.id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return handleApiError(err);
  }
}
