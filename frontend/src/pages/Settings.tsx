import React, { useState } from 'react';
import { Settings as SettingsIcon, Type, Eye, Volume2, Bell, ShieldCheck } from 'lucide-react';
import { useApp, FontSize } from '../context/AppContext';

export const Settings: React.FC = () => {
  const { fontSize, setFontSize, highContrast, setHighContrast, addToast } = useApp();
  const [autoAlert, setAutoAlert] = useState(true);
  const [speechRate, setSpeechRate] = useState('slow');

  const handleSave = () => {
    addToast({
      type: 'success',
      title: 'Settings Saved',
      message: 'Your accessibility and notification preferences have been saved.'
    });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Title */}
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center">
          <SettingsIcon className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Accessibility & Settings</h1>
          <p className="text-sm text-slate-600">Customize text readability, contrast, and voice assistance.</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Text Size Sizing */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <Type className="w-6 h-6 text-sky-700" />
            <h2 className="text-xl font-extrabold text-slate-900">Text & Font Size</h2>
          </div>
          <p className="text-sm text-slate-600 mb-6">
            Make all text across ElderShield larger for relaxed, strain-free reading.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => setFontSize('normal')}
              className={`p-5 rounded-2xl border-2 text-left transition-all ${
                fontSize === 'normal'
                  ? 'border-sky-600 bg-sky-50 text-sky-900 shadow-md'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <span className="text-base font-bold block mb-1">Standard (100%)</span>
              <span className="text-xs text-slate-500">Default application font size.</span>
            </button>

            <button
              type="button"
              onClick={() => setFontSize('large')}
              className={`p-5 rounded-2xl border-2 text-left transition-all ${
                fontSize === 'large'
                  ? 'border-sky-600 bg-sky-50 text-sky-900 shadow-md'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <span className="text-lg font-bold block mb-1">Large (112%)</span>
              <span className="text-xs text-slate-500">Easier to read headlines and buttons.</span>
            </button>

            <button
              type="button"
              onClick={() => setFontSize('xlarge')}
              className={`p-5 rounded-2xl border-2 text-left transition-all ${
                fontSize === 'xlarge'
                  ? 'border-sky-600 bg-sky-50 text-sky-900 shadow-md'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <span className="text-xl font-extrabold block mb-1">Extra Large (125%)</span>
              <span className="text-xs text-slate-500">Maximum senior readability mode.</span>
            </button>
          </div>
        </div>

        {/* Visual High Contrast */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <Eye className="w-6 h-6 text-sky-700" />
              <h2 className="text-xl font-extrabold text-slate-900">High Contrast Mode</h2>
            </div>
            <p className="text-sm text-slate-600">
              Enhances edge visibility and strengthens color boundaries for impaired vision.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setHighContrast(!highContrast)}
            className={`px-6 py-3 rounded-2xl font-bold text-sm border transition-all ${
              highContrast
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            {highContrast ? '✓ High Contrast Enabled' : 'Enable High Contrast'}
          </button>
        </div>

        {/* Voice Assistant Speed */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <Volume2 className="w-6 h-6 text-sky-700" />
            <h2 className="text-xl font-extrabold text-slate-900">Voice Assistance Pace</h2>
          </div>
          <p className="text-sm text-slate-600 mb-4">
            Control the reading speed when listening to safety explanations and advice.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setSpeechRate('slow')}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm border transition-all ${
                speechRate === 'slow'
                  ? 'bg-sky-700 text-white border-sky-700'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              Gentle & Clear (Elder Friendly)
            </button>
            <button
              type="button"
              onClick={() => setSpeechRate('normal')}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm border transition-all ${
                speechRate === 'normal'
                  ? 'bg-sky-700 text-white border-sky-700'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              Normal Speed
            </button>
          </div>
        </div>

        {/* Notification Alert Rules */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <Bell className="w-6 h-6 text-sky-700" />
            <h2 className="text-xl font-extrabold text-slate-900">Safety Circle Alerts</h2>
          </div>

          <label className="flex items-center space-x-4 cursor-pointer">
            <input
              type="checkbox"
              checked={autoAlert}
              onChange={(e) => setAutoAlert(e.target.checked)}
              className="w-6 h-6 rounded-lg text-sky-600"
            />
            <div>
              <span className="text-base font-bold text-slate-900 block">
                Notify trusted contact when a Critical High-Risk scam is flagged
              </span>
              <span className="text-xs text-slate-500">
                Automatically alerts registered family if dangerous banking or police coercion is detected.
              </span>
            </div>
          </label>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="button"
            onClick={handleSave}
            className="px-8 py-4 bg-sky-700 hover:bg-sky-800 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-sky-800/20 transition-all"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
