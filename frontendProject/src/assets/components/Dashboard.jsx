import { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../utils/constant";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await axios.get(`${BACKEND_URL}/tasks/${user._id}`);
    setTasks(res.data);
  };

  const addTask = async () => {
    if (!title.trim()) return;

    const res = await axios.post(`${BACKEND_URL}/tasks`, {
      title,
      userId: user._id,
    });

    setTasks([...tasks, res.data.task]);
    setTitle("");
  };
console.log(tasks);
  const toggleTask = async (id) => {
    const res = await axios.put(`${BACKEND_URL}/tasks/${id}/toggle`);
    setTasks(tasks.map(t => (t._id === id ? res.data : t)));
  };

  const deleteTask = async (id) => {
    await axios.delete(`${BACKEND_URL}/tasks/${id}`);
    setTasks(tasks.filter(t => t._id !== id));
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold text-orange-500 mb-6">
        Welcome {user?.name}
      </h1>

      <div className="flex gap-2 mb-6">
        <input
          className="border p-2 rounded w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add new task"
        />
        <button
          onClick={addTask}
          className="bg-orange-500 text-white px-4 rounded"
        >
          Add
        </button>
      </div>

      {tasks.map(task => (
        <div
          key={task._id}
          className="flex justify-between items-center bg-gray-100 p-3 rounded mb-2"
        >
          <span
            className={task.completed ? "line-through text-gray-400" : ""}
          >
            {task.title}
          </span>

          <div className="flex gap-3">
            <button
              onClick={() => toggleTask(task._id)}
              className="text-green-600"
            >
              ✓
            </button>

            <button
              onClick={() => deleteTask(task._id)}
              className="text-red-500"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;