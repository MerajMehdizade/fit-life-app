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
    const limit = 4;
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort");

    const query: any = { role: "coach" };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const sortOption: Record<string, SortOrder> | undefined =
      sort === "asc"
        ? { name: 1 }
        : sort === "desc"
          ? { name: -1 }
          : undefined;


    const total = await User.countDocuments(query);

    const coaches = await User.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit)
      .select("_id name email status students avatar");

    const formatted = coaches.map((c: any) => ({
      _id: c._id.toString(),
      name: c.name,
      email: c.email,
      status: c.status,
      studentsCount: c.students?.length || 0,
      avatar: c.avatar || "/avatars/default.jpg",
    }));

    return NextResponse.json({
      coaches: formatted,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (err) {
    console.error("GET ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
