
import React, { useState, useMemo, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Task, TaskPriority } from '../types';
import { PlusIcon, TrashIcon, CalendarIcon, ListIcon, ChevronLeftIcon, ChevronRightIcon } from './icons';

type SortBy = 'priority' | 'dueDate' | 'createdAt' | 'manual';
type ViewMode = 'list' | 'calendar';

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
  
  // Calendar State
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

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

  const formatDate = (date: Date) => {
      return date.toISOString().split('T')[0];
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        text: newTaskText.trim(),
        completed: false,
        priority: newPriority,
        createdAt: Date.now(),
        dueDate: viewMode === 'calendar' ? formatDate(selectedDate) : null,
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
    if (viewMode === 'list') setSortBy('manual'); 
  };

  // Logic for displaying tasks based on view mode
  const displayedTasks = useMemo(() => {
    let filtered = tasks;
    if (viewMode === 'calendar') {
        const dateStr = formatDate(selectedDate);
        filtered = tasks.filter(t => t.dueDate === dateStr);
    }

    const priorityOrder: Record<TaskPriority, number> = { high: 1, medium: 2, low: 3 };
    return [...filtered].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      // In calendar mode, we usually want simple list behavior or manual if user dragged
      if (viewMode === 'list' && sortBy === 'manual') return 0; 
      if (sortBy === 'priority') return priorityOrder[a.priority] - priorityOrder[b.priority];
      return b.createdAt - a.createdAt;
    });
  }, [tasks, sortBy, viewMode, selectedDate]);

  const activeTasks = displayedTasks.filter(task => !task.completed);
  const completedTasks = displayedTasks.filter(task => task.completed);

  // Calendar Helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { daysInMonth, firstDay };
  };

  const changeMonth = (increment: number) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + increment);
    setCurrentMonth(newDate);
  };

  const { daysInMonth, firstDay } = getDaysInMonth(currentMonth);

  const calendarDays = Array.from({ length: 42 }, (_, i) => {
      const dayNumber = i - firstDay + 1;
      if (dayNumber > 0 && dayNumber <= daysInMonth) {
          const currentDateStr = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), dayNumber).toISOString().split('T')[0];
          const tasksForDay = tasks.filter(t => t.dueDate === currentDateStr && !t.completed);
          return { day: dayNumber, dateStr: currentDateStr, tasks: tasksForDay };
      }
      return null;
  });

  return (
    <div className="flex flex-col h-full relative">
       {/* Header Toolbar */}
      <div className="flex justify-end mb-2 shrink-0">
          <button 
            onClick={() => setViewMode(prev => prev === 'list' ? 'calendar' : 'list')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-white/40 hover:text-white transition-all active:scale-95 group"
            title={viewMode === 'list' ? "Switch to Calendar" : "Switch to List"}
          >
              <span className="text-[10px] font-medium uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity -mr-2 group-hover:mr-0 duration-300">
                {viewMode === 'list' ? 'Calendar' : 'List'}
              </span>
              {viewMode === 'list' ? <CalendarIcon className="w-3.5 h-3.5" /> : <ListIcon className="w-3.5 h-3.5" />}
          </button>
      </div>

      {/* Input Area - Context Aware */}
      <div className="relative mb-4 group/input flex-shrink-0">
        <form onSubmit={handleAddTask} className="relative flex items-center">
            <input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => !newTaskText && setIsInputFocused(false)}
                placeholder={viewMode === 'calendar' ? `Add task for ${selectedDate.toLocaleDateString([], { month: 'short', day: 'numeric'})}` : "Add new task"}
                className="w-full bg-transparent border-b border-white/5 text-sm font-light focus:outline-none py-2 px-1 placeholder-white/10 transition-all duration-500"
                style={{ borderColor: isInputFocused ? 'var(--accent-color)' : undefined }}
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

      {/* Calendar Grid */}
      {viewMode === 'calendar' && (
          <div className="mb-4 animate-fadeIn">
             <div className="flex items-center justify-between mb-2 px-1">
                <button onClick={() => changeMonth(-1)} className="text-white/30 hover:text-white transition-colors p-1 hover:bg-white/5 rounded"><ChevronLeftIcon className="w-3 h-3" /></button>
                <span className="text-xs font-medium tracking-widest uppercase text-white/70">
                    {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </span>
                <button onClick={() => changeMonth(1)} className="text-white/30 hover:text-white transition-colors p-1 hover:bg-white/5 rounded"><ChevronRightIcon className="w-3 h-3" /></button>
             </div>
             <div className="grid grid-cols-7 gap-1 text-center mb-1">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                    <span key={d} className="text-[9px] text-white/20 font-bold">{d}</span>
                ))}
             </div>
             <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((cell, idx) => {
                    if (!cell) return <div key={idx} className="aspect-square"></div>;
                    const isSelected = cell.dateStr === formatDate(selectedDate);
                    const isToday = cell.dateStr === formatDate(new Date());
                    const hasTasks = cell.tasks.length > 0;
                    
                    return (
                        <button
                            key={idx}
                            onClick={() => {
                                setSelectedDate(new Date(cell.dateStr + 'T00:00:00')); // Fix timezone issue roughly
                            }}
                            className={`aspect-square rounded-md flex flex-col items-center justify-center relative transition-all duration-300 hover:bg-white/5 group/day ${isSelected ? 'bg-white/10 ring-1 ring-white/20 shadow-inner' : ''}`}
                        >
                            <span className={`text-[10px] ${isSelected ? 'text-white font-semibold' : isToday ? 'text-[var(--accent-color)] font-bold' : 'text-white/50 font-light group-hover/day:text-white/80'}`}>
                                {cell.day}
                            </span>
                            {hasTasks && (
                                <div className="flex gap-0.5 mt-0.5">
                                    {cell.tasks.slice(0, 3).map(t => (
                                        <div key={t.id} className={`w-0.5 h-0.5 rounded-full ${priorityColors[t.priority]}`} />
                                    ))}
                                </div>
                            )}
                        </button>
                    )
                })}
             </div>
             <div className="my-3 h-[1px] bg-white/5 w-full"></div>
             <div className="text-[10px] uppercase tracking-widest text-white/30 mb-2 px-1 flex items-center justify-between">
                 <span>Tasks for {selectedDate.toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                 {viewMode === 'calendar' && selectedDate.toDateString() === new Date().toDateString() && <span className="text-[var(--accent-color)]">Today</span>}
             </div>
          </div>
      )}

      {/* Task List */}
      <ul className="space-y-1 overflow-visible flex-grow pb-2">
        {activeTasks.length === 0 && completedTasks.length === 0 ? (
             <div className="flex items-center justify-center h-16 text-white/20 text-xs font-light italic">
                 {viewMode === 'calendar' ? 'No tasks scheduled.' : 'No tasks yet.'}
             </div>
        ) : (
            <>
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
                    <button 
                        onClick={() => changePriority(task.id)} 
                        className={`flex-shrink-0 w-1.5 h-1.5 rounded-full mr-4 transition-all duration-500 opacity-40 group-hover:opacity-100 ${priorityColors[task.priority]}`}
                    />
                    
                    <div 
                        className="flex-shrink-0 mr-3 cursor-pointer relative group/check w-4 h-4 flex items-center justify-center"
                        onClick={() => toggleTask(task.id)}
                    >
                        <div className="w-3.5 h-3.5 rounded-full border border-white/10 transition-all duration-300 group-hover/check:border-white/50 group-hover/check:scale-110" />
                    </div>
                    
                    <div className="flex-grow min-w-0 flex flex-col">
                        {editingTaskId === task.id ? (
                        <input
                            type="text"
                            value={editingTaskText}
                            onChange={(e) => setEditingTaskText(e.target.value)}
                            onBlur={handleSaveEdit}
                            onKeyDown={handleEditKeyDown}
                            className="w-full bg-transparent border-b border-white/20 text-sm font-light focus:outline-none py-0"
                            style={{ borderColor: 'var(--accent-color)' }}
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
                        {/* Show due date if in list mode and it exists */}
                        {viewMode === 'list' && task.dueDate && (
                             <span className="text-[9px] text-white/30 mt-0.5">{new Date(task.dueDate + 'T12:00:00').toLocaleDateString(undefined, {month:'short', day:'numeric'})}</span>
                        )}
                    </div>
                    
                    <button onClick={() => deleteTask(task.id)} className="ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-white/10 hover:text-red-400">
                    <TrashIcon className="w-3.5 h-3.5" />
                    </button>
                </li>
                ))}
                
                {completedTasks.length > 0 && (
                <div className="pt-6 pb-2">
                    <div className="text-[9px] uppercase tracking-[0.25em] text-white/10 mb-2 pl-2 font-bold">Done</div>
                    {completedTasks.map((task) => (
                        <li 
                            key={task.id} 
                            className={`group flex items-center py-1.5 px-1 transition-all duration-300 ${draggedTaskId === task.id ? 'opacity-10' : 'opacity-30 hover:opacity-60'}`}
                            draggable
                            onDragStart={(e) => handleDragStart(e, task.id)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, task)}
                            onDragEnd={() => setDraggedTaskId(null)}
                        >
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
            </>
        )}
      </ul>
    </div>
  );
};

export default TasksWidget;
