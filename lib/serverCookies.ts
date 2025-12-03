// lib/serverCookies.ts
import { cookies } from "next/headers";

type ReadonlyStore = Awaited<ReturnType<typeof cookies>>; // کمک تایپینگ

export async function getCookieValue(name: string): Promise<string | undefined> {
  // ممکنه cookies() sync یا async باشه — runtime check
  const maybe = cookies() as unknown;
  let store: ReadonlyStore;

  // اگر Promise باشه await کن
  if (maybe && typeof (maybe as any).then === "function") {
    store = await (maybe as any);
  } else {
    store = maybe as ReadonlyStore;
  }

  // بعضی ورژن‌ها ممکنه get نباشه — پس چک کن
  const getter = (store as any)?.get;
  if (typeof getter === "function") {
    return (store as any).get(name)?.value;
  }

  // fallback: اگر ساختار دیگری داشت (نادر)، تلاش کن با access مستقیم
  try {
    // @ts-ignore
    return (store as any)[name] ?? undefined;
  } catch {
    return undefined;
  }
}
