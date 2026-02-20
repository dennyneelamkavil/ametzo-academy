import { NextResponse } from "next/server";
import { CompleteProfileSchema } from "@/server/student/auth/auth.validation";
import { completeProfile } from "@/server/student/auth/auth.service";
import { requireStudentAuth } from "@/server/auth/studentAuth";
import { handleApiError } from "@/server/errors/handleApiError";

export async function POST(req: Request) {
  try {
    const auth = await requireStudentAuth(req);

    const body = await req.json();
    const parsed = CompleteProfileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }

    return NextResponse.json(
      await completeProfile(auth.studentId, parsed.data),
    );
  } catch (err) {
    return handleApiError(err);
  }
}
