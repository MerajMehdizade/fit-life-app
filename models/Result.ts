import mongoose, { Schema } from "mongoose";

const ResultSchema = new Schema(
  {
    assessmentId: { type: Schema.Types.ObjectId, ref: "Assessment", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    answers: [
      {
        questionId: { type: Schema.Types.ObjectId, ref: "Question" },
        selectedOption: Number,
      },
    ],

    score: Number,

    startedAt: Date,
    finishedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.models.Result ||
  mongoose.model("Result", ResultSchema);
