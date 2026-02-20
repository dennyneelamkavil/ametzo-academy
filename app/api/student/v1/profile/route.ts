import { NextResponse } from "next/server";
import { requireStudentAuth } from "@/server/auth/studentAuth";
import { UpdateProfileSchema } from "@/server/student/user/user.validation";
import { updateProfile } from "@/server/student/user/user.service";
import { handleApiError } from "@/server/errors/handleApiError";

export async function PUT(req: Request) {
  try {
    const auth = await requireStudentAuth(req);

    const body = await req.json();
    const parsed = UpdateProfileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }

    return NextResponse.json(await updateProfile(auth.studentId, parsed.data));
  } catch (err) {
    return handleApiError(err);
  }
}
