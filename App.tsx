
import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { WidgetId, Widget, Quote, BackgroundSetting } from './types';
import fetchInspirationalQuote from './services/geminiService';
import Clock from './components/Clock';
import QuoteDisplay from './components/Quote';
import SettingsPanel from './components/Settings';
import { SettingsIcon } from './components/icons';

const TasksWidget = lazy(() => import('./components/TasksWidget'));
const NotesWidget = lazy(() => import('./components/NotesWidget'));
const WeatherWidget = lazy(() => import('./components/WeatherWidget'));

const allWidgets: Widget[] = [
  { id: 'tasks', name: 'Tasks' },
  { id: 'notes', name: 'Notes' },
  { id: 'weather', name: 'Weather' },
  { id: 'quote', name: 'Quote' },
];

const widgetMap: Record<WidgetId, React.LazyExoticComponent<React.FC<{}>>> = {
  tasks: TasksWidget,
  notes: NotesWidget,
  weather: WeatherWidget,
  quote: ({ children }) => <>{children}</> as any, // Quote is special, handled separately
};


const App: React.FC = () => {
  const [bgUrl, setBgUrl] = useState('');
  const [quoteData, setQuoteData] = useState<Quote | null>(null);
  const [isQuoteLoading, setIsQuoteLoading] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const [enabledWidgets, setEnabledWidgets] = useLocalStorage<WidgetId[]>('enabled_widgets', ['quote', 'tasks']);
  const [backgroundSetting, setBackgroundSetting] = useLocalStorage<BackgroundSetting>('background_setting', { type: 'random' });

  useEffect(() => {
    // Set background based on user setting
    if (backgroundSetting.type === 'random') {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setBgUrl(`https://picsum.photos/${width}/${height}?grayscale&blur=2`);
    } else if (backgroundSetting.type === 'custom') {
      setBgUrl(backgroundSetting.dataUrl);
    } else { // gallery
      setBgUrl(backgroundSetting.url);
    }
    
    // Fetch quote only if the widget is enabled
    if (enabledWidgets.includes('quote')) {
      setIsQuoteLoading(true);
      fetchInspirationalQuote().then(data => {
        setQuoteData(data);
        setIsQuoteLoading(false);
      });
    } else {
        setQuoteData(null);
        setIsQuoteLoading(false);
    }
  }, [backgroundSetting]); // Re-run only when background setting changes to update background instantly. Initial load is also covered.

  const activeWidgets = useMemo(() => {
    return allWidgets.filter(w => enabledWidgets.includes(w.id) && w.id !== 'quote');
  }, [enabledWidgets]);

  return (
    <main className="relative w-screen h-screen overflow-hidden text-white font-sans">
      <div 
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000" 
        style={{ backgroundImage: `url(${bgUrl})`, opacity: bgUrl ? 1 : 0 }}
      />
      <div className="absolute inset-0 bg-black/40" />
      
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-4 md:p-8">
        <div className="flex flex-col items-center justify-center space-y-6 flex-grow text-center">
            <Clock />
            {enabledWidgets.includes('quote') && <QuoteDisplay quoteData={quoteData} isLoading={isQuoteLoading} />}
        </div>
        
        {activeWidgets.length > 0 && (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-8 max-w-6xl">
            {activeWidgets.map(widget => {
                const WidgetComponent = widgetMap[widget.id];
                return (
                    <Suspense key={widget.id} fallback={<div className="bg-black/20 backdrop-blur-md rounded-2xl p-4 animate-pulse h-48"></div>}>
                        <WidgetComponent />
                    </Suspense>
                )
            })}
          </div>
        )}
      </div>

      <button
        onClick={() => setIsSettingsOpen(true)}
        className="fixed bottom-6 right-6 z-20 p-4 bg-black/30 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all duration-300 shadow-lg border border-white/20"
        aria-label="Open Settings"
      >
        <SettingsIcon className="w-6 h-6" />
      </button>

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        allWidgets={allWidgets}
        enabledWidgets={enabledWidgets}
        setEnabledWidgets={setEnabledWidgets}
        backgroundSetting={backgroundSetting}
        setBackgroundSetting={setBackgroundSetting}
      />
    </main>
  );
};

export default App;