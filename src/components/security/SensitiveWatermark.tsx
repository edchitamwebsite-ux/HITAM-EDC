'use client';

import * as React from 'react';

export interface SensitiveWatermarkProps {
  maskedIdentifier?: string; // e.g. "sr***@hitam.org" or "HITAM-REG-8921"
  identifier?: string;
  documentId?: string;
  subText?: string;
  density?: 'low' | 'normal' | 'high' | string;
}

export function SensitiveWatermark({
  maskedIdentifier,
  identifier,
  documentId,
  subText,
  density = 'normal',
}: SensitiveWatermarkProps) {
  const [timestamp, setTimestamp] = React.useState<string>('');

  React.useEffect(() => {
    // Generate clean client timestamp
    const now = new Date();
    setTimestamp(now.toISOString().replace('T', ' ').slice(0, 16));
  }, []);

  const primaryText = identifier || maskedIdentifier || 'CONFIDENTIAL • EDC HITAM';
  const secondaryText = subText || documentId || '';
  const watermarkText = `${primaryText} ${secondaryText ? `• ${secondaryText}` : ''} ${timestamp ? `• ${timestamp}` : ''}`;

  const patternWidth = density === 'high' ? 300 : density === 'low' ? 440 : 380;
  const patternHeight = density === 'high' ? 140 : density === 'low' ? 220 : 180;
  const opacity = density === 'low' ? '0.04' : '0.06';

  // SVG encoded text for clean diagonal repeat pattern
  const svgPattern = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${patternWidth}" height="${patternHeight}"><text x="20" y="90" fill="%230f172a" font-family="sans-serif" font-size="11" font-weight="600" opacity="${opacity}" transform="rotate(-24 190 90)">${encodeURIComponent(watermarkText)}</text></svg>`;

  return (
    <div
      aria-hidden="true"
      className="watermark-overlay absolute inset-0 pointer-events-none select-none z-10"
      style={{
        backgroundImage: `url("${svgPattern}")`,
        backgroundRepeat: 'repeat',
      }}
    />
  );
}
