import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Setting from "@/models/Setting"; // مدل MongoDB تنظیمات
import { verifyAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await dbConnect();
    const admin = await verifyAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const settings = await Setting.findOne({ key: "general" });
    return NextResponse.json(settings?.value || {});
  } catch (err) {
    console.error("Load general settings error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const admin = await verifyAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const appName = formData.get("appName") as string;
    const primaryColor = formData.get("primaryColor") as string;
    const textColor = formData.get("textColor") as string;
    const language = formData.get("language") as string;
    const timeZone = formData.get("timeZone") as string;

    // فایل‌ها
    const logoFile = formData.get("logo") as File | null;
    const faviconFile = formData.get("favicon") as File | null;

    const settingsValue: any = {
      appName,
      primaryColor,
      textColor,
      language,
      timeZone,
    };

    // ذخیره مسیر فایل‌ها (می‌تونی S3 یا public/upload استفاده کنی)
    if (logoFile && logoFile.name) settingsValue.logo = `/uploads/${logoFile.name}`;
    if (faviconFile && faviconFile.name) settingsValue.favicon = `/uploads/${faviconFile.name}`;

    await Setting.updateOne(
      { key: "general" },
      { $set: { value: settingsValue } },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Save general settings error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
