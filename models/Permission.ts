import mongoose, { Schema } from "mongoose";

const PermissionSchema = new Schema(
  {
    key: { type: String, required: true, unique: true }, // "users.create"
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Permission ||
  mongoose.model("Permission", PermissionSchema);
