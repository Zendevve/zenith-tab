import React, { useState, useMemo, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Task, TaskPriority } from '../types';

const priorityColors: Record<TaskPriority, string> = {
  high: 'bg-red-400',
  medium: 'bg-yellow-400',
  low: 'bg-blue-400',
};

const TasksWidget: React.FC = () => {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [newTaskText, setNewTaskText] = useState('');
  
  // Ensure tasks have priority
  useEffect(() => {
    if (tasks.length > 0 && (typeof tasks[0].priority === 'undefined')) {
      setTasks(currentTasks => 
        currentTasks.map(task => ({
          ...task,
          priority: task.priority || 'medium',
          createdAt: task.createdAt || parseInt(task.id, 10),
          dueDate: task.dueDate || null,
        }))
      );
    }
  }, []);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        text: newTaskText.trim(),
        completed: false,
        priority: 'medium',
        createdAt: Date.now(),
        dueDate: null,
      };
      setTasks([newTask, ...tasks]);
      setNewTaskText('');
    }
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map((task) => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="flex flex-col h-full font-sans">
      {/* Minimal Input */}
      <form onSubmit={handleAddTask} className="mb-6">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Add a task"
            className="w-full bg-transparent border-b border-white/10 py-2 text-sm font-light focus:outline-none focus:border-white/40 placeholder-white/20 transition-colors"
          />
      </form>

      {/* List */}
      <ul className="space-y-3 overflow-y-auto flex-grow pr-2">
        {tasks.map((task) => (
            <li key={task.id} className="group flex items-center gap-3 animate-fade-in">
                <button 
                    onClick={() => toggleTask(task.id)} 
                    className={`w-4 h-4 rounded-full border border-white/30 flex items-center justify-center transition-all hover:border-white ${task.completed ? 'bg-white/20 border-transparent' : ''}`}
                >
                    {task.completed && <div className="w-2 h-2 bg-white rounded-full" />}
                </button>
                
                <span className={`flex-grow text-sm font-light truncate transition-opacity ${task.completed ? 'opacity-30 line-through' : 'opacity-90'}`}>
                    {task.text}
                </span>

                <button 
                    onClick={() => deleteTask(task.id)} 
                    className="opacity-0 group-hover:opacity-100 text-[10px] uppercase tracking-wider text-white/30 hover:text-red-400 transition-all"
                >
                    Delete
                </button>
            </li>
        ))}
        {tasks.length === 0 && <li className="text-white/20 text-xs font-light italic text-center mt-8">No active tasks</li>}
      </ul>
    </div>
  );
};

export default TasksWidget;