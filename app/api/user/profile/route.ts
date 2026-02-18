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
  "workoutDaysPerWeek",
  "calorieTarget",
  "dietPlanPreference",
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
    const updates: Record<string, any> = {};
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

    /* ================= UPDATE ================= */

    const updatedUser = await User.findByIdAndUpdate(
      user.userId,
      {
        $set: {
          ...updates,
          profileCompleted: true,
        },
      },
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
        profile: updatedUser?.profile,
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
