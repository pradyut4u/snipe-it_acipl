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
  const [category, setCategory] = useState('RB 4011');
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
      setCategory('RB 4011');
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
                <option value="RB 4011">RB 4011</option>
                <option value="Tp-Link POE switch Managed">Tp-Link POE switch Managed</option>
                <option value="Tplink POE switch Unmanaged">Tplink POE switch Unmanaged</option>
                <option value="Tp-Link switch Omada">Tp-Link switch Omada</option>
                <option value="Tp-Link switch 16 Port">Tp-Link switch 16 Port</option>
                <option value="Tp-Link OLT">Tp-Link OLT</option>
                <option value="Mikrotik CCR 2004">Mikrotik CCR 2004</option>
                <option value="Mikrotik CCR 1009">Mikrotik CCR 1009</option>
                <option value="Cisco switch 24 Port">Cisco switch 24 Port</option>
                <option value="Tp-Link Router 1200 C6">Tp-Link Router 1200 C6</option>
                <option value="Tp-Link Router AX1500">Tp-Link Router AX1500</option>
                <option value="Tp-Link Router 1800">Tp-Link Router 1800</option>
                <option value="Tp-Link ONU">Tp-Link ONU</option>
                <option value="Tp-Link AP 660 Omada">Tp-Link AP 660 Omada</option>
                <option value="Tp-Link AP 670 Omada">Tp-Link AP 670 Omada</option>
                <option value="Tp-Link 1200 ONT">Tp-Link 1200 ONT</option>
                <option value="Tp-Link 3000 ONT">Tp-Link 3000 ONT</option>
                <option value="Cisco AP C9115AXI-D">Cisco AP C9115AXI-D</option>
                <option value="Cisco AP 3802I-D-K9">Cisco AP 3802I-D-K9</option>
                <option value="Ruckus 750/650">Ruckus 750/650</option>
                <option value="Cisco Switch 8 Port">Cisco Switch 8 Port</option>
                <option value="Cisco Switch 24/28/48 Port">Cisco Switch 24/28/48 Port</option>
                <option value="SFP 1G/10G/Copper">SFP 1G/10G/Copper</option>
                <option value="Telephone">Telephone</option>
                <option value="VGA Splitter 2Port">VGA Splitter 2Port</option>
                <option value="VGA Splitter 8Port">VGA Splitter 8Port</option>
                <option value="HDTV Splitter 2/4 Port">HDTV Splitter 2/4 Port</option>
                <option value="Tplink Gigabit switch SG108E">Tplink Gigabit switch SG108E</option>
                <option value="Tplink Switch 24 Port SG1024D">Tplink Switch 24 Port SG1024D</option>
                <option value="Tplink Switch 16 Port SG1016D">Tplink Switch 16 Port SG1016D</option>
                <option value="Lan Tester">Lan Tester</option>
                <option value="Mini UPS">Mini UPS</option>
                <option value="POE Injector">POE Injector</option>
                <option value="Brother Printer">Brother Printer</option>
                <option value="LED LG/Zebster">LED LG/Zebster</option>
                <option value="Fiber Machine">Fiber Machine</option>
                <option value="UPS">UPS</option>
                <option value="Location ONT">Location ONT</option>
                <option value="Laptop">Laptop</option>
                <option value="Laser">Laser</option>
                <option value="Dell Power supply">Dell Power supply</option>
                <option value="Printer">Printer</option>
                <option value="Mini PC">Mini PC</option>
                <option value="Cisco/HP/Unifi/Ruckus AP">Cisco/HP/Unifi/Ruckus AP</option>
                <option value="Cisco server">Cisco server</option>
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
