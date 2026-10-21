import React from 'react';
import {
  Monitor,
  Download,
  X,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  Zap,
  HardDrive,
  WifiOff
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PCInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PCInstallModal: React.FC<PCInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, install, platform } = usePWAInstall();

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        onClose();
      }
    }
  };

  const openInNewTab = () => {
    window.open(window.location.href, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Install QR Studio Pro on PC</h3>
              <p className="text-xs text-slate-400">Run as a standalone desktop program on Windows, Mac, or Linux</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* If browser directly supports 1-click install */}
          {isInstallable && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-900/40 via-teal-900/40 to-slate-900 border border-emerald-500/40 space-y-3">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>আপনার ব্রাউজার প্রস্তুত! সরাসরি ইনস্টল করুন:</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                নিচের বাটনে ক্লিক করলেই ক্রোম ব্রাউজারের ইনস্টলেশন ডায়ালগ চালু হয়ে যাবে।
              </p>
              <button
                onClick={handleInstallClick}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer animate-pulse"
              >
                <Download className="w-5 h-5" />
                <span>সরাসরি কম্পিউটারে ইনস্টল করুন (Install Now)</span>
              </button>
            </div>
          )}

          {/* Notice for preview frame / Google Chrome */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-slate-900 border border-indigo-500/40 space-y-3">
            <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
              <Monitor className="w-4 h-4 text-indigo-400" />
              <span>গুগল ক্রোম (Google Chrome) দিয়ে কম্পিউটারে ইনস্টল করার সহজ নিয়ম:</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              যেহেতু আপনি এটি প্রিভিউ ফ্রেমের ভেতরে দেখছেন, তাই ক্রোম ব্রাউজারের আসল ইনস্টল অপশনটি পেতে নিচের <strong>"নতুন ট্যাবে খুলুন"</strong> বাটনে ক্লিক করুন।
            </p>

            <button
              onClick={openInNewTab}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>১. নতুন ক্রোম ট্যাবে খুলুন (Open in New Tab to Install)</span>
            </button>
          </div>

          {/* Step by step for Google Chrome */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span>২টি সহজ ধাপে ক্রোম ব্রাউজার থেকে ইনস্টল করুন:</span>
            </h4>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-mono text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  ১
                </span>
                <p>
                  নতুন ট্যাবে অ্যাপটি ওপেন হলে, ক্রোম ব্রাউজারের উপরের <strong>Address Bar (লিংক বার)</strong> এর একদম ডানদিকে তাকান। সেখানে একটি <strong>কম্পিউটার বা ইন্সটল আইকন (⊕ বা মনিটর চিহ্ন)</strong> দেখতে পাবেন।
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-mono text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  ২
                </span>
                <p>
                  সেই আইকনে ক্লিক করে <strong>"Install"</strong> বাটনে চাপ দিন। সাথে সাথে অ্যাপটি আপনার কম্পিউটারের Desktop ও Start Menu-তে সফটওয়্যার হিসেবে চলে আসবে!
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
                💡 <strong>বিকল্প উপায়:</strong> গুগল ক্রোমের একদম উপরে ডান কোনায় <strong>৩টি ডট (⋮)</strong> মেনু ক্লিক করুন ➔ <strong>"Save and share"</strong> বা <strong>"Apps"</strong> ➔ <strong>"Install QR Studio Pro..."</strong> এ ক্লিক করুন।
              </div>
            </div>
          </div>

          {/* Android Debug APK Direct Download Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 text-sm">🤖</span>
                <span className="text-xs font-bold text-white">Android Debug APK (Compiled & Ready)</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                1.4 MB
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              আপনি চাইলে সরাসরি অ্যানড্রয়েড ডিভাইসের জন্য তৈরি করা আসল ইনস্টলযোগ্য APK ফাইলটিও ডাউনলোড করতে পারেন।
            </p>
            <a
              href="/download-apk"
              download="QRStudioPro-debug.apk"
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 transition-colors shadow-md shadow-emerald-600/20"
            >
              <Download className="w-4 h-4" />
              <span>Download Android APK (app-debug.apk)</span>
            </a>
          </div>

          {/* Desktop App Advantages */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Desktop PC Advantages:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex items-start gap-2.5">
                <Zap className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-200 block">Runs Without Browser Bars</span>
                  <span className="text-[11px] text-slate-400">Full-bleed clean interface with no distracting tabs.</span>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex items-start gap-2.5">
                <WifiOff className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-200 block">Works 100% Offline</span>
                  <span className="text-[11px] text-slate-400">Generate QR codes and export SVG vectors anywhere.</span>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex items-start gap-2.5">
                <HardDrive className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-200 block">Pin to Taskbar</span>
                  <span className="text-[11px] text-slate-400">One-click launch from Windows Taskbar or Mac Dock.</span>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-200 block">Zero Storage Bloat</span>
                  <span className="text-[11px] text-slate-400">Uses less than 5 MB of PC disk space and auto-updates.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Compatible with Windows 10/11, macOS, and Linux
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
