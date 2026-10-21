import React, { useEffect, useRef, useState } from 'react';
import { ZoomIn, ZoomOut, Download, Bookmark, Copy, Check, Eye, ShieldCheck, Zap } from 'lucide-react';
import { QRDesignConfig, ScanValidationResult } from '../types';
import { createQRInstance } from '../utils/exportUtils';

interface QRCanvasProps {
  dataString: string;
  config: QRDesignConfig;
  validation: ScanValidationResult;
  isDynamic: boolean;
  onOpenExportModal: () => void;
  onSaveToAccount: () => void;
}

export const QRCanvas: React.FC<QRCanvasProps> = ({
  dataString,
  config,
  validation,
  isDynamic,
  onOpenExportModal,
  onSaveToAccount
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageBgDark, setStageBgDark] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [copied, setCopied] = useState(false);

  // Render QR inside DOM container whenever dataString or config changes
  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    try {
      const qr = createQRInstance(dataString, config, 300);
      qr.append(containerRef.current);
    } catch (err) {
      console.error('Failed to render QR Code Canvas:', err);
    }
  }, [dataString, config]);

  const handleCopyString = () => {
    navigator.clipboard.writeText(dataString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasFrame = config.frameStyle && config.frameStyle !== 'none';

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Canvas Controls Bar */}
      <div className="w-full flex items-center justify-between px-2 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-300">Stage View</span>
          <button
            onClick={() => setStageBgDark(!stageBgDark)}
            className="p-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            title="Toggle preview stage background"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded-lg border border-slate-800">
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.1))}
            className="p-1 hover:text-white"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-[11px] text-indigo-300 w-10 text-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
            className="p-1 hover:text-white"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Preview Stage Canvas Card */}
      <div
        className={`relative w-full max-w-sm aspect-square rounded-3xl p-6 border flex flex-col items-center justify-center shadow-2xl transition-all duration-300 ${
          stageBgDark
            ? 'bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-slate-800'
            : 'bg-gradient-to-b from-slate-100 via-white to-slate-100 border-slate-200'
        }`}
      >
        {/* Dynamic Badge Header */}
        {isDynamic && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold uppercase tracking-wider">
            <Zap className="w-3 h-3 text-amber-400 animate-pulse" />
            <span>Dynamic URL</span>
          </div>
        )}

        {/* Scanability Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-950/80 border border-slate-700 text-[10px] font-mono text-emerald-400">
          <ShieldCheck className="w-3 h-3" />
          <span>{validation.score}%</span>
        </div>

        {/* QR Frame Container */}
        <div
          className="transition-transform duration-200 flex flex-col items-center justify-center max-w-full"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* Top Frame Badge */}
          {config.frameStyle === 'top-badge' && (
            <div
              className="px-4 py-1.5 rounded-t-xl font-bold text-xs shadow-md mb-[-2px] z-10 uppercase tracking-wider text-center"
              style={{
                backgroundColor: config.frameColor || '#1e293b',
                color: config.frameTextColor || '#ffffff'
              }}
            >
              {config.frameText || 'SCAN ME'}
            </div>
          )}

          {/* QR Code Container Box */}
          <div
            className={`p-4 rounded-2xl flex items-center justify-center transition-all ${
              hasFrame && config.frameStyle === 'card-border'
                ? 'border-4'
                : 'shadow-lg'
            }`}
            style={{
              backgroundColor: config.isBgTransparent ? 'transparent' : config.bgColor || '#ffffff',
              borderColor: config.frameColor || '#1e293b'
            }}
          >
            <div ref={containerRef} className="flex items-center justify-center overflow-hidden" />
          </div>

          {/* Bottom Badge or Pill Frame */}
          {(config.frameStyle === 'bottom-badge' || config.frameStyle === 'pill-badge') && (
            <div
              className="px-5 py-1.5 rounded-full font-bold text-xs shadow-lg mt-3 uppercase tracking-wider text-center border border-white/20"
              style={{
                backgroundColor: config.frameColor || '#1e293b',
                color: config.frameTextColor || '#ffffff'
              }}
            >
              {config.frameText || 'SCAN ME'}
            </div>
          )}

          {/* Speech Bubble Frame */}
          {config.frameStyle === 'speech-bubble' && (
            <div
              className="relative px-4 py-1.5 rounded-xl font-bold text-xs shadow-lg mt-3 uppercase tracking-wider text-center"
              style={{
                backgroundColor: config.frameColor || '#1e293b',
                color: config.frameTextColor || '#ffffff'
              }}
            >
              {config.frameText || 'SCAN ME'}
              <div
                className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45"
                style={{ backgroundColor: config.frameColor || '#1e293b' }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full grid grid-cols-2 gap-2">
        <button
          onClick={onOpenExportModal}
          className="py-3 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all group"
        >
          <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
          <span>Download HD & Vector</span>
        </button>

        <button
          onClick={onSaveToAccount}
          className="py-3 px-4 rounded-xl font-bold text-xs bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white flex items-center justify-center gap-2 transition-all"
        >
          <Bookmark className="w-4 h-4 text-amber-400" />
          <span>Save Design</span>
        </button>
      </div>

      {/* Copy Raw Data String Shortcut */}
      <button
        onClick={handleCopyString}
        className="text-[11px] text-slate-400 hover:text-indigo-400 flex items-center gap-1 transition-colors"
      >
        {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
        <span>{copied ? 'Copied QR Payload Data!' : 'Copy raw QR payload string'}</span>
      </button>
    </div>
  );
};
