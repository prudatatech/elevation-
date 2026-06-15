import { Link, useParams, useNavigate } from 'react-router-dom';
import { getClassByNum } from '../../data/students';

export default function SectionList() {
  const { classNum } = useParams();
  const navigate = useNavigate();
  const cls = getClassByNum(Number(classNum));

  if (!cls) {
    return (
      <div className="p-8 flex flex-col items-center justify-center text-center h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">Class Not Found</h2>
        <button onClick={() => navigate('/students')} className="bg-primary text-on-primary px-4 py-2 rounded-lg font-bold">Go Back</button>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center gap-2 mb-6 text-sm font-semibold text-on-surface-variant">
        <Link to="/students" className="hover:text-primary transition-colors">Students</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="text-primary">{cls.className}</span>
      </div>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="font-[Outfit] text-3xl font-bold flex items-center gap-3">
            <span className="material-symbols-outlined text-[36px]" style={{ color: cls.color }}>{cls.icon}</span>
            {cls.className}
          </h2>
          <p className="text-on-surface-variant text-sm mt-1">Select a section to view student records.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cls.sections.map(sec => (
          <Link
            key={sec.name}
            to={`/students/${cls.classNum}/${sec.name}`}
            className="bg-surface p-6 rounded-2xl border border-outline-variant card-shadow hover:border-primary/50 hover:shadow-lg transition-all group flex flex-col"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold font-[Outfit] transition-transform group-hover:scale-110" style={{ backgroundColor: `${cls.color}20`, color: cls.color }}>
                {sec.name}
              </div>
              <span className="bg-surface-container-low text-on-surface-variant text-xs font-bold px-3 py-1 rounded-full">
                {sec.students.length} Students
              </span>
            </div>
            {sec.stream && (
              <p className="text-sm font-bold text-on-surface mb-4 pb-4 border-b border-outline-variant">
                Stream: {sec.stream}
              </p>
            )}
            <div className="mt-auto flex items-center text-sm font-bold text-primary group-hover:underline">
              View Records <span className="material-symbols-outlined text-[18px] ml-1">arrow_forward</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
