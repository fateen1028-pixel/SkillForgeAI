"use client";

import { useState, useEffect } from 'react';
import { roadmapService } from '@/services/roadmap.service';

export function useRoadmap() {
  const [roadmap, setRoadmap] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load roadmap on mount
    // roadmapService.getRoadmap().then(setRoadmap);
    setLoading(false);
  }, []);

  const updateProgress = async (phaseId, itemId, completed) => {
    await roadmapService.updateProgress(phaseId, itemId, completed);
  };

  return { roadmap, loading, updateProgress };
}
