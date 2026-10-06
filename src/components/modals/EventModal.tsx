import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { EventItem, EventStatus, DispatchStatus, Asset, User } from '../../types';
import { 
  X, 
  Calendar, 
  MapPin, 
  Users, 
  Laptop, 
  Check, 
  AlertCircle, 
  Search, 
  Info,
  Phone,
  Mail,
  FileText,
  Truck
} from 'lucide-react';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventToEdit?: EventItem | null;
}

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  eventToEdit
}) => {
  const { users, assets, addEvent, updateEvent } = useApp();

  const [name, setName] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [projectCode, setProjectCode] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [expectedReturnDate, setExpectedReturnDate] = useState('');
  const [location, setLocation] = useState('');
  const [purposeOrDescription, setPurposeOrDescription] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [status, setStatus] = useState<EventStatus>('Upcoming');
  const [dispatchStatus, setDispatchStatus] = useState<DispatchStatus>('Pending Dispatch');

  // Selected Requesters
  const [selectedRequesterIds, setSelectedRequesterIds] = useState<string[]>([]);
  const [primaryRequesterId, setPrimaryRequesterId] = useState<string>('');

  // Selected Assets
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);
  const [autoDispatchAssets, setAutoDispatchAssets] = useState(false);

  // Search filters inside modal
  const [userSearch, setUserSearch] = useState('');
  const [assetSearch, setAssetSearch] = useState('');
  const [assetCategoryFilter, setAssetCategoryFilter] = useState('All');

  // Form error
  const [error, setError] = useState<string | null>(null);

  // Populate form on edit or reset on create
  useEffect(() => {
    if (eventToEdit) {
      setName(eventToEdit.name || '');
      setDepartment(eventToEdit.department || 'Engineering');
      setProjectCode(eventToEdit.projectCode || '');
      setStartDate(eventToEdit.startDate || '');
      setEndDate(eventToEdit.endDate || '');
      setExpectedReturnDate(eventToEdit.expectedReturnDate || '');
      setLocation(eventToEdit.location || '');
      setPurposeOrDescription(eventToEdit.purposeOrDescription || '');
      setContactPhone(eventToEdit.contactPhone || '');
      setContactEmail(eventToEdit.contactEmail || '');
      setSpecialInstructions(eventToEdit.specialInstructions || '');
      setStatus(eventToEdit.status);
      setDispatchStatus(eventToEdit.dispatchStatus);
      setSelectedRequesterIds(eventToEdit.requesterIds || []);
      setPrimaryRequesterId(eventToEdit.primaryRequesterId || '');
      setSelectedAssetIds(eventToEdit.assetIds || []);
      setAutoDispatchAssets(false);
    } else {
      // Default to next week
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      const returnDate = new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000);

      setName('');
      setDepartment('Engineering');
      setProjectCode('');
      setStartDate(today.toISOString().slice(0, 10));
      setEndDate(nextWeek.toISOString().slice(0, 10));
      setExpectedReturnDate(returnDate.toISOString().slice(0, 10));
      setLocation('');
      setPurposeOrDescription('');
      setContactPhone('');
      setContactEmail('');
      setSpecialInstructions('');
      setStatus('Upcoming');
      setDispatchStatus('Pending Dispatch');
      setSelectedRequesterIds(users.length > 0 ? [users[0].id] : []);
      setPrimaryRequesterId(users.length > 0 ? users[0].id : '');
      setSelectedAssetIds([]);
      setAutoDispatchAssets(false);
    }
    setError(null);
    setUserSearch('');
    setAssetSearch('');
    setAssetCategoryFilter('All');
  }, [eventToEdit, isOpen, users]);

  if (!isOpen) return null;

  // Requesters handling
  const toggleRequester = (userId: string) => {
    if (selectedRequesterIds.includes(userId)) {
      const next = selectedRequesterIds.filter(id => id !== userId);
      setSelectedRequesterIds(next);
      if (primaryRequesterId === userId) {
        setPrimaryRequesterId(next[0] || '');
      }
    } else {
      const next = [...selectedRequesterIds, userId];
      setSelectedRequesterIds(next);
      if (!primaryRequesterId) {
        setPrimaryRequesterId(userId);
      }
    }
  };

  // Assets handling
  const toggleAsset = (assetId: string) => {
    if (selectedAssetIds.includes(assetId)) {
      setSelectedAssetIds(prev => prev.filter(id => id !== assetId));
    } else {
      setSelectedAssetIds(prev => [...prev, assetId]);
    }
  };

  // Asset categories
  const categories = ['All', ...Array.from(new Set(assets.map(a => a.category)))];

  // Filtered lists
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.department.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredAssets = assets.filter(a => {
    const matchesCat = assetCategoryFilter === 'All' || a.category === assetCategoryFilter;
    const matchesSearch = 
      a.name.toLowerCase().includes(assetSearch.toLowerCase()) ||
      a.assetTag.toLowerCase().includes(assetSearch.toLowerCase()) ||
      a.model.toLowerCase().includes(assetSearch.toLowerCase()) ||
      a.serial.toLowerCase().includes(assetSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Event Name is required.');
      return;
    }
    if (!startDate) {
      setError('Event From Date is required.');
      return;
    }
    if (!endDate) {
      setError('Event To Date is required.');
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      setError('To Date cannot be earlier than From Date.');
      return;
    }
    if (!location.trim()) {
      setError('Event Location / Venue is required.');
      return;
    }
    if (selectedRequesterIds.length === 0) {
      setError('Please choose at least one person who requested the event/assets.');
      return;
    }

    const primaryUser = users.find(u => u.id === (primaryRequesterId || selectedRequesterIds[0]));
    const primaryName = primaryUser ? primaryUser.name : 'Unknown';
    const requesterNamesList = selectedRequesterIds
      .map(id => users.find(u => u.id === id)?.name)
      .filter(Boolean) as string[];

    if (eventToEdit) {
      updateEvent(eventToEdit.id, {
        name: name.trim(),
        department,
        projectCode: projectCode.trim(),
        startDate,
        endDate,
        expectedReturnDate: expectedReturnDate || endDate,
        location: location.trim(),
        purposeOrDescription: purposeOrDescription.trim(),
        contactPhone: contactPhone.trim(),
        contactEmail: contactEmail.trim(),
        specialInstructions: specialInstructions.trim(),
        status,
        dispatchStatus,
        primaryRequesterId: primaryUser ? primaryUser.id : selectedRequesterIds[0],
        primaryRequesterName: primaryName,
        requesterIds: selectedRequesterIds,
        requesterNames: requesterNamesList,
        assetIds: selectedAssetIds,
      });
    } else {
      addEvent({
        name: name.trim(),
        department,
        projectCode: projectCode.trim(),
        startDate,
        endDate,
        expectedReturnDate: expectedReturnDate || endDate,
        location: location.trim(),
        purposeOrDescription: purposeOrDescription.trim(),
        contactPhone: contactPhone.trim(),
        contactEmail: contactEmail.trim(),
        specialInstructions: specialInstructions.trim(),
        status: autoDispatchAssets ? 'Active' : status,
        dispatchStatus: autoDispatchAssets ? 'Dispatched' : dispatchStatus,
        primaryRequesterId: primaryUser ? primaryUser.id : selectedRequesterIds[0],
        primaryRequesterName: primaryName,
        requesterIds: selectedRequesterIds,
        requesterNames: requesterNamesList,
        assetIds: selectedAssetIds,
      }, autoDispatchAssets);
    }

    onClose();
  };

  return (
    <div 
      id="event-modal-backdrop" 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
    >
      <div 
        id="event-modal-container"
        className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-slate-800"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {eventToEdit ? 'Edit Event & Hardware Dispatch' : 'Create Event & Dispatch Hardware'}
              </h2>
              <p className="text-xs text-slate-500">
                Schedule company event, assign requested hardware assets, and designate requesters.
              </p>
            </div>
          </div>
          <button
            id="close-event-modal-btn"
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Basic Event Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
              <FileText className="w-3.5 h-3.5 text-sky-600" />
              <span>Event Details & Logistics</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Event Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="event-name-input"
                  type="text"
                  required
                  placeholder="e.g. Q4 Enterprise AI Summit 2024"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Department / Unit
                </label>
                <select
                  id="event-department-select"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Security & Infrastructure">Security & Infrastructure</option>
                  <option value="Product Design">Product Design</option>
                  <option value="Executive Operations">Executive Operations</option>
                  <option value="Marketing & Sales">Marketing & Sales</option>
                  <option value="IT Support & Ops">IT Support & Ops</option>
                  <option value="People Operations">People Operations</option>
                </select>
              </div>
            </div>

            {/* Dates & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  From Date <span className="text-rose-500">*</span>
                </label>
                <input
                  id="event-start-date-input"
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  To Date <span className="text-rose-500">*</span>
                </label>
                <input
                  id="event-end-date-input"
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Expected Return Date
                </label>
                <input
                  id="event-return-date-input"
                  type="date"
                  value={expectedReturnDate}
                  onChange={(e) => setExpectedReturnDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Project / Cost Code
                </label>
                <input
                  id="event-project-code-input"
                  type="text"
                  placeholder="e.g. PRJ-EXPO-2024"
                  value={projectCode}
                  onChange={(e) => setProjectCode(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            {/* Venue Location & Contacts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Venue / Location <span className="text-rose-500">*</span></span>
                </label>
                <input
                  id="event-location-input"
                  type="text"
                  required
                  placeholder="e.g. Moscone Center, Booth 402"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center space-x-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Contact Phone</span>
                </label>
                <input
                  id="event-phone-input"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center space-x-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Contact Email</span>
                </label>
                <input
                  id="event-email-input"
                  type="email"
                  placeholder="lead@company.internal"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            {/* Statuses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Event Status
                </label>
                <select
                  id="event-status-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as EventStatus)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                >
                  <option value="Upcoming">Upcoming</option>
                  <option value="Active">Active / Ongoing</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hardware Dispatch State
                </label>
                <select
                  id="event-dispatch-status-select"
                  value={dispatchStatus}
                  onChange={(e) => setDispatchStatus(e.target.value as DispatchStatus)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                >
                  <option value="Pending Dispatch">Pending Dispatch</option>
                  <option value="Dispatched">Dispatched</option>
                  <option value="Partially Returned">Partially Returned</option>
                  <option value="Returned">Returned</option>
                </select>
              </div>
            </div>
          </div>

          <hr className="border-slate-200" />

          {/* Section 2: Choose People Who Had Requested Them */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <Users className="w-3.5 h-3.5 text-sky-600" />
                  <span>Choose People Who Had Requested Them <span className="text-rose-500">*</span></span>
                </h3>
                <p className="text-xs text-slate-500">
                  Select all employees/team members involved in this event request. Mark one as primary lead.
                </p>
              </div>
              <div className="text-xs font-medium text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-200 self-start">
                {selectedRequesterIds.length} person(s) selected
              </div>
            </div>

            {/* Search user */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                id="search-requester-input"
                type="text"
                placeholder="Search employees by name, department, or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50 focus:bg-white"
              />
            </div>

            {/* User selection cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1 border border-slate-200 rounded-lg bg-slate-50/50">
              {filteredUsers.map((user) => {
                const isSelected = selectedRequesterIds.includes(user.id);
                const isPrimary = primaryRequesterId === user.id;

                return (
                  <div
                    key={user.id}
                    id={`requester-select-${user.id}`}
                    onClick={() => toggleRequester(user.id)}
                    className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all flex items-start space-x-2.5 ${
                      isSelected 
                        ? 'border-sky-500 bg-sky-50/80 shadow-xs' 
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border ${
                      isSelected ? 'bg-sky-600 border-sky-600 text-white' : 'border-slate-300 bg-white'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-slate-900 truncate">{user.name}</p>
                        {isSelected && (
                          <button
                            type="button"
                            title="Set as Primary Lead"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPrimaryRequesterId(user.id);
                            }}
                            className={`text-[10px] px-1.5 py-0.5 rounded font-medium cursor-pointer ${
                              isPrimary ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            }`}
                          >
                            {isPrimary ? 'Primary Lead' : 'Make Lead'}
                          </button>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">{user.department}</p>
                      <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <hr className="border-slate-200" />

          {/* Section 3: Choose Assets to be Dispatched */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <Laptop className="w-3.5 h-3.5 text-sky-600" />
                  <span>Choose Assets to be Dispatched</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Select hardware equipment to assign and dispatch for this event manifest.
                </p>
              </div>
              <div className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 self-start">
                {selectedAssetIds.length} asset(s) chosen
              </div>
            </div>

            {/* Asset search and category filter */}
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  id="search-asset-input"
                  type="text"
                  placeholder="Search assets by tag, name, model, serial..."
                  value={assetSearch}
                  onChange={(e) => setAssetSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50 focus:bg-white"
                />
              </div>
              <select
                id="filter-asset-category"
                value={assetCategoryFilter}
                onChange={(e) => setAssetCategoryFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Assets Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-56 overflow-y-auto p-1 border border-slate-200 rounded-lg bg-slate-50/50">
              {filteredAssets.map((asset) => {
                const isSelected = selectedAssetIds.includes(String(asset.id));
                const isAvailable = asset.status === 'Ready to Deploy';

                return (
                  <div
                    key={asset.id}
                    id={`asset-select-${asset.id}`}
                    onClick={() => toggleAsset(String(asset.id))}
                    className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all flex items-start space-x-2.5 ${
                      isSelected 
                        ? 'border-emerald-500 bg-emerald-50/80 shadow-xs' 
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border ${
                      isSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono font-bold text-slate-700 bg-slate-100 px-1 py-0.5 rounded">
                          {asset.assetTag}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                          isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {asset.status}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-900 truncate mt-1">{asset.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{asset.category} &bull; S/N: {asset.serial || 'N/A'}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Auto-dispatch option checkbox */}
            {!eventToEdit && (
              <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer pt-1">
                <input
                  id="auto-dispatch-checkbox"
                  type="checkbox"
                  checked={autoDispatchAssets}
                  onChange={(e) => setAutoDispatchAssets(e.target.checked)}
                  className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4"
                />
                <span className="flex items-center space-x-1">
                  <Truck className="w-3.5 h-3.5 text-sky-600" />
                  <span><strong>Immediately dispatch & checkout</strong> selected hardware to the primary requester upon saving</span>
                </span>
              </label>
            )}
          </div>

          <hr className="border-slate-200" />

          {/* Section 4: Purpose & Special Instructions */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Info className="w-3.5 h-3.5 text-sky-600" />
              <span>Purpose & Handling Instructions</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Event Purpose / Description
              </label>
              <textarea
                id="event-purpose-textarea"
                rows={6}
                placeholder="Describe the operational purpose, booth demo setup, or client presentation requirements..."
                value={purposeOrDescription}
                onChange={(e) => setPurposeOrDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Special Logistics, Packaging & Security Instructions
              </label>
              <textarea
                id="event-instructions-textarea"
                rows={2}
                placeholder="e.g. Flight case packing, power strips, HDMI cords, security check-in protocols, tamper-proof seal..."
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-200 bg-slate-50">
          <div className="text-xs text-slate-500">
            {selectedAssetIds.length} asset(s) ready for dispatch
          </div>
          <div className="flex items-center space-x-2">
            <button
              id="cancel-event-modal-btn"
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="save-event-btn"
              type="button"
              onClick={handleSubmit}
              className="px-5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors shadow-xs cursor-pointer flex items-center space-x-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{eventToEdit ? 'Save Changes' : 'Create Event'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
