
import React, { useState, useMemo, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Task, TaskPriority } from '../types';
import { PlusIcon, TrashIcon } from './icons';

type SortBy = 'priority' | 'dueDate' | 'createdAt' | 'manual';

const priorityColors: Record<TaskPriority, string> = {
  high: 'bg-rose-400/90 shadow-[0_0_10px_rgba(244,63,94,0.4)]',
  medium: 'bg-amber-300/90 shadow-[0_0_10px_rgba(251,191,36,0.4)]',
  low: 'bg-emerald-400/90 shadow-[0_0_10px_rgba(52,211,153,0.4)]',
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
  const [sortBy, setSortBy] = useLocalStorage<SortBy>('tasks_sort_by', 'priority');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskText, setEditingTaskText] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  useEffect(() => {
    if (tasks.length > 0 && (typeof tasks[0].priority === 'undefined' || typeof tasks[0].createdAt === 'undefined')) {
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
      setNewPriority('medium');
    }
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };
  
  const changePriority = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, priority: priorityCycle[task.priority] } : task
      )
    );
  };

  const handleStartEditing = (task: Task) => {
    if (task.completed) return;
    setEditingTaskId(task.id);
    setEditingTaskText(task.text);
  };

  const handleSaveEdit = () => {
    if (!editingTaskId) return;
    if (editingTaskText.trim() === '') {
      deleteTask(editingTaskId);
    } else {
      setTasks(tasks.map(task => 
        task.id === editingTaskId ? { ...task, text: editingTaskText.trim() } : task
      ));
    }
    setEditingTaskId(null);
    setEditingTaskText('');
  };
  
  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSaveEdit();
    else if (e.key === 'Escape') {
      setEditingTaskId(null);
      setEditingTaskText('');
    }
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); 
  };

  const handleDrop = (e: React.DragEvent, targetTask: Task) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/plain');
    setDraggedTaskId(null);

    if (draggedId === targetTask.id) return;
    
    const draggedTask = tasks.find(t => t.id === draggedId);
    if (!draggedTask || draggedTask.completed !== targetTask.completed) return;

    let newTasks = [...tasks];
    const draggedIndex = newTasks.findIndex(t => t.id === draggedId);
    const targetIndex = newTasks.findIndex(t => t.id === targetTask.id);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const [removed] = newTasks.splice(draggedIndex, 1);
    newTasks.splice(targetIndex, 0, removed);

    setTasks(newTasks);
    setSortBy('manual'); 
  };

  const sortedTasks = useMemo(() => {
    const priorityOrder: Record<TaskPriority, number> = { high: 1, medium: 2, low: 3 };
    return [...tasks].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      if (sortBy === 'manual') return 0;
      if (sortBy === 'priority') return priorityOrder[a.priority] - priorityOrder[b.priority];
      return b.createdAt - a.createdAt;
    });
  }, [tasks, sortBy]);

  const activeTasks = sortedTasks.filter(task => !task.completed);
  const completedTasks = sortedTasks.filter(task => task.completed);

  return (
    <div className="flex flex-col h-full">
      {/* Minimal Input */}
      <div className="relative mb-4 group/input">
        <form onSubmit={handleAddTask} className="relative flex items-center">
            <input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => !newTaskText && setIsInputFocused(false)}
                placeholder="Add new task"
                className="w-full bg-transparent border-b border-white/5 text-sm font-light focus:border-white/20 focus:outline-none py-2 px-1 placeholder-white/10 transition-all duration-500"
            />
            <div className={`absolute right-0 flex items-center transition-all duration-500 ${isInputFocused || newTaskText ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 pointer-events-none'}`}>
                 <button 
                      type="button"
                      onClick={() => setNewPriority(priorityCycle[newPriority])}
                      className={`w-1.5 h-1.5 rounded-full mr-3 ${priorityColors[newPriority]} transition-all hover:scale-150`}
                   />
                 <button type="submit" className="text-white/30 hover:text-white transition-colors">
                    <PlusIcon className="w-4 h-4" />
                 </button>
            </div>
        </form>
      </div>

      {/* Task List */}
      <ul className="space-y-1 overflow-visible flex-grow">
        {activeTasks.map((task, idx) => (
            <li 
              key={task.id} 
              className={`group flex items-center py-2 -mx-2 px-3 rounded-lg transition-all duration-500 hover:bg-white/[0.02] ${draggedTaskId === task.id ? 'opacity-30' : 'opacity-100'}`}
              draggable
              onDragStart={(e) => handleDragStart(e, task.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, task)}
              onDragEnd={() => setDraggedTaskId(null)}
              style={{ animation: `fadeInUp 0.4s cubic-bezier(0.2,0,0,1) ${idx * 50}ms forwards` }}
            >
            {/* Priority Dot */}
            <button 
                onClick={() => changePriority(task.id)} 
                className={`flex-shrink-0 w-1.5 h-1.5 rounded-full mr-4 transition-all duration-500 opacity-40 group-hover:opacity-100 ${priorityColors[task.priority]}`}
            />
            
            {/* Custom Checkbox */}
            <div 
                className="flex-shrink-0 mr-3 cursor-pointer relative group/check w-4 h-4 flex items-center justify-center"
                onClick={() => toggleTask(task.id)}
            >
                <div className="w-3.5 h-3.5 rounded-full border border-white/10 transition-all duration-300 group-hover/check:border-white/50 group-hover/check:scale-110" />
            </div>
            
            <div className="flex-grow min-w-0">
                {editingTaskId === task.id ? (
                <input
                    type="text"
                    value={editingTaskText}
                    onChange={(e) => setEditingTaskText(e.target.value)}
                    onBlur={handleSaveEdit}
                    onKeyDown={handleEditKeyDown}
                    className="w-full bg-transparent border-b border-white/20 text-sm font-light focus:outline-none py-0"
                    autoFocus
                />
                ) : (
                <span
                    className="block text-sm font-light text-white/80 cursor-pointer truncate transition-colors duration-300 hover:text-white"
                    onClick={() => handleStartEditing(task)}
                >
                    {task.text}
                </span>
                )}
            </div>
            
            {/* Actions */}
            <button onClick={() => deleteTask(task.id)} className="ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-white/10 hover:text-red-400">
              <TrashIcon className="w-3.5 h-3.5" />
            </button>
          </li>
        ))}
        
        {completedTasks.length > 0 && (
          <div className="pt-6 pb-2">
             <div className="text-[9px] uppercase tracking-[0.25em] text-white/10 mb-2 pl-2 font-bold">Done</div>
             {completedTasks.map((task) => (
                 <li key={task.id} className="group flex items-center py-1.5 opacity-30 hover:opacity-60 transition-opacity duration-300 px-1">
                    <div className="w-1 h-1 mr-4 rounded-full bg-white/10" />
                    <div 
                        className="mr-3 cursor-pointer w-4 h-4 flex items-center justify-center"
                        onClick={() => toggleTask(task.id)}
                    >
                         <div className="w-3.5 h-3.5 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                            <div className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                         </div>
                    </div>
                    <span className="text-sm font-light line-through text-white/50 decoration-white/10 flex-grow truncate">
                      {task.text}
                    </span>
                    <button onClick={() => deleteTask(task.id)} className="ml-2 hover:text-white transition-colors">
                      <TrashIcon className="w-3 h-3" />
                    </button>
                 </li>
             ))}
          </div>
        )}
      </ul>
    </div>
  );
};

export default TasksWidget;
