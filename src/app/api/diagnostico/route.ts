import { NextResponse } from "next/server";
import { urlBucket } from "@/lib/datos/url";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    envSupabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? null,
    ejemploUrl: urlBucket("migradas/8062f5df-2eed-4c27-8e6e-da8138478fe4.png"),
  });
}
