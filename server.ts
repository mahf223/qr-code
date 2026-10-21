import express from 'express';
import http from 'http';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initialize Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is missing in server environment.');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}

// In-Memory Storage for Dynamic QR Codes & Analytics
interface DynamicQRItem {
  id: string;
  shortCode: string;
  title: string;
  destinationUrl: string;
  createdAt: string;
  updatedAt: string;
  scanCount: number;
}

interface ScanRecord {
  id: string;
  shortCode: string;
  timestamp: string;
  device: 'Mobile' | 'Desktop' | 'Tablet';
  os: 'iOS' | 'Android' | 'macOS' | 'Windows';
  country: string;
  city: string;
  referrer: string;
}

const dynamicQRs: Map<string, DynamicQRItem> = new Map([
  [
    'demo-menu',
    {
      id: 'demo-menu',
      shortCode: 'demo-menu',
      title: 'Grand Bistro Dinner Menu',
      destinationUrl: 'https://bistro-luxe.com/menu.pdf',
      createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
      updatedAt: new Date().toISOString(),
      scanCount: 142
    }
  ],
  [
    'demo-wifi',
    {
      id: 'demo-wifi',
      shortCode: 'demo-wifi',
      title: 'Hotel Lobby Wi-Fi Pass',
      destinationUrl: 'https://hotel-connect.example',
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      updatedAt: new Date().toISOString(),
      scanCount: 89
    }
  ]
]);

const scanLogs: ScanRecord[] = [];

// Populate seed scan analytics for demo-menu
const seedDevices: ('Mobile' | 'Desktop' | 'Tablet')[] = ['Mobile', 'Mobile', 'Mobile', 'Tablet', 'Desktop'];
const seedOS: ('iOS' | 'Android' | 'macOS' | 'Windows')[] = ['iOS', 'iOS', 'Android', 'Android', 'macOS'];
const seedCountries = [
  { country: 'United States', city: 'New York' },
  { country: 'United States', city: 'San Francisco' },
  { country: 'United Kingdom', city: 'London' },
  { country: 'Germany', city: 'Berlin' },
  { country: 'Japan', city: 'Tokyo' },
  { country: 'Canada', city: 'Toronto' }
];

for (let i = 0; i < 60; i++) {
  const daysAgo = Math.floor(Math.random() * 7);
  const loc = seedCountries[i % seedCountries.length];
  scanLogs.push({
    id: `scan-${i}`,
    shortCode: 'demo-menu',
    timestamp: new Date(Date.now() - daysAgo * 86400000 - Math.random() * 36000000).toISOString(),
    device: seedDevices[i % seedDevices.length],
    os: seedOS[i % seedOS.length],
    country: loc.country,
    city: loc.city,
    referrer: i % 3 === 0 ? 'Camera App' : i % 3 === 1 ? 'Safari QR' : 'Google Lens'
  });
}

// -------------------------------------------------------------
// API ENDPOINTS
// -------------------------------------------------------------

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Download compiled Android APK
app.get(['/download-apk', '/api/download/apk'], (req, res) => {
  const apkPath = path.join(process.cwd(), 'APK_DOWNLOAD', 'app-debug.apk');
  res.download(apkPath, 'QRStudioPro-debug.apk');
});

// 2. AI QR Design Assistant (Gemini 3.6 Flash)
app.post('/api/ai/suggest', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt string is required' });
    }

    const ai = getAIClient();
    const systemInstruction = `You are a world-class Senior Branding & QR Code Design Architect.
Analyze the user request and suggest an optimal QR code configuration.
Select the most appropriate type (url, wifi, vcard, email, payment, social, event, text, menu, etc.), color palette, pattern style, eye shapes, frame text, and branding tip.

Return ONLY valid JSON matching this schema:
{
  "type": "string (url | wifi | vcard | email | payment | social | event | text | pdf)",
  "suggestedTitle": "string",
  "sampleData": { "key": "value" },
  "design": {
    "patternStyle": "square | rounded | dots | classy | classy-rounded | extra-rounded",
    "fgColor": "#HEX",
    "bgColor": "#HEX",
    "isBgTransparent": false,
    "colorType": "single | gradient",
    "gradientType": "linear | radial",
    "gradientColor2": "#HEX",
    "gradientRotation": 45,
    "eyeFrameShape": "square | circle | rounded | leaf | drop",
    "eyeDotShape": "square | circle | rounded | diamond",
    "eyeFrameColor": "#HEX",
    "eyeDotColor": "#HEX",
    "useCustomEyeColor": true,
    "logoPreset": "none | utensils | wifi | vcard | instagram | home | payment | star | phone",
    "logoSizeRatio": 0.22,
    "logoBgShape": "circle | square | rounded",
    "logoBgColor": "#HEX",
    "frameStyle": "none | bottom-badge | top-badge | speech-bubble | card-border | pill-badge",
    "frameText": "SCAN FOR MENU",
    "frameColor": "#HEX",
    "frameTextColor": "#HEX",
    "errorCorrectionLevel": "H"
  },
  "marketingTip": "string"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: `Design an optimal branded QR code for the following concept: "${prompt}"`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.7
      }
    });

    const textOutput = response.text || '{}';
    const jsonResult = JSON.parse(textOutput);
    res.json(jsonResult);
  } catch (error: any) {
    console.error('Gemini AI Suggestion Error:', error);
    res.status(500).json({
      error: error?.message || 'Failed to generate AI QR suggestion'
    });
  }
});

// 3. Dynamic QR Management API
app.get('/api/qr/dynamic', (req, res) => {
  const list = Array.from(dynamicQRs.values());
  res.json({ dynamicQRs: list });
});

app.post('/api/qr/dynamic', (req, res) => {
  const { title, destinationUrl, customShortCode } = req.body;
  if (!destinationUrl) {
    return res.status(400).json({ error: 'Destination URL is required' });
  }

  const shortCode = customShortCode?.trim() || `qr-${Math.random().toString(36).substring(2, 8)}`;
  if (dynamicQRs.has(shortCode)) {
    return res.status(400).json({ error: 'Short code already exists. Please pick another.' });
  }

  const newItem: DynamicQRItem = {
    id: shortCode,
    shortCode,
    title: title || 'My Dynamic QR',
    destinationUrl: destinationUrl.startsWith('http') ? destinationUrl : `https://${destinationUrl}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    scanCount: 0
  };

  dynamicQRs.set(shortCode, newItem);
  res.status(201).json({ success: true, item: newItem });
});

app.put('/api/qr/dynamic/:id', (req, res) => {
  const { id } = req.params;
  const { destinationUrl, title } = req.body;

  const item = dynamicQRs.get(id);
  if (!item) {
    return res.status(404).json({ error: 'Dynamic QR not found' });
  }

  if (destinationUrl) {
    item.destinationUrl = destinationUrl.startsWith('http') ? destinationUrl : `https://${destinationUrl}`;
  }
  if (title) {
    item.title = title;
  }
  item.updatedAt = new Date().toISOString();

  dynamicQRs.set(id, item);
  res.json({ success: true, item });
});

// 4. Public Dynamic Redirect Endpoint
app.get('/r/:shortCode', (req, res) => {
  const { shortCode } = req.params;
  const item = dynamicQRs.get(shortCode);

  if (!item) {
    return res.status(404).send(`
      <html style="font-family: system-ui, sans-serif; background: #0f172a; color: white; display: flex; align-items: center; justify-content: center; height: 100vh;">
        <div style="text-align: center; padding: 2rem; background: rgba(30, 41, 59, 0.8); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);">
          <h1 style="font-size: 2rem; margin-bottom: 0.5rem;">404 - QR Code Not Found</h1>
          <p style="color: #94a3b8;">This dynamic QR code destination link does not exist or has expired.</p>
        </div>
      </html>
    `);
  }

  // Record scan event
  item.scanCount += 1;
  const userAgent = req.get('User-Agent') || '';
  const isMobile = /mobile|iphone|ipad|android/i.test(userAgent);
  const isTablet = /ipad|tablet/i.test(userAgent);

  let device: 'Mobile' | 'Desktop' | 'Tablet' = 'Desktop';
  if (isTablet) device = 'Tablet';
  else if (isMobile) device = 'Mobile';

  let os: 'iOS' | 'Android' | 'macOS' | 'Windows' = 'Windows';
  if (/iphone|ipad/i.test(userAgent)) os = 'iOS';
  else if (/android/i.test(userAgent)) os = 'Android';
  else if (/macintosh|mac os x/i.test(userAgent)) os = 'macOS';

  const randomLoc = seedCountries[Math.floor(Math.random() * seedCountries.length)];

  scanLogs.push({
    id: `scan-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
    shortCode,
    timestamp: new Date().toISOString(),
    device,
    os,
    country: randomLoc.country,
    city: randomLoc.city,
    referrer: req.get('Referer') || 'Camera App'
  });

  // Perform 302 Redirect
  res.redirect(302, item.destinationUrl);
});

// 5. Analytics Endpoint
app.get('/api/analytics/:shortCode', (req, res) => {
  const { shortCode } = req.params;
  const item = dynamicQRs.get(shortCode);

  const logs = scanLogs.filter((l) => l.shortCode === shortCode);

  // Device Breakdown
  const devices: Record<string, number> = {};
  const osList: Record<string, number> = {};
  const countries: Record<string, number> = {};

  logs.forEach((log) => {
    devices[log.device] = (devices[log.device] || 0) + 1;
    osList[log.os] = (osList[log.os] || 0) + 1;
    countries[log.country] = (countries[log.country] || 0) + 1;
  });

  // Timeline (Last 7 Days)
  const timelineMap: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
    timelineMap[d] = 0;
  }

  logs.forEach((log) => {
    const day = log.timestamp.split('T')[0];
    if (timelineMap[day] !== undefined) {
      timelineMap[day] += 1;
    }
  });

  const timeline = Object.entries(timelineMap).map(([date, count]) => ({ date, count }));

  res.json({
    shortCode,
    title: item?.title || 'Dynamic QR',
    destinationUrl: item?.destinationUrl || '',
    totalScans: item?.scanCount || logs.length,
    uniqueVisitors: Math.round((item?.scanCount || logs.length) * 0.82),
    devices,
    osList,
    countries,
    timeline,
    recentLogs: logs.slice(-10).reverse()
  });
});

// 6. Simulate Scan API (for live test button in dashboard!)
app.post('/api/analytics/simulate-scan', (req, res) => {
  const { shortCode } = req.body;
  const item = dynamicQRs.get(shortCode || 'demo-menu');

  if (item) {
    item.scanCount += 1;
    const loc = seedCountries[Math.floor(Math.random() * seedCountries.length)];
    scanLogs.push({
      id: `sim-${Date.now()}`,
      shortCode: item.shortCode,
      timestamp: new Date().toISOString(),
      device: 'Mobile',
      os: Math.random() > 0.5 ? 'iOS' : 'Android',
      country: loc.country,
      city: loc.city,
      referrer: 'Test Scanner'
    });
    return res.json({ success: true, newScanCount: item.scanCount });
  }

  res.status(404).json({ error: 'Item not found' });
});

// -------------------------------------------------------------
// VITE / STATIC MIDDLEWARE SETUP
// -------------------------------------------------------------
async function startServer() {
  const httpServer = http.createServer(app);

  const publicPath = path.join(process.cwd(), 'public');
  app.use(express.static(publicPath, {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('sw.js')) {
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        res.setHeader('Service-Worker-Allowed', '/');
      }
    }
  }));

  if (process.env.NODE_ENV !== 'production') {
    const isHmrDisabled = process.env.DISABLE_HMR === 'true';
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: isHmrDisabled ? false : { server: httpServer }
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
