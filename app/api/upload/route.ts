import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { requireSession } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
const ALLOWED_FILE_TYPES = new Set([
  "image/jpeg", "image/png", "image/webp", "application/pdf",
  "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "video/mp4", "video/quicktime", "video/webm"
]);

export async function POST(request: Request) {
  const auth = await requireSession(["ADMIN", "TEACHER"]);
  if (auth.error) return auth.error;
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No se proporcionó ningún archivo" }, { status: 400 });
    }
    if (!ALLOWED_FILE_TYPES.has(file.type)) {
      return NextResponse.json({ error: "Formato de archivo no permitido." }, { status: 415 });
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: "La imagen supera el límite de 8 MB." }, { status: 413 });
    }

    const accountId = process.env.R2_ACCOUNT_ID;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    const bucketName = process.env.R2_BUCKET_NAME;
    const publicUrl = process.env.R2_PUBLIC_URL;

    // Missing storage credentials are a configuration error; never place image data in the database.
    if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
      return NextResponse.json({ 
        error: "R2_MISSING",
        message: "El almacenamiento de imágenes no está configurado. Contacta al administrador."
      }, { status: 503 });
    }

    const s3 = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    // Safe filename
    const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const contentType = file.type || "application/octet-stream";

    await s3.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: safeName,
        Body: fileBuffer,
        ContentType: contentType,
      })
    );

    // Build the public image address
    const cleanPublicUrl = publicUrl?.endsWith("/") ? publicUrl.slice(0, -1) : publicUrl;
    const url = cleanPublicUrl
      ? `${cleanPublicUrl}/${safeName}`
      : `https://${bucketName}.${accountId}.r2.dev/${safeName}`;

    return NextResponse.json({ success: true, url });
  } catch (error: unknown) {
    console.error("Cloudflare R2 Upload Error:", error);
    return NextResponse.json({ 
      error: "R2_UPLOAD_FAILED", 
      message: error instanceof Error ? error.message : "Error al subir archivo a R2"
    }, { status: 500 });
  }
}
