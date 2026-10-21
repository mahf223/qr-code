import React from 'react';
import { ShieldCheck, AlertTriangle, AlertCircle, Sparkles } from 'lucide-react';
import { ScanValidationResult } from '../types';

interface ScanValidatorProps {
  validation: ScanValidationResult;
}

export const ScanValidator: React.FC<ScanValidatorProps> = ({ validation }) => {
  const { score, status, contrastRatio, logoCoveragePercent, warnings, recommendations } = validation;

  const getStatusBadge = () => {
    switch (status) {
      case 'excellent':
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs">
            <ShieldCheck className="w-4 h-4" />
            <span>Excellent Scanability</span>
          </div>
        );
      case 'warning':
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xs">
            <AlertTriangle className="w-4 h-4" />
            <span>Need Improvement</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-bold text-xs">
            <AlertCircle className="w-4 h-4" />
            <span>Not Recommended</span>
          </div>
        );
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-white space-y-3 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Real-Time Scan Diagnostic
          </h4>
        </div>
        {getStatusBadge()}
      </div>

      {/* Progress Bar & Key Metrics */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400">Scanability Score</span>
          <span className="font-extrabold text-indigo-300 font-mono">{score}%</span>
        </div>
        <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
          <div
            className={`h-full transition-all duration-500 ${
              score >= 85 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-500' : 'bg-red-500'
            }`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {/* Metric Counters */}
      <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
        <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 flex justify-between items-center">
          <span className="text-slate-400">Contrast Ratio</span>
          <span className={`font-mono font-bold ${contrastRatio >= 4.5 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {contrastRatio}:1
          </span>
        </div>
        <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 flex justify-between items-center">
          <span className="text-slate-400">Logo Coverage</span>
          <span className="font-mono font-bold text-indigo-300">{logoCoveragePercent}%</span>
        </div>
      </div>

      {/* Warnings & Recommendations */}
      {(warnings.length > 0 || recommendations.length > 0) && (
        <div className="pt-2 border-t border-slate-800/80 space-y-2 text-[11px]">
          {warnings.map((w, idx) => (
            <div key={idx} className="flex items-start gap-1.5 text-amber-300">
              <span className="text-amber-400 flex-shrink-0">•</span>
              <span>{w}</span>
            </div>
          ))}
          {recommendations.map((r, idx) => (
            <div key={idx} className="flex items-start gap-1.5 text-indigo-300">
              <span className="text-indigo-400 flex-shrink-0">💡</span>
              <span>{r}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
