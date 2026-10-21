export interface SEOPageData {
  slug: string;
  title: string;
  metaDescription: string;
  h1: string;
  subtitle: string;
  features: { title: string; desc: string; icon: string }[];
  faqs: { question: string; answer: string }[];
  schemaMarkup: object;
}

export const SEO_PAGES: Record<string, SEOPageData> = {
  '/qr-code-generator': {
    slug: '/qr-code-generator',
    title: 'Free HD QR Code Generator | Custom Vector & Branding',
    metaDescription: 'Create high-resolution vector QR codes for websites, WiFi, vCards, menus, and payments with custom colors, frames, logos, and real-time scan analytics.',
    h1: 'Professional High-Definition QR Code Generator',
    subtitle: 'Design, customize, and track dynamic QR codes with 4K resolution exports and AI-powered branding guidance.',
    features: [
      {
        title: '4K Vector & HD Downloads',
        desc: 'Download print-ready 300 DPI PNG, crisp SVG vector graphics, and formatted PDF print cards.',
        icon: 'Download'
      },
      {
        title: 'Dynamic QR Code Tracking',
        desc: 'Edit destination URLs anytime without re-printing and monitor real-time scan metrics, locations, and device stats.',
        icon: 'BarChart3'
      },
      {
        title: 'AI QR Design Assistant',
        desc: 'Let Gemini AI suggest color schemes, eye styles, frame badges, and logo placements tailored to your business.',
        icon: 'Sparkles'
      }
    ],
    faqs: [
      {
        question: 'Are the created QR codes free for commercial use?',
        answer: 'Yes! All static QR codes generated on QR Studio Pro are 100% free with unlimited scans and full commercial usage rights.'
      },
      {
        question: 'Will my QR code expire?',
        answer: 'Static QR codes never expire. Dynamic QR codes remain active and can be edited anytime from your analytics dashboard.'
      },
      {
        question: 'Which download resolution should I select for printing?',
        answer: 'For digital screens, 512px or 1024px PNG is ideal. For physical posters, banners, and packaging, select SVG vector or 4096px (300 DPI).'
      }
    ],
    schemaMarkup: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'QR Studio Pro',
      operatingSystem: 'All',
      applicationCategory: 'DesignApplication',
      offers: {
        '@type': 'Offer',
        price: '0.00',
        priceCurrency: 'USD'
      }
    }
  },
  '/logo-qr-code-generator': {
    slug: '/logo-qr-code-generator',
    title: 'Custom QR Code Generator with Logo | Free Brand QR Maker',
    metaDescription: 'Embed company logos, icons, and brand graphics into QR codes without losing scanability. Built-in scan diagnostic engine verifies error correction level.',
    h1: 'Custom Logo QR Code Generator',
    subtitle: 'Build instant brand recognition by embedding your company logo or custom icon at the center of your QR code.',
    features: [
      {
        title: 'Automatic Error Correction Tuning',
        desc: 'Automatically boosts error correction to Level H (30% data recovery) to ensure flawless mobile camera scanning with logo overlays.',
        icon: 'ShieldCheck'
      },
      {
        title: 'Background Badge Isolation',
        desc: 'Add clean circle, square, or rounded white backdrop badges behind your logo to prevent pattern clash.',
        icon: 'Image'
      },
      {
        title: 'Built-in Icon Library',
        desc: 'Choose from hundreds of standard social media, Wi-Fi, restaurant, contact, and retail icons if you do not have a custom image.',
        icon: 'Layers'
      }
    ],
    faqs: [
      {
        question: 'How do I ensure my logo QR code stays scannable?',
        answer: 'Keep the logo size ratio under 30% of total QR size, use Error Correction Level H, and ensure high contrast between foreground dots and background canvas.'
      },
      {
        question: 'Which file formats work best for logo upload?',
        answer: 'PNG with transparent backgrounds or SVG vectors produce the highest quality results.'
      }
    ],
    schemaMarkup: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Custom QR Code Generator with Logo'
    }
  },
  '/wifi-qr-code-generator': {
    slug: '/wifi-qr-code-generator',
    title: 'Wi-Fi QR Code Generator | Instant Guest Pass & Password Scanner',
    metaDescription: 'Generate Wi-Fi QR codes so guests and customers can instantly connect to your WPA/WPA2 network without typing passwords.',
    h1: 'Wi-Fi QR Code Generator for Instant Connection',
    subtitle: 'Allow guests, cafe visitors, and event attendees to connect to your Wi-Fi network instantly with a simple phone camera scan.',
    features: [
      {
        title: 'Supports All Security Standards',
        desc: 'Fully compatible with WPA/WPA2, WEP, and open Wi-Fi networks with optional hidden SSID toggles.',
        icon: 'Wifi'
      },
      {
        title: 'Printable Table Cards',
        desc: 'Export pre-formatted PDF Wi-Fi tent cards with custom instructions for hotel rooms, cafes, and conference spaces.',
        icon: 'Printer'
      }
    ],
    faqs: [
      {
        question: 'Does scanning a Wi-Fi QR code work on both iOS and Android?',
        answer: 'Yes! Both modern iPhones (iOS 11+) and Android devices natively support scanning Wi-Fi QR codes directly from the built-in camera app.'
      }
    ],
    schemaMarkup: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage'
    }
  },
  '/business-card-qr-code': {
    slug: '/business-card-qr-code',
    title: 'vCard QR Code Generator | Digital NFC & Contact Card Maker',
    metaDescription: 'Create digital vCard QR codes that automatically save contact details, phone numbers, email addresses, and website links into smartphone address books.',
    h1: 'Digital Business Card vCard QR Code Generator',
    subtitle: 'Exchange contact information effortlessly without paper business cards. Scanners save your complete contact profile in 1 tap.',
    features: [
      {
        title: 'Standard vCard 3.0 Compliance',
        desc: 'Generates standardized vCard payloads compatible with iOS Contacts, Android Contacts, Google Contacts, and Outlook.',
        icon: 'Contact'
      },
      {
        title: 'Dynamic Contact Updates',
        desc: 'Update phone numbers, job titles, or addresses anytime without changing the QR printed on your physical card.',
        icon: 'RefreshCw'
      }
    ],
    faqs: [
      {
        question: 'What details can I store in a vCard QR code?',
        answer: 'You can store First/Last Name, Title, Company Name, Work Phone, Cell Phone, Email, Website, Office Address, and Notes.'
      }
    ],
    schemaMarkup: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'vCard QR Code Generator'
    }
  }
};
