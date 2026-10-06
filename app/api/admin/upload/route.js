import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    
    // Support multiple files from "files" or single "file"
    let files = formData.getAll("files");
    if (!files || files.length === 0) {
      const single = formData.get("file");
      if (single) files = [single];
    }

    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
    }

    const uploadedUrls = [];

    for (const file of files) {
      if (!file || typeof file === "string") continue;
      
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      let fileUrl = null;

      if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
        try {
          const result = await uploadToCloudinary(buffer, "nivora/products");
          fileUrl = result.secure_url;
        } catch (cloudErr) {
          console.warn("Cloudinary upload failed, falling back to data URL:", cloudErr?.message || cloudErr);
          const mime = file.type || "image/jpeg";
          fileUrl = `data:${mime};base64,${buffer.toString("base64")}`;
        }
      } else {
        const mime = file.type || "image/jpeg";
        fileUrl = `data:${mime};base64,${buffer.toString("base64")}`;
      }

      if (fileUrl) {
        uploadedUrls.push(fileUrl);
      }
    }

    return NextResponse.json({
      success: true,
      url: uploadedUrls[0] || null,
      urls: uploadedUrls,
    });
  } catch (error) {
    console.error("POST /api/admin/upload error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to upload file" },
      { status: 500 }
    );
  }
}
