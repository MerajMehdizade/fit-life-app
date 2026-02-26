export const LABELS: Record<string, string> = {
  male: "مرد",
  female: "زن",
  // ===== Goals =====
  fat_loss: "چربی‌سوزی",
  muscle_gain: "حجم و عضله سازی",
  cut: "کات",
  health: "سلامتی",
  strength: "افزایش قدرت",
  recomposition: "اصلاح ترکیب بدن",

  // ===== Training Level =====
  beginner: "مبتدی",
  intermediate: "متوسط",
  advanced: "پیشرفته",

  // ===== Diet =====
  balanced: "متعادل",
  keto: "کتوژنیک",
  vegan: "وگان",

  // ===== Sleep Quality =====
  poor: "ضعیف",
  average: "متوسط",
  good: "خوب",

  // ===== Activity Level =====
  sedentary: "بی‌تحرک",
  light: "کم‌تحرک",
  moderate: "متوسط",
  active: "فعال",
  very_active: "بسیار فعال",

  // ===== Location =====
  gym: "باشگاه",
  home: "خانه",
  outdoor: "فضای باز",

  appearance: "ظاهر",
  performance: "عملکرد",
  low: "کم",
  normal: "معمولی",
  high: "زیاد",
  suspended: "تعلیق شده",

  yes:"بله",
  no:"خیر",
};
export const getLabel = (value?: string | null) => {
  if (!value) return null;
  return LABELS[value] || value;
};