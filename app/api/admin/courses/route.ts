import { NextResponse } from "next/server";
import { requirePermission } from "@/server/auth/rbac";
import { createCourse, listCourses } from "@/server/course/course.service";
import { CreateCourseSchema } from "@/server/course/course.validation";
import { handleApiError } from "@/server/errors/handleApiError";

export async function POST(req: Request) {
  try {
    await requirePermission("course:create");

    const body = await req.json();
    const parsed = CreateCourseSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const course = await createCourse(parsed.data);
    return NextResponse.json(course, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function GET(req: Request) {
  try {
    await requirePermission("course:read");

    const { searchParams } = new URL(req.url);

    const all = searchParams.get("all") === "true";
    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 10);
    const search = searchParams.get("search") ?? undefined;
    const sortBy = searchParams.get("sortBy") ?? undefined;
    const sortDir = searchParams.get("sortDir") ?? undefined;
    const isPublished = searchParams.get("isPublished") ?? undefined;

    const courses = await listCourses({
      page,
      limit,
      search,
      all,
      sortBy,
      sortDir,
      isPublished,
    });

    return NextResponse.json(courses);
  } catch (err) {
    return handleApiError(err);
  }
}
