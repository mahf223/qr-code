import React from 'react';
import {
  QrCode,
  Sparkles,
  LayoutTemplate,
  BarChart2,
  Bookmark,
  BookOpen,
  Sun,
  Moon,
  PlusCircle,
  Zap
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  activeTab: 'generator' | 'ai' | 'marketplace' | 'analytics' | 'saved' | 'seo';
  setActiveTab: (tab: 'generator' | 'ai' | 'marketplace' | 'analytics' | 'saved' | 'seo') => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenAIModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  darkMode,
  setDarkMode,
  onOpenAIModal
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-900/80 border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => setActiveTab('generator')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <QrCode className="w-5 h-5 text-indigo-400 group-hover:rotate-12 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                QR Studio Pro
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-full">
                HD Vector
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              AI-Powered QR Generator & Analytics
            </p>
          </div>
        </div>

        {/* Center Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800/80">
          <button
            onClick={() => setActiveTab('generator')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'generator'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            Generator
          </button>

          <button
            onClick={onOpenAIModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            AI Designer
          </button>

          <button
            onClick={() => setActiveTab('marketplace')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'marketplace'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <LayoutTemplate className="w-4 h-4" />
            Templates
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'analytics'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            Campaigns
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'saved'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            Saved
          </button>

          <button
            onClick={() => setActiveTab('seo')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'seo'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Guides & SEO
          </button>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          {/* PWA Install on PC button */}
          <PWAInstallButton />

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 transition-colors"
            title="Toggle theme mode"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-xs ring-2 ring-indigo-500/30">
              PRO
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sub-Nav */}
      <div className="md:hidden flex items-center justify-around py-2 px-2 bg-slate-950 border-t border-slate-800/80 text-[11px] overflow-x-auto gap-1">
        <button
          onClick={() => setActiveTab('generator')}
          className={`px-2.5 py-1 rounded-md font-medium ${activeTab === 'generator' ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400'}`}
        >
          Generator
        </button>
        <button
          onClick={onOpenAIModal}
          className="px-2.5 py-1 rounded-md font-medium text-amber-400 bg-amber-500/10 flex items-center gap-1"
        >
          <Zap className="w-3 h-3" /> AI
        </button>
        <button
          onClick={() => setActiveTab('marketplace')}
          className={`px-2.5 py-1 rounded-md font-medium ${activeTab === 'marketplace' ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400'}`}
        >
          Templates
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-2.5 py-1 rounded-md font-medium ${activeTab === 'analytics' ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400'}`}
        >
          Campaigns
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`px-2.5 py-1 rounded-md font-medium ${activeTab === 'saved' ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400'}`}
        >
          Saved
        </button>
        <button
          onClick={() => setActiveTab('seo')}
          className={`px-2.5 py-1 rounded-md font-medium ${activeTab === 'seo' ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400'}`}
        >
          SEO
        </button>
      </div>
    </header>
  );
};
