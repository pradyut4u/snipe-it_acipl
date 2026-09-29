import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Asset, Accessory, Consumable, EventItem } from '../../types';
import { playScanSound } from '../../utils/barcodeUtils';
import { Html5Qrcode } from 'html5-qrcode';
import { 
  X, 
  Camera, 
  Upload, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  LogOut, 
  LogIn, 
  ShieldCheck, 
  Laptop, 
  Keyboard, 
  Box, 
  Calendar, 
  Barcode as BarcodeIcon, 
  Printer, 
  Volume2, 
  VolumeX, 
  Eye,
  Check
} from 'lucide-react';

interface ScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCheckout?: (assetId: string) => void;
  onOpenCheckin?: (assetId: string) => void;
  onOpenDetail?: (asset: Asset) => void;
  onOpenBarcodeLabel?: (asset: Asset) => void;
}

export const ScannerModal: React.FC<ScannerModalProps> = ({
  isOpen,
  onClose,
  onOpenCheckout,
  onOpenCheckin,
  onOpenDetail,
  onOpenBarcodeLabel
}) => {
  const { assets, accessories, consumables, events, auditAsset, checkinAsset } = useApp();

  const [activeTab, setActiveTab] = useState<'camera' | 'upload' | 'manual'>('camera');
  const [manualInput, setManualInput] = useState('');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [continuousMode, setContinuousMode] = useState(false);
  
  // Matched scan result
  const [matchedItem, setMatchedItem] = useState<{
    type: 'asset' | 'accessory' | 'consumable' | 'event';
    item: Asset | Accessory | Consumable | EventItem;
    rawCode: string;
  } | null>(null);
  const [unmatchedCode, setUnmatchedCode] = useState<string | null>(null);
  const [auditVerifiedToast, setAuditVerifiedToast] = useState(false);

  // Continuous audit session list
  const [auditSessionList, setAuditSessionList] = useState<Array<{
    tag: string;
    name: string;
    type: string;
    time: string;
  }>>([]);

  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const qrReaderElementId = 'ims-interactive-scanner-canvas';
  const fileInputRef = useRef<HTMLInputElement>(null);

  // USB Barcode Scanner hardware listener (keyboard wedge)
  useEffect(() => {
    if (!isOpen) return;

    let buffer = '';
    let lastKeyTime = Date.now();

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing inside an input
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') {
        return;
      }

      const currentTime = Date.now();
      if (currentTime - lastKeyTime > 120) {
        buffer = '';
      }
      lastKeyTime = currentTime;

      if (e.key === 'Enter') {
        if (buffer.length > 2) {
          handleProcessScannedCode(buffer.trim());
          buffer = '';
        }
      } else if (e.key.length === 1) {
        buffer += e.key;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, assets, accessories, consumables, events, continuousMode]);

  // Handle item matching logic
  const handleProcessScannedCode = (rawText: string) => {
    const cleaned = rawText.trim();
    if (!cleaned) return;

    let searchKey = cleaned;
    // Handle JSON payload if scanned
    if (cleaned.startsWith('{') && cleaned.endsWith('}')) {
      try {
        const parsed = JSON.parse(cleaned);
        if (parsed.tag) searchKey = parsed.tag;
      } catch {
        // use raw
      }
    }
    // Handle URL payload if scanned (e.g. #item=ACIPL-2024-001)
    if (searchKey.includes('#item=')) {
      searchKey = decodeURIComponent(searchKey.split('#item=')[1] || searchKey);
    }

    const lowerKey = searchKey.toLowerCase();

    // 1. Check Hardware Assets (by tag, serial, id, or exact name)
    const assetMatch = assets.find(
      a => a.assetTag.toLowerCase() === lowerKey || 
           a.serial.toLowerCase() === lowerKey ||
           a.id.toLowerCase() === lowerKey
    );

    if (assetMatch) {
      if (soundEnabled) playScanSound('success');
      setUnmatchedCode(null);
      setMatchedItem({ type: 'asset', item: assetMatch, rawCode: cleaned });

      // If continuous audit mode is enabled, auto-verify!
      if (continuousMode) {
        auditAsset(assetMatch.id, 'Scanned via Continuous Audit Barcode/QR Mode');
        setAuditSessionList(prev => [
          {
            tag: assetMatch.assetTag,
            name: assetMatch.name,
            type: 'Asset',
            time: new Date().toLocaleTimeString()
          },
          ...prev
        ]);
        setAuditVerifiedToast(true);
        setTimeout(() => setAuditVerifiedToast(false), 2000);
      }
      return;
    }

    // 2. Check Accessories
    const accMatch = accessories.find(
      a => a.modelNumber?.toLowerCase() === lowerKey ||
           a.name.toLowerCase().includes(lowerKey) ||
           `ACC-${a.modelNumber}`.toLowerCase() === lowerKey
    );
    if (accMatch) {
      if (soundEnabled) playScanSound('success');
      setUnmatchedCode(null);
      setMatchedItem({ type: 'accessory', item: accMatch, rawCode: cleaned });
      if (continuousMode) {
        setAuditSessionList(prev => [
          {
            tag: accMatch.modelNumber || 'ACC',
            name: accMatch.name,
            type: 'Accessory',
            time: new Date().toLocaleTimeString()
          },
          ...prev
        ]);
      }
      return;
    }

    // 3. Check Consumables
    const conMatch = consumables.find(
      c => c.modelNumber?.toLowerCase() === lowerKey ||
           c.name.toLowerCase().includes(lowerKey) ||
           `CON-${c.modelNumber}`.toLowerCase() === lowerKey
    );
    if (conMatch) {
      if (soundEnabled) playScanSound('success');
      setUnmatchedCode(null);
      setMatchedItem({ type: 'consumable', item: conMatch, rawCode: cleaned });
      if (continuousMode) {
        setAuditSessionList(prev => [
          {
            tag: conMatch.modelNumber || 'CON',
            name: conMatch.name,
            type: 'Consumable',
            time: new Date().toLocaleTimeString()
          },
          ...prev
        ]);
      }
      return;
    }

    // 4. Check Events
    const eventMatch = events.find(
      e => e.id.toLowerCase() === lowerKey || 
           e.projectCode?.toLowerCase() === lowerKey ||
           e.name.toLowerCase().includes(lowerKey)
    );
    if (eventMatch) {
      if (soundEnabled) playScanSound('success');
      setUnmatchedCode(null);
      setMatchedItem({ type: 'event', item: eventMatch, rawCode: cleaned });
      return;
    }

    // No match found
    if (soundEnabled) playScanSound('warning');
    setMatchedItem(null);
    setUnmatchedCode(cleaned);
  };

  // Start Camera
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode(qrReaderElementId);
      }

      await html5QrCodeRef.current.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        (decodedText) => {
          handleProcessScannedCode(decodedText);
        },
        () => {
          // Frame parse failure is normal while camera is moving
        }
      );
      setIsCameraActive(true);
    } catch (err: any) {
      console.warn('Camera failed to start:', err);
      setCameraError(
        err?.message || 
        'Could not access camera. Please allow camera permissions or use the Upload Photo / Manual tab.'
      );
      setIsCameraActive(false);
    }
  };

  // Stop Camera
  const stopCamera = async () => {
    if (html5QrCodeRef.current && isCameraActive) {
      try {
        await html5QrCodeRef.current.stop();
        setIsCameraActive(false);
      } catch (e) {
        console.debug('Error stopping camera', e);
      }
    }
  };

  // Life cycle for camera tab
  useEffect(() => {
    if (isOpen && activeTab === 'camera') {
      const timer = setTimeout(() => {
        startCamera();
      }, 300);
      return () => {
        clearTimeout(timer);
        stopCamera();
      };
    } else {
      stopCamera();
    }
  }, [isOpen, activeTab]);

  // Clean up when modal closes
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setMatchedItem(null);
      setUnmatchedCode(null);
    }
  }, [isOpen]);

  // File Upload scanning
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const scanner = new Html5Qrcode('file-scanner-temp-sink');
      const decodedText = await scanner.scanFile(file, true);
      handleProcessScannedCode(decodedText);
      scanner.clear();
    } catch (err: any) {
      if (soundEnabled) playScanSound('error');
      alert('Could not decode any QR or Barcode in this image. Please ensure it is well-lit and clear.');
    }
  };

  const handleVerifyAsset = () => {
    if (matchedItem && matchedItem.type === 'asset') {
      auditAsset(matchedItem.item.id, 'Physical audit verified via Barcode/QR Scanner');
      if (soundEnabled) playScanSound('success');
      setAuditVerifiedToast(true);
      setTimeout(() => setAuditVerifiedToast(false), 2500);
    }
  };

  const handleQuickCheckin = () => {
    if (matchedItem && matchedItem.type === 'asset') {
      checkinAsset(matchedItem.item.id, 'Ready to Deploy', 'Quick check-in via Barcode Scanner');
      if (soundEnabled) playScanSound('success');
      // refresh matched item
      setMatchedItem(prev => prev ? {
        ...prev,
        item: { ...prev.item, status: 'Ready to Deploy', assignedToName: null, assignedToId: null } as Asset
      } : null);
    }
  };

  if (!isOpen) return null;

  return (
    <div id="barcode-scanner-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-6">
        
        {/* Hidden temp element for file decoder */}
        <div id="file-scanner-temp-sink" className="hidden" />

        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/30 text-sky-400 flex items-center justify-center">
              <BarcodeIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base tracking-tight">Barcode & QR Code Scanner</span>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                  ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-400">Scan hardware asset tags, gate passes, or inventory labels</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Audio Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={soundEnabled ? 'Mute Scan Sound' : 'Enable Scan Sound'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-sky-400" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button 
              onClick={onClose} 
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between px-6 pt-3 pb-2 border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('camera')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'camera'
                  ? 'bg-sky-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Live Camera</span>
            </button>

            <button
              onClick={() => setActiveTab('upload')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'upload'
                  ? 'bg-sky-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Image / Photo</span>
            </button>

            <button
              onClick={() => setActiveTab('manual')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'manual'
                  ? 'bg-sky-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Manual & Hardware Wand</span>
            </button>
          </div>

          {/* Continuous Audit Mode Toggle */}
          <label className="flex items-center space-x-1.5 cursor-pointer text-slate-700 select-none">
            <input
              type="checkbox"
              checked={continuousMode}
              onChange={e => setContinuousMode(e.target.checked)}
              className="rounded text-sky-600 focus:ring-sky-500"
            />
            <span className="font-semibold text-[11px]">Continuous Audit Mode</span>
          </label>
        </div>

        {/* Scanner Viewport Content */}
        <div className="p-6 space-y-4">
          
          {/* TAB 1: LIVE CAMERA */}
          {activeTab === 'camera' && (
            <div className="space-y-3">
              <div className="relative bg-slate-950 rounded-2xl overflow-hidden aspect-video sm:aspect-4/3 flex items-center justify-center border-2 border-slate-800 shadow-inner">
                {/* HTML5 QR Camera Container */}
                <div 
                  id={qrReaderElementId} 
                  className="w-full h-full object-cover [&_video]:w-full [&_video]:h-full [&_video]:object-cover"
                />

                {/* Laser scan animation overlay */}
                {isCameraActive && (
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <div className="w-64 h-64 border-2 border-sky-400/80 rounded-2xl relative shadow-[0_0_15px_rgba(56,189,248,0.25)]">
                      {/* Corner brackets */}
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-sky-400 -mt-1 -ml-1" />
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-sky-400 -mt-1 -mr-1" />
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-sky-400 -mb-1 -ml-1" />
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-sky-400 -mb-1 -mr-1" />
                      
                      {/* Animated Red Laser Scan Line */}
                      <div className="absolute left-0 right-0 h-0.5 bg-rose-500 shadow-[0_0_8px_#f43f5e] animate-bounce duration-1000 top-1/2" />
                    </div>
                    <span className="text-[11px] font-medium text-slate-300 bg-slate-900/80 px-3 py-1 rounded-full mt-4 backdrop-blur-xs">
                      Align QR or 1D Barcode inside frame
                    </span>
                  </div>
                )}

                {/* Error Fallback */}
                {cameraError && (
                  <div className="absolute inset-0 p-6 flex flex-col items-center justify-center bg-slate-900 text-center text-white space-y-3">
                    <AlertCircle className="w-10 h-10 text-amber-400" />
                    <div className="text-sm font-bold">Camera Access Notice</div>
                    <p className="text-xs text-slate-300 max-w-sm">{cameraError}</p>
                    <div className="flex space-x-2 pt-2">
                      <button
                        onClick={startCamera}
                        className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold"
                      >
                        Try Again
                      </button>
                      <button
                        onClick={() => setActiveTab('manual')}
                        className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-semibold"
                      >
                        Use Manual Entry
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: UPLOAD IMAGE */}
          {activeTab === 'upload' && (
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-sky-500 bg-slate-50 hover:bg-sky-50/40 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all space-y-3"
              >
                <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center">
                  <Upload className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-900 block">
                    Upload Barcode or QR Image
                  </span>
                  <span className="text-xs text-slate-500">
                    Click to browse or take a photo on your mobile device
                  </span>
                </div>
                <div className="inline-block text-[11px] font-semibold text-sky-700 bg-sky-100 px-3 py-1 rounded-full">
                  Supports PNG, JPG, WEBP & Screenshots
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MANUAL & HARDWARE SCANNER */}
          {activeTab === 'manual' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Scan / Type Asset Tag or Serial Number
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={manualInput}
                    onChange={e => setManualInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        handleProcessScannedCode(manualInput);
                      }
                    }}
                    placeholder="e.g. ACIPL-2024-001 or serial..."
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent font-mono"
                  />
                  <button
                    onClick={() => handleProcessScannedCode(manualInput)}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Lookup
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  * Hardware USB/Bluetooth laser scanners automatically trigger lookup on scan.
                </p>
              </div>

              {/* Sample test tags for instant testing */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Quick-Test with Sample Inventory Tags:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {assets.slice(0, 6).map(asset => (
                    <button
                      key={asset.id}
                      onClick={() => handleProcessScannedCode(asset.assetTag)}
                      className="px-2.5 py-1 bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-300 rounded-lg text-xs font-mono font-semibold text-slate-700 hover:text-sky-700 transition-colors cursor-pointer shadow-xs"
                    >
                      {asset.assetTag}
                    </button>
                  ))}
                  {accessories[0] && (
                    <button
                      onClick={() => handleProcessScannedCode(`ACC-${accessories[0].modelNumber}`)}
                      className="px-2.5 py-1 bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-300 rounded-lg text-xs font-mono font-semibold text-slate-700 hover:text-sky-700 transition-colors cursor-pointer shadow-xs"
                    >
                      ACC-{accessories[0].modelNumber}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Toast Notification for Physical Audit Verification */}
          {auditVerifiedToast && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center space-x-2 text-xs font-semibold text-emerald-800 animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Inventory Audit Verified! Physical presence recorded in activity logs.</span>
            </div>
          )}

          {/* SCANNED RESULT CARD */}
          {matchedItem && (
            <div className="bg-white rounded-2xl border-2 border-sky-500/80 p-4 shadow-lg space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center shrink-0">
                    {matchedItem.type === 'asset' && <Laptop className="w-6 h-6" />}
                    {matchedItem.type === 'accessory' && <Keyboard className="w-6 h-6" />}
                    {matchedItem.type === 'consumable' && <Box className="w-6 h-6" />}
                    {matchedItem.type === 'event' && <Calendar className="w-6 h-6" />}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-extrabold bg-sky-100 text-sky-800 px-2 py-0.5 rounded border border-sky-200">
                        {matchedItem.type === 'asset' ? (matchedItem.item as Asset).assetTag : matchedItem.item.name}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {matchedItem.type}
                      </span>
                      {matchedItem.type === 'asset' && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-slate-100 text-slate-700">
                          {(matchedItem.item as Asset).status}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mt-0.5">{matchedItem.item.name}</h3>
                  </div>
                </div>

                <button
                  onClick={() => setMatchedItem(null)}
                  className="text-xs text-slate-400 hover:text-slate-600 underline cursor-pointer"
                >
                  Clear
                </button>
              </div>

              {/* Hardware Asset Metadata Details */}
              {matchedItem.type === 'asset' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] block font-medium">Model</span>
                    <span className="font-semibold text-slate-800">{(matchedItem.item as Asset).model}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-medium">Serial (S/N)</span>
                    <span className="font-mono font-semibold text-slate-800">{(matchedItem.item as Asset).serial || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-medium">Location</span>
                    <span className="font-semibold text-slate-800">{(matchedItem.item as Asset).location}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-medium">Assigned To</span>
                    <span className="font-semibold text-slate-800">
                      {(matchedItem.item as Asset).assignedToName || 'Unassigned'}
                    </span>
                  </div>
                </div>
              )}

              {/* Instant Action Toolbar */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {matchedItem.type === 'asset' && (
                  <>
                    {/* Audit / Verify Button */}
                    <button
                      onClick={handleVerifyAsset}
                      className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors shadow-sm cursor-pointer"
                      title="Log physical presence audit"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Audit Verify</span>
                    </button>

                    {/* Quick Check Out / In */}
                    {(matchedItem.item as Asset).status !== 'Deployed' ? (
                      <button
                        onClick={() => {
                          if (onOpenCheckout) {
                            onClose();
                            onOpenCheckout((matchedItem.item as Asset).id);
                          }
                        }}
                        className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors shadow-sm cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Check Out</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleQuickCheckin}
                        className="flex items-center space-x-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors shadow-sm cursor-pointer"
                      >
                        <LogIn className="w-4 h-4" />
                        <span>Check In</span>
                      </button>
                    )}

                    {/* View Details */}
                    {onOpenDetail && (
                      <button
                        onClick={() => {
                          onClose();
                          onOpenDetail(matchedItem.item as Asset);
                        }}
                        className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-3 py-2 rounded-xl transition-colors cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Full Dossier</span>
                      </button>
                    )}

                    {/* Print Label */}
                    {onOpenBarcodeLabel && (
                      <button
                        onClick={() => {
                          onClose();
                          onOpenBarcodeLabel(matchedItem.item as Asset);
                        }}
                        className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-3 py-2 rounded-xl transition-colors cursor-pointer"
                      >
                        <Printer className="w-4 h-4" />
                        <span>Print Sticker</span>
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Unmatched Code Notice */}
          {unmatchedCode && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between text-xs text-amber-900 animate-in fade-in">
              <div className="flex items-center space-x-2.5">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <span className="font-bold block">No Matching Item Found</span>
                  <span className="font-mono text-[11px] text-amber-700">Scanned: "{unmatchedCode}"</span>
                </div>
              </div>
              <button
                onClick={() => setUnmatchedCode(null)}
                className="text-amber-800 font-semibold hover:underline"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Continuous Audit Session History */}
          {continuousMode && auditSessionList.length > 0 && (
            <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Continuous Audit Session ({auditSessionList.length} scanned)</span>
                <button
                  onClick={() => setAuditSessionList([])}
                  className="text-[11px] text-slate-400 hover:text-slate-600"
                >
                  Clear History
                </button>
              </div>
              <div className="max-h-28 overflow-y-auto space-y-1 text-xs">
                {auditSessionList.map((entry, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-slate-200">
                    <div className="flex items-center space-x-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="font-mono font-bold text-slate-900">{entry.tag}</span>
                      <span className="text-slate-600 truncate max-w-xs">{entry.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{entry.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
