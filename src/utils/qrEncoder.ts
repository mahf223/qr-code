import { QRContentPayload, ScanValidationResult, QRDesignConfig } from '../types';

/**
 * Encodes structured QR payloads into raw standard QR string data
 */
export function encodePayloadToString(payload: QRContentPayload): string {
  switch (payload.type) {
    case 'url':
      return payload.data.url.trim().startsWith('http')
        ? payload.data.url.trim()
        : `https://${payload.data.url.trim() || 'example.com'}`;

    case 'text':
      return payload.data.text || 'Hello from QR Studio Pro!';

    case 'email': {
      const { email, subject, body } = payload.data;
      const params = new URLSearchParams();
      if (subject) params.append('subject', subject);
      if (body) params.append('body', body);
      const query = params.toString();
      return `mailto:${email}${query ? `?${query}` : ''}`;
    }

    case 'phone':
      return `tel:${payload.data.phone.replace(/\s+/g, '')}`;

    case 'sms': {
      const { phone, message } = payload.data;
      const cleanPhone = phone.replace(/\s+/g, '');
      return `sms:${cleanPhone}${message ? `?body=${encodeURIComponent(message)}` : ''}`;
    }

    case 'whatsapp': {
      const { countryCode, phone, message } = payload.data;
      const cleanNum = `${countryCode}${phone}`.replace(/[^0-9]/g, '');
      const textParam = message ? `?text=${encodeURIComponent(message)}` : '';
      return `https://wa.me/${cleanNum}${textParam}`;
    }

    case 'wifi': {
      const { ssid, password, encryption, hidden } = payload.data;
      const escapeStr = (str: string) => str.replace(/([\\;,":])/g, '\\$1');
      return `WIFI:S:${escapeStr(ssid)};T:${encryption};P:${escapeStr(password)};H:${hidden ? 'true' : 'false'};;`;
    }

    case 'vcard': {
      const v = payload.data;
      return [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:${v.lastName || ''};${v.firstName || ''};;;`,
        `FN:${v.firstName || ''} ${v.lastName || ''}`.trim(),
        v.organization ? `ORG:${v.organization}` : '',
        v.title ? `TITLE:${v.title}` : '',
        v.phone ? `TEL;TYPE=WORK,VOICE:${v.phone}` : '',
        v.mobile ? `TEL;TYPE=CELL,VOICE:${v.mobile}` : '',
        v.email ? `EMAIL;TYPE=INTERNET:${v.email}` : '',
        v.website ? `URL:${v.website}` : '',
        v.street || v.city || v.country ? `ADR;TYPE=WORK:;;${v.street || ''};${v.city || ''};;;${v.country || ''}` : '',
        'END:VCARD'
      ].filter(Boolean).join('\n');
    }

    case 'location': {
      const { address, latitude, longitude } = payload.data;
      if (latitude !== undefined && longitude !== undefined) {
        return `https://maps.google.com/?q=${latitude},${longitude}`;
      }
      return `https://maps.google.com/?q=${encodeURIComponent(address || 'Times Square, New York')}`;
    }

    case 'event': {
      const { title, startDateTime, endDateTime, location, description } = payload.data;
      const formatDT = (dtStr: string) => {
        if (!dtStr) return '20260805T120000Z';
        return new Date(dtStr).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      };
      return [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'BEGIN:VEVENT',
        `SUMMARY:${title || 'Special Event'}`,
        `DTSTART:${formatDT(startDateTime)}`,
        `DTEND:${formatDT(endDateTime)}`,
        location ? `LOCATION:${location}` : '',
        description ? `DESCRIPTION:${description}` : '',
        'END:VEVENT',
        'END:VCALENDAR'
      ].filter(Boolean).join('\n');
    }

    case 'social': {
      const { platform, usernameOrUrl } = payload.data;
      const handle = usernameOrUrl.replace(/^@/, '').trim();
      if (handle.startsWith('http')) return handle;
      const baseMap: Record<string, string> = {
        instagram: 'https://instagram.com/',
        linkedin: 'https://linkedin.com/in/',
        youtube: 'https://youtube.com/@',
        twitter: 'https://x.com/',
        facebook: 'https://facebook.com/',
        tiktok: 'https://tiktok.com/@',
        github: 'https://github.com/'
      };
      return `${baseMap[platform] || 'https://instagram.com/'}${handle}`;
    }

    case 'app': {
      const { fallbackUrl, appStoreUrl, playStoreUrl } = payload.data;
      return fallbackUrl || appStoreUrl || playStoreUrl || 'https://apps.apple.com';
    }

    case 'payment': {
      const { method, payeeId, payeeName, amount, note } = payload.data;
      if (method === 'upi') {
        const params = new URLSearchParams({
          pa: payeeId || 'merchant@upi',
          pn: payeeName || 'Merchant Name',
          cu: 'INR'
        });
        if (amount) params.append('am', amount);
        if (note) params.append('tn', note);
        return `upi://pay?${params.toString()}`;
      } else if (method === 'paypal') {
        return `https://paypal.me/${payeeId || 'username'}${amount ? `/${amount}` : ''}`;
      } else if (method === 'crypto_btc') {
        return `bitcoin:${payeeId || '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'}${amount ? `?amount=${amount}` : ''}`;
      } else if (method === 'crypto_eth') {
        return `ethereum:${payeeId || '0x0000000000000000000000000000000000000000'}`;
      } else if (method === 'crypto_sol') {
        return `solana:${payeeId || '11111111111111111111111111111111'}`;
      } else {
        return `iban:${payeeId || 'DE89370400440532013000'}?name=${encodeURIComponent(payeeName || 'Account Holder')}`;
      }
    }

    case 'pdf': {
      return payload.data.fileUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
    }

    default:
      return 'https://qrstudiopro.com';
  }
}

/**
 * Calculates WCAG contrast ratio between hex colors (fg and bg)
 */
export function calculateContrastRatio(hex1: string, hex2: string): number {
  if (hex1 === 'transparent' || hex2 === 'transparent') return 21; // Assume high contrast on default canvas

  const getLuminance = (hex: string) => {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map((char) => char + char).join('');
    const r = parseInt(c.substring(0, 2), 16) / 255;
    const g = parseInt(c.substring(2, 4), 16) / 255;
    const b = parseInt(c.substring(4, 6), 16) / 255;

    const transform = (val: number) => (val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4));
    return 0.2126 * transform(r) + 0.7152 * transform(g) + 0.0722 * transform(b);
  };

  try {
    const l1 = getLuminance(hex1);
    const l2 = getLuminance(hex2);
    const bright = Math.max(l1, l2);
    const dark = Math.min(l1, l2);
    return parseFloat(((bright + 0.05) / (dark + 0.05)).toFixed(2));
  } catch {
    return 4.5;
  }
}

/**
 * Validates QR code scanability and returns a comprehensive health score
 */
export function validateQRDesign(config: QRDesignConfig, rawContentLength: number): ScanValidationResult {
  const contrast = config.isBgTransparent
    ? 21
    : calculateContrastRatio(config.fgColor, config.bgColor);

  const logoCoverage = config.logoUrl || config.logoPreset ? Math.round(config.logoSizeRatio * 100) : 0;
  const warnings: string[] = [];
  const recommendations: string[] = [];

  let score = 100;

  // Contrast checks
  if (contrast < 3) {
    score -= 40;
    warnings.push('Critical low contrast between QR pattern and background');
    recommendations.push('Choose a significantly darker foreground color or lighter background color.');
  } else if (contrast < 4.5) {
    score -= 20;
    warnings.push('Moderate contrast ratio may cause slow camera autofocus');
    recommendations.push('Increase contrast ratio above 4.5:1 for optimal scan speed.');
  }

  // Logo coverage vs Error Correction checks
  if (logoCoverage > 25) {
    if (config.errorCorrectionLevel === 'L' || config.errorCorrectionLevel === 'M') {
      score -= 30;
      warnings.push(`Logo size (${logoCoverage}%) is large for low Error Correction (${config.errorCorrectionLevel})`);
      recommendations.push('Upgrade Error Correction Level to "H" (30% recovery) when embedding logos.');
    }
  }

  // Content length check
  if (rawContentLength > 500 && config.errorCorrectionLevel === 'H') {
    score -= 10;
    warnings.push('High data volume + Error Correction level H creates a very dense QR matrix');
    recommendations.push('Consider using a Dynamic QR code URL shortener to keep QR pattern simple & readable.');
  }

  let status: 'excellent' | 'warning' | 'poor' = 'excellent';
  if (score < 60) status = 'poor';
  else if (score < 85) status = 'warning';

  return {
    score: Math.max(10, Math.min(100, score)),
    status,
    contrastRatio: contrast,
    logoCoveragePercent: logoCoverage,
    warnings,
    recommendations
  };
}
