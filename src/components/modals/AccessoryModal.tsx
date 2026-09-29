import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Accessory } from '../../types';
import { X, Keyboard, LogOut, LogIn } from 'lucide-react';

interface AccessoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  accessory: Accessory | null;
  mode: 'checkout' | 'checkin';
}

export const AccessoryModal: React.FC<AccessoryModalProps> = ({
  isOpen,
  onClose,
  accessory,
  mode,
}) => {
  const { users, checkoutAccessory, checkinAccessory } = useApp();
  const [selectedUserId, setSelectedUserId] = useState('');
  const [quantity, setQuantity] = useState<number>(1);

  if (!isOpen || !accessory) return null;

  const maxQty = mode === 'checkout' ? accessory.remainingQuantity : (accessory.totalQuantity - accessory.remainingQuantity);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0) return;

    if (mode === 'checkout') {
      const targetUser = selectedUserId || users[0]?.id;
      if (!targetUser) return;
      checkoutAccessory(accessory.id, targetUser, quantity);
    } else {
      checkinAccessory(accessory.id, quantity);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            {mode === 'checkout' ? (
              <LogOut className="w-5 h-5 text-blue-600" />
            ) : (
              <LogIn className="w-5 h-5 text-emerald-600" />
            )}
            <h3 className="font-bold text-slate-900">
              {mode === 'checkout' ? 'Check Out Accessory' : 'Check In Accessory'}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <h4 className="font-bold text-slate-900 text-sm">{accessory.name}</h4>
            <div className="flex justify-between text-slate-500 mt-1 font-mono text-[11px]">
              <span>Model: {accessory.modelNumber}</span>
              <span>Available: {accessory.remainingQuantity} / {accessory.totalQuantity}</span>
            </div>
          </div>

          {mode === 'checkout' && (
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Issue To User *</label>
              <select
                value={selectedUserId || users[0]?.id}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-medium"
              >
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.department})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Quantity to {mode === 'checkout' ? 'Check Out' : 'Check In'} (Max: {maxQty}) *
            </label>
            <input
              type="number"
              min="1"
              max={maxQty}
              value={quantity}
              onChange={(e) => setQuantity(Math.min(maxQty, Math.max(1, parseInt(e.target.value) || 1)))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none"
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
              className={`px-4 py-2 text-xs font-semibold text-white rounded-lg transition-colors shadow-sm cursor-pointer ${
                mode === 'checkout'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {mode === 'checkout' ? 'Confirm Checkout' : 'Confirm Return'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
