import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Function to encode RGBA buffer to valid PNG
function encodePNG(width, height, rgbaBuffer) {
  function crc32(buf) {
    let table = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let k = 0; k < 8; k++) {
        c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      }
      table[i] = c;
    }
    let crc = 0 ^ (-1);
    for (let i = 0; i < buf.length; i++) {
      crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xFF];
    }
    return (crc ^ (-1)) >>> 0;
  }

  function makeChunk(type, data) {
    const len = data.length;
    const buf = Buffer.alloc(12 + len);
    buf.writeUInt32BE(len, 0);
    buf.write(type, 4, 4, 'ascii');
    data.copy(buf, 8);
    const crcVal = crc32(buf.subarray(4, 8 + len));
    buf.writeUInt32BE(crcVal, 8 + len);
    return buf;
  }

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk: 13 bytes
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0; // compression method
  ihdr[11] = 0; // filter method
  ihdr[12] = 0; // interlace method
  const ihdrChunk = makeChunk('IHDR', ihdr);

  // Scanlines with filter byte 0 (None)
  const rowStride = width * 4;
  const rawData = Buffer.alloc(height * (rowStride + 1));
  for (let y = 0; y < height; y++) {
    const rowOffset = y * (rowStride + 1);
    rawData[rowOffset] = 0; // Filter: None
    const srcRowOffset = y * rowStride;
    rgbaBuffer.copy(rawData, rowOffset + 1, srcRowOffset, srcRowOffset + rowStride);
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressedData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Generate QR Studio Icon RGBA buffer
function generateIconRGBA(size, isMaskable = false) {
  const buf = Buffer.alloc(size * size * 4);
  const scale = size / 512;
  const padding = isMaskable ? 0.15 : 0.05; // Maskable icon has 15% safe padding

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const nx = x / size; // 0 to 1
      const ny = y / size;

      // Dark background with gradient
      const distFromCenter = Math.sqrt((nx - 0.5) ** 2 + (ny - 0.5) ** 2);
      
      // Background gradient: slate-950 to indigo-950
      let r = Math.floor(15 + (1 - distFromCenter) * 15);
      let g = Math.floor(23 + (1 - distFromCenter) * 15);
      let b = Math.floor(42 + (1 - distFromCenter) * 60);

      // Rounded rectangle mask for non-maskable icons
      if (!isMaskable) {
        const cornerR = 0.22;
        const dx = Math.abs(nx - 0.5) - (0.5 - cornerR);
        const dy = Math.abs(ny - 0.5) - (0.5 - cornerR);
        if (dx > 0 && dy > 0 && Math.hypot(dx, dy) > cornerR) {
          // Transparent outside rounded corners
          buf[idx] = 0;
          buf[idx + 1] = 0;
          buf[idx + 2] = 0;
          buf[idx + 3] = 0;
          continue;
        }
      }

      // Draw stylized QR Finder Eyes and Matrix elements
      // Normalized coordinates within the content area [padding, 1 - padding]
      const cx = (nx - padding) / (1 - 2 * padding);
      const cy = (ny - padding) / (1 - 2 * padding);

      if (cx >= 0 && cx <= 1 && cy >= 0 && cy <= 1) {
        // Draw Finder Eyes: Top-Left, Top-Right, Bottom-Left
        const eyeCheck = (ex, ey) => {
          const edx = Math.abs(cx - ex);
          const edy = Math.abs(cy - ey);
          // Outer box: size 0.26
          if (edx <= 0.13 && edy <= 0.13) {
            if (edx >= 0.08 || edy >= 0.08) return 'outer';
            if (edx <= 0.045 && edy <= 0.045) return 'inner';
          }
          return null;
        };

        const tl = eyeCheck(0.2, 0.2);
        const tr = eyeCheck(0.8, 0.2);
        const bl = eyeCheck(0.2, 0.8);

        if (tl === 'outer' || tr === 'outer' || bl === 'outer') {
          // Electric Cyan to Indigo gradient
          r = Math.floor(56 + cx * 60);
          g = Math.floor(189 - cy * 50);
          b = 248;
        } else if (tl === 'inner') {
          r = 56; g = 189; b = 248; // Cyan
        } else if (tr === 'inner') {
          r = 99; g = 102; b = 241; // Indigo
        } else if (bl === 'inner') {
          r = 168; g = 85; b = 247; // Purple
        } else {
          // Center Sparkle Badge
          const cdist = Math.hypot(cx - 0.5, cy - 0.5);
          if (cdist < 0.11) {
            if (cdist < 0.08) {
              r = 251; g = 191; b = 36; // Amber Sparkle
            } else {
              r = 30; g = 41; b = 59; // Dark Ring
            }
          } else {
            // Matrix pattern dots
            const gridX = Math.floor(cx * 14);
            const gridY = Math.floor(cy * 14);
            const isPattern = ((gridX * 7 + gridY * 13 + (gridX ^ gridY)) % 5) === 0;
            if (isPattern && !(gridX < 5 && gridY < 5) && !(gridX > 8 && gridY < 5) && !(gridX < 5 && gridY > 8)) {
              r = 99; g = 102; b = 241;
            }
          }
        }
      }

      buf[idx] = Math.min(255, Math.max(0, r));
      buf[idx + 1] = Math.min(255, Math.max(0, g));
      buf[idx + 2] = Math.min(255, Math.max(0, b));
      buf[idx + 3] = 255;
    }
  }
  return buf;
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate 192x192
console.log('Generating 192x192...');
const png192 = encodePNG(192, 192, generateIconRGBA(192, false));
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), png192);

// Generate 512x512
console.log('Generating 512x512...');
const png512 = encodePNG(512, 512, generateIconRGBA(512, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), png512);

// Generate 512x512 maskable (with safe zone padding)
console.log('Generating 512x512 maskable...');
const png512Maskable = encodePNG(512, 512, generateIconRGBA(512, true));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), png512Maskable);

// Generate 180x180 apple touch icon
console.log('Generating apple-touch-icon 180x180...');
const pngApple = encodePNG(180, 180, generateIconRGBA(180, false));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), pngApple);

// Favicon copy (192 or 64)
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), png192);

console.log('All icons generated successfully!');
