import QRCodeStyling from 'qr-code-styling';
import jsPDF from 'jspdf';
import confetti from 'canvas-confetti';
import { QRDesignConfig } from '../types';

/**
 * Creates a configured instance of QRCodeStyling
 */
export function createQRInstance(
  dataString: string,
  config: QRDesignConfig,
  size: number = 1000
): QRCodeStyling {
  // Map internal eye frame shape to qr-code-styling type
  const mapEyeFrameType = (shape: string) => {
    switch (shape) {
      case 'circle':
      case 'rounded':
      case 'drop':
        return 'extra-rounded';
      case 'leaf':
        return 'classy';
      default:
        return 'square';
    }
  };

  const mapEyeDotType = (shape: string) => {
    switch (shape) {
      case 'circle':
      case 'rounded':
      case 'diamond':
        return 'dot';
      default:
        return 'square';
    }
  };

  const dotsOptions: any = {
    type: config.patternStyle || 'rounded',
    color: config.fgColor || '#000000'
  };

  if (config.colorType === 'gradient') {
    dotsOptions.gradient = {
      type: config.gradientType || 'linear',
      rotation: (config.gradientRotation || 0) * (Math.PI / 180),
      colorStops: [
        { offset: 0, color: config.fgColor || '#000000' },
        { offset: 1, color: config.gradientColor2 || '#3b82f6' }
      ]
    };
  }

  const cornersSquareOptions: any = {
    type: mapEyeFrameType(config.eyeFrameShape)
  };
  if (config.useCustomEyeColor && config.eyeFrameColor) {
    cornersSquareOptions.color = config.eyeFrameColor;
  } else {
    cornersSquareOptions.color = config.fgColor || '#000000';
  }

  const cornersDotOptions: any = {
    type: mapEyeDotType(config.eyeDotShape)
  };
  if (config.useCustomEyeColor && config.eyeDotColor) {
    cornersDotOptions.color = config.eyeDotColor;
  } else {
    cornersDotOptions.color = config.fgColor || '#000000';
  }

  return new QRCodeStyling({
    width: size,
    height: size,
    type: 'canvas',
    data: dataString || 'https://qrstudiopro.com',
    margin: 10,
    qrOptions: {
      errorCorrectionLevel: config.errorCorrectionLevel || 'H'
    },
    image: config.logoUrl || undefined,
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: config.logoSizeRatio || 0.22,
      margin: config.logoMargin || 4,
      crossOrigin: 'anonymous'
    },
    dotsOptions,
    backgroundOptions: {
      color: config.isBgTransparent ? 'rgba(0,0,0,0)' : config.bgColor || '#ffffff'
    },
    cornersSquareOptions,
    cornersDotOptions
  });
}

/**
 * Downloads high resolution image (PNG, WEBP, SVG)
 */
export async function downloadQRImage(
  dataString: string,
  config: QRDesignConfig,
  format: 'png' | 'webp' | 'svg',
  resolution: number = 2048,
  filename: string = 'qr-code-hd'
): Promise<void> {
  if (format === 'svg') {
    const qr = createQRInstance(dataString, config, resolution);
    qr.download({
      name: filename,
      extension: 'svg'
    });
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    return;
  }

  // Handle PNG / WEBP with canvas & optional Frame overlay rendering
  const qr = createQRInstance(dataString, config, resolution);
  const container = document.createElement('div');
  container.style.display = 'none';
  document.body.appendChild(container);

  qr.append(container);

  // Wait briefly for canvas draw
  await new Promise((resolve) => setTimeout(resolve, 300));

  const sourceCanvas = container.querySelector('canvas');
  if (!sourceCanvas) {
    document.body.removeChild(container);
    return;
  }

  // Create composite canvas if frame is enabled
  const hasFrame = config.frameStyle && config.frameStyle !== 'none';
  const paddingY = hasFrame ? Math.round(resolution * 0.18) : 0;
  const paddingX = hasFrame ? Math.round(resolution * 0.08) : 0;

  const finalCanvas = document.createElement('canvas');
  finalCanvas.width = resolution + paddingX * 2;
  finalCanvas.height = resolution + paddingY * 2;
  const ctx = finalCanvas.getContext('2d');

  if (ctx) {
    // Fill overall background
    ctx.fillStyle = config.isBgTransparent ? 'rgba(0,0,0,0)' : config.bgColor || '#ffffff';
    ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

    // Draw frame style if active
    if (hasFrame) {
      const frameColor = config.frameColor || '#1e293b';
      const textColor = config.frameTextColor || '#ffffff';
      const frameText = config.frameText || 'SCAN ME';

      if (config.frameStyle === 'bottom-badge' || config.frameStyle === 'pill-badge') {
        // Draw frame container border around QR
        ctx.strokeStyle = frameColor;
        ctx.lineWidth = Math.round(resolution * 0.015);
        ctx.beginPath();
        const r = Math.round(resolution * 0.04);
        ctx.roundRect(
          paddingX / 2,
          paddingY / 2,
          resolution + paddingX,
          resolution + paddingY * 1.2,
          r
        );
        ctx.stroke();

        // Draw Bottom Badge
        ctx.fillStyle = frameColor;
        const badgeW = Math.round(resolution * 0.6);
        const badgeH = Math.round(paddingY * 0.7);
        const badgeX = (finalCanvas.width - badgeW) / 2;
        const badgeY = finalCanvas.height - paddingY * 1.1;

        ctx.beginPath();
        ctx.roundRect(badgeX, badgeY, badgeW, badgeH, badgeH / 2);
        ctx.fill();

        // Draw Text
        ctx.fillStyle = textColor;
        ctx.font = `bold ${Math.round(badgeH * 0.45)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(frameText, badgeX + badgeW / 2, badgeY + badgeH / 2);
      } else if (config.frameStyle === 'top-badge') {
        // Top badge bar
        ctx.fillStyle = frameColor;
        const badgeW = Math.round(resolution * 0.7);
        const badgeH = Math.round(paddingY * 0.7);
        const badgeX = (finalCanvas.width - badgeW) / 2;
        const badgeY = paddingY * 0.2;

        ctx.beginPath();
        ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 8);
        ctx.fill();

        ctx.fillStyle = textColor;
        ctx.font = `bold ${Math.round(badgeH * 0.45)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(frameText, badgeX + badgeW / 2, badgeY + badgeH / 2);
      }
    }

    // Draw main QR image onto final canvas
    ctx.drawImage(sourceCanvas, paddingX, hasFrame ? paddingY * 0.7 : 0, resolution, resolution);
  }

  // Export to blob & trigger download
  const mimeType = format === 'webp' ? 'image/webp' : 'image/png';
  finalCanvas.toBlob((blob) => {
    if (blob) {
      const link = document.createElement('a');
      link.download = `${filename}.${format}`;
      link.href = URL.createObjectURL(blob);
      link.click();
      URL.revokeObjectURL(link.href);
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.8 } });
    }
    document.body.removeChild(container);
  }, mimeType);
}

/**
 * Generates a print-ready PDF document containing the QR code and title instructions
 */
export async function downloadPDF(
  dataString: string,
  config: QRDesignConfig,
  title: string = 'Scan QR Code',
  subtitle: string = 'Point your smartphone camera at the code below'
): Promise<void> {
  const qr = createQRInstance(dataString, config, 1200);
  const container = document.createElement('div');
  container.style.display = 'none';
  document.body.appendChild(container);
  qr.append(container);

  await new Promise((resolve) => setTimeout(resolve, 300));

  const canvas = container.querySelector('canvas');
  if (!canvas) {
    document.body.removeChild(container);
    return;
  }

  const imgData = canvas.toDataURL('image/png');

  // Create A4 PDF (210 x 297 mm)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Header banner
  doc.setFillColor(30, 41, 59); // Slate-900
  doc.rect(0, 0, 210, 32, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('QR STUDIO PRO', 105, 18, { align: 'center' });

  // Main Card Area
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(30, 45, 150, 200, 6, 6, 'FD');

  // Title & Subtitle
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(22);
  doc.text(title, 105, 68, { align: 'center' });

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(subtitle, 105, 78, { align: 'center' });

  // QR Code Image
  doc.addImage(imgData, 'PNG', 50, 88, 110, 110);

  // Footer CTA
  doc.setFillColor(config.frameColor || '#2563eb');
  doc.roundedRect(55, 208, 100, 14, 7, 7, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(config.frameText || 'SCAN ME WITH YOUR CAMERA', 105, 217, { align: 'center' });

  // Document Footer
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Generated with QR Studio Pro • High Definition Print Quality (300 DPI)', 105, 280, {
    align: 'center'
  });

  doc.save('QR-Code-Printable.pdf');
  document.body.removeChild(container);
  confetti({ particleCount: 70, spread: 80, origin: { y: 0.8 } });
}
