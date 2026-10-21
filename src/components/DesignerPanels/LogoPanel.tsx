import React from 'react';
import { Upload, Trash2, Utensils, Wifi, UserCheck, Instagram, Home, CreditCard, Star, Phone, Globe, Shield } from 'lucide-react';
import { QRDesignConfig } from '../../types';

interface LogoPanelProps {
  config: QRDesignConfig;
  onChangeConfig: (updated: Partial<QRDesignConfig>) => void;
}

export const PRESET_ICONS = [
  { id: 'none', label: 'None', icon: null },
  { id: 'utensils', label: 'Restaurant', icon: Utensils },
  { id: 'wifi', label: 'Wi-Fi', icon: Wifi },
  { id: 'vcard', label: 'Contact', icon: UserCheck },
  { id: 'instagram', label: 'Instagram', icon: Instagram },
  { id: 'home', label: 'Real Estate', icon: Home },
  { id: 'payment', label: 'Payment', icon: CreditCard },
  { id: 'star', label: 'Review', icon: Star },
  { id: 'phone', label: 'Phone', icon: Phone },
  { id: 'globe', label: 'Website', icon: Globe },
  { id: 'shield', label: 'Verified', icon: Shield }
];

export const LogoPanel: React.FC<LogoPanelProps> = ({ config, onChangeConfig }) => {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        onChangeConfig({
          logoUrl: result,
          logoPreset: undefined,
          errorCorrectionLevel: 'H' // Auto upgrade error correction for uploaded logos!
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    onChangeConfig({ logoUrl: undefined, logoPreset: 'none' });
  };

  return (
    <div className="space-y-4">
      {/* 1. Custom Upload & Preset Picker */}
      <div>
        <label className="block text-xs font-bold text-slate-300 mb-2">Logo or Brand Image</label>

        {/* Upload Drop Zone */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <label className="flex-1 w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-950 border border-dashed border-slate-700/80 hover:border-indigo-500 rounded-xl cursor-pointer text-xs font-medium text-slate-300 hover:text-white transition-all">
            <Upload className="w-4 h-4 text-indigo-400" />
            <span>Upload Custom Logo (PNG, SVG, WEBP)</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>

          {(config.logoUrl || (config.logoPreset && config.logoPreset !== 'none')) && (
            <button
              onClick={removeLogo}
              className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 rounded-xl transition-colors"
              title="Remove Logo"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Preset Brand Icons */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-2">Or Choose a Built-in Icon</label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {PRESET_ICONS.map((p) => {
            const IconComp = p.icon;
            const isSelected = config.logoPreset === p.id && !config.logoUrl;

            return (
              <button
                key={p.id}
                onClick={() => {
                  if (p.id === 'none') {
                    removeLogo();
                  } else {
                    // For built-in preset icon, create SVG data url
                    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="%232563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M2 12h20"/></svg>`;
                    const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
                    onChangeConfig({
                      logoPreset: p.id,
                      logoUrl: dataUrl,
                      errorCorrectionLevel: 'H'
                    });
                  }
                }}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {IconComp ? <IconComp className="w-4 h-4 mb-1 text-indigo-400" /> : <span className="text-xs font-bold mb-1">✕</span>}
                <span className="text-[10px] font-medium">{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Logo Controls (Size & Backdrop Badge) */}
      {(config.logoUrl || (config.logoPreset && config.logoPreset !== 'none')) && (
        <div className="pt-2 border-t border-slate-800 space-y-3">
          {/* Size Ratio Slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-300">Logo Scale</label>
              <span className="text-xs font-mono text-indigo-400">{Math.round((config.logoSizeRatio || 0.22) * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.12"
              max="0.32"
              step="0.02"
              value={config.logoSizeRatio || 0.22}
              onChange={(e) => onChangeConfig({ logoSizeRatio: parseFloat(e.target.value) })}
              className="w-full accent-indigo-500 bg-slate-950 rounded-lg"
            />
          </div>

          {/* Logo Backdrop Shape */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Logo Backdrop Shape</label>
              <select
                value={config.logoBgShape || 'circle'}
                onChange={(e) => onChangeConfig({ logoBgShape: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
              >
                <option value="none">No Background</option>
                <option value="circle">Circle Badge</option>
                <option value="square">Square Badge</option>
                <option value="rounded">Rounded Box</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Backdrop Color</label>
              <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                <input
                  type="color"
                  value={config.logoBgColor || '#ffffff'}
                  onChange={(e) => onChangeConfig({ logoBgColor: e.target.value })}
                  className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={config.logoBgColor || '#ffffff'}
                  onChange={(e) => onChangeConfig({ logoBgColor: e.target.value })}
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
