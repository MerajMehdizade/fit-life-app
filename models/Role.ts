import mongoose, { Schema } from "mongoose";

const RoleSchema = new Schema(
  {
    name: { type: String, required: true, unique: true }, // e.g. manager, supervisor

    permissions: [
      {
        type: String, // e.g. "users.edit"
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Role || mongoose.model("Role", RoleSchema);
