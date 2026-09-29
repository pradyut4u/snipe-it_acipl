import React, { useState, useEffect, useRef } from 'react';
import { Asset, Accessory, Consumable } from '../../types';
import { 
  generateQRCode, 
  renderBarcodeSvg, 
  buildQRPayload, 
  defaultLabelDesign, 
  LabelDesignOptions 
} from '../../utils/barcodeUtils';
import { 
  X, 
  Printer, 
  Download, 
  QrCode, 
  Barcode as BarcodeIcon, 
  Copy, 
  Check, 
  Sliders, 
  Box, 
  FileDown 
} from 'lucide-react';
import { jsPDF } from 'jspdf';

interface BarcodeLabelModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: Asset | null;
  accessory?: Accessory | null;
  consumable?: Consumable | null;
}

export const BarcodeLabelModal: React.FC<BarcodeLabelModalProps> = ({
  isOpen,
  onClose,
  asset,
  accessory,
  consumable
}) => {
  const [design, setDesign] = useState<LabelDesignOptions>(defaultLabelDesign);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [labelSize, setLabelSize] = useState<'standard' | 'compact' | 'wide'>('standard');

  const barcodeSvgRef = useRef<SVGSVGElement>(null);
  const printableLabelRef = useRef<HTMLDivElement>(null);

  // Normalize item info
  const itemTag = asset?.assetTag || (accessory ? `ACC-${accessory.modelNumber || accessory.id.slice(0, 6)}` : '') || (consumable ? `CON-${consumable.modelNumber || consumable.id.slice(0, 6)}` : '') || 'TAG-0000';
  const itemName = asset?.name || accessory?.name || consumable?.name || 'Unnamed Item';
  const itemModel = asset?.model || accessory?.modelNumber || consumable?.modelNumber || '';
  const itemSerial = asset?.serial || 'N/A';
  const itemCategory = asset?.category || accessory?.category || consumable?.category || 'Hardware';
  const itemLocation = asset?.location || accessory?.location || consumable?.location || 'HQ Warehouse';

  // Generate QR Code
  useEffect(() => {
    if (!isOpen) return;
    const payload = buildQRPayload(
      { assetTag: itemTag, name: itemName, serial: itemSerial, model: itemModel },
      design.qrPayloadType
    );
    generateQRCode(payload, 240).then(url => setQrDataUrl(url));
  }, [isOpen, itemTag, itemName, itemSerial, itemModel, design.qrPayloadType]);

  // Render Barcode SVG
  useEffect(() => {
    if (!isOpen || design.labelType === 'qr') return;
    if (barcodeSvgRef.current) {
      renderBarcodeSvg(barcodeSvgRef.current, itemTag, design.barcodeFormat, {
        height: labelSize === 'compact' ? 32 : 44,
        width: 1.8,
        displayValue: true
      });
    }
  }, [isOpen, itemTag, design.labelType, design.barcodeFormat, labelSize]);

  if (!isOpen) return null;

  const handleCopyTag = () => {
    navigator.clipboard.writeText(itemTag);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const printContent = printableLabelRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank', 'width=600,height=600');
    if (!printWindow) {
      alert('Please allow popups to print asset label');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Label - ${itemTag}</title>
          <style>
            @page {
              size: auto;
              margin: 4mm;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              margin: 0;
              padding: 10px;
              display: flex;
              justify-content: center;
              align-items: center;
              background: #fff;
            }
            .label-box {
              border: 2px solid #0f172a;
              border-radius: 8px;
              padding: 12px;
              width: ${labelSize === 'compact' ? '240px' : labelSize === 'wide' ? '380px' : '320px'};
              box-sizing: border-box;
              background: #ffffff;
              color: #0f172a;
            }
            .header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              border-bottom: 1.5px solid #0f172a;
              padding-bottom: 6px;
              margin-bottom: 8px;
            }
            .header-title {
              font-weight: 800;
              font-size: 13px;
              letter-spacing: 0.5px;
            }
            .header-sub {
              font-size: 9px;
              color: #475569;
            }
            .tag-badge {
              font-family: monospace;
              font-size: 15px;
              font-weight: bold;
              background: #0f172a;
              color: #ffffff;
              padding: 2px 8px;
              border-radius: 4px;
              display: inline-block;
              letter-spacing: 1px;
            }
            .meta-row {
              font-size: 10px;
              margin: 2px 0;
              line-height: 1.3;
            }
            .meta-label {
              font-weight: 600;
              color: #475569;
            }
            .footer-note {
              margin-top: 8px;
              padding-top: 4px;
              border-top: 1px dashed #cbd5e1;
              font-size: 8px;
              text-align: center;
              font-weight: 600;
              color: #334155;
              text-transform: uppercase;
            }
            svg, img {
              max-width: 100%;
              height: auto;
              display: block;
              margin: 0 auto;
            }
          </style>
        </head>
        <body>
          <div class="label-box">
            ${printContent.innerHTML}
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleDownloadPNG = () => {
    if (!qrDataUrl && design.labelType === 'qr') return;

    const canvas = document.createElement('canvas');
    const width = labelSize === 'wide' ? 600 : 500;
    const height = labelSize === 'compact' ? 320 : 440;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Border
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, width - 20, height - 20);

    // Header bar
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(10, 10, width - 20, 48);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('ACIPL / IPNET IMS', 24, 40);

    ctx.font = '11px sans-serif';
    ctx.fillText('ASSET IDENTIFICATION TAG', width - 180, 40);

    // Asset Tag Box
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(24, 72, width - 48, 36);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.strokeRect(24, 72, width - 48, 36);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 20px monospace';
    ctx.fillText(itemTag, 36, 98);

    // Draw QR Code if applicable
    if (design.labelType !== 'barcode' && qrDataUrl) {
      const img = new Image();
      img.onload = () => {
        const qrSize = 150;
        ctx.drawImage(img, width - qrSize - 30, 120, qrSize, qrSize);

        // Text details on left
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 14px sans-serif';
        ctx.fillText(itemName.length > 25 ? itemName.substring(0, 25) + '...' : itemName, 30, 145);

        ctx.font = '12px sans-serif';
        ctx.fillStyle = '#475569';
        ctx.fillText(`Model: ${itemModel || 'Standard'}`, 30, 175);
        ctx.fillText(`Serial: ${itemSerial}`, 30, 200);
        ctx.fillText(`Category: ${itemCategory}`, 30, 225);
        ctx.fillText(`Location: ${itemLocation}`, 30, 250);

        // Footer
        ctx.fillStyle = '#64748b';
        ctx.font = 'bold 10px sans-serif';
        ctx.fillText('PROPERTY OF ACIPL/IPNET - DO NOT REMOVE OR TAMPER', 30, height - 24);

        // Save
        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `Label_${itemTag}.png`;
        link.href = url;
        link.click();
      };
      img.src = qrDataUrl;
    } else {
      // Barcode only
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText(itemName, 30, 145);

      ctx.font = '12px sans-serif';
      ctx.fillStyle = '#475569';
      ctx.fillText(`Model: ${itemModel || 'Standard'}  |  Serial: ${itemSerial}`, 30, 175);

      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText('PROPERTY OF ACIPL/IPNET - DO NOT REMOVE', 30, height - 24);

      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Label_${itemTag}.png`;
      link.href = url;
      link.click();
    }
  };

  const handleDownloadPDF = async () => {
    setIsExportingPdf(true);
    try {
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [80, 50] // Standard 80x50mm asset label
      });

      // Label background & border
      doc.setDrawColor(15, 23, 42);
      doc.setLineWidth(0.6);
      doc.roundedRect(2, 2, 76, 46, 2, 2);

      // Header band
      doc.setFillColor(15, 23, 42);
      doc.rect(2, 2, 76, 8, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text(design.companyName || 'ACIPL / IPNET IMS', 4, 7);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6);
      doc.text('ASSET ID TAG', 60, 7);

      // Tag box
      doc.setFillColor(241, 245, 249);
      doc.roundedRect(4, 12, 44, 7, 1, 1, 'F');
      doc.setTextColor(15, 23, 42);
      doc.setFont('courier', 'bold');
      doc.setFontSize(10);
      doc.text(itemTag, 6, 17);

      // Info lines
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.text(itemName.length > 22 ? itemName.substring(0, 22) + '...' : itemName, 4, 23);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6);
      doc.setTextColor(71, 85, 105);
      doc.text(`Model: ${itemModel || 'Standard'}`, 4, 27);
      doc.text(`S/N: ${itemSerial}`, 4, 31);
      doc.text(`Loc: ${itemLocation}`, 4, 35);
      doc.text(`Cat: ${itemCategory}`, 4, 39);

      // QR Code image
      if (qrDataUrl && design.labelType !== 'barcode') {
        doc.addImage(qrDataUrl, 'PNG', 50, 12, 26, 26);
      }

      // Footer
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(5);
      doc.setTextColor(100, 116, 139);
      doc.text(design.customNote || 'PROPERTY OF ACIPL/IPNET - DO NOT REMOVE', 4, 45);

      doc.save(`Asset_Tag_${itemTag}.pdf`);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div id="barcode-label-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-6">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-sm">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 font-mono">
                  {itemTag}
                </span>
                <span className="text-xs text-slate-500 font-medium">Barcode & QR Label Studio</span>
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-0.5">{itemName}</h2>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Left Column: Live Label Preview (7 cols) */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Label Sticker Preview
                </span>
                <div className="flex items-center space-x-1.5 bg-slate-100 p-0.5 rounded-lg text-xs font-medium text-slate-600">
                  <button
                    onClick={() => setDesign(d => ({ ...d, labelType: 'both' }))}
                    className={`px-2 py-1 rounded-md transition-all ${design.labelType === 'both' ? 'bg-white shadow-xs text-slate-900 font-semibold' : 'hover:text-slate-900'}`}
                  >
                    QR + Barcode
                  </button>
                  <button
                    onClick={() => setDesign(d => ({ ...d, labelType: 'qr' }))}
                    className={`px-2 py-1 rounded-md transition-all ${design.labelType === 'qr' ? 'bg-white shadow-xs text-slate-900 font-semibold' : 'hover:text-slate-900'}`}
                  >
                    QR Only
                  </button>
                  <button
                    onClick={() => setDesign(d => ({ ...d, labelType: 'barcode' }))}
                    className={`px-2 py-1 rounded-md transition-all ${design.labelType === 'barcode' ? 'bg-white shadow-xs text-slate-900 font-semibold' : 'hover:text-slate-900'}`}
                  >
                    1D Barcode
                  </button>
                </div>
              </div>

              {/* The Physical Sticker Box */}
              <div className="bg-slate-100 p-6 rounded-xl border border-slate-200 flex items-center justify-center min-h-[280px]">
                <div 
                  ref={printableLabelRef}
                  id="rendered-printable-sticker"
                  className={`bg-white rounded-lg border-2 border-slate-900 p-4 shadow-md text-slate-900 transition-all ${
                    labelSize === 'compact' ? 'w-64 text-xs' : labelSize === 'wide' ? 'w-96 text-xs' : 'w-80 text-xs'
                  }`}
                >
                  {/* Company Header */}
                  {design.includeCompanyHeader && (
                    <div className="flex items-center justify-between pb-2 border-b-2 border-slate-900 mb-2.5">
                      <div className="flex items-center space-x-1.5">
                        <Box className="w-3.5 h-3.5 text-sky-600" />
                        <span className="font-extrabold text-[12px] tracking-wide text-slate-900">
                          {design.companyName}
                        </span>
                      </div>
                      <span className="text-[9px] font-bold text-slate-500 tracking-wider uppercase">
                        Asset Tag
                      </span>
                    </div>
                  )}

                  {/* Asset Tag Code Highlight */}
                  <div className="flex items-center justify-between bg-slate-100 border border-slate-300 rounded px-2.5 py-1 mb-2.5">
                    <span className="font-mono text-sm font-black tracking-wider text-slate-900">
                      {itemTag}
                    </span>
                    <button 
                      onClick={handleCopyTag}
                      className="text-slate-500 hover:text-slate-900 p-0.5 rounded transition-colors"
                      title="Copy Tag"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Body: QR & Meta info */}
                  <div className="grid grid-cols-12 gap-2 items-center">
                    {/* QR Code */}
                    {design.labelType !== 'barcode' && (
                      <div className={`${design.labelType === 'both' ? 'col-span-5' : 'col-span-5'} flex flex-col items-center justify-center`}>
                        {qrDataUrl ? (
                          <img 
                            src={qrDataUrl} 
                            alt={`QR for ${itemTag}`} 
                            className="w-24 h-24 border border-slate-200 rounded p-0.5 bg-white"
                          />
                        ) : (
                          <div className="w-24 h-24 bg-slate-100 animate-pulse rounded" />
                        )}
                        <span className="text-[9px] text-slate-400 font-mono mt-0.5">SCAN ME</span>
                      </div>
                    )}

                    {/* Metadata text */}
                    <div className={design.labelType === 'barcode' ? 'col-span-12 space-y-1' : 'col-span-7 space-y-1 pl-1'}>
                      {design.includeName && (
                        <div className="font-bold text-slate-900 text-[11px] leading-tight line-clamp-2">
                          {itemName}
                        </div>
                      )}
                      {design.includeSerial && (
                        <div className="text-[10px] text-slate-600 font-mono">
                          <span className="text-slate-400 font-sans">S/N: </span>
                          <span className="font-semibold">{itemSerial}</span>
                        </div>
                      )}
                      {design.includeCategory && (
                        <div className="text-[10px] text-slate-600">
                          <span className="text-slate-400">Cat: </span>
                          <span>{itemCategory}</span>
                        </div>
                      )}
                      {design.includeLocation && (
                        <div className="text-[10px] text-slate-600">
                          <span className="text-slate-400">Loc: </span>
                          <span>{itemLocation}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 1D Barcode Line (if selected) */}
                  {design.labelType !== 'qr' && (
                    <div className="mt-2 pt-2 border-t border-slate-200 flex flex-col items-center justify-center">
                      <svg ref={barcodeSvgRef} className="max-w-full overflow-hidden" />
                    </div>
                  )}

                  {/* Footer Security Warning */}
                  {design.includeFooterWarning && (
                    <div className="mt-2.5 pt-1.5 border-t border-slate-300 border-dashed text-center text-[8px] font-bold text-slate-500 uppercase tracking-tight">
                      {design.customNote}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions for this label */}
            <div className="grid grid-cols-3 gap-2.5 pt-2">
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center justify-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2.5 px-3 rounded-xl transition-colors shadow-sm cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Sticker</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadPNG}
                className="flex items-center justify-center space-x-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold py-2.5 px-3 rounded-xl transition-colors shadow-sm cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save PNG</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadPDF}
                disabled={isExportingPdf}
                className="flex items-center justify-center space-x-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold py-2.5 px-3 rounded-xl transition-colors shadow-sm cursor-pointer disabled:opacity-50"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Save PDF</span>
              </button>
            </div>
          </div>

          {/* Right Column: Customizer & Settings (5 cols) */}
          <div className="md:col-span-5 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center space-x-2 font-bold text-slate-800 pb-2 border-b border-slate-200">
              <Sliders className="w-4 h-4 text-sky-600" />
              <span>Label Format Options</span>
            </div>

            {/* Label Size */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Sticker Dimension</label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'standard', label: 'Standard', desc: '3.0" × 1.5"' },
                  { id: 'compact', label: 'Compact', desc: '2.0" × 1.0"' },
                  { id: 'wide', label: 'Wide Tag', desc: '4.0" × 2.0"' }
                ].map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setLabelSize(s.id as any)}
                    className={`p-2 rounded-lg border text-left cursor-pointer transition-all ${
                      labelSize === s.id 
                        ? 'border-sky-500 bg-sky-50/70 font-semibold text-sky-900' 
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <div className="text-[11px]">{s.label}</div>
                    <div className="text-[9px] text-slate-400">{s.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Linear Barcode Format */}
            {design.labelType !== 'qr' && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">1D Barcode Standard</label>
                <select
                  value={design.barcodeFormat}
                  onChange={e => setDesign({ ...design, barcodeFormat: e.target.value as any })}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:ring-1 focus:ring-sky-500"
                >
                  <option value="CODE128">Code 128 (Enterprise Default)</option>
                  <option value="CODE39">Code 39 (Alphanumeric)</option>
                </select>
              </div>
            )}

            {/* QR Payload Type */}
            {design.labelType !== 'barcode' && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">QR Code Data Content</label>
                <select
                  value={design.qrPayloadType}
                  onChange={e => setDesign({ ...design, qrPayloadType: e.target.value as any })}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:ring-1 focus:ring-sky-500"
                >
                  <option value="tag_only">Asset Tag Only ({itemTag})</option>
                  <option value="json">Full Hardware Record (JSON)</option>
                  <option value="url">Direct App Deep-Link</option>
                </select>
              </div>
            )}

            {/* Field Toggles */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Include Fields</label>
              <div className="space-y-1.5 bg-white p-2.5 rounded-lg border border-slate-200">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={design.includeCompanyHeader}
                    onChange={e => setDesign({ ...design, includeCompanyHeader: e.target.checked })}
                    className="rounded text-sky-600 focus:ring-sky-500"
                  />
                  <span className="text-slate-700">Company Header Bar</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={design.includeSerial}
                    onChange={e => setDesign({ ...design, includeSerial: e.target.checked })}
                    className="rounded text-sky-600 focus:ring-sky-500"
                  />
                  <span className="text-slate-700">Serial Number (S/N)</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={design.includeLocation}
                    onChange={e => setDesign({ ...design, includeLocation: e.target.checked })}
                    className="rounded text-sky-600 focus:ring-sky-500"
                  />
                  <span className="text-slate-700">Warehouse Location</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={design.includeFooterWarning}
                    onChange={e => setDesign({ ...design, includeFooterWarning: e.target.checked })}
                    className="rounded text-sky-600 focus:ring-sky-500"
                  />
                  <span className="text-slate-700">Property Warning Tag</span>
                </label>
              </div>
            </div>

            {/* Custom Warning Text */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Company Text</label>
              <input
                type="text"
                value={design.companyName}
                onChange={e => setDesign({ ...design, companyName: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
