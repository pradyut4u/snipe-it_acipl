import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Laptop, 
  KeyRound, 
  Keyboard, 
  Box, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  ArrowRight,
  PlusCircle,
  LogIn,
  LogOut,
  ShieldAlert
} from 'lucide-react';
import { AssetStatus } from '../types';

interface DashboardProps {
  onOpenNewAssetModal: () => void;
  onOpenCheckoutModal: (assetId?: string) => void;
  onOpenCheckinModal: (assetId?: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onOpenNewAssetModal,
  onOpenCheckoutModal,
  onOpenCheckinModal
}) => {
  const { assets, licenses, accessories, consumables, activityLogs, setActiveTab } = useApp();

  // Asset Metrics
  const totalAssets = assets.length;
  const deployedAssets = assets.filter(a => a.status === 'Deployed').length;
  const readyAssets = assets.filter(a => a.status === 'Ready to Deploy').length;
  const inRepairAssets = assets.filter(a => a.status === 'In Repair').length;
  const archivedAssets = assets.filter(a => a.status === 'Archived').length;
  const pendingAssets = assets.filter(a => a.status === 'Pending').length;

  const totalAssetValue = assets.reduce((acc, a) => acc + (a.purchaseCost || 0), 0);

  // License Metrics
  const totalSeats = licenses.reduce((sum, l) => sum + l.totalSeats, 0);
  const usedSeats = licenses.reduce((sum, l) => sum + l.assignedUserIds.length, 0);
  const seatUtilization = totalSeats > 0 ? Math.round((usedSeats / totalSeats) * 100) : 0;

  // Alerts
  const lowStockAccessories = accessories.filter(a => a.remainingQuantity <= a.minQuantity);
  const lowStockConsumables = consumables.filter(c => c.remainingQuantity <= c.minQuantity);
  const hasAlerts = lowStockAccessories.length > 0 || lowStockConsumables.length > 0;

  // Categories
  const categoryCounts = assets.reduce<Record<string, number>>((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1;
    return acc;
  }, {});

  const statusColors: Record<AssetStatus, { bg: string; text: string; bar: string }> = {
    'Ready to Deploy': { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', text: 'text-emerald-600', bar: 'bg-emerald-500' },
    'Deployed': { bg: 'bg-blue-50 text-blue-700 border-blue-200', text: 'text-blue-600', bar: 'bg-blue-600' },
    'Pending': { bg: 'bg-amber-50 text-amber-700 border-amber-200', text: 'text-amber-600', bar: 'bg-amber-400' },
    'In Repair': { bg: 'bg-orange-50 text-orange-700 border-orange-200', text: 'text-orange-600', bar: 'bg-orange-500' },
    'Archived': { bg: 'bg-slate-100 text-slate-700 border-slate-300', text: 'text-slate-600', bar: 'bg-slate-400' }
  };

  return (
    <div id="dashboard-view" className="space-y-6">
      {/* Page Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Dashboard</h1>
          <p className="text-sm text-slate-500">Live operational overview of organization hardware and software inventory.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="dash-quick-checkout-btn"
            onClick={() => onOpenCheckoutModal()}
            className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Check Out Asset</span>
          </button>
          <button
            id="dash-quick-checkin-btn"
            onClick={() => onOpenCheckinModal()}
            className="inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Check In Asset</span>
          </button>
          <button
            id="dash-quick-new-asset-btn"
            onClick={onOpenNewAssetModal}
            className="inline-flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Asset</span>
          </button>
        </div>
      </div>

      {/* Low Stock Notification Banner */}
      {hasAlerts && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start space-x-3 text-amber-900 shadow-xs">
          <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 text-sm">
            <h4 className="font-semibold text-amber-900">Inventory Attention Required:</h4>
            <p className="text-amber-800 mt-0.5">
              {lowStockAccessories.length > 0 && `${lowStockAccessories.length} accessories `}
              {lowStockAccessories.length > 0 && lowStockConsumables.length > 0 && 'and '}
              {lowStockConsumables.length > 0 && `${lowStockConsumables.length} consumables `}
              have dropped below their reorder threshold level.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('accessories')}
            className="text-xs font-medium bg-amber-200/80 hover:bg-amber-200 px-3 py-1.5 rounded-md text-amber-900 transition-colors"
          >
            Review Stock
          </button>
        </div>
      )}

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Hardware Assets */}
        <div 
          onClick={() => setActiveTab('assets')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Assets</span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
              <Laptop className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-slate-900 font-mono">{totalAssets}</span>
            <span className="text-xs text-blue-600 font-medium flex items-center">
              {deployedAssets} Deployed <ArrowRight className="w-3 h-3 ml-1" />
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Ready: <strong className="text-emerald-600">{readyAssets}</strong></span>
            <span>Total Value: <strong>${totalAssetValue.toLocaleString()}</strong></span>
          </div>
        </div>

        {/* Software Licenses */}
        <div 
          onClick={() => setActiveTab('licenses')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Licenses</span>
            <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
              <KeyRound className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-slate-900 font-mono">{licenses.length}</span>
            <span className="text-xs text-purple-600 font-medium">
              {seatUtilization}% Seats Allocated
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Used: <strong>{usedSeats}</strong> / {totalSeats}</span>
            <span>Available: <strong className="text-emerald-600">{totalSeats - usedSeats}</strong></span>
          </div>
        </div>

        {/* Accessories */}
        <div 
          onClick={() => setActiveTab('accessories')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Accessories</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
              <Keyboard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-slate-900 font-mono">{accessories.length}</span>
            <span className="text-xs text-emerald-600 font-medium">
              {accessories.reduce((acc, a) => acc + a.remainingQuantity, 0)} In Stock
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Total Units: <strong>{accessories.reduce((acc, a) => acc + a.totalQuantity, 0)}</strong></span>
            {lowStockAccessories.length > 0 ? (
              <span className="text-amber-600 font-medium">{lowStockAccessories.length} Low Stock</span>
            ) : (
              <span className="text-emerald-600">Optimal</span>
            )}
          </div>
        </div>

        {/* Consumables */}
        <div 
          onClick={() => setActiveTab('consumables')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Consumables</span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
              <Box className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-slate-900 font-mono">{consumables.length}</span>
            <span className="text-xs text-amber-600 font-medium">
              {consumables.reduce((acc, c) => acc + c.remainingQuantity, 0)} In Stock
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Total Stock: <strong>{consumables.reduce((acc, c) => acc + c.totalQuantity, 0)}</strong></span>
            {lowStockConsumables.length > 0 ? (
              <span className="text-amber-600 font-medium">{lowStockConsumables.length} Low Stock</span>
            ) : (
              <span className="text-emerald-600">Optimal</span>
            )}
          </div>
        </div>
      </div>

      {/* Asset Status Breakdown & Category Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Asset Status Distribution */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-900">Asset Status Breakdown</h3>
              <p className="text-xs text-slate-500">Distribution of all registered hardware assets across statuses</p>
            </div>
            <button
              onClick={() => setActiveTab('assets')}
              className="text-xs font-medium text-sky-600 hover:text-sky-700 flex items-center"
            >
              View Assets <ArrowRight className="w-3 h-3 ml-1" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
            {deployedAssets > 0 && (
              <div 
                style={{ width: `${(deployedAssets / totalAssets) * 100}%` }} 
                className="bg-blue-600 transition-all duration-500" 
                title={`Deployed: ${deployedAssets}`} 
              />
            )}
            {readyAssets > 0 && (
              <div 
                style={{ width: `${(readyAssets / totalAssets) * 100}%` }} 
                className="bg-emerald-500 transition-all duration-500" 
                title={`Ready to Deploy: ${readyAssets}`} 
              />
            )}
            {pendingAssets > 0 && (
              <div 
                style={{ width: `${(pendingAssets / totalAssets) * 100}%` }} 
                className="bg-amber-400 transition-all duration-500" 
                title={`Pending: ${pendingAssets}`} 
              />
            )}
            {inRepairAssets > 0 && (
              <div 
                style={{ width: `${(inRepairAssets / totalAssets) * 100}%` }} 
                className="bg-orange-500 transition-all duration-500" 
                title={`In Repair: ${inRepairAssets}`} 
              />
            )}
            {archivedAssets > 0 && (
              <div 
                style={{ width: `${(archivedAssets / totalAssets) * 100}%` }} 
                className="bg-slate-400 transition-all duration-500" 
                title={`Archived: ${archivedAssets}`} 
              />
            )}
          </div>

          {/* Legend Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-5">
            <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-lg">
              <div className="flex items-center space-x-1.5 text-xs text-blue-700 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <span>Deployed</span>
              </div>
              <div className="mt-1 text-lg font-bold text-slate-800 font-mono">{deployedAssets}</div>
              <div className="text-[11px] text-slate-500">{totalAssets ? Math.round((deployedAssets / totalAssets) * 100) : 0}%</div>
            </div>

            <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-lg">
              <div className="flex items-center space-x-1.5 text-xs text-emerald-700 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Ready</span>
              </div>
              <div className="mt-1 text-lg font-bold text-slate-800 font-mono">{readyAssets}</div>
              <div className="text-[11px] text-slate-500">{totalAssets ? Math.round((readyAssets / totalAssets) * 100) : 0}%</div>
            </div>

            <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-lg">
              <div className="flex items-center space-x-1.5 text-xs text-amber-700 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span>Pending</span>
              </div>
              <div className="mt-1 text-lg font-bold text-slate-800 font-mono">{pendingAssets}</div>
              <div className="text-[11px] text-slate-500">{totalAssets ? Math.round((pendingAssets / totalAssets) * 100) : 0}%</div>
            </div>

            <div className="p-3 bg-orange-50/50 border border-orange-100 rounded-lg">
              <div className="flex items-center space-x-1.5 text-xs text-orange-700 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                <span>In Repair</span>
              </div>
              <div className="mt-1 text-lg font-bold text-slate-800 font-mono">{inRepairAssets}</div>
              <div className="text-[11px] text-slate-500">{totalAssets ? Math.round((inRepairAssets / totalAssets) * 100) : 0}%</div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex items-center space-x-1.5 text-xs text-slate-700 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                <span>Archived</span>
              </div>
              <div className="mt-1 text-lg font-bold text-slate-800 font-mono">{archivedAssets}</div>
              <div className="text-[11px] text-slate-500">{totalAssets ? Math.round((archivedAssets / totalAssets) * 100) : 0}%</div>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-slate-900 mb-1">Hardware by Category</h3>
            <p className="text-xs text-slate-500 mb-4">Inventory distributed across asset classes</p>
            <div className="space-y-3">
              {Object.entries(categoryCounts).map(([cat, count]) => {
                const pct = Math.round((count / totalAssets) * 100);
                return (
                  <div key={cat}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700">{cat}</span>
                      <span className="text-slate-500">{count} items ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-sky-600 h-2 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs text-slate-500">
            <span>Tracked Categories: <strong>{Object.keys(categoryCounts).length}</strong></span>
            <button 
              onClick={() => setActiveTab('assets')}
              className="text-sky-600 hover:text-sky-700 font-medium flex items-center"
            >
              Hardware Directory <ArrowRight className="w-3 h-3 ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity Log Preview */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-900">Recent Action Logs</h3>
            <p className="text-xs text-slate-500">Most recent checkins, checkouts, and inventory modifications</p>
          </div>
          <button
            onClick={() => setActiveTab('activity')}
            className="text-xs font-medium text-sky-600 hover:text-sky-700 flex items-center"
          >
            All Activity <ArrowRight className="w-3 h-3 ml-1" />
          </button>
        </div>
        <div className="divide-y divide-slate-100">
          {activityLogs.slice(0, 5).map((log) => {
            const actionBadgeColor = {
              checkout: 'bg-blue-50 text-blue-700 border-blue-200',
              checkin: 'bg-emerald-50 text-emerald-700 border-emerald-200',
              create: 'bg-indigo-50 text-indigo-700 border-indigo-200',
              update: 'bg-slate-50 text-slate-700 border-slate-200',
              delete: 'bg-rose-50 text-rose-700 border-rose-200',
              consume: 'bg-amber-50 text-amber-700 border-amber-200',
              audit: 'bg-purple-50 text-purple-700 border-purple-200',
              login: 'bg-teal-50 text-teal-700 border-teal-200',
              logout: 'bg-slate-50 text-slate-600 border-slate-200',
            }[log.action] || 'bg-slate-50 text-slate-700';

            return (
              <div key={log.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center space-x-3 min-w-0">
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border uppercase tracking-wider ${actionBadgeColor}`}>
                    {log.action}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {log.itemName}
                    </p>
                    <p className="text-xs text-slate-500 flex items-center space-x-2">
                      {log.targetUserName && (
                        <span>To: <strong className="text-slate-700">{log.targetUserName}</strong> • </span>
                      )}
                      <span>By: {log.adminName}</span>
                      {log.notes && <span>• <em>{log.notes}</em></span>}
                    </p>
                  </div>
                </div>
                <div className="text-xs text-slate-400 font-mono whitespace-nowrap pl-3">
                  {log.timestamp}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
