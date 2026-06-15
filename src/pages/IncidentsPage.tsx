import { useState, useMemo } from 'react';
import { getAllStudentsFlat } from '../data/students';
import { getAllTeachers, getAllNonTeachingStaff } from '../data/staff';

const tabs = ['Report Incident', 'Active Cases', 'Resolved'];

interface Incident { id: string; type: 'Bullying' | 'Property Damage' | 'Health' | 'Discipline' | 'Other'; student: string; classSection: string; description: string; severity: 'Low' | 'Medium' | 'High' | 'Critical'; date: string; reportedBy: string; status: 'Open' | 'Under Investigation' | 'Resolved'; resolution?: string; }

const initialIncidents: Incident[] = [
  { id: 'INC-001', type: 'Bullying', student: 'Aarav Sharma', classSection: '10-A', description: 'Reported verbal bullying during recess period. Multiple students involved.', severity: 'High', date: '2026-06-13', reportedBy: 'Mrs. Priya Sharma', status: 'Under Investigation' },
  { id: 'INC-002', type: 'Property Damage', student: 'Rohan Patel', classSection: '8-B', description: 'Broke a window glass in the corridor while playing.', severity: 'Medium', date: '2026-06-12', reportedBy: 'Security Guard', status: 'Open' },
  { id: 'INC-003', type: 'Health', student: 'Ananya Gupta', classSection: '9-A', description: 'Fainted during morning assembly. Was taken to school infirmary.', severity: 'High', date: '2026-06-11', reportedBy: 'Mr. Arjun Patel', status: 'Open' },
];

const resolvedIncidents: Incident[] = [
  { id: 'INC-R01', type: 'Discipline', student: 'Karan Singh', classSection: '11-A1', description: 'Using mobile phone during class hours.', severity: 'Low', date: '2026-06-05', reportedBy: 'Mrs. Meera Iyer', status: 'Resolved', resolution: 'Phone confiscated. Warning issued to student and parent informed.' },
  { id: 'INC-R02', type: 'Property Damage', student: 'Vivaan Kapoor', classSection: '7-C', description: 'Damaged lab equipment during experiment.', severity: 'Medium', date: '2026-06-01', reportedBy: 'Lab Assistant', status: 'Resolved', resolution: 'Cost of equipment recovered from parents. Extra supervision assigned.' },
];

const sevColor = (s: string) => {
  if (s === 'Critical') return 'bg-red-600 text-white';
  if (s === 'High') return 'bg-error-container text-on-error-container';
  if (s === 'Medium') return 'bg-amber-100 text-amber-700';
  return 'bg-gray-100 text-gray-600';
};

const typeIcon = (t: string) => {
  if (t === 'Bullying') return 'person_off';
  if (t === 'Property Damage') return 'broken_image';
  if (t === 'Health') return 'health_and_safety';
  if (t === 'Discipline') return 'gavel';
  return 'report';
};

export default function IncidentsPage() {
  const [tab, setTab] = useState(0);
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
  const [form, setForm] = useState({ type: 'Bullying' as Incident['type'], studentId: '', description: '', severity: 'Medium' as Incident['severity'], reportedBy: '' });

  const allStudents = useMemo(() => getAllStudentsFlat(), []);
  const allStaff = useMemo(() => [...getAllTeachers(), ...getAllNonTeachingStaff()], []);

  const handleSubmit = () => {
    if (!form.studentId || !form.description) return;
    const s = allStudents.find(st => st.student.id === form.studentId);
    if (!s) return;

    setIncidents([{
      id: `INC-${Date.now().toString(36).toUpperCase()}`,
      type: form.type,
      student: s.student.name,
      classSection: `${s.classNum}-${s.sectionName}`,
      description: form.description,
      severity: form.severity,
      date: new Date().toISOString().split('T')[0],
      reportedBy: form.reportedBy || 'Admin',
      status: 'Open',
    }, ...incidents]);
    setForm({ type: 'Bullying', studentId: '', description: '', severity: 'Medium', reportedBy: '' });
    setTab(1);
  };

  const handleDelete = (id: string) => setIncidents(prev => prev.filter(i => i.id !== id));

  const IncidentTable = ({ data, showActions }: { data: Incident[]; showActions?: boolean }) => (
    <div className="bg-surface rounded-2xl border border-outline-variant card-shadow overflow-hidden">
      <table className="w-full text-left">
        <thead><tr className="bg-surface-container-lowest border-b border-outline-variant">
          {['Type', 'Student', 'Class', 'Description', 'Severity', 'Date', 'Status', ...(showActions ? ['Actions'] : [])].map(h => (
            <th key={h} className={`px-5 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>
          ))}
        </tr></thead>
        <tbody>
          {data.map(inc => (
            <tr key={inc.id} className="border-b border-outline-variant/50 hover:bg-error/5 transition-colors">
              <td className="px-5 py-4"><span className="flex items-center gap-1.5 text-xs font-bold"><span className="material-symbols-outlined text-[16px]">{typeIcon(inc.type)}</span>{inc.type}</span></td>
              <td className="px-5 py-4 text-sm font-bold">{inc.student}</td>
              <td className="px-5 py-4 text-xs font-semibold">{inc.classSection}</td>
              <td className="px-5 py-4 text-xs text-on-surface-variant max-w-xs truncate">{inc.description}</td>
              <td className="px-5 py-4"><span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${sevColor(inc.severity)}`}>{inc.severity}</span></td>
              <td className="px-5 py-4 text-xs font-semibold">{inc.date}</td>
              <td className="px-5 py-4"><span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${inc.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' : inc.status === 'Under Investigation' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>{inc.status}</span></td>
              {showActions && (
                <td className="px-5 py-4 text-right">
                  <button onClick={() => handleDelete(inc.id)} className="text-error hover:bg-error/10 p-1.5 rounded-lg transition-colors"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                </td>
              )}
            </tr>
          ))}
          {data.length === 0 && <tr><td colSpan={8} className="text-center py-8 text-sm font-bold text-on-surface-variant">No incidents found.</td></tr>}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-[fadeIn_0.6s_ease-out]">
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0A192F] to-[#1e3a8a] rounded-2xl p-4 md:p-5 shadow-md text-white">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-48 h-48 bg-white opacity-5 rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <h1 className="text-2xl font-bold tracking-tight">Incident Log</h1>
          <p className="text-sm text-blue-100 mt-1">Report, track, and resolve school incidents with full audit trail.</p>
        </div>
      </div>

      <div className="flex gap-4 border-b border-outline-variant/30 overflow-x-auto no-scrollbar pb-2">
        {tabs.map((t, i) => (
          <button key={t} onClick={() => setTab(i)}
            className={`px-6 py-3 text-sm font-bold whitespace-nowrap transition-all duration-300 rounded-xl ${tab === i ? 'text-white bg-[#2563EB] shadow-lg shadow-blue-500/30 -translate-y-0.5' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container/50'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 0 && (
        <div className="bg-surface rounded-2xl border border-outline-variant card-shadow p-6 space-y-5">
          <h3 className="font-bold text-lg flex items-center gap-2"><span className="material-symbols-outlined text-error">report</span>Report New Incident</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Incident Type</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as any })} className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm font-bold outline-none focus:border-primary">
                <option>Bullying</option><option>Property Damage</option><option>Health</option><option>Discipline</option><option>Other</option>
              </select></div>
            <div>
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Student Involved *</label>
              <select value={form.studentId} onChange={e => setForm({ ...form, studentId: e.target.value })} className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm font-bold outline-none focus:border-primary">
                <option value="">-- Select a Student --</option>
                {allStudents.map(s => (
                  <option key={s.student.id} value={s.student.id}>{s.student.name} (Class {s.classNum}-{s.sectionName})</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Severity</label>
              <select value={form.severity} onChange={e => setForm({ ...form, severity: e.target.value as any })} className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm font-bold outline-none focus:border-primary">
                <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
              </select></div>
            <div>
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Reported By</label>
              <select value={form.reportedBy} onChange={e => setForm({ ...form, reportedBy: e.target.value })} className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm font-bold outline-none focus:border-primary">
                <option value="">-- Select Staff Member --</option>
                {allStaff.map(s => (
                  <option key={s.id} value={s.name}>{s.name} ({s.dept || 'Non-Teaching'})</option>
                ))}
              </select>
            </div>
          </div>
          <div><label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Description *</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Describe the incident in detail..." className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:border-primary resize-none" /></div>
          <button onClick={handleSubmit} className="bg-error text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">report</span>Submit Incident Report
          </button>
        </div>
      )}

      {tab === 1 && <IncidentTable data={incidents} showActions />}
      {tab === 2 && <IncidentTable data={resolvedIncidents} />}
    </div>
  );
}
