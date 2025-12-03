import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
  await dbConnect();

  const cookie = req.headers.get("cookie") || "";
  const token = cookie.split("token=")?.[1]?.split(";")?.[0];

  if (!token) return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });

  const payload = verifyToken(token);
  if (!payload || payload.role !== "admin")
    return NextResponse.json({ msg: "Forbidden" }, { status: 403 });

  const users = await User.find().lean();
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  await dbConnect();

  const cookie = req.headers.get("cookie") || "";
  const token = cookie.split("token=")?.[1]?.split(";")?.[0];

  if (!token) return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });

  const payload = verifyToken(token);
  if (!payload || payload.role !== "admin")
    return NextResponse.json({ msg: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const user = await User.create(body);

  return NextResponse.json(user);
}
