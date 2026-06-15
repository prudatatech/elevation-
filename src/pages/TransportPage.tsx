import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllBuses, getFleetSummary } from '../data/transport';
import { exportToPDF } from '../utils/exportUtils';

export default function TransportPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const buses = getAllBuses();
  const summary = getFleetSummary();

  const filteredBuses = buses.filter(b => {
    const matchesSearch = [b.routeNumber, b.routeName, b.driverName, b.vehicleNumber, (b as any).currentLocation || '']
      .join(' ').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || b.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const statusColors: Record<string, string> = {
    'On Route': 'text-emerald-700 bg-emerald-50',
    'Delayed': 'text-amber-700 bg-amber-50',
    'Completed': 'text-slate-600 bg-slate-100',
    'Not Started': 'text-gray-500 bg-gray-100'
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="font-[Outfit] text-3xl font-bold">Transport Fleet Management</h2>
          <p className="text-on-surface-variant text-sm mt-1">Monitor all school buses, routes, and live GPS tracking.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => exportToPDF('transport-fleet', 'Elevation_Transport_Fleet_2026')} className="p-2.5 border border-outline-variant rounded-xl hover:bg-surface-container-low transition-colors text-sm font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">download</span> Export
          </button>
          <button className="bg-primary text-on-primary px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:opacity-90 transition-opacity flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">add</span> Add Route
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <SummaryCard icon="directions_bus" label="Total Buses" value={String(summary.totalBuses)} accent="bg-primary/10 text-primary" />
        <SummaryCard icon="route" label="Active Routes" value={String(summary.activeRoutes)} accent="bg-blue-500/10 text-blue-600" />
        <SummaryCard icon="groups" label="Students In Transit" value={String(summary.studentsInTransit)} accent="bg-emerald-500/10 text-emerald-600" />
        <SummaryCard icon="speed" label="On-Time Rate" value={`${summary.onTimeRate}%`} accent="bg-amber-500/10 text-amber-600" />
      </div>

      {/* Search and Filter */}
      <div className="bg-surface p-4 rounded-2xl border border-outline-variant card-shadow mb-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-[400px]">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
            <input
              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg pl-10 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Search by route, driver, vehicle number..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['All', 'On Route', 'Delayed', 'Completed', 'Not Started'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`text-[11px] font-bold px-4 py-2 rounded-full transition-colors ${
                  filterStatus === status
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bus Grid */}
      <div id="transport-fleet" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredBuses.map(bus => (
          <Link
            key={bus.id}
            to={`/transport/${bus.id}`}
            className="bg-surface p-5 rounded-2xl border border-outline-variant card-shadow hover:border-primary/40 hover:shadow-lg transition-all group block"
          >
            {/* Top Row */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  bus.status === 'Delayed' ? 'bg-amber-100 text-amber-600' :
                  bus.status === 'On Route' ? 'bg-primary/10 text-primary' :
                  'bg-surface-container-high text-on-surface-variant'
                }`}>
                  <span className="material-symbols-outlined text-[24px]">directions_bus</span>
                </div>
                <div>
                  <h3 className="font-bold text-base group-hover:text-primary transition-colors">Route {bus.routeNumber}</h3>
                  <p className="text-xs text-on-surface-variant font-semibold">{bus.routeName}</p>
                </div>
              </div>
              <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${statusColors[bus.status]}`}>
                {bus.status}
              </span>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-3 gap-3 mb-4 text-[11px]">
              <InfoCell icon="person" label="Driver" value={bus.driverName} />
              <InfoCell icon="speed" label="Speed" value={`${bus.speed} km/h`} />
              <InfoCell icon="groups" label="Students" value={`${bus.currentStudents}/${bus.capacity}`} />
            </div>

            {/* Distance & ETA */}
            <div className="flex items-center justify-between bg-surface-container-low/70 p-3 rounded-xl mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-primary">straighten</span>
                <div>
                  <p className="text-[10px] text-on-surface-variant font-semibold">Distance Left</p>
                  <p className="text-sm font-bold">{bus.distanceLeftKm} km</p>
                </div>
              </div>
              <div className="h-8 w-[1px] bg-outline-variant"></div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-emerald-600">schedule</span>
                <div>
                  <p className="text-[10px] text-on-surface-variant font-semibold">ETA</p>
                  <p className="text-sm font-bold">{bus.etaMinutes > 0 ? `${bus.etaMinutes} mins` : '--'}</p>
                </div>
              </div>
              <div className="h-8 w-[1px] bg-outline-variant"></div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant">pin_drop</span>
                <div>
                  <p className="text-[10px] text-on-surface-variant font-semibold">Stops</p>
                  <p className="text-sm font-bold">{bus.stops.filter(s => s.completed).length}/{bus.stops.length}</p>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div>
              <div className="w-full h-2.5 bg-surface-container-high rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${bus.status === 'Delayed' ? 'bg-amber-500' : 'bg-primary'}`}
                  style={{ width: `${bus.journeyProgress}%` }}
                />
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-[10px] text-on-surface-variant font-semibold">{bus.journeyProgress}% complete</span>
                <span className="text-[10px] text-primary font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Track Live <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                </span>
              </div>
            </div>
          </Link>
        ))}

        {filteredBuses.length === 0 && (
          <div className="col-span-full py-16 text-center text-on-surface-variant font-bold">
            No buses match your search criteria.
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ icon, label, value, accent }: { icon: string; label: string; value: string; accent: string }) {
  return (
    <div className="bg-surface p-5 rounded-2xl border border-outline-variant card-shadow hover:border-primary/40 transition-colors">
      <div className="flex items-center gap-2.5 mb-3">
        <div className={`p-2 rounded-xl ${accent}`}>
          <span className="material-symbols-outlined text-[20px]">{icon}</span>
        </div>
        <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest">{label}</p>
      </div>
      <h3 className="font-[Outfit] text-3xl font-bold">{value}</h3>
    </div>
  );
}

function InfoCell({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-1 mb-0.5">
        <span className="material-symbols-outlined text-[12px] text-on-surface-variant">{icon}</span>
        <p className="text-on-surface-variant font-semibold">{label}</p>
      </div>
      <p className="font-bold text-xs truncate">{value}</p>
    </div>
  );
}
