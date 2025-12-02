
import React, { useState, useEffect, useMemo, useCallback, Suspense, lazy, useRef } from 'react';
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

// Helper hook for window size
function useWindowSize() {
    const [windowSize, setWindowSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 1200,
        height: typeof window !== 'undefined' ? window.innerHeight : 800,
    });
    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return windowSize;
}

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
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(0);
  const [draggedWidgetId, setDraggedWidgetId] = useState<WidgetId | null>(null);
  
  const { width } = useWindowSize();

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

  // Pagination Logic
  const pages = useMemo(() => {
    const activeWidgets = widgetOrder
      .map(id => allWidgets.find(w => w.id === id))
      .filter((w): w is Widget => !!w && w.id !== 'quote');

    // Determine grid capacity based on screen width
    let columns = 1;
    let maxRows = 3; // Default mobile rows

    if (width >= 1024) { // lg
        columns = 3;
        maxRows = 2; // Desktop usually fits 2 rows comfortably
    } else if (width >= 768) { // md
        columns = 2;
        maxRows = 3;
    }

    const unitsPerPage = columns * maxRows;
    const result: Widget[][] = [];
    let currentChunk: Widget[] = [];
    let currentCost = 0;

    activeWidgets.forEach(widget => {
        // Calculate effective cost of widget on current screen
        const rawSize = widgetSizes[widget.id] || 1;
        // On mobile/tablet, a size 3 widget might only span 1 or 2 cols effectively
        let effectiveSize = rawSize;
        if (width < 768) effectiveSize = 1; // Mobile: everything is 1 col wide
        else if (width < 1024) effectiveSize = Math.min(rawSize, 2); // Tablet: max 2 cols

        // If adding this widget exceeds page capacity, start new page
        if (currentCost + effectiveSize > unitsPerPage) {
            if (currentChunk.length > 0) {
                result.push(currentChunk);
                currentChunk = [];
                currentCost = 0;
            }
        }
        currentChunk.push(widget);
        currentCost += effectiveSize;
    });

    if (currentChunk.length > 0) {
        result.push(currentChunk);
    }

    return result.length > 0 ? result : [[]];
  }, [widgetOrder, widgetSizes, width]);

  // Ensure current page is valid
  useEffect(() => {
    if (currentPage >= pages.length) {
        setCurrentPage(Math.max(0, pages.length - 1));
    }
  }, [pages.length, currentPage]);

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

  // Wheel listener for page switching
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
        // Only switch if not scrolling inside a widget (simple check)
        const target = e.target as HTMLElement;
        if (target.closest('.overflow-y-auto')) return;

        if (e.deltaY > 50) {
            setCurrentPage(p => Math.min(p + 1, pages.length - 1));
        } else if (e.deltaY < -50) {
            setCurrentPage(p => Math.max(p - 1, 0));
        }
    };
    
    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, [pages.length]);


  return (
    <main 
        className="relative w-screen h-screen overflow-hidden transition-none select-none"
        style={{ 
          '--accent-color': themeSettings.accentColor,
          '--fg-color': '#e5e5e5',
          '--bg-color': '#0a0a0a',
        } as React.CSSProperties}
    >
      
      <div className="relative z-10 w-full h-full flex flex-col p-6 md:p-12 max-w-7xl mx-auto">
        
        {/* Header Section */}
        <header className={`flex-shrink-0 transition-all duration-700 mb-6 ${isFocusMode ? 'opacity-20 blur-sm' : 'opacity-100'}`}>
            <Greeting />
            <Clock clockFormat={clockFormat} />
            {widgetOrder.includes('quote') && (
                <QuoteDisplay quoteData={quoteData} isLoading={isQuoteLoading} onRefresh={refreshQuote} />
            )}
        </header>

        {/* Paginated Grid Area */}
        <div className={`flex-grow relative w-full transition-opacity duration-500 ${isFocusMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
             {pages.map((pageWidgets, pageIndex) => (
                <div 
                    key={pageIndex}
                    className={`absolute inset-0 w-full h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-500 transform ${
                        pageIndex === currentPage 
                            ? 'opacity-100 translate-x-0 pointer-events-auto' 
                            : pageIndex < currentPage 
                                ? 'opacity-0 -translate-x-10 pointer-events-none' 
                                : 'opacity-0 translate-x-10 pointer-events-none'
                    }`}
                    style={{ gridTemplateRows: 'repeat(auto-fill, minmax(180px, 1fr))', alignContent: 'start' }}
                >
                    {pageWidgets.map((widget) => {
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
                                className={`${colSpanClass} h-full max-h-[300px]`}
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
             ))}
        </div>
        
        {/* Pagination Dots */}
        {pages.length > 1 && !isFocusMode && (
            <div className="flex justify-center space-x-3 mb-4 mt-2">
                {pages.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentPage(idx)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            idx === currentPage ? 'bg-[var(--accent-color)] w-6' : 'bg-white/20 hover:bg-white/40'
                        }`}
                        aria-label={`Go to page ${idx + 1}`}
                    />
                ))}
            </div>
        )}

      </div>

      {/* Footer Controls */}
      <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 flex gap-4 z-50 opacity-40 hover:opacity-100 transition-opacity duration-300">
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
