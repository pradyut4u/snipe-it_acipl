import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { EventItem, EventStatus, DispatchStatus } from '../types';
import { 
  Calendar, 
  Search, 
  Plus, 
  Filter, 
  MapPin, 
  Users, 
  Laptop, 
  Download, 
  FileText, 
  Table, 
  Edit3, 
  Trash2, 
  Eye, 
  Truck, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  ChevronDown
} from 'lucide-react';
import { exportEventsToPDF, exportEventsToCSV, exportEventGatePassPDF } from '../utils/exportUtils';

interface EventsListProps {
  onOpenNewEventModal: () => void;
  onOpenEditEventModal: (event: EventItem) => void;
  onOpenDetailModal: (event: EventItem) => void;
}

export const EventsList: React.FC<EventsListProps> = ({
  onOpenNewEventModal,
  onOpenEditEventModal,
  onOpenDetailModal
}) => {
  const { events, assets, deleteEvent, dispatchAllEventAssets, returnAllEventAssets, searchQuery, setSearchQuery } = useApp();

  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedDispatchStatus, setSelectedDispatchStatus] = useState<string>('All');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Departments set
  const departments = useMemo(() => {
    const set = new Set<string>();
    events.forEach(e => {
      if (e.department) set.add(e.department);
    });
    return ['All', ...Array.from(set)];
  }, [events]);

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      if (selectedStatus !== 'All' && event.status !== selectedStatus) return false;
      if (selectedDispatchStatus !== 'All' && event.dispatchStatus !== selectedDispatchStatus) return false;
      if (selectedDepartment !== 'All' && event.department !== selectedDepartment) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = event.name.toLowerCase().includes(q);
        const matchesLocation = event.location.toLowerCase().includes(q);
        const matchesRequester = event.primaryRequesterName.toLowerCase().includes(q);
        const matchesDept = event.department.toLowerCase().includes(q);
        const matchesProject = event.projectCode?.toLowerCase().includes(q) || false;
        const matchesAssetTag = event.assetIds.some(id => {
          const a = assets.find(x => x.id === id);
          return a ? a.assetTag.toLowerCase().includes(q) || a.name.toLowerCase().includes(q) : false;
        });

        if (!matchesName && !matchesLocation && !matchesRequester && !matchesDept && !matchesProject && !matchesAssetTag) {
          return false;
        }
      }
      return true;
    });
  }, [events, assets, selectedStatus, selectedDispatchStatus, selectedDepartment, searchQuery]);

  // Metric summaries
  const upcomingCount = events.filter(e => e.status === 'Upcoming').length;
  const activeCount = events.filter(e => e.status === 'Active').length;
  const totalAllocatedAssets = events.reduce((sum, e) => sum + (e.assetIds?.length || 0), 0);

  const getStatusBadge = (status: EventStatus) => {
    switch (status) {
      case 'Upcoming':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3 h-3 mr-1" />
            Upcoming
          </span>
        );
      case 'Active':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
            Active
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Completed
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  const getDispatchBadge = (status: DispatchStatus) => {
    switch (status) {
      case 'Pending Dispatch':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
            Pending Dispatch
          </span>
        );
      case 'Dispatched':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Truck className="w-3 h-3 mr-1" />
            Dispatched
          </span>
        );
      case 'Partially Returned':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-orange-50 text-orange-700 border border-orange-200">
            Partially Returned
          </span>
        );
      case 'Returned':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-teal-50 text-teal-700 border border-teal-200">
            Returned
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div id="events-list-container" className="space-y-4">
      {/* Top Banner & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Events & Hardware Dispatch</h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-sky-50 text-sky-700 border border-sky-200">
              {events.length} Scheduled
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Schedule company summits, conferences, client demos, and manage dispatched IT hardware manifests.
          </p>
        </div>

        <div className="flex items-center space-x-2.5 self-start sm:self-auto">
          {/* Export Dropdown Button */}
          <div className="relative">
            <button
              id="export-events-btn"
              type="button"
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="inline-flex items-center space-x-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-3 py-2 rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showExportMenu && (
              <div 
                className="absolute right-0 mt-1.5 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-30 text-xs animate-in fade-in zoom-in-95"
                onMouseLeave={() => setShowExportMenu(false)}
              >
                <button
                  type="button"
                  onClick={() => {
                    exportEventsToPDF(filteredEvents, assets);
                    setShowExportMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 flex items-center space-x-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-rose-600" />
                  <div>
                    <div className="font-semibold">Export as PDF</div>
                    <div className="text-[10px] text-slate-400">Formal dispatch schedule</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    exportEventsToCSV(filteredEvents, assets);
                    setShowExportMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 flex items-center space-x-2 cursor-pointer"
                >
                  <Table className="w-4 h-4 text-emerald-600" />
                  <div>
                    <div className="font-semibold">Export as CSV</div>
                    <div className="text-[10px] text-slate-400">Spreadsheet / Excel table</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Create Event Button */}
          <button
            id="create-event-btn"
            type="button"
            onClick={onOpenNewEventModal}
            className="inline-flex items-center space-x-1.5 bg-sky-600 hover:bg-sky-700 text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Event</span>
          </button>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <div className="text-lg font-bold text-slate-900">{events.length}</div>
            <div className="text-[11px] text-slate-500">Total Events</div>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-lg font-bold text-slate-900">{upcomingCount}</div>
            <div className="text-[11px] text-slate-500">Upcoming Events</div>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-lg font-bold text-slate-900">{activeCount}</div>
            <div className="text-[11px] text-slate-500">Active / In Field</div>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Laptop className="w-4 h-4" />
          </div>
          <div>
            <div className="text-lg font-bold text-slate-900">{totalAllocatedAssets}</div>
            <div className="text-[11px] text-slate-500">Hardware Allocated</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Event Status Filter */}
          <div className="flex items-center space-x-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">Status:</span>
            <select
              id="filter-event-status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium text-slate-700"
            >
              <option value="All">All Statuses</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Dispatch Status Filter */}
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-500 font-medium">Dispatch:</span>
            <select
              id="filter-event-dispatch-status"
              value={selectedDispatchStatus}
              onChange={(e) => setSelectedDispatchStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium text-slate-700"
            >
              <option value="All">All Dispatch States</option>
              <option value="Pending Dispatch">Pending Dispatch</option>
              <option value="Dispatched">Dispatched</option>
              <option value="Partially Returned">Partially Returned</option>
              <option value="Returned">Returned</option>
            </select>
          </div>

          {/* Department Filter */}
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-500 font-medium">Dept:</span>
            <select
              id="filter-event-department"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium text-slate-700"
            >
              {departments.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            id="search-events-input"
            type="text"
            placeholder="Search events, requesters, venue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table id="events-table" className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Event & Venue</th>
                <th className="px-4 py-3">Dates (From &rarr; To)</th>
                <th className="px-4 py-3">Requested By</th>
                <th className="px-4 py-3">Dispatched Assets</th>
                <th className="px-4 py-3">Event Status</th>
                <th className="px-4 py-3">Dispatch State</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                    <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-medium text-slate-600 text-xs">No events found matching current criteria.</p>
                    <button
                      type="button"
                      onClick={onOpenNewEventModal}
                      className="mt-3 text-xs text-sky-600 hover:text-sky-800 font-semibold cursor-pointer"
                    >
                      + Create the first event now
                    </button>
                  </td>
                </tr>
              ) : (
                filteredEvents.map((event) => {
                  const eventAssetObjects = event.assetIds
                    .map(id => assets.find(a => a.id === id))
                    .filter(Boolean);

                  return (
                    <tr key={event.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Event & Venue */}
                      <td className="px-4 py-3.5 max-w-xs">
                        <div className="flex items-start space-x-2">
                          <div>
                            <button
                              id={`event-name-${event.id}`}
                              type="button"
                              onClick={() => onOpenDetailModal(event)}
                              className="font-bold text-slate-900 hover:text-sky-600 text-left transition-colors cursor-pointer block"
                            >
                              {event.name}
                            </button>
                            <div className="flex items-center space-x-2 mt-0.5 text-[11px] text-slate-500">
                              <span className="flex items-center">
                                <MapPin className="w-3 h-3 text-slate-400 mr-0.5 shrink-0" />
                                <span className="truncate">{event.location}</span>
                              </span>
                              <span>&bull;</span>
                              <span className="text-slate-600">{event.department}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Dates */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="font-semibold text-slate-800 text-xs">
                          {event.startDate}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          to {event.endDate}
                        </div>
                      </td>

                      {/* Requested By */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center space-x-1.5">
                          <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                            {event.primaryRequesterName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 leading-tight">
                              {event.primaryRequesterName}
                            </div>
                            {event.requesterNames && event.requesterNames.length > 1 && (
                              <div className="text-[10px] text-slate-400">
                                +{event.requesterNames.length - 1} other requester(s)
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Dispatched Assets */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center space-x-1.5 mb-1">
                          <span className="font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                            {event.assetIds.length} Assets
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {eventAssetObjects.slice(0, 3).map((a) => (
                            <span 
                              key={a!.id} 
                              className="font-mono text-[10px] bg-sky-50 text-sky-700 border border-sky-200 px-1 py-0.5 rounded"
                              title={`${a!.name} (${a!.model})`}
                            >
                              {a!.assetTag}
                            </span>
                          ))}
                          {eventAssetObjects.length > 3 && (
                            <span className="text-[10px] text-slate-400 self-center">
                              +{eventAssetObjects.length - 3} more
                            </span>
                          )}
                          {eventAssetObjects.length === 0 && (
                            <span className="text-[11px] text-slate-400 italic">None selected</span>
                          )}
                        </div>
                      </td>

                      {/* Event Status */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {getStatusBadge(event.status)}
                      </td>

                      {/* Dispatch State */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {getDispatchBadge(event.dispatchStatus)}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-1">
                          {/* Quick Dispatch / Return buttons */}
                          {event.dispatchStatus !== 'Dispatched' ? (
                            <button
                              id={`quick-dispatch-${event.id}`}
                              type="button"
                              onClick={() => dispatchAllEventAssets(event.id)}
                              title="Dispatch all hardware to event"
                              className="p-1 text-sky-600 hover:bg-sky-50 rounded transition-colors cursor-pointer"
                            >
                              <Truck className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              id={`quick-return-${event.id}`}
                              type="button"
                              onClick={() => returnAllEventAssets(event.id)}
                              title="Check in / return all assets to inventory"
                              className="p-1 text-emerald-600 hover:bg-emerald-50 rounded transition-colors cursor-pointer"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                          )}

                          {/* Gate Pass Download */}
                          <button
                            id={`gate-pass-${event.id}`}
                            type="button"
                            onClick={() => exportEventGatePassPDF(event, assets)}
                            title="Download Equipment Dispatch Gate Pass PDF"
                            className="p-1 text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                          >
                            <Download className="w-4 h-4" />
                          </button>

                          {/* View Detail */}
                          <button
                            id={`view-event-${event.id}`}
                            type="button"
                            onClick={() => onOpenDetailModal(event)}
                            title="View Event & Hardware Details"
                            className="p-1 text-slate-500 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Edit Event */}
                          <button
                            id={`edit-event-${event.id}`}
                            type="button"
                            onClick={() => onOpenEditEventModal(event)}
                            title="Edit Event"
                            className="p-1 text-slate-500 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Delete Event */}
                          <button
                            id={`delete-event-${event.id}`}
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete event "${event.name}"?`)) {
                                deleteEvent(event.id);
                              }
                            }}
                            title="Delete Event"
                            className="p-1 text-rose-500 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
