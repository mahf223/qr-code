import React, { useState } from 'react';
import { Bookmark, Download, Trash2, ExternalLink, QrCode, Search, Check } from 'lucide-react';
import { QRDesignConfig, QRContentPayload } from '../types';

export interface SavedQRItem {
  id: string;
  title: string;
  createdAt: string;
  config: QRDesignConfig;
  payload: QRContentPayload;
  isDynamic: boolean;
}

interface SavedQRsDrawerProps {
  savedItems: SavedQRItem[];
  onLoadSaved: (item: SavedQRItem) => void;
  onDeleteSaved: (id: string) => void;
  onOpenExportModal: () => void;
}

export const SavedQRsDrawer: React.FC<SavedQRsDrawerProps> = ({
  savedItems,
  onLoadSaved,
  onDeleteSaved
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLoadedId, setActiveLoadedId] = useState<string | null>(null);

  const filtered = savedItems.filter((i) =>
    i.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Bookmark className="w-4 h-4" />
            <span>Saved Projects Library</span>
          </div>
          <h2 className="text-2xl font-extrabold">Your Saved QR Codes</h2>
          <p className="text-xs text-slate-400 mt-1">
            Access your saved QR designs, load parameters back into the editor, or re-download vector assets.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search saved QRs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Grid of Saved Projects */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/50 border border-slate-800 rounded-3xl text-slate-400 space-y-3">
          <QrCode className="w-10 h-10 mx-auto text-slate-600" />
          <p className="text-sm font-semibold text-slate-300">No saved designs found</p>
          <p className="text-xs text-slate-500">Create a QR code in the generator and click "Save Design" to store it here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => {
            const isCurrentlyLoaded = activeLoadedId === item.id;

            return (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 text-white flex flex-col justify-between space-y-4 shadow-lg transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                      {item.payload.type}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white line-clamp-1">{item.title}</h3>

                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400 truncate">
                    {JSON.stringify(item.payload.data)}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                  <button
                    onClick={() => {
                      onLoadSaved(item);
                      setActiveLoadedId(item.id);
                    }}
                    className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      isCurrentlyLoaded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    }`}
                  >
                    {isCurrentlyLoaded ? <Check className="w-3.5 h-3.5" /> : <QrCode className="w-3.5 h-3.5" />}
                    <span>{isCurrentlyLoaded ? 'Loaded in Editor' : 'Load into Editor'}</span>
                  </button>

                  <button
                    onClick={() => onDeleteSaved(item.id)}
                    className="p-2 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 rounded-xl transition-colors"
                    title="Delete saved design"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
