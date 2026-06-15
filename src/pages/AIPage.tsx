import { useState } from 'react';
import { getAllTeachers } from '../data/staff';
import { getTeacherSchedule, getFreeTeachersForPeriod, PERIODS } from '../data/timetable';
import { exportToPDF } from '../utils/exportUtils';

const generateMockReport = (isRestructured: boolean) => {
  return Array.from({ length: 12 }, (_, i) => ({
    class: i + 1,
    sections: ['A', 'B', 'C', 'D'].slice(0, 2 + Math.floor(Math.random() * 3)),
    avgGrade: ['A', 'A-', 'B+', 'B', 'B-'][Math.floor(Math.random() * 5)],
    passPercentage: (isRestructured ? 90 : 82) + Math.floor(Math.random() * 10),
    promotedStudents: 120 + Math.floor(Math.random() * 40),
    teachersReallocated: isRestructured ? (1 + Math.floor(Math.random() * 3)) : 0,
    workloadChange: isRestructured ? ((Math.random() * 10 - 5).toFixed(1) + '%') : '0%',
    scheduleChanges: isRestructured ? Array.from({ length: 1 + Math.floor(Math.random()*2) }, () => ({
      subject: ['Mathematics', 'Physics', 'Chemistry', 'English', 'Biology', 'History'][Math.floor(Math.random()*6)],
      oldTeacher: getAllTeachers()[Math.floor(Math.random() * getAllTeachers().length)].name,
      newTeacher: getAllTeachers()[Math.floor(Math.random() * getAllTeachers().length)].name,
      reason: ['Retirement Repl.', 'Workload Bal.', 'Skill Match'][Math.floor(Math.random()*3)]
    })) : []
  }));
};

export default function AIPage() {
  const [activeTab, setActiveTab] = useState<'substitutes' | 'restructure'>('substitutes');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);
  
  const [isSimulatingRestructure, setIsSimulatingRestructure] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [reportYear, setReportYear] = useState('2025 (Current)');
  const [restructureReport, setRestructureReport] = useState<any>(() => generateMockReport(false));
  const [selectedClass, setSelectedClass] = useState<any>(null);

  const absentTeachers = getAllTeachers().filter(t => t.status === 'On Leave');

  const handleSimulateRestructure = () => {
    setIsSimulatingRestructure(true);
    setSimulationProgress(0);
    setSelectedClass(null);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 1;
      setSimulationProgress(progress);

      if (progress > 12) {
        clearInterval(interval);
        setRestructureReport(generateMockReport(true));
        setReportYear('2026 (Restructured)');
        setIsSimulatingRestructure(false);
      }
    }, 400); // 400ms per class for the animation
  };

  const handleGenerateSubstitutes = () => {
    setIsGenerating(true);
    setTimeout(() => {
      // Simulate Nova AI logic
      const plan: any[] = [];
      const today = 'Monday'; // Mocking today as Monday
      
      absentTeachers.forEach(teacher => {
        const schedule = getTeacherSchedule(teacher.id)[today];
        const substitutionNeeds: any[] = [];
        
        PERIODS.forEach(p => {
          const block = schedule[p.id];
          if (block) {
            // Nova AI finds free teachers for this period
            const freeTeachers = getFreeTeachersForPeriod(today, p.id);
            // AI ranks them: prefers same department
            const ranked = freeTeachers.sort((a, b) => {
              if (a.dept === teacher.dept) return -1;
              if (b.dept === teacher.dept) return 1;
              return 0;
            });

            substitutionNeeds.push({
              period: p,
              classId: block.classId,
              subject: block.subject,
              suggestedSubstitute: ranked[0]
            });
          }
        });
        
        if (substitutionNeeds.length > 0) {
          plan.push({
            absentTeacher: teacher,
            substitutions: substitutionNeeds
          });
        }
      });
      
      setGeneratedPlan(plan);
      setIsGenerating(false);
    }, 1500); // Simulate "thinking" delay
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="font-[Outfit] text-3xl font-bold bg-gradient-to-r from-primary to-tertiary bg-clip-text text-transparent">
              Nova AI Intelligence
            </h2>
            <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest border border-primary/20">
              Active
            </span>
          </div>
          <p className="text-on-surface-variant text-sm">Automated scheduling, substitute management, and predictive analytics.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-outline-variant mb-6">
        <button
          onClick={() => setActiveTab('substitutes')}
          className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'substitutes' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Daily Substitute Management
        </button>
        <button
          onClick={() => setActiveTab('restructure')}
          className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'restructure' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Year-End Restructuring
        </button>
      </div>

      {activeTab === 'substitutes' && (
        <div className="space-y-6">
          {/* Status Panel */}
          <div className="bg-surface rounded-2xl border border-outline-variant card-shadow p-6 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 rounded-full bg-error-container/20 flex items-center justify-center text-error">
                <span className="material-symbols-outlined text-[32px]">group_off</span>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">{absentTeachers.length} Teachers Absent Today</h3>
                <p className="text-sm text-on-surface-variant">Timetable disruptions detected across multiple periods.</p>
              </div>
            </div>
            <button 
              onClick={handleGenerateSubstitutes}
              disabled={isGenerating || absentTeachers.length === 0}
              className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-md transition-all ${
                isGenerating ? 'bg-surface-container-high text-on-surface-variant cursor-not-allowed' : 'bg-primary text-on-primary hover:opacity-90 active:scale-95'
              }`}
            >
              {isGenerating ? (
                <>
                  <span className="material-symbols-outlined animate-spin">sync</span>
                  Analyzing Schedules...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">auto_awesome</span>
                  Auto-Assign Substitutes
                </>
              )}
            </button>
          </div>

          {/* Generated Plan */}
          {generatedPlan && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="font-[Outfit] text-xl font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">check_circle</span>
                Nova AI Coverage Plan
              </h3>
              
              <div className="grid gap-6">
                {generatedPlan.map((plan: any, i: number) => (
                  <div key={i} className="bg-surface rounded-2xl border border-outline-variant card-shadow overflow-hidden">
                    <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center text-error font-bold">
                          {plan.absentTeacher.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm">{plan.absentTeacher.name}</h4>
                          <p className="text-xs text-on-surface-variant font-semibold">{plan.absentTeacher.dept}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold bg-error-container text-on-error-container px-3 py-1 rounded-full uppercase tracking-wider">Absent</span>
                    </div>
                    
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-outline-variant/50">
                          <th className="px-6 py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Period</th>
                          <th className="px-6 py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Class</th>
                          <th className="px-6 py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Subject</th>
                          <th className="px-6 py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">AI Assigned Substitute</th>
                          <th className="px-6 py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {plan.substitutions.map((sub: any, j: number) => (
                          <tr key={j} className="border-b border-outline-variant/50 last:border-0 hover:bg-surface-container-lowest transition-colors">
                            <td className="px-6 py-4">
                              <span className="text-sm font-bold">Period {sub.period.id}</span>
                              <div className="text-xs text-on-surface-variant mt-0.5">{sub.period.time}</div>
                            </td>
                            <td className="px-6 py-4 text-sm font-bold">Class {sub.classId}</td>
                            <td className="px-6 py-4 text-sm text-on-surface-variant font-semibold">{sub.subject}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-primary-container/30 flex items-center justify-center text-primary text-xs font-bold">
                                  {sub.suggestedSubstitute.name.charAt(0)}
                                </div>
                                <div>
                                  <div className="text-sm font-bold">{sub.suggestedSubstitute.name}</div>
                                  <div className="text-[10px] text-primary font-semibold uppercase tracking-wider flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[12px]">verified</span> Free Period Match
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button className="text-primary hover:bg-primary/10 p-2 rounded-lg transition-colors" title="Confirm Assignment">
                                <span className="material-symbols-outlined">check</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
                {generatedPlan.length === 0 && (
                  <div className="text-center py-12 text-on-surface-variant font-bold">
                    No classes required coverage for the absent teachers today.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'restructure' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {isSimulatingRestructure && (
              <div className="bg-surface rounded-2xl border border-primary/40 card-shadow p-6 text-center animate-in fade-in">
                <div className="flex justify-between text-sm font-bold text-on-surface-variant mb-2">
                  <span className="flex items-center gap-2"><span className="material-symbols-outlined animate-spin text-[16px]">sync</span> {simulationProgress <= 12 ? `Nova AI Processing Class ${simulationProgress}...` : 'Finalizing Reallocations...'}</span>
                  <span className="text-primary">{Math.min(100, Math.round((simulationProgress / 12) * 100))}%</span>
                </div>
                <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300 rounded-full"
                    style={{ width: `${Math.min(100, (simulationProgress / 12) * 100)}%` }}
                  />
                </div>
              </div>
            )}
            <div className={`bg-surface rounded-2xl border border-outline-variant card-shadow overflow-hidden transition-all ${isSimulatingRestructure ? 'opacity-50 pointer-events-none blur-sm' : ''}`}>
              <div className="p-6 border-b border-outline-variant flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-container-lowest">
                <div>
                  <h3 className="font-[Outfit] text-xl font-bold flex items-center gap-2 mb-1">
                    <span className="material-symbols-outlined text-primary text-[24px]">analytics</span>
                    Year-End Session Results & Restructuring Report
                  </h3>
                  <p className="text-sm text-on-surface-variant font-semibold">Class 1-12 Section-wise Analytics and Teacher Reallocation Data</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => exportToPDF('restructure-report-content', `Nova_AI_Restructuring_Report_${reportYear.replace(/[^0-9]/g, '')}`)}
                    className="px-4 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface text-sm font-bold rounded-lg border border-outline-variant transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">download</span> Export PDF
                  </button>
                  {reportYear.includes('2025') ? (
                    <button 
                      onClick={handleSimulateRestructure}
                      disabled={isSimulatingRestructure}
                      className="px-5 py-2 bg-primary text-on-primary text-sm font-bold rounded-lg hover:opacity-90 transition-all flex items-center gap-2 shadow-md active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[18px]">science</span> Simulate 2026 Restructuring
                    </button>
                  ) : (
                    <button onClick={() => { setRestructureReport(generateMockReport(false)); setReportYear('2025 (Current)'); }} className="px-4 py-2 bg-surface-container-high text-on-surface text-sm font-bold rounded-lg hover:bg-outline-variant transition-opacity flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">restore</span> Reset to 2025
                    </button>
                  )}
                </div>
              </div>
              <div id="restructure-report-content" className="overflow-x-auto bg-surface">
                <div className="p-6 hidden print-header">
                  <h2 className="text-2xl font-bold text-primary mb-2">Elevation ERP</h2>
                  <p className="text-lg font-bold">Year-End Session Results & Restructuring Report {reportYear}</p>
                </div>
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-outline-variant/50 bg-surface-container-low/30">
                      <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Class & Sections</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Pass %</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Avg Grade</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Promoted</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Teacher Shifts</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Workload Δ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {restructureReport.map((row: any, i: number) => (
                      <tr 
                        key={i} 
                        onClick={() => setSelectedClass(row)}
                        className="border-b border-outline-variant/50 last:border-0 hover:bg-surface-container-lowest transition-colors cursor-pointer group"
                      >
                        <td className="px-6 py-4">
                          <div className="font-bold text-sm">Class {row.class}</div>
                          <div className="text-xs text-on-surface-variant mt-1 font-semibold flex gap-1">
                            {row.sections.map((s: string) => (
                              <span key={s} className="px-1.5 py-0.5 bg-surface-container rounded text-[10px]">{s}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-surface-container-high rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${row.passPercentage}%` }} />
                            </div>
                            <span className="text-sm font-bold text-emerald-700">{row.passPercentage}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                            row.avgGrade.startsWith('A') ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {row.avgGrade}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold">{row.promotedStudents}</div>
                          <div className="text-[10px] text-on-surface-variant">Students</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-sm font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg w-fit border border-amber-200">
                            <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
                            {row.teachersReallocated} Reassigned
                          </div>
                        </td>
                        <td className="px-6 py-4 relative">
                          <span className={`text-sm font-bold ${row.workloadChange.startsWith('-') ? 'text-emerald-600' : 'text-red-600'}`}>
                            {row.workloadChange.startsWith('-') ? '↓ ' : '↑ '}
                            {row.workloadChange.replace('-', '')}
                          </span>
                          <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity">
                            chevron_right
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          
          {/* Detailed Class View Overlay */}
          {selectedClass && (
            <div className="fixed inset-0 bg-surface/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
              <div className="bg-surface rounded-2xl shadow-2xl border border-outline-variant w-full max-w-3xl overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
                <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
                  <div>
                    <h3 className="font-[Outfit] text-2xl font-bold flex items-center gap-3">
                      <span className="w-10 h-10 rounded-full bg-primary-container text-primary flex items-center justify-center text-lg">
                        {selectedClass.class}
                      </span>
                      Class {selectedClass.class} Restructured Timetable
                    </h3>
                    <p className="text-on-surface-variant text-sm mt-1">Detailed view of Nova AI's automated teacher reallocations</p>
                  </div>
                  <button onClick={() => setSelectedClass(null)} className="w-10 h-10 rounded-full hover:bg-surface-container-high flex items-center justify-center transition-colors text-on-surface-variant">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
                
                <div className="p-6 bg-surface-container-lowest">
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-surface p-4 rounded-xl border border-outline-variant/50">
                      <p className="text-[10px] uppercase font-bold text-on-surface-variant mb-1">Pass Rate</p>
                      <p className="text-xl font-bold text-emerald-600">{selectedClass.passPercentage}%</p>
                    </div>
                    <div className="bg-surface p-4 rounded-xl border border-outline-variant/50">
                      <p className="text-[10px] uppercase font-bold text-on-surface-variant mb-1">Avg Grade</p>
                      <p className="text-xl font-bold text-primary">{selectedClass.avgGrade}</p>
                    </div>
                    <div className="bg-surface p-4 rounded-xl border border-outline-variant/50">
                      <p className="text-[10px] uppercase font-bold text-on-surface-variant mb-1">Promoted</p>
                      <p className="text-xl font-bold text-on-surface">{selectedClass.promotedStudents}</p>
                    </div>
                    <div className="bg-surface p-4 rounded-xl border border-outline-variant/50">
                      <p className="text-[10px] uppercase font-bold text-on-surface-variant mb-1">Staff Shifts</p>
                      <p className="text-xl font-bold text-amber-600">{selectedClass.teachersReallocated}</p>
                    </div>
                  </div>

                  <h4 className="font-bold text-sm mb-3 text-on-surface-variant uppercase tracking-widest">Reallocated Subjects</h4>
                  <div className="space-y-3">
                    {selectedClass.scheduleChanges.map((change: any, i: number) => (
                      <div key={i} className="flex items-center gap-4 bg-surface p-4 rounded-xl border border-outline-variant/50 hover:border-primary/30 transition-colors group">
                        <div className="w-32">
                          <p className="font-bold text-sm text-on-surface">{change.subject}</p>
                          <p className="text-[10px] font-bold text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded w-fit mt-1">
                            {change.reason}
                          </p>
                        </div>
                        
                        <div className="flex-1 flex items-center justify-between bg-surface-container-lowest rounded-lg p-3 border border-outline-variant/30">
                          <div className="flex items-center gap-3 w-2/5">
                            <div className="w-8 h-8 rounded-full bg-error-container/30 text-error flex items-center justify-center font-bold text-xs">
                              {change.oldTeacher.charAt(0)}
                            </div>
                            <div>
                              <p className="text-xs text-on-surface-variant font-semibold uppercase">Previous</p>
                              <p className="text-sm font-bold line-through opacity-70">{change.oldTeacher}</p>
                            </div>
                          </div>
                          
                          <div className="text-on-surface-variant">
                            <span className="material-symbols-outlined text-[20px] group-hover:text-primary transition-colors">arrow_right_alt</span>
                          </div>
                          
                          <div className="flex items-center gap-3 w-2/5 justify-end text-right">
                            <div>
                              <p className="text-xs text-primary font-semibold uppercase">New Assigned</p>
                              <p className="text-sm font-bold text-primary">{change.newTeacher}</p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-primary-container text-primary flex items-center justify-center font-bold text-xs">
                              {change.newTeacher.charAt(0)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      <style>{`
        #restructure-report-content .print-header { display: none; }
      `}</style>
    </div>
  );
}
