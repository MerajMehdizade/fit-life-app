import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { adminGuard } from "@/lib/authGuard";

export async function GET() {
  await dbConnect();
  await adminGuard();

  const coaches = await User.find({ role: "coach" })
    .select("name email permissions");

  return NextResponse.json(coaches);
}
