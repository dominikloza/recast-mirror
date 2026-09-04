import { replicate } from "@/lib/replicate";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const prediction = await replicate.predictions.get(id);
    const output = Array.isArray(prediction.output)
      ? prediction.output[0]
      : prediction.output;

    return NextResponse.json({
      status: prediction.status,
      output: prediction.status === "succeeded" ? output : null,
      error: prediction.status === "failed" ? String(prediction.error) : null,
    });
  } catch (err) {
    console.error("fitting-room status failed", err);
    return NextResponse.json({ status: "failed", error: "Lost track of the preview." });
  }
}
