import { put } from "@vercel/blob";
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

  const ext = file.type.split("/")[1];
  const fileName = `avatars/${user._id}-${Date.now()}.${ext}`;

  const blob = await put(fileName, file, { access: "public" });

  await connectDB();
  await User.findByIdAndUpdate(user._id, {
    avatar: blob.url,
  });

  return NextResponse.json({ success: true, avatar: blob.url });
}
