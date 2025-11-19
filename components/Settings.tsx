
import React from 'react';
import { WidgetId, Widget, BackgroundSetting, FontOption } from '../types';
import { curatedBackgrounds } from '../constants/backgrounds';
import { XIcon, ShuffleIcon, UploadIcon } from './icons';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  allWidgets: Widget[];
  enabledWidgets: WidgetId[];
  setEnabledWidgets: React.Dispatch<React.SetStateAction<WidgetId[]>>;
  backgroundSetting: BackgroundSetting;
  setBackgroundSetting: React.Dispatch<React.SetStateAction<BackgroundSetting>>;
  clockFormat: '12h' | '24h';
  setClockFormat: React.Dispatch<React.SetStateAction<'12h' | '24h'>>;
  font: FontOption;
  setFont: React.Dispatch<React.SetStateAction<FontOption>>;
}

const fontOptions: { label: string; value: FontOption }[] = [
    { label: 'Inter', value: 'Inter' },
    { label: 'Lato', value: 'Lato' },
    { label: 'Montserrat', value: 'Montserrat' },
    { label: 'Playfair', value: 'Playfair Display' },
    { label: 'Mono', value: 'Roboto Mono' },
];

const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
  isOpen, 
  onClose, 
  allWidgets, 
  enabledWidgets, 
  setEnabledWidgets,
  backgroundSetting,
  setBackgroundSetting,
  clockFormat,
  setClockFormat,
  font,
  setFont
}) => {
  const [name, setName] = useLocalStorage('user_name', '');

  const toggleWidget = (id: WidgetId) => {
    if (enabledWidgets.includes(id)) {
      setEnabledWidgets(enabledWidgets.filter((wId) => wId !== id));
    } else {
      // Add non-quote widgets to the end, quote to the beginning
      if (id === 'quote') {
        setEnabledWidgets([id, ...enabledWidgets]);
      } else {
        setEnabledWidgets([...enabledWidgets, id]);
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        alert('Image is too large! Please choose a file smaller than 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackgroundSetting({ type: 'custom', dataUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setBackgroundSetting({ type: 'color', color: e.target.value });
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-black/40 backdrop-blur-xl border-l border-white/20 text-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        style={{ fontFamily: 'Inter, sans-serif' }} // Keep settings legible in default font
      >
        <div className="p-6 h-full overflow-y-auto scrollbar-hide">
          <div className="flex justify-between items-center mb-6">
            <h2 id="settings-title" className="text-2xl font-bold">Customize</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors">
              <XIcon className="w-6 h-6" />
            </button>
          </div>
          
          <div className="mb-8">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white/50 mb-4">Identity</h3>
            <div className="space-y-4">
                <label className="block p-3 bg-white/5 rounded-lg border border-white/5 focus-within:border-white/20 transition-colors">
                    <span className="font-medium text-xs text-white/50 uppercase tracking-wider">Name</span>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="w-full bg-transparent text-lg focus:outline-none mt-1 placeholder-white/30"
                    />
                </label>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white/50 mb-4">Typography</h3>
            <div className="grid grid-cols-2 gap-2">
                {fontOptions.map((opt) => (
                    <button
                        key={opt.value}
                        onClick={() => setFont(opt.value)}
                        className={`p-3 rounded-lg text-left transition-all ${font === opt.value ? 'bg-blue-600 text-white shadow-lg scale-[1.02]' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
                    >
                        <span className="block text-lg leading-none mb-1" style={{ fontFamily: opt.value }}>Aa</span>
                        <span className="text-xs opacity-70">{opt.label}</span>
                    </button>
                ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white/50 mb-4">Interface</h3>
            <div className="p-4 bg-white/5 rounded-lg border border-white/5">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">Clock Format</span>
                <div className="flex items-center bg-black/40 rounded-lg p-1">
                  <button 
                    onClick={() => setClockFormat('12h')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${clockFormat === '12h' ? 'bg-blue-600 text-white' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
                  >
                    12h
                  </button>
                  <button 
                    onClick={() => setClockFormat('24h')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${clockFormat === '24h' ? 'bg-blue-600 text-white' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
                  >
                    24h
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white/50 mb-4">Widgets</h3>
            <div className="space-y-2">
              {allWidgets.map((widget) => (
                <label key={widget.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg cursor-pointer border border-transparent hover:border-white/10 transition-all">
                  <span className="font-medium text-sm">{widget.name}</span>
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={enabledWidgets.includes(widget.id)}
                      onChange={() => toggleWidget(widget.id)}
                    />
                    <div className="w-9 h-5 bg-white/10 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-8">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white/50 mb-4">Background</h3>
              <div className="grid grid-cols-3 gap-3">
                  <button
                      onClick={() => setBackgroundSetting({ type: 'random' })}
                      className={`relative aspect-square rounded-lg flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors focus:outline-none ${
                          backgroundSetting.type === 'random' ? 'ring-2 ring-blue-500' : 'ring-1 ring-white/10'
                      }`}
                      aria-label="Set random background"
                  >
                      <ShuffleIcon className="w-6 h-6 text-white/70" />
                      <span className="absolute bottom-2 text-[10px] font-medium uppercase tracking-wide text-white/50">Random</span>
                  </button>

                  <label
                      className={`relative aspect-square rounded-lg flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors cursor-pointer focus-within:ring-2 focus-within:ring-blue-500 ${
                          backgroundSetting.type === 'color' ? 'ring-2 ring-blue-500' : 'ring-1 ring-white/10'
                      }`}
                      title="Pick a solid color"
                  >
                       <div 
                            className="w-8 h-8 rounded-full border border-white/20 shadow-lg" 
                            style={{ background: backgroundSetting.type === 'color' ? backgroundSetting.color : 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)' }}
                       />
                       <span className="absolute bottom-2 text-[10px] font-medium uppercase tracking-wide text-white/50">Color</span>
                       <input 
                            type="color" 
                            className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
                            onChange={handleColorChange}
                            value={backgroundSetting.type === 'color' ? backgroundSetting.color : '#000000'}
                       />
                  </label>

                  <label
                      htmlFor="background-upload"
                      className={`relative aspect-square rounded-lg flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors cursor-pointer overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 ${
                          backgroundSetting.type === 'custom' ? 'ring-2 ring-blue-500' : 'ring-1 ring-white/10'
                      }`}
                      aria-label="Upload custom background"
                  >
                      {backgroundSetting.type === 'custom' ? (
                          <img src={backgroundSetting.dataUrl} className="w-full h-full object-cover opacity-50" alt="Custom background preview" />
                      ) : (
                           <UploadIcon className="w-6 h-6 text-white/70" />
                      )}
                      <span className="absolute bottom-2 text-[10px] font-medium uppercase tracking-wide text-white/50">Upload</span>
                      <input
                          id="background-upload"
                          type="file"
                          accept="image/png, image/jpeg, image/webp"
                          className="sr-only"
                          onChange={handleFileChange}
                      />
                  </label>

                  {curatedBackgrounds.map(bg => (
                      <button
                          key={bg.id}
                          onClick={() => setBackgroundSetting({ type: 'gallery', id: bg.id, url: bg.url })}
                          className={`relative aspect-square rounded-lg bg-cover bg-center focus:outline-none overflow-hidden group ${
                            backgroundSetting.type === 'gallery' && backgroundSetting.id === bg.id ? 'ring-2 ring-blue-500' : 'ring-1 ring-white/10'
                          }`}
                          style={{ backgroundImage: `url(${bg.thumbnailUrl})` }}
                          aria-label={`Set background to ${bg.id}`}
                      >
                          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300"></div>
                      </button>
                  ))}
              </div>
          </div>
          
          <div className="mt-8 text-center">
             <p className="text-xs text-white/20">Zenith Tab v1.0</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPanel;
