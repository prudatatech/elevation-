import { Link, useParams, useNavigate } from 'react-router-dom';
import { getStudentById } from '../../data/students';

export default function StudentReport() {
  const { studentId } = useParams();
  const navigate = useNavigate();

  const data = getStudentById(studentId || '');

  if (!data) {
    return (
      <div className="p-8 flex flex-col items-center justify-center text-center h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">Student Not Found</h2>
        <button onClick={() => navigate('/students')} className="bg-primary text-on-primary px-4 py-2 rounded-lg font-bold">Go to Directory</button>
      </div>
    );
  }

  const { student, classNum, sectionName } = data;
  const p = student.performance;

  // Simple SVG bar chart logic
  const maxMark = 100;
  const chartHeight = 200;

  function getGrade(marks: number, total: number) {
    const p = (marks / total) * 100;
    if (p >= 90) return 'A+';
    if (p >= 80) return 'A';
    if (p >= 70) return 'B+';
    if (p >= 60) return 'B';
    if (p >= 50) return 'C';
    return 'D';
  }
  
  return (
    <div className="p-6 lg:p-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 mb-6 text-sm font-semibold text-on-surface-variant">
        <Link to="/students" className="hover:text-primary transition-colors">Students</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <Link to={`/students/${classNum}`} className="hover:text-primary transition-colors">Class {classNum}</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <Link to={`/students/${classNum}/${sectionName}`} className="hover:text-primary transition-colors">Section {sectionName}</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="text-primary">{student.name}</span>
      </div>

      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center font-[Outfit] text-3xl font-bold text-primary shrink-0">
            {student.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h2 className="font-[Outfit] text-3xl font-bold">{student.name}</h2>
            <p className="text-on-surface-variant text-sm mt-1">{student.id} | Class {classNum} - {sectionName} | Roll: {student.rollNo}</p>
          </div>
        </div>
        <button className="bg-primary text-on-primary px-5 py-2 rounded-xl text-sm font-bold shadow-md hover:opacity-90 flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">download</span>
          Download PDF
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard icon="school" title="Overall CGPA" value={p.cgpa.toFixed(1)} sub={`${p.percentage}% Total`} color="primary" />
        <MetricCard icon="event_available" title="Attendance" value={`${student.attendance}%`} sub="Present Days" color={student.attendance >= 75 ? 'primary' : 'error'} />
        <MetricCard icon="psychology" title="Attentiveness" value={`${p.attentiveness}%`} sub="Class Focus Score" color="primary" />
        <MetricCard icon="assignment_turned_in" title="Assignments" value={`${p.assignmentsCompleted}%`} sub="Completion Rate" color="primary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subject Marks Graph & Table */}
        <div className="lg:col-span-2 bg-surface p-6 rounded-2xl border border-outline-variant card-shadow flex flex-col">
          <h3 className="font-[Outfit] text-lg font-bold mb-6">Subject Performance</h3>
          
          <div className="relative h-[250px] w-full flex items-end justify-between px-4 pb-8 pt-4 mb-8">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pb-8 pointer-events-none opacity-20">
              {[100, 80, 60, 40, 20, 0].map(val => (
                <div key={val} className="border-t border-outline-variant w-full relative">
                  <span className="absolute -left-6 -top-2 text-[10px] font-bold text-on-surface-variant">{val}</span>
                </div>
              ))}
            </div>
            
            {/* Bars */}
            {p.marks.map((m, i) => (
              <div key={i} className="relative flex flex-col items-center group" style={{ width: `${100 / p.marks.length}%` }}>
                <div 
                  className="w-12 bg-primary-container rounded-t-lg transition-all group-hover:bg-primary relative"
                  style={{ height: `${(m.marks / maxMark) * chartHeight}px` }}
                >
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-surface shadow-sm px-2 py-1 rounded">
                    {m.marks}
                  </span>
                </div>
                <span className="absolute -bottom-6 text-[10px] font-bold text-on-surface-variant text-center leading-tight">
                  {m.subject.split(' ').map((w, j) => <span key={j} className="block">{w}</span>)}
                </span>
              </div>
            ))}
          </div>

          {/* Marks Table */}
          <div className="mt-4 border border-outline-variant rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  <th className="px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Subject</th>
                  <th className="px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">Marks</th>
                  <th className="px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">Total</th>
                  <th className="px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">Percentage</th>
                  <th className="px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-center">Grade</th>
                </tr>
              </thead>
              <tbody>
                {p.marks.map((m, i) => {
                  const percentage = Math.round((m.marks / m.total) * 100);
                  const grade = getGrade(m.marks, m.total);
                  return (
                    <tr key={i} className="border-b border-outline-variant/50 hover:bg-surface-container-low/50 transition-colors">
                      <td className="px-4 py-3 text-sm font-semibold">{m.subject}</td>
                      <td className="px-4 py-3 text-sm text-right font-bold">{m.marks}</td>
                      <td className="px-4 py-3 text-sm text-right text-on-surface-variant">{m.total}</td>
                      <td className="px-4 py-3 text-sm text-right">{percentage}%</td>
                      <td className="px-4 py-3 text-sm text-center">
                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                          grade.startsWith('A') ? 'bg-green-100 text-green-700' :
                          grade.startsWith('B') ? 'bg-primary/10 text-primary' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {grade}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Behavioral Metrics */}
        <div className="bg-surface p-6 rounded-2xl border border-outline-variant card-shadow flex flex-col gap-6">
          <h3 className="font-[Outfit] text-lg font-bold">Behavioral Analysis</h3>
          
          <ProgressCircle label="Class Participation" value={p.participationScore} color="var(--color-primary)" />
          <ProgressCircle label="Behavior & Conduct" value={p.behaviorScore} color="var(--color-tertiary)" />
          
          <div className="mt-auto pt-6 border-t border-outline-variant">
            <h4 className="text-sm font-bold mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">psychology</span>
              AI Insight
            </h4>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Based on recent assessments, {student.name.split(' ')[0]} demonstrates strong analytical skills, particularly in {p.marks.reduce((a,b)=>a.marks>b.marks?a:b).subject}. {student.gender === 'Male' ? 'His' : 'Her'} attendance is {student.attendance >= 85 ? 'excellent' : 'fair'}, contributing to consistent academic progress. Recommend continuing to encourage participation in group discussions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, title, value, sub, color }: { icon: string; title: string; value: string; sub: string; color: string }) {
  const bg = color === 'error' ? 'bg-error/10 text-error' : 'bg-primary/10 text-primary';
  return (
    <div className="bg-surface p-5 rounded-2xl border border-outline-variant card-shadow">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bg}`}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <div>
          <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider">{title}</p>
        </div>
      </div>
      <div className="flex items-end gap-2">
        <h3 className="font-[Outfit] text-3xl font-bold">{value}</h3>
        <p className="text-sm font-semibold text-on-surface-variant mb-1">{sub}</p>
      </div>
    </div>
  );
}

function ProgressCircle({ label, value, color }: { label: string; value: number; color: string }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-20 h-20 shrink-0">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="40" cy="40" r={radius} fill="transparent" stroke="var(--color-surface-container-high)" strokeWidth="6" />
          <circle 
            cx="40" cy="40" r={radius} 
            fill="transparent" 
            stroke={color} 
            strokeWidth="6" 
            strokeDasharray={circumference} 
            strokeDashoffset={strokeDashoffset} 
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-[Outfit] text-lg font-bold">{value}%</span>
        </div>
      </div>
      <div>
        <p className="font-bold text-sm">{label}</p>
        <p className="text-xs text-on-surface-variant mt-0.5">
          {value >= 80 ? 'Excellent' : value >= 60 ? 'Good' : 'Needs Improvement'}
        </p>
      </div>
    </div>
  );
}
