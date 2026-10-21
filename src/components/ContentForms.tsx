import React from 'react';
import {
  Globe,
  FileText,
  Mail,
  Phone,
  MessageSquare,
  MessageCircle,
  Wifi,
  UserCheck,
  MapPin,
  Calendar,
  Share2,
  Smartphone,
  CreditCard,
  FileDown,
  Zap,
  Info
} from 'lucide-react';
import { QRType, QRContentPayload } from '../types';

interface ContentFormsProps {
  selectedType: QRType;
  payload: QRContentPayload;
  onChangePayload: (newPayload: QRContentPayload) => void;
  isDynamic: boolean;
  setIsDynamic: (val: boolean) => void;
  dynamicShortCode: string;
  setDynamicShortCode: (code: string) => void;
}

export const ContentForms: React.FC<ContentFormsProps> = ({
  selectedType,
  payload,
  onChangePayload,
  isDynamic,
  setIsDynamic,
  dynamicShortCode,
  setDynamicShortCode
}) => {
  // Helper to safely update sub-fields of payload
  const updateData = (fields: Partial<any>) => {
    onChangePayload({
      type: selectedType,
      data: { ...(payload.data || {}), ...fields }
    } as QRContentPayload);
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
      {/* Header & Dynamic Switch */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>Configure {selectedType.toUpperCase()} Content</span>
          </h3>
          <p className="text-xs text-slate-400">Fill in the required information for your QR code.</p>
        </div>

        {/* Dynamic QR Toggle Banner */}
        <div className="flex items-center gap-3 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2">
            <Zap className={`w-3.5 h-3.5 ${isDynamic ? 'text-amber-400 animate-pulse' : 'text-slate-500'}`} />
            <span className="text-xs font-semibold text-slate-200">Dynamic QR</span>
          </div>
          <button
            onClick={() => setIsDynamic(!isDynamic)}
            className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              isDynamic ? 'bg-amber-500' : 'bg-slate-700'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                isDynamic ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Dynamic QR Info Notice */}
      {isDynamic && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-2">
          <div className="flex items-center gap-2 font-semibold">
            <Info className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>Dynamic Mode Active: Edit Destination Anytime + Real-Time Analytics</span>
          </div>
          <p className="text-amber-200/80 leading-relaxed text-[11px]">
            Your QR code will link to a short URL redirect. Even after printing, you can update the destination link from your Campaigns dashboard!
          </p>
          <div className="flex items-center gap-2 pt-1">
            <span className="text-[11px] text-slate-400">Custom Short Code:</span>
            <input
              type="text"
              value={dynamicShortCode}
              onChange={(e) => setDynamicShortCode(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
              placeholder="e.g. bistro-menu"
              className="bg-slate-900 border border-amber-500/40 rounded px-2 py-0.5 text-xs text-amber-300 font-mono focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Dynamic Form Render depending on selectedType */}

      {/* 1. URL */}
      {selectedType === 'url' && (
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-300">Website or Page URL *</label>
          <div className="relative">
            <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="url"
              placeholder="https://yourwebsite.com/landing-page"
              value={(payload.data as any)?.url || ''}
              onChange={(e) => updateData({ url: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
            <span>Quick Presets:</span>
            <button
              type="button"
              onClick={() => updateData({ url: 'https://bistro-luxe.com/menu' })}
              className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
            >
              Restaurant Menu
            </button>
            <button
              type="button"
              onClick={() => updateData({ url: 'https://google.com/maps' })}
              className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
            >
              Google Review
            </button>
          </div>
        </div>
      )}

      {/* 2. TEXT */}
      {selectedType === 'text' && (
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-300">Plain Text Message *</label>
          <div className="relative">
            <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <textarea
              rows={3}
              placeholder="Enter plain text, code, memo, or instructions..."
              value={(payload.data as any)?.text || ''}
              onChange={(e) => updateData({ text: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>
        </div>
      )}

      {/* 3. EMAIL */}
      {selectedType === 'email' && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Recipient Email *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="contact@company.com"
                value={(payload.data as any)?.email || ''}
                onChange={(e) => updateData({ email: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Subject</label>
              <input
                type="text"
                placeholder="Inquiry about services"
                value={(payload.data as any)?.subject || ''}
                onChange={(e) => updateData({ subject: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Pre-filled Body</label>
              <input
                type="text"
                placeholder="Hello, I would like to book..."
                value={(payload.data as any)?.body || ''}
                onChange={(e) => updateData({ body: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* 4. PHONE */}
      {selectedType === 'phone' && (
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-300">Phone Number *</label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="tel"
              placeholder="+1 (555) 019-2834"
              value={(payload.data as any)?.phone || ''}
              onChange={(e) => updateData({ phone: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      )}

      {/* 5. SMS */}
      {selectedType === 'sms' && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number *</label>
            <div className="relative">
              <MessageSquare className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                placeholder="+1 (555) 019-2834"
                value={(payload.data as any)?.phone || ''}
                onChange={(e) => updateData({ phone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">SMS Message</label>
            <textarea
              rows={2}
              placeholder="JOIN offer"
              value={(payload.data as any)?.message || ''}
              onChange={(e) => updateData({ message: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>
        </div>
      )}

      {/* 6. WHATSAPP */}
      {selectedType === 'whatsapp' && (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Country Code</label>
              <input
                type="text"
                placeholder="+1"
                value={(payload.data as any)?.countryCode || '+1'}
                onChange={(e) => updateData({ countryCode: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">WhatsApp Number *</label>
              <div className="relative">
                <MessageCircle className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  placeholder="5550192834"
                  value={(payload.data as any)?.phone || ''}
                  onChange={(e) => updateData({ phone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Pre-filled Chat Message</label>
            <textarea
              rows={2}
              placeholder="Hi! I would like to inquire about..."
              value={(payload.data as any)?.message || ''}
              onChange={(e) => updateData({ message: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>
        </div>
      )}

      {/* 7. WIFI */}
      {selectedType === 'wifi' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Network Name (SSID) *</label>
              <div className="relative">
                <Wifi className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Guest_WiFi_5G"
                  value={(payload.data as any)?.ssid || ''}
                  onChange={(e) => updateData({ ssid: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <input
                type="text"
                placeholder="WelcomeGuest2026"
                value={(payload.data as any)?.password || ''}
                onChange={(e) => updateData({ password: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-300">Encryption Standard:</label>
              <select
                value={(payload.data as any)?.encryption || 'WPA/WPA2'}
                onChange={(e) => updateData({ encryption: e.target.value })}
                className="bg-slate-950 border border-slate-700/80 rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
              >
                <option value="WPA/WPA2">WPA/WPA2 (Recommended)</option>
                <option value="WEP">WEP</option>
                <option value="nopass">None (Open Network)</option>
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                checked={!!(payload.data as any)?.hidden}
                onChange={(e) => updateData({ hidden: e.target.checked })}
                className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500"
              />
              Hidden Network
            </label>
          </div>
        </div>
      )}

      {/* 8. VCARD */}
      {selectedType === 'vcard' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">First Name *</label>
              <input
                type="text"
                placeholder="Alexander"
                value={(payload.data as any)?.firstName || ''}
                onChange={(e) => updateData({ firstName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Last Name</label>
              <input
                type="text"
                placeholder="Wright"
                value={(payload.data as any)?.lastName || ''}
                onChange={(e) => updateData({ lastName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Company / Org</label>
              <input
                type="text"
                placeholder="Apex Growth Labs"
                value={(payload.data as any)?.organization || ''}
                onChange={(e) => updateData({ organization: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Job Title</label>
              <input
                type="text"
                placeholder="Managing Director"
                value={(payload.data as any)?.title || ''}
                onChange={(e) => updateData({ title: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="alex@apexgrowth.io"
                value={(payload.data as any)?.email || ''}
                onChange={(e) => updateData({ email: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Phone / Cell</label>
              <input
                type="tel"
                placeholder="+1 (555) 234-5678"
                value={(payload.data as any)?.phone || ''}
                onChange={(e) => updateData({ phone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Website URL</label>
              <input
                type="url"
                placeholder="https://apexgrowth.io"
                value={(payload.data as any)?.website || ''}
                onChange={(e) => updateData({ website: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Office Address</label>
              <input
                type="text"
                placeholder="100 Innovation Way, San Francisco"
                value={(payload.data as any)?.street || ''}
                onChange={(e) => updateData({ street: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* 9. LOCATION */}
      {selectedType === 'location' && (
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-300">Address or Business Name *</label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-red-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Empire State Building, New York, NY"
              value={(payload.data as any)?.address || ''}
              onChange={(e) => updateData({ address: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      )}

      {/* 10. EVENT */}
      {selectedType === 'event' && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Event Title *</label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-indigo-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Global AI Developer Summit 2026"
                value={(payload.data as any)?.title || ''}
                onChange={(e) => updateData({ title: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Start Date & Time</label>
              <input
                type="datetime-local"
                value={(payload.data as any)?.startDateTime || ''}
                onChange={(e) => updateData({ startDateTime: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">End Date & Time</label>
              <input
                type="datetime-local"
                value={(payload.data as any)?.endDateTime || ''}
                onChange={(e) => updateData({ endDateTime: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Location / Venue</label>
            <input
              type="text"
              placeholder="Moscone Center, San Francisco"
              value={(payload.data as any)?.location || ''}
              onChange={(e) => updateData({ location: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      )}

      {/* 11. SOCIAL */}
      {selectedType === 'social' && (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Platform</label>
              <select
                value={(payload.data as any)?.platform || 'instagram'}
                onChange={(e) => updateData({ platform: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="instagram">Instagram</option>
                <option value="linkedin">LinkedIn</option>
                <option value="youtube">YouTube</option>
                <option value="twitter">X (Twitter)</option>
                <option value="facebook">Facebook</option>
                <option value="tiktok">TikTok</option>
                <option value="github">GitHub</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Username or Profile URL *</label>
              <div className="relative">
                <Share2 className="w-4 h-4 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="@username or full profile link"
                  value={(payload.data as any)?.usernameOrUrl || ''}
                  onChange={(e) => updateData({ usernameOrUrl: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 12. APP DOWNLOAD */}
      {selectedType === 'app' && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">App Store (iOS) URL</label>
            <input
              type="url"
              placeholder="https://apps.apple.com/app/id123456"
              value={(payload.data as any)?.appStoreUrl || ''}
              onChange={(e) => updateData({ appStoreUrl: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Google Play Store URL</label>
            <input
              type="url"
              placeholder="https://play.google.com/store/apps/details?id=com.app"
              value={(payload.data as any)?.playStoreUrl || ''}
              onChange={(e) => updateData({ playStoreUrl: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      )}

      {/* 13. PAYMENT */}
      {selectedType === 'payment' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Payment Method</label>
              <select
                value={(payload.data as any)?.method || 'upi'}
                onChange={(e) => updateData({ method: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="upi">UPI ID (India)</option>
                <option value="paypal">PayPal.Me</option>
                <option value="crypto_btc">Bitcoin (BTC)</option>
                <option value="crypto_eth">Ethereum (ETH)</option>
                <option value="crypto_sol">Solana (SOL)</option>
                <option value="bank_iban">Bank IBAN Transfer</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">ID / Wallet Address *</label>
              <input
                type="text"
                placeholder="merchant@upi or Wallet address"
                value={(payload.data as any)?.payeeId || ''}
                onChange={(e) => updateData({ payeeId: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono text-[11px]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Payee / Merchant Name</label>
              <input
                type="text"
                placeholder="Urban Coffee Co."
                value={(payload.data as any)?.payeeName || ''}
                onChange={(e) => updateData({ payeeName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Amount (Optional)</label>
              <input
                type="text"
                placeholder="25.00"
                value={(payload.data as any)?.amount || ''}
                onChange={(e) => updateData({ amount: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* 14. PDF */}
      {selectedType === 'pdf' && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">PDF File URL *</label>
            <div className="relative">
              <FileDown className="w-4 h-4 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                placeholder="https://company.com/documents/brochure.pdf"
                value={(payload.data as any)?.fileUrl || ''}
                onChange={(e) => updateData({ fileUrl: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Document Title</label>
            <input
              type="text"
              placeholder="2026 Product Catalog & Price List"
              value={(payload.data as any)?.title || ''}
              onChange={(e) => updateData({ title: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      )}
    </div>
  );
};
