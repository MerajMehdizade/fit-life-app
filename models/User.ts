import mongoose, { Schema, model, models } from "mongoose";

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
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
      }
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
      }
    ],
    foodAllergies: String,
    dietaryRstrictions: String,
    dailyCalorieAverage: Number,
    dietPlanType: String,
  },
});

const User = models.User || model("User", userSchema);
export default User;
