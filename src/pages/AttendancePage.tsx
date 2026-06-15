import { useState } from 'react';
import { exportToPDF } from '../utils/exportUtils';

const tabs = ['Student Attendance', 'Staff Attendance', 'Leave Requests'];
const classAttendance = [
  { cls: '10-A', present: 55, absent: 3, late: 2, rate: 92 },
  { cls: '10-B', present: 52, absent: 6, late: 2, rate: 87 },
  { cls: '10-C', present: 57, absent: 2, late: 1, rate: 95 },
  { cls: '10-D', present: 50, absent: 8, late: 2, rate: 83 },
  { cls: '10-E', present: 54, absent: 4, late: 2, rate: 90 },
  { cls: '11-A1', present: 56, absent: 3, late: 1, rate: 93 },
  { cls: '11-A2', present: 53, absent: 5, late: 2, rate: 88 },
  { cls: '11-B1', present: 58, absent: 1, late: 1, rate: 97 },
  { cls: '11-B2', present: 51, absent: 7, late: 2, rate: 85 },
  { cls: '12-A1', present: 55, absent: 4, late: 1, rate: 92 },
  { cls: '12-A2', present: 54, absent: 5, late: 1, rate: 90 },
  { cls: '12-B1', present: 57, absent: 2, late: 1, rate: 95 },
];
const leaveRequests = [
  { name: 'Priya Sharma', role: 'Teacher', type: 'Sick Leave', from: '2026-05-15', to: '2026-05-17', status: 'Pending' },
  { name: 'Aarav Patel', role: 'Student (10-A)', type: 'Casual Leave', from: '2026-05-16', to: '2026-05-16', status: 'Pending' },
  { name: 'Mukesh Kumar', role: 'Security', type: 'Earned Leave', from: '2026-05-18', to: '2026-05-25', status: 'Pending' },
  { name: 'Dr. Anita Desai', role: 'Teacher', type: 'Conference', from: '2026-05-20', to: '2026-05-22', status: 'Approved' },
];

export default function AttendancePage() {
  const [tab, setTab] = useState(0);
  const todayTotal = classAttendance.reduce((s, c) => s + c.present + c.absent + c.late, 0);
  const todayPresent = classAttendance.reduce((s, c) => s + c.present, 0);
  const todayAbsent = classAttendance.reduce((s, c) => s + c.absent, 0);
  const todayLate = classAttendance.reduce((s, c) => s + c.late, 0);

  return (
    <div className="p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <div><h2 className="font-[Outfit] text-2xl font-bold">Attendance & Leave Management</h2><p className="text-on-surface-variant text-sm mt-0.5">Track daily attendance and manage leave applications.</p></div>
        <button onClick={() => exportToPDF('attendance-report', 'Elevation_Attendance_Report_2026')} className="bg-primary text-on-primary px-5 py-2 rounded-xl text-sm font-bold shadow-md hover:opacity-90 flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">download</span>Export PDF
        </button>
      </div>
      <div id="attendance-report">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SC icon="percent" title="Today's Rate" value={`${Math.round(todayPresent / todayTotal * 100)}%`} /><SC icon="check_circle" title="Present" value={String(todayPresent)} /><SC icon="cancel" title="Absent" value={String(todayAbsent)} /><SC icon="schedule" title="Late" value={String(todayLate)} />
      </div>
      <div className="bg-surface rounded-2xl border border-outline-variant card-shadow mb-4 p-1 flex gap-1">
        {tabs.map((t, i) => (<button key={t} onClick={() => setTab(i)} className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${tab === i ? 'bg-primary text-on-primary shadow-md' : 'text-on-surface-variant hover:bg-surface-container-low'}`}>{t}</button>))}
      </div>
      {tab === 0 && (
        <div className="bg-surface rounded-2xl border border-outline-variant card-shadow overflow-hidden">
          <div className="p-4 border-b border-outline-variant"><h4 className="font-[Outfit] text-base font-bold">Class-wise Attendance Heatmap (Today)</h4></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 p-4">
            {classAttendance.map(c => (
              <div key={c.cls} className={`p-4 rounded-xl border transition-all hover:shadow-md cursor-pointer ${c.rate >= 90 ? 'border-green-200 bg-green-50' : c.rate >= 80 ? 'border-amber-200 bg-amber-50' : 'border-red-200 bg-red-50'}`}>
                <div className="flex justify-between items-center mb-2"><span className="font-bold text-sm">{c.cls}</span><span className={`text-lg font-bold font-[Outfit] ${c.rate >= 90 ? 'text-green-600' : c.rate >= 80 ? 'text-amber-600' : 'text-red-600'}`}>{c.rate}%</span></div>
                <div className="flex gap-3 text-[10px] text-on-surface-variant"><span>P: {c.present}</span><span>A: {c.absent}</span><span>L: {c.late}</span></div>
              </div>
            ))}
          </div>
        </div>
      )}
      {tab === 1 && (
        <div className="bg-surface rounded-2xl border border-outline-variant card-shadow p-6">
          <p className="text-on-surface-variant text-sm">Staff attendance tracking with biometric integration. 96 of 100 teachers present today. 42 of 45 non-teaching staff present.</p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4"><p className="text-xs font-bold text-green-700 mb-1">Teachers Present</p><p className="font-[Outfit] text-2xl font-bold text-green-600">96 / 100</p></div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4"><p className="text-xs font-bold text-green-700 mb-1">Non-Teaching Present</p><p className="font-[Outfit] text-2xl font-bold text-green-600">42 / 45</p></div>
          </div>
        </div>
      )}
      {tab === 2 && (
        <div className="bg-surface rounded-2xl border border-outline-variant card-shadow overflow-hidden">
          <table className="w-full text-left">
            <thead><tr className="bg-surface-container-low border-b border-outline-variant">
              <th className="px-4 py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Role</th>
              <th className="px-4 py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">From</th>
              <th className="px-4 py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">To</th>
              <th className="px-4 py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Actions</th>
            </tr></thead>
            <tbody>{leaveRequests.map((r, i) => (
              <tr key={i} className="border-b border-outline-variant/50 hover:bg-surface-container-low/50">
                <td className="px-4 py-2.5 text-xs font-semibold">{r.name}</td>
                <td className="px-4 py-2.5 text-xs text-on-surface-variant">{r.role}</td>
                <td className="px-4 py-2.5 text-xs">{r.type}</td>
                <td className="px-4 py-2.5 text-xs text-on-surface-variant">{r.from}</td>
                <td className="px-4 py-2.5 text-xs text-on-surface-variant">{r.to}</td>
                <td className="px-4 py-2.5"><span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${r.status === 'Approved' ? 'text-green-700 bg-green-100' : 'text-amber-700 bg-amber-100'}`}>{r.status}</span></td>
                <td className="px-4 py-2.5">{r.status === 'Pending' && <div className="flex gap-1"><button className="px-2 py-1 text-[10px] font-bold rounded-lg bg-green-500 text-white hover:opacity-90">Approve</button><button className="px-2 py-1 text-[10px] font-bold rounded-lg bg-error text-white hover:opacity-90">Reject</button></div>}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
      </div>
    </div>
  );
}
function SC({ icon, title, value }: { icon: string; title: string; value: string }) {
  return (<div className="bg-surface p-4 rounded-2xl border border-outline-variant card-shadow"><div className="flex items-center gap-2 mb-2"><div className="p-1.5 rounded-lg bg-primary/10 text-primary"><span className="material-symbols-outlined text-[18px]">{icon}</span></div><p className="text-on-surface-variant text-xs font-medium">{title}</p></div><h3 className="font-[Outfit] text-xl font-bold">{value}</h3></div>);
}
