"use client";

import { useEffect, useState } from "react";

export default function StudentDashboard() {
  const [training, setTraining] = useState(null);
  const [diet, setDiet] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadPrograms = async () => {
    try {
      const res = await fetch("/api/student/program", {
        credentials: "include",
      });

      const data = await res.json();
      setTraining(data.trainingPlan);
      setDiet(data.dietPlan);
    } catch (err) {
      console.error("Error loading program:", err);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadPrograms();
  }, []);

  if (loading) return <p className="p-5">در حال بارگذاری...</p>;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">داشبورد دانشجو</h1>

      {/* برنامه تمرینی */}
      <div className="mb-10">
        <h2 className="text-2xl mb-3">برنامه تمرینی</h2>

        {!training && <p className="text-gray-400">برنامه تمرینی هنوز ثبت نشده.</p>}

        {training && (
          <pre className="bg-gray-800 p-4 rounded text-sm whitespace-pre-wrap">
            {JSON.stringify(training, null, 2)}
          </pre>
        )}
      </div>

      {/* برنامه غذایی */}
      <div>
        <h2 className="text-2xl mb-3">برنامه غذایی</h2>

        {!diet && <p className="text-gray-400">برنامه غذایی هنوز ثبت نشده.</p>}

        {diet && (
          <pre className="bg-gray-800 p-4 rounded text-sm whitespace-pre-wrap">
            {JSON.stringify(diet, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
