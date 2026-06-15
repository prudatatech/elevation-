import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getAllNonTeachingStaff } from '../data/staff';
import { exportToPDF, exportToCSV } from '../utils/exportUtils';

export default function StaffPage() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterDept, setFilterDept] = useState('All Departments');
  
  const staffData = getAllNonTeachingStaff();
  
  const filteredAndSortedStaff = useMemo(() => {
    let result = staffData.filter(s => {
      // Create a giant string of all searchable metadata for this staff member
      const searchString = [
        s.name,
        s.id,
        s.dept,
        s.designation,
        s.status,
        s.joining,
        s.contact,
        s.email
      ].filter(Boolean).join(' ').toLowerCase();

      return (filterDept === 'All Departments' || s.dept === filterDept) &&
             searchString.includes(search.toLowerCase());
    });

    result.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'dept') return a.dept.localeCompare(b.dept);
      if (sortBy === 'joining') return a.joining.localeCompare(b.joining);
      return 0;
    });

    return result;
  }, [staffData, search, sortBy, filterDept]);

  const departments = ['All Departments', ...Array.from(new Set(staffData.map(s => s.dept)))];

  return (
    <div className="p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-[Outfit] text-2xl font-bold">Non-Teaching Staff</h2>
          <p className="text-on-surface-variant text-sm mt-0.5">Manage administrative, support, and maintenance staff.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => exportToCSV(filteredAndSortedStaff, 'Elevation_Staff_Roster_2026')} className="px-4 py-2 border border-outline-variant rounded-xl hover:bg-surface-container-low transition-colors text-sm font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">table</span> CSV
          </button>
          <button onClick={() => exportToPDF('staff-list-container', 'Elevation_Staff_Roster_2026')} className="px-4 py-2 border border-outline-variant rounded-xl hover:bg-surface-container-low transition-colors text-sm font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span> PDF
          </button>
          <button className="bg-primary text-on-primary px-5 py-2 rounded-xl text-sm font-bold shadow-md hover:opacity-90 transition-opacity flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">person_add</span> Add Staff
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SC icon="groups" title="Total Staff" value={String(staffData.length)} />
        <SC icon="check_circle" title="Active" value={String(staffData.filter(s => s.status === 'Active').length)} />
        <SC icon="event_busy" title="On Leave" value={String(staffData.filter(s => s.status === 'On Leave').length)} />
        <SC icon="apartment" title="Departments" value={String(departments.length - 1)} />
      </div>

      {/* Search and Filter Row */}
      <div className="bg-surface p-3 rounded-xl border border-outline-variant card-shadow mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-[400px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
          <input 
            className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg pl-10 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all min-w-0" 
            placeholder="Search by anything (date, ID, role, contact...)" 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto shrink-0">
          <select 
            className="bg-surface-container-low border-none rounded-lg text-xs font-bold px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
            value={filterDept}
            onChange={e => setFilterDept(e.target.value)}
          >
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <div className="h-6 w-[1px] bg-outline-variant mx-1 hidden md:block"></div>
          <span className="text-sm font-bold text-on-surface-variant">Sort by:</span>
          <select 
            className="bg-surface-container-low border-none rounded-lg text-xs font-bold px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="name">Name (A-Z)</option>
            <option value="dept">Department</option>
            <option value="joining">Joining Date</option>
          </select>
        </div>
      </div>

      <div id="staff-list-container" className="bg-surface rounded-2xl border border-outline-variant card-shadow overflow-hidden">
        <div className="p-6 hidden print-header">
          <h2 className="text-2xl font-bold text-primary mb-2">Elevation ERP</h2>
          <p className="text-lg font-bold">Non-Teaching Staff Roster 2026</p>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant">
              <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">ID</th>
              <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Department</th>
              <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Designation</th>
              <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Joining Date</th>
              <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Contact</th>
              <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedStaff.map(s => (
              <tr key={s.id} className="border-b border-outline-variant/50 hover:bg-surface-container-low transition-colors">
                <td className="px-6 py-3 text-sm font-medium text-primary">{s.id}</td>
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary text-xs font-bold shrink-0">
                      {s.name.split(' ').map(n=>n[0]).join('')}
                    </div>
                    <span className="text-sm font-bold">{s.name}</span>
                  </div>
                </td>
                <td className="px-6 py-3 text-sm font-bold">{s.dept}</td>
                <td className="px-6 py-3 text-sm text-on-surface-variant font-semibold">{s.designation}</td>
                <td className="px-6 py-3 text-sm text-on-surface-variant">{s.joining}</td>
                <td className="px-6 py-3 text-sm text-on-surface-variant">{s.contact}</td>
                <td className="px-6 py-3">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${s.status === 'Active' ? 'text-primary bg-primary/10' : 'text-amber-700 bg-amber-100'}`}>
                    {s.status}
                  </span>
                </td>
                <td className="px-6 py-3">
                  <div className="flex gap-2">
                    <Link to={`/staff/${s.id}`} className="p-1 hover:bg-primary/10 hover:text-primary rounded-lg text-on-surface-variant transition-colors group/btn" title="View Profile">
                      <span className="material-symbols-outlined text-[18px]">visibility</span>
                    </Link>
                    <button onClick={() => alert('Edit Staff Profile')} className="p-1 hover:bg-primary/10 hover:text-primary rounded-lg text-on-surface-variant transition-colors group/btn" title="Edit Staff">
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredAndSortedStaff.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-on-surface-variant font-bold">
                  No staff found matching your search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <style>{`
        #staff-list-container .print-header { display: none; }
      `}</style>
    </div>
  );
}

function SC({ icon, title, value }: { icon: string; title: string; value: string }) {
  return (
    <div className="bg-surface p-4 rounded-2xl border border-outline-variant card-shadow hover:border-primary/50 transition-colors">
      <div className="flex items-center gap-2 mb-2">
        <div className="p-2 rounded-xl bg-primary/10 text-primary">
          <span className="material-symbols-outlined text-[20px]">{icon}</span>
        </div>
        <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider">{title}</p>
      </div>
      <h3 className="font-[Outfit] text-2xl font-bold">{value}</h3>
    </div>
  );
}
