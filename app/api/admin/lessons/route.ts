import { NextResponse } from "next/server";
import { requirePermission } from "@/server/auth/rbac";
import { createLesson, listLessons } from "@/server/lesson/lesson.service";
import { CreateLessonSchema } from "@/server/lesson/lesson.validation";
import { handleApiError } from "@/server/errors/handleApiError";

export async function POST(req: Request) {
  try {
    await requirePermission("lesson:create");

    const body = await req.json();
    const parsed = CreateLessonSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const lesson = await createLesson(parsed.data);
    return NextResponse.json(lesson, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function GET(req: Request) {
  try {
    await requirePermission("lesson:read");

    const { searchParams } = new URL(req.url);

    const all = searchParams.get("all") === "true";
    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 10);
    const search = searchParams.get("search") ?? undefined;
    const sortBy = searchParams.get("sortBy") ?? undefined;
    const sortDir = searchParams.get("sortDir") ?? undefined;
    const course = searchParams.get("course") ?? undefined;

    const lessons = await listLessons({
      page,
      limit,
      search,
      all,
      sortBy,
      sortDir,
      course,
    });

    return NextResponse.json(lessons);
  } catch (err) {
    return handleApiError(err);
  }
}
