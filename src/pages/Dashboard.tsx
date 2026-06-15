import { Link } from 'react-router-dom';
import { getTotalStudents, classData } from '../data/students';
import { getAllTeachers } from '../data/staff';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const allStudents = classData.flatMap(c => c.sections.flatMap(s => s.students));
  const allTeachers = getAllTeachers();
  
  // Find students for AI Risk Alerts
  const lowAttendanceStudents = allStudents.filter(s => s.attendance < 75);
  const overdueStudents = allStudents.filter(s => s.feeStatus === 'Overdue');
  const [alert1, setAlert1] = useState<any>(lowAttendanceStudents[0]);
  const [alert2, setAlert2] = useState<any>(overdueStudents[0]);

  // Time & Greeting Logic
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const currentHour = time.getHours();
  let greeting = 'Good evening';
  if (currentHour >= 5 && currentHour < 12) greeting = 'Good morning';
  else if (currentHour >= 12 && currentHour < 17) greeting = 'Good afternoon';

  const timeString = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateString = time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

  // Calendar Logic
  const currentMonth = time.toLocaleString('default', { month: 'long', year: 'numeric' });
  const daysInMonth = new Date(time.getFullYear(), time.getMonth() + 1, 0).getDate();
  const firstDay = new Date(time.getFullYear(), time.getMonth(), 1).getDay();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1; // Make Monday 0

  const calendarDays = [];
  for (let i = 0; i < startOffset; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  // Homework submission mock calculation (based on active students)
  const submissionRate = 76; // Random realistic number
  const circleOffset = 502.65 - (502.65 * submissionRate) / 100;

  const handleAction = (actionName: string) => {
    alert(`Action Executed: ${actionName}`);
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      {/* Dashboard Canvas */}
      <div className="flex-1 p-6 lg:p-8">
        {/* Greeting Banner */}
        <section className="mb-6 lg:mb-8 relative rounded-2xl overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 p-6 lg:p-8 flex justify-between items-center">
          <div>
            <h2 className="font-[Outfit] text-3xl font-bold text-primary mb-2">{greeting}, Admin</h2>
            <p className="text-on-surface-variant text-base">
              You have <span className="font-bold text-primary">14 pending tasks</span> for today. Keep up the great work!
            </p>
            <div className="mt-4 flex gap-3">
              <button onClick={() => handleAction('View Task List')} className="bg-primary text-on-primary px-6 py-2 rounded-xl text-sm font-bold shadow-md hover:opacity-90 transition-opacity">
                View Task List
              </button>
              <Link to="/reports" className="bg-surface text-primary border border-primary px-6 py-2 rounded-xl text-sm font-bold hover:bg-primary-container/10 transition-colors inline-block text-center">
                Generate Daily Report
              </Link>
            </div>
          </div>
          <div className="hidden lg:block">
            <span className="material-symbols-outlined text-[80px] text-primary/20" style={{ fontVariationSettings: "'wght' 200" }}>
              rocket_launch
            </span>
          </div>
        </section>

        {/* Metric Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <MetricCard icon="groups" title="Total Students" value={getTotalStudents().toLocaleString()} badge="Active" badgeColor="primary" to="/students" />
          <MetricCard icon="supervisor_account" title="Total Teachers" value={allTeachers.length.toString()} badge="Active" badgeColor="neutral" to="/teachers" />
          <MetricCard icon="pending_actions" title="Assignments to Grade" value="12" badge="Urgent" badgeColor="error" to="/homework" />
          <MetricCard icon="person_pin" title="Pending Leave Requests" value="4" badge="New" badgeColor="primary" to="/attendance" />
        </section>

        {/* Quick Links */}
        <section className="mb-6 lg:mb-8 overflow-x-auto pb-2">
          <div className="flex gap-4 lg:gap-6 min-w-max">
            <QuickLink icon="school" label="Class Directory" to="/students" />
            <QuickLink icon="calendar_month" label="Timetable" to="/timetable" />
            <QuickLink icon="event_available" label="Attendance" to="/attendance" />
            <QuickLink icon="payments" label="Fee Collection" to="/finance" />
            <QuickLink icon="group" label="Staff" to="/staff" />
            <QuickLink icon="auto_awesome" label="AI Alerts" to="/ai-intelligence" highlight />
          </div>
        </section>

        {/* Visualization Row */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
          {/* Upcoming Activities */}
          <div className="bg-surface p-6 rounded-2xl border border-outline-variant card-shadow flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-[Outfit] text-xl font-bold">Upcoming Activities</h4>
              <span className="material-symbols-outlined text-outline cursor-pointer hover:text-primary">more_vert</span>
            </div>
            <div className="space-y-4">
              <ActivityItem day="12" month="May" title="Parent-Teacher Meeting" desc="09:00 AM - Auditorium A" highlight />
              <ActivityItem day="15" month="May" title="Annual Sports Day" desc="08:00 AM - Main Field" />
              <ActivityItem day="19" month="May" title="Science Exhibition" desc="11:30 AM - Hall 2" />
            </div>
            <Link to="/events" className="mt-auto block text-center w-full py-2 text-primary font-bold text-sm border-t border-outline-variant pt-4 hover:underline">
              View All Events
            </Link>
          </div>

          {/* Homework Donut */}
          <div className="bg-surface p-6 rounded-2xl border border-outline-variant card-shadow flex flex-col items-center">
            <h4 className="font-[Outfit] text-xl font-bold w-full text-left mb-6">Homework Submissions</h4>
            <div className="relative w-48 h-48 mb-6 mt-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle className="text-surface-container-high" cx="96" cy="96" fill="transparent" r="80" stroke="currentColor" strokeWidth="16" />
                <circle className="text-primary transition-all duration-1000 ease-out" cx="96" cy="96" fill="transparent" r="80" stroke="currentColor" strokeDasharray="502.65" strokeDashoffset={circleOffset} strokeWidth="16" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-[Outfit] text-3xl font-bold">{submissionRate}%</span>
                <span className="text-on-surface-variant text-xs font-semibold">Overall</span>
              </div>
            </div>
            <div className="flex gap-6 mt-auto">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-xs font-semibold">Submitted</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-surface-container-high"></div>
                <span className="text-xs font-semibold">Pending</span>
              </div>
            </div>
          </div>

          {/* Performance Bar */}
          <div className="bg-surface p-6 rounded-2xl border border-outline-variant card-shadow flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <h4 className="font-[Outfit] text-xl font-bold">Performance</h4>
              <select className="bg-surface-container-low border-none rounded-lg text-xs font-semibold p-2 outline-none ring-0">
                <option>This Week</option>
                <option>Last Week</option>
              </select>
            </div>
            <div className="h-40 flex items-end justify-between gap-2 mb-4 px-2">
              <BarItem label="MON" height="60%" />
              <BarItem label="TUE" height="45%" />
              <BarItem label="WED" height="85%" />
              <BarItem label="THU" height="70%" />
              <BarItem label="FRI" height="92%" />
            </div>
            <p className="text-xs text-on-surface-variant mt-auto pt-4 text-center border-t border-outline-variant">
              Avg Score: <span className="text-primary font-bold">88.4%</span>
            </p>
          </div>
        </section>

        {/* AI Risk Alerts */}
        <section className="bg-surface p-6 rounded-2xl border border-outline-variant card-shadow">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              <h4 className="font-[Outfit] text-xl font-bold">AI Student Risk Alerts</h4>
            </div>
            <Link to="/ai-intelligence" className="text-primary font-bold text-sm hover:underline">Analyze All Records</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            {alert1 && (
              <div className="p-4 bg-error/5 border border-error/10 rounded-xl flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-error">warning</span>
                </div>
                <div>
                  <p className="text-sm font-bold">Attendance Drop Alert</p>
                  <p className="text-xs text-on-surface-variant mb-3 leading-relaxed">
                    <span className="font-bold text-on-surface">{alert1.name}</span> ({alert1.id}) has a very low attendance rate of <span className="text-error font-bold">{alert1.attendance}%</span>. Immediate intervention recommended.
                  </p>
                  <div className="flex gap-4">
                    <button onClick={() => handleAction(`Notified Parent of ${alert1.name}`)} className="text-error font-bold text-xs hover:underline">Notify Parent ({alert1.parentName})</button>
                    <button onClick={() => setAlert1(undefined)} className="text-on-surface-variant font-bold text-xs hover:underline">Dismiss</button>
                  </div>
                </div>
              </div>
            )}
            
            {alert2 && (
              <div className="p-4 bg-secondary-container/10 border border-secondary/10 rounded-xl flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary">psychology</span>
                </div>
                <div>
                  <p className="text-sm font-bold">Fee Default Risk</p>
                  <p className="text-xs text-on-surface-variant mb-3 leading-relaxed">
                    <span className="font-bold text-on-surface">{alert2.name}</span> ({alert2.id}) is marked as <span className="font-bold text-amber-600">Overdue</span> for current term fees. Historical data shows pattern of delay.
                  </p>
                  <div className="flex gap-4">
                    <Link to="/finance" className="text-primary font-bold text-xs hover:underline">View Finance Log</Link>
                    <button onClick={() => handleAction(`Sent Reminder to ${alert2.name}`)} className="text-on-surface-variant font-bold text-xs hover:underline">Send Reminder</button>
                    <button onClick={() => setAlert2(undefined)} className="text-on-surface-variant font-bold text-xs hover:underline">Dismiss</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Right Sidebar Panel */}
      <aside className="w-80 border-l border-outline-variant bg-surface p-6 lg:p-8 hidden xl:block shrink-0 h-full overflow-y-auto">
        {/* Live Clock Widget */}
        <div className="bg-primary text-on-primary rounded-2xl p-6 mb-6 lg:mb-8 border border-primary-container shadow-md flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <span className="material-symbols-outlined text-6xl">schedule</span>
          </div>
          <h3 className="font-[Outfit] text-4xl font-bold tracking-wider mb-1 relative z-10">{timeString}</h3>
          <p className="text-sm font-semibold text-primary-container relative z-10">{dateString}</p>
        </div>

        {/* Calendar */}
        <div className="bg-surface-container-low rounded-2xl p-4 mb-6 lg:mb-8 border border-outline-variant shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h5 className="text-sm font-bold uppercase tracking-wide">{currentMonth}</h5>
            <div className="flex gap-1">
              <button className="p-1 hover:bg-surface-container-high rounded-lg transition-colors"><span className="material-symbols-outlined text-[18px]">chevron_left</span></button>
              <button className="p-1 hover:bg-surface-container-high rounded-lg transition-colors"><span className="material-symbols-outlined text-[18px]">chevron_right</span></button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-on-surface-variant mb-2">
            <span>MO</span><span>TU</span><span>WE</span><span>TH</span><span>FR</span><span>SA</span><span>SU</span>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-[11px]">
            {calendarDays.map((day, i) => (
              <span 
                key={i} 
                className={`p-1.5 rounded-lg flex items-center justify-center aspect-square ${
                  !day ? 'opacity-0' : 
                  day === time.getDate() ? 'bg-primary text-on-primary font-bold shadow-md' : 
                  'hover:bg-surface-container-high cursor-pointer font-medium'
                }`}
              >
                {day}
              </span>
            ))}
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="mb-6 lg:mb-8">
          <div className="flex justify-between items-center mb-4">
            <h5 className="text-sm font-bold uppercase tracking-wide">Today's Schedule</h5>
            <Link to="/timetable" className="text-primary text-[12px] font-bold hover:underline">Add New</Link>
          </div>
          <div className="space-y-4">
            <div className="relative pl-4 border-l-[3px] border-primary">
              <p className="text-sm font-bold">Staff Briefing</p>
              <p className="text-[11px] font-semibold text-on-surface-variant mt-0.5">10:30 - 11:15 AM</p>
            </div>
            <div className="relative pl-4 border-l-[3px] border-secondary">
              <p className="text-sm font-bold">Budget Review</p>
              <p className="text-[11px] font-semibold text-on-surface-variant mt-0.5">01:00 - 02:30 PM</p>
            </div>
            <div className="relative pl-4 border-l-[3px] border-error">
              <p className="text-sm font-bold">Board Meeting</p>
              <p className="text-[11px] font-semibold text-on-surface-variant mt-0.5">04:00 - 05:30 PM</p>
            </div>
          </div>
        </div>

        {/* Smart Reminders */}
        <div>
          <h5 className="text-sm font-bold uppercase tracking-wide mb-4">Smart Reminders</h5>
          <div className="space-y-3">
            <div className="bg-surface-container rounded-xl p-3 flex items-start gap-3 border border-outline-variant/50">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[16px]">inventory_2</span>
              </div>
              <p className="text-[11px] font-semibold text-on-surface-variant leading-relaxed">Update library inventory list by end of week.</p>
            </div>
            <div className="bg-surface-container rounded-xl p-3 flex items-start gap-3 border border-outline-variant/50">
              <div className="w-8 h-8 rounded-full bg-error/20 flex items-center justify-center text-error shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[16px]">verified</span>
              </div>
              <p className="text-[11px] font-semibold text-on-surface-variant leading-relaxed">Approve 3 salary disbursements for Admin staff.</p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

/* Sub-components */
function MetricCard({ icon, title, value, badge, badgeColor, to }: { icon: string; title: string; value: string; badge: string; badgeColor: string; to: string }) {
  const badgeStyles: Record<string, string> = {
    primary: 'text-primary bg-primary/20',
    error: 'text-error bg-error-container/20',
    neutral: 'text-on-surface-variant bg-surface-container-high',
  };
  const iconBgStyles: Record<string, string> = {
    primary: 'bg-primary/10 text-primary',
    error: 'bg-error/10 text-error',
    neutral: 'bg-tertiary/10 text-tertiary',
  };

  return (
    <Link to={to} className="bg-surface p-5 lg:p-6 rounded-2xl border border-outline-variant card-shadow flex flex-col justify-between hover:border-primary/50 transition-colors cursor-pointer group">
      <div className="flex justify-between items-start">
        <div className={`p-2.5 rounded-xl ${iconBgStyles[badgeColor]} group-hover:scale-110 transition-transform`}>
          <span className="material-symbols-outlined text-[24px]">{icon}</span>
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${badgeStyles[badgeColor]}`}>{badge}</span>
      </div>
      <div className="mt-5">
        <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
        <h3 className="font-[Outfit] text-3xl font-bold text-on-surface group-hover:text-primary transition-colors">{value}</h3>
      </div>
    </Link>
  );
}

function QuickLink({ icon, label, to, highlight }: { icon: string; label: string; to: string; highlight?: boolean }) {
  return (
    <Link
      to={to}
      className={`flex flex-col items-center gap-2 bg-surface p-4 rounded-2xl border card-shadow hover:bg-primary-container/10 group w-[130px] transition-all ${
        highlight ? 'border-dashed border-primary shadow-sm hover:shadow-md' : 'border-outline-variant hover:border-primary/50'
      }`}
    >
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors ${
          highlight ? 'bg-primary-container/30' : 'bg-surface-container'
        }`}
      >
        <span className="material-symbols-outlined text-[24px]">{icon}</span>
      </div>
      <span className="text-xs font-bold text-center leading-tight">{label}</span>
    </Link>
  );
}

function ActivityItem({ day, month, title, desc, highlight }: { day: string; month: string; title: string; desc: string; highlight?: boolean }) {
  return (
    <div className="flex gap-4 items-center group cursor-pointer p-2 -mx-2 rounded-xl hover:bg-surface-container-low transition-colors">
      <div
        className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl shrink-0 group-hover:bg-primary group-hover:text-on-primary transition-colors ${
          highlight ? 'bg-primary/10 text-primary' : 'bg-surface-container-high text-on-surface-variant'
        }`}
      >
        <span className="font-bold text-base leading-none">{day}</span>
        <span className="text-[9px] uppercase font-bold mt-0.5">{month}</span>
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{title}</p>
        <p className="text-xs font-semibold text-on-surface-variant">{desc}</p>
      </div>
    </div>
  );
}

function BarItem({ label, height }: { label: string; height: string }) {
  return (
    <div className="w-full bg-primary-container/20 rounded-t-lg relative group" style={{ height: '100%' }}>
      <div
        className="bg-primary-container rounded-t-lg transition-all group-hover:bg-primary absolute bottom-0 w-full"
        style={{ height }}
      />
      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-on-surface-variant">
        {label}
      </span>
    </div>
  );
}
