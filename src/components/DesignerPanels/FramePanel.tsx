import React from 'react';
import { FrameStyle, QRDesignConfig } from '../../types';

interface FramePanelProps {
  config: QRDesignConfig;
  onChangeConfig: (updated: Partial<QRDesignConfig>) => void;
}

export const FramePanel: React.FC<FramePanelProps> = ({ config, onChangeConfig }) => {
  const FRAMES: { id: FrameStyle; name: string; desc: string }[] = [
    { id: 'none', name: 'No Frame', desc: 'Clean borderless QR code' },
    { id: 'bottom-badge', name: 'Bottom Badge', desc: 'Sleek CTA pill badge at the bottom' },
    { id: 'top-badge', name: 'Top Header', desc: 'Header banner above QR code' },
    { id: 'speech-bubble', name: 'Speech Bubble', desc: 'Conversational chat bubble layout' },
    { id: 'card-border', name: 'Card Border', desc: 'High-contrast framing line with title' },
    { id: 'pill-badge', name: 'Pill Badge', desc: 'Curved pill badge frame' }
  ];

  const QUICK_CTAS = [
    'SCAN ME',
    'SCAN FOR MENU',
    'FREE WI-FI',
    'SAVE CONTACT',
    'PAY HERE',
    'FOLLOW US',
    '3D TOUR',
    'GET APP'
  ];

  return (
    <div className="space-y-4">
      {/* Frame Style Picker */}
      <div>
        <label className="block text-xs font-bold text-slate-300 mb-2">Frame Layout</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {FRAMES.map((f) => {
            const isSelected = config.frameStyle === f.id;
            return (
              <button
                key={f.id}
                onClick={() =>
                  onChangeConfig({
                    frameStyle: f.id,
                    frameText: config.frameText || 'SCAN ME',
                    frameColor: config.frameColor || config.fgColor || '#1e293b',
                    frameTextColor: config.frameTextColor || '#ffffff'
                  })
                }
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="font-semibold text-xs">{f.name}</div>
                <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{f.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Frame Text & Colors (if active) */}
      {config.frameStyle && config.frameStyle !== 'none' && (
        <div className="pt-2 border-t border-slate-800 space-y-3">
          {/* CTA Text Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Call to Action Text</label>
            <input
              type="text"
              value={config.frameText || ''}
              onChange={(e) => onChangeConfig({ frameText: e.target.value.toUpperCase() })}
              placeholder="e.g. SCAN FOR MENU"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-bold uppercase tracking-wider"
            />
          </div>

          {/* Quick CTA Chips */}
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Quick CTA Suggestions:</label>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_CTAS.map((cta) => (
                <button
                  key={cta}
                  type="button"
                  onClick={() => onChangeConfig({ frameText: cta })}
                  className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-semibold text-slate-300 hover:text-white hover:border-indigo-500 transition-colors"
                >
                  {cta}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Frame Color</label>
              <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                <input
                  type="color"
                  value={config.frameColor || '#1e293b'}
                  onChange={(e) => onChangeConfig({ frameColor: e.target.value })}
                  className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={config.frameColor || '#1e293b'}
                  onChange={(e) => onChangeConfig({ frameColor: e.target.value })}
                  className="w-full bg-transparent text-xs text-white uppercase font-mono focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Frame Text Color</label>
              <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                <input
                  type="color"
                  value={config.frameTextColor || '#ffffff'}
                  onChange={(e) => onChangeConfig({ frameTextColor: e.target.value })}
                  className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={config.frameTextColor || '#ffffff'}
                  onChange={(e) => onChangeConfig({ frameTextColor: e.target.value })}
                  className="w-full bg-transparent text-xs text-white uppercase font-mono focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
