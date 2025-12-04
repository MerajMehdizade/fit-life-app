import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["student", "coach", "admin"],
      default: "student",
      required: true,
    },
    trainingPlan: {
      type: Object,
      default: null,
    },
    dietPlan: {
      type: Object,
      default: null,
    },
    assignedCoach: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    ],

    status: {
      type: String,
      enum: ["active", "suspended", "deleted"],
      default: "active",
    },

    avatar: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    permissions: [
      {
        type: String,
      },
    ],

    lastLogin: {
      type: Date,
    },

    notificationCount: {
      type: Number,
      default: 0,
    },

    logCount: {
      type: Number,
      default: 0,
    },



    profile: {
      age: Number,
      gender: String,
      height: Number,
      weight: Number,
      primaryGoal: String,
      currentWeight: Number,
      bodyFatPercentage: Number,
      waistCircumference: Number,
      chestCircumference: Number,
      armCircumference: Number,

      progressHistory: [
        {
          date: Date,
          weight: Number,
          bodyFat: Number,
        },
      ],

      progressPhoto: String,
      trainingLevel: String,
      bodyGoalType: String,
      workOutDays: String,
      calorieTarget: String,

      macros: [
        {
          protein: Number,
          carbs: Number,
          fat: Number,
        },
      ],

      foodAllergies: String,
      dietaryRstrictions: String,
      dailyCalorieAverage: Number,
      dietPlanType: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
