import { useEffect, useState } from 'react';

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [platform, setPlatform] = useState<{
    isPC: boolean;
    isWindows: boolean;
    isMac: boolean;
    isLinux: boolean;
    isIOS: boolean;
    isAndroid: boolean;
    browser: 'chrome' | 'edge' | 'brave' | 'safari' | 'firefox' | 'other';
  }>({
    isPC: true,
    isWindows: false,
    isMac: false,
    isLinux: false,
    isIOS: false,
    isAndroid: false,
    browser: 'chrome'
  });

  useEffect(() => {
    // Detect standalone mode (already installed on PC or mobile)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
      document.referrer.includes('android-app://');

    setIsInstalled(isStandalone);

    // Detect platform & OS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isWindows = /windows|win32|win64/.test(userAgent);
    const isMac = /macintosh|mac os x/.test(userAgent) && !/iphone|ipad|ipod/.test(userAgent);
    const isLinux = /linux/.test(userAgent) && !/android/.test(userAgent);
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    const isPC = isWindows || isMac || isLinux || (!isIOS && !isAndroid);

    let browser: 'chrome' | 'edge' | 'brave' | 'safari' | 'firefox' | 'other' = 'other';
    if (/edg\//.test(userAgent)) browser = 'edge';
    else if (/chrome|crios/.test(userAgent)) browser = 'chrome';
    else if (/safari/.test(userAgent) && !/chrome/.test(userAgent)) browser = 'safari';
    else if (/firefox|fxios/.test(userAgent)) browser = 'firefox';

    setPlatform({
      isPC,
      isWindows,
      isMac,
      isLinux,
      isIOS,
      isAndroid,
      browser
    });

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = async (): Promise<boolean> => {
    if (!deferredPrompt) {
      return false;
    }
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
        return true;
      }
    } catch (err) {
      console.warn('Install prompt error:', err);
    }
    return false;
  };

  return {
    isInstallable: !!deferredPrompt,
    isInstalled,
    install,
    platform
  };
}
