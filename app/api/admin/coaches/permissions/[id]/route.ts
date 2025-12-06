import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { adminGuard } from "@/lib/authGuard";

export async function POST(req: Request, context: any) {
  await dbConnect();
  await adminGuard();

  const { id } = context.params;
  const { permissions } = await req.json();

  if (!Array.isArray(permissions)) {
    return NextResponse.json(
      { error: "Invalid permissions format" },
      { status: 400 }
    );
  }

  const coach = await User.findById(id);

  if (!coach || coach.role !== "coach") {
    return NextResponse.json(
      { error: "Coach not found" },
      { status: 404 }
    );
  }

  coach.permissions = permissions;
  await coach.save();

  return NextResponse.json({ message: "Permissions updated" });
}
