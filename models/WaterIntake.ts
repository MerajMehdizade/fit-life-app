import mongoose, { Schema } from "mongoose";

const waterIntakeSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    date: {
      type: String, // YYYY-MM-DD
      required: true,
      index: true,
    },

    filledGlasses: {
      type: Number,
      default: 0,
    },

    targetWater: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

waterIntakeSchema.index({ user: 1, date: 1 }, { unique: true });

const WaterIntake =
  mongoose.models.WaterIntake ||
  mongoose.model("WaterIntake", waterIntakeSchema);

export default WaterIntake;
