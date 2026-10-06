import React, { createContext, useContext, useState, useEffect } from 'react';
import { Asset, License, Accessory, Consumable, User, ActivityLog, ActiveTab, AssetStatus, EventItem, AuthUser } from '../types';


interface AppContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  
  // Auth state
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  quickLogin: (user: AuthUser) => void;
  logout: () => void;

  assets: Asset[];
  licenses: License[];
  accessories: Accessory[];
  consumables: Consumable[];
  users: User[];
  events: EventItem[];
  activityLogs: ActivityLog[];

  // Asset Actions
  addAsset: (asset: Omit<Asset, 'id' | 'updatedAt'>) => void;
  updateAsset: (id: number, updates: Partial<Asset>) => void;
  deleteAsset: (id: number) => void;
  checkoutAsset: (assetId: number, userId: string, notes?: string) => void;
  checkinAsset: (assetId: number, newStatus: AssetStatus, notes?: string) => void;
  auditAsset: (assetId: number, notes?: string) => void;

  // License Actions
  assignLicense: (licenseId: string, userId: string) => void;
  revokeLicense: (licenseId: string, userId: string) => void;

  // Accessory Actions
  checkoutAccessory: (accessoryId: string, userId: string, quantity: number) => void;
  checkinAccessory: (accessoryId: string, quantity: number) => void;

  // Consumable Actions
  consumeConsumable: (consumableId: string, userId: string, quantity: number) => void;

  // Event Actions
  addEvent: (eventData: Omit<EventItem, 'id' | 'createdAt' | 'updatedAt'>, autoDispatchAssets?: boolean) => void;
  updateEvent: (id: string, updates: Partial<EventItem>) => void;
  deleteEvent: (id: string) => void;
  dispatchAllEventAssets: (eventId: string) => void;
  returnAllEventAssets: (eventId: string) => void;

  // Admin / Utility

  exportDataJson: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'acipl_v3_';

function getStoredOrDefault<T>(key: string, defaultVal: T): T {
  try {
    const item = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    if (item) {
      return JSON.parse(item);
    }
  } catch (e) {
    console.error('Failed to parse localStorage key:', key, e);
  }
  return defaultVal;
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Authentication State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PREFIX + 'auth_user');
      if (stored) {
        return JSON.parse(stored);
      }
      const loggedOut = localStorage.getItem(STORAGE_KEY_PREFIX + 'logged_out');
      if (loggedOut === 'true') {
        return null;
      }
      return null;
    } catch {
      return null;
    }
  });

  const isAuthenticated = currentUser !== null;
  const [activeTab, setActiveTab] = useState<ActiveTab>(currentUser?.role === 'Tech' ? 'my-portal' : 'dashboard');

  const [assets, setAssets] = useState<Asset[]>([]);
  
  useEffect(() => {
    fetch('http://localhost:3003/api/assets')
      .then(res => res.json())
      .then(data => setAssets(data))
      .catch(err => console.error('Failed to fetch assets:', err));
  }, []);
  const [licenses, setLicenses] = useState<License[]>(() => getStoredOrDefault('licenses', []));
  const [accessories, setAccessories] = useState<Accessory[]>(() => getStoredOrDefault('accessories', []));
  const [consumables, setConsumables] = useState<Consumable[]>(() => getStoredOrDefault('consumables', []));
  const [users, setUsers] = useState<User[]>(() => getStoredOrDefault('users', []));
  const [events, setEvents] = useState<EventItem[]>(() => getStoredOrDefault('events', []));

  useEffect(() => {
    fetch('http://localhost:3003/api/events')
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error('Failed to fetch events:', err));
  }, []);

  useEffect(() => {
    fetch('http://localhost:3003/api/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error('Failed to fetch users:', err));
  }, []);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => getStoredOrDefault('logs', []));

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PREFIX + 'users', JSON.stringify(users));
    } catch (e) {
      console.warn('Storage full or unavailable', e);
    }
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PREFIX + 'licenses', JSON.stringify(licenses));
    } catch (e) {
      console.warn('Storage full or unavailable', e);
    }
  }, [licenses]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PREFIX + 'accessories', JSON.stringify(accessories));
    } catch (e) {
      console.warn('Storage full or unavailable', e);
    }
  }, [accessories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PREFIX + 'consumables', JSON.stringify(consumables));
    } catch (e) {
      console.warn('Storage full or unavailable', e);
    }
  }, [consumables]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PREFIX + 'events', JSON.stringify(events));
    } catch (e) {
      console.warn('Storage full or unavailable', e);
    }
  }, [events]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PREFIX + 'logs', JSON.stringify(activityLogs));
    } catch (e) {
      console.warn('Storage full or unavailable', e);
    }
  }, [activityLogs]);

  const logAction = (action: ActivityLog['action'], itemType: ActivityLog['itemType'], itemId: string | number, itemName: string, targetUserName?: string, notes?: string) => {
    const adminLabel = currentUser ? `${currentUser.name} (${currentUser.role})` : 'System Administrator';
    const newLog: ActivityLog = {
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      action,
      itemType,
      itemId: String(itemId),
      itemName,
      targetUserName,
      adminName: adminLabel,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      notes,
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('http://localhost:3003/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email.trim(), password: password.trim() })
      });

      const data = await response.json();

      if (data.success && data.user) {
        const authUser: AuthUser = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role as any,
          employeeNum: data.user.employeeNum,
          department: data.user.department,
          location: data.user.location,
          avatarUrl: data.user.avatarUrl,
          lastLogin: 'Just now'
        };
        setCurrentUser(authUser);
        localStorage.setItem(STORAGE_KEY_PREFIX + 'auth_user', JSON.stringify(authUser));
        localStorage.removeItem(STORAGE_KEY_PREFIX + 'logged_out');
        
        if (authUser.role === 'Tech') {
          setActiveTab('my-portal');
        } else {
          setActiveTab('dashboard');
        }
        
        logAction('login', 'system', authUser.id, `User Login: ${authUser.name}`, undefined, `Session opened via web portal (${authUser.role})`);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Authentication failed' };
      }
    } catch (err) {
      console.error('Login error', err);
      return { success: false, error: 'Network error during login.' };
    }
  };

  const quickLogin = (account: AuthUser) => {
    const authUser = {
      ...account,
      lastLogin: 'Just now'
    };
    setCurrentUser(authUser);
    localStorage.setItem(STORAGE_KEY_PREFIX + 'auth_user', JSON.stringify(authUser));
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'logged_out');
    logAction('login', 'system', authUser.id, `User Login: ${authUser.name}`, undefined, `Quick session started (${authUser.role})`);
  };

  const logout = () => {
    if (currentUser) {
      logAction('logout', 'system', currentUser.id, `User Logout: ${currentUser.name}`, undefined, 'User logged out of console');
    }
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'auth_user');
    localStorage.setItem(STORAGE_KEY_PREFIX + 'logged_out', 'true');
  };

  const addAsset = async (data: Omit<Asset, 'id' | 'updatedAt'>) => {
    try {
      const response = await fetch('http://localhost:3003/api/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const newAsset = await response.json();
        setAssets(prev => [newAsset, ...prev]);
        logAction('create', 'asset', newAsset.id, `${newAsset.name} [${newAsset.assetTag}]`, undefined, 'Created new asset record in DB');
      }
    } catch (err) {
      console.error('Failed to add asset', err);
    }
  };

  const updateAsset = async (id: number, updates: Partial<Asset>) => {
    try {
      const response = await fetch(`http://localhost:3003/api/assets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (response.ok) {
        const updated = await response.json();
        setAssets(prev => prev.map(item => item.id === id ? updated : item));
        logAction('update', 'asset', id, `${updated.name} [${updated.assetTag}]`, undefined, 'Updated asset properties in DB');
      }
    } catch (err) {
      console.error('Failed to update asset', err);
    }
  };

  const deleteAsset = async (id: number) => {
    try {
      const target = assets.find(a => a.id === id);
      if (!target) return;
      const response = await fetch(`http://localhost:3003/api/assets/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setAssets(prev => prev.filter(a => a.id !== id));
        logAction('delete', 'asset', id, `${target.name} [${target.assetTag}]`, undefined, 'Deleted asset record from DB');
      }
    } catch (err) {
      console.error('Failed to delete asset', err);
    }
  };

  const checkoutAsset = (assetId: number, userId: string, notes?: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    setAssets(prev => prev.map(item => {
      if (item.id === assetId) {
        const updated: Asset = {
          ...item,
          status: 'Deployed',
          assignedToId: user.id,
          assignedToName: user.name,
          updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
        };
        logAction('checkout', 'asset', assetId, `${updated.name} [${updated.assetTag}]`, user.name, notes || 'Checked out asset');
        return updated;
      }
      return item;
    }));
  };

  const checkinAsset = (assetId: number, newStatus: AssetStatus = 'Ready to Deploy', notes?: string) => {
    setAssets(prev => prev.map(item => {
      if (item.id === assetId) {
        const priorUser = item.assignedToName;
        const updated: Asset = {
          ...item,
          status: newStatus,
          assignedToId: null,
          assignedToName: null,
          updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
        };
        logAction('checkin', 'asset', assetId, `${updated.name} [${updated.assetTag}]`, priorUser || undefined, notes || `Checked in asset with status: ${newStatus}`);
        return updated;
      }
      return item;
    }));
  };

  const auditAsset = (assetId: number, notes?: string) => {
    setAssets(prev => prev.map(item => {
      if (item.id === assetId) {
        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
        const updated: Asset = {
          ...item,
          updatedAt: timestamp
        };
        logAction(
          'audit',
          'asset',
          assetId,
          `${updated.name} [${updated.assetTag}]`,
          updated.assignedToName || undefined,
          notes || 'Physical barcode/QR scan verified in inventory audit'
        );
        return updated;
      }
      return item;
    }));
  };

  const assignLicense = (licenseId: string, userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    setLicenses(prev => prev.map(lic => {
      if (lic.id === licenseId) {
        if (lic.assignedUserIds.includes(userId)) return lic;
        if (lic.assignedUserIds.length >= lic.totalSeats) return lic;
        
        const updated = {
          ...lic,
          assignedUserIds: [...lic.assignedUserIds, userId]
        };
        logAction('checkout', 'license', licenseId, lic.name, user.name, 'Assigned license seat');
        return updated;
      }
      return lic;
    }));
  };

  const revokeLicense = (licenseId: string, userId: string) => {
    const user = users.find(u => u.id === userId);
    setLicenses(prev => prev.map(lic => {
      if (lic.id === licenseId) {
        const updated = {
          ...lic,
          assignedUserIds: lic.assignedUserIds.filter(id => id !== userId)
        };
        logAction('checkin', 'license', licenseId, lic.name, user?.name, 'Revoked license seat');
        return updated;
      }
      return lic;
    }));
  };

  const checkoutAccessory = (accessoryId: string, userId: string, quantity: number) => {
    const user = users.find(u => u.id === userId);
    setAccessories(prev => prev.map(acc => {
      if (acc.id === accessoryId) {
        const qtyToIssue = Math.min(quantity, acc.remainingQuantity);
        if (qtyToIssue <= 0) return acc;
        const updated = {
          ...acc,
          remainingQuantity: acc.remainingQuantity - qtyToIssue
        };
        logAction('checkout', 'accessory', accessoryId, `${acc.name} (Qty: ${qtyToIssue})`, user?.name, `Issued ${qtyToIssue} accessory units`);
        return updated;
      }
      return acc;
    }));
  };

  const checkinAccessory = (accessoryId: string, quantity: number) => {
    setAccessories(prev => prev.map(acc => {
      if (acc.id === accessoryId) {
        const qtyToReturn = Math.min(quantity, acc.totalQuantity - acc.remainingQuantity);
        if (qtyToReturn <= 0) return acc;
        const updated = {
          ...acc,
          remainingQuantity: acc.remainingQuantity + qtyToReturn
        };
        logAction('checkin', 'accessory', accessoryId, `${acc.name} (Qty: ${qtyToReturn})`, undefined, `Returned ${qtyToReturn} accessory units to depot`);
        return updated;
      }
      return acc;
    }));
  };

  const consumeConsumable = (consumableId: string, userId: string, quantity: number) => {
    const user = users.find(u => u.id === userId);
    setConsumables(prev => prev.map(con => {
      if (con.id === consumableId) {
        const qtyToConsume = Math.min(quantity, con.remainingQuantity);
        if (qtyToConsume <= 0) return con;
        const updated = {
          ...con,
          remainingQuantity: con.remainingQuantity - qtyToConsume
        };
        logAction('consume', 'consumable', consumableId, `${con.name} (Qty: ${qtyToConsume})`, user?.name, `Dispatched/consumed ${qtyToConsume} items`);
        return updated;
      }
      return con;
    }));
  };

  // Event Actions
  const addEvent = (eventData: Omit<EventItem, 'id' | 'createdAt' | 'updatedAt'>, autoDispatchAssets = false) => {
    const id = 'evt-' + Date.now();
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newEvent: EventItem = {
      ...eventData,
      id,
      dispatchStatus: autoDispatchAssets ? 'Dispatched' : eventData.dispatchStatus,
      status: autoDispatchAssets ? 'Active' : eventData.status,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    // Save to backend
    fetch('http://localhost:3003/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEvent),
    })
      .then(res => res.json())
      .then(savedEvent => setEvents(prev => [savedEvent, ...prev]))
      .catch(err => {
        console.error('Failed to save event to backend', err);
        // Fallback to local state if backend fails
        setEvents(prev => [newEvent, ...prev]);
      });

    logAction('create', 'event', id, newEvent.name, newEvent.primaryRequesterName, `Created company event schedule with ${newEvent.assetIds.length} requested assets`);

    if (autoDispatchAssets && newEvent.assetIds.length > 0) {
      // Automatically deploy selected assets to the primary requester
      setAssets(prev => prev.map(asset => {
        if (newEvent.assetIds.includes(String(asset.id))) {
          logAction(
            'checkout',
            'asset',
            asset.id,
            `${asset.name} [${asset.assetTag}]`,
            newEvent.primaryRequesterName,
            `Dispatched for Event: ${newEvent.name} (${newEvent.location})`
          );
          return {
            ...asset,
            status: 'Deployed',
            assignedToId: newEvent.primaryRequesterId,
            assignedToName: newEvent.primaryRequesterName,
            updatedAt: timestamp,
          };
        }
        return asset;
      }));
    }
  };

  const updateEvent = (id: string, updates: Partial<EventItem>) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setEvents(prev => prev.map(event => {
      if (event.id === id) {
        const updated = {
          ...event,
          ...updates,
          updatedAt: timestamp
        };
        logAction('update', 'event', id, updated.name, updated.primaryRequesterName, 'Updated event details and dispatch allocation');
        return updated;
      }
      return event;
    }));
  };

  const deleteEvent = (id: string) => {
    const target = events.find(e => e.id === id);
    if (!target) return;
    setEvents(prev => prev.filter(e => e.id !== id));
    logAction('delete', 'event', id, target.name, target.primaryRequesterName, 'Deleted event schedule');
  };

  const dispatchAllEventAssets = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);

    // Update event status
    const newStatus = event.status === 'Completed' || event.status === 'Cancelled' ? event.status : 'Active';
    setEvents(prev => prev.map(e => {
      if (e.id === eventId) {
        return {
          ...e,
          dispatchStatus: 'Dispatched',
          status: newStatus,
          updatedAt: timestamp,
        };
      }
      return e;
    }));

    // Mark assets as deployed in local state and DB
    if (event.assetIds.length > 0) {
      event.assetIds.forEach(assetIdStr => {
        const assetId = parseInt(assetIdStr);
        if (!isNaN(assetId)) {
          updateAsset(assetId, {
            status: 'Deployed',
            assignedToId: event.primaryRequesterId,
            assignedToName: event.primaryRequesterName,
          });
        }
      });
    }
    if (event.assetIds.length > 0) {
      setAssets(prev => prev.map(asset => {
        if (event.assetIds.includes(String(asset.id))) {
          logAction(
            'checkout',
            'asset',
            asset.id,
            `${asset.name} [${asset.assetTag}]`,
            event.primaryRequesterName,
            `Dispatched for Event: ${event.name} (${event.location})`
          );
          return {
            ...asset,
            status: 'Deployed',
            assignedToId: event.primaryRequesterId,
            assignedToName: event.primaryRequesterName,
            updatedAt: timestamp,
          };
        }
        return asset;
      }));
    }

    logAction('update', 'event', eventId, event.name, event.primaryRequesterName, `Dispatched all ${event.assetIds.length} assets for event`);
  };

  const returnAllEventAssets = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);

    // Update event status
    setEvents(prev => prev.map(e => {
      if (e.id === eventId) {
        return {
          ...e,
          dispatchStatus: 'Returned',
          status: 'Completed',
          updatedAt: timestamp,
        };
      }
      return e;
    }));

    // Mark assets as Ready to Deploy in local state and DB
    if (event.assetIds.length > 0) {
      event.assetIds.forEach(assetIdStr => {
        const assetId = parseInt(assetIdStr);
        if (!isNaN(assetId)) {
          updateAsset(assetId, {
            status: 'Ready to Deploy',
            assignedToId: null,
            assignedToName: null,
          });
        }
      });
    }
    if (event.assetIds.length > 0) {
      setAssets(prev => prev.map(asset => {
        if (event.assetIds.includes(String(asset.id))) {
          logAction(
            'checkin',
            'asset',
            asset.id,
            `${asset.name} [${asset.assetTag}]`,
            event.primaryRequesterName,
            `Checked back in from Event: ${event.name}`
          );
          return {
            ...asset,
            status: 'Ready to Deploy',
            assignedToId: null,
            assignedToName: null,
            updatedAt: timestamp,
          };
        }
        return asset;
      }));
    }

    logAction('update', 'event', eventId, event.name, event.primaryRequesterName, `Checked in all returned assets from event. Event marked Completed.`);
  };

  // const resetToDefaults = () => {
  //   setAssets(initialAssets);
  //   setLicenses(initialLicenses);
  //   setAccessories(initialAccessories);
  //   setConsumables(initialConsumables);
  //   setEvents(initialEvents);
  //   setActivityLogs(initialActivityLogs);
  //   try {
  //     localStorage.clear();
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

  const exportDataJson = () => {
    const data = {
      assets,
      licenses,
      accessories,
      consumables,
      users,
      events,
      activityLogs,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `acipl_ipnet_ims_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        currentUser,
        isAuthenticated,
        login,
        quickLogin,
        logout,
        assets,
        licenses,
        accessories,
        consumables,
        users,
        events,
        activityLogs,
        addAsset,
        updateAsset,
        deleteAsset,
        checkoutAsset,
        checkinAsset,
        auditAsset,
        assignLicense,
        revokeLicense,
        checkoutAccessory,
        checkinAccessory,
        consumeConsumable,
        addEvent,
        updateEvent,
        deleteEvent,
        dispatchAllEventAssets,
        returnAllEventAssets,
        exportDataJson,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
