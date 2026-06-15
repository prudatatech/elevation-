import { useState } from 'react';

const tabs = ['School Profile', 'Academic Config', 'Notifications', 'Users & Roles'];

interface User { id: string; name: string; email: string; role: 'Super Admin' | 'Admin' | 'Teacher' | 'Accountant'; lastLogin: string; status: 'Active' | 'Inactive'; }

const initialUsers: User[] = [
  { id: 'USR-001', name: 'Dr. Arvind Kumar', email: 'principal@elevation.edu', role: 'Super Admin', lastLogin: '2026-06-15 09:00', status: 'Active' },
  { id: 'USR-002', name: 'Priya Sharma', email: 'priya.s@elevation.edu', role: 'Admin', lastLogin: '2026-06-14 14:30', status: 'Active' },
  { id: 'USR-003', name: 'Ramesh Yadav', email: 'ramesh.y@elevation.edu', role: 'Accountant', lastLogin: '2026-06-13 10:15', status: 'Active' },
  { id: 'USR-004', name: 'Meera Iyer', email: 'meera.i@elevation.edu', role: 'Teacher', lastLogin: '2026-06-12 08:00', status: 'Active' },
];

export default function SettingsPage() {
  const [tab, setTab] = useState(0);
  const [users, setUsers] = useState<User[]>(initialUsers);

  const [school, setSchool] = useState({
    name: 'Elevation International School',
    address: '123 Education Boulevard, Sector 62, Noida, UP 201301',
    phone: '+91 98765 43210',
    email: 'info@elevation.edu',
    principal: 'Dr. Arvind Kumar',
    affiliation: 'CBSE',
    established: '2005',
  });

  const [academic, setAcademic] = useState({
    year: '2026-27',
    term1Start: '2026-04-01',
    term1End: '2026-09-30',
    term2Start: '2026-10-01',
    term2End: '2027-03-31',
    gradingScale: 'CBSE (A+ to D)',
    classesFrom: '1',
    classesTo: '12',
  });

  const [notifications, setNotifications] = useState({
    smsEnabled: true,
    emailEnabled: true,
    feeReminders: true,
    attendanceAlerts: true,
    resultPublish: true,
    eventNotify: false,
    parentApp: true,
  });

  const [userForm, setUserForm] = useState({ name: '', email: '', role: 'Teacher' as User['role'] });

  const handleAddUser = () => {
    if (!userForm.name || !userForm.email) return;
    setUsers([{ id: `USR-${Date.now().toString(36)}`, ...userForm, lastLogin: 'Never', status: 'Active' }, ...users]);
    setUserForm({ name: '', email: '', role: 'Teacher' });
  };

  const Toggle = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) => (
    <div className="flex items-center justify-between py-3 border-b border-outline-variant/30 last:border-b-0">
      <span className="text-sm font-medium">{label}</span>
      <button onClick={onChange} className={`w-11 h-6 rounded-full transition-colors duration-300 relative ${checked ? 'bg-[#2563EB]' : 'bg-outline-variant/40'}`}>
        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-300 shadow-sm ${checked ? 'translate-x-6' : 'translate-x-1'}`}></div>
      </button>
    </div>
  );

  const roleColor = (r: string) => {
    if (r === 'Super Admin') return 'bg-purple-100 text-purple-700';
    if (r === 'Admin') return 'bg-blue-100 text-blue-700';
    if (r === 'Accountant') return 'bg-emerald-100 text-emerald-700';
    return 'bg-amber-100 text-amber-700';
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-[fadeIn_0.6s_ease-out]">
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0A192F] to-[#1e3a8a] rounded-2xl p-4 md:p-5 shadow-md text-white">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-48 h-48 bg-white opacity-5 rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <h1 className="text-2xl font-bold tracking-tight">System Settings</h1>
          <p className="text-sm text-blue-100 mt-1">Configure school profile, academic settings, notifications, and user access.</p>
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

      {/* School Profile */}
      {tab === 0 && (
        <div className="bg-surface rounded-2xl border border-outline-variant card-shadow p-6 space-y-5">
          <h3 className="font-bold text-lg flex items-center gap-2"><span className="material-symbols-outlined text-primary">school</span>School Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(school).map(([key, val]) => (
              <div key={key}>
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                <input value={val} onChange={e => setSchool({ ...school, [key]: e.target.value })} className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:border-primary" />
              </div>
            ))}
          </div>
          <button className="bg-[#2563EB] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">save</span>Save Profile
          </button>
        </div>
      )}

      {/* Academic Config */}
      {tab === 1 && (
        <div className="bg-surface rounded-2xl border border-outline-variant card-shadow p-6 space-y-5">
          <h3 className="font-bold text-lg flex items-center gap-2"><span className="material-symbols-outlined text-primary">settings</span>Academic Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(academic).map(([key, val]) => (
              <div key={key}>
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">{key.replace(/([A-Z0-9])/g, ' $1').trim()}</label>
                <input type={key.includes('Start') || key.includes('End') ? 'date' : 'text'} value={val} onChange={e => setAcademic({ ...academic, [key]: e.target.value })} className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:border-primary" />
              </div>
            ))}
          </div>
          <button className="bg-[#2563EB] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">save</span>Save Configuration
          </button>
        </div>
      )}

      {/* Notifications */}
      {tab === 2 && (
        <div className="bg-surface rounded-2xl border border-outline-variant card-shadow p-6 space-y-2">
          <h3 className="font-bold text-lg flex items-center gap-2 mb-4"><span className="material-symbols-outlined text-primary">notifications</span>Notification Preferences</h3>
          <Toggle label="SMS Notifications" checked={notifications.smsEnabled} onChange={() => setNotifications({ ...notifications, smsEnabled: !notifications.smsEnabled })} />
          <Toggle label="Email Notifications" checked={notifications.emailEnabled} onChange={() => setNotifications({ ...notifications, emailEnabled: !notifications.emailEnabled })} />
          <Toggle label="Fee Payment Reminders" checked={notifications.feeReminders} onChange={() => setNotifications({ ...notifications, feeReminders: !notifications.feeReminders })} />
          <Toggle label="Attendance Alerts" checked={notifications.attendanceAlerts} onChange={() => setNotifications({ ...notifications, attendanceAlerts: !notifications.attendanceAlerts })} />
          <Toggle label="Result Publication Alerts" checked={notifications.resultPublish} onChange={() => setNotifications({ ...notifications, resultPublish: !notifications.resultPublish })} />
          <Toggle label="Event Notifications" checked={notifications.eventNotify} onChange={() => setNotifications({ ...notifications, eventNotify: !notifications.eventNotify })} />
          <Toggle label="Parent App Push Notifications" checked={notifications.parentApp} onChange={() => setNotifications({ ...notifications, parentApp: !notifications.parentApp })} />
        </div>
      )}

      {/* Users */}
      {tab === 3 && (
        <div className="space-y-6">
          <div className="bg-surface rounded-2xl border border-outline-variant card-shadow p-6 space-y-4">
            <h3 className="font-bold text-sm flex items-center gap-2"><span className="material-symbols-outlined text-primary text-[20px]">person_add</span>Add Admin User</h3>
            <div className="flex flex-wrap gap-3">
              <input value={userForm.name} onChange={e => setUserForm({ ...userForm, name: e.target.value })} placeholder="Full Name" className="flex-1 min-w-[150px] bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:border-primary" />
              <input value={userForm.email} onChange={e => setUserForm({ ...userForm, email: e.target.value })} placeholder="Email" className="flex-1 min-w-[150px] bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:border-primary" />
              <select value={userForm.role} onChange={e => setUserForm({ ...userForm, role: e.target.value as User['role'] })} className="bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm font-bold outline-none focus:border-primary">
                <option>Super Admin</option><option>Admin</option><option>Teacher</option><option>Accountant</option>
              </select>
              <button onClick={handleAddUser} className="bg-[#2563EB] text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">add</span>Add
              </button>
            </div>
          </div>

          <div className="bg-surface rounded-2xl border border-outline-variant card-shadow overflow-hidden">
            <table className="w-full text-left">
              <thead><tr className="bg-surface-container-lowest border-b border-outline-variant">
                {['Name', 'Email', 'Role', 'Last Login', 'Status', 'Actions'].map(h => (
                  <th key={h} className={`px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b border-outline-variant/50 hover:bg-primary/5 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold">{u.name}</td>
                    <td className="px-6 py-4 text-xs text-on-surface-variant">{u.email}</td>
                    <td className="px-6 py-4"><span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${roleColor(u.role)}`}>{u.role}</span></td>
                    <td className="px-6 py-4 text-xs font-semibold">{u.lastLogin}</td>
                    <td className="px-6 py-4"><span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">{u.status}</span></td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => setUsers(prev => prev.filter(x => x.id !== u.id))} className="text-error hover:bg-error/10 p-1.5 rounded-lg transition-colors"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                    </td>
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
