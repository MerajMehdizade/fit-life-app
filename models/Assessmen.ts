import mongoose, { Schema } from "mongoose";

const AssessmentSchema = new Schema(
  {
    title: { type: String, required: true },

    description: String,

    category: String,

    version: { type: Number, default: 1 },

    questions: [
      {
        questionId: { type: Schema.Types.ObjectId, ref: "Question", required: true },
        order: Number,
      },
    ],

    settings: {
      timeLimit: Number, // minutes
      attempts: Number,
      showResults: { type: Boolean, default: true },
    },

    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.models.Assessment ||
  mongoose.model("Assessment", AssessmentSchema);
