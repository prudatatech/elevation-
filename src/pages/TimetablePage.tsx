import { useState, useMemo } from 'react';
import { DAYS, PERIODS, CLASSES, getTeacherSchedule, getClassSchedule } from '../data/timetable';
import { getAllTeachers } from '../data/staff';
import { exportToPDF } from '../utils/exportUtils';

export default function TimetablePage() {
  const [viewMode, setViewMode] = useState<'teacher' | 'class'>('teacher');
  const [selectedId, setSelectedId] = useState<string>('TCH-001');

  const teachers = getAllTeachers();

  const schedule = useMemo(() => {
    if (viewMode === 'teacher') return getTeacherSchedule(selectedId);
    return getClassSchedule(selectedId);
  }, [viewMode, selectedId]);

  return (
    <div className="p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-[Outfit] text-3xl font-bold">Timetable Management</h2>
          <p className="text-on-surface-variant text-sm mt-1">View and manage class allocations for teachers and students.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => exportToPDF('timetable-grid', `Elevation_Timetable_${viewMode}_${selectedId}`)} className="p-2 border border-outline-variant rounded-xl hover:bg-surface-container-low transition-colors text-sm font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">download</span> Export
          </button>
          <button className="bg-primary text-on-primary px-5 py-2 rounded-xl text-sm font-bold shadow-md hover:opacity-90 transition-opacity flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">edit_calendar</span> Edit Master Schedule
          </button>
        </div>
      </div>

      <div className="bg-surface p-4 rounded-2xl border border-outline-variant card-shadow mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex bg-surface-container-low rounded-lg p-1 w-full md:w-auto">
          <button
            onClick={() => { setViewMode('teacher'); setSelectedId('TCH-001'); }}
            className={`flex-1 md:flex-none px-6 py-2 rounded-md text-sm font-bold transition-all ${viewMode === 'teacher' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
          >
            Teacher View
          </button>
          <button
            onClick={() => { setViewMode('class'); setSelectedId('10-A'); }}
            className={`flex-1 md:flex-none px-6 py-2 rounded-md text-sm font-bold transition-all ${viewMode === 'class' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
          >
            Class View
          </button>
        </div>

        <div className="relative w-full md:w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
          <select
            className="w-full bg-surface-container-low border-none rounded-lg pl-10 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 appearance-none font-bold"
            value={selectedId}
            onChange={e => setSelectedId(e.target.value)}
          >
            {viewMode === 'teacher' ? (
              teachers.map(t => (
                <option key={t.id} value={t.id}>{t.name} ({t.id})</option>
              ))
            ) : (
              CLASSES.map(c => (
                <option key={c} value={c}>Class {c}</option>
              ))
            )}
          </select>
        </div>
      </div>

      {/* Timetable Grid */}
      <div id="timetable-grid" className="bg-surface border border-outline-variant rounded-2xl card-shadow overflow-x-auto">
        <div className="p-6 hidden print-header">
          <h2 className="text-2xl font-bold text-primary mb-2">Elevation ERP Timetable</h2>
          <p className="text-lg font-bold">{viewMode === 'teacher' ? `Teacher: ${selectedId}` : `Class: ${selectedId}`}</p>
        </div>
        <table className="w-full text-left min-w-[800px]">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant">
              <th className="px-4 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider w-32 border-r border-outline-variant">Day</th>
              {PERIODS.map(p => (
                <th key={p.id} className="px-2 py-4 text-center border-r border-outline-variant last:border-0 relative group">
                  <div className="text-xs font-bold text-on-surface">Period {p.id}</div>
                  <div className="text-[9px] text-on-surface-variant mt-1">{p.time}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DAYS.map(day => (
              <tr key={day} className="border-b border-outline-variant last:border-0">
                <td className="px-4 py-6 font-bold text-sm border-r border-outline-variant bg-surface-container-lowest">
                  {day}
                </td>
                {PERIODS.map(p => {
                  const block = schedule[day][p.id];
                  
                  // Special visual for breaks
                  if (p.id === 4 || p.id === 7) {
                    return (
                      <td key={p.id} className="p-2 border-r border-outline-variant bg-surface-container-low/50 relative">
                        {block ? (
                          <BlockCard block={block} viewMode={viewMode} teachers={teachers} />
                        ) : (
                          <div className="h-full min-h-[80px] w-full flex items-center justify-center border-2 border-dashed border-outline-variant/30 rounded-xl bg-surface-container-lowest/50 text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">
                            Free
                          </div>
                        )}
                        <div className="absolute top-0 right-0 bottom-0 left-0 pointer-events-none flex items-center justify-center opacity-10">
                           <span className="material-symbols-outlined text-[40px] rotate-[-45deg]">{p.id === 4 ? 'coffee' : 'restaurant'}</span>
                        </div>
                      </td>
                    );
                  }

                  return (
                    <td key={p.id} className="p-2 border-r border-outline-variant last:border-0 align-top transition-colors hover:bg-surface-container-lowest">
                      {block ? (
                        <BlockCard block={block} viewMode={viewMode} teachers={teachers} />
                      ) : (
                        <div className="h-full min-h-[80px] w-full flex items-center justify-center border-2 border-dashed border-outline-variant/50 rounded-xl bg-surface-container-lowest text-xs text-outline font-bold">
                          Free Period
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <style>{`
        #timetable-grid .print-header { display: none; }
      `}</style>
    </div>
  );
}

function BlockCard({ block, viewMode, teachers }: any) {
  const teacher = teachers.find((t: any) => t.id === block.teacherId);
  
  return (
    <div className="bg-primary/5 border border-primary/20 p-3 rounded-xl h-full min-h-[80px] flex flex-col justify-center relative group hover:bg-primary/10 transition-colors cursor-pointer">
      <div className="font-bold text-primary text-sm mb-1">{block.subject}</div>
      {viewMode === 'teacher' ? (
        <div className="flex items-center gap-1.5 text-xs text-on-surface font-semibold">
          <span className="material-symbols-outlined text-[14px]">school</span>
          Class {block.classId}
        </div>
      ) : (
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5 text-xs text-on-surface font-semibold truncate" title={teacher?.name}>
            <span className="material-symbols-outlined text-[14px]">person</span>
            {teacher?.name || block.teacherId}
          </div>
        </div>
      )}
    </div>
  );
}
