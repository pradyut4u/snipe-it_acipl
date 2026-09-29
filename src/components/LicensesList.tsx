import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { License } from '../types';
import { KeyRound, UserCheck, UserMinus, Plus, ShieldCheck, Calendar, DollarSign } from 'lucide-react';

interface LicensesListProps {
  onOpenAssignModal: (license: License) => void;
}

export const LicensesList: React.FC<LicensesListProps> = ({ onOpenAssignModal }) => {
  const { licenses, users, revokeLicense } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(licenses.map(l => l.category)))];

  const filtered = licenses.filter(lic => {
    if (selectedCategory !== 'All' && lic.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div id="licenses-list-view" className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <KeyRound className="w-6 h-6 text-purple-600" />
            <span>Software Licenses</span>
          </h1>
          <p className="text-sm text-slate-500">Track corporate software subscriptions, seat assignments, and renewals.</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center space-x-2 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Category:</span>
        <div className="flex items-center space-x-1.5 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Licenses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((lic) => {
          const used = lic.assignedUserIds.length;
          const remaining = lic.totalSeats - used;
          const pct = Math.round((used / lic.totalSeats) * 100);

          return (
            <div key={lic.id} className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between hover:border-slate-300 transition-all">
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 uppercase tracking-wider">
                      {lic.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1.5">{lic.name}</h3>
                    <p className="text-xs text-slate-500">Mfg: {lic.manufacturer}</p>
                  </div>
                  <button
                    disabled={remaining <= 0}
                    onClick={() => onOpenAssignModal(lic)}
                    className={`inline-flex items-center space-x-1 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      remaining > 0
                        ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Assign Seat</span>
                  </button>
                </div>

                {/* Seats progress */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-slate-700">Seat Utilization ({pct}%)</span>
                    <span className="text-slate-500 font-mono">{used} used / {lic.totalSeats} total ({remaining} left)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full transition-all ${
                        pct > 90 ? 'bg-amber-500' : 'bg-purple-600'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Assigned Users list */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="text-xs font-semibold text-slate-600 mb-2 flex items-center justify-between">
                    <span>Assigned Seats ({used})</span>
                    <span className="font-normal text-[11px] text-slate-400">Click to revoke</span>
                  </div>
                  {lic.assignedUserIds.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No seats currently assigned.</p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {lic.assignedUserIds.map((uid) => {
                        const user = users.find(u => u.id === uid);
                        return (
                          <div
                            key={uid}
                            className="inline-flex items-center space-x-1.5 bg-slate-50 border border-slate-200 text-slate-700 text-xs px-2.5 py-1 rounded-md"
                          >
                            <UserCheck className="w-3 h-3 text-purple-600" />
                            <span className="font-medium">{user ? user.name : uid}</span>
                            <button
                              onClick={() => revokeLicense(lic.id, uid)}
                              title="Revoke seat"
                              className="text-slate-400 hover:text-rose-600 cursor-pointer ml-1"
                            >
                              <UserMinus className="w-3 h-3" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer info */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  Renews: {lic.expirationDate}
                </span>
                <span className="flex items-center font-mono text-slate-700 font-medium">
                  <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                  ${lic.purchaseCost.toLocaleString()}/yr
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
