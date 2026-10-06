import React from 'react';
import { useApp } from '../context/AppContext';
import { ActiveTab } from '../types';
import { 
  LayoutDashboard, 
  Laptop, 
  KeyRound, 
  Keyboard, 
  Box, 
  Users, 
  Calendar,
  History, 
  CheckCircle2, 
  AlertTriangle,
  QrCode,
  UserCircle
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, assets, licenses, accessories, consumables, users, events, activityLogs, currentUser } = useApp();

  const lowStockAccessories = accessories.filter(a => a.remainingQuantity <= a.minQuantity).length;
  const lowStockConsumables = consumables.filter(c => c.remainingQuantity <= c.minQuantity).length;
  const totalAlerts = lowStockAccessories + lowStockConsumables;

  const myAssignedAssets = assets.filter(a => a.assignedToId === currentUser?.id).length;

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; count: number; alert?: boolean }[] = [
    {
      id: 'my-portal',
      label: 'My Portal',
      icon: <UserCircle className="w-4 h-4" />,
      count: myAssignedAssets,
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
      count: assets.length,
    },
    {
      id: 'assets',
      label: 'Hardware Assets',
      icon: <Laptop className="w-4 h-4" />,
      count: assets.length,
    },
    {
      id: 'events',
      label: 'Events & Dispatch',
      icon: <Calendar className="w-4 h-4" />,
      count: events.length,
    },
    {
      id: 'barcodes',
      label: 'Barcode & QR Hub',
      icon: <QrCode className="w-4 h-4" />,
      count: assets.length,
    },
    {
      id: 'licenses',
      label: 'Licenses',
      icon: <KeyRound className="w-4 h-4" />,
      count: licenses.length,
    },
    {
      id: 'accessories',
      label: 'Accessories',
      icon: <Keyboard className="w-4 h-4" />,
      count: accessories.length,
      alert: lowStockAccessories > 0,
    },
    {
      id: 'consumables',
      label: 'Consumables',
      icon: <Box className="w-4 h-4" />,
      count: consumables.length,
      alert: lowStockConsumables > 0,
    },
    {
      id: 'users',
      label: 'People & Users',
      icon: <Users className="w-4 h-4" />,
      count: users.length,
    },
    {
      id: 'activity',
      label: 'Activity History',
      icon: <History className="w-4 h-4" />,
      count: activityLogs.length,
    },
  ];

  return (
    <aside id="app-sidebar" className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0 min-h-[calc(100vh-57px)]">
      <div className="p-4">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2">
          Management
        </div>
        <nav className="space-y-1">
          {navItems.filter(item => {
            if (currentUser?.role === 'Tech') {
              return ['my-portal'].includes(item.id);
            }
            if (currentUser?.role === 'Inventory Manager') {
              return !['users', 'activity', 'my-portal'].includes(item.id);
            }
            return item.id !== 'my-portal'; // Admins/Superadmins don't necessarily need the employee portal view, or maybe they do? Let's hide it for them to keep the sidebar clean, unless requested.
          }).map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  {item.alert && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" title="Low stock alert" />
                  )}
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                      isActive
                        ? 'bg-sky-700 text-sky-100'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {item.count}
                  </span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* System Status footer */}
      <div className="mt-auto p-4 border-t border-slate-800 text-xs text-slate-400">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium text-slate-300">System Status</span>
          <span className="flex items-center text-emerald-400 text-[11px]">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Healthy
          </span>
        </div>
        <div className="bg-slate-800/80 rounded-md p-2.5 space-y-1 font-mono text-[11px] border border-slate-700/60">
          <div className="flex justify-between">
            <span className="text-slate-400">Runtime:</span>
            <span className="text-slate-200">Node v22</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Inventory:</span>
            <span className="text-slate-200">{assets.length + licenses.length + accessories.length} items</span>
          </div>
          {totalAlerts > 0 && (
            <div className="flex justify-between text-amber-400 pt-1 border-t border-slate-700">
              <span className="flex items-center"><AlertTriangle className="w-3 h-3 mr-1" /> Low Stock:</span>
              <span className="font-semibold">{totalAlerts} items</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
