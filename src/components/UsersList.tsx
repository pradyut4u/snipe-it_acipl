import React from 'react';
import { useApp } from '../context/AppContext';
import { Users, Mail, MapPin, Laptop, KeyRound, Briefcase } from 'lucide-react';

export const UsersList: React.FC = () => {
  const { users, assets, licenses } = useApp();

  return (
    <div id="users-list-view" className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <Users className="w-6 h-6 text-sky-600" />
            <span>People & Assigned Items</span>
          </h1>
          <p className="text-sm text-slate-500">Directory of team members and their checked-out company assets and software seats.</p>
        </div>
      </div>

      {/* Grid of User Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => {
          const userAssets = assets.filter(a => a.assignedToId === user.id);
          const userLicenses = licenses.filter(l => l.assignedUserIds.includes(user.id));

          return (
            <div key={user.id} className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 hover:border-slate-300 transition-all flex flex-col justify-between">
              <div>
                {/* User Info Header */}
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center text-sm border border-sky-200">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-bold text-slate-900 truncate">{user.name}</h3>
                    <div className="flex items-center text-xs text-slate-500 mt-0.5">
                      <Briefcase className="w-3 h-3 mr-1 text-slate-400" />
                      <span>{user.department}</span>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="mt-3.5 space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                  <div className="flex items-center text-slate-500">
                    <Mail className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center text-slate-500">
                    <MapPin className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                    <span>{user.location}</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">
                    ID: {user.employeeNum}
                  </div>
                </div>

                {/* Assigned Hardware */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="text-xs font-semibold text-slate-700 flex items-center justify-between mb-2">
                    <span className="flex items-center">
                      <Laptop className="w-3.5 h-3.5 mr-1 text-blue-600" /> Hardware Assets ({userAssets.length})
                    </span>
                  </div>
                  {userAssets.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No hardware checked out.</p>
                  ) : (
                    <div className="space-y-1.5">
                      {userAssets.map(a => (
                        <div key={a.id} className="text-xs bg-slate-50 p-2 rounded-lg border border-slate-200/80">
                          <div className="font-semibold text-slate-800">{a.name}</div>
                          <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-0.5">
                            <span>{a.assetTag}</span>
                            <span>{a.category}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Assigned Software Licenses */}
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <div className="text-xs font-semibold text-slate-700 flex items-center justify-between mb-2">
                    <span className="flex items-center">
                      <KeyRound className="w-3.5 h-3.5 mr-1 text-purple-600" /> Software Seats ({userLicenses.length})
                    </span>
                  </div>
                  {userLicenses.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No software licenses assigned.</p>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {userLicenses.map(l => (
                        <span key={l.id} className="text-[11px] bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded font-medium">
                          {l.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
