import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { History, Filter, Download, FileText, Table } from 'lucide-react';
import { ActionType } from '../types';
import { exportAuditLogsToPDF, exportAuditLogsToCSV } from '../utils/exportUtils';

export const ActivityLogs: React.FC = () => {
  const { activityLogs } = useApp();
  const [actionFilter, setActionFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');

  const filteredLogs = activityLogs.filter(log => {
    if (actionFilter !== 'All' && log.action !== actionFilter) return false;
    if (typeFilter !== 'All' && log.itemType !== typeFilter) return false;
    return true;
  });

  const actionBadge = (action: ActionType) => {
    const map: Record<ActionType, { bg: string; text: string }> = {
      checkout: { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700' },
      checkin: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700' },
      create: { bg: 'bg-indigo-50 border-indigo-200', text: 'text-indigo-700' },
      update: { bg: 'bg-slate-100 border-slate-300', text: 'text-slate-700' },
      delete: { bg: 'bg-rose-50 border-rose-200', text: 'text-rose-700' },
      consume: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-800' },
      audit: { bg: 'bg-purple-50 border-purple-200', text: 'text-purple-700' },
      login: { bg: 'bg-teal-50 border-teal-200', text: 'text-teal-700' },
      logout: { bg: 'bg-slate-100 border-slate-300', text: 'text-slate-600' }
    };
    const style = map[action] || { bg: 'bg-slate-100 border-slate-200', text: 'text-slate-700' };
    return (
      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider border ${style.bg} ${style.text}`}>
        {action}
      </span>
    );
  };

  return (
    <div id="activity-logs-view" className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <History className="w-6 h-6 text-sky-600" />
            <span>Activity History & Audit Logs</span>
          </h1>
          <p className="text-sm text-slate-500">Immutable chronological record of all asset changes, checkouts, and system events.</p>
        </div>
        <div className="flex items-center space-x-2">
          {/* Export PDF */}
          <button
            id="export-audit-pdf-btn"
            onClick={() => exportAuditLogsToPDF(filteredLogs)}
            className="inline-flex items-center space-x-1.5 bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-300 hover:border-rose-300 text-xs font-medium px-3 py-2 rounded-lg transition-colors shadow-xs cursor-pointer"
            title="Export filtered audit logs to PDF"
          >
            <FileText className="w-3.5 h-3.5 text-rose-600" />
            <span>Export PDF</span>
          </button>

          {/* Export CSV */}
          <button
            id="export-audit-csv-btn"
            onClick={() => exportAuditLogsToCSV(filteredLogs)}
            className="inline-flex items-center space-x-1.5 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-300 hover:border-emerald-300 text-xs font-medium px-3 py-2 rounded-lg transition-colors shadow-xs cursor-pointer"
            title="Export filtered audit logs to CSV"
          >
            <Table className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center space-x-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-500">Action:</span>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 text-slate-700 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="All">All Actions</option>
            <option value="checkout">Check Out</option>
            <option value="checkin">Check In</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
            <option value="consume">Consume</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <span className="font-semibold text-slate-500">Item Type:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 text-slate-700 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="All">All Types</option>
            <option value="asset">Hardware Asset</option>
            <option value="license">License</option>
            <option value="accessory">Accessory</option>
            <option value="consumable">Consumable</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Item / Target</th>
                <th className="px-4 py-3">Recipient / User</th>
                <th className="px-4 py-3">Admin</th>
                <th className="px-4 py-3">Notes / Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                    No activity logs recorded.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/75 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap font-mono text-[11px] text-slate-500">
                      {log.timestamp}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {actionBadge(log.action)}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      <span className="text-slate-400 uppercase text-[10px] mr-1.5 font-bold">[{log.itemType}]</span>
                      {log.itemName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {log.targetUserName ? (
                        <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-xs">
                          {log.targetUserName}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-500">
                      {log.adminName}
                    </td>
                    <td className="px-4 py-3 text-slate-600 max-w-xs truncate">
                      {log.notes || '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
