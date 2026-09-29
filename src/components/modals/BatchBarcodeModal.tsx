import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Asset } from '../../types';
import { generateQRCode } from '../../utils/barcodeUtils';
import { 
  X, 
  Printer, 
  Layers, 
  CheckSquare, 
  Square, 
  FileDown, 
  QrCode, 
  Search,
  Filter
} from 'lucide-react';
import { jsPDF } from 'jspdf';

interface BatchBarcodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BatchBarcodeModal: React.FC<BatchBarcodeModalProps> = ({ isOpen, onClose }) => {
  const { assets } = useApp();
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sheetLayout, setSheetLayout] = useState<'2x5' | '3x10'>('2x5');
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrCache, setQrCache] = useState<Record<string, string>>({});

  // Initialize selected with all ready to deploy or first 10 assets
  useEffect(() => {
    if (isOpen && assets.length > 0 && selectedAssetIds.length === 0) {
      setSelectedAssetIds(assets.map(a => a.id));
    }
  }, [isOpen, assets]);

  // Pre-generate QR codes for selected assets
  useEffect(() => {
    if (!isOpen) return;
    const generateAll = async () => {
      const newCache: Record<string, string> = { ...qrCache };
      let changed = false;
      for (const id of selectedAssetIds) {
        if (!newCache[id]) {
          const item = assets.find(a => a.id === id);
          if (item) {
            newCache[id] = await generateQRCode(item.assetTag, 140);
            changed = true;
          }
        }
      }
      if (changed) {
        setQrCache(newCache);
      }
    };
    generateAll();
  }, [isOpen, selectedAssetIds, assets]);

  if (!isOpen) return null;

  // Filter assets for selection list
  const filteredAssets = assets.filter(a => {
    const matchesSearch = 
      a.assetTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.serial.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = filterCategory === 'all' || a.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || a.status === filterStatus;
    return matchesSearch && matchesCat && matchesStatus;
  });

  const handleSelectAllFiltered = () => {
    const ids = filteredAssets.map(a => a.id);
    const combined = Array.from(new Set([...selectedAssetIds, ...ids]));
    setSelectedAssetIds(combined);
  };

  const handleDeselectAllFiltered = () => {
    const idsToRemove = new Set(filteredAssets.map(a => a.id));
    setSelectedAssetIds(selectedAssetIds.filter(id => !idsToRemove.has(id)));
  };

  const toggleSelectAsset = (id: string) => {
    setSelectedAssetIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectedAssetItems = assets.filter(a => selectedAssetIds.includes(a.id));

  // Generate & Download PDF Sheet
  const handleExportPDF = async () => {
    if (selectedAssetItems.length === 0) return;
    setIsGenerating(true);

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4' // 210mm x 297mm
      });

      const cols = sheetLayout === '2x5' ? 2 : 3;
      const rows = sheetLayout === '2x5' ? 5 : 10;
      const labelsPerPage = cols * rows;

      const pageWidth = 210;
      const pageHeight = 297;
      const marginX = 10;
      const marginY = 12;

      const labelWidth = (pageWidth - marginX * 2 - (cols - 1) * 6) / cols;
      const labelHeight = (pageHeight - marginY * 2 - (rows - 1) * 4) / rows;

      let currentPage = 1;

      for (let i = 0; i < selectedAssetItems.length; i++) {
        const item = selectedAssetItems[i];
        const pageIndex = i % labelsPerPage;

        if (i > 0 && pageIndex === 0) {
          doc.addPage();
          currentPage++;
        }

        const colIndex = pageIndex % cols;
        const rowIndex = Math.floor(pageIndex / cols);

        const x = marginX + colIndex * (labelWidth + 6);
        const y = marginY + rowIndex * (labelHeight + 4);

        // Label border
        doc.setDrawColor(203, 213, 225);
        doc.setLineWidth(0.3);
        doc.roundedRect(x, y, labelWidth, labelHeight, 1.5, 1.5);

        // Header band
        doc.setFillColor(15, 23, 42);
        doc.rect(x, y, labelWidth, 5, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6.5);
        doc.text('ACIPL / IPNET IMS', x + 2.5, y + 3.5);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(5);
        doc.text('ASSET TAG', x + labelWidth - 14, y + 3.5);

        // QR Code
        let qrUrl = qrCache[item.id];
        if (!qrUrl) {
          qrUrl = await generateQRCode(item.assetTag, 100);
        }
        if (qrUrl) {
          const qrSize = sheetLayout === '2x5' ? 22 : 14;
          doc.addImage(qrUrl, 'PNG', x + labelWidth - qrSize - 3, y + 7, qrSize, qrSize);
        }

        // Tag Number
        doc.setFillColor(241, 245, 249);
        doc.roundedRect(x + 2.5, y + 7, labelWidth - (sheetLayout === '2x5' ? 28 : 20), 6, 1, 1, 'F');
        doc.setTextColor(15, 23, 42);
        doc.setFont('courier', 'bold');
        doc.setFontSize(sheetLayout === '2x5' ? 8.5 : 7);
        doc.text(item.assetTag, x + 3.5, y + 11.5);

        // Asset Name & details
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.setFontSize(sheetLayout === '2x5' ? 7 : 5.5);
        const truncatedName = item.name.length > 20 ? item.name.substring(0, 20) + '...' : item.name;
        doc.text(truncatedName, x + 2.5, y + 16);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);
        doc.setFontSize(sheetLayout === '2x5' ? 5.5 : 4.5);
        doc.text(`Model: ${item.model || 'Standard'}`, x + 2.5, y + 20);
        doc.text(`S/N: ${item.serial || 'N/A'}`, x + 2.5, y + 23.5);

        if (sheetLayout === '2x5') {
          doc.text(`Loc: ${item.location}`, x + 2.5, y + 27);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(4);
          doc.setTextColor(100, 116, 139);
          doc.text('PROPERTY OF ACIPL/IPNET', x + 2.5, y + labelHeight - 2);
        }
      }

      doc.save(`Asset_Labels_Sheet_${selectedAssetItems.length}_items.pdf`);
    } catch (e) {
      console.error('Error generating label sheet', e);
    } finally {
      setIsGenerating(false);
    }
  };

  // Browser Direct Print Sheet
  const handlePrintSheet = () => {
    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) {
      alert('Please allow popups to print sheet');
      return;
    }

    const labelsHtml = selectedAssetItems.map(item => {
      const qr = qrCache[item.id] || '';
      return `
        <div class="sheet-label">
          <div class="label-header">
            <span>ACIPL/IPNET IMS</span>
            <span>TAG</span>
          </div>
          <div class="label-body">
            <div class="label-meta">
              <div class="tag-code">${item.assetTag}</div>
              <div class="item-name">${item.name}</div>
              <div class="item-sn">S/N: ${item.serial}</div>
              <div class="item-loc">Loc: ${item.location}</div>
            </div>
            ${qr ? `<img src="${qr}" class="qr-img" alt="QR" />` : ''}
          </div>
          <div class="label-footer">PROPERTY OF ACIPL/IPNET</div>
        </div>
      `;
    }).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Asset Label Sheet (${selectedAssetItems.length} items)</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 10mm;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              margin: 0;
              padding: 0;
              background: #fff;
            }
            .sheet-grid {
              display: grid;
              grid-template-columns: ${sheetLayout === '2x5' ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)'};
              gap: 4mm;
            }
            .sheet-label {
              border: 1px solid #0f172a;
              border-radius: 4px;
              padding: 6px;
              box-sizing: border-box;
              height: ${sheetLayout === '2x5' ? '48mm' : '26mm'};
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              page-break-inside: avoid;
            }
            .label-header {
              display: flex;
              justify-content: space-between;
              font-size: 8px;
              font-weight: 800;
              border-bottom: 1px solid #0f172a;
              padding-bottom: 2px;
              margin-bottom: 4px;
            }
            .label-body {
              display: flex;
              align-items: center;
              justify-content: space-between;
              flex: 1;
            }
            .label-meta {
              flex: 1;
              padding-right: 4px;
            }
            .tag-code {
              font-family: monospace;
              font-size: 11px;
              font-weight: 800;
              background: #f1f5f9;
              padding: 1px 4px;
              border-radius: 2px;
              display: inline-block;
            }
            .item-name {
              font-size: 9px;
              font-weight: 700;
              margin-top: 2px;
            }
            .item-sn, .item-loc {
              font-size: 8px;
              color: #475569;
            }
            .qr-img {
              width: ${sheetLayout === '2x5' ? '24mm' : '16mm'};
              height: ${sheetLayout === '2x5' ? '24mm' : '16mm'};
            }
            .label-footer {
              font-size: 6px;
              font-weight: bold;
              text-align: center;
              color: #64748b;
              border-top: 1px dashed #cbd5e1;
              padding-top: 2px;
              margin-top: 2px;
            }
          </style>
        </head>
        <body>
          <div class="sheet-grid">
            ${labelsHtml}
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

  const categories = Array.from(new Set(assets.map(a => a.category)));

  return (
    <div id="batch-barcode-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-6">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Batch Barcode & QR Label Sheet Generator</h2>
              <p className="text-xs text-slate-500">Print multi-item sticker sheets for physical asset tagging.</p>
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
          
          {/* Left Column: Asset Selection Table (7 cols) */}
          <div className="md:col-span-7 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Select Assets to Print ({selectedAssetIds.length} of {assets.length})
              </div>
              <div className="space-x-2 text-xs">
                <button
                  type="button"
                  onClick={handleSelectAllFiltered}
                  className="text-sky-600 hover:text-sky-700 font-semibold cursor-pointer"
                >
                  Select Filtered
                </button>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={handleDeselectAllFiltered}
                  className="text-slate-500 hover:text-slate-700 font-medium cursor-pointer"
                >
                  Clear Selection
                </button>
              </div>
            </div>

            {/* Search & Filter bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="relative sm:col-span-1">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter tag, name..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <select
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700"
              >
                <option value="all">All Categories</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700"
              >
                <option value="all">All Statuses</option>
                <option value="Ready to Deploy">Ready to Deploy</option>
                <option value="Deployed">Deployed</option>
                <option value="Pending">Pending</option>
                <option value="In Repair">In Repair</option>
              </select>
            </div>

            {/* Asset checklist box */}
            <div className="border border-slate-200 rounded-xl overflow-hidden max-h-[300px] overflow-y-auto divide-y divide-slate-100 bg-white">
              {filteredAssets.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">No matching assets found</div>
              ) : (
                filteredAssets.map(asset => {
                  const isSelected = selectedAssetIds.includes(asset.id);
                  return (
                    <div
                      key={asset.id}
                      onClick={() => toggleSelectAsset(asset.id)}
                      className={`px-3 py-2 flex items-center justify-between text-xs cursor-pointer hover:bg-slate-50 transition-colors ${
                        isSelected ? 'bg-sky-50/60' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <span className="text-sky-600">
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-sky-600" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-300" />
                          )}
                        </span>
                        <div>
                          <span className="font-mono font-bold text-slate-900 mr-2">
                            {asset.assetTag}
                          </span>
                          <span className="text-slate-700">{asset.name}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-[11px] text-slate-500 font-mono">
                        <span>{asset.serial}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Sheet Setup & Print Actions (5 cols) */}
          <div className="md:col-span-5 bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4 text-xs">
            <div className="font-bold text-slate-800 pb-2 border-b border-slate-200">
              Print Sheet Layout
            </div>

            {/* Layout Template */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Grid Template</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSheetLayout('2x5')}
                  className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                    sheetLayout === '2x5'
                      ? 'border-sky-500 bg-sky-50 font-semibold text-sky-900 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="font-bold text-slate-900 text-xs">10 Labels / Page</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">2 columns × 5 rows (Avery 5163 standard)</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSheetLayout('3x10')}
                  className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                    sheetLayout === '3x10'
                      ? 'border-sky-500 bg-sky-50 font-semibold text-sky-900 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="font-bold text-slate-900 text-xs">30 Labels / Page</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">3 columns × 10 rows (Compact Avery 5160)</div>
                </button>
              </div>
            </div>

            {/* Summary preview */}
            <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Selected for printing:</span>
                <span className="font-bold text-slate-900">{selectedAssetIds.length} labels</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estimated sheets (A4):</span>
                <span className="font-bold text-slate-900">
                  {Math.ceil(selectedAssetIds.length / (sheetLayout === '2x5' ? 10 : 30)) || 1} sheet(s)
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tag header:</span>
                <span className="font-semibold text-slate-700">ACIPL / IPNET IMS</span>
              </div>
            </div>

            {/* Print & Download Buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handlePrintSheet}
                disabled={selectedAssetIds.length === 0}
                className="w-full flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors shadow-sm cursor-pointer disabled:opacity-50"
              >
                <Printer className="w-4 h-4" />
                <span>Print Label Sheet Now</span>
              </button>

              <button
                type="button"
                onClick={handleExportPDF}
                disabled={selectedAssetIds.length === 0 || isGenerating}
                className="w-full flex items-center justify-center space-x-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors shadow-sm cursor-pointer disabled:opacity-50"
              >
                <FileDown className="w-4 h-4" />
                <span>{isGenerating ? 'Generating PDF...' : 'Download PDF Label Sheet'}</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
