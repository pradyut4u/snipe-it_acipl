import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Asset, AssetStatus } from '../../types';
import { X, Laptop } from 'lucide-react';

interface AssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  assetToEdit?: Asset | null;
}

export const AssetModal: React.FC<AssetModalProps> = ({ isOpen, onClose, assetToEdit }) => {
  const { addAsset, updateAsset, assets } = useApp();

  const [assetTag, setAssetTag] = useState('');
  const [name, setName] = useState('');
  const [model, setModel] = useState('');
  const [category, setCategory] = useState('Router');
  const [serial, setSerial] = useState('');
  const [status, setStatus] = useState<AssetStatus>('Ready to Deploy');
  const [purchaseCost, setPurchaseCost] = useState<number>(1200);
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (assetToEdit) {
      setAssetTag(assetToEdit.assetTag);
      setName(assetToEdit.name);
      setModel(assetToEdit.model);
      setCategory(assetToEdit.category);
      setSerial(assetToEdit.serial);
      setStatus(assetToEdit.status);
      setPurchaseCost(assetToEdit.purchaseCost || 0);
      setPurchaseDate(assetToEdit.purchaseDate);
      setNotes(assetToEdit.notes || '');
    } else {
      // Auto-generate next asset tag
      const nextNum = 100 + assets.length + 1;
      setAssetTag(`AST-00${nextNum}`);
      setName('');
      setModel('');
      setCategory('Router');
      setSerial('');
      setStatus('Ready to Deploy');
      setPurchaseCost(1500);
      setPurchaseDate(new Date().toISOString().slice(0, 10));
      setNotes('');
    }
  }, [assetToEdit, isOpen, assets.length]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !assetTag.trim()) return;

    if (assetToEdit) {
      updateAsset(assetToEdit.id, {
        assetTag,
        name,
        model,
        category,
        serial,
        status,
        purchaseCost: Number(purchaseCost),
        purchaseDate,
        notes,
      });
    } else {
      addAsset({
        assetTag,
        name,
        model,
        category,
        serial,
        status,
        purchaseCost: Number(purchaseCost),
        purchaseDate,
        notes,
        assignedToId: null,
        assignedToName: null,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <Laptop className="w-5 h-5 text-sky-600" />
            <h3 className="font-bold text-slate-900">
              {assetToEdit ? 'Edit Asset' : 'Create New Hardware Asset'}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Asset Tag *</label>
              <input
                type="text"
                required
                value={assetTag}
                onChange={(e) => setAssetTag(e.target.value)}
                placeholder="AST-00109"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Serial Number</label>
              <input
                type="text"
                value={serial}
                onChange={(e) => setSerial(e.target.value)}
                placeholder="C02FX40AMD6R"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Asset Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="MacBook Pro 16&quot; M3 Max"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Model Description</label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="Apple MacBook Pro 16&quot; 2023"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"
              >
                <option value="Router">Router</option>
                <option value="Managed PoE Switch">Managed PoE Switch</option>
                <option value="Unmanaged PoE Switch">Unmanaged PoE Switch</option>
                <option value="Switch">Switch</option>
                <option value="OLT">OLT</option>
                <option value="Dual Band Router">Dual Band Router</option>
                <option value="ONU">ONU</option>
                <option value="Access Point">Access Point</option>
                <option value="ONT">ONT</option>
                <option value="SFP / Transceiver">SFP / Transceiver</option>
                <option value="Telephone">Telephone</option>
                <option value="VGA Splitter">VGA Splitter</option>
                <option value="Video Splitter">Video Splitter</option>
                <option value="Network Cable Tester">Network Cable Tester</option>
                <option value="UPS">UPS</option>
                <option value="PoE Injector">PoE Injector</option>
                <option value="Printer">Printer</option>
                <option value="Display / Monitor">Display / Monitor</option>
                <option value="Fiber Equipment">Fiber Equipment</option>
                <option value="Laptop">Laptop</option>
                <option value="Tool">Tool</option>
                <option value="Power Supply">Power Supply</option>
                <option value="Mini PC">Mini PC</option>
                <option value="Server">Server</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as AssetStatus)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"
              >
                <option value="Ready to Deploy">Ready to Deploy</option>
                <option value="Deployed">Deployed</option>
                <option value="Pending">Pending</option>
                <option value="In Repair">In Repair</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Purchase Date</label>
              <input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Purchase Cost (USD)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={purchaseCost}
                onChange={(e) => setPurchaseCost(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Administrative Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Provisioning details, MDM profile, warranties, etc."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
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
              className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors shadow-sm cursor-pointer"
            >
              {assetToEdit ? 'Save Changes' : 'Create Asset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
