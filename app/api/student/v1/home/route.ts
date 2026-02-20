import { NextResponse } from "next/server";
import { getHomeData } from "@/server/student/home/home.service";
import { handleApiError } from "@/server/errors/handleApiError";

export async function GET() {
  try {
    return NextResponse.json(await getHomeData());
  } catch (err) {
    return handleApiError(err);
  }
}
