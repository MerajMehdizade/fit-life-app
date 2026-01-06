import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import WaterIntake from "@/models/WaterIntake";
import { getCurrentUser } from "@/lib/auth";

const today = () => new Date().toISOString().slice(0, 10);

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();

  const record = await WaterIntake.findOne({
    user: user._id,
    date: today(),
  });

  return NextResponse.json({
    filledGlasses: record?.filledGlasses ?? 0,
    targetWater: record?.targetWater ?? null,
  });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { filledGlasses, targetWater } = await req.json();

  await dbConnect();

  const record = await WaterIntake.findOneAndUpdate(
    { user: user._id, date: today() },
    { filledGlasses, targetWater },
    { upsert: true, new: true }
  );

  return NextResponse.json({ success: true, record });
}
