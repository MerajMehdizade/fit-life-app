import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { verifyAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await dbConnect();

    const admin = await verifyAdmin();
    if (!admin)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const coaches = await User.find({ role: "coach" })
      .select("_id name email status students");

    const formatted = coaches.map((c: any) => ({
      _id: c._id.toString(),
      name: c.name,
      email: c.email,
      status: c.status,
      studentsCount: c.students?.length || 0,
    }));

    return NextResponse.json({ coaches: formatted });
  } catch (err) {
    console.error("GET ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
