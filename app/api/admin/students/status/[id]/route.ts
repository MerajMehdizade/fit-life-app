import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { verifyAdmin } from "@/lib/auth";

export async function PATCH(req: Request, { params }: any) {
  await dbConnect();

  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { id } = params;

  const student = await User.findById(id);
  if (!student || student.role !== "student") {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }

  student.status = student.status === "active" ? "suspended" : "active";
  await student.save();

  return NextResponse.json({
    success: true,
    status: student.status,
  });
}
