import React, { useState } from 'react';
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
  Search
} from 'lucide-react';
import { QRType, QRTypeOption } from '../types';

interface TypeSelectorProps {
  selectedType: QRType;
  onSelectType: (type: QRType) => void;
}

export const QR_TYPE_OPTIONS: QRTypeOption[] = [
  { id: 'url', label: 'Website URL', description: 'Link to any website or page', icon: 'Globe', category: 'essential' },
  { id: 'vcard', label: 'vCard Contact', description: 'Save name, phone, email & address', icon: 'UserCheck', category: 'contact', badge: 'Popular' },
  { id: 'wifi', label: 'Wi-Fi Network', description: 'Connect guests without typing password', icon: 'Wifi', category: 'essential', badge: 'Fast' },
  { id: 'text', label: 'Plain Text', description: 'Display plain message or memo', icon: 'FileText', category: 'essential' },
  { id: 'email', label: 'Email Message', description: 'Pre-filled recipient, subject & body', icon: 'Mail', category: 'contact' },
  { id: 'phone', label: 'Phone Call', description: 'Dial a phone number on tap', icon: 'Phone', category: 'contact' },
  { id: 'sms', label: 'SMS Text', description: 'Send pre-written text message', icon: 'MessageSquare', category: 'contact' },
  { id: 'whatsapp', label: 'WhatsApp', description: 'Open chat with pre-written message', icon: 'MessageCircle', category: 'contact', badge: 'Viral' },
  { id: 'location', label: 'Google Maps', description: 'Map address or GPS coordinates', icon: 'MapPin', category: 'business' },
  { id: 'event', label: 'Calendar Event', description: 'Save event title, time & location', icon: 'Calendar', category: 'business' },
  { id: 'social', label: 'Social Profile', description: 'Instagram, LinkedIn, YouTube, X', icon: 'Share2', category: 'media' },
  { id: 'app', label: 'App Download', description: 'App Store & Play Store multi-link', icon: 'Smartphone', category: 'media' },
  { id: 'payment', label: 'Payment QR', description: 'UPI, PayPal, Bank IBAN, Crypto', icon: 'CreditCard', category: 'business', badge: 'Secure' },
  { id: 'pdf', label: 'PDF Document', description: 'Download PDF file or brochure', icon: 'FileDown', category: 'media' }
];

export const TypeSelector: React.FC<TypeSelectorProps> = ({ selectedType, onSelectType }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'essential' | 'contact' | 'business' | 'media'>('all');

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Globe': return Globe;
      case 'FileText': return FileText;
      case 'Mail': return Mail;
      case 'Phone': return Phone;
      case 'MessageSquare': return MessageSquare;
      case 'MessageCircle': return MessageCircle;
      case 'Wifi': return Wifi;
      case 'UserCheck': return UserCheck;
      case 'MapPin': return MapPin;
      case 'Calendar': return Calendar;
      case 'Share2': return Share2;
      case 'Smartphone': return Smartphone;
      case 'CreditCard': return CreditCard;
      case 'FileDown': return FileDown;
      default: return Globe;
    }
  };

  const filteredOptions = QR_TYPE_OPTIONS.filter((opt) => {
    const matchesSearch =
      opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opt.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = activeCategory === 'all' || opt.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-3">
      {/* Search & Category Filter Header */}
      <div className="flex flex-col sm:flex-row gap-2 items-center justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search QR types..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-700/60 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-lg border border-slate-800 w-full sm:w-auto overflow-x-auto text-[11px]">
          {(['all', 'essential', 'contact', 'business', 'media'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 rounded-md font-medium capitalize transition-colors ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Type Options */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
        {filteredOptions.map((opt) => {
          const IconComp = getIconComponent(opt.icon);
          const isSelected = selectedType === opt.id;

          return (
            <button
              key={opt.id}
              onClick={() => onSelectType(opt.id)}
              className={`relative flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                isSelected
                  ? 'bg-gradient-to-b from-indigo-600/30 via-indigo-600/10 to-transparent border-indigo-500/80 text-white shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/50'
                  : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              {opt.badge && (
                <span className="absolute top-1 right-1 px-1.5 py-0.2 text-[9px] font-bold uppercase rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {opt.badge}
                </span>
              )}

              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1.5 transition-transform ${
                  isSelected
                    ? 'bg-gradient-to-tr from-indigo-500 to-purple-500 text-white scale-110'
                    : 'bg-slate-800 text-indigo-400 group-hover:bg-slate-700'
                }`}
              >
                <IconComp className="w-4 h-4" />
              </div>

              <span className="font-semibold text-xs leading-tight line-clamp-1">{opt.label}</span>
              <span className="text-[10px] text-slate-400 mt-0.5 line-clamp-1 hidden sm:block">
                {opt.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
