import React from 'react';
import { QRDesignConfig } from '../../types';

interface ColorPanelProps {
  config: QRDesignConfig;
  onChangeConfig: (updated: Partial<QRDesignConfig>) => void;
}

export const ColorPanel: React.FC<ColorPanelProps> = ({ config, onChangeConfig }) => {
  const PRESET_PALETTES = [
    { name: 'Classic Black', fg: '#000000', bg: '#ffffff', eyeFrame: '#000000', eyeDot: '#000000' },
    { name: 'Luxury Gold', fg: '#b38728', bg: '#121212', fg2: '#f3e5ab', eyeFrame: '#f3e5ab', eyeDot: '#d4af37', gradient: true },
    { name: 'Cyber Neon', fg: '#00f2fe', bg: '#0f172a', fg2: '#4facfe', eyeFrame: '#00f2fe', eyeDot: '#ffffff', gradient: true },
    { name: 'Royal Blue', fg: '#1e40af', bg: '#ffffff', fg2: '#3b82f6', eyeFrame: '#1e3a8a', eyeDot: '#2563eb', gradient: true },
    { name: 'Eco Emerald', fg: '#047857', bg: '#f0fdf4', fg2: '#10b981', eyeFrame: '#065f46', eyeDot: '#10b981', gradient: true },
    { name: 'Sunset Coral', fg: '#e1306c', bg: '#ffffff', fg2: '#fd1d1d', eyeFrame: '#e1306c', eyeDot: '#fcaf45', gradient: true }
  ];

  return (
    <div className="space-y-4">
      {/* Curated Brand Palettes */}
      <div>
        <label className="block text-xs font-bold text-slate-300 mb-2">Curated Brand Palettes</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {PRESET_PALETTES.map((p) => (
            <button
              key={p.name}
              onClick={() =>
                onChangeConfig({
                  fgColor: p.fg,
                  bgColor: p.bg,
                  isBgTransparent: false,
                  colorType: p.gradient ? 'gradient' : 'single',
                  gradientColor2: p.fg2 || p.fg,
                  useCustomEyeColor: true,
                  eyeFrameColor: p.eyeFrame,
                  eyeDotColor: p.eyeDot
                })
              }
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 flex items-center justify-between transition-all"
            >
              <span className="text-xs font-semibold text-slate-200">{p.name}</span>
              <div className="flex items-center gap-1">
                <span className="w-3.5 h-3.5 rounded-full border border-slate-700 shadow-sm" style={{ backgroundColor: p.fg }} />
                <span className="w-3.5 h-3.5 rounded-full border border-slate-700 shadow-sm" style={{ backgroundColor: p.bg }} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Mode Switch: Single vs Gradient */}
      <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
        <label className="text-xs font-bold text-slate-300">Color System</label>
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => onChangeConfig({ colorType: 'single' })}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              config.colorType === 'single' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Single Color
          </button>
          <button
            onClick={() => onChangeConfig({ colorType: 'gradient' })}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              config.colorType === 'gradient' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Gradient
          </button>
        </div>
      </div>

      {/* Main Colors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Foreground Color */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Foreground Color 1</label>
          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <input
              type="color"
              value={config.fgColor || '#000000'}
              onChange={(e) => onChangeConfig({ fgColor: e.target.value })}
              className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
            />
            <input
              type="text"
              value={config.fgColor || '#000000'}
              onChange={(e) => onChangeConfig({ fgColor: e.target.value })}
              className="w-full bg-transparent text-xs text-white uppercase font-mono focus:outline-none"
            />
          </div>
        </div>

        {/* Gradient Color 2 (if gradient active) */}
        {config.colorType === 'gradient' && (
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Gradient Color 2</label>
            <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
              <input
                type="color"
                value={config.gradientColor2 || '#2563eb'}
                onChange={(e) => onChangeConfig({ gradientColor2: e.target.value })}
                className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
              />
              <input
                type="text"
                value={config.gradientColor2 || '#2563eb'}
                onChange={(e) => onChangeConfig({ gradientColor2: e.target.value })}
                className="w-full bg-transparent text-xs text-white uppercase font-mono focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Background Color */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Background Color</label>
          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <input
              type="color"
              value={config.bgColor || '#ffffff'}
              onChange={(e) => onChangeConfig({ bgColor: e.target.value })}
              disabled={config.isBgTransparent}
              className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 disabled:opacity-30"
            />
            <input
              type="text"
              value={config.bgColor || '#ffffff'}
              onChange={(e) => onChangeConfig({ bgColor: e.target.value })}
              disabled={config.isBgTransparent}
              className="w-full bg-transparent text-xs text-white uppercase font-mono focus:outline-none disabled:text-slate-500"
            />
          </div>
        </div>

        {/* Background Transparent Checkbox */}
        <div className="flex items-center justify-start sm:justify-end pt-5">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={config.isBgTransparent}
              onChange={(e) => onChangeConfig({ isBgTransparent: e.target.checked })}
              className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500"
            />
            Transparent Canvas
          </label>
        </div>
      </div>

      {/* Eye Color Customization */}
      <div className="pt-2 border-t border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-300">Custom Corner Eye Colors</label>
          <button
            onClick={() => onChangeConfig({ useCustomEyeColor: !config.useCustomEyeColor })}
            className={`text-xs font-semibold ${config.useCustomEyeColor ? 'text-indigo-400' : 'text-slate-500'}`}
          >
            {config.useCustomEyeColor ? 'Enabled' : 'Same as Pattern'}
          </button>
        </div>

        {config.useCustomEyeColor && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Outer Eye Frame Color</label>
              <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                <input
                  type="color"
                  value={config.eyeFrameColor || '#000000'}
                  onChange={(e) => onChangeConfig({ eyeFrameColor: e.target.value })}
                  className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={config.eyeFrameColor || '#000000'}
                  onChange={(e) => onChangeConfig({ eyeFrameColor: e.target.value })}
                  className="w-full bg-transparent text-[11px] text-white uppercase font-mono focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Inner Eye Dot Color</label>
              <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                <input
                  type="color"
                  value={config.eyeDotColor || '#000000'}
                  onChange={(e) => onChangeConfig({ eyeDotColor: e.target.value })}
                  className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={config.eyeDotColor || '#000000'}
                  onChange={(e) => onChangeConfig({ eyeDotColor: e.target.value })}
                  className="w-full bg-transparent text-[11px] text-white uppercase font-mono focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
