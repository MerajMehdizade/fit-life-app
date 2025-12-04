import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { adminGuard } from "@/lib/authGuard";

export async function GET(req: Request) {
  await dbConnect();
  await adminGuard();

  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 10);
  const search = searchParams.get("search") || "";
  const role = searchParams.get("role") || "";

  const query: any = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } }
    ];
  }

  if (role && role !== "all") {
    query.role = role;
  }

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    User.find(query).skip(skip).limit(limit).lean(),
    User.countDocuments(query)
  ]);

  return NextResponse.json({
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
}
