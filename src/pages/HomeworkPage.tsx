import { useState, useMemo } from 'react';
import { classData } from '../data/students';
import { getAllTeachers } from '../data/staff';

const tabs = ['Assign New', 'Active Assignments', 'Past Assignments'];

interface Assignment {
  id: string;
  title: string;
  subject: string;
  classNum: string;
  section: string;
  teacher: string;
  dueDate: string;
  description: string;
  status: 'Assigned' | 'In Progress' | 'Submitted' | 'Archived';
  submissions: number;
  totalStudents: number;
  createdAt: string;
}

const subjects = ['Mathematics', 'Science', 'English', 'Social Studies', 'Hindi', 'Computer Science', 'Physical Education', 'Art'];

const initialAssignments: Assignment[] = [
  { id: 'HW-001', title: 'Quadratic Equations Practice', subject: 'Mathematics', classNum: '10', section: 'A', teacher: 'Priya Sharma', dueDate: '2026-06-20', description: 'Solve exercises 5.1 to 5.3 from NCERT textbook.', status: 'Assigned', submissions: 12, totalStudents: 40, createdAt: '2026-06-13' },
  { id: 'HW-002', title: 'Photosynthesis Lab Report', subject: 'Science', classNum: '9', section: 'B', teacher: 'Arjun Patel', dueDate: '2026-06-18', description: 'Write a detailed lab report on the photosynthesis experiment conducted in class.', status: 'In Progress', submissions: 28, totalStudents: 40, createdAt: '2026-06-12' },
  { id: 'HW-003', title: 'Essay on Climate Change', subject: 'English', classNum: '8', section: 'A', teacher: 'Meera Iyer', dueDate: '2026-06-15', description: 'Write a 500-word essay on the impact of climate change.', status: 'Submitted', submissions: 45, totalStudents: 50, createdAt: '2026-06-10' },
  { id: 'HW-004', title: 'French Revolution Timeline', subject: 'Social Studies', classNum: '10', section: 'C', teacher: 'Rahul Verma', dueDate: '2026-06-17', description: 'Create a detailed timeline of the French Revolution.', status: 'In Progress', submissions: 20, totalStudents: 40, createdAt: '2026-06-11' },
  { id: 'HW-005', title: 'Python Basics Assignment', subject: 'Computer Science', classNum: '11', section: 'A1', teacher: 'Sanya Gupta', dueDate: '2026-06-22', description: 'Complete the exercises on Python loops and functions.', status: 'Assigned', submissions: 5, totalStudents: 60, createdAt: '2026-06-14' },
];

const pastAssignments: Assignment[] = [
  { id: 'HW-P01', title: 'Algebra Worksheet', subject: 'Mathematics', classNum: '9', section: 'A', teacher: 'Priya Sharma', dueDate: '2026-05-20', description: 'Complete worksheet on algebraic expressions.', status: 'Archived', submissions: 38, totalStudents: 40, createdAt: '2026-05-15' },
  { id: 'HW-P02', title: 'Science Project Report', subject: 'Science', classNum: '8', section: 'B', teacher: 'Arjun Patel', dueDate: '2026-05-18', description: 'Submit the working model report for science fair.', status: 'Archived', submissions: 48, totalStudents: 50, createdAt: '2026-05-10' },
  { id: 'HW-P03', title: 'Book Review - The Guide', subject: 'English', classNum: '10', section: 'A', teacher: 'Meera Iyer', dueDate: '2026-05-25', description: 'Write a critical book review of "The Guide" by R.K. Narayan.', status: 'Archived', submissions: 36, totalStudents: 40, createdAt: '2026-05-18' },
];

export default function HomeworkPage() {
  const [tab, setTab] = useState(0);
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({ title: '', subject: 'Mathematics', classNum: '10', section: 'A', description: '', dueDate: '' });

  const teachers = useMemo(() => getAllTeachers(), []);
  const sections = useMemo(() => {
    const cls = classData.find(c => c.classNum.toString() === form.classNum);
    return cls ? cls.sections.map(s => s.name) : ['A', 'B', 'C', 'D', 'E'];
  }, [form.classNum]);

  const handleSubmit = () => {
    if (!form.title || !form.dueDate) return;
    const cls = classData.find(c => c.classNum.toString() === form.classNum);
    const sec = cls?.sections.find(s => s.name === form.section);
    const totalStudents = sec?.students.length || 40;
    const teacher = teachers[Math.floor(Math.random() * teachers.length)];

    if (editingId) {
      setAssignments(prev => prev.map(a => a.id === editingId ? { ...a, ...form, teacher: a.teacher, totalStudents } : a));
      setEditingId(null);
    } else {
      const newAssignment: Assignment = {
        id: `HW-${String(assignments.length + 10).padStart(3, '0')}`,
        ...form,
        teacher: teacher.name,
        status: 'Assigned',
        submissions: 0,
        totalStudents,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setAssignments([newAssignment, ...assignments]);
    }
    setForm({ title: '', subject: 'Mathematics', classNum: '10', section: 'A', description: '', dueDate: '' });
    setTab(1);
  };

  const handleEdit = (a: Assignment) => {
    setForm({ title: a.title, subject: a.subject, classNum: a.classNum, section: a.section, description: a.description, dueDate: a.dueDate });
    setEditingId(a.id);
    setTab(0);
  };

  const handleDelete = (id: string) => {
    setAssignments(prev => prev.filter(a => a.id !== id));
  };

  const statusColor = (s: string) => {
    if (s === 'Assigned') return 'bg-blue-100 text-blue-700';
    if (s === 'In Progress') return 'bg-amber-100 text-amber-700';
    if (s === 'Submitted') return 'bg-emerald-100 text-emerald-700';
    return 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-[fadeIn_0.6s_ease-out]">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0A192F] to-[#1e3a8a] rounded-2xl p-4 md:p-5 shadow-md text-white flex items-center justify-between gap-4">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-48 h-48 bg-white opacity-5 rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <h1 className="text-2xl font-bold tracking-tight">Homework & Assignments</h1>
          <p className="text-sm text-blue-100 mt-1">Create, manage, and track homework assignments across all classes.</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { title: 'Active', value: assignments.filter(a => a.status !== 'Archived').length.toString(), icon: 'assignment' },
          { title: 'Pending Review', value: assignments.filter(a => a.status === 'Submitted').length.toString(), icon: 'pending_actions' },
          { title: 'Archived', value: pastAssignments.length.toString(), icon: 'inventory_2' },
        ].map((m, i) => (
          <div key={i} style={{ animationDelay: `${i * 100}ms` }} className="animate-[slideUp_0.5s_ease-out_both]">
            <div className="group bg-surface p-6 rounded-3xl border border-outline-variant/50 shadow-sm hover:shadow-xl hover:shadow-[#2563EB]/10 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-[#2563EB]/10 to-transparent rounded-full group-hover:scale-150 transition-transform duration-700 ease-out"></div>
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white transition-colors duration-300">
                  <span className="material-symbols-outlined text-[24px]">{m.icon}</span>
                </div>
                <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider">{m.title}</p>
              </div>
              <h3 className="font-[Outfit] text-4xl font-extrabold tracking-tight text-on-surface relative z-10">{m.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-outline-variant/30 overflow-x-auto no-scrollbar pb-2">
        {tabs.map((t, i) => (
          <button key={t} onClick={() => setTab(i)}
            className={`px-6 py-3 text-sm font-bold whitespace-nowrap transition-all duration-300 rounded-xl ${tab === i ? 'text-white bg-[#2563EB] shadow-lg shadow-blue-500/30 -translate-y-0.5' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container/50'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Tab 0: Assign New */}
      {tab === 0 && (
        <div className="bg-surface rounded-2xl border border-outline-variant card-shadow p-6 space-y-5">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">edit_note</span>
            {editingId ? 'Edit Assignment' : 'Create New Assignment'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Title *</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Chapter 5 Exercises" className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:border-primary" />
            </div>
            <div>
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Subject</label>
              <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm font-bold outline-none focus:border-primary">
                {subjects.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Class</label>
              <select value={form.classNum} onChange={e => setForm({ ...form, classNum: e.target.value, section: 'A' })} className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm font-bold outline-none focus:border-primary">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(c => <option key={c} value={c}>Class {c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Section</label>
              <select value={form.section} onChange={e => setForm({ ...form, section: e.target.value })} className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm font-bold outline-none focus:border-primary">
                {sections.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Due Date *</label>
              <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm font-bold outline-none focus:border-primary" />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Describe the assignment..." className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:border-primary resize-none" />
          </div>
          <div className="flex gap-3">
            <button onClick={handleSubmit} className="bg-[#2563EB] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">{editingId ? 'save' : 'add'}</span>
              {editingId ? 'Update Assignment' : 'Assign Homework'}
            </button>
            {editingId && (
              <button onClick={() => { setEditingId(null); setForm({ title: '', subject: 'Mathematics', classNum: '10', section: 'A', description: '', dueDate: '' }); }} className="bg-surface border border-outline-variant text-on-surface px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-surface-container transition-colors">
                Cancel
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tab 1: Active */}
      {tab === 1 && (
        <div className="bg-surface rounded-2xl border border-outline-variant card-shadow overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-lowest border-b border-outline-variant">
                {['Title', 'Class', 'Subject', 'Teacher', 'Due Date', 'Progress', 'Status', 'Actions'].map(h => (
                  <th key={h} className={`px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {assignments.map(a => (
                <tr key={a.id} className="border-b border-outline-variant/50 hover:bg-primary/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold">{a.title}</div>
                    <div className="text-[10px] text-on-surface-variant">{a.id}</div>
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold">{a.classNum}-{a.section}</td>
                  <td className="px-6 py-4 text-xs font-semibold">{a.subject}</td>
                  <td className="px-6 py-4 text-xs text-on-surface-variant">{a.teacher}</td>
                  <td className="px-6 py-4 text-xs font-semibold">{a.dueDate}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-outline-variant/30 rounded-full overflow-hidden">
                        <div className="h-full bg-[#2563EB] rounded-full" style={{ width: `${(a.submissions / a.totalStudents) * 100}%` }}></div>
                      </div>
                      <span className="text-[10px] font-bold text-on-surface-variant">{a.submissions}/{a.totalStudents}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${statusColor(a.status)}`}>{a.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right flex items-center justify-end gap-1">
                    <button onClick={() => handleEdit(a)} className="text-primary hover:bg-primary/10 p-1.5 rounded-lg transition-colors"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                    <button onClick={() => handleDelete(a.id)} className="text-error hover:bg-error/10 p-1.5 rounded-lg transition-colors"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Past */}
      {tab === 2 && (
        <div className="bg-surface rounded-2xl border border-outline-variant card-shadow overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-lowest border-b border-outline-variant">
                {['Title', 'Class', 'Subject', 'Teacher', 'Due Date', 'Submissions', 'Status'].map(h => (
                  <th key={h} className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pastAssignments.map(a => (
                <tr key={a.id} className="border-b border-outline-variant/50 hover:bg-surface-container-lowest transition-colors">
                  <td className="px-6 py-4 text-sm font-bold">{a.title}</td>
                  <td className="px-6 py-4 text-xs font-semibold">{a.classNum}-{a.section}</td>
                  <td className="px-6 py-4 text-xs font-semibold">{a.subject}</td>
                  <td className="px-6 py-4 text-xs text-on-surface-variant">{a.teacher}</td>
                  <td className="px-6 py-4 text-xs font-semibold">{a.dueDate}</td>
                  <td className="px-6 py-4 text-xs font-bold">{a.submissions}/{a.totalStudents}</td>
                  <td className="px-6 py-4"><span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${statusColor(a.status)}`}>{a.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
