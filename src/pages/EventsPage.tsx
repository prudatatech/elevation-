import { useState } from 'react';

const tabs = ['Upcoming Events', 'Past Events', 'Circulars'];

interface Event { id: string; name: string; date: string; venue: string; description: string; type: 'Cultural' | 'Sports' | 'Academic' | 'Meeting' | 'Holiday'; }
interface Circular { id: string; title: string; date: string; audience: string; content: string; }

const initialEvents: Event[] = [
  { id: 'EVT-001', name: 'Annual Day Celebration', date: '2026-06-25', venue: 'School Auditorium', description: 'Annual day with cultural performances, prize distribution, and chief guest address.', type: 'Cultural' },
  { id: 'EVT-002', name: 'Inter-House Cricket Tournament', date: '2026-07-05', venue: 'School Ground', description: 'Cricket tournament between all four houses for classes 8-12.', type: 'Sports' },
  { id: 'EVT-003', name: 'Science Exhibition', date: '2026-07-15', venue: 'Science Block', description: 'Students showcase their science projects and working models.', type: 'Academic' },
  { id: 'EVT-004', name: 'Parent-Teacher Meeting', date: '2026-06-20', venue: 'Classrooms', description: 'PTM for classes 9-12. Parents to meet subject teachers.', type: 'Meeting' },
];

const pastEvents: Event[] = [
  { id: 'EVT-P01', name: 'Republic Day Celebration', date: '2026-01-26', venue: 'School Ground', description: 'Flag hoisting and patriotic performances.', type: 'Cultural' },
  { id: 'EVT-P02', name: 'Sports Day', date: '2026-02-15', venue: 'Stadium', description: 'Annual sports day with track and field events.', type: 'Sports' },
];

const initialCirculars: Circular[] = [
  { id: 'CIR-001', title: 'Uniform Policy Update', date: '2026-06-10', audience: 'All Students', content: 'From July 2026, all students must wear the new school uniform as per the updated guidelines.' },
  { id: 'CIR-002', title: 'Fee Structure 2026-27', date: '2026-06-01', audience: 'Parents', content: 'The revised fee structure for the academic year 2026-27 has been published. Please check the school website.' },
];

const typeColor = (t: string) => {
  if (t === 'Cultural') return 'bg-purple-100 text-purple-700';
  if (t === 'Sports') return 'bg-emerald-100 text-emerald-700';
  if (t === 'Academic') return 'bg-blue-100 text-blue-700';
  if (t === 'Meeting') return 'bg-amber-100 text-amber-700';
  return 'bg-gray-100 text-gray-600';
};

export default function EventsPage() {
  const [tab, setTab] = useState(0);
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [circulars, setCirculars] = useState<Circular[]>(initialCirculars);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [eventForm, setEventForm] = useState({ name: '', date: '', venue: '', description: '', type: 'Cultural' as Event['type'] });
  const [circForm, setCircForm] = useState({ title: '', audience: '', content: '' });

  const handleAddEvent = () => {
    if (!eventForm.name || !eventForm.date) return;
    if (editingId) {
      setEvents(prev => prev.map(e => e.id === editingId ? { ...e, ...eventForm } : e));
      setEditingId(null);
    } else {
      setEvents([{ id: `EVT-${Date.now().toString(36)}`, ...eventForm }, ...events]);
    }
    setEventForm({ name: '', date: '', venue: '', description: '', type: 'Cultural' });
  };

  const handleAddCircular = () => {
    if (!circForm.title || !circForm.content) return;
    setCirculars([{ id: `CIR-${Date.now().toString(36)}`, ...circForm, date: new Date().toISOString().split('T')[0] }, ...circulars]);
    setCircForm({ title: '', audience: '', content: '' });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-[fadeIn_0.6s_ease-out]">
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0A192F] to-[#1e3a8a] rounded-2xl p-4 md:p-5 shadow-md text-white">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-48 h-48 bg-white opacity-5 rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <h1 className="text-2xl font-bold tracking-tight">Events & Circulars</h1>
          <p className="text-sm text-blue-100 mt-1">Schedule school events and publish official circulars.</p>
        </div>
      </div>

      <div className="flex gap-4 border-b border-outline-variant/30 overflow-x-auto no-scrollbar pb-2">
        {tabs.map((t, i) => (
          <button key={t} onClick={() => { setTab(i); setEditingId(null); }}
            className={`px-6 py-3 text-sm font-bold whitespace-nowrap transition-all duration-300 rounded-xl ${tab === i ? 'text-white bg-[#2563EB] shadow-lg shadow-blue-500/30 -translate-y-0.5' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container/50'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Tab 0: Upcoming Events */}
      {tab === 0 && (
        <div className="space-y-6">
          <div className="bg-surface rounded-2xl border border-outline-variant card-shadow p-6 space-y-4">
            <h3 className="font-bold text-sm flex items-center gap-2"><span className="material-symbols-outlined text-primary text-[20px]">add_circle</span>{editingId ? 'Edit Event' : 'Add New Event'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input value={eventForm.name} onChange={e => setEventForm({ ...eventForm, name: e.target.value })} placeholder="Event Name *" className="bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:border-primary" />
              <input type="date" value={eventForm.date} onChange={e => setEventForm({ ...eventForm, date: e.target.value })} className="bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm font-bold outline-none focus:border-primary" />
              <input value={eventForm.venue} onChange={e => setEventForm({ ...eventForm, venue: e.target.value })} placeholder="Venue" className="bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:border-primary" />
            </div>
            <div className="flex gap-4">
              <select value={eventForm.type} onChange={e => setEventForm({ ...eventForm, type: e.target.value as Event['type'] })} className="bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm font-bold outline-none focus:border-primary">
                <option>Cultural</option><option>Sports</option><option>Academic</option><option>Meeting</option><option>Holiday</option>
              </select>
              <input value={eventForm.description} onChange={e => setEventForm({ ...eventForm, description: e.target.value })} placeholder="Description" className="flex-1 bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:border-primary" />
            </div>
            <button onClick={handleAddEvent} className="bg-[#2563EB] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">{editingId ? 'save' : 'add'}</span>{editingId ? 'Update Event' : 'Add Event'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map(e => (
              <div key={e.id} className="bg-surface rounded-2xl border border-outline-variant card-shadow p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group">
                <div className="flex items-start justify-between mb-3">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${typeColor(e.type)}`}>{e.type}</span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEventForm({ name: e.name, date: e.date, venue: e.venue, description: e.description, type: e.type }); setEditingId(e.id); }} className="text-primary hover:bg-primary/10 p-1 rounded-lg"><span className="material-symbols-outlined text-[16px]">edit</span></button>
                    <button onClick={() => setEvents(prev => prev.filter(ev => ev.id !== e.id))} className="text-error hover:bg-error/10 p-1 rounded-lg"><span className="material-symbols-outlined text-[16px]">delete</span></button>
                  </div>
                </div>
                <h4 className="font-bold text-lg mb-1">{e.name}</h4>
                <div className="flex items-center gap-4 text-xs text-on-surface-variant font-semibold mb-2">
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">calendar_today</span>{e.date}</span>
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">location_on</span>{e.venue}</span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">{e.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 1: Past Events */}
      {tab === 1 && (
        <div className="bg-surface rounded-2xl border border-outline-variant card-shadow overflow-hidden">
          <table className="w-full text-left">
            <thead><tr className="bg-surface-container-lowest border-b border-outline-variant">
              {['Event', 'Date', 'Venue', 'Type'].map(h => <th key={h} className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{h}</th>)}
            </tr></thead>
            <tbody>
              {pastEvents.map(e => (
                <tr key={e.id} className="border-b border-outline-variant/50 hover:bg-surface-container-lowest transition-colors">
                  <td className="px-6 py-4"><div className="text-sm font-bold">{e.name}</div><div className="text-[10px] text-on-surface-variant">{e.description}</div></td>
                  <td className="px-6 py-4 text-xs font-semibold">{e.date}</td>
                  <td className="px-6 py-4 text-xs text-on-surface-variant">{e.venue}</td>
                  <td className="px-6 py-4"><span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${typeColor(e.type)}`}>{e.type}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Circulars */}
      {tab === 2 && (
        <div className="space-y-6">
          <div className="bg-surface rounded-2xl border border-outline-variant card-shadow p-6 space-y-4">
            <h3 className="font-bold text-sm flex items-center gap-2"><span className="material-symbols-outlined text-primary text-[20px]">description</span>Add New Circular</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input value={circForm.title} onChange={e => setCircForm({ ...circForm, title: e.target.value })} placeholder="Circular Title *" className="bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:border-primary" />
              <input value={circForm.audience} onChange={e => setCircForm({ ...circForm, audience: e.target.value })} placeholder="Target Audience (e.g. All Students)" className="bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:border-primary" />
            </div>
            <textarea value={circForm.content} onChange={e => setCircForm({ ...circForm, content: e.target.value })} rows={3} placeholder="Circular content..." className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:border-primary resize-none" />
            <button onClick={handleAddCircular} className="bg-[#2563EB] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">publish</span>Publish Circular
            </button>
          </div>

          <div className="bg-surface rounded-2xl border border-outline-variant card-shadow overflow-hidden">
            <table className="w-full text-left">
              <thead><tr className="bg-surface-container-lowest border-b border-outline-variant">
                {['Title', 'Audience', 'Date', 'Actions'].map(h => <th key={h} className={`px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>)}
              </tr></thead>
              <tbody>
                {circulars.map(c => (
                  <tr key={c.id} className="border-b border-outline-variant/50 hover:bg-primary/5 transition-colors">
                    <td className="px-6 py-4"><div className="text-sm font-bold">{c.title}</div><div className="text-[10px] text-on-surface-variant truncate max-w-sm">{c.content}</div></td>
                    <td className="px-6 py-4 text-xs font-semibold">{c.audience}</td>
                    <td className="px-6 py-4 text-xs font-semibold">{c.date}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => setCirculars(prev => prev.filter(ci => ci.id !== c.id))} className="text-error hover:bg-error/10 p-1.5 rounded-lg transition-colors"><span className="material-symbols-outlined text-[18px]">delete</span></button>
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
