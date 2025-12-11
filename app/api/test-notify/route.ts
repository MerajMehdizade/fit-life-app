// app/api/test/route.ts
import notify from "@/lib/notify";

export async function GET() {
  await notify({
    userId: "692b6096fe0b618e5dd4e937",
    title: "سلام از پشر!",
    message: "این یک تست realtime هست 🎉",
  });

  return Response.json({ ok: true });
}
