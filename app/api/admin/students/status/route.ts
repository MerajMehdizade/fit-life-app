import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { verifyAdmin } from "@/lib/auth";
import { SortOrder } from "mongoose";

export async function GET(req: Request) {
  try {
    await dbConnect();

    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 4
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort");

    const query: any = { role: "student" };

    // 🔍 Search (name / email)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // ↕️ Sort
    const sortOption: Record<string, SortOrder> | undefined =
      sort === "asc"
        ? { name: 1 }
        : sort === "desc"
        ? { name: -1 }
        : undefined;

    const total = await User.countDocuments(query);

    const students = await User.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit)
      .select("_id name email status assignedCoach trainingPlan dietPlan")
      .populate("assignedCoach", "name");

    const formatted = students.map((s: any) => ({
      _id: s._id.toString(),
      name: s.name,
      email: s.email,
      status: s.status,
      coachName: s.assignedCoach?.name || "بدون مربی",
       hasCoach: !!s.assignedCoach,
      plansCount:
        (s.trainingPlan ? 1 : 0) +
        (s.dietPlan ? 1 : 0),
    }));

    return NextResponse.json({
      students: formatted,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        total,
        limit,
      },
    });
  } catch (err) {
    console.error("GET STUDENTS ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
