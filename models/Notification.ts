import mongoose, { Schema, models, model } from "mongoose";

const NotificationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: { type: String, required: true },
  message: { type: String },
  type: { type: String, enum: ["info", "warning", "success", "error"], default: "info" },
  data: { type: Object, default: {} },
  isRead: { type: Boolean, default: false },

  meta: {
    actorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    actorName: String,
    action: String,
    targetId: { type: mongoose.Schema.Types.ObjectId },
  },
  createdAt: { type: Date, default: Date.now },
});

export default models.Notification || model("Notification", NotificationSchema);
