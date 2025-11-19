
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Task, TaskPriority } from '../types';
import { PlusIcon, TrashIcon } from './icons';

type SortBy = 'priority' | 'dueDate' | 'createdAt' | 'manual';

const priorityColors: Record<TaskPriority, string> = {
  high: 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.4)]',
  medium: 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.4)]',
  low: 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.4)]',
};

const sortLabels: Record<SortBy, string> = {
  priority: 'Priority',
  dueDate: 'Date',
  createdAt: 'Recent',
  manual: 'Manual'
};
const sortOptions: SortBy[] = ['priority', 'dueDate', 'createdAt', 'manual'];

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
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);

  useEffect(() => {
    // One-time migration
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
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setEditingTaskId(null);
      setEditingTaskText('');
    }
  };
  
  // Drag and Drop Handlers
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
    if (!draggedTask) return;

    if (draggedTask.completed !== targetTask.completed) {
      return;
    }

    let newTasks = [...tasks];
    const draggedIndex = newTasks.findIndex(t => t.id === draggedId);
    const targetIndex = newTasks.findIndex(t => t.id === targetTask.id);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const [removed] = newTasks.splice(draggedIndex, 1);
    newTasks.splice(targetIndex, 0, removed);

    setTasks(newTasks);
    setSortBy('manual'); 
  };
  
  const handleDragEnd = () => {
    setDraggedTaskId(null);
  };

  const handleSortChange = () => {
    const currentIndex = sortOptions.indexOf(sortBy);
    const nextIndex = (currentIndex + 1) % sortOptions.length;
    setSortBy(sortOptions[nextIndex]);
  };


  const sortedTasks = useMemo(() => {
    const priorityOrder: Record<TaskPriority, number> = { high: 1, medium: 2, low: 3 };
    return [...tasks].sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      if (sortBy === 'manual') {
        return 0;
      }
      switch (sortBy) {
        case 'priority':
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case 'createdAt':
          return b.createdAt - a.createdAt;
        case 'dueDate':
           return b.createdAt - a.createdAt; 
        default:
          return 0;
      }
    });
  }, [tasks, sortBy]);

  const activeTasks = sortedTasks.filter(task => !task.completed);
  const completedTasks = sortedTasks.filter(task => task.completed);

  return (
    <div className="flex flex-col h-full">
      <div className="relative mb-4 group/input">
        <form onSubmit={handleAddTask} className="relative flex items-center">
            <input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => {
                    if (!newTaskText) setIsInputFocused(false);
                }}
                placeholder="Add a new task..."
                className="w-full bg-transparent border-b border-white/10 text-sm font-light focus:border-white/50 focus:outline-none py-2 pl-0 placeholder-white/20 transition-all duration-300"
            />
            <div className={`absolute right-0 flex items-center transition-all duration-300 ${isInputFocused || newTaskText ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 pointer-events-none'}`}>
                 <button 
                      type="button"
                      onClick={() => setNewPriority(priorityCycle[newPriority])}
                      className={`w-2 h-2 rounded-full mr-2 ${priorityColors[newPriority]} transition-transform hover:scale-125`}
                      title="Priority"
                   />
                 <button type="submit" className="text-white/50 hover:text-white transition-colors">
                    <PlusIcon className="w-4 h-4" />
                 </button>
            </div>
        </form>
      </div>

      <div className="flex items-center justify-end mb-2 text-[10px] uppercase tracking-wider text-white/30 font-medium">
          <button onClick={handleSortChange} className="hover:text-white/80 transition-colors flex items-center gap-1" aria-label="Change sort order">
            <span>Sort:</span> <span className="text-white/50">{sortLabels[sortBy]}</span>
          </button>
      </div>

      <ul className="space-y-1 overflow-y-auto flex-grow pr-1 -mr-2 pb-2 scrollbar-hide">
        {activeTasks.map((task) => {
          const isBeingDragged = draggedTaskId === task.id;
          return (
            <li 
              key={task.id} 
              className={`flex items-center group py-2 pl-1 pr-2 rounded-lg transition-all duration-300 hover:bg-white/5 ${isBeingDragged ? 'opacity-30' : 'opacity-100'}`}
              draggable={!task.completed}
              onDragStart={(e) => handleDragStart(e, task.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, task)}
              onDragEnd={handleDragEnd}
            >
            <div className="mr-3 flex items-center justify-center">
                <button 
                    onClick={() => changePriority(task.id)} 
                    className={`w-1.5 h-1.5 rounded-full cursor-pointer transition-all duration-300 opacity-40 group-hover:opacity-100 hover:scale-150 ${priorityColors[task.priority]}`} 
                    aria-label="Change priority" 
                />
            </div>
            
            <div className="flex-grow min-w-0 flex items-center">
                <div 
                        className="mr-3 relative cursor-pointer group/check w-4 h-4 flex items-center justify-center"
                        onClick={() => toggleTask(task.id)}
                >
                    <div className="w-3.5 h-3.5 rounded-full border border-white/20 transition-all duration-300 group-hover/check:border-white/60 group-hover/check:scale-110" />
                </div>
                
                {editingTaskId === task.id ? (
                <input
                    type="text"
                    value={editingTaskText}
                    onChange={(e) => setEditingTaskText(e.target.value)}
                    onBlur={handleSaveEdit}
                    onKeyDown={handleEditKeyDown}
                    className="w-full bg-transparent border-b border-white/40 text-sm font-light focus:outline-none py-0"
                    autoFocus
                />
                ) : (
                <span
                    className="text-sm font-light text-white/80 cursor-pointer leading-normal truncate w-full transition-colors hover:text-white"
                    onClick={() => handleStartEditing(task)}
                >
                    {task.text}
                </span>
                )}
            </div>
            <button onClick={() => deleteTask(task.id)} className="ml-2 p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-white/10 transition-all duration-300" aria-label="Delete task">
              <TrashIcon className="w-3 h-3 text-white/30 hover:text-red-400" />
            </button>
          </li>
        )}}
        
        {completedTasks.length > 0 && (
          <>
            <div className="my-4 border-t border-white/5 w-1/3 mx-auto" />
            {completedTasks.map((task) => (
                 <li 
                  key={task.id} 
                  className="flex items-center group py-1 pl-1 pr-2 rounded-lg transition-all duration-300 opacity-40 hover:opacity-60"
                >
                 <div className="mr-3 w-1.5 h-1.5 flex items-center justify-center">
                     <div className="w-1 h-1 rounded-full bg-white/20" />
                 </div>
                
                <div 
                    className="mr-3 cursor-pointer w-4 h-4 flex items-center justify-center"
                    onClick={() => toggleTask(task.id)}
                >
                     <div className="w-3.5 h-3.5 rounded-full border border-white/10 bg-white/5 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                     </div>
                </div>

                <div className="flex-grow min-w-0">
                    <span className="text-sm font-light line-through text-white/50 decoration-white/20">
                      {task.text}
                    </span>
                </div>
                <button onClick={() => deleteTask(task.id)} className="ml-2 p-1 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all">
                  <TrashIcon className="w-3 h-3" />
                </button>
              </li>
            ))}
          </>
        )}
      </ul>
    </div>
  );
};

export default TasksWidget;
