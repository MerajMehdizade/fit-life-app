"use client";

import Accordion from "@/app/Components/Accordion/Accordion";
import { useState } from "react";

export default function TrainingProgram({ student }: any) {
  const [program, setProgram] = useState(student.trainingPlan || "");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    await fetch(`/api/coach/students/${student._id}/training`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: program }),
    });
    setSaving(false);
    alert("برنامه تمرینی ذخیره شد");
  };

  return (
    <Accordion title="🏋️ برنامه تمرینی">
      <textarea
        value={program}
        onChange={(e) => setProgram(e.target.value)}
        className="w-full p-3 bg-gray-700 rounded"
        rows={6}
      ></textarea>

      <button
        onClick={save}
        className="bg-blue-600 text-white px-4 py-2 rounded mt-3"
      >
        {saving ? "در حال ذخیره..." : "ذخیره"}
      </button>
    </Accordion>
  );
}
