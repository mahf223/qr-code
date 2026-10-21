import React, { useState, useEffect } from 'react';
import { Monitor, X, Download, ShieldCheck, Zap } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { PCInstallModal } from './PCInstallModal';

export const PCInstallBanner: React.FC = () => {
  const { isInstalled, isInstallable, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const isDismissed = localStorage.getItem('qr_pc_install_banner_dismissed');
    if (isDismissed === 'true') {
      setDismissed(true);
    }
  }, []);

  if (isInstalled || dismissed) {
    return null;
  }

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('qr_pc_install_banner_dismissed', 'true');
  };

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (!success) {
        setShowModal(true);
      }
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-950/60 via-indigo-950/70 to-slate-900 border border-indigo-500/30 rounded-2xl p-4 sm:p-5 shadow-xl text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/20">
              <Monitor className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">Install QR Studio Pro on your PC</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Desktop App
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 max-w-xl">
                Get lightning-fast offline QR generator tools, full-screen desktop window without browser bars, and launch directly from your Windows Taskbar or Mac Dock.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleInstallClick}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install Desktop App</span>
            </button>

            <button
              onClick={handleDismiss}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <PCInstallModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};
