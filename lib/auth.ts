// lib/auth.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hashed: string) => {
  return bcrypt.compare(password, hashed);
};

// signToken را طوری می‌سازیم که یا user object یا id رشته‌ای بپذیرد
export const signToken = (user: any) => {
  // اگر user یک شیء mongoose است ممکن است _id داشته باشد
  const userId =
    typeof user === "string"
      ? user
      : user && (user._id ? user._id.toString() : user.id || user.userId);

  const payload = {
    userId,
    role: user?.role ?? undefined,
    email: user?.email ?? undefined,
  };

  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not defined");

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// verifyToken همان payload را برمی‌گرداند (و هر جا از userId استفاده شود سازگار است)
export const verifyToken = (token: string): any => {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not defined");
  return jwt.verify(token, process.env.JWT_SECRET);
};
