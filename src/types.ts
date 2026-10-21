export type QRType =
  | 'url'
  | 'text'
  | 'email'
  | 'phone'
  | 'sms'
  | 'whatsapp'
  | 'wifi'
  | 'vcard'
  | 'location'
  | 'event'
  | 'social'
  | 'app'
  | 'payment'
  | 'pdf';

export type PatternStyle = 'square' | 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'extra-rounded';

export type EyeFrameShape = 'square' | 'circle' | 'rounded' | 'leaf' | 'drop';
export type EyeDotShape = 'square' | 'circle' | 'rounded' | 'diamond';

export type ColorType = 'single' | 'gradient';
export type GradientType = 'linear' | 'radial';

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export type FrameStyle = 'none' | 'bottom-badge' | 'top-badge' | 'speech-bubble' | 'phone-mockup' | 'card-border' | 'pill-badge';

export interface QRTypeOption {
  id: QRType;
  label: string;
  description: string;
  icon: string;
  badge?: string;
  category: 'essential' | 'contact' | 'media' | 'business';
}

export interface URLData {
  url: string;
}

export interface TextData {
  text: string;
}

export interface EmailData {
  email: string;
  subject: string;
  body: string;
}

export interface PhoneData {
  phone: string;
}

export interface SMSData {
  phone: string;
  message: string;
}

export interface WhatsAppData {
  countryCode: string;
  phone: string;
  message: string;
}

export interface WiFiData {
  ssid: string;
  password: string;
  encryption: 'WPA/WPA2' | 'WEP' | 'nopass';
  hidden: boolean;
}

export interface VCardData {
  firstName: string;
  lastName: string;
  organization: string;
  title: string;
  email: string;
  phone: string;
  mobile: string;
  website: string;
  street: string;
  city: string;
  country: string;
}

export interface LocationData {
  address: string;
  latitude?: number;
  longitude?: number;
}

export interface EventData {
  title: string;
  startDateTime: string;
  endDateTime: string;
  location: string;
  description: string;
}

export interface SocialData {
  platform: 'instagram' | 'linkedin' | 'youtube' | 'twitter' | 'facebook' | 'tiktok' | 'github';
  usernameOrUrl: string;
}

export interface AppData {
  appStoreUrl: string;
  playStoreUrl: string;
  fallbackUrl: string;
}

export interface PaymentData {
  method: 'upi' | 'paypal' | 'crypto_btc' | 'crypto_eth' | 'crypto_sol' | 'bank_iban';
  payeeId: string;
  payeeName: string;
  amount?: string;
  note?: string;
}

export interface PDFData {
  fileUrl: string;
  title: string;
  fileSize?: string;
}

export type QRContentPayload =
  | { type: 'url'; data: URLData }
  | { type: 'text'; data: TextData }
  | { type: 'email'; data: EmailData }
  | { type: 'phone'; data: PhoneData }
  | { type: 'sms'; data: SMSData }
  | { type: 'whatsapp'; data: WhatsAppData }
  | { type: 'wifi'; data: WiFiData }
  | { type: 'vcard'; data: VCardData }
  | { type: 'location'; data: LocationData }
  | { type: 'event'; data: EventData }
  | { type: 'social'; data: SocialData }
  | { type: 'app'; data: AppData }
  | { type: 'payment'; data: PaymentData }
  | { type: 'pdf'; data: PDFData };

export interface QRDesignConfig {
  // Dots Pattern
  patternStyle: PatternStyle;
  fgColor: string;
  bgColor: string;
  isBgTransparent: boolean;
  colorType: ColorType;
  gradientType: GradientType;
  gradientColor2: string;
  gradientRotation: number;

  // Eyes (Corners)
  eyeFrameShape: EyeFrameShape;
  eyeDotShape: EyeDotShape;
  eyeFrameColor: string;
  eyeDotColor: string;
  useCustomEyeColor: boolean;

  // Logo
  logoUrl?: string;
  logoPreset?: string;
  logoSizeRatio: number; // 0.15 - 0.35
  logoMargin: number;
  logoBgColor: string;
  logoBgShape: 'none' | 'circle' | 'square' | 'rounded';

  // Frame
  frameStyle: FrameStyle;
  frameText: string;
  frameColor: string;
  frameTextColor: string;
  frameFont: string;

  // Error Correction
  errorCorrectionLevel: ErrorCorrectionLevel;
}

export interface DynamicQRRecord {
  id: string;
  shortCode: string;
  title: string;
  destinationUrl: string;
  qrConfig: QRDesignConfig;
  qrPayload: QRContentPayload;
  createdAt: string;
  updatedAt: string;
  scanCount: number;
}

export interface ScanLog {
  id: string;
  shortCode: string;
  timestamp: string;
  device: 'Mobile' | 'Desktop' | 'Tablet';
  os: 'iOS' | 'Android' | 'macOS' | 'Windows';
  country: string;
  city: string;
  referrer: string;
}

export interface ScanValidationResult {
  score: number; // 0 - 100
  status: 'excellent' | 'warning' | 'poor';
  contrastRatio: number;
  logoCoveragePercent: number;
  warnings: string[];
  recommendations: string[];
}

export interface QRTemplate {
  id: string;
  title: string;
  category: 'Business' | 'Restaurant' | 'Social' | 'Tech' | 'Marketing' | 'Personal';
  description: string;
  badge?: string;
  previewColor: string;
  config: Partial<QRDesignConfig>;
  samplePayload: QRContentPayload;
}

export interface AISuggestionResponse {
  type: QRType;
  sampleData: Record<string, string>;
  design: QRDesignConfig;
  suggestedCTAs: string[];
  marketingTip: string;
}
