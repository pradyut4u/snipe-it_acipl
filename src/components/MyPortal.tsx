import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Laptop, Plus, Info, Trash2 } from 'lucide-react';

interface RequestedItem {
  category: string;
  quantity: number;
}

import { EventItem } from '../types';

export const MyPortal: React.FC = () => {
  const { assets, events, currentUser, addEvent } = useApp();
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [viewingRequest, setViewingRequest] = useState<EventItem | null>(null);
  
  // Extract unique categories from existing assets
  const uniqueCategories = Array.from(new Set(assets.map(a => a.category))).filter(Boolean);
  if (uniqueCategories.length === 0) {
    uniqueCategories.push('Laptop', 'Desktop', 'Accessory', 'License');
  }

  const [title, setTitle] = useState('');
  const [justification, setJustification] = useState('');
  const [customItems, setCustomItems] = useState('');
  
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [expectedReturnDate, setExpectedReturnDate] = useState('');
  const [venue, setVenue] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  
  const [requestedItems, setRequestedItems] = useState<RequestedItem[]>([]);
  
  const [currentCategory, setCurrentCategory] = useState("Unmanaged PoE Switch");
  const [currentQuantity, setCurrentQuantity] = useState(1);

  const myAssets = assets.filter(a => a.assignedToId === currentUser?.id);
  const myRequests = events.filter(e => e.requesterIds?.includes(currentUser?.id || '') || e.primaryRequesterId === currentUser?.id);

  const getDisplayTitle = (req: EventItem) => {
    if (!req.purposeOrDescription) return req.name || 'Untitled Request';
    const match = req.purposeOrDescription.match(/Title:\s*([^\n]+)/);
    const extracted = match ? match[1].trim() : '';
    return extracted || req.name || 'Untitled Request';
  };

  const formatToIST = (dateString: string | Date) => {
    if (!dateString) return 'N/A';
    let d = new Date(dateString);
    if (typeof dateString === 'string' && !dateString.includes('Z') && !dateString.includes('T')) {
      // Fix for legacy 'YYYY-MM-DD HH:mm' format which lacks timezone info
      d = new Date(dateString.replace(' ', 'T') + 'Z');
    }
    return d.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  const handleAddItem = () => {
    if (currentQuantity < 1) return;
    setRequestedItems([...requestedItems, { category: currentCategory, quantity: currentQuantity }]);
    setCurrentQuantity(1);
  };

  const handleRemoveItem = (index: number) => {
    setRequestedItems(requestedItems.filter((_, i) => i !== index));
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !justification.trim() || !currentUser) return;
    if (requestedItems.length === 0 && !customItems.trim()) {
      alert("Please add at least one item from the categories or describe it in the custom items box.");
      return;
    }
    
    let itemsList = requestedItems.map(item => `- ${item.quantity}x ${item.category}`).join('\n');
    
    const detailedDescription = `Title: ${title}
From Date: ${fromDate || 'N/A'}
To Date: ${toDate || 'N/A'}
Expected Return Date: ${expectedReturnDate || 'N/A'}
Venue / Location: ${venue || 'N/A'}
Contact Phone: ${contactPhone || 'N/A'}
Contact Email: ${contactEmail || 'N/A'}

Requested Standard Items:
${itemsList || 'None'}

Custom / Out-of-Inventory Items:
${customItems || 'None'}

Justification/Details:
${justification}`;

    // Create an event for the request
    addEvent({
      name: title || `Asset Request from ${currentUser.name}`,
      department: currentUser.department,
      startDate: fromDate || new Date().toISOString().substring(0, 10),
      endDate: toDate || new Date().toISOString().substring(0, 10),
      expectedReturnDate: expectedReturnDate || '',
      location: venue || currentUser.location,
      contactPhone: contactPhone || '',
      contactEmail: contactEmail || '',
      primaryRequesterId: currentUser.id,
      primaryRequesterName: currentUser.name,
      requesterIds: [currentUser.id],
      requesterNames: [currentUser.name],
      assetIds: [],
      status: 'Upcoming', // Can be viewed as a stage
      dispatchStatus: 'Pending Dispatch',
      purposeOrDescription: detailedDescription
    });

    setIsRequestModalOpen(false);
    
    // Reset Form
    setTitle('');
    setJustification('');
    setCustomItems('');
    setRequestedItems([]);
    setCurrentQuantity(1);
    setFromDate('');
    setToDate('');
    setExpectedReturnDate('');
    setVenue('');
    setContactPhone('');
    setContactEmail('');
    
    alert('Your request has been submitted successfully.');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Portal</h1>
          <p className="text-slate-500 text-sm">View your assigned assets and submit new requests.</p>
        </div>
        <button
          onClick={() => setIsRequestModalOpen(true)}
          className="inline-flex items-center space-x-2 bg-sky-600 hover:bg-sky-500 text-white px-4 py-2 rounded-xl transition-colors shadow-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          <span>Request Asset</span>
        </button>
      </div>

        {/* <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <h2 className="font-semibold text-slate-800 flex items-center">
            <Laptop className="w-4 h-4 mr-2 text-sky-500" />
            My Assigned Assets ({myAssets.length})
          </h2>
        </div> */}
        
        {/* {myAssets.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Info className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p>You have no assets currently assigned to you.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Asset Name</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Tag</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myAssets.map(asset => (
                  <tr key={asset.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-900">{asset.name}</td>
                    <td className="px-4 py-3 text-slate-500">{asset.category}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{asset.assetTag}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
                        {asset.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )} */}
      

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm mt-6">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <h2 className="font-semibold text-slate-800 flex items-center">
            <Info className="w-4 h-4 mr-2 text-sky-500" />
            My Requests ({myRequests.length})
          </h2>
        </div>
        
        {myRequests.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Info className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p>You have no pending or active requests.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Requested On</th>
                  <th className="px-4 py-3 font-medium">Event Date</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Dispatch Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myRequests.map(req => (
                  <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-900">{getDisplayTitle(req)}</td>
                    <td className="px-4 py-3 text-slate-500">{formatToIST(req.createdAt)}</td>
                    <td className="px-4 py-3 text-slate-500">{req.startDate}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium border ${
                        req.status === 'Completed' ? 'bg-slate-100 text-slate-700 border-slate-200' : 
                        req.status === 'Active' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                        'bg-sky-100 text-sky-700 border-sky-200'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium border ${
                        req.dispatchStatus === 'Dispatched' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                        req.dispatchStatus === 'Returned' ? 'bg-slate-100 text-slate-700 border-slate-200' :
                        'bg-amber-100 text-amber-700 border-amber-200'
                      }`}>
                        {req.dispatchStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setViewingRequest(req)}
                        className="text-sky-600 hover:text-sky-700 text-sm font-medium"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
              <h3 className="font-bold text-slate-800">Request New Asset</h3>
              <button onClick={() => setIsRequestModalOpen(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>
            
            <form onSubmit={handleSubmitRequest} className="p-4 space-y-5 overflow-y-auto flex-1">
              {/* Title Section */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Request Title / Summary *</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="E.g., Hardware setup for new project"
                  required
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all text-sm"
                />
              </div>

              {/* Dynamic Item Builder */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                <h4 className="text-sm font-semibold text-slate-800 mb-3">Add Inventory Items</h4>
                
                <div className="flex items-end space-x-3 mb-4">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Category</label>
                    <select
                      value={currentCategory}
                      onChange={e => setCurrentCategory(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none text-sm"
                    >
                      {uniqueCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-24">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={currentQuantity}
                      onChange={e => setCurrentQuantity(parseInt(e.target.value) || 1)}
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Add
                  </button>
                </div>

                {requestedItems.length > 0 && (
                  <ul className="space-y-2 mt-4 border-t border-slate-200 pt-3">
                    {requestedItems.map((item, index) => (
                      <li key={index} className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-100 shadow-sm">
                        <span className="text-sm text-slate-700">
                          <span className="font-semibold">{item.quantity}x</span> {item.category}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Custom Items Section */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Other items not in inventory</label>
                <textarea
                  value={customItems}
                  onChange={e => setCustomItems(e.target.value)}
                  placeholder="Specify any custom software, specific hardware models, or equipment not found above..."
                  rows={2}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all resize-none text-sm"
                ></textarea>
              </div>

              {/* Event Details Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Venue / Location</label>
                  <input
                    type="text"
                    value={venue}
                    onChange={e => setVenue(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">From Date</label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={e => setFromDate(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">To Date</label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={e => setToDate(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Expected Return Date</label>
                  <input
                    type="date"
                    value={expectedReturnDate}
                    onChange={e => setExpectedReturnDate(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={e => setContactPhone(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={e => setContactEmail(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all text-sm"
                  />
                </div>
              </div>

              {/* Justification */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Justification *</label>
                <textarea
                  value={justification}
                  onChange={e => setJustification(e.target.value)}
                  placeholder="Why do you need these items? Please provide business justification."
                  rows={3}
                  required
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all resize-none text-sm"
                ></textarea>
              </div>

            </form>
            
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end space-x-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsRequestModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmitRequest}
                className="px-4 py-2 text-sm font-medium bg-sky-600 hover:bg-sky-500 text-white rounded-xl transition-colors shadow-sm"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

      {viewingRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
              <h3 className="font-bold text-slate-800">Request Details</h3>
              <button onClick={() => setViewingRequest(null)} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>
            
            <div className="p-5 space-y-4 overflow-y-auto max-h-[70vh]">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Title</h4>
                  <p className="text-slate-900">{getDisplayTitle(viewingRequest)}</p>
                </div>
                <div className="text-right">
                  <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Requested On</h4>
                  <p className="text-slate-900 text-sm">{formatToIST(viewingRequest.createdAt)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Dates</h4>
                  <p className="text-slate-900">{viewingRequest.startDate} to {viewingRequest.endDate}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Location / Venue</h4>
                  <p className="text-slate-900">{viewingRequest.location || 'N/A'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Status</h4>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium border ${
                    viewingRequest.status === 'Completed' ? 'bg-slate-100 text-slate-700 border-slate-200' : 
                    viewingRequest.status === 'Active' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                    'bg-sky-100 text-sky-700 border-sky-200'
                  }`}>
                    {viewingRequest.status}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Dispatch</h4>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium border ${
                    viewingRequest.dispatchStatus === 'Dispatched' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                    viewingRequest.dispatchStatus === 'Returned' ? 'bg-slate-100 text-slate-700 border-slate-200' :
                    'bg-amber-100 text-amber-700 border-amber-200'
                  }`}>
                    {viewingRequest.dispatchStatus}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Request Information</h4>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-sm text-slate-800 whitespace-pre-wrap">
                  {viewingRequest.purposeOrDescription || 'No details provided.'}
                </div>
              </div>

              {(viewingRequest.contactPhone || viewingRequest.contactEmail) && (
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Phone</h4>
                    <p className="text-slate-900">{viewingRequest.contactPhone || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Email</h4>
                    <p className="text-slate-900">{viewingRequest.contactEmail || 'N/A'}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end shrink-0">
              <button
                onClick={() => setViewingRequest(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl transition-colors font-medium text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
