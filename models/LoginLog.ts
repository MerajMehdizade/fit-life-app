import mongoose, { Schema } from "mongoose";

const loginLogSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: { type: String, required: true },
    ip: { type: String },
    userAgent: { type: String },
  },
  { timestamps: true }
);

const LoginLog = mongoose.models.LoginLog || mongoose.model("LoginLog", loginLogSchema);
export default LoginLog;
