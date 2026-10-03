import React from 'react';
import { useApp } from '../../context/AppContext';
import { Asset } from '../../types';
import { X, Laptop, User, Calendar, DollarSign, MapPin, Tag, Hash, LogOut, LogIn, Clock, QrCode, Printer } from 'lucide-react';

interface AssetDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: Asset | null;
  onOpenCheckout: (assetId: string) => void;
  onOpenCheckin: (assetId: string) => void;
  onOpenBarcodeLabel?: (asset: Asset) => void;
}

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({
  isOpen,
  onClose,
  asset,
  onOpenCheckout,
  onOpenCheckin,
  onOpenBarcodeLabel,
}) => {
  const { activityLogs } = useApp();

  if (!isOpen || !asset) return null;

  // Filter logs for this asset
  const assetLogs = activityLogs.filter(
    log => log.itemId === asset.id || log.itemName.includes(asset.assetTag)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100">
              <Laptop className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-sky-700 bg-sky-100/70 px-2 py-0.5 rounded border border-sky-200">
                  {asset.assetTag}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                  {asset.status}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-1">{asset.name}</h3>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-xs text-slate-600">
          {/* Main Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-slate-50/80 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-400 block text-[11px] mb-0.5 font-medium">Model</span>
              <span className="font-semibold text-slate-900">{asset.model || 'Standard'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] mb-0.5 font-medium">Category</span>
              <span className="font-semibold text-slate-900">{asset.category}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] mb-0.5 font-medium">Serial Number</span>
              <span className="font-mono text-slate-900 font-semibold">{asset.serial || '—'}</span>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px] mb-0.5 font-medium">Purchase Date</span>
              <span className="font-semibold text-slate-900 flex items-center">
                <Calendar className="w-3 h-3 mr-1 text-slate-400" />
                {asset.purchaseDate}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] mb-0.5 font-medium">Purchase Cost</span>
              <span className="font-semibold text-slate-900 font-mono">
                ${asset.purchaseCost ? asset.purchaseCost.toLocaleString() : '0.00'}
              </span>
            </div>
          </div>

          {/* Assigned User Status */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white">
            <h4 className="font-semibold text-slate-900 mb-2 flex items-center">
              <User className="w-4 h-4 mr-1.5 text-blue-600" />
              Current Assignment
            </h4>
            {asset.assignedToName ? (
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-bold text-slate-900">{asset.assignedToName}</span>
                  <p className="text-xs text-slate-500 mt-0.5">Asset currently deployed and operational in the field.</p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenCheckin(asset.id);
                  }}
                  className="flex items-center space-x-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Check In</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold text-slate-500 italic">Not checked out to any user</span>
                  <p className="text-xs text-slate-400 mt-0.5">Ready to be assigned to an employee.</p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenCheckout(asset.id);
                  }}
                  className="flex items-center space-x-1 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Check Out</span>
                </button>
              </div>
            )}
          </div>

          {/* Notes */}
          {asset.notes && (
            <div className="p-3 bg-amber-50/50 border border-amber-200/80 rounded-lg text-xs">
              <span className="font-semibold text-amber-900 block mb-1">Administrative Notes:</span>
              <p className="text-amber-800">{asset.notes}</p>
            </div>
          )}

          {/* Audit History Timeline */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
              <Clock className="w-4 h-4 mr-1.5 text-slate-500" />
              Audit Log History for {asset.assetTag}
            </h4>
            {assetLogs.length === 0 ? (
              <p className="text-slate-400 italic">No specific history recorded for this asset yet.</p>
            ) : (
              <div className="space-y-2 border-l-2 border-slate-200 pl-4 ml-2">
                {assetLogs.map((log) => (
                  <div key={log.id} className="relative pb-2">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-sky-500 ring-4 ring-white" />
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-slate-900 uppercase text-[10px] bg-slate-100 px-2 py-0.5 rounded">
                        {log.action}
                      </span>
                      <span className="font-mono text-slate-400 text-[11px]">{log.timestamp}</span>
                    </div>
                    <p className="text-slate-700 mt-1">
                      {log.targetUserName ? `Issued to ${log.targetUserName}. ` : ''}
                      {log.notes || 'Action performed'}
                    </p>
                    <span className="text-[10px] text-slate-400">By {log.adminName}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            {onOpenBarcodeLabel && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenBarcodeLabel(asset);
                }}
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 hover:text-sky-600 rounded-lg shadow-xs transition-colors cursor-pointer"
                title="Generate Barcode / QR Code Sticker"
              >
                <QrCode className="w-3.5 h-3.5 text-sky-600" />
                <span>Print Barcode & QR Label</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
