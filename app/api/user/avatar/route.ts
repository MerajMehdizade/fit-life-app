import { writeFile } from "fs/promises";
import path from "path";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: { formData: () => any; }) {
  const user = await getCurrentUser();
  if (!user)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.formData();
  const file = data.get("avatar");
  if (!file)
    return Response.json({ error: "No file" }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const fileName = `${user._id}-${Date.now()}-${file.name}`;
  const savePath = path.join(process.cwd(), "public/uploads", fileName);

  await writeFile(savePath, buffer);

  await connectDB();
  await User.findByIdAndUpdate(user._id, {
    avatar: `/uploads/${fileName}`,
  });

  return Response.json({ success: true, avatar: `/uploads/${fileName}` });
}
