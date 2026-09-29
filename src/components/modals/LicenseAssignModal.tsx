import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { License } from '../../types';
import { X, KeyRound, UserCheck } from 'lucide-react';

interface LicenseAssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  license: License | null;
}

export const LicenseAssignModal: React.FC<LicenseAssignModalProps> = ({
  isOpen,
  onClose,
  license,
}) => {
  const { users, assignLicense } = useApp();
  const [selectedUserId, setSelectedUserId] = useState('');

  if (!isOpen || !license) return null;

  const unassignedUsers = users.filter(u => !license.assignedUserIds.includes(u.id));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetUser = selectedUserId || (unassignedUsers.length > 0 ? unassignedUsers[0].id : '');
    if (!targetUser) return;
    assignLicense(license.id, targetUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <KeyRound className="w-5 h-5 text-purple-600" />
            <h3 className="font-bold text-slate-900">Assign License Seat</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          <div className="p-3 bg-purple-50/60 border border-purple-100 rounded-lg">
            <h4 className="font-bold text-purple-900 text-sm">{license.name}</h4>
            <div className="flex justify-between text-slate-600 mt-1 font-mono text-[11px]">
              <span>Key: {license.key}</span>
              <span>
                Available Seats: <strong>{license.totalSeats - license.assignedUserIds.length}</strong> / {license.totalSeats}
              </span>
            </div>
          </div>

          {unassignedUsers.length === 0 ? (
            <div className="text-center py-4 text-slate-500">
              All registered users currently possess a seat for this license.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select User to Assign Seat *</label>
                <select
                  value={selectedUserId || unassignedUsers[0]?.id}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white font-medium"
                >
                  {unassignedUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.department} - {user.location})
                    </option>
                  ))}
                </select>
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
                  className="px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors shadow-sm cursor-pointer"
                >
                  Assign Seat
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
