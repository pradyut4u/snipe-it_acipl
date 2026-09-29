import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Consumable } from '../../types';
import { X, Box, LogOut } from 'lucide-react';

interface ConsumableModalProps {
  isOpen: boolean;
  onClose: () => void;
  consumable: Consumable | null;
}

export const ConsumableModal: React.FC<ConsumableModalProps> = ({
  isOpen,
  onClose,
  consumable,
}) => {
  const { users, consumeConsumable } = useApp();
  const [selectedUserId, setSelectedUserId] = useState('');
  const [quantity, setQuantity] = useState<number>(1);

  if (!isOpen || !consumable) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0) return;
    const targetUser = selectedUserId || users[0]?.id;
    consumeConsumable(consumable.id, targetUser, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <Box className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-slate-900">Issue / Consume Supply Item</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="p-3 bg-amber-50/60 border border-amber-100 rounded-lg">
            <h4 className="font-bold text-amber-900 text-sm">{consumable.name}</h4>
            <div className="flex justify-between text-slate-600 mt-1 font-mono text-[11px]">
              <span>Part: {consumable.modelNumber}</span>
              <span>Available in Stock: <strong>{consumable.remainingQuantity}</strong></span>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Issue / Assign To Employee *</label>
            <select
              value={selectedUserId || users[0]?.id}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white font-medium"
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.department})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Quantity to Dispatch (Max: {consumable.remainingQuantity}) *
            </label>
            <input
              type="number"
              min="1"
              max={consumable.remainingQuantity}
              value={quantity}
              onChange={(e) => setQuantity(Math.min(consumable.remainingQuantity, Math.max(1, parseInt(e.target.value) || 1)))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
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
              className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors shadow-sm cursor-pointer"
            >
              Confirm Dispatch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
