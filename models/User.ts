import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    /* ================= AUTH ================= */
    name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: { type: String, required: true },

    resetPasswordToken: { type: String, default: null },
    resetPasswordExpire: { type: Date, default: null },

    /* ================= ROLE ================= */
    role: {
      type: String,
      enum: ["student", "coach", "admin"],
      default: "student",
      required: true,
    },

    /* ================= RELATIONS ================= */
    assignedCoach: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    /* ================= STATUS ================= */
    status: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
    },

    /* ================= META ================= */
    avatar: { type: String, default: "" },
    phone: { type: String, default: "" },

    permissions: [{ type: String }],

    lastLogin: { type: Date },
    notificationCount: { type: Number, default: 0 },
    logCount: { type: Number, default: 0 },

    startDate: {
      type: Date,
      default: () => new Date(),
    },

    profileCompleted: { type: Boolean, default: false },
    progressFinished: { type: Boolean, default: false },

    /* ================= PLANS (OUTPUT SYSTEM) ================= */
    trainingPlan: {
      type: Object,
      default: null,
    },

    dietPlan: {
      type: Object,
      default: null,
    },

    /* ================= UI / DASHBOARD (VISUAL ONLY) ================= */
    uiPreferences: {
      bodyVisuals: {
        current: { type: String }, // e.g. body_male_3
        target: { type: String },  // e.g. body_fit_1
      },
    },

    /* ================= PROFILE (CORE FITNESS DATA) ================= */
    profile: {
      /* -------- پایه -------- */
      gender: {
        type: String,
        enum: ["male", "female"],
      },
      age: Number,
      height: Number, // cm

      /* -------- وزن و بدن -------- */
      currentWeight: Number, // kg
      targetWeight: Number,  // kg
// اختیاری
      bodyFatPercentage: Number,
      // اختیاری
      measurements: {
        waist: Number,
        chest: Number,
        arm: Number,
        hip: Number,
      },

      /* -------- هدف -------- */
      mainObjective: {
        type: String,
        enum: [
          "fat_loss",
          "muscle_gain",
          "strength",
          "health",
          "recomposition",
        ],
      },
      // اختیاری
      goalDeadline: Date,

      userPriority: {
        type: String,
        enum: ["appearance", "performance", "health"],
      },

      /* -------- فعالیت روزانه -------- */
      dailyActivityLevel: {
        type: String,
        enum: ["sedentary", "light", "moderate", "active", "very_active"],
      },

      /* -------- خواب -------- */
      sleep: {
        averageHours: Number,
        quality: {
          type: String,
          enum: ["poor", "average", "good"],
        },
      },

      /* -------- تمرین -------- */
      trainingLevel: {
        type: String,
        enum: ["beginner", "intermediate", "advanced"],
      },

      trainingExperienceYears: Number,

      workoutDaysPerWeek: {
        type: Number, // 1 - 7
      },

      maxWorkoutDuration: {
        type: Number, // minutes
      },

      trainingLocation: {
        type: String,
        enum: ["gym", "home", "outdoor"],
      },

      availableEquipment: [String],

      /* -------- تغذیه (INPUT USER) -------- */
      foodAllergies: [String],
      dietaryRestrictions: [String],

      dietPlanPreference: {
        type: String,
        enum: ["balanced", "keto", "low_carb", "vegan"],
      },

      /* -------- تغذیه (CALCULATED) -------- */
      // اختیاری
      nutritionPlan: {
        calorieTarget: Number,
        macros: {
          protein: Number,
          carbs: Number,
          fat: Number,
        },
        calculatedAt: Date,
      },

      /* -------- پزشکی -------- */
      medical: {
        injuries: [String],
        chronicDiseases: [String],
        medications: [String],
        doctorRestrictions: String,
      },

      /* -------- انگیزه -------- */
      motivationLevel: {
        type: Number, // 1 - 10
      },

      confidenceLevel: {
        type: Number, // 1 - 10
      },

      /* -------- پیشرفت -------- */
      // اختیاری
      progressHistory: [
        {
          date: { type: Date, default: Date.now },
          weight: Number,
          bodyFat: Number,
          notes: String,
        },
      ],
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
