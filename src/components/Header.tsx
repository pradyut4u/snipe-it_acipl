import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PREDEFINED_ACCOUNTS } from '../data/authAccounts';
import { 
  Search, 
  Plus, 
  Download, 
  RotateCcw, 
  ShieldCheck, 
  Box, 
  FileText, 
  Table, 
  ChevronDown, 
  Layers,
  QrCode,
  ScanLine,
  LogOut,
  User as UserIcon,
  MapPin,
  Building,
  Check,
  RefreshCw
} from 'lucide-react';
import { 
  exportAssetsToPDF, 
  exportAssetsToCSV, 
  exportComprehensiveReportPDF, 
  exportComprehensiveReportCSV 
} from '../utils/exportUtils';

interface HeaderProps {
  onOpenNewAssetModal: () => void;
  onOpenExportModal: () => void;
  onOpenScannerModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenNewAssetModal, 
  onOpenExportModal,
  onOpenScannerModal
}) => {
  const { 
    searchQuery, 
    setSearchQuery, 
    resetToDefaults, 
    assets, 
    licenses, 
    accessories, 
    consumables,
    currentUser,
    logout,
    quickLogin
  } = useApp();
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name?: string) => {
    if (!name) return 'AU';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleQuickExportPDF = () => {
    setShowExportMenu(false);
    exportAssetsToPDF(assets);
  };

  const handleQuickExportCSV = () => {
    setShowExportMenu(false);
    exportAssetsToCSV(assets);
  };

  const handleFullPDF = () => {
    setShowExportMenu(false);
    exportComprehensiveReportPDF(assets, licenses, accessories, consumables);
  };

  const handleFullCSV = () => {
    setShowExportMenu(false);
    exportComprehensiveReportCSV(assets, licenses, accessories, consumables);
  };

  return (
    <header id="app-header" className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        {/* Left: Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-sky-600 flex items-center justify-center text-white font-bold shadow-md">
            <Box className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight text-white">ACIPL/IPNET</span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Inventory & Asset Management System</p>
          </div>
        </div>

        {/* Center: Search */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              id="global-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tag, serial, model, or user..."
              className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Right: Quick actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Quick Barcode/QR Scanner Button */}
          <button
            id="header-scan-barcode-btn"
            onClick={onOpenScannerModal}
            className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold px-3 py-1.5 rounded-lg transition-all shadow-sm cursor-pointer"
            title="Scan Barcode or QR Code (Camera / File / USB)"
          >
            <ScanLine className="w-4 h-4" />
            <span className="hidden sm:inline">Scan Code</span>
          </button>

          <button
            id="header-create-asset-btn"
            onClick={onOpenNewAssetModal}
            className="flex items-center space-x-1.5 bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors shadow-sm cursor-pointer"
            title="Create Asset"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Asset</span>
          </button>

          {/* Export Dropdown Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              id="header-export-btn"
              type="button"
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              title="Export PDF or CSV"
            >
              <Download className="w-4 h-4 text-sky-400" />
              <span className="hidden md:inline">Export</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showExportMenu && (
              <div 
                id="header-export-dropdown"
                className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 text-slate-800 text-xs"
              >
                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  Export Document / Data
                </div>

                {/* PDF Option */}
                <button
                  id="header-export-pdf-btn"
                  onClick={handleQuickExportPDF}
                  className="w-full px-3 py-2 text-left flex items-center space-x-2.5 hover:bg-rose-50/70 text-slate-700 hover:text-rose-700 transition-colors cursor-pointer"
                >
                  <div className="w-6 h-6 rounded bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-semibold">Hardware Assets (PDF)</div>
                    <div className="text-[10px] text-slate-400">Printable formatted inventory report</div>
                  </div>
                </button>

                {/* CSV Option */}
                <button
                  id="header-export-csv-btn"
                  onClick={handleQuickExportCSV}
                  className="w-full px-3 py-2 text-left flex items-center space-x-2.5 hover:bg-emerald-50/70 text-slate-700 hover:text-emerald-700 transition-colors cursor-pointer"
                >
                  <div className="w-6 h-6 rounded bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <Table className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-semibold">Hardware Assets (CSV)</div>
                    <div className="text-[10px] text-slate-400">Raw table data for Excel / Sheets</div>
                  </div>
                </button>

                <div className="my-1 border-t border-slate-100" />

                {/* Full Inventory PDF */}
                <button
                  id="header-export-full-pdf-btn"
                  onClick={handleFullPDF}
                  className="w-full px-3 py-2 text-left flex items-center space-x-2.5 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
                >
                  <div className="w-6 h-6 rounded bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                    <Layers className="w-3.5 h-3.5 text-sky-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Executive Summary (PDF)</div>
                    <div className="text-[10px] text-slate-400">Hardware, licenses & stock overview</div>
                  </div>
                </button>

                {/* Full Inventory CSV */}
                <button
                  id="header-export-full-csv-btn"
                  onClick={handleFullCSV}
                  className="w-full px-3 py-2 text-left flex items-center space-x-2.5 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
                >
                  <div className="w-6 h-6 rounded bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                    <Table className="w-3.5 h-3.5 text-slate-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Full Inventory (CSV)</div>
                    <div className="text-[10px] text-slate-400">All 4 modules bundled</div>
                  </div>
                </button>

                <div className="my-1 border-t border-slate-100" />

                {/* Custom / Advanced Dialog */}
                <button
                  id="header-export-modal-trigger-btn"
                  onClick={() => {
                    setShowExportMenu(false);
                    onOpenExportModal();
                  }}
                  className="w-full px-3 py-2 text-left flex items-center space-x-2 text-sky-600 hover:bg-sky-50 font-semibold transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>More Export Options...</span>
                </button>
              </div>
            )}
          </div>

          <button
            id="header-reset-btn"
            onClick={() => {
              if (window.confirm('Reset all assets and inventory back to initial demo data?')) {
                resetToDefaults();
              }
            }}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg transition-colors cursor-pointer"
            title="Reset to Initial Data"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* User Profile & Logout Menu */}
          <div className="relative pl-2 border-l border-slate-700" ref={profileDropdownRef}>
            <button
              id="header-profile-menu-btn"
              type="button"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer group"
              title="Account & Session Controls"
            >
              <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-sky-500/70 flex items-center justify-center text-xs font-bold text-sky-400 group-hover:border-sky-400 transition-colors shadow-xs">
                {getInitials(currentUser?.name)}
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-semibold text-slate-200 flex items-center space-x-1">
                  <span className="truncate max-w-[120px]">{currentUser?.name || 'Administrator'}</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-[10px] text-slate-400">{currentUser?.role || 'Staff'}</span>
                  <ChevronDown className="w-2.5 h-2.5 text-slate-500 group-hover:text-slate-300 transition-colors" />
                </div>
              </div>
            </button>

            {showProfileMenu && (
              <div
                id="header-user-dropdown"
                className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-100 text-slate-800"
              >
                {/* User Identity Card */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 mb-2">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-sm font-bold text-white shadow-sm shrink-0">
                      {getInitials(currentUser?.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {currentUser?.name || 'Authenticated User'}
                        </h4>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-200 uppercase tracking-wider">
                          {currentUser?.role || 'Staff'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{currentUser?.email}</p>
                      <div className="flex items-center space-x-2 mt-1.5 text-[10px] text-slate-400">
                        <span className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200">
                          {currentUser?.employeeNum || 'EMP-XXXX'}
                        </span>
                        <span className="flex items-center text-emerald-600 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1" />
                          Active Session
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Metadata items */}
                  <div className="mt-2.5 pt-2 border-t border-slate-200/60 grid grid-cols-2 gap-1.5 text-[10px] text-slate-500">
                    <div className="flex items-center space-x-1 truncate">
                      <Building className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{currentUser?.department || 'IT Operations'}</span>
                    </div>
                    <div className="flex items-center space-x-1 truncate">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{currentUser?.location || 'HQ Facility'}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Account Switch */}
                <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Switch Demo Account
                </div>
                <div className="space-y-0.5 mb-2">
                  {PREDEFINED_ACCOUNTS.map((account) => {
                    const isCurrent = currentUser?.email.toLowerCase() === account.email.toLowerCase();
                    return (
                      <button
                        key={account.id}
                        type="button"
                        onClick={() => {
                          quickLogin(account);
                          setShowProfileMenu(false);
                        }}
                        className={`w-full px-2.5 py-1.5 text-left rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                          isCurrent
                            ? 'bg-sky-50 text-sky-900 font-semibold'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="truncate pr-2">
                          <div className="truncate">{account.name}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{account.role}</div>
                        </div>
                        {isCurrent && <Check className="w-3.5 h-3.5 text-sky-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                <div className="border-t border-slate-100 pt-1">
                  {/* Logout Button */}
                  <button
                    id="header-logout-btn"
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                    }}
                    className="w-full px-3 py-2 text-left rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 flex items-center justify-between transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center space-x-2">
                      <LogOut className="w-4 h-4 text-rose-500 group-hover:translate-x-0.5 transition-transform" />
                      <span>Log Out of Console</span>
                    </div>
                    <span className="text-[10px] font-normal text-rose-400">End session</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile search bar */}
      <div className="px-4 pb-2.5 md:hidden">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="mobile-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tags, assets, users..."
            className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>
    </header>
  );
};
