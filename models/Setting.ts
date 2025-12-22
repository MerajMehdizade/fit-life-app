import { Schema, model, models } from "mongoose";

const SettingSchema = new Schema({
  key: { type: String, required: true, unique: true },
  value: { type: Schema.Types.Mixed, default: {} },
}, { timestamps: true });

export default models.Setting || model("Setting", SettingSchema);
