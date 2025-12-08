import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { verifyAdmin } from "@/lib/auth";

export async function PATCH(req: Request, context: any) {
  try {
    await dbConnect();

    // params یک Promise هست → باید await شود
    const { id } = await context.params;

    const admin = await verifyAdmin();
    if (!admin)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const student = await User.findById(id);

    if (!student)
      return NextResponse.json({ error: "Student not found" }, { status: 404 });

    // وضعیت جدید
    const newStatus =
      student.status === "active" ? "suspended" : "active";

    student.status = newStatus;
    await student.save();

    return NextResponse.json({ success: true, status: newStatus });
  } catch (err) {
    console.error("PATCH STUDENT ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
