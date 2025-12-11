import LoginLog from "@/models/LoginLog";
import AuditLog from "@/models/AuditLog";
import dbConnect from "@/lib/db";

// ثبت لاگ ورود
export async function logLogin({ user, ip, userAgent }: any) {
  await dbConnect();
  await LoginLog.create({
    userId: user._id,
    role: user.role,
    ip,
    userAgent,
  });
}

// ثبت لاگ تغییر توسط ادمین
export async function logAdminAction({ adminId, targetUserId, action, description }: any) {
  await dbConnect();
  await AuditLog.create({
    adminId,
    targetUserId,
    action,
    description,
  });
}
