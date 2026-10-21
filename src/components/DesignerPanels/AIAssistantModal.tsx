import React, { useState } from 'react';
import { Sparkles, X, Loader2, CheckCircle2, ArrowRight, Lightbulb } from 'lucide-react';
import { AISuggestionResponse, QRDesignConfig, QRContentPayload } from '../../types';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyAISuggestion: (
    type: string,
    sampleData: Record<string, string>,
    design: QRDesignConfig
  ) => void;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  onApplyAISuggestion
}) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<AISuggestionResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/ai/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (!res.ok) {
        throw new Error('Server returned an error generating AI suggestions.');
      }

      const data = await res.json();
      setSuggestion(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to connect to AI Assistant.');
    } finally {
      setLoading(false);
    }
  };

  const PROMPT_IDEAS = [
    'QR code for my organic coffee shop with green leaf aesthetics and Scan For Menu badge',
    'Luxury hotel guest Wi-Fi pass with cyan neon gradient and Connect Wi-Fi top badge',
    'Executive NFC digital vCard for a tech executive with deep navy blue palette',
    'Instagram influencer connect QR with sunset pink gradient and speech bubble'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '4s' }} />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">AI QR Design Assistant</h3>
              <p className="text-xs text-slate-400">Powered by Gemini AI for instant brand styling</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Prompt Input */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Describe your business or concept:
            </label>
            <div className="relative">
              <textarea
                rows={3}
                placeholder="e.g. Create a QR code for my sushi restaurant menu with gold accents and a fork/knife badge..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>
          </div>

          {/* Prompt Idea Chips */}
          <div>
            <span className="text-[11px] text-slate-400 font-medium block mb-1">Try prompt ideas:</span>
            <div className="flex flex-wrap gap-1.5">
              {PROMPT_IDEAS.map((idea) => (
                <button
                  key={idea}
                  type="button"
                  onClick={() => setPrompt(idea)}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-amber-500/50 text-[11px] text-slate-300 hover:text-amber-300 transition-all text-left"
                >
                  ✨ {idea}
                </button>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 via-indigo-600 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white shadow-lg shadow-amber-500/10 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Gemini is designing your QR code...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Generate AI Design Recommendation</span>
              </>
            )}
          </button>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
              {errorMsg}
            </div>
          )}

          {/* AI Result Card */}
          {suggestion && (
            <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/40 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  AI Recommendation Ready
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 uppercase">
                  {suggestion.type}
                </span>
              </div>

              {/* Design Preview Details */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Pattern Style</span>
                  <span className="font-semibold text-slate-200 capitalize">{suggestion.design.patternStyle}</span>
                </div>
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Frame CTA</span>
                  <span className="font-semibold text-slate-200">{suggestion.design.frameText || 'SCAN ME'}</span>
                </div>
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Color Theme</span>
                    <span className="font-semibold text-slate-200">{suggestion.design.colorType}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-4 h-4 rounded-full border border-slate-700" style={{ backgroundColor: suggestion.design.fgColor }} />
                    <span className="w-4 h-4 rounded-full border border-slate-700" style={{ backgroundColor: suggestion.design.bgColor }} />
                  </div>
                </div>
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Logo Icon</span>
                  <span className="font-semibold text-slate-200 capitalize">{suggestion.design.logoPreset || 'None'}</span>
                </div>
              </div>

              {/* Marketing Tip */}
              {suggestion.marketingTip && (
                <div className="flex items-start gap-2 p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-200 text-xs">
                  <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed">{suggestion.marketingTip}</p>
                </div>
              )}

              {/* Apply Button */}
              <button
                onClick={() => {
                  onApplyAISuggestion(
                    suggestion.type,
                    suggestion.sampleData || {},
                    suggestion.design
                  );
                  onClose();
                }}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
              >
                <span>Apply AI Design to Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
