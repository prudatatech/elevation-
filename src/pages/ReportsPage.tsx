import { useState, useMemo } from 'react';
import { classData } from '../data/students';
import { getAllTeachers, getAllNonTeachingStaff } from '../data/staff';

const tabs = ['Attendance Reports', 'Fee Reports', 'Academic Reports'];

export default function ReportsPage() {
  const [tab, setTab] = useState(0);

  const students = useMemo(() => classData.flatMap(c => c.sections.flatMap(s => s.students.map(st => ({ ...st, classNum: c.classNum, section: s.name })))), []);
  const staff = useMemo(() => [...getAllTeachers(), ...getAllNonTeachingStaff()], []);

  // Attendance by class
  const attendanceByClass = useMemo(() => classData.map(c => {
    const allS = c.sections.flatMap(s => s.students);
    const avg = Math.round(allS.reduce((a, s) => a + s.attendance, 0) / allS.length);
    return { cls: c.className, avg, total: allS.length };
  }), []);

  // Fee stats
  const feeStats = useMemo(() => {
    const paid = students.filter(s => s.feeStatus === 'Paid').length;
    const pending = students.filter(s => s.feeStatus === 'Pending').length;
    const overdue = students.filter(s => s.feeStatus === 'Overdue').length;
    return { paid, pending, overdue, total: students.length };
  }, [students]);

  // Academic by class
  const academicByClass = useMemo(() => classData.map(c => {
    const allS = c.sections.flatMap(s => s.students);
    const avg = Math.round(allS.reduce((a, s) => a + s.performance.percentage, 0) / allS.length);
    const toppers = [...allS].sort((a, b) => b.performance.percentage - a.performance.percentage).slice(0, 3);
    return { cls: c.className, avg, toppers };
  }), []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-[fadeIn_0.6s_ease-out]">
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0A192F] to-[#1e3a8a] rounded-2xl p-4 md:p-5 shadow-md text-white">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-48 h-48 bg-white opacity-5 rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-sm text-blue-100 mt-1">Comprehensive analytics on attendance, fees, and academics across all classes.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Students', value: students.length.toLocaleString(), icon: 'groups' },
          { title: 'Total Staff', value: staff.length.toString(), icon: 'badge' },
          { title: 'Avg Attendance', value: `${Math.round(students.reduce((a, s) => a + s.attendance, 0) / students.length)}%`, icon: 'event_available' },
          { title: 'Fee Collection', value: `${Math.round((feeStats.paid / feeStats.total) * 100)}%`, icon: 'payments' },
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

      <div className="flex gap-4 border-b border-outline-variant/30 overflow-x-auto no-scrollbar pb-2">
        {tabs.map((t, i) => (
          <button key={t} onClick={() => setTab(i)}
            className={`px-6 py-3 text-sm font-bold whitespace-nowrap transition-all duration-300 rounded-xl ${tab === i ? 'text-white bg-[#2563EB] shadow-lg shadow-blue-500/30 -translate-y-0.5' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container/50'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 0 && (
        <div className="bg-surface rounded-2xl border border-outline-variant card-shadow overflow-hidden">
          <table className="w-full text-left">
            <thead><tr className="bg-surface-container-lowest border-b border-outline-variant">
              {['Class', 'Total Students', 'Avg Attendance', 'Visual'].map(h => <th key={h} className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{h}</th>)}
            </tr></thead>
            <tbody>
              {attendanceByClass.map(c => (
                <tr key={c.cls} className="border-b border-outline-variant/50 hover:bg-primary/5 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold">{c.cls}</td>
                  <td className="px-6 py-4 text-xs font-semibold">{c.total}</td>
                  <td className="px-6 py-4 text-sm font-bold">{c.avg}%</td>
                  <td className="px-6 py-4">
                    <div className="w-32 h-2.5 bg-outline-variant/20 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${c.avg >= 90 ? 'bg-emerald-500' : c.avg >= 80 ? 'bg-blue-500' : 'bg-amber-500'}`} style={{ width: `${c.avg}%` }}></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 1 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { label: 'Paid', value: feeStats.paid, color: 'text-emerald-700 bg-emerald-100' },
              { label: 'Pending', value: feeStats.pending, color: 'text-amber-700 bg-amber-100' },
              { label: 'Overdue', value: feeStats.overdue, color: 'text-red-700 bg-red-100' },
            ].map(f => (
              <div key={f.label} className="bg-surface p-6 rounded-2xl border border-outline-variant card-shadow text-center">
                <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${f.color}`}>{f.label}</span>
                <h3 className="font-[Outfit] text-5xl font-extrabold mt-4">{f.value}</h3>
                <p className="text-xs text-on-surface-variant font-semibold mt-1">Students</p>
              </div>
            ))}
          </div>
          <div className="bg-surface rounded-2xl border border-outline-variant card-shadow p-6">
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-primary text-[20px]">pie_chart</span>Fee Collection Breakdown</h3>
            <div className="h-4 rounded-full overflow-hidden flex">
              <div className="bg-emerald-500 h-full" style={{ width: `${(feeStats.paid / feeStats.total) * 100}%` }}></div>
              <div className="bg-amber-500 h-full" style={{ width: `${(feeStats.pending / feeStats.total) * 100}%` }}></div>
              <div className="bg-red-500 h-full" style={{ width: `${(feeStats.overdue / feeStats.total) * 100}%` }}></div>
            </div>
            <div className="flex gap-6 mt-3">
              <span className="text-xs font-bold flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>Paid {Math.round((feeStats.paid / feeStats.total) * 100)}%</span>
              <span className="text-xs font-bold flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span>Pending {Math.round((feeStats.pending / feeStats.total) * 100)}%</span>
              <span className="text-xs font-bold flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span>Overdue {Math.round((feeStats.overdue / feeStats.total) * 100)}%</span>
            </div>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="bg-surface rounded-2xl border border-outline-variant card-shadow overflow-hidden">
          <table className="w-full text-left">
            <thead><tr className="bg-surface-container-lowest border-b border-outline-variant">
              {['Class', 'Avg %', 'Top Performer', 'Score', 'Visual'].map(h => <th key={h} className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{h}</th>)}
            </tr></thead>
            <tbody>
              {academicByClass.map(c => (
                <tr key={c.cls} className="border-b border-outline-variant/50 hover:bg-primary/5 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold">{c.cls}</td>
                  <td className="px-6 py-4 text-sm font-bold">{c.avg}%</td>
                  <td className="px-6 py-4 text-xs font-bold">{c.toppers[0]?.name || '-'}</td>
                  <td className="px-6 py-4 text-xs font-semibold">{c.toppers[0]?.performance.percentage || 0}%</td>
                  <td className="px-6 py-4">
                    <div className="w-32 h-2.5 bg-outline-variant/20 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#2563EB] to-[#10B981] rounded-full" style={{ width: `${c.avg}%` }}></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
