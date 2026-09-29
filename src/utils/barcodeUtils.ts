import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';
import { Asset, Accessory, Consumable, EventItem } from '../types';

export interface LabelDesignOptions {
  labelType: 'qr' | 'barcode' | 'both';
  barcodeFormat: 'CODE128' | 'CODE39' | 'EAN13';
  includeLogo: boolean;
  includeCompanyHeader: boolean;
  includeName: boolean;
  includeSerial: boolean;
  includeCategory: boolean;
  includeLocation: boolean;
  includeFooterWarning: boolean;
  companyName: string;
  customNote?: string;
  qrPayloadType: 'tag_only' | 'url' | 'json';
}

export const defaultLabelDesign: LabelDesignOptions = {
  labelType: 'both',
  barcodeFormat: 'CODE128',
  includeLogo: true,
  includeCompanyHeader: true,
  includeName: true,
  includeSerial: true,
  includeCategory: true,
  includeLocation: true,
  includeFooterWarning: true,
  companyName: 'ACIPL / IPNET',
  customNote: 'Property of ACIPL/IPNET - Do Not Remove',
  qrPayloadType: 'tag_only'
};

/**
 * Generate a high-resolution QR code data URL
 */
export async function generateQRCode(text: string, size = 200): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      width: size,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    });
  } catch (err) {
    console.error('Failed to generate QR code', err);
    return '';
  }
}

/**
 * Render 1D Barcode directly onto an SVG element
 */
export function renderBarcodeSvg(
  svgElement: SVGSVGElement | null, 
  value: string, 
  format: 'CODE128' | 'CODE39' | 'EAN13' = 'CODE128',
  options?: { height?: number; width?: number; displayValue?: boolean }
): void {
  if (!svgElement || !value) return;
  try {
    JsBarcode(svgElement, value, {
      format: format,
      lineColor: '#0f172a',
      width: options?.width || 1.8,
      height: options?.height || 45,
      displayValue: options?.displayValue ?? true,
      fontSize: 12,
      font: 'monospace',
      textMargin: 3,
      margin: 4
    });
  } catch (err) {
    console.warn('Failed to render barcode SVG for', value, err);
  }
}

/**
 * Clean audio feedback synthesizer for scanner (Web Audio API)
 */
export function playScanSound(type: 'success' | 'warning' | 'error' = 'success'): void {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'success') {
      // Pleasant double beep (high pitch)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.setValueAtTime(1900, now + 0.08);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.start(now);
      osc.stop(now + 0.22);
    } else if (type === 'warning') {
      // Mid-pitch chime
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, now);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else {
      // Error low buzz
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    }
  } catch (e) {
    // Audio context may be restricted by browser policy before user interaction
    console.debug('Audio cue blocked or unsupported', e);
  }
}

/**
 * Generate formatted payload string for QR
 */
export function buildQRPayload(
  item: { assetTag?: string; id?: string; name: string; serial?: string; model?: string }, 
  type: 'tag_only' | 'url' | 'json' = 'tag_only'
): string {
  const tag = item.assetTag || item.id || item.name;
  if (type === 'tag_only') {
    return tag;
  }
  if (type === 'url') {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://acipl-ims.local';
    return `${origin}/#item=${encodeURIComponent(tag)}`;
  }
  // JSON payload
  return JSON.stringify({
    tag: tag,
    name: item.name,
    serial: item.serial || '',
    model: item.model || '',
    sys: 'ACIPL/IPNET-IMS'
  });
}
