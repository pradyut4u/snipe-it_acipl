import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../src/context/AppContext';
import { Asset } from '../types';
import { 
  generateQRCode, 
  renderBarcodeSvg, 
  buildQRPayload, 
  defaultLabelDesign, 
  LabelDesignOptions, 
  playScanSound 
} from '../utils/barcodeUtils';
import { 
  QrCode, 
  Barcode as BarcodeIcon, 
  Printer, 
  Download, 
  Layers, 
  ShieldCheck, 
  Camera, 
  Search, 
  CheckCircle2, 
  Box, 
  FileText, 
  Check, 
  Copy, 
  Laptop, 
  Sliders, 
  FileDown 
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { exportAuditLogsToPDF, exportAuditLogsToCSV } from '../utils/exportUtils';

interface BarcodeHubProps {
  onOpenScanner: () => void;
  onOpenBatchPrint: () => void;
  onOpenDetailModal: (asset: Asset) => void;
}

export const BarcodeHub: React.FC<BarcodeHubProps> = ({
  onOpenScanner,
  onOpenBatchPrint,
  onOpenDetailModal,
}) => {
  const { assets, activityLogs, auditAsset } = useApp();

  const [selectedAssetId, setSelectedAssetId] = useState<string>(assets[0]?.id || '');
  const [activeSubTab, setActiveSubTab] = useState<'label_studio' | 'audit_station'>('label_studio');
  const [design, setDesign] = useState<LabelDesignOptions>(defaultLabelDesign);
  const [qrUrl, setQrUrl] = useState<string>('');
  const [labelSize, setLabelSize] = useState<'standard' | 'compact' | 'wide'>('standard');
  const [copied, setCopied] = useState(false);
  const [quickAuditInput, setQuickAuditInput] = useState('');
  const [auditSuccessToast, setAuditSuccessToast] = useState<string | null>(null);

  const barcodeSvgRef = useRef<SVGSVGElement>(null);
  const printableLabelRef = useRef<HTMLDivElement>(null);

  const selectedAsset = assets.find(a => a.id === selectedAssetId) || assets[0];

  // Generate QR for selected asset
  useEffect(() => {
    if (!selectedAsset) return;
    const payload = buildQRPayload(
      { 
        assetTag: selectedAsset.assetTag, 
        name: selectedAsset.name, 
        serial: selectedAsset.serial, 
        model: selectedAsset.model 
      },
      design.qrPayloadType
    );
    generateQRCode(payload, 220).then(url => setQrUrl(url));
  }, [selectedAsset, design.qrPayloadType]);

  // Render Barcode SVG
  useEffect(() => {
    if (!selectedAsset || design.labelType === 'qr') return;
    if (barcodeSvgRef.current) {
      renderBarcodeSvg(barcodeSvgRef.current, selectedAsset.assetTag, design.barcodeFormat, {
        height: labelSize === 'compact' ? 32 : 42,
        width: 1.8,
        displayValue: true
      });
    }
  }, [selectedAsset, design.labelType, design.barcodeFormat, labelSize]);

  // Audit activity logs
  const auditLogs = activityLogs.filter(l => l.action === 'audit');

  const handleQuickAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickAuditInput.trim()) return;
    const key = quickAuditInput.trim().toLowerCase();
    const asset = assets.find(a => a.assetTag.toLowerCase() === key || a.serial.toLowerCase() === key);
    if (asset) {
      auditAsset(asset.id, 'Physical audit verified in Barcode Hub');
      playScanSound('success');
      setAuditSuccessToast(`Verified ${asset.assetTag} (${asset.name})`);
      setQuickAuditInput('');
      setTimeout(() => setAuditSuccessToast(null), 3000);
    } else {
      playScanSound('error');
      alert(`Asset with Tag or Serial "${quickAuditInput}" not found.`);
    }
  };

  const handlePrintLabel = () => {
    const printContent = printableLabelRef.current;
    if (!printContent || !selectedAsset) return;

    const printWindow = window.open('', '_blank', 'width=600,height=600');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Asset Label - ${selectedAsset.assetTag}</title>
          <style>
            @page { size: auto; margin: 4mm; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              margin: 0; padding: 12px;
              display: flex; justify-content: center; align-items: center;
            }
            .label-box {
              border: 2px solid #0f172a;
              border-radius: 6px;
              padding: 12px;
              width: ${labelSize === 'compact' ? '240px' : labelSize === 'wide' ? '380px' : '320px'};
              box-sizing: border-box;
            }
            .header {
              display: flex; justify-content: space-between;
              border-bottom: 2px solid #0f172a;
              padding-bottom: 4px; margin-bottom: 6px;
              font-weight: 800; font-size: 12px;
            }
            svg, img { max-width: 100%; height: auto; display: block; margin: 0 auto; }
          </style>
        </head>
        <body>
          <div class="label-box">${printContent.innerHTML}</div>
          <script>
            window.onload = function() { window.print(); setTimeout(function() { window.close(); }, 500); };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleDownloadPDF = () => {
    if (!selectedAsset) return;
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [80, 50]
    });

    doc.setDrawColor(15, 23, 42);
    doc.setLineWidth(0.6);
    doc.roundedRect(2, 2, 76, 46, 2, 2);

    doc.setFillColor(15, 23, 42);
    doc.rect(2, 2, 76, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(design.companyName || 'ACIPL / IPNET IMS', 4, 7);

    doc.setFillColor(241, 245, 249);
    doc.roundedRect(4, 12, 44, 7, 1, 1, 'F');
    doc.setTextColor(15, 23, 42);
    doc.setFont('courier', 'bold');
    doc.setFontSize(10);
    doc.text(selectedAsset.assetTag, 6, 17);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.text(selectedAsset.name.substring(0, 22), 4, 23);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(71, 85, 105);
    doc.text(`Model: ${selectedAsset.model}`, 4, 27);
    doc.text(`S/N: ${selectedAsset.serial}`, 4, 31);
    doc.text(`Loc: ${selectedAsset.location}`, 4, 35);

    if (qrUrl && design.labelType !== 'barcode') {
      doc.addImage(qrUrl, 'PNG', 50, 12, 26, 26);
    }

    doc.save(`Label_${selectedAsset.assetTag}.pdf`);
  };

  return (
    <div id="barcode-hub-view" className="space-y-6">
      
      {/* Top Banner / Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <QrCode className="w-6 h-6 text-sky-600" />
            <span>Barcode & QR Code Center</span>
          </h1>
          <p className="text-sm text-slate-500">
            Generate physical asset labels, print Avery sticker sheets, and execute barcode inventory audits.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            id="hub-launch-scanner-btn"
            onClick={onOpenScanner}
            className="flex items-center space-x-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            <span>Launch Scanner</span>
          </button>

          <button
            id="hub-batch-sheet-btn"
            onClick={onOpenBatchPrint}
            className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Layers className="w-4 h-4" />
            <span>Print Label Sheet</span>
          </button>
        </div>
      </div>

      {/* Top Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
            <Laptop className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Tagged Hardware</div>
            <div className="text-xl font-bold text-slate-900">{assets.length} items</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Physical Audits Logged</div>
            <div className="text-xl font-bold text-slate-900">{auditLogs.length} verified</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Matrix Format</div>
            <div className="text-xl font-bold text-slate-900">QR Code 2D</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <BarcodeIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Linear Barcode</div>
            <div className="text-xl font-bold text-slate-900">Code 128 Auto</div>
          </div>
        </div>
      </div>

      {/* Main Mode Tabs */}
      <div className="flex border-b border-slate-200 space-x-4">
        <button
          onClick={() => setActiveSubTab('label_studio')}
          className={`pb-3 text-sm font-bold flex items-center space-x-2 border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'label_studio'
              ? 'border-sky-600 text-sky-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Interactive Label Studio</span>
        </button>

        <button
          onClick={() => setActiveSubTab('audit_station')}
          className={`pb-3 text-sm font-bold flex items-center space-x-2 border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'audit_station'
              ? 'border-sky-600 text-sky-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Inventory Audit & Verification Station ({auditLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: INTERACTIVE LABEL STUDIO */}
      {activeSubTab === 'label_studio' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Controls Column (5 cols) */}
          <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
            <div className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-200">
              Select Asset & Label Style
            </div>

            {/* Select Asset */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Select Hardware Asset</label>
              <select
                value={selectedAssetId}
                onChange={e => setSelectedAssetId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-sky-500"
              >
                {assets.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.assetTag} — {a.name} ({a.model})
                  </option>
                ))}
              </select>
            </div>

            {/* Sticker Dimensions */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Sticker Dimension</label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'standard', label: 'Standard', size: '3.0" × 1.5"' },
                  { id: 'compact', label: 'Compact', size: '2.0" × 1.0"' },
                  { id: 'wide', label: 'Wide Tag', size: '4.0" × 2.0"' }
                ].map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setLabelSize(s.id as any)}
                    className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${
                      labelSize === s.id
                        ? 'border-sky-500 bg-sky-50 font-bold text-sky-900'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="text-[11px]">{s.label}</div>
                    <div className="text-[9px] text-slate-400">{s.size}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Barcode / QR Type */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Code Element</label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'both', label: 'QR + Barcode' },
                  { id: 'qr', label: 'QR Only' },
                  { id: 'barcode', label: '1D Barcode' }
                ].map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setDesign(d => ({ ...d, labelType: t.id as any }))}
                    className={`p-2 rounded-xl border text-center cursor-pointer transition-all ${
                      design.labelType === t.id
                        ? 'border-sky-500 bg-sky-50 font-bold text-sky-900'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <span className="text-[11px]">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* QR Content */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">QR Data Encoding</label>
              <select
                value={design.qrPayloadType}
                onChange={e => setDesign(d => ({ ...d, qrPayloadType: e.target.value as any }))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium"
              >
                <option value="tag_only">Tag Number Only ({selectedAsset?.assetTag})</option>
                <option value="json">Hardware Record JSON</option>
                <option value="url">Direct App Deep-Link</option>
              </select>
            </div>

            {/* Additional Field Options */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={design.includeSerial}
                  onChange={e => setDesign(d => ({ ...d, includeSerial: e.target.checked }))}
                  className="rounded text-sky-600 focus:ring-sky-500"
                />
                <span className="text-slate-700">Display Hardware Serial Number</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={design.includeLocation}
                  onChange={e => setDesign(d => ({ ...d, includeLocation: e.target.checked }))}
                  className="rounded text-sky-600 focus:ring-sky-500"
                />
                <span className="text-slate-700">Display Warehouse Location</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={design.includeFooterWarning}
                  onChange={e => setDesign(d => ({ ...d, includeFooterWarning: e.target.checked }))}
                  className="rounded text-sky-600 focus:ring-sky-500"
                />
                <span className="text-slate-700">Display Property Protection Footer</span>
              </label>
            </div>
          </div>

          {/* Label Preview and Output Column (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            <div className="bg-slate-100 p-8 rounded-2xl border border-slate-200 flex items-center justify-center min-h-[360px]">
              {selectedAsset ? (
                <div
                  ref={printableLabelRef}
                  id="hub-label-canvas"
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
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                        Asset ID
                      </span>
                    </div>
                  )}

                  {/* Asset Tag Highlight Box */}
                  <div className="flex items-center justify-between bg-slate-100 border border-slate-300 rounded px-2.5 py-1 mb-2.5">
                    <span className="font-mono text-sm font-black tracking-wider text-slate-900">
                      {selectedAsset.assetTag}
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(selectedAsset.assetTag);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="text-slate-500 hover:text-slate-900 p-0.5 rounded transition-colors"
                      title="Copy Tag"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Body: QR & Metadata */}
                  <div className="grid grid-cols-12 gap-2 items-center">
                    {design.labelType !== 'barcode' && (
                      <div className="col-span-5 flex flex-col items-center justify-center">
                        {qrUrl ? (
                          <img
                            src={qrUrl}
                            alt={`QR for ${selectedAsset.assetTag}`}
                            className="w-24 h-24 border border-slate-200 rounded p-0.5 bg-white"
                          />
                        ) : (
                          <div className="w-24 h-24 bg-slate-100 animate-pulse rounded" />
                        )}
                        <span className="text-[9px] text-slate-400 font-mono mt-0.5">SCAN ME</span>
                      </div>
                    )}

                    <div className={design.labelType === 'barcode' ? 'col-span-12 space-y-1' : 'col-span-7 space-y-1 pl-1'}>
                      <div className="font-bold text-slate-900 text-[11px] leading-tight line-clamp-2">
                        {selectedAsset.name}
                      </div>
                      {design.includeSerial && (
                        <div className="text-[10px] text-slate-600 font-mono">
                          <span className="text-slate-400 font-sans">S/N: </span>
                          <span className="font-semibold">{selectedAsset.serial}</span>
                        </div>
                      )}
                      <div className="text-[10px] text-slate-600">
                        <span className="text-slate-400">Cat: </span>
                        <span>{selectedAsset.category}</span>
                      </div>
                      {design.includeLocation && (
                        <div className="text-[10px] text-slate-600">
                          <span className="text-slate-400">Loc: </span>
                          <span>{selectedAsset.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 1D Barcode Line */}
                  {design.labelType !== 'qr' && (
                    <div className="mt-2 pt-2 border-t border-slate-200 flex flex-col items-center justify-center">
                      <svg ref={barcodeSvgRef} className="max-w-full overflow-hidden" />
                    </div>
                  )}

                  {/* Footer Protection Warning */}
                  {design.includeFooterWarning && (
                    <div className="mt-2.5 pt-1.5 border-t border-slate-300 border-dashed text-center text-[8px] font-bold text-slate-500 uppercase tracking-tight">
                      {design.customNote}
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            {/* Print & Download Toolbar */}
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={handlePrintLabel}
                className="flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-4 rounded-xl transition-colors shadow-sm cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Single Sticker</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadPDF}
                className="flex items-center justify-center space-x-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold py-3 px-4 rounded-xl transition-colors shadow-sm cursor-pointer"
              >
                <FileDown className="w-4 h-4" />
                <span>Download Label PDF</span>
              </button>

              <button
                type="button"
                onClick={onOpenBatchPrint}
                className="flex items-center justify-center space-x-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold py-3 px-4 rounded-xl transition-colors shadow-sm cursor-pointer"
              >
                <Layers className="w-4 h-4" />
                <span>Bulk Sheet Generator</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INVENTORY AUDIT & VERIFICATION STATION */}
      {activeSubTab === 'audit_station' && (
        <div className="space-y-6">
          {/* Quick Hardware Wedge input */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Rapid Physical Audit Check</h3>
                <p className="text-xs text-slate-500">Scan with USB barcode wand or enter asset tag to verify physical inventory.</p>
              </div>

              <form onSubmit={handleQuickAudit} className="flex space-x-2 max-w-md w-full">
                <input
                  type="text"
                  placeholder="Scan or type Asset Tag (e.g. ACIPL-2024-001)..."
                  value={quickAuditInput}
                  onChange={e => setQuickAuditInput(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 focus:ring-2 focus:ring-sky-500"
                />
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shrink-0 cursor-pointer shadow-xs"
                >
                  Verify Now
                </button>
              </form>
            </div>

            {auditSuccessToast && (
              <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{auditSuccessToast}</span>
              </div>
            )}
          </div>

          {/* Audit Logs Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 text-xs">Physical Verification Audit Trail</span>
                <span className="text-[11px] text-slate-500 ml-2 font-mono">({auditLogs.length} events logged)</span>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => exportAuditLogsToPDF(activityLogs)}
                  className="flex items-center space-x-1.5 bg-white hover:bg-rose-50 border border-slate-300 hover:border-rose-300 text-rose-700 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Audit PDF</span>
                </button>

                <button
                  onClick={() => exportAuditLogsToCSV(activityLogs)}
                  className="flex items-center space-x-1.5 bg-white hover:bg-emerald-50 border border-slate-300 hover:border-emerald-300 text-emerald-700 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>Audit CSV</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs divide-y divide-slate-200">
                <thead className="bg-slate-50/50 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="px-5 py-3">Timestamp</th>
                    <th className="px-5 py-3">Verified Item</th>
                    <th className="px-5 py-3">Auditor / Agent</th>
                    <th className="px-5 py-3">Verification Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {auditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-5 py-8 text-center text-slate-400">
                        No physical audits recorded yet. Use the Scanner or Rapid Check to verify assets.
                      </td>
                    </tr>
                  ) : (
                    auditLogs.map(log => (
                      <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-5 py-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                          {log.timestamp}
                        </td>
                        <td className="px-5 py-3 font-semibold text-slate-900">
                          {log.itemName}
                        </td>
                        <td className="px-5 py-3 text-slate-600">
                          {log.adminName}
                        </td>
                        <td className="px-5 py-3 text-slate-600">
                          <span className="inline-flex items-center space-x-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full text-[11px] font-medium">
                            <ShieldCheck className="w-3 h-3" />
                            <span>{log.notes || 'Verified'}</span>
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
