import { NextRequest, NextResponse } from "next/server";
import { requireStudentAuth } from "@/server/auth/studentAuth";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/server/student/wishlist/wishlist.service";
import { handleApiError } from "@/server/errors/handleApiError";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> },
) {
  try {
    const { productId } = await params;
    const auth = await requireStudentAuth(req);

    return NextResponse.json(await addToWishlist(auth.studentId, productId), {
      status: 201,
    });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> },
) {
  try {
    const { productId } = await params;
    const auth = await requireStudentAuth(req);

    return NextResponse.json(
      await removeFromWishlist(auth.studentId, productId),
    );
  } catch (err) {
    return handleApiError(err);
  }
}
