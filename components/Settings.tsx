
import React from 'react';
import { WidgetId, Widget, ThemeSettings } from '../types';
import { XIcon } from './icons';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  allWidgets: Widget[];
  enabledWidgets: WidgetId[];
  setEnabledWidgets: React.Dispatch<React.SetStateAction<WidgetId[]>>;
  themeSettings: ThemeSettings;
  setThemeSettings: React.Dispatch<React.SetStateAction<ThemeSettings>>;
}

const accentPresets = ['#ffffff', '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
  isOpen, onClose, allWidgets, enabledWidgets, setEnabledWidgets, themeSettings, setThemeSettings
}) => {
  const [name, setName] = useLocalStorage('user_name', '');

  const toggleWidget = (id: WidgetId) => {
    if (enabledWidgets.includes(id)) {
      setEnabledWidgets(enabledWidgets.filter((wId) => wId !== id));
    } else {
      setEnabledWidgets([...enabledWidgets, id]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 transition-opacity duration-300">
      <div className="w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] md:max-h-[80vh] overflow-hidden animate-fade-in">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/5">
            <h2 className="text-lg font-light tracking-wide text-white">Settings</h2>
            <button onClick={onClose} className="text-white/40 hover:text-white transition-colors p-1">
                <XIcon className="w-5 h-5"/>
            </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-8 scrollbar-hide">
            
            {/* Identity */}
            <section className="space-y-4">
                <h3 className="text-xs font-medium text-white/40 uppercase tracking-widest">Identity</h3>
                <div className="relative">
                    <input 
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                        placeholder="What should we call you?"
                        className="w-full bg-transparent border-b border-white/10 py-2 text-sm font-light text-white focus:outline-none focus:border-[var(--accent-color)] placeholder-white/20 transition-colors"
                    />
                </div>
            </section>

            {/* Visuals */}
            <section className="space-y-4">
                <h3 className="text-xs font-medium text-white/40 uppercase tracking-widest">Accent Color</h3>
                <div className="flex flex-wrap gap-3">
                    {accentPresets.map(c => (
                        <button 
                            key={c}
                            onClick={() => setThemeSettings(p => ({...p, accentColor: c}))}
                            className={`w-6 h-6 rounded-full transition-all duration-300 ${themeSettings.accentColor === c ? 'scale-110 ring-2 ring-white/50 ring-offset-2 ring-offset-black' : 'hover:scale-110 opacity-70 hover:opacity-100'}`}
                            style={{ backgroundColor: c }}
                        />
                    ))}
                    <div className="relative ml-2">
                        <label className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center overflow-hidden cursor-pointer hover:border-white/50 transition-colors">
                             <div className="w-full h-full bg-gradient-to-br from-white/20 to-transparent"></div>
                             <input 
                                type="color" 
                                value={themeSettings.accentColor} 
                                onChange={e => setThemeSettings(p => ({...p, accentColor: e.target.value}))} 
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                             />
                        </label>
                    </div>
                </div>
            </section>

            {/* Modules */}
            <section className="space-y-4">
                <h3 className="text-xs font-medium text-white/40 uppercase tracking-widest">Widgets</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {allWidgets.map(w => {
                        const isEnabled = enabledWidgets.includes(w.id);
                        return (
                            <button 
                                key={w.id}
                                onClick={() => toggleWidget(w.id)}
                                className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                                    isEnabled 
                                        ? 'bg-white/5 border-white/10 text-white' 
                                        : 'bg-transparent border-transparent text-white/30 hover:bg-white/[0.02]'
                                }`}
                            >
                                <span className="text-sm font-light">{w.name}</span>
                                <div className={`w-2 h-2 rounded-full transition-colors ${isEnabled ? 'bg-[var(--accent-color)]' : 'bg-white/10'}`} />
                            </button>
                        )
                    })}
                </div>
            </section>

            <div className="text-center pt-8 pb-4">
                <p className="text-[10px] text-white/20 font-light">Zenith Tab</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
