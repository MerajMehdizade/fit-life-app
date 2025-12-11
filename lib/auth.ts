// lib/auth.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import dbConnect from "./db";
import User from "@/models/User";

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hashed: string) => {
  return bcrypt.compare(password, hashed);
};


export const signToken = (user: any) => {
  const userId =
    typeof user === "string"
      ? user
      : user?._id?.toString() ?? user?.id ?? user?.userId;

  const payload = {
    userId,
    role: user?.role,
    email: user?.email,
  };

  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is missing!");

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const verifyToken = (token: string) => {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is missing!");

  return jwt.verify(token, process.env.JWT_SECRET) as {
    userId: string;
    role: string;
    email: string;
  };
};


export const verifyAdmin = async () => {
  await dbConnect();

  const cookieStore = await cookies(); 
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  try {
    const decoded = verifyToken(token);
    if (!decoded?.userId) return null;

    const user = await User.findById(decoded.userId).select(
      "role name email"
    );

    if (!user) return null;
    if (user.role !== "admin") return null;

    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };
  } catch {
    return null;
  }
};
