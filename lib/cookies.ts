import { NextResponse } from "next/server";
import { serialize } from "cookie";

/**
 * Helperهای مرکزی برای ست/حذف کوکی token.
 * این helper طوری طراحی شده که هم برای NextResponse.cookies.set
 * و هم برای header Set-Cookie خروجی داشته باشد تا در هر runtime کار کند.
 */

const TOKEN_NAME = "token";

export const setTokenCookie = (res: NextResponse, token: string, opts?: { maxAge?: number }) => {
  const maxAge = opts?.maxAge ?? 60 * 60 * 24 * 7; // 7 روز
  const cookie = serialize(TOKEN_NAME, token, {
    httpOnly: true,
    path: "/",
    maxAge,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  try {
    // next runtime support
    // @ts-ignore
    if (res?.cookies && typeof res.cookies.set === "function") {
      res.cookies.set({
        name: TOKEN_NAME,
        value: token,
        httpOnly: true,
        path: "/",
        maxAge,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });
    } else {
      res.headers.set("Set-Cookie", cookie);
    }
  } catch {
    // fallback to header
    res.headers.set("Set-Cookie", cookie);
  }
};

// remove cookie (applies to NextResponse)
export const removeTokenCookie = (res: NextResponse) => {
  const cookie = serialize(TOKEN_NAME, "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  try {
    if (res?.cookies && typeof res.cookies.set === "function") {
      res.cookies.set({
        name: TOKEN_NAME,
        value: "",
        httpOnly: true,
        path: "/",
        expires: new Date(0),
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });
      // some runtimes prefer also a header
      res.headers.set("Set-Cookie", cookie);
    } else {
      res.headers.set("Set-Cookie", cookie);
    }
  } catch {
    res.headers.set("Set-Cookie", cookie);
  }
};

// helper that returns header-string (اگر خواستی فقط header بذاری)
export const removeTokenCookieHeader = () => {
  return serialize(TOKEN_NAME, "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
};
