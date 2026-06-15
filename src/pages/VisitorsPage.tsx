import { useState, useMemo } from 'react';
import { getAllTeachers, getAllNonTeachingStaff } from '../data/staff';
import { getAllStudentsFlat } from '../data/students';

const tabs = ["Today's Visitors", 'Visitor Log', 'Add Visitor'];

interface Visitor { id: string; name: string; phone: string; purpose: string; personToMeet: string; checkIn: string; checkOut: string; badge: string; status: 'In Campus' | 'Left'; }

const initialVisitors: Visitor[] = [
  { id: 'VIS-001', name: 'Rajesh Kumar', phone: '+91 98765 11111', purpose: 'Parent Meeting', personToMeet: 'Mrs. Priya Sharma', checkIn: '09:15 AM', checkOut: '', badge: 'V-101', status: 'In Campus' },
  { id: 'VIS-002', name: 'Sunita Devi', phone: '+91 98765 22222', purpose: 'Fee Payment', personToMeet: 'Accounts Office', checkIn: '10:30 AM', checkOut: '11:15 AM', badge: 'V-102', status: 'Left' },
  { id: 'VIS-003', name: 'Amit Verma', phone: '+91 98765 33333', purpose: 'Vendor - Stationery', personToMeet: 'Admin Office', checkIn: '11:00 AM', checkOut: '', badge: 'V-103', status: 'In Campus' },
];

const logEntries: Visitor[] = [
  { id: 'VIS-L01', name: 'Priya Patel', phone: '+91 98765 44444', purpose: 'Parent Meeting', personToMeet: 'Mr. Arjun Patel', checkIn: '09:00 AM', checkOut: '10:00 AM', badge: 'V-098', status: 'Left' },
  { id: 'VIS-L02', name: 'Vikram Singh', phone: '+91 98765 55555', purpose: 'Job Interview', personToMeet: 'HR Office', checkIn: '02:00 PM', checkOut: '03:30 PM', badge: 'V-099', status: 'Left' },
  { id: 'VIS-L03', name: 'Neha Agarwal', phone: '+91 98765 66666', purpose: 'TC Collection', personToMeet: 'Admin Office', checkIn: '10:00 AM', checkOut: '10:30 AM', badge: 'V-100', status: 'Left' },
];

export default function VisitorsPage() {
  const [tab, setTab] = useState(0);
  const [visitors, setVisitors] = useState<Visitor[]>(initialVisitors);
  const [form, setForm] = useState({ name: '', phone: '', purpose: '', personToMeet: '' });

  const allStaff = useMemo(() => [...getAllTeachers(), ...getAllNonTeachingStaff()], []);
  const allStudents = useMemo(() => getAllStudentsFlat(), []);

  const handleAdd = () => {
    if (!form.name || !form.purpose) return;
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    setVisitors([{
      id: `VIS-${Date.now().toString(36)}`,
      ...form,
      checkIn: time,
      checkOut: '',
      badge: `V-${104 + visitors.length}`,
      status: 'In Campus',
    }, ...visitors]);
    setForm({ name: '', phone: '', purpose: '', personToMeet: '' });
    setTab(0);
  };

  const handleCheckout = (id: string) => {
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    setVisitors(prev => prev.map(v => v.id === id ? { ...v, checkOut: time, status: 'Left' } : v));
  };

  const handleDelete = (id: string) => setVisitors(prev => prev.filter(v => v.id !== id));

  const VisitorTable = ({ data, showActions }: { data: Visitor[]; showActions?: boolean }) => (
    <div className="bg-surface rounded-2xl border border-outline-variant card-shadow overflow-hidden">
      <table className="w-full text-left">
        <thead><tr className="bg-surface-container-lowest border-b border-outline-variant">
          {['Name', 'Phone', 'Purpose', 'Meeting With', 'Check In', 'Check Out', 'Badge', 'Status', ...(showActions ? ['Actions'] : [])].map(h => (
            <th key={h} className={`px-5 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>
          ))}
        </tr></thead>
        <tbody>
          {data.map(v => (
            <tr key={v.id} className="border-b border-outline-variant/50 hover:bg-primary/5 transition-colors">
              <td className="px-5 py-3.5 text-sm font-bold">{v.name}</td>
              <td className="px-5 py-3.5 text-xs">{v.phone}</td>
              <td className="px-5 py-3.5 text-xs font-semibold">{v.purpose}</td>
              <td className="px-5 py-3.5 text-xs text-on-surface-variant">{v.personToMeet}</td>
              <td className="px-5 py-3.5 text-xs font-semibold">{v.checkIn}</td>
              <td className="px-5 py-3.5 text-xs font-semibold">{v.checkOut || '—'}</td>
              <td className="px-5 py-3.5"><span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{v.badge}</span></td>
              <td className="px-5 py-3.5"><span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${v.status === 'In Campus' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>{v.status}</span></td>
              {showActions && (
                <td className="px-5 py-3.5 text-right flex items-center justify-end gap-1">
                  {v.status === 'In Campus' && (
                    <button onClick={() => handleCheckout(v.id)} className="text-amber-600 hover:bg-amber-50 p-1.5 rounded-lg transition-colors" title="Check Out"><span className="material-symbols-outlined text-[18px]">logout</span></button>
                  )}
                  <button onClick={() => handleDelete(v.id)} className="text-error hover:bg-error/10 p-1.5 rounded-lg transition-colors"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-[fadeIn_0.6s_ease-out]">
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0A192F] to-[#1e3a8a] rounded-2xl p-4 md:p-5 shadow-md text-white">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-48 h-48 bg-white opacity-5 rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <h1 className="text-2xl font-bold tracking-tight">Visitor Management</h1>
          <p className="text-sm text-blue-100 mt-1">Track visitor check-ins, check-outs, and maintain a complete visitor log.</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { title: 'In Campus Now', value: visitors.filter(v => v.status === 'In Campus').length.toString(), icon: 'person_pin_circle' },
          { title: "Today's Total", value: visitors.length.toString(), icon: 'groups' },
          { title: 'Checked Out', value: visitors.filter(v => v.status === 'Left').length.toString(), icon: 'logout' },
        ].map((m, i) => (
          <div key={i} className="bg-surface p-6 rounded-3xl border border-outline-variant/50 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 text-[#2563EB]"><span className="material-symbols-outlined text-[24px]">{m.icon}</span></div>
              <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider">{m.title}</p>
            </div>
            <h3 className="font-[Outfit] text-4xl font-extrabold tracking-tight text-on-surface">{m.value}</h3>
          </div>
        ))}
      </div>

      <div className="flex gap-4 border-b border-outline-variant/30 overflow-x-auto no-scrollbar pb-2">
        {tabs.map((t, i) => (
          <button key={t} onClick={() => setTab(i)}
            className={`px-6 py-3 text-sm font-bold whitespace-nowrap transition-all duration-300 rounded-xl ${tab === i ? 'text-white bg-[#2563EB] shadow-lg shadow-blue-500/30 -translate-y-0.5' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container/50'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 0 && <VisitorTable data={visitors} showActions />}
      {tab === 1 && <VisitorTable data={logEntries} />}

      {tab === 2 && (
        <div className="bg-surface rounded-2xl border border-outline-variant card-shadow p-6 space-y-5">
          <h3 className="font-bold text-lg flex items-center gap-2"><span className="material-symbols-outlined text-primary">person_add</span>Register New Visitor</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Full Name *</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:border-primary" /></div>
            <div><label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Phone</label><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:border-primary" /></div>
            <div><label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Purpose *</label><input value={form.purpose} onChange={e => setForm({ ...form, purpose: e.target.value })} placeholder="e.g. Parent Meeting" className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:border-primary" /></div>
            <div>
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Person to Meet</label>
              <select value={form.personToMeet} onChange={e => setForm({ ...form, personToMeet: e.target.value })} className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm font-bold outline-none focus:border-primary">
                <option value="">-- Select Person --</option>
                <optgroup label="Staff & Teachers">
                  {allStaff.map(s => <option key={s.id} value={s.name}>{s.name} ({s.dept || 'Teacher'})</option>)}
                </optgroup>
                <optgroup label="Students (Parents Meeting)">
                  {allStudents.map(s => <option key={s.student.id} value={s.student.name}>{s.student.name} ({s.classNum}-{s.sectionName})</option>)}
                </optgroup>
              </select>
            </div>
          </div>
          <button onClick={handleAdd} className="bg-[#2563EB] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">check_in</span>Check In Visitor
          </button>
        </div>
      )}
    </div>
  );
}
