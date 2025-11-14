
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Task, TaskPriority } from '../types';
import { PlusIcon, TrashIcon } from './icons';

type SortBy = 'priority' | 'dueDate' | 'createdAt' | 'manual';

const priorityColors: Record<TaskPriority, string> = {
  high: 'bg-red-500',
  medium: 'bg-amber-500',
  low: 'bg-blue-500',
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
  const [newDueDate, setNewDueDate] = useState('');
  const [sortBy, setSortBy] = useLocalStorage<SortBy>('tasks_sort_by', 'priority');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskText, setEditingTaskText] = useState('');
  const [editingDueDateTaskId, setEditingDueDateTaskId] = useState<string | null>(null);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const addTaskInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAdding) {
      addTaskInputRef.current?.focus();
    }
  }, [isAdding]);

  useEffect(() => {
    // One-time migration for tasks from older versions
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
        dueDate: newDueDate || null,
      };
      setTasks([newTask, ...tasks]);
      setNewTaskText('');
      setNewPriority('medium');
      setNewDueDate('');
      setIsAdding(false);
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
    setEditingDueDateTaskId(null); // Close due date editor if open
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
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e: React.DragEvent, targetTask: Task) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/plain');
    setDraggedTaskId(null);

    if (draggedId === targetTask.id) return;
    
    const draggedTask = tasks.find(t => t.id === draggedId);
    if (!draggedTask) return;

    // Prevent dragging between completed and uncompleted sections
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
    setSortBy('manual'); // Switch to manual sorting after a drop
  };
  
  const handleDragEnd = () => {
    setDraggedTaskId(null);
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
          if (a.dueDate && b.dueDate) return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          if (a.dueDate) return -1;
          if (b.dueDate) return 1;
          return b.createdAt - a.createdAt; // fallback for items without due date
        default:
          return 0;
      }
    });
  }, [tasks, sortBy]);

  return (
    <div className="flex flex-col h-full">
      <div className="mb-3">
        {isAdding ? (
          <div className="p-3 bg-white/10 rounded-lg animate-[fadeIn_0.2s_ease-out]">
            <form onSubmit={handleAddTask}>
              <input
                ref={addTaskInputRef}
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Escape') setIsAdding(false); }}
                placeholder="What needs to be done?"
                className="w-full bg-transparent text-base focus:outline-none mb-2 placeholder-white/60"
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center space-x-2">
                    {(['low', 'medium', 'high'] as TaskPriority[]).map((p) => (
                      <button key={p} type="button" onClick={() => setNewPriority(p)} className={`w-4 h-4 rounded-full ${priorityColors[p]} transition-all duration-200 ${newPriority === p ? 'ring-2 ring-offset-2 ring-offset-gray-800 ring-white/80' : 'opacity-40 hover:opacity-80'}`} aria-label={`Set priority to ${p}`} />
                    ))}
                  </div>
                  <input type="date" value={newDueDate} onChange={(e) => setNewDueDate(e.target.value)} className="bg-white/10 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-white/50" style={{colorScheme: 'dark'}} aria-label="Due date" />
                </div>
                <div className="flex items-center space-x-2">
                  <button type="button" onClick={() => setIsAdding(false)} className="px-3 py-1 rounded-md text-sm text-white/80 hover:bg-white/20 transition-colors">Cancel</button>
                  <button type="submit" className="px-3 py-1 rounded-md text-sm bg-blue-500 hover:bg-blue-600 transition-colors font-semibold">Add Task</button>
                </div>
              </div>
            </form>
          </div>
        ) : (
          <button onClick={() => setIsAdding(true)} className="flex items-center w-full p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm text-white/80 hover:text-white">
            <PlusIcon className="w-4 h-4 mr-2" />
            Add a task
          </button>
        )}
      </div>
      <div className="flex items-center justify-end space-x-3 mb-2 text-xs text-white/70">
          <span className="font-medium">Sort by:</span>
          <button onClick={() => setSortBy('manual')} className={`hover:text-white transition-colors ${sortBy === 'manual' ? 'text-white font-bold' : ''}`}>Manual</button>
          <button onClick={() => setSortBy('priority')} className={`hover:text-white transition-colors ${sortBy === 'priority' ? 'text-white font-bold' : ''}`}>Priority</button>
          <button onClick={() => setSortBy('dueDate')} className={`hover:text-white transition-colors ${sortBy === 'dueDate' ? 'text-white font-bold' : ''}`}>Due Date</button>
          <button onClick={() => setSortBy('createdAt')} className={`hover:text-white transition-colors ${sortBy === 'createdAt' ? 'text-white font-bold' : ''}`}>Newest</button>
      </div>
      <ul className="space-y-2 overflow-y-auto flex-grow pr-1">
        {sortedTasks.map((task) => {
          const isBeingDragged = draggedTaskId === task.id;
          return (
            <li 
              key={task.id} 
              className={`flex items-center group bg-white/5 p-2 rounded-lg transition-all duration-200 ${isBeingDragged ? 'opacity-30' : 'opacity-100'}`}
              draggable={!task.completed}
              onDragStart={(e) => handleDragStart(e, task.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, task)}
              onDragEnd={handleDragEnd}
            >
            <button onClick={() => changePriority(task.id)} className={`w-2 h-6 rounded-full mr-3 cursor-pointer transition-all duration-200 group-hover:scale-110 flex-shrink-0 ${priorityColors[task.priority]}`} aria-label={`Current priority: ${task.priority}. Click to change.`} />
            <input type="checkbox" checked={task.completed} onChange={() => toggleTask(task.id)} className="mr-3 h-4 w-4 rounded bg-white/20 border-white/30 text-blue-400 focus:ring-blue-400 flex-shrink-0" />
            <div className="flex-grow">
              {editingTaskId === task.id ? (
                <input
                  type="text"
                  value={editingTaskText}
                  onChange={(e) => setEditingTaskText(e.target.value)}
                  onBlur={handleSaveEdit}
                  onKeyDown={handleEditKeyDown}
                  className="w-full bg-white/20 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                  autoFocus
                />
              ) : (
                <>
                  <span
                    className={`text-sm transition-all duration-300 ${task.completed ? 'line-through text-white/50' : 'cursor-pointer'}`}
                    onClick={() => handleStartEditing(task)}
                  >
                    {task.text}
                  </span>
                  <div className="mt-1 h-5"> {/* Fixed height container to prevent layout shift */}
                    {editingDueDateTaskId === task.id ? (
                      <input
                        type="date"
                        value={task.dueDate || ''}
                        onChange={(e) => {
                          setTasks(tasks.map(t => t.id === task.id ? { ...t, dueDate: e.target.value || null } : t));
                        }}
                        onBlur={() => setEditingDueDateTaskId(null)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === 'Escape') {
                            setEditingDueDateTaskId(null);
                          }
                        }}
                        className="bg-white/20 rounded px-2 py-0.5 text-xs focus:outline-none focus:ring-2 focus:ring-white/50"
                        style={{colorScheme: 'dark'}}
                        autoFocus
                      />
                    ) : (
                      !task.completed && (
                        task.dueDate ? (
                          <div
                            role="button"
                            tabIndex={0}
                            aria-label={`Change due date for ${task.text}`}
                            onClick={() => { if (!task.completed) setEditingDueDateTaskId(task.id); }}
                            onKeyDown={(e) => { if (e.key === 'Enter' && !task.completed) setEditingDueDateTaskId(task.id); }}
                            className="text-xs text-amber-400/80 cursor-pointer hover:text-amber-300 w-fit"
                          >
                            Due: {new Date(task.dueDate + 'T00:00:00').toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                          </div>
                        ) : (
                          <button
                            onClick={() => { if (!task.completed) setEditingDueDateTaskId(task.id); }}
                            className="text-xs text-white/50 opacity-0 group-hover:opacity-100 hover:text-white transition-opacity"
                            aria-label={`Add due date for ${task.text}`}
                          >
                            Add due date
                          </button>
                        )
                      )
                    )}
                  </div>
                </>
              )}
            </div>
            <button onClick={() => deleteTask(task.id)} className="ml-2 p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-500/50 transition-all" aria-label={`Delete task: ${task.text}`}>
              <TrashIcon className="w-4 h-4 text-white/70" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TasksWidget;
