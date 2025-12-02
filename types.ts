
export type WidgetId = 'tasks' | 'notes' | 'weather' | 'quote' | 'ai_assistant' | 'links' | 'search';

export type BackgroundSetting = 
  | { type: 'random' } 
  | { type: 'gallery', id: string, url: string } 
  | { type: 'custom', dataUrl: string }
  | { type: 'color', color: string };

export type FontOption = 'Inter' | 'Roboto Mono' | 'Playfair Display' | 'Lato' | 'Montserrat';

export interface ThemeSettings {
  accentColor: string;
  glassOpacity: number; // 0.0 to 1.0
}

export interface Widget {
  id: WidgetId;
  name: string;
}

export type TaskPriority = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: TaskPriority;
  createdAt: number;
  dueDate: string | null;
}

export interface Quote {
  quote: string;
  author: string;
}

export interface WeatherData {
  temperature: number;
  description: string;
  icon: 'sun' | 'cloud' | 'rain' | 'snow' | 'wind' | 'storm' | 'partly-cloudy' | 'fog';
  location: string;
}

export interface Link {
  id: string;
  title: string;
  url: string;
}
