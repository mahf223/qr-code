import React, { useState } from 'react';
import { Monitor, Download, Check } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { PCInstallModal } from './PCInstallModal';

interface PWAInstallButtonProps {
  compact?: boolean;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ compact = false }) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [modalOpen, setModalOpen] = useState(false);

  const handleClick = async () => {
    if (isInstallable) {
      const installed = await install();
      if (!installed) {
        setModalOpen(true);
      }
    } else {
      setModalOpen(true);
    }
  };

  // If already running in standalone desktop/installed mode
  if (isInstalled) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
        <Check className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Installed on PC</span>
        <span className="sm:hidden">Installed</span>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={handleClick}
        className={`flex items-center gap-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md ${
          compact
            ? 'px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-indigo-500/20'
            : 'px-3.5 py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white shadow-indigo-500/25 hover:scale-[1.02]'
        }`}
        title="Install QR Studio Pro as a standalone PC desktop application"
      >
        <Monitor className="w-3.5 h-3.5 text-indigo-200" />
        <span>Install on PC</span>
      </button>

      <PCInstallModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};
