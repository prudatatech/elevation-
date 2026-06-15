import { useState, useEffect, useMemo } from 'react';
import { downloadInvoicePDF } from '../utils/exportUtils';
import { getAllStudentsFlat } from '../data/students';
import { getAllTeachers, getAllNonTeachingStaff } from '../data/staff';

const tabs = ['Staff Salaries', 'Fee Collections', 'Live Transactions', 'Defaulters', 'SMS Logs'];

// Initial dummy transaction to show the structure
const initialTxns = [
  { id: 'TXN-9001', student: 'Aarav Sharma', cls: '10-A', type: 'Tuition Fee', amount: '12500', date: '2026-05-10', mode: 'Online', status: 'Paid', receiptType: 'Fee' }
];

export default function FinancePage() {
  const [tab, setTab] = useState(0);
  const [messageLogs, setMessageLogs] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>(initialTxns);
  const [isAutomating, setIsAutomating] = useState(false);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  
  const [selectedClassDefaulters, setSelectedClassDefaulters] = useState<string>('All');
  const [selectedClassFee, setSelectedClassFee] = useState<string>('10');
  const [selectedSectionFee, setSelectedSectionFee] = useState<string>('A');

  // Load Data
  const students = useMemo(() => getAllStudentsFlat(), []);
  const staff = useMemo(() => [...getAllTeachers(), ...getAllNonTeachingStaff()], []);
  
  // Fee Collections Filter
  const feeCollections = useMemo(() => {
    return students.filter(s => s.classNum.toString() === selectedClassFee && s.sectionName === selectedSectionFee);
  }, [students, selectedClassFee, selectedSectionFee]);

  // Stable calculation for Defaulters based on class selection
  const defaulters = useMemo(() => {
    return students
      .filter(s => selectedClassDefaulters === 'All' || s.classNum.toString() === selectedClassDefaulters)
      .filter(s => s.student.feeStatus === 'Overdue' || s.student.name.length % 7 === 0) // Stable mock logic
      .slice(0, 50) // Limit display size
      .map(s => ({
        name: s.student.name,
        cls: `${s.classNum}-${s.sectionName}`,
        amount: '25000',
        daysOverdue: (s.student.name.length * 7) % 60 + 15,
        parent: s.student.parentName,
        contact: s.student.contact
      }));
  }, [students, selectedClassDefaulters]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setIsRazorpayLoaded(true);
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  const handlePayment = (entity: any, type: 'Salary') => {
    if (!isRazorpayLoaded) {
      alert('Razorpay SDK is loading. Please try again in a moment.');
      return;
    }

    const amount = 45000; // Mock salary amount
    
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_Scr9MXs32wAmsF',
      amount: amount * 100, // Amount in paise
      currency: 'INR',
      name: 'Elevation by Prudata Tech',
      description: 'Salary Disbursement',
      handler: function (response: any) {
        // Success
        const newTxn = {
          id: response.razorpay_payment_id || `TXN-${Math.floor(Math.random()*10000)}`,
          student: null,
          staffName: entity.name,
          cls: null,
          designation: entity.designation,
          type: 'Monthly Salary',
          amount: amount.toString(),
          date: new Date().toISOString().split('T')[0],
          mode: 'Razorpay',
          status: 'Paid',
          receiptType: type
        };
        
        setTransactions([newTxn, ...transactions]);
        downloadInvoicePDF(newTxn);
        setTab(2); // Switch to transactions tab
      },
      prefill: {
        name: entity.name,
        contact: entity.contact,
      },
      theme: {
        color: '#2563EB' // Electric Blue from design system
      }
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  const handleMessageAutomation = () => {
    setIsAutomating(true);
    setTimeout(() => {
      const newLogs = defaulters.map(d => ({
        id: Math.random().toString(36).substring(7),
        recipient: d.parent,
        student: d.name,
        contact: d.contact,
        message: `[Elevation ERP] Dear ${d.parent}, fee of Rs.${d.amount} for ${d.name} is overdue by ${d.daysOverdue} days. Please pay soon to avoid late fees.`,
        timestamp: new Date().toLocaleString(),
        status: 'Sent'
      }));
      setMessageLogs([...newLogs, ...messageLogs]);
      setIsAutomating(false);
      setTab(4); // Switch to logs tab
    }, 1500);
  };

  const handleSingleReminder = (d: any) => {
    const newLog = {
      id: Math.random().toString(36).substring(7),
      recipient: d.parent,
      student: d.name,
      contact: d.contact,
      message: `[Elevation ERP] Dear ${d.parent}, fee of Rs.${d.amount} for ${d.name} is overdue by ${d.daysOverdue} days. Please pay soon to avoid late fees.`,
      timestamp: new Date().toLocaleString(),
      status: 'Sent'
    };
    setMessageLogs([newLog, ...messageLogs]);
    setTab(4);
  };

  const metrics = [
    { title: "Total Collection", value: `Rs. ${(transactions.filter(t=>t.receiptType==='Fee').reduce((acc, t)=>acc+Number(t.amount),0)).toLocaleString()}`, icon: "account_balance_wallet" },
    { title: "Total Disbursements", value: `Rs. ${(transactions.filter(t=>t.receiptType==='Salary').reduce((acc, t)=>acc+Number(t.amount),0)).toLocaleString()}`, icon: "payments" },
    { title: "Pending Dues", value: "Rs. 1,25,000", icon: "pending_actions" },
    { title: "Today's Transactions", value: transactions.length.toString(), icon: "receipt_long" }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-[fadeIn_0.6s_ease-out]">
      {/* Header - Normalized Text */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0A192F] to-[#1e3a8a] rounded-2xl p-4 md:p-5 shadow-md text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-48 h-48 bg-white opacity-5 rounded-full blur-2xl mix-blend-overlay"></div>
        <div className="relative z-10 flex-1">
          <h1 className="text-2xl font-bold tracking-tight">
            Finance & Payroll
          </h1>
          <p className="text-sm text-blue-100 mt-1">
            Manage staff salary disbursements via Razorpay, and track automated SMS defaulter reminders in real-time.
          </p>
        </div>
        <button 
          onClick={handleMessageAutomation} 
          disabled={isAutomating} 
          className="relative z-10 shrink-0 group bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 flex items-center gap-1.5 disabled:opacity-50"
        >
          <span className={`material-symbols-outlined text-[16px] ${isAutomating ? 'animate-spin' : 'group-hover:scale-110 transition-transform'}`}>
            {isAutomating ? 'sync' : 'campaign'}
          </span>
          {isAutomating ? 'Dispatching...' : 'Auto-Remind Defaulters'}
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <div key={i} style={{ animationDelay: `${i * 100}ms` }} className="animate-[slideUp_0.5s_ease-out_both]">
            <SC {...m} />
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-outline-variant/30 overflow-x-auto no-scrollbar pb-2">
        {tabs.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className={`px-6 py-3 text-sm font-bold whitespace-nowrap transition-all duration-300 relative rounded-xl ${
              tab === i 
                ? 'text-white bg-[#2563EB] shadow-lg shadow-blue-500/30 -translate-y-0.5' 
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container/50'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab 0: Staff Salaries */}
      {tab === 0 && (
        <div className="bg-surface rounded-2xl border border-outline-variant card-shadow overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-lowest border-b border-outline-variant">
                <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Staff Name</th>
                <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Type / Dept</th>
                <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Designation</th>
                <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((s, i) => (
                <tr key={i} className="border-b border-outline-variant/50 hover:bg-surface-container-lowest transition-colors">
                  <td className="px-6 py-3.5 text-sm font-bold">{s.name}</td>
                  <td className="px-6 py-3.5 text-xs font-semibold">{s.type}</td>
                  <td className="px-6 py-3.5 text-xs text-on-surface-variant">{s.designation}</td>
                  <td className="px-6 py-3.5 text-right">
                    <button onClick={() => handlePayment(s, 'Salary')} className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-1.5 rounded-lg text-xs font-bold transition-colors">
                      Send Salary
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 1: Fee Collections (Class/Section wise) */}
      {tab === 1 && (
        <div className="bg-surface rounded-2xl border border-outline-variant card-shadow overflow-hidden flex flex-col">
          <div className="p-4 border-b border-outline-variant/50 bg-surface-container-lowest flex items-center justify-between">
            <h3 className="font-bold text-sm text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">account_balance_wallet</span>
              Student Fee Ledgers
            </h3>
            <div className="flex items-center gap-3">
              <select 
                value={selectedClassFee} 
                onChange={(e) => setSelectedClassFee(e.target.value)}
                className="bg-surface border border-outline-variant rounded-lg px-3 py-1.5 text-sm font-bold outline-none focus:border-primary"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(c => (
                  <option key={c} value={c}>Class {c}</option>
                ))}
              </select>
              <select 
                value={selectedSectionFee} 
                onChange={(e) => setSelectedSectionFee(e.target.value)}
                className="bg-surface border border-outline-variant rounded-lg px-3 py-1.5 text-sm font-bold outline-none focus:border-primary"
              >
                {['A', 'B', 'C', 'D'].map(s => (
                  <option key={s} value={s}>Section {s}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="overflow-auto max-h-[500px]">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-surface-container-lowest shadow-sm">
                <tr className="border-b border-outline-variant">
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Student Name</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Roll No</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Parent Contact</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Received This Month</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {feeCollections.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-8 text-sm font-bold text-on-surface-variant">No students found for this class and section.</td></tr>
                ) : feeCollections.map((s, i) => (
                  <tr key={i} className="border-b border-outline-variant/50 hover:bg-primary/5 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold">{s.student.name}</td>
                    <td className="px-6 py-4 text-xs font-semibold">{s.student.rollNo}</td>
                    <td className="px-6 py-4 text-xs text-on-surface-variant">{s.student.contact}</td>
                    <td className="px-6 py-4 text-sm font-bold text-on-surface">
                      {s.student.feeStatus === 'Paid' ? 'Rs. 12,500' : 'Rs. 0'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        s.student.feeStatus === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 
                        s.student.feeStatus === 'Pending' ? 'bg-amber-100 text-amber-700' : 
                        'bg-error-container text-on-error-container'
                      }`}>
                        {s.student.feeStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Live Transactions */}
      {tab === 2 && (
        <div className="bg-surface rounded-2xl border border-outline-variant card-shadow overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-lowest border-b border-outline-variant">
                <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Txn ID</th>
                <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Entity</th>
                <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider text-right">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} className="border-b border-outline-variant/50 hover:bg-surface-container-lowest transition-colors">
                  <td className="px-6 py-3.5 text-xs font-bold text-primary">{t.id}</td>
                  <td className="px-6 py-3.5">
                    <div className="text-sm font-bold">{t.receiptType === 'Fee' ? t.student : t.staffName}</div>
                    <div className="text-[10px] font-semibold text-on-surface-variant">{t.receiptType === 'Fee' ? t.cls : t.designation}</div>
                  </td>
                  <td className="px-6 py-3.5 text-xs font-semibold">{t.type}</td>
                  <td className="px-6 py-3.5 text-sm font-bold">Rs. {t.amount}</td>
                  <td className="px-6 py-3.5 text-xs text-on-surface-variant font-semibold">{t.date}</td>
                  <td className="px-6 py-3.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full text-emerald-700 bg-emerald-100">
                      {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <button onClick={() => downloadInvoicePDF(t)} className="text-primary hover:bg-primary/10 p-2 rounded-lg transition-colors inline-flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">download</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Defaulters */}
      {tab === 3 && (
        <div className="bg-surface rounded-2xl border border-outline-variant card-shadow overflow-hidden flex flex-col">
          <div className="p-4 border-b border-outline-variant/50 bg-surface-container-lowest flex items-center justify-between">
            <h3 className="font-bold text-sm text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-error text-[20px]">warning</span>
              Fee Defaulters list
            </h3>
            <select 
              value={selectedClassDefaulters} 
              onChange={(e) => setSelectedClassDefaulters(e.target.value)}
              className="bg-surface border border-outline-variant rounded-lg px-3 py-1.5 text-sm font-bold outline-none focus:border-primary"
            >
              <option value="All">All Classes</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(c => (
                <option key={c} value={c}>Class {c}</option>
              ))}
            </select>
          </div>
          <div className="overflow-auto max-h-[500px]">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-surface-container-lowest shadow-sm">
                <tr className="border-b border-outline-variant">
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Student</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Class</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Outstanding</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Days Overdue</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Parent Details</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {defaulters.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-8 text-sm font-bold text-on-surface-variant">No defaulters found for this selection.</td></tr>
                ) : defaulters.map((d, i) => (
                  <tr key={i} className="border-b border-outline-variant/50 hover:bg-error/5 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold">{d.name}</td>
                    <td className="px-6 py-4 text-xs font-semibold">{d.cls}</td>
                    <td className="px-6 py-4 text-sm font-bold text-error">Rs. {d.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${d.daysOverdue>45?'bg-error-container text-on-error-container':'bg-amber-100 text-amber-700'}`}>
                        {d.daysOverdue} days
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-bold">{d.parent}</div>
                      <div className="text-[10px] text-on-surface-variant font-semibold mt-0.5">{d.contact}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleSingleReminder(d)} className="px-3 py-1.5 text-xs font-bold rounded-lg bg-surface border border-outline-variant hover:bg-surface-container text-on-surface transition-colors">
                        Send SMS
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: SMS Logs */}
      {tab === 4 && (
        <div className="bg-surface rounded-2xl border border-outline-variant card-shadow overflow-hidden">
          {messageLogs.length === 0 ? (
            <div className="p-12 text-center text-on-surface-variant font-bold">
              No SMS messages have been sent yet.
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Log ID</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Recipient</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Message Preview</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {messageLogs.map((log) => (
                  <tr key={log.id} className="border-b border-outline-variant/50 hover:bg-surface-container-lowest">
                    <td className="px-6 py-4 text-xs font-semibold text-on-surface-variant">LOG-{log.id.toUpperCase()}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold">{log.recipient}</div>
                      <div className="text-[10px] text-on-surface-variant font-semibold">For: {log.student}</div>
                    </td>
                    <td className="px-6 py-4 text-xs text-on-surface-variant max-w-xs truncate" title={log.message}>{log.message}</td>
                    <td className="px-6 py-4 text-xs font-semibold">{log.timestamp}</td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-green-100 text-green-700">
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

function SC({ icon, title, value }: { icon: string; title: string; value: string }) {
  return (
    <div className="group bg-surface p-6 rounded-3xl border border-outline-variant/50 shadow-sm hover:shadow-xl hover:shadow-[#2563EB]/10 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden">
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-[#2563EB]/10 to-transparent rounded-full group-hover:scale-150 transition-transform duration-700 ease-out"></div>
      <div className="flex items-center gap-3 mb-4 relative z-10">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white transition-colors duration-300">
          <span className="material-symbols-outlined text-[24px]">{icon}</span>
        </div>
        <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider">{title}</p>
      </div>
      <h3 className="font-[Outfit] text-4xl font-extrabold tracking-tight text-on-surface relative z-10">
        {value}
      </h3>
    </div>
  );
}
