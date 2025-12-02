
import React, { useState, useMemo, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Task, TaskPriority } from '../types';
import { CalendarIcon, ListIcon, ChevronLeftIcon, ChevronRightIcon } from './icons';

const priorityColors: Record<TaskPriority, string> = {
  high: 'bg-red-400',
  medium: 'bg-yellow-400',
  low: 'bg-blue-400',
};

const TasksWidget: React.FC = () => {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [newTaskText, setNewTaskText] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  
  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null); // YYYY-MM-DD
  
  // D&D State
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  // Ensure tasks have priority and dates
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
        dueDate: selectedDate || null,
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

  // Drag and Drop Logic
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedTaskId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedTaskId || draggedTaskId === targetId) return;

    const draggedIndex = tasks.findIndex(t => t.id === draggedTaskId);
    const targetIndex = tasks.findIndex(t => t.id === targetId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;

    const newTasks = [...tasks];
    const [removed] = newTasks.splice(draggedIndex, 1);
    newTasks.splice(targetIndex, 0, removed);
    setTasks(newTasks);
    setDraggedTaskId(null);
  };

  // Calendar Helpers
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const days = [];
    for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const hasTask = tasks.some(t => t.dueDate === dateStr && !t.completed);
        const isSelected = selectedDate === dateStr;
        const isToday = new Date().toISOString().split('T')[0] === dateStr;

        days.push(
            <button
                key={day}
                onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                className={`aspect-square flex items-center justify-center relative rounded-md text-xs transition-colors ${
                    isSelected ? 'bg-[var(--accent-color)] text-black font-medium' : 'hover:bg-white/10 text-white/80'
                } ${isToday && !isSelected ? 'border border-[var(--accent-color)]' : ''}`}
            >
                {day}
                {hasTask && !isSelected && (
                    <div className="absolute bottom-1 w-1 h-1 bg-[var(--accent-color)] rounded-full" />
                )}
            </button>
        );
    }
    return days;
  };

  const filteredTasks = useMemo(() => {
      if (viewMode === 'calendar' && selectedDate) {
          return tasks.filter(t => t.dueDate === selectedDate);
      }
      return tasks;
  }, [tasks, viewMode, selectedDate]);

  return (
    <div className="flex flex-col h-full font-sans relative">
      <div className="flex items-center justify-end absolute top-[-3.5rem] right-0 md:static md:top-auto md:mb-4 md:right-auto z-20">
          <button 
            onClick={() => {
                setViewMode(prev => prev === 'list' ? 'calendar' : 'list');
                setSelectedDate(null);
            }} 
            className="text-white/40 hover:text-white transition-colors"
            title={viewMode === 'list' ? 'Calendar View' : 'List View'}
          >
              {viewMode === 'list' ? <CalendarIcon className="w-4 h-4" /> : <ListIcon className="w-4 h-4" />}
          </button>
      </div>

      {viewMode === 'calendar' ? (
          <div className="flex flex-col h-full animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                  <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))} className="p-1 hover:text-white text-white/40"><ChevronLeftIcon className="w-4 h-4"/></button>
                  <span className="text-sm font-light tracking-widest uppercase text-white/80">
                      {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                  <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))} className="p-1 hover:text-white text-white/40"><ChevronRightIcon className="w-4 h-4"/></button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-[10px] text-center text-white/30 uppercase tracking-wider mb-2">
                  {['S','M','T','W','T','F','S'].map((d,i) => <div key={i}>{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1 overflow-y-auto pr-1">
                  {renderCalendar()}
              </div>
              {selectedDate && (
                  <div className="mt-4 pt-4 border-t border-white/5">
                      <div className="text-xs text-white/40 mb-2 uppercase tracking-wide">Tasks for {selectedDate}</div>
                       {/* Input within Calendar View */}
                        <form onSubmit={handleAddTask} className="mb-2">
                            <input
                                type="text"
                                value={newTaskText}
                                onChange={(e) => setNewTaskText(e.target.value)}
                                placeholder="Add task..."
                                className="w-full bg-transparent border-b border-white/10 py-1 text-xs font-light focus:outline-none focus:border-white/40"
                            />
                        </form>
                  </div>
              )}
          </div>
      ) : (
          <>
            <form onSubmit={handleAddTask} className="mb-6">
                <input
                    type="text"
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    placeholder="Add a task"
                    className="w-full bg-transparent border-b border-white/10 py-2 text-sm font-light focus:outline-none focus:border-white/40 placeholder-white/20 transition-colors"
                />
            </form>

            <ul className="space-y-2 overflow-y-auto flex-grow pr-2">
                {filteredTasks.map((task) => (
                    <li 
                        key={task.id} 
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, task.id)}
                        className={`group flex items-center gap-3 animate-fade-in p-2 rounded hover:bg-white/[0.02] cursor-move transition-all ${draggedTaskId === task.id ? 'opacity-50' : 'opacity-100'}`}
                    >
                        <button 
                            onClick={() => toggleTask(task.id)} 
                            className={`w-4 h-4 rounded-full border border-white/30 flex items-center justify-center transition-all hover:border-white flex-shrink-0 ${task.completed ? 'bg-white/20 border-transparent' : ''}`}
                        >
                            {task.completed && <div className="w-2 h-2 bg-white rounded-full" />}
                        </button>
                        
                        <div className="flex-grow min-w-0 flex flex-col">
                             <span className={`text-sm font-light truncate transition-opacity ${task.completed ? 'opacity-30 line-through' : 'opacity-90'}`}>
                                {task.text}
                            </span>
                            {task.dueDate && (
                                <span className="text-[10px] text-white/30">{task.dueDate}</span>
                            )}
                        </div>

                        <button 
                            onClick={() => deleteTask(task.id)} 
                            className="opacity-0 group-hover:opacity-100 text-[10px] uppercase tracking-wider text-white/30 hover:text-red-400 transition-all flex-shrink-0"
                        >
                            Delete
                        </button>
                    </li>
                ))}
                {filteredTasks.length === 0 && <li className="text-white/20 text-xs font-light italic text-center mt-8">No active tasks</li>}
            </ul>
          </>
      )}
    </div>
  );
};

export default TasksWidget;
