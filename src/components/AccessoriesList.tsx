import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Accessory } from '../types';
import { Keyboard, LogOut, LogIn, AlertTriangle, CheckCircle2, Plus } from 'lucide-react';

interface AccessoriesListProps {
  onOpenCheckoutModal: (accessory: Accessory) => void;
  onOpenCheckinModal: (accessory: Accessory) => void;
}

export const AccessoriesList: React.FC<AccessoriesListProps> = ({
  onOpenCheckoutModal,
  onOpenCheckinModal,
}) => {
  const { accessories } = useApp();

  return (
    <div id="accessories-list-view" className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <Keyboard className="w-6 h-6 text-emerald-600" />
            <span>Hardware Accessories</span>
          </h1>
          <p className="text-sm text-slate-500">Track shared peripherals, keyboards, mice, docks, and headsets.</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Accessory Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Model No.</th>
                <th className="px-4 py-3 text-center">Total Stock</th>
                <th className="px-4 py-3 text-center">Remaining</th>
                <th className="px-4 py-3">Stock Level</th>
                <th className="px-4 py-3">Storage Location</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {accessories.map((item) => {
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
                            <AlertTriangle className="w-3 h-3 mr-0.5" /> Low
                          </span>
                        ) : (
                          <span className="text-[11px] text-emerald-600 font-medium flex items-center">
                            <CheckCircle2 className="w-3 h-3 mr-0.5" /> OK
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {item.location}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          disabled={item.remainingQuantity <= 0}
                          onClick={() => onOpenCheckoutModal(item)}
                          className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                            item.remainingQuantity > 0
                              ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Check Out</span>
                        </button>
                        <button
                          disabled={item.remainingQuantity >= item.totalQuantity}
                          onClick={() => onOpenCheckinModal(item)}
                          className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                            item.remainingQuantity < item.totalQuantity
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          <LogIn className="w-3.5 h-3.5" />
                          <span>Check In</span>
                        </button>
                      </div>
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
