"use client";

import Accordion from "@/app/Components/Accordion/Accordion";
import { useState } from "react";

export default function DietProgram({ student }: any) {
  const [diet, setDiet] = useState(student.dietPlan || "");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    await fetch(`/api/coach/students/${student._id}/diet`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ diet }),
    });
    setSaving(false);
    alert("برنامه غذایی ذخیره شد");
  };

  return (
    <Accordion title="🍽 برنامه غذایی">
      <textarea
        value={diet}
        onChange={(e) => setDiet(e.target.value)}
        className="w-full p-3 bg-gray-700 rounded"
        rows={6}
      ></textarea>

      <button
        onClick={save}
        className="bg-green-600 text-white px-4 py-2 rounded mt-3"
      >
        {saving ? "در حال ذخیره..." : "ذخیره"}
      </button>
    </Accordion>
  );
}
