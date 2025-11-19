
import React, { useState, useEffect, useMemo, useCallback, Suspense, lazy } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { WidgetId, Widget, Quote, BackgroundSetting } from './types';
import { fetchInspirationalQuote } from './services/geminiService';
import Clock from './components/Clock';
import QuoteDisplay from './components/Quote';
import SettingsPanel from './components/Settings';
import WidgetComponent from './components/Widget';
import { SettingsIcon, ZenIcon } from './components/icons';

const TasksWidget = lazy(() => import('./components/TasksWidget'));
const NotesWidget = lazy(() => import('./components/NotesWidget'));
const WeatherWidget = lazy(() => import('./components/WeatherWidget'));
const Greeting = lazy(() => import('./components/Greeting'));
const AIAssistantWidget = lazy(() => import('./components/AIAssistantWidget'));

const allWidgets: Widget[] = [
  { id: 'tasks', name: 'Tasks' },
  { id: 'notes', name: 'Notes' },
  { id: 'weather', name: 'Weather' },
  { id: 'ai_assistant', name: 'AI Assistant' },
  { id: 'quote', name: 'Quote' },
];

const widgetMap: Record<WidgetId, React.LazyExoticComponent<React.FC<{}>>> = {
  tasks: TasksWidget,
  notes: NotesWidget,
  weather: WeatherWidget,
  ai_assistant: AIAssistantWidget,
  quote: ({ children }) => <>{children}</> as any,
};


const App: React.FC = () => {
  const [bg1, setBg1] = useState('');
  const [bg2, setBg2] = useState('');
  const [activeBg, setActiveBg] = useState<'bg1' | 'bg2'>('bg1');
  const [isInitialBgLoaded, setIsInitialBgLoaded] = useState(false);
  const [isBgLoading, setIsBgLoading] = useState(true);

  const [quoteData, setQuoteData] = useState<Quote | null>(null);
  const [isQuoteLoading, setIsQuoteLoading] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  
  const [widgetOrder, setWidgetOrder] = useLocalStorage<WidgetId[]>('widget_order', ['quote', 'tasks']);
  const [widgetSizes, setWidgetSizes] = useLocalStorage<Record<WidgetId, number>>('widget_sizes', { tasks: 1, notes: 1, weather: 1, quote: 1, ai_assistant: 2 });
  const [backgroundSetting, setBackgroundSetting] = useLocalStorage<BackgroundSetting>('background_setting', { type: 'random' });
  const [clockFormat, setClockFormat] = useLocalStorage<'12h' | '24h'>('clock_format', '12h');
  const [draggedWidgetId, setDraggedWidgetId] = useState<WidgetId | null>(null);
  const [exitingWidgetIds, setExitingWidgetIds] = useState<Set<WidgetId>>(new Set());


  useEffect(() => {
    try {
        const oldEnabledRaw = localStorage.getItem('enabled_widgets');
        if (oldEnabledRaw) {
            const oldEnabled = JSON.parse(oldEnabledRaw);
            if (Array.isArray(oldEnabled)) {
                setWidgetOrder(oldEnabled);
                localStorage.removeItem('enabled_widgets');
            }
        }
    } catch (e) {
        console.error("Failed to migrate old widget settings", e);
    }
  }, []);

  useEffect(() => {
    setIsBgLoading(true);

    let newUrl = '';
    if (backgroundSetting.type === 'random') {
      const width = window.innerWidth;
      const height = window.innerHeight;
      newUrl = `https://picsum.photos/${width}/${height}?grayscale&blur=2&t=${Date.now()}`;
    } else if (backgroundSetting.type === 'custom') {
      newUrl = backgroundSetting.dataUrl;
    } else { // gallery
      newUrl = backgroundSetting.url;
    }

    if (!newUrl) {
      setIsBgLoading(false);
      return;
    }

    const img = new Image();
    img.src = newUrl;
    
    img.onload = () => {
      if (!isInitialBgLoaded) {
        setBg1(newUrl);
        setIsInitialBgLoaded(true);
      } else {
        if (activeBg === 'bg1') {
          if (newUrl !== bg2) { setBg2(newUrl); setActiveBg('bg2'); }
        } else {
          if (newUrl !== bg1) { setBg1(newUrl); setActiveBg('bg1'); }
        }
      }
      setIsBgLoading(false);
    };

    img.onerror = () => {
      console.error("Failed to load background image:", newUrl);
      setIsBgLoading(false);
    };
  }, [backgroundSetting]); 

  const refreshQuote = useCallback(() => {
    if (widgetOrder.includes('quote')) {
      setIsQuoteLoading(true);
      fetchInspirationalQuote().then(data => {
        setQuoteData(data);
        setIsQuoteLoading(false);
      });
    } else {
        setQuoteData(null);
        setIsQuoteLoading(false);
    }
  }, [widgetOrder]);
  
  useEffect(() => {
    refreshQuote();
  }, [refreshQuote]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key.toLowerCase() === 'f') {
            setIsFocusMode(prev => !prev);
        }
        if (e.key === 'Escape') {
            setIsFocusMode(false);
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activeGridWidgets = useMemo(() => {
    return widgetOrder
      .map(id => allWidgets.find(w => w.id === id))
      .filter((w): w is Widget => !!w && w.id !== 'quote');
  }, [widgetOrder]);
  
  const handleSizeChange = (id: WidgetId, newSize: number) => {
    setWidgetSizes(prev => ({
        ...prev,
        [id]: Math.max(1, Math.min(3, newSize))
    }));
  };

  const handleCloseWidget = (idToRemove: WidgetId) => {
    setExitingWidgetIds(prev => new Set(prev).add(idToRemove));
    setTimeout(() => {
      setWidgetOrder(prev => prev.filter(id => id !== idToRemove));
      setExitingWidgetIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(idToRemove);
        return newSet;
      });
    }, 500); 
  };

  const handleDragStart = (e: React.DragEvent, widgetId: WidgetId) => {
      setDraggedWidgetId(widgetId);
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', widgetId);
  };

  const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetWidgetId: WidgetId) => {
      e.preventDefault();
      const draggedId = e.dataTransfer.getData('text/plain') as WidgetId;
      setDraggedWidgetId(null);

      if (!draggedId || draggedId === targetWidgetId) return;

      setWidgetOrder(currentOrder => {
          const draggableWidgets = currentOrder.filter(id => id !== 'quote');
          const nonDraggableWidgets = currentOrder.filter(id => id === 'quote');
          
          const draggedIndex = draggableWidgets.indexOf(draggedId);
          const targetIndex = draggableWidgets.indexOf(targetWidgetId);

          if (draggedIndex === -1 || targetIndex === -1) return currentOrder;

          const reordered = [...draggableWidgets];
          const [removed] = reordered.splice(draggedIndex, 1);
          reordered.splice(targetIndex, 0, removed);

          return [...nonDraggableWidgets, ...reordered];
      });
  };

  const handleDragEnd = () => {
      setDraggedWidgetId(null);
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden text-white font-sans bg-black selection:bg-white/20 selection:text-white">
      {/* Background Layer */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-[2000ms] ease-in-out" 
        style={{ backgroundImage: `url(${bg1})`, opacity: activeBg === 'bg1' ? 1 : 0, transform: 'scale(1.05)' }}
      />
      <div 
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-[2000ms] ease-in-out" 
        style={{ backgroundImage: `url(${bg2})`, opacity: activeBg === 'bg2' ? 1 : 0, transform: 'scale(1.05)' }}
      />
      {/* Minimal Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/40 pointer-events-none backdrop-blur-[1px]" />
      
      <div className="relative z-10 w-full h-full flex flex-col items-center p-8 md:p-16 overflow-hidden">
        {/* Center Content - Greeting, Clock, Quote */}
        <div className={`flex flex-col items-center justify-center space-y-6 flex-grow text-center w-full max-w-5xl transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${isFocusMode ? 'scale-105' : 'scale-100'}`}>
            <Suspense fallback={<div className="h-10" />}>
              <div className={`transition-all duration-1000 ease-out delay-100 ${isFocusMode ? 'opacity-80' : 'opacity-100'}`}>
                  <Greeting />
              </div>
            </Suspense>
            
            <div className="py-2">
                <Clock clockFormat={clockFormat} />
            </div>
            
            <div className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] w-full ${isFocusMode ? 'opacity-0 pointer-events-none translate-y-4 blur-md' : 'opacity-100'}`}>
              {widgetOrder.includes('quote') && <QuoteDisplay quoteData={quoteData} isLoading={isQuoteLoading} onRefresh={refreshQuote} />}
            </div>
        </div>
        
        {/* Widgets Grid */}
        {activeGridWidgets.length > 0 && (
          <div 
            className={`w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-10 max-w-6xl transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${isFocusMode ? 'opacity-0 pointer-events-none translate-y-20 blur-lg scale-95' : 'opacity-100 translate-y-0 scale-100'}`} 
            style={{ maxHeight: '40vh' }}
          >
            {activeGridWidgets.map((widget, index) => {
                const WidgetContent = widgetMap[widget.id];
                const isBeingDragged = draggedWidgetId === widget.id;
                const isExiting = exitingWidgetIds.has(widget.id);
                const size = widgetSizes[widget.id] || 1;
                const colSpanClass = {
                    1: 'col-span-1',
                    2: 'md:col-span-2 lg:col-span-2 col-span-1',
                    3: 'md:col-span-2 lg:col-span-3 col-span-1',
                }[size] || 'col-span-1';

                return (
                    <div
                        key={widget.id}
                        draggable={!isExiting}
                        onDragStart={(e) => handleDragStart(e, widget.id)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, widget.id)}
                        onDragEnd={handleDragEnd}
                        className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isExiting ? 'opacity-0 scale-90 blur-md' : ''} ${isBeingDragged ? 'opacity-30 scale-95' : 'opacity-100'} ${colSpanClass} ${!isExiting ? 'cursor-grab active:cursor-grabbing' : ''}`}
                        style={{ animation: !isExiting ? `fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 100}ms forwards` : undefined, opacity: 0 }}
                    >
                        <WidgetComponent
                            title={widget.name}
                            widgetId={widget.id}
                            size={size}
                            onSizeChange={handleSizeChange}
                            onClose={handleCloseWidget}
                        >
                            <Suspense fallback={<div className="bg-white/5 rounded-3xl animate-pulse h-48"></div>}>
                                <WidgetContent />
                            </Suspense>
                        </WidgetComponent>
                    </div>
                )
            })}
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <button
          onClick={() => setIsFocusMode(prev => !prev)}
          className={`w-10 h-10 flex items-center justify-center rounded-full text-white transition-all duration-500 backdrop-blur-md border shadow-2xl
            ${isFocusMode ? 'bg-white/20 border-white/30 rotate-180' : 'bg-black/30 border-white/5 hover:bg-white/10'}`}
          aria-label="Toggle Focus Mode (F)"
          title="Zen Mode"
        >
          <ZenIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className={`w-10 h-10 flex items-center justify-center bg-black/30 backdrop-blur-md rounded-full text-white hover:bg-white/10 transition-all duration-300 shadow-2xl border border-white/5 ${isFocusMode ? 'translate-y-20 opacity-0' : ''}`}
          aria-label="Open Settings"
          title="Settings"
        >
          <SettingsIcon className="w-4 h-4" />
        </button>
      </div>

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        allWidgets={allWidgets}
        enabledWidgets={widgetOrder}
        setEnabledWidgets={setWidgetOrder}
        backgroundSetting={backgroundSetting}
        setBackgroundSetting={setBackgroundSetting}
        clockFormat={clockFormat}
        setClockFormat={setClockFormat}
      />
    </main>
  );
};

export default App;
