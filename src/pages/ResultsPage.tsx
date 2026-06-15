import { useState, useMemo } from 'react';
import { classData } from '../data/students';

const tabs = ['Enter Marks', 'Report Cards', 'Class Analytics'];
const subjects = ['Mathematics', 'Science', 'English', 'Social Studies', 'Hindi', 'Computer Science'];

export default function ResultsPage() {
  const [tab, setTab] = useState(0);
  const [selectedClass, setSelectedClass] = useState('10');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [marksData, setMarksData] = useState<Record<string, number>>({});
  const [savedMsg, setSavedMsg] = useState('');

  const sections = useMemo(() => {
    const cls = classData.find(c => c.classNum.toString() === selectedClass);
    return cls ? cls.sections.map(s => s.name) : ['A'];
  }, [selectedClass]);

  const students = useMemo(() => {
    const cls = classData.find(c => c.classNum.toString() === selectedClass);
    const sec = cls?.sections.find(s => s.name === selectedSection);
    return sec?.students || [];
  }, [selectedClass, selectedSection]);

  const handleMarkChange = (studentId: string, value: string) => {
    const num = parseInt(value);
    if (!isNaN(num) && num >= 0 && num <= 100) {
      setMarksData(prev => ({ ...prev, [studentId]: num }));
    }
  };

  const handleSave = () => {
    setSavedMsg(`Marks saved for Class ${selectedClass}-${selectedSection} (${selectedSubject})`);
    setTimeout(() => setSavedMsg(''), 3000);
  };

  // Analytics data
  const analytics = useMemo(() => {
    const allStudents = students;
    if (!allStudents.length) return null;
    const percentages = allStudents.map(s => s.performance.percentage);
    const avg = Math.round(percentages.reduce((a, b) => a + b, 0) / percentages.length);
    const top = [...allStudents].sort((a, b) => b.performance.percentage - a.performance.percentage).slice(0, 5);
    const subjectAvgs = subjects.map(sub => {
      const marks = allStudents.map(s => s.performance.marks.find(m => m.subject === sub)?.marks || 0);
      return { subject: sub, avg: Math.round(marks.reduce((a, b) => a + b, 0) / marks.length) };
    });
    return { avg, top, subjectAvgs, total: allStudents.length };
  }, [students]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-[fadeIn_0.6s_ease-out]">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0A192F] to-[#1e3a8a] rounded-2xl p-4 md:p-5 shadow-md text-white flex items-center justify-between gap-4">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-48 h-48 bg-white opacity-5 rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <h1 className="text-2xl font-bold tracking-tight">Results & Grades</h1>
          <p className="text-sm text-blue-100 mt-1">Enter marks, generate report cards, and analyze class performance.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <select value={selectedClass} onChange={e => { setSelectedClass(e.target.value); setSelectedSection('A'); }} className="bg-surface border border-outline-variant rounded-lg px-3 py-2 text-sm font-bold outline-none focus:border-primary">
          {[1,2,3,4,5,6,7,8,9,10,11,12].map(c => <option key={c} value={c}>Class {c}</option>)}
        </select>
        <select value={selectedSection} onChange={e => setSelectedSection(e.target.value)} className="bg-surface border border-outline-variant rounded-lg px-3 py-2 text-sm font-bold outline-none focus:border-primary">
          {sections.map(s => <option key={s} value={s}>Section {s}</option>)}
        </select>
        {tab === 0 && (
          <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} className="bg-surface border border-outline-variant rounded-lg px-3 py-2 text-sm font-bold outline-none focus:border-primary">
            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        )}
        {savedMsg && <span className="text-emerald-600 text-xs font-bold ml-auto flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">check_circle</span>{savedMsg}</span>}
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

      {/* Tab 0: Enter Marks */}
      {tab === 0 && (
        <div className="bg-surface rounded-2xl border border-outline-variant card-shadow overflow-hidden">
          <div className="p-4 border-b border-outline-variant/50 bg-surface-container-lowest flex items-center justify-between">
            <h3 className="font-bold text-sm flex items-center gap-2"><span className="material-symbols-outlined text-primary text-[20px]">edit_note</span>Enter Marks: {selectedSubject} — Class {selectedClass}-{selectedSection}</h3>
            <button onClick={handleSave} className="bg-[#2563EB] text-white px-5 py-2 rounded-lg text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">save</span>Save Marks
            </button>
          </div>
          <div className="overflow-auto max-h-[500px]">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-surface-container-lowest shadow-sm">
                <tr className="border-b border-outline-variant">
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Roll No</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Student Name</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Current Grade</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Marks (out of 100)</th>
                </tr>
              </thead>
              <tbody>
                {students.map(s => {
                  const existing = s.performance.marks.find(m => m.subject === selectedSubject);
                  return (
                    <tr key={s.id} className="border-b border-outline-variant/50 hover:bg-primary/5 transition-colors">
                      <td className="px-6 py-3.5 text-xs font-semibold">{s.rollNo}</td>
                      <td className="px-6 py-3.5 text-sm font-bold">{s.name}</td>
                      <td className="px-6 py-3.5 text-xs font-semibold">{s.lastGrade}</td>
                      <td className="px-6 py-3.5">
                        <input
                          type="number" min="0" max="100"
                          value={marksData[s.id] !== undefined ? marksData[s.id] : existing?.marks || ''}
                          onChange={e => handleMarkChange(s.id, e.target.value)}
                          className="w-20 bg-surface border border-outline-variant rounded-lg px-3 py-1.5 text-sm font-bold text-center outline-none focus:border-primary"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 1: Report Cards */}
      {tab === 1 && (
        <div className="bg-surface rounded-2xl border border-outline-variant card-shadow overflow-hidden">
          <div className="overflow-auto max-h-[500px]">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-surface-container-lowest shadow-sm">
                <tr className="border-b border-outline-variant">
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Roll</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Student</th>
                  {subjects.map(s => <th key={s} className="px-4 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{s.substring(0, 5)}</th>)}
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">%</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Grade</th>
                </tr>
              </thead>
              <tbody>
                {students.map(s => (
                  <tr key={s.id} className="border-b border-outline-variant/50 hover:bg-primary/5 transition-colors">
                    <td className="px-6 py-3.5 text-xs font-semibold">{s.rollNo}</td>
                    <td className="px-6 py-3.5 text-sm font-bold">{s.name}</td>
                    {subjects.map(sub => {
                      const m = s.performance.marks.find(mk => mk.subject === sub);
                      return <td key={sub} className="px-4 py-3.5 text-xs font-semibold text-center">{m?.marks || '-'}</td>;
                    })}
                    <td className="px-6 py-3.5 text-sm font-bold">{s.performance.percentage}%</td>
                    <td className="px-6 py-3.5">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${s.lastGrade.startsWith('A') ? 'bg-emerald-100 text-emerald-700' : s.lastGrade.startsWith('B') ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>{s.lastGrade}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Class Analytics */}
      {tab === 2 && analytics && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { title: 'Class Average', value: `${analytics.avg}%`, icon: 'bar_chart' },
              { title: 'Total Students', value: analytics.total.toString(), icon: 'groups' },
              { title: 'Topper', value: analytics.top[0]?.name || '-', icon: 'emoji_events' },
            ].map((m, i) => (
              <div key={i} className="bg-surface p-6 rounded-3xl border border-outline-variant/50 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 text-[#2563EB]">
                    <span className="material-symbols-outlined text-[24px]">{m.icon}</span>
                  </div>
                  <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider">{m.title}</p>
                </div>
                <h3 className="font-[Outfit] text-3xl font-extrabold tracking-tight text-on-surface">{m.value}</h3>
              </div>
            ))}
          </div>

          {/* Subject-wise Bars */}
          <div className="bg-surface rounded-2xl border border-outline-variant card-shadow p-6">
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-primary text-[20px]">analytics</span>Subject-wise Class Average</h3>
            <div className="space-y-3">
              {analytics.subjectAvgs.map(s => (
                <div key={s.subject} className="flex items-center gap-4">
                  <span className="text-xs font-bold w-32 text-on-surface-variant">{s.subject}</span>
                  <div className="flex-1 h-3 bg-outline-variant/20 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#2563EB] to-[#10B981] rounded-full transition-all duration-700" style={{ width: `${s.avg}%` }}></div>
                  </div>
                  <span className="text-xs font-bold w-10 text-right">{s.avg}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top 5 */}
          <div className="bg-surface rounded-2xl border border-outline-variant card-shadow overflow-hidden">
            <div className="p-4 border-b border-outline-variant/50 bg-surface-container-lowest">
              <h3 className="font-bold text-sm flex items-center gap-2"><span className="material-symbols-outlined text-amber-500 text-[20px]">emoji_events</span>Top 5 Performers</h3>
            </div>
            <table className="w-full text-left">
              <thead><tr className="border-b border-outline-variant">
                <th className="px-6 py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Percentage</th>
                <th className="px-6 py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Grade</th>
              </tr></thead>
              <tbody>
                {analytics.top.map((s, i) => (
                  <tr key={s.id} className="border-b border-outline-variant/50 hover:bg-amber-50/50 transition-colors">
                    <td className="px-6 py-3 text-sm font-bold text-amber-600">#{i + 1}</td>
                    <td className="px-6 py-3 text-sm font-bold">{s.name}</td>
                    <td className="px-6 py-3 text-sm font-bold">{s.performance.percentage}%</td>
                    <td className="px-6 py-3"><span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">{s.lastGrade}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
