import React, { useState } from 'react';
import { LayoutTemplate, Search, ArrowRight, Check, Sparkles } from 'lucide-react';
import { PRESET_TEMPLATES } from '../data/templates';
import { QRDesignConfig, QRContentPayload } from '../types';

interface TemplatesMarketplaceProps {
  onApplyTemplate: (config: Partial<QRDesignConfig>, payload: QRContentPayload) => void;
}

export const TemplatesMarketplace: React.FC<TemplatesMarketplaceProps> = ({ onApplyTemplate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [appliedId, setAppliedId] = useState<string | null>(null);

  const categories = ['All', 'Restaurant', 'Business', 'Social', 'Tech', 'Marketing'];

  const filtered = PRESET_TEMPLATES.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || t.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleApply = (templateId: string, config: Partial<QRDesignConfig>, payload: QRContentPayload) => {
    onApplyTemplate(config, payload);
    setAppliedId(templateId);
    setTimeout(() => setAppliedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="max-w-2xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-semibold text-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Designer Templates</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            QR Templates Marketplace
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            Jumpstart your QR design with hand-crafted industry templates optimized for restaurant menus, executive vCards, Wi-Fi guest passes, and social media campaigns.
          </p>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 overflow-x-auto w-full sm:w-auto text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Template Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((t) => {
          const isApplied = appliedId === t.id;

          return (
            <div
              key={t.id}
              className="bg-slate-900/90 border border-slate-800/90 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:shadow-2xl transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {t.category}
                  </span>
                  <div className="w-4 h-4 rounded-full border border-slate-700" style={{ backgroundColor: t.previewColor }} />
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {t.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {t.description}
                </p>
              </div>

              {/* Apply Button */}
              <button
                onClick={() => handleApply(t.id, t.config, t.samplePayload)}
                className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  isApplied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-950 hover:bg-indigo-600 border border-slate-800 hover:border-indigo-500 text-slate-200 hover:text-white'
                }`}
              >
                {isApplied ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Template Applied!</span>
                  </>
                ) : (
                  <>
                    <span>Apply Template to Workspace</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
