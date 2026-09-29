import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, LogOut, Laptop, UserCheck } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedAssetId?: string;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  preselectedAssetId
}) => {
  const { assets, users, checkoutAsset } = useApp();

  const deployableAssets = assets.filter(a => a.status !== 'Deployed');
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [checkoutNotes, setCheckoutNotes] = useState('');

  useEffect(() => {
    if (preselectedAssetId) {
      setSelectedAssetId(preselectedAssetId);
    } else if (deployableAssets.length > 0) {
      setSelectedAssetId(deployableAssets[0].id);
    }
    if (users.length > 0) {
      setSelectedUserId(users[0].id);
    }
  }, [preselectedAssetId, isOpen]);

  if (!isOpen) return null;

  const currentAsset = assets.find(a => a.id === selectedAssetId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssetId || !selectedUserId) return;
    checkoutAsset(selectedAssetId, selectedUserId, checkoutNotes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <LogOut className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900">Check Out Hardware Asset</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Target Asset */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Select Hardware Asset *</label>
            <select
              value={selectedAssetId}
              onChange={(e) => setSelectedAssetId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-medium"
            >
              {deployableAssets.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  [{asset.assetTag}] {asset.name} ({asset.status})
                </option>
              ))}
            </select>
          </div>

          {currentAsset && (
            <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-lg space-y-1 text-slate-600">
              <div className="flex items-center space-x-1.5 font-semibold text-blue-900">
                <Laptop className="w-4 h-4 text-blue-600" />
                <span>{currentAsset.name}</span>
              </div>
              <div className="flex justify-between text-[11px] font-mono">
                <span>Tag: {currentAsset.assetTag}</span>
                <span>Serial: {currentAsset.serial || 'N/A'}</span>
              </div>
            </div>
          )}

          {/* Target User */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Assign / Check Out To User *</label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-medium"
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.department} - {user.location})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Checkout Reason / Notes</label>
            <textarea
              rows={2}
              value={checkoutNotes}
              onChange={(e) => setCheckoutNotes(e.target.value)}
              placeholder="e.g. Onboarding hardware issuance, workstation upgrade..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm cursor-pointer"
            >
              Confirm Checkout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
