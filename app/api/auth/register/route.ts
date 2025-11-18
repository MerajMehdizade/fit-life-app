import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { hashPassword, signToken } from "@/lib/auth";

export async function POST(req: Request) {
  await dbConnect();
  const { name, email, password } = await req.json();

  const existingUser = await User.findOne({ email });
  if (existingUser) return NextResponse.json({ message: "User already exists" }, { status: 400 });

  const hashedPassword = await hashPassword(password);

  const user = await User.create({ name, email, password: hashedPassword });
  const token = signToken(user._id);

  return NextResponse.json({ token, user: { id: user._id, name: user.name, email: user.email } });
}
