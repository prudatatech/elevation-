import { useParams, useNavigate, Link } from 'react-router-dom';
import { getStaffById } from '../data/staff';

export default function StaffReport() {
  const { id } = useParams();
  const navigate = useNavigate();
  const staff = getStaffById(id || '');

  if (!staff) {
    return (
      <div className="p-8 flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">Staff Record Not Found</h2>
        <button onClick={() => navigate(-1)} className="bg-primary text-on-primary px-4 py-2 rounded-lg font-bold">Go Back</button>
      </div>
    );
  }

  const { salary, attendanceData, leaves, documents } = staff;
  const backLink = staff.type === 'Teaching' ? '/teachers' : '/staff';

  return (
    <div className="p-6 lg:p-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 mb-6 text-sm font-semibold text-on-surface-variant">
        <Link to={backLink} className="hover:text-primary transition-colors">{staff.type === 'Teaching' ? 'Teachers' : 'Non-Teaching Staff'}</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="text-primary">{staff.name}</span>
      </div>

      {/* Header Profile */}
      <div className="bg-surface p-6 rounded-2xl border border-outline-variant card-shadow mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-primary-container/30 flex items-center justify-center font-[Outfit] text-4xl font-bold text-primary shrink-0 border-4 border-surface shadow-sm">
            {staff.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
          </div>
          <div>
            <h2 className="font-[Outfit] text-3xl font-bold">{staff.name}</h2>
            <p className="text-on-surface-variant text-sm mt-1 mb-3">
              {staff.id} | {staff.designation} ({staff.dept})
            </p>
            <div className="flex gap-2">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${staff.status === 'Active' ? 'bg-primary/10 text-primary' : 'bg-amber-100 text-amber-700'}`}>
                {staff.status}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant">
                Joined {staff.joining}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="bg-surface border border-outline-variant text-on-surface px-5 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-surface-container-low transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">edit</span>
            Edit Profile
          </button>
          <button className="bg-primary text-on-primary px-5 py-2 rounded-xl text-sm font-bold shadow-md hover:opacity-90 flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">print</span>
            Print Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Attendance Graph */}
        <div className="lg:col-span-2 bg-surface p-6 rounded-2xl border border-outline-variant card-shadow flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-[Outfit] text-lg font-bold">Attendance Analytics</h3>
            <span className="text-xs font-bold text-on-surface-variant bg-surface-container-low px-3 py-1 rounded-lg">Last 6 Months</span>
          </div>
          
          <div className="flex gap-4 mb-6">
            <div className="bg-green-50 text-green-700 p-3 rounded-xl flex-1 text-center">
              <p className="text-xs font-bold uppercase mb-1">Present</p>
              <p className="text-2xl font-[Outfit] font-bold">{attendanceData.present}</p>
            </div>
            <div className="bg-error/10 text-error p-3 rounded-xl flex-1 text-center">
              <p className="text-xs font-bold uppercase mb-1">Absent</p>
              <p className="text-2xl font-[Outfit] font-bold">{attendanceData.absent}</p>
            </div>
            <div className="bg-amber-50 text-amber-600 p-3 rounded-xl flex-1 text-center">
              <p className="text-xs font-bold uppercase mb-1">Late</p>
              <p className="text-2xl font-[Outfit] font-bold">{attendanceData.late}</p>
            </div>
          </div>

          <div className="relative h-[200px] w-full flex items-end justify-between px-2 pb-8 pt-4 mt-auto">
            <div className="absolute inset-0 flex flex-col justify-between pb-8 pointer-events-none opacity-20">
              {[100, 75, 50, 25, 0].map(val => (
                <div key={val} className="border-t border-outline-variant w-full relative">
                  <span className="absolute -left-6 -top-2 text-[10px] font-bold text-on-surface-variant">{val}</span>
                </div>
              ))}
            </div>
            {attendanceData.history.map((h, i) => (
              <div key={i} className="relative flex flex-col items-center justify-end group w-1/6 h-full z-10">
                <div 
                  className="w-10 bg-primary/80 rounded-t-lg transition-all group-hover:bg-primary relative"
                  style={{ height: `${h.percentage}%` }}
                >
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-surface shadow-sm px-2 py-1 rounded">
                    {h.percentage}%
                  </span>
                </div>
                <span className="absolute -bottom-6 text-[10px] font-bold text-on-surface-variant text-center uppercase">
                  {h.month}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Leave Requests */}
        <div className="bg-surface p-6 rounded-2xl border border-outline-variant card-shadow flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-[Outfit] text-lg font-bold">Leave History</h3>
            <button className="text-primary text-[10px] font-bold uppercase tracking-wider hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {leaves.length > 0 ? leaves.map(l => (
              <div key={l.id} className="p-4 border border-outline-variant rounded-xl flex justify-between items-center bg-surface-container-low/50">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm">{l.type} Leave</span>
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      l.status === 'Approved' ? 'bg-green-100 text-green-700' :
                      l.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-error/10 text-error'
                    }`}>
                      {l.status}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant font-semibold">{l.dateRange} • {l.days} {l.days === 1 ? 'Day' : 'Days'}</p>
                </div>
              </div>
            )) : (
              <p className="text-sm text-on-surface-variant text-center py-8">No leave history found.</p>
            )}
          </div>
          <button className="mt-auto w-full py-3 border border-dashed border-primary text-primary rounded-xl text-sm font-bold hover:bg-primary/5 transition-colors flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Log Leave Request
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Salary Slip Generation */}
        <div className="bg-surface p-6 rounded-2xl border border-outline-variant card-shadow flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-[Outfit] text-lg font-bold">Payroll & Salary</h3>
            <button className="text-primary bg-primary/10 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-primary/20 transition-colors">
              Generate Payslip
            </button>
          </div>
          <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/50">
            <div className="flex justify-between items-end mb-6 pb-6 border-b border-outline-variant">
              <div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Net Pay (Last Month)</p>
                <h4 className="font-[Outfit] text-3xl font-bold text-green-700">₹{salary.netPay.toLocaleString()}</h4>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-on-surface-variant mb-1">Paid On</p>
                <p className="text-sm font-bold">{salary.lastPaidDate}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <h5 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">Earnings</h5>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm"><span className="font-semibold">Basic Pay</span><span>₹{salary.basic.toLocaleString()}</span></div>
                  <div className="flex justify-between text-sm"><span className="font-semibold">HRA</span><span>₹{salary.hra.toLocaleString()}</span></div>
                  <div className="flex justify-between text-sm"><span className="font-semibold">DA</span><span>₹{salary.da.toLocaleString()}</span></div>
                </div>
              </div>
              <div>
                <h5 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">Deductions</h5>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm"><span className="font-semibold">Provident Fund</span><span className="text-error">-₹{salary.pf.toLocaleString()}</span></div>
                  <div className="flex justify-between text-sm"><span className="font-semibold">Tax (TDS)</span><span className="text-error">-₹{salary.tax.toLocaleString()}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Uploaded Documents */}
        <div className="bg-surface p-6 rounded-2xl border border-outline-variant card-shadow flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-[Outfit] text-lg font-bold">Uploaded Documents</h3>
            <button className="text-primary text-[10px] font-bold uppercase tracking-wider hover:underline flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">upload</span> Upload
            </button>
          </div>
          <div className="space-y-3">
            {documents.map(doc => (
              <div key={doc.id} className="flex items-center justify-between p-3 border border-outline-variant rounded-xl hover:border-primary/30 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors">
                    <span className="material-symbols-outlined">description</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold">{doc.name}</p>
                    <p className="text-[11px] text-on-surface-variant font-semibold">{doc.size} • Uploaded {doc.date}</p>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 hover:bg-surface-container-low rounded-lg text-on-surface-variant"><span className="material-symbols-outlined text-[18px]">visibility</span></button>
                  <button className="p-1.5 hover:bg-surface-container-low rounded-lg text-on-surface-variant"><span className="material-symbols-outlined text-[18px]">download</span></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
