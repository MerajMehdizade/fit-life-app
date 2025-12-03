// lib/getUser.ts
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export type CurrentUser = {
  id?: string;
  role?: string;
  [key: string]: any;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    // در بعضی نسخه‌ها cookies() یک Promise برمی‌گرداند، پس await کن
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    // decoded ممکن است object یا string باشد؛ فرض می‌کنیم object
    if (typeof decoded === "object") return decoded as CurrentUser;
    return null;
  } catch (err) {
    // توکن نامعتبر یا خطای دیگری پیش آمده
    return null;
  }
}
