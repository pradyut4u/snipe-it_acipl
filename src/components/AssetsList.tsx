import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Asset, AssetStatus } from '../types';
import { 
  Laptop, 
  Search, 
  Plus, 
  Filter, 
  LogOut, 
  LogIn, 
  Edit3, 
  Trash2, 
  Eye, 
  Download,
  CheckCircle2,
  AlertCircle,
  FileText,
  Table,
  QrCode,
  ScanLine,
  Layers
} from 'lucide-react';
import { exportAssetsToPDF, exportAssetsToCSV } from '../utils/exportUtils';

interface AssetsListProps {
  onOpenNewAssetModal: () => void;
  onOpenEditAssetModal: (asset: Asset) => void;
  onOpenCheckoutModal: (assetId: string) => void;
  onOpenCheckinModal: (assetId: string) => void;
  onOpenDetailModal: (asset: Asset) => void;
  onOpenBarcodeLabelModal: (asset: Asset) => void;
  onOpenScannerModal: () => void;
  onOpenBatchBarcodeModal: () => void;
}

export const AssetsList: React.FC<AssetsListProps> = ({
  onOpenNewAssetModal,
  onOpenEditAssetModal,
  onOpenCheckoutModal,
  onOpenCheckinModal,
  onOpenDetailModal,
  onOpenBarcodeLabelModal,
  onOpenScannerModal,
  onOpenBatchBarcodeModal
}) => {
  const { assets, deleteAsset, searchQuery, setSearchQuery } = useApp();
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Distinct categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    assets.forEach(a => set.add(a.category));
    return ['All', ...Array.from(set)];
  }, [assets]);

  // Filtered assets
  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      // Status filter
      if (selectedStatus !== 'All' && asset.status !== selectedStatus) return false;
      // Category filter
      if (selectedCategory !== 'All' && asset.category !== selectedCategory) return false;
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTag = asset.assetTag.toLowerCase().includes(q);
        const matchesName = asset.name.toLowerCase().includes(q);
        const matchesModel = asset.model.toLowerCase().includes(q);
        const matchesSerial = asset.serial.toLowerCase().includes(q);
        const matchesUser = asset.assignedToName?.toLowerCase().includes(q) || false;
        if (!matchesTag && !matchesName && !matchesModel && !matchesSerial && !matchesUser) {
          return false;
        }
      }
      return true;
    });
  }, [assets, selectedStatus, selectedCategory, searchQuery]);

  const statusBadge = (status: AssetStatus) => {
    switch (status) {
      case 'Ready to Deploy':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle2 className="w-3 h-3 mr-1" />Ready</span>;
      case 'Deployed':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">Deployed</span>;
      case 'In Repair':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200"><AlertCircle className="w-3 h-3 mr-1" />In Repair</span>;
      case 'Pending':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">Pending</span>;
      case 'Archived':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-300">Archived</span>;
    }
  };

  return (
    <div id="assets-list-view" className="space-y-4">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <Laptop className="w-6 h-6 text-sky-600" />
            <span>Hardware Assets</span>
          </h1>
          <p className="text-sm text-slate-500">Manage, checkout, checkin, and track physical hardware inventory.</p>
        </div>
        <div className="flex items-center space-x-2">
          {/* Scan Barcode/QR Button */}
          <button
            id="scan-assets-btn"
            onClick={onOpenScannerModal}
            className="inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors shadow-xs cursor-pointer"
            title="Scan Asset Tag using Camera or Barcode Wand"
          >
            <ScanLine className="w-3.5 h-3.5" />
            <span>Scan Asset</span>
          </button>

          {/* Batch Print Label Sheet Button */}
          <button
            id="batch-label-sheet-btn"
            onClick={onOpenBatchBarcodeModal}
            className="inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-medium px-3 py-2 rounded-lg transition-colors shadow-xs cursor-pointer"
            title="Print multi-item sticker sheet"
          >
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Label Sheets</span>
          </button>

          {/* Export PDF Button */}
          <button
            id="export-assets-pdf-btn"
            onClick={() => exportAssetsToPDF(filteredAssets)}
            className="inline-flex items-center space-x-1.5 bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-300 hover:border-rose-300 text-xs font-medium px-3 py-2 rounded-lg transition-colors shadow-xs cursor-pointer"
            title="Export filtered list to PDF"
          >
            <FileText className="w-3.5 h-3.5 text-rose-600" />
            <span>Export PDF</span>
          </button>

          {/* Export CSV Button */}
          <button
            id="export-assets-csv-btn"
            onClick={() => exportAssetsToCSV(filteredAssets)}
            className="inline-flex items-center space-x-1.5 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-300 hover:border-emerald-300 text-xs font-medium px-3 py-2 rounded-lg transition-colors shadow-xs cursor-pointer"
            title="Export filtered list to CSV"
          >
            <Table className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export CSV</span>
          </button>

          <button
            id="create-asset-btn"
            onClick={onOpenNewAssetModal}
            className="inline-flex items-center space-x-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Asset</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs font-medium">
            {['All', 'Ready to Deploy', 'Deployed', 'In Repair', 'Pending'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  selectedStatus === status
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-1 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              id="category-filter-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-700 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>Category: {cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Search input in card */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Filter list..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Assets Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table id="assets-table" className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Asset Tag</th>
                <th className="px-4 py-3">Asset Name & Model</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Serial</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Assigned To</th>
                <th className="px-4 py-3 text-right">Cost</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-slate-400">
                    No hardware assets matching the selected filters.
                  </td>
                </tr>
              ) : (
                filteredAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-slate-50/75 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() => onOpenDetailModal(asset)}
                        className="font-mono font-semibold text-sky-700 hover:text-sky-900 bg-sky-50 px-2 py-0.5 rounded border border-sky-200 hover:border-sky-300 transition-colors cursor-pointer"
                      >
                        {asset.assetTag}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">{asset.name}</div>
                      <div className="text-[11px] text-slate-400">{asset.model}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-medium text-slate-700">
                      {asset.category}
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {asset.serial || '—'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {statusBadge(asset.status)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {asset.assignedToName ? (
                        <span className="font-medium text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-xs">
                          {asset.assignedToName}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-slate-800 whitespace-nowrap font-medium">
                      ${asset.purchaseCost ? asset.purchaseCost.toLocaleString() : '0.00'}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-1">
                        {/* Check Out Button */}
                        {asset.status !== 'Deployed' ? (
                          <button
                            onClick={() => onOpenCheckoutModal(asset.id)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                            title="Check Out to User"
                          >
                            <LogOut className="w-4 h-4" />
                          </button>
                        ) : (
                          /* Check In Button */
                          <button
                            onClick={() => onOpenCheckinModal(asset.id)}
                            className="p-1 text-emerald-600 hover:bg-emerald-50 rounded transition-colors cursor-pointer"
                            title="Check In Asset"
                          >
                            <LogIn className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => onOpenDetailModal(asset)}
                          className="p-1 text-slate-500 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onOpenBarcodeLabelModal(asset)}
                          className="p-1 text-slate-700 hover:bg-slate-100 hover:text-sky-600 rounded transition-colors cursor-pointer"
                          title="Print Barcode & QR Label"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onOpenEditAssetModal(asset)}
                          className="p-1 text-slate-500 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                          title="Edit Asset"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`Delete asset ${asset.assetTag} (${asset.name})?`)) {
                              deleteAsset(asset.id);
                            }
                          }}
                          className="p-1 text-rose-500 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                          title="Delete Asset"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredAssets.length} of {assets.length} assets</span>
          <span>Total Asset Inventory Value: ${filteredAssets.reduce((s, a) => s + (a.purchaseCost || 0), 0).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};
