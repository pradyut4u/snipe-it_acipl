import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { AssetStatus } from '../../types';
import { X, LogIn, Laptop, AlertCircle } from 'lucide-react';

interface CheckinModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedAssetId?: string;
}

export const CheckinModal: React.FC<CheckinModalProps> = ({
  isOpen,
  onClose,
  preselectedAssetId
}) => {
  const { assets, checkinAsset } = useApp();

  const deployedAssets = assets.filter(a => a.status === 'Deployed');
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [returnStatus, setReturnStatus] = useState<AssetStatus>('Ready to Deploy');
  const [checkinNotes, setCheckinNotes] = useState('');

  useEffect(() => {
    if (preselectedAssetId) {
      setSelectedAssetId(preselectedAssetId);
    } else if (deployedAssets.length > 0) {
      setSelectedAssetId(deployedAssets[0].id);
    }
  }, [preselectedAssetId, isOpen]);

  if (!isOpen) return null;

  const currentAsset = assets.find(a => a.id === selectedAssetId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssetId) return;
    checkinAsset(selectedAssetId, returnStatus, checkinNotes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <LogIn className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900">Check In Hardware Asset</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {deployedAssets.length === 0 ? (
          <div className="p-6 text-center space-y-3">
            <p className="text-xs text-slate-500">There are currently no deployed assets checked out to users.</p>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {/* Target Asset */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Select Deployed Asset *</label>
              <select
                value={selectedAssetId}
                onChange={(e) => setSelectedAssetId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium"
              >
                {deployedAssets.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    [{asset.assetTag}] {asset.name} (Assigned to: {asset.assignedToName})
                  </option>
                ))}
              </select>
            </div>

            {currentAsset && (
              <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-lg space-y-1 text-slate-600">
                <div className="flex items-center space-x-1.5 font-semibold text-emerald-900">
                  <Laptop className="w-4 h-4 text-emerald-600" />
                  <span>{currentAsset.name}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span>Tag: <strong className="font-mono">{currentAsset.assetTag}</strong></span>
                  <span>Currently with: <strong className="text-slate-800">{currentAsset.assignedToName}</strong></span>
                </div>
              </div>
            )}

            {/* Return Status */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Set Inventory Status Upon Return *</label>
              <select
                value={returnStatus}
                onChange={(e) => setReturnStatus(e.target.value as AssetStatus)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium"
              >
                <option value="Ready to Deploy">Ready to Deploy (Cleaned & Stocked)</option>
                <option value="In Repair">In Repair (Requires Maintenance / Service)</option>
                <option value="Pending">Pending (Re-imaging / Sanitization Needed)</option>
                <option value="Archived">Archived (Decommissioned / EOL)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Checkin Notes / Device Condition</label>
              <textarea
                rows={2}
                value={checkinNotes}
                onChange={(e) => setCheckinNotes(e.target.value)}
                placeholder="Hardware returned in good condition, charger included..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-sm cursor-pointer"
              >
                Confirm Checkin
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
