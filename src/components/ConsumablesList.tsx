import React from 'react';
import { useApp } from '../context/AppContext';
import { Consumable } from '../types';
import { Box, LogOut, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ConsumablesListProps {
  onOpenConsumeModal: (consumable: Consumable) => void;
}

export const ConsumablesList: React.FC<ConsumablesListProps> = ({ onOpenConsumeModal }) => {
  const { consumables } = useApp();

  return (
    <div id="consumables-list-view" className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <Box className="w-6 h-6 text-amber-600" />
            <span>Consumable Supplies</span>
          </h1>
          <p className="text-sm text-slate-500">Track printer toners, cables, batteries, and single-use supplies.</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Consumable Item</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Part / Model No.</th>
                <th className="px-4 py-3 text-center">Total Capacity</th>
                <th className="px-4 py-3 text-center">Remaining Stock</th>
                <th className="px-4 py-3">Inventory Status</th>
                <th className="px-4 py-3">Supply Room Location</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {consumables.map((item) => {
                const isLow = item.remainingQuantity <= item.minQuantity;
                const pct = Math.round((item.remainingQuantity / item.totalQuantity) * 100);

                return (
                  <tr key={item.id} className="hover:bg-slate-50/75 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {item.name}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-600 whitespace-nowrap">
                      {item.category}
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {item.modelNumber}
                    </td>
                    <td className="px-4 py-3 text-center font-mono font-medium text-slate-700">
                      {item.totalQuantity}
                    </td>
                    <td className="px-4 py-3 text-center font-mono font-bold text-slate-900">
                      {item.remainingQuantity}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap min-w-[140px]">
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-2 rounded-full ${isLow ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        {isLow ? (
                          <span className="text-[11px] font-semibold text-amber-600 flex items-center">
                            <AlertTriangle className="w-3 h-3 mr-0.5" /> Reorder Needed
                          </span>
                        ) : (
                          <span className="text-[11px] text-emerald-600 font-medium flex items-center">
                            <CheckCircle2 className="w-3 h-3 mr-0.5" /> In Stock
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {item.location}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        disabled={item.remainingQuantity <= 0}
                        onClick={() => onOpenConsumeModal(item)}
                        className={`inline-flex items-center space-x-1 px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                          item.remainingQuantity > 0
                            ? 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Issue / Consume</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
