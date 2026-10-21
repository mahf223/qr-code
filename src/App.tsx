import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Sliders,
  Palette,
  Image as ImageIcon,
  Frame,
  Layers,
  ChevronDown,
  ChevronUp,
  Download,
  Bookmark,
  Zap,
  Check
} from 'lucide-react';
import { Header } from './components/Header';
import { TypeSelector } from './components/TypeSelector';
import { ContentForms } from './components/ContentForms';
import { PatternEyePanel } from './components/DesignerPanels/PatternEyePanel';
import { ColorPanel } from './components/DesignerPanels/ColorPanel';
import { LogoPanel } from './components/DesignerPanels/LogoPanel';
import { FramePanel } from './components/DesignerPanels/FramePanel';
import { AIAssistantModal } from './components/DesignerPanels/AIAssistantModal';
import { QRCanvas } from './components/QRCanvas';
import { ScanValidator } from './components/ScanValidator';
import { ExportModal } from './components/ExportModal';
import { TemplatesMarketplace } from './components/TemplatesMarketplace';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { SavedQRsDrawer, SavedQRItem } from './components/SavedQRsDrawer';
import { SEOLandingPages } from './components/SEOLandingPages';
import { PCInstallBanner } from './components/PCInstallBanner';
import { OfflineIndicator } from './components/OfflineIndicator';

import {
  QRType,
  QRDesignConfig,
  QRContentPayload,
  ScanValidationResult
} from './types';
import { encodePayloadToString, validateQRDesign } from './utils/qrEncoder';

const DEFAULT_DESIGN_CONFIG: QRDesignConfig = {
  patternStyle: 'rounded',
  fgColor: '#0f172a',
  bgColor: '#ffffff',
  isBgTransparent: false,
  colorType: 'single',
  gradientType: 'linear',
  gradientColor2: '#2563eb',
  gradientRotation: 45,
  eyeFrameShape: 'rounded',
  eyeDotShape: 'circle',
  eyeFrameColor: '#0f172a',
  eyeDotColor: '#2563eb',
  useCustomEyeColor: true,
  logoPreset: 'none',
  logoSizeRatio: 0.22,
  logoMargin: 4,
  logoBgColor: '#ffffff',
  logoBgShape: 'circle',
  frameStyle: 'bottom-badge',
  frameText: 'SCAN ME',
  frameColor: '#0f172a',
  frameTextColor: '#ffffff',
  frameFont: 'sans-serif',
  errorCorrectionLevel: 'H'
};

const DEFAULT_PAYLOAD: QRContentPayload = {
  type: 'url',
  data: { url: 'https://qrstudiopro.com' }
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'generator' | 'ai' | 'marketplace' | 'analytics' | 'saved' | 'seo'>('generator');
  const [darkMode, setDarkMode] = useState(true);

  // QR Content & Customization State
  const [selectedType, setSelectedType] = useState<QRType>('url');
  const [payload, setPayload] = useState<QRContentPayload>(DEFAULT_PAYLOAD);
  const [designConfig, setDesignConfig] = useState<QRDesignConfig>(DEFAULT_DESIGN_CONFIG);

  // Dynamic QR State
  const [isDynamic, setIsDynamic] = useState(false);
  const [dynamicShortCode, setDynamicShortCode] = useState('qr-demo');

  // Modals & Accordions State
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<'content' | 'pattern' | 'color' | 'logo' | 'frame'>('content');

  // Saved Projects Library State
  const [savedItems, setSavedItems] = useState<SavedQRItem[]>([
    {
      id: 'saved-1',
      title: 'Grand Bistro Menu QR',
      createdAt: new Date().toISOString(),
      config: DEFAULT_DESIGN_CONFIG,
      payload: { type: 'url', data: { url: 'https://bistro-luxe.com/menu' } },
      isDynamic: true
    }
  ]);
  const [saveToast, setSaveToast] = useState(false);

  // Handle QR Type Selection
  const handleSelectType = (type: QRType) => {
    setSelectedType(type);
    let initialData: any = {};
    switch (type) {
      case 'url': initialData = { url: 'https://qrstudiopro.com' }; break;
      case 'text': initialData = { text: 'Welcome to QR Studio Pro!' }; break;
      case 'email': initialData = { email: 'hello@example.com', subject: 'Inquiry', body: 'Hi there!' }; break;
      case 'phone': initialData = { phone: '+1 (555) 019-2834' }; break;
      case 'sms': initialData = { phone: '+1 (555) 019-2834', message: 'Hello' }; break;
      case 'whatsapp': initialData = { countryCode: '+1', phone: '5550192834', message: 'Hi!' }; break;
      case 'wifi': initialData = { ssid: 'Guest_WiFi_5G', password: 'WelcomeGuest2026', encryption: 'WPA/WPA2', hidden: false }; break;
      case 'vcard': initialData = { firstName: 'Alexander', lastName: 'Wright', organization: 'Apex Labs', email: 'alex@apex.io', phone: '+1 (555) 234-5678' }; break;
      case 'location': initialData = { address: 'Times Square, New York' }; break;
      case 'event': initialData = { title: 'Tech Summit 2026', startDateTime: '', endDateTime: '', location: 'San Francisco' }; break;
      case 'social': initialData = { platform: 'instagram', usernameOrUrl: 'creative_studio' }; break;
      case 'app': initialData = { appStoreUrl: 'https://apps.apple.com' }; break;
      case 'payment': initialData = { method: 'upi', payeeId: 'merchant@upi', payeeName: 'Coffee Shop', amount: '10.00' }; break;
      case 'pdf': initialData = { fileUrl: 'https://example.com/brochure.pdf', title: 'Catalog' }; break;
    }
    setPayload({ type, data: initialData } as QRContentPayload);
  };

  // Calculate encoded data string for QR generator
  const qrDataString = useMemo(() => {
    if (isDynamic) {
      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://qrstudiopro.com';
      return `${origin}/r/${dynamicShortCode || 'qr-demo'}`;
    }
    return encodePayloadToString(payload);
  }, [payload, isDynamic, dynamicShortCode]);

  // Calculate scanability health validation
  const validationResult: ScanValidationResult = useMemo(() => {
    return validateQRDesign(designConfig, qrDataString.length);
  }, [designConfig, qrDataString]);

  // Handle AI Assistant Suggestion Application
  const handleApplyAISuggestion = (type: string, sampleData: Record<string, string>, newDesign: QRDesignConfig) => {
    const validTypes: QRType[] = ['url', 'text', 'email', 'phone', 'sms', 'whatsapp', 'wifi', 'vcard', 'location', 'event', 'social', 'app', 'payment', 'pdf'];
    const targetType = validTypes.includes(type as QRType) ? (type as QRType) : 'url';

    setSelectedType(targetType);
    setPayload({ type: targetType, data: sampleData as any } as QRContentPayload);
    setDesignConfig(newDesign);
    setActiveTab('generator');
  };

  // Save current design to Saved Projects
  const handleSaveToAccount = () => {
    const newItem: SavedQRItem = {
      id: `saved-${Date.now()}`,
      title: (payload.data as any)?.title || (payload.data as any)?.url || `${selectedType.toUpperCase()} Project`,
      createdAt: new Date().toISOString(),
      config: { ...designConfig },
      payload: { ...payload },
      isDynamic
    };
    setSavedItems((prev) => [newItem, ...prev]);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} flex flex-col font-sans transition-colors duration-200 selection:bg-indigo-500 selection:text-white`}>
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenAIModal={() => setIsAIModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Desktop PC Install Callout Banner */}
        <PCInstallBanner />

        {/* Toast Banner */}
        {saveToast && (
          <div className="fixed bottom-5 right-5 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 font-bold text-xs animate-bounce">
            <Check className="w-4 h-4" />
            <span>Saved project to your library!</span>
          </div>
        )}

        {/* 1. GENERATOR TAB */}
        {activeTab === 'generator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT SIDE: Settings & Customization Panels (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              {/* Type Selection Header Grid */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    <span>Select QR Code Type</span>
                  </h2>
                  <button
                    onClick={() => setIsAIModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Auto Design with AI</span>
                  </button>
                </div>

                <TypeSelector selectedType={selectedType} onSelectType={handleSelectType} />
              </div>

              {/* Accordion Panels */}
              <div className="space-y-3">
                {/* 1. Content Form */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                  <button
                    onClick={() => setOpenAccordion(openAccordion === 'content' ? ('' as any) : 'content')}
                    className="w-full p-4 flex items-center justify-between text-left font-bold text-sm text-white hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                        1
                      </div>
                      <span>Enter Content & Data ({selectedType.toUpperCase()})</span>
                    </div>
                    {openAccordion === 'content' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>

                  {openAccordion === 'content' && (
                    <div className="p-4 pt-0 border-t border-slate-800/80">
                      <ContentForms
                        selectedType={selectedType}
                        payload={payload}
                        onChangePayload={setPayload}
                        isDynamic={isDynamic}
                        setIsDynamic={setIsDynamic}
                        dynamicShortCode={dynamicShortCode}
                        setDynamicShortCode={setDynamicShortCode}
                      />
                    </div>
                  )}
                </div>

                {/* 2. Pattern & Corner Eyes */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                  <button
                    onClick={() => setOpenAccordion(openAccordion === 'pattern' ? ('' as any) : 'pattern')}
                    className="w-full p-4 flex items-center justify-between text-left font-bold text-sm text-white hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                        2
                      </div>
                      <div className="flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-indigo-400" />
                        <span>QR Pattern & Corner Eye Shapes</span>
                      </div>
                    </div>
                    {openAccordion === 'pattern' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>

                  {openAccordion === 'pattern' && (
                    <div className="p-4 pt-0 border-t border-slate-800/80">
                      <PatternEyePanel
                        config={designConfig}
                        onChangeConfig={(up) => setDesignConfig((prev) => ({ ...prev, ...up }))}
                      />
                    </div>
                  )}
                </div>

                {/* 3. Color System & Palettes */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                  <button
                    onClick={() => setOpenAccordion(openAccordion === 'color' ? ('' as any) : 'color')}
                    className="w-full p-4 flex items-center justify-between text-left font-bold text-sm text-white hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                        3
                      </div>
                      <div className="flex items-center gap-2">
                        <Palette className="w-4 h-4 text-purple-400" />
                        <span>Color System & Gradients</span>
                      </div>
                    </div>
                    {openAccordion === 'color' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>

                  {openAccordion === 'color' && (
                    <div className="p-4 pt-0 border-t border-slate-800/80">
                      <ColorPanel
                        config={designConfig}
                        onChangeConfig={(up) => setDesignConfig((prev) => ({ ...prev, ...up }))}
                      />
                    </div>
                  )}
                </div>

                {/* 4. Logo Integration */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                  <button
                    onClick={() => setOpenAccordion(openAccordion === 'logo' ? ('' as any) : 'logo')}
                    className="w-full p-4 flex items-center justify-between text-left font-bold text-sm text-white hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                        4
                      </div>
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-cyan-400" />
                        <span>Logo & Brand Icon Overlay</span>
                      </div>
                    </div>
                    {openAccordion === 'logo' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>

                  {openAccordion === 'logo' && (
                    <div className="p-4 pt-0 border-t border-slate-800/80">
                      <LogoPanel
                        config={designConfig}
                        onChangeConfig={(up) => setDesignConfig((prev) => ({ ...prev, ...up }))}
                      />
                    </div>
                  )}
                </div>

                {/* 5. Frame & CTA */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                  <button
                    onClick={() => setOpenAccordion(openAccordion === 'frame' ? ('' as any) : 'frame')}
                    className="w-full p-4 flex items-center justify-between text-left font-bold text-sm text-white hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                        5
                      </div>
                      <div className="flex items-center gap-2">
                        <Frame className="w-4 h-4 text-amber-400" />
                        <span>Frame & Call To Action Badge</span>
                      </div>
                    </div>
                    {openAccordion === 'frame' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>

                  {openAccordion === 'frame' && (
                    <div className="p-4 pt-0 border-t border-slate-800/80">
                      <FramePanel
                        config={designConfig}
                        onChangeConfig={(up) => setDesignConfig((prev) => ({ ...prev, ...up }))}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: Live Canvas Preview & Health Diagnostic (5 Cols) */}
            <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
              {/* QR Canvas Preview Component */}
              <QRCanvas
                dataString={qrDataString}
                config={designConfig}
                validation={validationResult}
                isDynamic={isDynamic}
                onOpenExportModal={() => setIsExportModalOpen(true)}
                onSaveToAccount={handleSaveToAccount}
              />

              {/* Real-time Scanability Diagnostic */}
              <ScanValidator validation={validationResult} />
            </div>
          </div>
        )}

        {/* 2. TEMPLATES MARKETPLACE TAB */}
        {activeTab === 'marketplace' && (
          <TemplatesMarketplace
            onApplyTemplate={(cfg, pld) => {
              setDesignConfig((prev) => ({ ...prev, ...cfg }));
              setPayload(pld);
              setSelectedType(pld.type);
              setActiveTab('generator');
            }}
          />
        )}

        {/* 3. CAMPAIGNS ANALYTICS TAB */}
        {activeTab === 'analytics' && <AnalyticsDashboard />}

        {/* 4. SAVED PROJECTS TAB */}
        {activeTab === 'saved' && (
          <SavedQRsDrawer
            savedItems={savedItems}
            onLoadSaved={(item) => {
              setDesignConfig(item.config);
              setPayload(item.payload);
              setSelectedType(item.payload.type);
              setIsDynamic(item.isDynamic);
              setActiveTab('generator');
            }}
            onDeleteSaved={(id) => setSavedItems((prev) => prev.filter((i) => i.id !== id))}
            onOpenExportModal={() => setIsExportModalOpen(true)}
          />
        )}

        {/* 5. SEO GUIDES TAB */}
        {activeTab === 'seo' && <SEOLandingPages />}
      </main>

      {/* AI Assistant Modal */}
      <AIAssistantModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onApplyAISuggestion={handleApplyAISuggestion}
      />

      {/* Export HD Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        dataString={qrDataString}
        config={designConfig}
      />

      {/* Real-Time Offline Status Indicator */}
      <OfflineIndicator />
    </div>
  );
}
