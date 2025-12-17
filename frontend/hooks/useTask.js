"use client";

import { useState } from 'react';

export function useTask() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const addTask = (task) => {
    setTasks((prev) => [...prev, { id: Date.now(), ...task }]);
  };

  const toggleTask = (id) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const removeTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return { tasks, loading, addTask, toggleTask, removeTask };
}
