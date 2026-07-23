import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No se proporcionó ningún archivo" }, { status: 400 });
    }

    const accountId = process.env.R2_ACCOUNT_ID;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    const bucketName = process.env.R2_BUCKET_NAME;
    const publicUrl = process.env.R2_PUBLIC_URL;

    // Check credentials, if missing return mock mode message so client falls back gracefully
    if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
      return NextResponse.json({ 
        error: "R2_MISSING",
        message: "Variables de entorno de Cloudflare R2 no configuradas. Usando almacenamiento temporal base64."
      }, { status: 200 });
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
  } catch (error: any) {
    console.error("Cloudflare R2 Upload Error:", error);
    return NextResponse.json({ 
      error: "R2_UPLOAD_FAILED", 
      message: error.message || "Error al subir archivo a R2" 
    }, { status: 500 });
  }
}
