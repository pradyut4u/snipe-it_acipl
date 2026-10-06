export type AssetStatus = 'Ready to Deploy' | 'Deployed' | 'Pending' | 'In Repair' | 'Archived';

export interface Asset {
  id: number;
  assetTag: string;
  name: string;
  model: string;
  category: string;
  serial: string;
  status: AssetStatus;
  assignedToId?: string | null;
  assignedToName?: string | null;
  purchaseDate: string;
  purchaseCost: number;
  notes?: string;
  updatedAt: string;
}

export interface License {
  id: string;
  name: string;
  category: string;
  key: string;
  totalSeats: number;
  assignedUserIds: string[];
  expirationDate: string;
  manufacturer: string;
  purchaseCost: number;
}

export interface Accessory {
  id: string;
  name: string;
  category: string;
  modelNumber: string;
  totalQuantity: number;
  remainingQuantity: number;
  minQuantity: number;
  location: string;
}

export interface Consumable {
  id: string;
  name: string;
  category: string;
  modelNumber: string;
  totalQuantity: number;
  remainingQuantity: number;
  minQuantity: number;
  location: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  employeeNum: string;
  department: string;
  location: string;
  avatarUrl?: string;
}

export type UserRole = 'Superadmin' | 'Admin' | 'Inventory Manager' | 'Tech';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  employeeNum: string;
  department: string;
  location: string;
  avatarUrl?: string;
  lastLogin?: string;
}

export type ActionType = 'checkout' | 'checkin' | 'create' | 'update' | 'delete' | 'consume' | 'audit' | 'login' | 'logout';
export type ItemType = 'asset' | 'license' | 'accessory' | 'consumable' | 'event' | 'system';

export interface ActivityLog {
  id: string;
  action: ActionType;
  itemType: ItemType;
  itemId: string;
  itemName: string;
  targetUserName?: string;
  adminName: string;
  timestamp: string;
  notes?: string;
}

export type EventStatus = 'Upcoming' | 'Active' | 'Completed' | 'Cancelled';
export type DispatchStatus = 'Pending Dispatch' | 'Dispatched' | 'Partially Returned' | 'Returned';

export interface EventItem {
  id: string;
  name: string;
  department: string;
  startDate: string; // e.g., '2024-10-15'
  endDate: string;   // e.g., '2024-10-18'
  location: string;
  primaryRequesterId: string;
  primaryRequesterName: string;
  requesterIds: string[];
  requesterNames: string[];
  assetIds: string[];
  status: EventStatus;
  dispatchStatus: DispatchStatus;
  purposeOrDescription: string;
  expectedReturnDate?: string;
  contactPhone?: string;
  contactEmail?: string;
  projectCode?: string;
  specialInstructions?: string;
  createdAt: string;
  updatedAt: string;
}

export type ActiveTab = 'dashboard' | 'my-portal' | 'assets' | 'events' | 'barcodes' | 'licenses' | 'accessories' | 'consumables' | 'users' | 'activity';

export interface ScanAuditRecord {
  id: string;
  scannedText: string;
  matchedType: 'asset' | 'accessory' | 'consumable' | 'event' | 'unknown';
  matchedItem?: Asset | Accessory | Consumable | EventItem;
  timestamp: string;
  notes?: string;
}

