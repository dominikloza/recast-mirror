import { getProductBySlug, getVtonCategory } from "@/lib/products";
import { replicate, uploadImageToReplicate, VTON_MODEL_VERSION } from "@/lib/replicate";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_PHOTO_BYTES = 8 * 1024 * 1024;

export async function POST(request: Request) {
  const formData = await request.formData();
  const photo = formData.get("photo");
  const slug = formData.get("slug");

  if (!(photo instanceof File) || typeof slug !== "string") {
    return NextResponse.json({ error: "Missing photo or product." }, { status: 400 });
  }
  if (!photo.type.startsWith("image/")) {
    return NextResponse.json({ error: "That doesn't look like an image." }, { status: 400 });
  }
  if (photo.size > MAX_PHOTO_BYTES) {
    return NextResponse.json({ error: "Photo is too large (max 8MB)." }, { status: 400 });
  }

  const product = await getProductBySlug(slug);
  const vtonCategory = product ? getVtonCategory(product.category) : null;
  if (!product || !vtonCategory || !product.image_url) {
    return NextResponse.json({ error: "This product can't be tried on." }, { status: 400 });
  }

  try {
    const humanBytes = Buffer.from(await photo.arrayBuffer());
    const garmentBytes = await readFile(
      path.join(process.cwd(), "public", product.image_url),
    );

    const [humanImg, garmImg] = await Promise.all([
      uploadImageToReplicate(humanBytes, "human.jpg"),
      uploadImageToReplicate(garmentBytes, "garment.webp"),
    ]);

    const prediction = await replicate.predictions.create({
      version: VTON_MODEL_VERSION,
      input: {
        human_img: humanImg,
        garm_img: garmImg,
        garment_des: product.name,
        category: vtonCategory,
      },
    });

    return NextResponse.json({ predictionId: prediction.id });
  } catch (err) {
    console.error("fitting-room create failed", err);
    return NextResponse.json({ error: "Could not start the preview." }, { status: 502 });
  }
}
