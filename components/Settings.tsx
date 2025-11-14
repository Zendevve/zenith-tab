
import React from 'react';
import { WidgetId, Widget, BackgroundSetting } from '../types';
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
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
  isOpen, 
  onClose, 
  allWidgets, 
  enabledWidgets, 
  setEnabledWidgets,
  backgroundSetting,
  setBackgroundSetting,
  clockFormat,
  setClockFormat
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

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-gray-800/80 backdrop-blur-xl border-l border-white/20 text-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
      >
        <div className="p-6 h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 id="settings-title" className="text-2xl font-bold">Customize</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors">
              <XIcon className="w-6 h-6" />
            </button>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Personalization</h3>
            <div className="space-y-4">
                <label className="block p-3 bg-white/5 rounded-lg">
                    <span className="font-medium text-sm text-white/70">Your Name</span>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="What should we call you?"
                        className="w-full bg-transparent text-lg focus:outline-none mt-1 placeholder-white/50"
                    />
                </label>
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Appearance</h3>
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">Clock Format</span>
                <div className="flex items-center bg-gray-900/50 rounded-lg p-1">
                  <button 
                    onClick={() => setClockFormat('12h')}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${clockFormat === '12h' ? 'bg-blue-600' : 'hover:bg-white/10'}`}
                  >
                    12-hour
                  </button>
                  <button 
                    onClick={() => setClockFormat('24h')}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${clockFormat === '24h' ? 'bg-blue-600' : 'hover:bg-white/10'}`}
                  >
                    24-hour
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Widgets</h3>
            <div className="space-y-4">
              {allWidgets.map((widget) => (
                <label key={widget.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg cursor-pointer">
                  <span className="font-medium">{widget.name}</span>
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={enabledWidgets.includes(widget.id)}
                      onChange={() => toggleWidget(widget.id)}
                    />
                    <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">Background</h3>
              <div className="grid grid-cols-3 gap-3">
                  <button
                      onClick={() => setBackgroundSetting({ type: 'random' })}
                      className={`relative aspect-square rounded-lg flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 ${
                          backgroundSetting.type === 'random' ? 'ring-2 ring-blue-500' : 'ring-1 ring-white/20'
                      }`}
                      aria-label="Set random background"
                  >
                      <ShuffleIcon className="w-8 h-8 text-white/70" />
                      <span className="absolute bottom-2 text-xs font-medium">Random</span>
                  </button>

                  <label
                      htmlFor="background-upload"
                      className={`relative aspect-square rounded-lg flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors cursor-pointer overflow-hidden focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-800 focus-within:ring-blue-500 ${
                          backgroundSetting.type === 'custom' ? 'ring-2 ring-blue-500' : 'ring-1 ring-white/20'
                      }`}
                      aria-label="Upload custom background"
                  >
                      {backgroundSetting.type === 'custom' ? (
                          <img src={backgroundSetting.dataUrl} className="w-full h-full object-cover" alt="Custom background preview" />
                      ) : (
                          <>
                              <UploadIcon className="w-8 h-8 text-white/70" />
                              <span className="absolute bottom-2 text-xs font-medium">Upload</span>
                          </>
                      )}
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
                          className={`relative aspect-square rounded-lg bg-cover bg-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 overflow-hidden ${
                            backgroundSetting.type === 'gallery' && backgroundSetting.id === bg.id ? 'ring-2 ring-blue-500' : 'ring-1 ring-white/20'
                          }`}
                          style={{ backgroundImage: `url(${bg.thumbnailUrl})` }}
                          aria-label={`Set background to ${bg.id}`}
                      >
                          <div className="absolute inset-0 bg-black/20 hover:bg-black/0 transition-colors duration-300"></div>
                      </button>
                  ))}
              </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPanel;