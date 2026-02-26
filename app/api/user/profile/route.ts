import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/getUser";

const ALLOWED_FIELDS = [
  // --- UI (visual only)
  "uiPreferences.bodyVisuals.current",
  "uiPreferences.bodyVisuals.target",
  "bodyFatPercentage",
  "userPriority",
  "goalDeadline",
  "waist",
  "chest",
  "arm",
  "hip",

  // --- core
  "gender",
  "age",
  "height",
  "currentWeight",
  "targetWeight",
  "trainingLevel",
  "supplement_usage_status",
  "doping_status",
  "workoutDaysPerWeek",
  "calorieTarget",
  "dietPlanPreference",
  "appetiteLevel",
  "avg_breakfast_grams",
  "avg_lunch_grams",
  "avg_dinner_grams",
  "diet_history",
  "smoking_status",
  "alcohol_status",
  "foodAllergies",
  "dietaryRestrictions",

  // --- optional
  "injuries",
  "chronicDiseases",
  "medications",
  "doctorRestrictions",

  "sleepHours",
  "sleepQuality",

  "dailyActivityLevel",

  "trainingExperienceYears",
  "maxWorkoutDuration",
  "trainingLocation",
  "availableEquipment",

  "motivationLevel",
  "confidenceLevel",
  "mainObjective",
];
const REQUIRED_FIELDS = [
  "age", "height", "currentWeight", "targetWeight",
  "mainObjective",
  "trainingLevel", "workoutDaysPerWeek", "trainingLocation", "supplement_usage_status", "doping_status", "trainingExperienceYears", "maxWorkoutDuration",
  "dietPlanPreference", "appetiteLevel", "diet_history", "smoking_status", "alcohol_status",
  "dailyActivityLevel",
  "sleepQuality",
  "sleepHours",
];
export async function PATCH(req: Request) {
  try {
    await connectDB();

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    if (user.role !== "student") {
      return NextResponse.json({ success: false }, { status: 403 });
    }

    const body = await req.json();
    for (const key of Object.keys(body)) {
      if (
        REQUIRED_FIELDS.includes(key) &&
        (body[key] === "" || body[key] === null)
      ) {
        return NextResponse.json(
          { success: false, message: `فیلد ${key} اجباری است` },
          { status: 400 }
        );
      }
    }
    const existingUser = await User.findById(user.userId);
    if (!existingUser) {
      return NextResponse.json({ success: false }, { status: 404 });
    }
    const updates: Record<string, any> = {};
    if (body.appetiteLevel !== undefined) {
      updates["profile.appetiteLevel"] = body.appetiteLevel;
    }
    if (body.avg_breakfast_grams !== undefined) {
      updates["profile.avg_breakfast_grams"] = body.avg_breakfast_grams;
    }
    if (body.avg_lunch_grams !== undefined) {
      updates["profile.avg_lunch_grams"] = body.avg_lunch_grams;
    }
    if (body.avg_dinner_grams !== undefined) {
      updates["profile.avg_dinner_grams"] = body.avg_dinner_grams;
    }
    if (body.diet_history !== undefined) {
      updates["profile.diet_history"] = body.diet_history;
    }
    if (body.smoking_status !== undefined) {
      updates["profile.smoking_status"] = body.smoking_status;
    }
    if (body.alcohol_status !== undefined) {
      updates["profile.alcohol_status"] = body.alcohol_status;
    }
    if (body.nutritionPlan) {
      if (body.nutritionPlan.calorieTarget !== undefined) {
        updates["profile.nutritionPlan.calorieTarget"] =
          Number(body.nutritionPlan.calorieTarget);
      }

      if (body.nutritionPlan.macros) {
        updates["profile.nutritionPlan.macros.protein"] =
          Number(body.nutritionPlan.macros.protein);

        updates["profile.nutritionPlan.macros.carbs"] =
          Number(body.nutritionPlan.macros.carbs);

        updates["profile.nutritionPlan.macros.fat"] =
          Number(body.nutritionPlan.macros.fat);
      }

      updates["profile.nutritionPlan.calculatedAt"] = new Date();
    }



    if (body.name) {
      const exists = await User.findOne({
        name: body.name.toLowerCase(),
        _id: { $ne: user.userId },
      });

      if (exists) {
        return NextResponse.json(
          { success: false, message: "نام کاربری قبلا استفاده شده" },
          { status: 400 }
        );
      }

      updates["name"] = body.name.toLowerCase();
    }

    if (body.email) {
      const exists = await User.findOne({
        email: body.email.toLowerCase(),
        _id: { $ne: user.userId },
      });

      if (exists) {
        return NextResponse.json(
          { success: false, message: "ایمیل قبلا استفاده شده" },
          { status: 400 }
        );
      }

      updates["email"] = body.email.toLowerCase();
    }

    if (body.phone !== undefined) {
      updates["phone"] = body.phone;
    }

    /* ================= PROFILE ================= */

    for (const key of ALLOWED_FIELDS) {
      if (body[key] === undefined) continue;
      if (key === "calorieTarget") {
        updates["profile.nutritionPlan.calorieTarget"] = Number(body[key]);
        continue;
      }
      // ---------- SLEEP ----------
      if (key === "sleepHours") {
        updates["profile.sleep.averageHours"] = Number(body[key]);
        continue;
      }

      if (key === "sleepQuality") {
        updates["profile.sleep.quality"] = body[key];
        continue;
      }

      // ---------- MEDICAL ----------
      if (key === "injuries") {
        updates["profile.medical.injuries"] = body[key];
        continue;
      }

      if (key === "chronicDiseases") {
        updates["profile.medical.chronicDiseases"] = body[key];
        continue;
      }

      if (key === "medications") {
        updates["profile.medical.medications"] = body[key];
        continue;
      }

      if (key === "doctorRestrictions") {
        updates["profile.medical.doctorRestrictions"] = body[key];
        continue;
      }

      // ---------- UI ----------
      if (key.startsWith("uiPreferences.")) continue;
      if (key === "waist") {
        updates["profile.measurements.waist"] = Number(body[key]);
        continue;
      }

      if (key === "chest") {
        updates["profile.measurements.chest"] = Number(body[key]);
        continue;
      }

      if (key === "arm") {
        updates["profile.measurements.arm"] = Number(body[key]);
        continue;
      }

      if (key === "hip") {
        updates["profile.measurements.hip"] = Number(body[key]);
        continue;
      }

      // ---------- DEFAULT ----------
      updates[`profile.${key}`] = body[key];
    }

    /* ================= NUMERIC CAST ================= */

    const numericFields = [
      "age",
      "height",
      "currentWeight",
      "bodyFatPercentage",
      "targetWeight",
      "workoutDaysPerWeek",
      "calorieTarget",
      "trainingExperienceYears",
      "maxWorkoutDuration",
      "motivationLevel",
      "confidenceLevel",
    ];

    numericFields.forEach((field) => {
      const path = `profile.${field}`;
      if (updates[path] !== undefined) {
        updates[path] = Number(updates[path]);
      }
    });

    /* ================= UI BODY VISUAL ================= */

    if (body.uiPreferences?.bodyVisuals) {
      updates["uiPreferences.bodyVisuals"] = {
        current: body.uiPreferences.bodyVisuals.current,
        target: body.uiPreferences.bodyVisuals.target,
      };
    }

    // ================= WEIGHT RESET =================
    if (body.resetToInitial) {
      const initialWeight = existingUser.profile?.progressHistory?.[0]?.weight;
      if (initialWeight !== undefined) {
        await User.findByIdAndUpdate(user.userId, {
          $set: {
            "profile.currentWeight": initialWeight,
            "profile.progressHistory": [{ date: new Date(), weight: initialWeight }] // فقط یک نقطه باقی می‌مونه
          }
        });
      }
    } else if (updates["profile.currentWeight"] !== undefined) {
      const newWeight = Number(updates["profile.currentWeight"]);
      const oldWeight = existingUser.profile?.currentWeight;

      if (oldWeight && newWeight && newWeight !== oldWeight) {
        await User.findByIdAndUpdate(user.userId, {
          $push: { "profile.progressHistory": { date: new Date(), weight: newWeight } },
        });
      }
    }

    // در ادامه $set اصلی فقط برای بقیه فیلدها اعمال می‌کنیم:
    const { currentWeight, progressHistory, ...otherUpdates } = updates; // currentWeight و progressHistory را جدا می‌کنیم
    const updatedUser = await User.findByIdAndUpdate(
      user.userId,
      { $set: { ...otherUpdates, profileCompleted: true } },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      user: {
        _id: updatedUser?._id,
        name: updatedUser?.name,
        email: updatedUser?.email,
        role: updatedUser?.role,
        status: updatedUser?.status,
        avatar: updatedUser?.avatar,
        profile: {
          ...updatedUser?.profile.toObject(),
          appetiteLevel: updatedUser?.profile?.appetiteLevel ?? null,
          avg_breakfast_grams: updatedUser?.profile?.avg_breakfast_grams ?? null,
          avg_lunch_grams: updatedUser?.profile?.avg_lunch_grams ?? null,
          avg_dinner_grams: updatedUser?.profile?.avg_dinner_grams ?? null,
          diet_history: updatedUser?.profile?.diet_history ?? null,
          smoking_status: updatedUser?.profile?.smoking_status ?? null,
          alcohol_status: updatedUser?.profile?.alcohol_status ?? null,
        },
        students: updatedUser?.students,
        assignedCoach: updatedUser?.assignedCoach,
        uiPreferences: updatedUser?.uiPreferences,
      },
    });

  } catch (error) {
    console.error("PROFILE UPDATE ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Profile update failed" },
      { status: 500 }
    );
  }
}
