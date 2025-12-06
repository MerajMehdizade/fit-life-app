"use client";

import { useState } from "react";

type ProgressRecord = {
  date: string | Date;
  weight: number;
  bodyFat?: number;
};

export default function ProgressHistory({ student }: any) {
  const [weight, setWeight] = useState("");
  const [bodyFat, setBodyFat] = useState("");
  const [saving, setSaving] = useState(false);
  const [history, setHistory] = useState<ProgressRecord[]>(student.profile?.progressHistory || []);

  const add = async () => {
    if (!weight) return alert("وزن را وارد کنید");

    setSaving(true);

    await fetch(`/api/coach/students/${student._id}/progress`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ weight, bodyFat }),
    });

    setSaving(false);

    setHistory([
      ...history,
      {
        date: new Date(),
        weight: Number(weight),
        bodyFat: Number(bodyFat),
      },
    ]);

    setWeight("");
    setBodyFat("");
  };

  return (
    <div>
      {history.map((p: ProgressRecord, i: number) => (
        <div key={i}>
          <span>{new Date(p.date).toLocaleDateString("fa-IR")}</span>
          <span>{p.weight}</span>
          <span>{p.bodyFat}</span>
        </div>
      ))}
    </div>
  );
}
