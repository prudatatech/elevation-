import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getClassByNum, type Student } from '../../data/students';
import { exportToPDF, exportToCSV } from '../../utils/exportUtils';

export default function StudentList() {
  const { classNum, sectionName } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const perPage = 15;

  const cls = getClassByNum(Number(classNum));
  const section = cls?.sections.find(s => s.name === sectionName);

  if (!cls || !section) {
    return (
      <div className="p-8 flex flex-col items-center justify-center text-center h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">Section Not Found</h2>
        <button onClick={() => navigate('/students')} className="bg-primary text-on-primary px-4 py-2 rounded-lg font-bold">Go to Directory</button>
      </div>
    );
  }

  const filtered = section.students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.id.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="p-6 lg:p-8">
      {/* Student Detail Modal */}
      {viewingStudent && (
        <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center" onClick={() => setViewingStudent(null)}>
          <div className="bg-surface rounded-2xl w-[640px] max-h-[90vh] overflow-y-auto shadow-2xl border border-outline-variant" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-outline-variant">
              <h3 className="font-[Outfit] text-xl font-bold">Student Profile</h3>
              <button onClick={() => setViewingStudent(null)} className="p-1 hover:bg-surface-container-low rounded-lg transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl font-[Outfit] shrink-0" style={{ backgroundColor: `${cls.color}20`, color: cls.color }}>
                  {viewingStudent.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="text-lg font-bold">{viewingStudent.name}</h4>
                  <p className="text-sm text-on-surface-variant">{viewingStudent.id} | {cls.className} - {section.name}</p>
                </div>
                <div className="ml-auto flex flex-col items-end gap-2">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${viewingStudent.status === 'Active' ? 'text-primary bg-primary/10' : 'text-error bg-error/10'}`}>
                    {viewingStudent.status}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <DetailRow label="Roll No" value={String(viewingStudent.rollNo)} />
                <DetailRow label="Gender" value={viewingStudent.gender} />
                <DetailRow label="Date of Birth" value={viewingStudent.dob} />
                <DetailRow label="Contact" value={viewingStudent.contact} />
                <DetailRow label="Parent / Guardian" value={viewingStudent.parentName} />
                <DetailRow label="Address" value={viewingStudent.address} />
                <DetailRow label="Attendance" value={`${viewingStudent.attendance}%`} />
                <DetailRow label="Last Grade" value={viewingStudent.lastGrade} highlight="success" />
                <DetailRow label="Fee Status" value={viewingStudent.feeStatus} highlight={viewingStudent.feeStatus === 'Overdue' ? 'error' : viewingStudent.feeStatus === 'Pending' ? 'warning' : 'success'} />
                {section.stream && <DetailRow label="Stream" value={section.stream} />}
              </div>

              {/* Performance Button */}
              <div className="pt-4 border-t border-outline-variant flex gap-3">
                <Link
                  to={`/students/${cls.classNum}/${section.name}/${viewingStudent.id}`}
                  className="flex-1 bg-primary text-on-primary py-3 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity flex justify-center items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">analytics</span>
                  View Full Performance Report
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 mb-6 text-sm font-semibold text-on-surface-variant">
        <Link to="/students" className="hover:text-primary transition-colors">Students</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <Link to={`/students/${cls.classNum}`} className="hover:text-primary transition-colors">{cls.className}</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="text-primary">Section {section.name}</span>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-[Outfit] text-2xl font-bold">{cls.className} - Section {section.name}</h2>
          <p className="text-on-surface-variant text-sm mt-0.5">{section.students.length} Total Students {section.stream ? `| Stream: ${section.stream}` : ''}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => exportToCSV(section.students, `Elevation_Students_${cls.className}_${section.name}`)} className="px-4 py-2 border border-outline-variant rounded-xl hover:bg-surface-container-low transition-colors text-sm font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">table</span> CSV
          </button>
          <button onClick={() => exportToPDF('student-list-table', `Elevation_Students_${cls.className}_${section.name}`)} className="px-4 py-2 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors text-sm font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span> PDF
          </button>
        </div>
      </div>

      {/* Filter + Search */}
      <div className="bg-surface p-3 rounded-xl border border-outline-variant card-shadow mb-4 flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
          <input
            className="w-full bg-surface-container-low border-none rounded-lg pl-10 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Search by name or ID..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      {/* Data Table */}
      <div id="student-list-table" className="bg-surface rounded-2xl border border-outline-variant card-shadow overflow-hidden">
        <div className="p-6 hidden print-header">
          <h2 className="text-2xl font-bold text-primary mb-2">Elevation ERP</h2>
          <p className="text-lg font-bold">Student Roster: {cls.className} - Section {section.name}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-4 py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Roll</th>
                <th className="px-4 py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Parent</th>
                <th className="px-4 py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Attendance</th>
                <th className="px-4 py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Grade</th>
                <th className="px-4 py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((s) => (
                <tr key={s.id} className="border-b border-outline-variant/50 hover:bg-surface-container-low/50 transition-colors">
                  <td className="px-4 py-2.5 text-xs font-medium" style={{ color: cls.color }}>{s.id}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0" style={{ backgroundColor: `${cls.color}20`, color: cls.color }}>
                        {s.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-xs font-semibold">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-xs">{s.rollNo}</td>
                  <td className="px-4 py-2.5 text-xs text-on-surface-variant">{s.parentName}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-12 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${s.attendance >= 90 ? 'bg-green-500' : s.attendance >= 75 ? 'bg-primary' : 'bg-error'}`} style={{ width: `${s.attendance}%` }} />
                      </div>
                      <span className="text-[10px] font-semibold">{s.attendance}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-xs font-bold text-green-600">{s.lastGrade}</td>
                  <td className="px-4 py-2.5">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${s.status === 'Active' ? 'text-primary bg-primary/10' : 'text-error bg-error/10'}`}>{s.status}</span>
                  </td>
                  <td className="px-4 py-2.5">
                    <button onClick={() => setViewingStudent(s)} className="p-1 hover:bg-primary/10 hover:text-primary rounded-md text-on-surface-variant transition-colors group" title="View Profile">
                      <span className="material-symbols-outlined text-[18px]">visibility</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex justify-between items-center px-4 py-3 border-t border-outline-variant">
          <p className="text-[11px] text-on-surface-variant">
            Showing {(page - 1) * perPage + 1}-{Math.min(page * perPage, filtered.length)} of {filtered.length} students
          </p>
          <div className="flex gap-1">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-2.5 py-1 text-[11px] rounded-lg border border-outline-variant hover:bg-surface-container-low disabled:opacity-30">Prev</button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} className={`px-2.5 py-1 text-[11px] rounded-lg font-bold ${page === p ? 'bg-primary text-on-primary' : 'border border-outline-variant hover:bg-surface-container-low'}`}>{p}</button>
            ))}
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="px-2.5 py-1 text-[11px] rounded-lg border border-outline-variant hover:bg-surface-container-low disabled:opacity-30">Next</button>
          </div>
        </div>
      </div>
      <style>{`
        #student-list-table .print-header { display: none; }
      `}</style>
    </div>
  );
}

function DetailRow({ label, value, highlight }: { label: string; value: string; highlight?: string }) {
  const hlColors: Record<string, string> = { error: 'text-error', warning: 'text-amber-600', success: 'text-green-600' };
  return (
    <div className="bg-surface-container-low rounded-lg p-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-0.5">{label}</p>
      <p className={`text-sm font-semibold ${highlight ? hlColors[highlight] : ''}`}>{value}</p>
    </div>
  );
}
