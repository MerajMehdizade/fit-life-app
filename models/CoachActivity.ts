import mongoose, { Schema } from "mongoose";

const coachActivitySchema = new Schema(
  {
    coachId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    programsCreated: { type: Number, default: 0 },
    programsUpdated: { type: Number, default: 0 },
    programsDeleted: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const CoachActivity =
  mongoose.models.CoachActivity ||
  mongoose.model("CoachActivity", coachActivitySchema);

export default CoachActivity;
