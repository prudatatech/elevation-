import { Link } from 'react-router-dom';
import { classData, getTotalStudents, getActiveStudents } from '../../data/students';

export default function ClassList() {
  return (
    <div className="p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-[Outfit] text-2xl font-bold">Student Directory</h2>
          <p className="text-on-surface-variant text-sm mt-0.5">Select a class to view its sections and student records.</p>
        </div>
        <button className="bg-primary text-on-primary px-5 py-2 rounded-xl text-sm font-bold shadow-md hover:opacity-90 flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          Quick Add
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <SummaryCard icon="groups" title="Total Students" value={String(getTotalStudents())} color="primary" />
        <SummaryCard icon="check_circle" title="Active" value={String(getActiveStudents())} color="primary" />
        <SummaryCard icon="school" title="Total Classes" value="12" color="primary" />
        <SummaryCard icon="meeting_room" title="Total Sections" value={String(classData.reduce((s, c) => s + c.sections.length, 0))} color="primary" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {classData.map(cls => (
          <Link
            key={cls.classNum}
            to={`/students/${cls.classNum}`}
            className="bg-surface p-5 rounded-2xl border border-outline-variant card-shadow hover:border-primary/50 hover:shadow-lg transition-all group flex flex-col items-center text-center"
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
              style={{ backgroundColor: `${cls.color}20`, color: cls.color }}
            >
              <span className="material-symbols-outlined text-[32px]">{cls.icon}</span>
            </div>
            <h3 className="font-[Outfit] text-xl font-bold mb-1">{cls.className}</h3>
            <p className="text-sm font-semibold text-on-surface-variant mb-4">
              {cls.sections.length} Sections
            </p>
            <div className="w-full pt-4 border-t border-outline-variant flex justify-between items-center text-sm">
              <span className="text-on-surface-variant">Students</span>
              <span className="font-bold text-primary">{cls.sections.reduce((s, sec) => s + sec.students.length, 0)}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function SummaryCard({ icon, title, value, color }: { icon: string; title: string; value: string; color: string }) {
  const bg = color === 'error' ? 'bg-error/10 text-error' : 'bg-primary/10 text-primary';
  return (
    <div className="bg-surface p-4 rounded-2xl border border-outline-variant card-shadow hover:border-primary/50 transition-colors">
      <div className="flex items-center gap-2 mb-2">
        <div className={`p-1.5 rounded-lg ${bg}`}><span className="material-symbols-outlined text-[18px]">{icon}</span></div>
        <p className="text-on-surface-variant text-xs font-medium">{title}</p>
      </div>
      <h3 className="font-[Outfit] text-xl font-bold">{value}</h3>
    </div>
  );
}
