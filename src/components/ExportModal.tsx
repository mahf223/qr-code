import React, { useState } from 'react';
import { Download, X, FileImage, FileCode, FileText, Check, Printer } from 'lucide-react';
import { QRDesignConfig } from '../types';
import { downloadQRImage, downloadPDF } from '../utils/exportUtils';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataString: string;
  config: QRDesignConfig;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  dataString,
  config
}) => {
  const [format, setFormat] = useState<'png' | 'svg' | 'pdf' | 'webp'>('png');
  const [resolution, setResolution] = useState<number>(2048); // 2048px default
  const [filename, setFilename] = useState('qr-code-studio');
  const [pdfTitle, setPdfTitle] = useState('Scan QR Code');
  const [pdfSubtitle, setPdfSubtitle] = useState('Point your camera to scan');
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    setIsExporting(true);
    try {
      if (format === 'pdf') {
        await downloadPDF(dataString, config, pdfTitle, pdfSubtitle);
      } else {
        await downloadQRImage(dataString, config, format, resolution, filename);
      }
      onClose();
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-white">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-indigo-400" />
            <h3 className="font-extrabold text-base text-white">Export High Definition QR Code</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Format Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">Export File Format</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => setFormat('png')}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                  format === 'png'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <FileImage className="w-4 h-4 text-indigo-400" />
                <span className="font-bold text-xs">PNG</span>
                <span className="text-[9px] text-slate-400">Raster HD</span>
              </button>

              <button
                onClick={() => setFormat('svg')}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                  format === 'svg'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <FileCode className="w-4 h-4 text-purple-400" />
                <span className="font-bold text-xs">SVG</span>
                <span className="text-[9px] text-slate-400">Vector Print</span>
              </button>

              <button
                onClick={() => setFormat('pdf')}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                  format === 'pdf'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Printer className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-xs">PDF</span>
                <span className="text-[9px] text-slate-400">Print Card</span>
              </button>

              <button
                onClick={() => setFormat('webp')}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                  format === 'webp'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-xs">WEBP</span>
                <span className="text-[9px] text-slate-400">Web Compressed</span>
              </button>
            </div>
          </div>

          {/* Resolution Selector (PNG/WEBP) */}
          {format !== 'svg' && format !== 'pdf' && (
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">Resolution Quality (300 DPI)</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { px: 512, label: '512px', sub: 'Digital' },
                  { px: 1024, label: '1024px', sub: 'Standard' },
                  { px: 2048, label: '2048px', sub: 'Ultra HD' },
                  { px: 4096, label: '4096px', sub: 'Pro Print' }
                ].map((r) => (
                  <button
                    key={r.px}
                    onClick={() => setResolution(r.px)}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      resolution === r.px
                        ? 'bg-indigo-600/20 border-indigo-500 text-white font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-mono">{r.label}</div>
                    <div className="text-[9px] text-slate-400">{r.sub}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PDF Custom Fields */}
          {format === 'pdf' && (
            <div className="space-y-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">PDF Page Heading</label>
                <input
                  type="text"
                  value={pdfTitle}
                  onChange={(e) => setPdfTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">PDF Subtitle Instructions</label>
                <input
                  type="text"
                  value={pdfSubtitle}
                  onChange={(e) => setPdfSubtitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          {/* File Name Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Filename</label>
            <div className="flex items-center bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs">
              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                className="w-full bg-transparent text-white focus:outline-none"
              />
              <span className="text-slate-500 font-mono">.{format}</span>
            </div>
          </div>

          {/* Download Execution Button */}
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Generating High Res Download...' : `Download ${format.toUpperCase()} Now`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
