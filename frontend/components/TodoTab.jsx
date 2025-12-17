"use client";
import { useEffect, useState } from "react";
import { fetchTodos, addTodo, removeTodo } from  "../src/app/services/api";

export default function TodoTab() {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    fetchTodos().then(setItems);
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newItem = await addTodo(input);
    setItems((prev) => [...prev, newItem]);
    setInput("");
  };

  const handleRemove = async (id) => {
    await removeTodo(id);
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="flex flex-col gap-2">
      <form className="flex gap-2" onSubmit={handleAdd}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add task"
          className="flex-1 border rounded px-2 py-1 text-sm"
        />
        <button className="bg-green-500 px-3 py-1 rounded text-white">Add</button>
      </form>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id} className="flex justify-between border rounded p-2">
            <span>{item.label}</span>
            <button onClick={() => handleRemove(item.id)} className="text-red-500">X</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
