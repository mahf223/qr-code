import React, { useState } from 'react';
import { BookOpen, CheckCircle, HelpCircle, Code2, ArrowRight } from 'lucide-react';
import { SEO_PAGES, SEOPageData } from '../data/seoPages';

export const SEOLandingPages: React.FC = () => {
  const [activeSlug, setActiveSlug] = useState('/qr-code-generator');
  const [showSchema, setShowSchema] = useState(false);

  const page: SEOPageData = SEO_PAGES[activeSlug] || SEO_PAGES['/qr-code-generator'];

  return (
    <div className="space-y-6 text-white">
      {/* Route Switcher Tabs */}
      <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto text-xs">
        {Object.keys(SEO_PAGES).map((slug) => (
          <button
            key={slug}
            onClick={() => setActiveSlug(slug)}
            className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
              activeSlug === slug
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {slug}
          </button>
        ))}
      </div>

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border border-slate-800 rounded-3xl p-8 space-y-3 relative overflow-hidden shadow-2xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-semibold text-xs">
          <BookOpen className="w-3.5 h-3.5" />
          <span>SEO & Software Application Showcase</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
          {page.h1}
        </h1>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
          {page.subtitle}
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {page.features.map((feat, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 shadow-lg">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <CheckCircle className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-white">{feat.title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
          <HelpCircle className="w-4 h-4" />
          <span>Frequently Asked Questions</span>
        </div>

        <div className="space-y-4">
          {page.faqs.map((faq, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
              <h4 className="font-bold text-xs text-white flex items-center gap-2">
                <span className="text-indigo-400 font-mono">Q:</span> {faq.question}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed pl-5">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Schema Markup Inspector */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
            <Code2 className="w-4 h-4" />
            <span>Structured Schema Markup (JSON-LD)</span>
          </div>
          <button
            onClick={() => setShowSchema(!showSchema)}
            className="text-xs font-semibold text-slate-400 hover:text-white"
          >
            {showSchema ? 'Hide Schema' : 'View Schema JSON-LD'}
          </button>
        </div>

        {showSchema && (
          <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-indigo-300 font-mono overflow-x-auto">
            {JSON.stringify(page.schemaMarkup, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};
