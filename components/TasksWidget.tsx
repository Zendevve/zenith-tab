
import React, { useState, useMemo, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Task, TaskPriority } from '../types';
import { PlusIcon, TrashIcon, CalendarIcon, ListIcon, ChevronLeftIcon, ChevronRightIcon } from './icons';

type SortBy = 'priority' | 'dueDate' | 'createdAt' | 'manual';
type ViewMode = 'list' | 'calendar';

const priorityIndicators: Record<TaskPriority, string> = {
  high: '!!!',
  medium: '!!',
  low: '!',
};

const priorityColors: Record<TaskPriority, string> = {
  high: 'text-red-500',
  medium: 'text-yellow-500',
  low: 'text-blue-500',
};

const priorityCycle: Record<TaskPriority, TaskPriority> = {
  high: 'medium',
  medium: 'low',
  low: 'high',
};

const TasksWidget: React.FC = () => {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [newTaskText, setNewTaskText] = useState('');
  const [newPriority, setNewPriority] = useState<TaskPriority>('medium');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
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
        priority: newPriority,
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

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
       if (a.completed !== b.completed) return a.completed ? 1 : -1;
       return b.createdAt - a.createdAt;
    });
  }, [tasks]);

  return (
    <div className="flex flex-col h-full font-mono text-xs">
       {/* Controls */}
      <div className="flex justify-between items-center mb-4 border-b border-[var(--border-color)] pb-2">
          <div className="uppercase font-bold text-[var(--accent-color)]">
              TOTAL: {tasks.length}
          </div>
          <button 
            onClick={() => setViewMode(prev => prev === 'list' ? 'calendar' : 'list')}
            className="border border-[var(--fg-color)] px-2 py-1 hover:bg-[var(--fg-color)] hover:text-[var(--bg-color)] uppercase"
          >
              {viewMode === 'list' ? '[VIEW: CALENDAR]' : '[VIEW: LIST]'}
          </button>
      </div>

      {/* Input */}
      <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
          <button 
              type="button"
              onClick={() => setNewPriority(priorityCycle[newPriority])}
              className={`border border-[var(--border-color)] w-12 flex items-center justify-center font-bold ${priorityColors[newPriority]}`}
           >
             {priorityIndicators[newPriority]}
           </button>
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="INSERT_TASK..."
            className="flex-grow bg-transparent border-b-2 border-[var(--border-color)] py-1 focus:outline-none focus:border-[var(--accent-color)] placeholder-neutral-600"
          />
          <button type="submit" className="border border-[var(--fg-color)] px-3 hover:bg-[var(--accent-color)] hover:text-black hover:border-[var(--accent-color)]">ADD</button>
      </form>

      {/* List */}
      <ul className="space-y-1 overflow-y-auto flex-grow">
        {sortedTasks.map((task) => (
            <li key={task.id} className="group flex items-start gap-3 p-1 hover:bg-[var(--border-color)] hover:text-[var(--bg-color)]">
                <button onClick={() => toggleTask(task.id)} className="font-bold min-w-[24px]">
                    {task.completed ? '[X]' : '[ ]'}
                </button>
                <span className={`flex-grow break-all ${task.completed ? 'line-through opacity-50' : ''}`}>
                    <span className={`mr-2 font-bold ${priorityColors[task.priority]}`}>{priorityIndicators[task.priority]}</span>
                    {task.text}
                </span>
                <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 text-red-500 font-bold px-2">
                    DEL
                </button>
            </li>
        ))}
        {tasks.length === 0 && <li className="text-neutral-600 italic">// NO TASKS FOUND</li>}
      </ul>
    </div>
  );
};

export default TasksWidget;
