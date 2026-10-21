import React from 'react';
import { PatternStyle, EyeFrameShape, EyeDotShape, QRDesignConfig } from '../../types';

interface PatternEyePanelProps {
  config: QRDesignConfig;
  onChangeConfig: (updated: Partial<QRDesignConfig>) => void;
}

export const PatternEyePanel: React.FC<PatternEyePanelProps> = ({ config, onChangeConfig }) => {
  const PATTERNS: { id: PatternStyle; name: string; desc: string }[] = [
    { id: 'square', name: 'Classic Square', desc: 'Standard sharp pixel matrix' },
    { id: 'rounded', name: 'Soft Rounded', desc: 'Smooth rounded corners' },
    { id: 'dots', name: 'Modern Dots', desc: 'Circular micro dots' },
    { id: 'classy', name: 'Classy Matrix', desc: 'Slightly stylized tech look' },
    { id: 'classy-rounded', name: 'Classy Curve', desc: 'Elegant rounded flow' },
    { id: 'extra-rounded', name: 'Super Smooth', desc: 'Full capsule dots' }
  ];

  const EYE_FRAMES: { id: EyeFrameShape; name: string }[] = [
    { id: 'square', name: 'Square' },
    { id: 'rounded', name: 'Rounded' },
    { id: 'circle', name: 'Circle' },
    { id: 'leaf', name: 'Leaf' },
    { id: 'drop', name: 'Teardrop' }
  ];

  const EYE_DOTS: { id: EyeDotShape; name: string }[] = [
    { id: 'square', name: 'Square' },
    { id: 'circle', name: 'Circle' },
    { id: 'rounded', name: 'Rounded' },
    { id: 'diamond', name: 'Diamond' }
  ];

  return (
    <div className="space-y-4">
      {/* 1. Pattern Style Selector */}
      <div>
        <label className="block text-xs font-bold text-slate-300 mb-2">QR Pattern Style</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {PATTERNS.map((p) => {
            const isSelected = config.patternStyle === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onChangeConfig({ patternStyle: p.id })}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="font-semibold text-xs">{p.name}</div>
                <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{p.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Eye Frame Outer Design */}
      <div className="pt-2 border-t border-slate-800">
        <label className="block text-xs font-bold text-slate-300 mb-2">Corner Eye Outer Frame</label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {EYE_FRAMES.map((f) => {
            const isSelected = config.eyeFrameShape === f.id;
            return (
              <button
                key={f.id}
                onClick={() => onChangeConfig({ eyeFrameShape: f.id })}
                className={`py-2 px-2 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span className="text-xs font-medium">{f.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Eye Dot Inner Design */}
      <div className="pt-2 border-t border-slate-800">
        <label className="block text-xs font-bold text-slate-300 mb-2">Corner Eye Center Dot</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {EYE_DOTS.map((d) => {
            const isSelected = config.eyeDotShape === d.id;
            return (
              <button
                key={d.id}
                onClick={() => onChangeConfig({ eyeDotShape: d.id })}
                className={`py-2 px-2 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span className="text-xs font-medium">{d.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
