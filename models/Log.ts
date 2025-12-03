import mongoose, { Schema } from "mongoose";

const LogSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    action: { type: String, required: true }, // e.g. "create_user"
    details: { type: Object, default: {} }, // dynamic JSON
    ip: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Log || mongoose.model("Log", LogSchema);
