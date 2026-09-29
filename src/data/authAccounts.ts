import { AuthUser } from '../types';

export interface PredefinedAccount extends AuthUser {
  passwordHash: string;
  description: string;
}

export const PREDEFINED_ACCOUNTS: PredefinedAccount[] = [
  {
    id: 'usr-6',
    name: 'James Wright',
    email: 'admin@acipl.com',
    role: 'Superadmin',
    employeeNum: 'EMP-1144',
    department: 'IT Operations & Infrastructure',
    location: 'San Francisco HQ',
    passwordHash: 'admin123',
    description: 'Full administrative access across all assets, licenses, logs, and system operations.'
  },
  {
    id: 'usr-2',
    name: 'Sarah Connor',
    email: 'sarah.connor@company.internal',
    role: 'IT Admin',
    employeeNum: 'EMP-1008',
    department: 'Security & Infrastructure',
    location: 'San Francisco HQ',
    passwordHash: 'sarah123',
    description: 'Manages hardware assets, software licenses, and team user allocations.'
  },
  {
    id: 'usr-4',
    name: 'Elena Rostova',
    email: 'elena.rostova@company.internal',
    role: 'Inventory Manager',
    employeeNum: 'EMP-1095',
    department: 'Hardware Logistics & Warehouse',
    location: 'London Hub',
    passwordHash: 'elena123',
    description: 'Oversees accessory stock, consumables replenishment, and dispatch events.'
  },
  {
    id: 'usr-tech',
    name: 'Michael Rodriguez',
    email: 'tech@acipl.com',
    role: 'Technician',
    employeeNum: 'EMP-1205',
    department: 'Field & Service Support',
    location: 'New York Office',
    passwordHash: 'tech123',
    description: 'Barcode scanning, equipment audits, repairs, and hardware deployment.'
  }
];

export const DEFAULT_AUTH_USER: AuthUser = {
  id: PREDEFINED_ACCOUNTS[0].id,
  name: PREDEFINED_ACCOUNTS[0].name,
  email: PREDEFINED_ACCOUNTS[0].email,
  role: PREDEFINED_ACCOUNTS[0].role,
  employeeNum: PREDEFINED_ACCOUNTS[0].employeeNum,
  department: PREDEFINED_ACCOUNTS[0].department,
  location: PREDEFINED_ACCOUNTS[0].location,
  lastLogin: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
};
