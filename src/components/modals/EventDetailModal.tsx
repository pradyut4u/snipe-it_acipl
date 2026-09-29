import React from 'react';
import { useApp } from '../../context/AppContext';
import { EventItem, Asset } from '../../types';
import { 
  X, 
  Calendar, 
  MapPin, 
  Users, 
  Laptop, 
  FileText, 
  Download, 
  Printer, 
  Truck, 
  RotateCcw, 
  Clock, 
  Tag, 
  Phone, 
  Mail, 
  ShieldCheck, 
  AlertTriangle,
  Edit2
} from 'lucide-react';
import { exportEventGatePassPDF } from '../../utils/exportUtils';

interface EventDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventItem | null;
  onEdit: (event: EventItem) => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  isOpen,
  onClose,
  event,
  onEdit
}) => {
  const { assets, users, dispatchAllEventAssets, returnAllEventAssets } = useApp();

  if (!isOpen || !event) return null;

  const eventAssets = event.assetIds
    .map(id => assets.find(a => a.id === id))
    .filter(Boolean) as Asset[];

  const primaryUser = users.find(u => u.id === event.primaryRequesterId);

  // Status badge styling
  const getStatusBadge = (status: EventItem['status']) => {
    switch (status) {
      case 'Upcoming':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Active':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200 animate-pulse';
      case 'Completed':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getDispatchBadge = (dispatchStatus: EventItem['dispatchStatus']) => {
    switch (dispatchStatus) {
      case 'Dispatched':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Pending Dispatch':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Returned':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'Partially Returned':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const handleExportGatePass = () => {
    exportEventGatePassPDF(event, assets);
  };

  return (
    <div 
      id="event-detail-backdrop" 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
    >
      <div 
        id="event-detail-container"
        className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-slate-800"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-900 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-sky-600/30 border border-sky-400/30 text-sky-400 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-white tracking-tight">{event.name}</h2>
                {event.projectCode && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {event.projectCode}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {event.department} &bull; Manifest ID: #{event.id.toUpperCase()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              id="event-detail-edit-btn"
              type="button"
              onClick={() => {
                onClose();
                onEdit(event);
              }}
              className="text-xs font-medium px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5 text-sky-400" />
              <span>Edit</span>
            </button>
            <button
              id="close-event-detail-btn"
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Toolbar Banner */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <span className={`px-2.5 py-1 rounded-full font-semibold border ${getStatusBadge(event.status)}`}>
              Event: {event.status}
            </span>
            <span className={`px-2.5 py-1 rounded-full font-semibold border ${getDispatchBadge(event.dispatchStatus)}`}>
              Dispatch: {event.dispatchStatus}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {event.dispatchStatus !== 'Dispatched' && (
              <button
                id="dispatch-all-event-assets-btn"
                type="button"
                onClick={() => dispatchAllEventAssets(event.id)}
                className="inline-flex items-center space-x-1.5 bg-sky-600 hover:bg-sky-700 text-white px-3 py-1.5 rounded-lg font-medium shadow-xs transition-colors cursor-pointer"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Dispatch All Hardware</span>
              </button>
            )}

            {event.dispatchStatus === 'Dispatched' && (
              <button
                id="return-all-event-assets-btn"
                type="button"
                onClick={() => returnAllEventAssets(event.id)}
                className="inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg font-medium shadow-xs transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Return All to Inventory</span>
              </button>
            )}

            <button
              id="download-gatepass-btn"
              type="button"
              onClick={handleExportGatePass}
              className="inline-flex items-center space-x-1.5 bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-300 hover:border-rose-300 px-3 py-1.5 rounded-lg font-medium transition-colors shadow-xs cursor-pointer"
              title="Download formal equipment gate pass PDF"
            >
              <Download className="w-3.5 h-3.5 text-rose-600" />
              <span>Gate Pass PDF</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Key Facts Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Timeline */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-sky-600" />
                <span>Schedule & Duration</span>
              </div>
              <div className="text-sm font-semibold text-slate-900">
                {event.startDate} &rarr; {event.endDate}
              </div>
              <p className="text-xs text-slate-500">
                Return Target: <strong className="text-slate-700">{event.expectedReturnDate || event.endDate}</strong>
              </p>
            </div>

            {/* Destination Venue */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-rose-600" />
                <span>Venue & Location</span>
              </div>
              <div className="text-sm font-semibold text-slate-900 truncate">
                {event.location}
              </div>
              <p className="text-xs text-slate-500">
                Department: <span className="text-slate-700">{event.department}</span>
              </p>
            </div>

            {/* Requester Contact */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <Users className="w-3.5 h-3.5 text-indigo-600" />
                <span>Primary Lead & Contact</span>
              </div>
              <div className="text-sm font-semibold text-slate-900 truncate">
                {event.primaryRequesterName}
              </div>
              <p className="text-xs text-slate-500 truncate">
                {event.contactEmail || primaryUser?.email || 'N/A'} &bull; {event.contactPhone || 'No phone'}
              </p>
            </div>
          </div>

          {/* Requesters Team list */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Users className="w-3.5 h-3.5 text-slate-500" />
              <span>Requested By ({event.requesterNames?.length || 1} People)</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {event.requesterNames?.map((reqName, i) => (
                <div 
                  key={i} 
                  className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-xs ${
                    reqName === event.primaryRequesterName
                      ? 'bg-sky-50 border-sky-200 text-sky-900 font-semibold'
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    reqName === event.primaryRequesterName ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {reqName.charAt(0)}
                  </div>
                  <span>{reqName}</span>
                  {reqName === event.primaryRequesterName && (
                    <span className="text-[10px] bg-sky-200/70 text-sky-800 px-1 rounded font-medium">Lead</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Equipment Manifest Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Laptop className="w-3.5 h-3.5 text-slate-500" />
                <span>Dispatched Hardware Manifest ({eventAssets.length} Assets)</span>
              </h3>
              <span className="text-xs text-slate-500">
                Total Valuation: ${eventAssets.reduce((sum, a) => sum + (a.purchaseCost || 0), 0).toLocaleString()}
              </span>
            </div>

            {eventAssets.length === 0 ? (
              <div className="p-6 text-center border border-dashed border-slate-300 rounded-xl bg-slate-50">
                <Laptop className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-medium text-slate-600">No hardware assets allocated to this event yet.</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Click &quot;Edit&quot; at the top to choose and assign physical hardware.</p>
              </div>
            ) : (
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 text-slate-600 border-b border-slate-200 font-semibold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="px-3.5 py-2.5">Asset Tag</th>
                      <th className="px-3.5 py-2.5">Item Name</th>
                      <th className="px-3.5 py-2.5">Model</th>
                      <th className="px-3.5 py-2.5">Category</th>
                      <th className="px-3.5 py-2.5">Serial Number</th>
                      <th className="px-3.5 py-2.5">Current Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {eventAssets.map((asset) => (
                      <tr key={asset.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-3.5 py-2.5 font-mono font-bold text-sky-700">
                          {asset.assetTag}
                        </td>
                        <td className="px-3.5 py-2.5 font-semibold text-slate-900">
                          {asset.name}
                        </td>
                        <td className="px-3.5 py-2.5 text-slate-600">
                          {asset.model}
                        </td>
                        <td className="px-3.5 py-2.5 text-slate-600">
                          {asset.category}
                        </td>
                        <td className="px-3.5 py-2.5 font-mono text-slate-500">
                          {asset.serial || 'N/A'}
                        </td>
                        <td className="px-3.5 py-2.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                            asset.status === 'Deployed' 
                              ? 'bg-sky-100 text-sky-800' 
                              : asset.status === 'Ready to Deploy'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {asset.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Description / Purpose */}
          {event.purposeOrDescription && (
            <div className="space-y-1.5 p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <h4 className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
                <FileText className="w-3.5 h-3.5 text-sky-600" />
                <span>Purpose & Scope</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {event.purposeOrDescription}
              </p>
            </div>
          )}

          {/* Special Instructions */}
          {event.specialInstructions && (
            <div className="space-y-1.5 p-3.5 rounded-xl border border-amber-200 bg-amber-50/70">
              <h4 className="text-xs font-bold text-amber-900 flex items-center space-x-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Logistics & Handling Protocols</span>
              </h4>
              <p className="text-xs text-amber-800 leading-relaxed">
                {event.specialInstructions}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-200 bg-slate-50">
          <span className="text-xs text-slate-400">
            Created: {event.createdAt} &bull; Last Modified: {event.updatedAt}
          </span>
          <button
            id="close-event-detail-bottom-btn"
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors shadow-2xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
