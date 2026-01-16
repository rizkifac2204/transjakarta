import { NextResponse } from "next/server";
import { verifyAuth } from "@/libs/jwt";
import { parseFormData } from "@/utils/parseFormData";
import uploadservices from "@/services/uploadservices";

export async function POST(request) {
  try {
    const token = await verifyAuth(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { files } = await parseFormData(request);

    if (!files.photo) {
      return NextResponse.json(
        { error: "No photo file provided" },
        { status: 400 }
      );
    }

    const file = files.photo[0];
    const path = `uploads/survey-answers/`;
    const uploadedFile = await uploadservices.uploadImage(file, path);

    if (uploadedFile.url) {
      return NextResponse.json({
        message: "File uploaded successfully",
        url: uploadedFile.url,
      });
    } else {
      return NextResponse.json(
        { error: "File upload failed", details: uploadedFile.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
