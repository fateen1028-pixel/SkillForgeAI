"use client";
import { useEffect, useState } from "react";
import { fetchRoadmap } from  "../src/app/services/api";

export default function RoadmapTab() {
  const [phases, setPhases] = useState([]);

  useEffect(() => {
    fetchRoadmap().then(setPhases);
  }, []);

  return (
    <div className="grid gap-2 md:grid-cols-2">
      {phases.map((phase) => (
        <div key={phase.title} className="border rounded p-2">
          <h3 className="font-semibold">{phase.title}</h3>
          <ul className="list-disc list-inside text-sm">
            {phase.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
