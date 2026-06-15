import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getAllTeachers } from '../data/staff';
import { exportToPDF, exportToCSV } from '../utils/exportUtils';

export default function TeachersPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  
  const teachers = getAllTeachers();

  const filteredAndSortedTeachers = useMemo(() => {
    let result = teachers.filter(t => {
      // Create a giant string of all searchable metadata for this teacher
      const searchString = [
        t.name,
        t.id,
        t.dept,
        t.designation,
        t.subjects,
        t.classes,
        t.status,
        t.joining,
        t.contact,
        t.email,
        t.rating?.toString()
      ].filter(Boolean).join(' ').toLowerCase();

      return searchString.includes(search.toLowerCase());
    });

    result.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'dept') return a.dept.localeCompare(b.dept);
      return 0;
    });

    return result;
  }, [teachers, search, sortBy]);

  return (
    <div className="p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6 lg:mb-8">
        <div>
          <h2 className="font-[Outfit] text-3xl font-bold">Teachers</h2>
          <p className="text-on-surface-variant text-sm mt-1">Manage faculty profiles, departments, and performance.</p>
        </div>
        <div className="flex gap-4">
          <div className="flex bg-surface-container-low rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
            >
              <span className="material-symbols-outlined text-[18px]">grid_view</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
            >
              <span className="material-symbols-outlined text-[18px]">view_list</span>
            </button>
          </div>
          <div className="flex gap-2">
            <button onClick={() => exportToCSV(filteredAndSortedTeachers, 'Elevation_Teachers_Roster_2026')} className="px-4 py-2 border border-outline-variant rounded-xl hover:bg-surface-container-low transition-colors text-sm font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">table</span> CSV
            </button>
            <button onClick={() => exportToPDF('teachers-list-container', 'Elevation_Teachers_Roster_2026')} className="px-4 py-2 border border-outline-variant rounded-xl hover:bg-surface-container-low transition-colors text-sm font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span> PDF
            </button>
            <button className="bg-primary text-on-primary px-5 py-2 rounded-xl text-sm font-bold shadow-md hover:opacity-90 transition-opacity flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              Add Teacher
            </button>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
        <SummaryCard icon="supervisor_account" title="Total Teachers" value={String(teachers.length)} />
        <SummaryCard icon="check_circle" title="Active" value={String(teachers.filter(t => t.status === 'Active').length)} />
        <SummaryCard icon="event_busy" title="On Leave" value={String(teachers.filter(t => t.status === 'On Leave').length)} />
        <SummaryCard icon="star" title="Avg Rating" value={(teachers.reduce((s,t) => s + (t.rating||0), 0) / teachers.length).toFixed(1) + ' / 5'} />
      </div>

      {/* Search and Filter Row */}
      <div className="bg-surface p-3 rounded-xl border border-outline-variant card-shadow mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-[400px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
          <input
            className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg pl-10 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all min-w-0"
            placeholder="Search by anything (date, subject, rating...)"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
          <span className="text-sm font-bold text-on-surface-variant">Sort by:</span>
          <select 
            className="bg-surface-container-low border-none rounded-lg text-xs font-bold px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="name">Name (A-Z)</option>
            <option value="rating">Rating (High to Low)</option>
            <option value="dept">Department</option>
          </select>
        </div>
      </div>

      <div id="teachers-list-container">
        <div className="p-6 hidden print-header">
          <h2 className="text-2xl font-bold text-primary mb-2">Elevation ERP</h2>
          <p className="text-lg font-bold">Teachers Roster 2026</p>
        </div>

        {/* Teacher Cards Grid */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {filteredAndSortedTeachers.map((t) => (
              <div key={t.id} className="bg-surface p-6 rounded-2xl border border-outline-variant card-shadow hover:border-primary/50 hover:shadow-lg transition-all group flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-14 h-14 rounded-full bg-primary-container/20 flex items-center justify-center text-primary font-bold text-lg font-[Outfit]">
                    {t.name.split(' ').slice(-1)[0][0]}{t.name.split(' ')[0][0]}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                    t.status === 'Active' ? 'text-primary bg-primary/10' : 'text-amber-700 bg-amber-100'
                  }`}>
                    {t.status}
                  </span>
                </div>
                <h4 className="font-bold text-base mb-1">{t.name}</h4>
                <p className="text-xs text-primary font-bold mb-4">{t.dept}</p>
                <div className="space-y-2 text-xs text-on-surface-variant font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[14px]">book</span>
                    <span className="truncate">{t.subjects}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[14px]">school</span>
                    {t.classes}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                    Joined {t.joining}
                  </div>
                </div>
                <div className="mt-auto pt-4 border-t border-outline-variant flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-yellow-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="text-sm font-bold">{t.rating}</span>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link to={`/staff/${t.id}`} className="p-1.5 hover:bg-primary/10 hover:text-primary rounded-lg text-on-surface-variant transition-colors group/btn" title="View Profile">
                      <span className="material-symbols-outlined text-[18px]">visibility</span>
                    </Link>
                    <button onClick={() => alert('Edit Teacher Profile')} className="p-1.5 hover:bg-primary/10 hover:text-primary rounded-lg text-on-surface-variant transition-colors group/btn" title="Edit Teacher">
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredAndSortedTeachers.length === 0 && (
              <div className="col-span-full py-12 text-center text-on-surface-variant font-bold">
                No teachers found matching your search.
              </div>
            )}
          </div>
        ) : (
          <div className="bg-surface rounded-2xl border border-outline-variant card-shadow overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Department</th>
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Subjects</th>
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Joining Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedTeachers.map((t) => (
                  <tr key={t.id} className="border-b border-outline-variant/50 hover:bg-surface-container-low transition-colors">
                    <td className="px-6 py-3 text-sm font-medium text-primary">{t.id}</td>
                    <td className="px-6 py-3 text-sm font-bold">{t.name}</td>
                    <td className="px-6 py-3 text-sm">{t.dept}</td>
                    <td className="px-6 py-3 text-sm text-on-surface-variant font-semibold truncate max-w-[150px]">{t.subjects}</td>
                    <td className="px-6 py-3 text-sm text-on-surface-variant font-semibold">{t.joining}</td>
                    <td className="px-6 py-3 text-sm">
                      <div className="flex items-center gap-1 font-bold">
                        <span className="material-symbols-outlined text-[14px] text-yellow-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        {t.rating}
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${t.status === 'Active' ? 'text-primary bg-primary/10' : 'text-amber-700 bg-amber-100'}`}>{t.status}</span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex gap-2">
                        <Link to={`/staff/${t.id}`} className="p-1 hover:bg-primary/10 hover:text-primary rounded-lg text-on-surface-variant transition-colors" title="View Profile">
                          <span className="material-symbols-outlined text-[18px]">visibility</span>
                        </Link>
                        <button onClick={() => alert('Edit Teacher Profile')} className="p-1 hover:bg-primary/10 hover:text-primary rounded-lg text-on-surface-variant transition-colors" title="Edit Teacher">
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredAndSortedTeachers.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-on-surface-variant font-bold">
                      No teachers found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        #teachers-list-container .print-header { display: none; }
      `}</style>
    </div>
  );
}

function SummaryCard({ icon, title, value }: { icon: string; title: string; value: string }) {
  return (
    <div className="bg-surface p-6 rounded-2xl border border-outline-variant card-shadow hover:border-primary/50 transition-colors">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider">{title}</p>
      </div>
      <h3 className="font-[Outfit] text-3xl font-bold">{value}</h3>
    </div>
  );
}
