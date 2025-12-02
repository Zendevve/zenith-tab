import React, { useState, useEffect, useMemo, useCallback, Suspense, lazy } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { WidgetId, Widget, Quote, ThemeSettings } from './types';
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
const LinksWidget = lazy(() => import('./components/LinksWidget'));
const SearchWidget = lazy(() => import('./components/SearchWidget'));

const allWidgets: Widget[] = [
  { id: 'search', name: 'Search' },
  { id: 'links', name: 'Links' },
  { id: 'tasks', name: 'Tasks' },
  { id: 'notes', name: 'Notes' },
  { id: 'weather', name: 'Weather' },
  { id: 'ai_assistant', name: 'Assistant' },
  { id: 'quote', name: 'Quote' },
];

const widgetMap: Record<WidgetId, React.LazyExoticComponent<React.FC<{}>>> = {
  tasks: TasksWidget,
  notes: NotesWidget,
  weather: WeatherWidget,
  ai_assistant: AIAssistantWidget,
  links: LinksWidget,
  search: SearchWidget,
  quote: ({ children }) => <>{children}</> as any,
};

const App: React.FC = () => {
  const [quoteData, setQuoteData] = useState<Quote | null>(null);
  const [isQuoteLoading, setIsQuoteLoading] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  
  const [widgetOrder, setWidgetOrder] = useLocalStorage<WidgetId[]>('widget_order', ['search', 'links', 'quote', 'tasks', 'weather']);
  const [widgetSizes, setWidgetSizes] = useLocalStorage<Record<WidgetId, number>>('widget_sizes', { 
      tasks: 1, 
      notes: 1, 
      weather: 1, 
      quote: 1, 
      ai_assistant: 2,
      links: 1,
      search: 2 
  });
  const [clockFormat, setClockFormat] = useLocalStorage<'12h' | '24h'>('clock_format', '24h');
  const [themeSettings, setThemeSettings] = useLocalStorage<ThemeSettings>('theme_settings', { accentColor: '#ffffff', gridVisible: true });
  
  const [draggedWidgetId, setDraggedWidgetId] = useState<WidgetId | null>(null);

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
      setWidgetOrder(prev => prev.filter(id => id !== idToRemove));
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

  return (
    <main 
        className="relative w-screen h-screen overflow-hidden transition-none"
        style={{ 
          '--accent-color': themeSettings.accentColor,
          '--fg-color': '#e5e5e5',
          '--bg-color': '#0a0a0a',
        } as React.CSSProperties}
    >
      
      <div className="relative z-10 w-full h-full flex flex-col p-6 md:p-12 overflow-hidden max-w-7xl mx-auto">
        
        {/* Header Section */}
        <header className={`flex-shrink-0 transition-all duration-700 ${isFocusMode ? 'opacity-20 blur-sm' : 'opacity-100'}`}>
            <Greeting />
            <Clock clockFormat={clockFormat} />
            {widgetOrder.includes('quote') && (
                <QuoteDisplay quoteData={quoteData} isLoading={isQuoteLoading} onRefresh={refreshQuote} />
            )}
        </header>

        {/* Minimal Grid */}
        {activeGridWidgets.length > 0 && (
          <div 
            className={`w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20 flex-grow transition-opacity duration-500 ${isFocusMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} 
            style={{ overflowY: 'auto' }}
          >
            {activeGridWidgets.map((widget) => {
                const WidgetContent = widgetMap[widget.id];
                const size = widgetSizes[widget.id] || 1;
                const colSpanClass = {
                    1: 'col-span-1',
                    2: 'md:col-span-2 col-span-1',
                    3: 'md:col-span-2 lg:col-span-3 col-span-1',
                }[size] || 'col-span-1';

                return (
                    <div
                        key={widget.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, widget.id)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, widget.id)}
                        className={`${colSpanClass} h-full min-h-[160px]`}
                    >
                        <WidgetComponent
                            title={widget.name}
                            widgetId={widget.id}
                            size={size}
                            onSizeChange={handleSizeChange}
                            onClose={handleCloseWidget}
                        >
                            <Suspense fallback={<div className="animate-pulse bg-white/5 h-full w-full rounded-lg"></div>}>
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
      <div className="fixed bottom-6 right-6 flex gap-4 z-50 opacity-20 hover:opacity-100 transition-opacity duration-300">
            <button
            onClick={() => setIsFocusMode(prev => !prev)}
            className="p-2 hover:text-[var(--accent-color)] transition-colors"
            title="Focus Mode"
            >
             <ZenIcon className="w-5 h-5" />
            </button>
            <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 hover:text-[var(--accent-color)] transition-colors"
            title="Settings"
            >
            <SettingsIcon className="w-5 h-5" />
            </button>
      </div>

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        allWidgets={allWidgets}
        enabledWidgets={widgetOrder}
        setEnabledWidgets={setWidgetOrder}
        themeSettings={themeSettings}
        setThemeSettings={setThemeSettings}
      />
    </main>
  );
};

export default App;