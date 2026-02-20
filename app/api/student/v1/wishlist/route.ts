import { NextResponse } from "next/server";
import { requireStudentAuth } from "@/server/auth/studentAuth";
import { listWishlist } from "@/server/student/wishlist/wishlist.service";
import { handleApiError } from "@/server/errors/handleApiError";

export async function GET(req: Request) {
  try {
    const auth = await requireStudentAuth(req);

    return NextResponse.json(await listWishlist(auth.studentId));
  } catch (err) {
    return handleApiError(err);
  }
}
