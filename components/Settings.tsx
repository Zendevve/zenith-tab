
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

const accentPresets = ['#00FF00', '#FF0000', '#00FFFF', '#FFFF00', '#FF00FF', '#FFFFFF'];

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="w-full max-w-2xl bg-[var(--bg-color)] border-2 border-[var(--fg-color)] shadow-[8px_8px_0px_0px_var(--border-color)] p-0">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-[var(--fg-color)] text-[var(--bg-color)] p-4">
            <h2 className="text-xl font-bold uppercase tracking-tighter">SYS_CONFIG // SETTINGS</h2>
            <button onClick={onClose} className="hover:bg-[var(--accent-color)] hover:text-black p-1 border border-black"><XIcon className="w-6 h-6"/></button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[80vh] space-y-8">
            
            {/* Identity */}
            <section>
                <h3 className="text-[var(--accent-color)] font-bold mb-2 uppercase border-b border-[var(--border-color)]">IDENTITY</h3>
                <div className="flex flex-col">
                    <label className="text-xs mb-1">USER_NAME</label>
                    <input 
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                        className="bg-transparent border-2 border-[var(--border-color)] p-2 focus:border-[var(--accent-color)] outline-none font-bold"
                    />
                </div>
            </section>

            {/* Visuals */}
            <section>
                <h3 className="text-[var(--accent-color)] font-bold mb-2 uppercase border-b border-[var(--border-color)]">VISUALS</h3>
                <div className="flex gap-4 mb-4">
                    {accentPresets.map(c => (
                        <button 
                            key={c}
                            onClick={() => setThemeSettings(p => ({...p, accentColor: c}))}
                            className={`w-8 h-8 border-2 ${themeSettings.accentColor === c ? 'border-white' : 'border-transparent'}`}
                            style={{ backgroundColor: c }}
                        />
                    ))}
                    <input type="color" value={themeSettings.accentColor} onChange={e => setThemeSettings(p => ({...p, accentColor: e.target.value}))} className="w-8 h-8 bg-transparent" />
                </div>
            </section>

            {/* Modules */}
            <section>
                <h3 className="text-[var(--accent-color)] font-bold mb-2 uppercase border-b border-[var(--border-color)]">MODULES</h3>
                <div className="grid grid-cols-2 gap-2">
                    {allWidgets.map(w => {
                        const isEnabled = enabledWidgets.includes(w.id);
                        return (
                            <button 
                                key={w.id}
                                onClick={() => toggleWidget(w.id)}
                                className={`border border-[var(--border-color)] p-3 text-left flex justify-between group hover:border-[var(--fg-color)]`}
                            >
                                <span className="font-bold">{w.name.toUpperCase()}</span>
                                <span className={isEnabled ? 'text-[var(--accent-color)]' : 'text-neutral-600'}>
                                    {isEnabled ? '[ON]' : '[OFF]'}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </section>

            <div className="text-center pt-4 text-xs text-neutral-600">
                build_ver: 2.0.0_brutal
            </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
