import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  exportAssetsToPDF, 
  exportAssetsToCSV, 
  exportAuditLogsToPDF, 
  exportAuditLogsToCSV, 
  exportComprehensiveReportPDF, 
  exportComprehensiveReportCSV,
  exportEventsToPDF,
  exportEventsToCSV
} from '../../utils/exportUtils';
import { X, Download, FileText, Table, Check, Layers, Laptop, History, HardDrive, Calendar } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDataset?: 'assets' | 'all' | 'activity' | 'events';
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  defaultDataset = 'assets'
}) => {
  const { assets, licenses, accessories, consumables, events, activityLogs, exportDataJson } = useApp();
  
  const [selectedDataset, setSelectedDataset] = useState<'assets' | 'all' | 'activity' | 'events'>(defaultDataset);
  const [format, setFormat] = useState<'pdf' | 'csv' | 'json'>('pdf');
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleExport = () => {
    setIsExporting(true);
    try {
      if (format === 'json') {
        exportDataJson();
      } else if (selectedDataset === 'assets') {
        if (format === 'pdf') {
          exportAssetsToPDF(assets);
        } else {
          exportAssetsToCSV(assets);
        }
      } else if (selectedDataset === 'events') {
        if (format === 'pdf') {
          exportEventsToPDF(events, assets);
        } else {
          exportEventsToCSV(events, assets);
        }
      } else if (selectedDataset === 'all') {
        if (format === 'pdf') {
          exportComprehensiveReportPDF(assets, licenses, accessories, consumables);
        } else {
          exportComprehensiveReportCSV(assets, licenses, accessories, consumables);
        }
      } else if (selectedDataset === 'activity') {
        if (format === 'pdf') {
          exportAuditLogsToPDF(activityLogs);
        } else {
          exportAuditLogsToCSV(activityLogs);
        }
      }
    } finally {
      setTimeout(() => {
        setIsExporting(false);
        onClose();
      }, 300);
    }
  };

  const getDatasetCount = () => {
    switch (selectedDataset) {
      case 'assets':
        return `${assets.length} hardware assets`;
      case 'events':
        return `${events.length} event manifests and dispatch records`;
      case 'all':
        return `${assets.length} assets, ${licenses.length} licenses, ${accessories.length} accessories, ${consumables.length} consumables`;
      case 'activity':
        return `${activityLogs.length} audit log entries`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Export Data & Reports</h3>
              <p className="text-[11px] text-slate-500">ACIPL/IPNET Inventory Management System</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs">
          {/* Step 1: Choose Dataset */}
          <div>
            <label className="block font-semibold text-slate-700 mb-2">1. Select Data Collection</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedDataset('assets')}
                className={`p-3 rounded-lg border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  selectedDataset === 'assets'
                    ? 'border-sky-500 bg-sky-50/50 ring-2 ring-sky-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Laptop className={`w-4 h-4 ${selectedDataset === 'assets' ? 'text-sky-600' : 'text-slate-400'}`} />
                  {selectedDataset === 'assets' && <Check className="w-3.5 h-3.5 text-sky-600" />}
                </div>
                <div className="mt-2">
                  <div className="font-semibold text-slate-900">Hardware</div>
                  <div className="text-[11px] text-slate-500">{assets.length} items</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedDataset('events')}
                className={`p-3 rounded-lg border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  selectedDataset === 'events'
                    ? 'border-sky-500 bg-sky-50/50 ring-2 ring-sky-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Calendar className={`w-4 h-4 ${selectedDataset === 'events' ? 'text-sky-600' : 'text-slate-400'}`} />
                  {selectedDataset === 'events' && <Check className="w-3.5 h-3.5 text-sky-600" />}
                </div>
                <div className="mt-2">
                  <div className="font-semibold text-slate-900">Events</div>
                  <div className="text-[11px] text-slate-500">{events.length} manifests</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedDataset('all')}
                className={`p-3 rounded-lg border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  selectedDataset === 'all'
                    ? 'border-sky-500 bg-sky-50/50 ring-2 ring-sky-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Layers className={`w-4 h-4 ${selectedDataset === 'all' ? 'text-sky-600' : 'text-slate-400'}`} />
                  {selectedDataset === 'all' && <Check className="w-3.5 h-3.5 text-sky-600" />}
                </div>
                <div className="mt-2">
                  <div className="font-semibold text-slate-900">Full Inventory</div>
                  <div className="text-[11px] text-slate-500">All 4 modules</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedDataset('activity')}
                className={`p-3 rounded-lg border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  selectedDataset === 'activity'
                    ? 'border-sky-500 bg-sky-50/50 ring-2 ring-sky-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <History className={`w-4 h-4 ${selectedDataset === 'activity' ? 'text-sky-600' : 'text-slate-400'}`} />
                  {selectedDataset === 'activity' && <Check className="w-3.5 h-3.5 text-sky-600" />}
                </div>
                <div className="mt-2">
                  <div className="font-semibold text-slate-900">Audit Trail</div>
                  <div className="text-[11px] text-slate-500">{activityLogs.length} events</div>
                </div>
              </button>
            </div>
          </div>

          {/* Step 2: Choose File Format */}
          <div>
            <label className="block font-semibold text-slate-700 mb-2">2. Select Export Format</label>
            <div className="grid grid-cols-3 gap-2.5">
              {/* PDF Option */}
              <button
                type="button"
                onClick={() => setFormat('pdf')}
                className={`p-3 rounded-lg border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  format === 'pdf'
                    ? 'border-rose-500 bg-rose-50/40 ring-2 ring-rose-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-6 h-6 rounded bg-rose-100 text-rose-700 flex items-center justify-center">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  {format === 'pdf' && <Check className="w-3.5 h-3.5 text-rose-600" />}
                </div>
                <div className="mt-2">
                  <div className="font-bold text-slate-900">PDF Report</div>
                  <div className="text-[11px] text-slate-500">Document (.pdf)</div>
                </div>
              </button>

              {/* CSV Option */}
              <button
                type="button"
                onClick={() => setFormat('csv')}
                className={`p-3 rounded-lg border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  format === 'csv'
                    ? 'border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-6 h-6 rounded bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Table className="w-3.5 h-3.5" />
                  </div>
                  {format === 'csv' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                </div>
                <div className="mt-2">
                  <div className="font-bold text-slate-900">CSV Sheet</div>
                  <div className="text-[11px] text-slate-500">Excel / Sheets (.csv)</div>
                </div>
              </button>

              {/* JSON Option */}
              <button
                type="button"
                onClick={() => setFormat('json')}
                className={`p-3 rounded-lg border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  format === 'json'
                    ? 'border-amber-500 bg-amber-50/40 ring-2 ring-amber-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-6 h-6 rounded bg-amber-100 text-amber-700 flex items-center justify-center">
                    <HardDrive className="w-3.5 h-3.5" />
                  </div>
                  {format === 'json' && <Check className="w-3.5 h-3.5 text-amber-600" />}
                </div>
                <div className="mt-2">
                  <div className="font-bold text-slate-900">JSON Backup</div>
                  <div className="text-[11px] text-slate-500">Raw Data (.json)</div>
                </div>
              </button>
            </div>
          </div>

          {/* Export Details info banner */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-600">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800">Export Scope:</span>
              <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-slate-200">
                {getDatasetCount()}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              {format === 'pdf' 
                ? 'Generates a styled, print-ready PDF document including enterprise headers, status indicators, and summary KPIs.' 
                : format === 'csv'
                ? 'Generates a standard UTF-8 Comma-Separated Values file compatible with Microsoft Excel, Apple Numbers, and Google Sheets.'
                : 'Exports all relational tables, logs, and metadata into a single portable JSON backup file.'}
            </p>
          </div>

          {/* Action buttons */}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="confirm-export-download-btn"
              type="button"
              disabled={isExporting}
              onClick={handleExport}
              className={`inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-white rounded-lg transition-colors shadow-sm cursor-pointer ${
                format === 'pdf'
                  ? 'bg-rose-600 hover:bg-rose-500'
                  : format === 'csv'
                  ? 'bg-emerald-600 hover:bg-emerald-500'
                  : 'bg-sky-600 hover:bg-sky-500'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>
                {isExporting ? 'Generating...' : `Download ${format.toUpperCase()}`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
