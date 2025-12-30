"use client";

import { useEffect, useState } from "react";
import Accordion from "@/app/Components/Accordion/Accordion";
import Loading from "@/app/Components/LoadingSpin/Loading";

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

  if (loading) return <Loading  />

  return (
    <div className="p-10 space-y-6">
      <h1 className="text-3xl font-bold mb-6">داشبورد دانشجو</h1>

      {/* برنامه تمرینی */}
      <Accordion title="🏋️ برنامه تمرینی">
        {!training && <p className="text-gray-400">برنامه تمرینی هنوز ثبت نشده.</p>}

        {training && (
          <pre className="bg-gray-900 p-4 rounded text-sm whitespace-pre-wrap">
            {typeof training === "string"
              ? training
              : JSON.stringify(training, null, 2)}
          </pre>
        )}
      </Accordion>

      {/* برنامه غذایی */}
      <Accordion title="🍽 برنامه غذایی">
        {!diet && <p className="text-gray-400">برنامه غذایی هنوز ثبت نشده.</p>}

        {diet && (
          <pre className="bg-gray-900 p-4 rounded text-sm whitespace-pre-wrap">
            {typeof diet === "string"
              ? diet
              : JSON.stringify(diet, null, 2)}
          </pre>
        )}
      </Accordion>
    </div>
  );
}
