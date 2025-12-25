import { put } from "@vercel/blob";
import { writeFile } from "fs/promises";
import path from "path";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.formData();
  const file = data.get("avatar") as File;
  if (!file)
    return NextResponse.json({ error: "No file" }, { status: 400 });


  const isLocal = process.env.NODE_ENV === "development";

  let avatarUrl = "";

  if (isLocal) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = file.type.split("/")[1] || "png";
    const fileName = `${user._id}-${Date.now()}.${ext}`;
    const savePath = path.join(process.cwd(), "public/uploads", fileName);

    await writeFile(savePath, buffer);
    avatarUrl = `/uploads/${fileName}`;
  } else {
    const ext = file.type.split("/")[1] || "png";
    const fileName = `avatars/${user._id}-${Date.now()}.${ext}`;
    const blob = await put(fileName, file, { access: "public" });
    avatarUrl = blob.url;
  }

  await connectDB();
  await User.findByIdAndUpdate(user._id, { avatar: avatarUrl });

  return NextResponse.json({ success: true, avatar: avatarUrl });
}
