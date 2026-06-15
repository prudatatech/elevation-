import { useState, useMemo } from 'react';
import { getAllStudentsFlat } from '../data/students';
import { getAllTeachers, getAllNonTeachingStaff } from '../data/staff';

const tabs = ['Announcements', 'Notices', 'Parent Messages', 'Staff Messages'];

interface Message { id: string; title: string; body: string; date: string; priority: 'High' | 'Normal' | 'Low'; target: string; author: string; }

const initialAnnouncements: Message[] = [
  { id: 'ANN-001', title: 'Annual Day Celebrations', body: 'Annual Day will be celebrated on 25th June. All students must participate in cultural activities.', date: '2026-06-13', priority: 'High', target: 'All', author: 'Principal' },
  { id: 'ANN-002', title: 'Summer Vacation Schedule', body: 'Summer vacation starts from 1st July to 31st July. School reopens on 1st August.', date: '2026-06-10', priority: 'Normal', target: 'All', author: 'Admin Office' },
  { id: 'ANN-003', title: 'PTM Notice', body: 'Parent-Teacher Meeting is scheduled for 20th June for classes 9-12.', date: '2026-06-08', priority: 'High', target: 'Class 9-12', author: 'Vice Principal' },
];

const initialNotices: Message[] = [
  { id: 'NOT-001', title: 'Science Lab Safety Guidelines', body: 'All students attending science lab must wear lab coats and safety goggles.', date: '2026-06-12', priority: 'High', target: 'Class 8-12', author: 'Science Dept' },
  { id: 'NOT-002', title: 'Library Book Return', body: 'All library books must be returned by 20th June. Late fees will apply.', date: '2026-06-11', priority: 'Normal', target: 'All', author: 'Librarian' },
];

export default function CommunicationPage() {
  const [tab, setTab] = useState(0);
  const [announcements, setAnnouncements] = useState<Message[]>(initialAnnouncements);
  const [notices, setNotices] = useState<Message[]>(initialNotices);
  const [parentMsgs, setParentMsgs] = useState<{ id: string; to: string; student: string; message: string; date: string; status: string }[]>([]);
  const [staffMsgs, setStaffMsgs] = useState<{ id: string; to: string; message: string; date: string; status: string }[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({ title: '', body: '', priority: 'Normal' as 'High' | 'Normal' | 'Low', target: 'All', author: '' });
  const [parentForm, setParentForm] = useState({ studentId: '', message: '' });
  const [staffForm, setStaffForm] = useState({ to: '', message: '' });

  const allStudents = useMemo(() => getAllStudentsFlat(), []);
  const allStaff = useMemo(() => [...getAllTeachers(), ...getAllNonTeachingStaff()], []);

  const handleAddAnnouncement = () => {
    if (!form.title || !form.body) return;
    if (editingId) {
      setAnnouncements(prev => prev.map(a => a.id === editingId ? { ...a, ...form } : a));
      setEditingId(null);
    } else {
      setAnnouncements([{ id: `ANN-${Date.now().toString(36)}`, ...form, date: new Date().toISOString().split('T')[0] }, ...announcements]);
    }
    setForm({ title: '', body: '', priority: 'Normal', target: 'All', author: '' });
  };

  const handleAddNotice = () => {
    if (!form.title || !form.body) return;
    if (editingId) {
      setNotices(prev => prev.map(n => n.id === editingId ? { ...n, ...form } : n));
      setEditingId(null);
    } else {
      setNotices([{ id: `NOT-${Date.now().toString(36)}`, ...form, date: new Date().toISOString().split('T')[0] }, ...notices]);
    }
    setForm({ title: '', body: '', priority: 'Normal', target: 'All', author: '' });
  };

  const handleSendParent = () => {
    if (!parentForm.studentId || !parentForm.message) return;
    const s = allStudents.find(st => st.student.id === parentForm.studentId)?.student;
    if (!s) return;
    setParentMsgs([{ id: `PM-${Date.now().toString(36)}`, to: s.contact, student: s.name, message: parentForm.message, date: new Date().toLocaleString(), status: 'Sent' }, ...parentMsgs]);
    setParentForm({ studentId: '', message: '' });
  };

  const handleSendStaff = () => {
    if (!staffForm.to || !staffForm.message) return;
    setStaffMsgs([{ id: `SM-${Date.now().toString(36)}`, ...staffForm, date: new Date().toLocaleString(), status: 'Sent' }, ...staffMsgs]);
    setStaffForm({ to: '', message: '' });
  };

  const prioColor = (p: string) => p === 'High' ? 'bg-error-container text-on-error-container' : p === 'Low' ? 'bg-gray-100 text-gray-600' : 'bg-blue-100 text-blue-700';

  const FormBlock = ({ onSubmit, submitLabel }: { onSubmit: () => void; submitLabel: string }) => (
    <div className="bg-surface rounded-2xl border border-outline-variant card-shadow p-6 space-y-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Title *</label>
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:border-primary" />
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Priority</label>
            <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value as any })} className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm font-bold outline-none focus:border-primary">
              <option>High</option><option>Normal</option><option>Low</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Target</label>
            <input value={form.target} onChange={e => setForm({ ...form, target: e.target.value })} placeholder="All / Class 10" className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:border-primary" />
          </div>
        </div>
      </div>
      <div>
        <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Author</label>
        <input value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} placeholder="e.g. Principal" className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:border-primary" />
      </div>
      <div>
        <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Content *</label>
        <textarea value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} rows={3} className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:border-primary resize-none" />
      </div>
      <button onClick={onSubmit} className="bg-[#2563EB] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity flex items-center gap-2">
        <span className="material-symbols-outlined text-[18px]">{editingId ? 'save' : 'send'}</span>{editingId ? 'Update' : submitLabel}
      </button>
    </div>
  );

  const MsgTable = ({ data, onEdit, onDelete }: { data: Message[]; onEdit: (m: Message) => void; onDelete: (id: string) => void }) => (
    <div className="bg-surface rounded-2xl border border-outline-variant card-shadow overflow-hidden">
      <table className="w-full text-left">
        <thead><tr className="bg-surface-container-lowest border-b border-outline-variant">
          {['Title', 'Target', 'Author', 'Date', 'Priority', 'Actions'].map(h => <th key={h} className={`px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>)}
        </tr></thead>
        <tbody>
          {data.map(m => (
            <tr key={m.id} className="border-b border-outline-variant/50 hover:bg-primary/5 transition-colors">
              <td className="px-6 py-4"><div className="text-sm font-bold">{m.title}</div><div className="text-[10px] text-on-surface-variant truncate max-w-xs">{m.body}</div></td>
              <td className="px-6 py-4 text-xs font-semibold">{m.target}</td>
              <td className="px-6 py-4 text-xs text-on-surface-variant">{m.author}</td>
              <td className="px-6 py-4 text-xs font-semibold">{m.date}</td>
              <td className="px-6 py-4"><span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${prioColor(m.priority)}`}>{m.priority}</span></td>
              <td className="px-6 py-4 text-right flex items-center justify-end gap-1">
                <button onClick={() => onEdit(m)} className="text-primary hover:bg-primary/10 p-1.5 rounded-lg transition-colors"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                <button onClick={() => onDelete(m.id)} className="text-error hover:bg-error/10 p-1.5 rounded-lg transition-colors"><span className="material-symbols-outlined text-[18px]">delete</span></button>
              </td>
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
          <h1 className="text-2xl font-bold tracking-tight">Communication Hub</h1>
          <p className="text-sm text-blue-100 mt-1">Manage announcements, notices, and messages to parents & staff.</p>
        </div>
      </div>

      <div className="flex gap-4 border-b border-outline-variant/30 overflow-x-auto no-scrollbar pb-2">
        {tabs.map((t, i) => (
          <button key={t} onClick={() => { setTab(i); setEditingId(null); setForm({ title: '', body: '', priority: 'Normal', target: 'All', author: '' }); }}
            className={`px-6 py-3 text-sm font-bold whitespace-nowrap transition-all duration-300 rounded-xl ${tab === i ? 'text-white bg-[#2563EB] shadow-lg shadow-blue-500/30 -translate-y-0.5' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container/50'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 0 && (<>
        <FormBlock onSubmit={handleAddAnnouncement} submitLabel="Post Announcement" />
        <MsgTable data={announcements} onEdit={m => { setForm({ title: m.title, body: m.body, priority: m.priority, target: m.target, author: m.author }); setEditingId(m.id); }} onDelete={id => setAnnouncements(prev => prev.filter(a => a.id !== id))} />
      </>)}

      {tab === 1 && (<>
        <FormBlock onSubmit={handleAddNotice} submitLabel="Post Notice" />
        <MsgTable data={notices} onEdit={m => { setForm({ title: m.title, body: m.body, priority: m.priority, target: m.target, author: m.author }); setEditingId(m.id); }} onDelete={id => setNotices(prev => prev.filter(n => n.id !== id))} />
      </>)}

      {tab === 2 && (
        <div className="space-y-6">
          <div className="bg-surface rounded-2xl border border-outline-variant card-shadow p-6 space-y-4">
            <h3 className="font-bold text-sm flex items-center gap-2"><span className="material-symbols-outlined text-primary text-[20px]">mail</span>Compose Message to Parent</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Select Student</label>
                <select value={parentForm.studentId} onChange={e => setParentForm({ ...parentForm, studentId: e.target.value })} className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm font-bold outline-none focus:border-primary">
                  <option value="">-- Select a Student --</option>
                  {allStudents.map(s => (
                    <option key={s.student.id} value={s.student.id}>{s.student.name} (Class {s.classNum}-{s.sectionName}) - Parent: {s.student.parentName} ({s.student.contact})</option>
                  ))}
                </select>
              </div>
            </div>
            <textarea value={parentForm.message} onChange={e => setParentForm({ ...parentForm, message: e.target.value })} rows={3} placeholder="Type your message..." className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:border-primary resize-none" />
            <button onClick={handleSendParent} className="bg-[#2563EB] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">send</span>Send Message
            </button>
          </div>
          {parentMsgs.length > 0 && (
            <div className="bg-surface rounded-2xl border border-outline-variant card-shadow overflow-hidden">
              <table className="w-full text-left">
                <thead><tr className="bg-surface-container-lowest border-b border-outline-variant">
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Student</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Message</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Sent At</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
                </tr></thead>
                <tbody>
                  {parentMsgs.map(m => (
                    <tr key={m.id} className="border-b border-outline-variant/50"><td className="px-6 py-3.5 text-sm font-bold">{m.student}</td><td className="px-6 py-3.5 text-xs">{m.to}</td><td className="px-6 py-3.5 text-xs text-on-surface-variant truncate max-w-xs">{m.message}</td><td className="px-6 py-3.5 text-xs font-semibold">{m.date}</td><td className="px-6 py-3.5"><span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">{m.status}</span></td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === 3 && (
        <div className="space-y-6">
          <div className="bg-surface rounded-2xl border border-outline-variant card-shadow p-6 space-y-4">
            <h3 className="font-bold text-sm flex items-center gap-2"><span className="material-symbols-outlined text-primary text-[20px]">group</span>Compose Message to Staff</h3>
            <div>
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Select Staff Member</label>
              <select value={staffForm.to} onChange={e => setStaffForm({ ...staffForm, to: e.target.value })} className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm font-bold outline-none focus:border-primary">
                <option value="">-- Select Staff Member --</option>
                {allStaff.map(s => (
                  <option key={s.id} value={s.name}>{s.name} ({s.dept || 'Non-Teaching'})</option>
                ))}
              </select>
            </div>
            <textarea value={staffForm.message} onChange={e => setStaffForm({ ...staffForm, message: e.target.value })} rows={3} placeholder="Type your message..." className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:border-primary resize-none" />
            <button onClick={handleSendStaff} className="bg-[#2563EB] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">send</span>Send Message
            </button>
          </div>
          {staffMsgs.length > 0 && (
            <div className="bg-surface rounded-2xl border border-outline-variant card-shadow overflow-hidden">
              <table className="w-full text-left">
                <thead><tr className="bg-surface-container-lowest border-b border-outline-variant">
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">To</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Message</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Sent At</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
                </tr></thead>
                <tbody>
                  {staffMsgs.map(m => (
                    <tr key={m.id} className="border-b border-outline-variant/50"><td className="px-6 py-3.5 text-sm font-bold">{m.to}</td><td className="px-6 py-3.5 text-xs text-on-surface-variant truncate max-w-xs">{m.message}</td><td className="px-6 py-3.5 text-xs font-semibold">{m.date}</td><td className="px-6 py-3.5"><span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">{m.status}</span></td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
