import mongoose, { Schema } from "mongoose";

const QuestionSchema = new Schema(
  {
    text: { type: String, required: true },

    options: [{ type: String, required: true }],

    correctAnswer: { type: Number, required: true },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },

    tags: [String],

    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.models.Question ||
  mongoose.model("Question", QuestionSchema);
