import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { comparePassword, signToken } from "@/lib/auth";

export async function POST(req: Request) {
  await dbConnect();
  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  if (!user) return NextResponse.json({ message: "Invalid credentials" }, { status: 400 });

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) return NextResponse.json({ message: "Invalid credentials" }, { status: 400 });

  const token = signToken(user._id);

  return NextResponse.json({ token, user: { id: user._id, name: user.name, email: user.email } });
}
