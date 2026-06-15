export interface Document {
  id: string;
  name: string;
  type: 'PDF' | 'Image' | 'Doc';
  size: string;
  date: string;
}

export interface Leave {
  id: string;
  type: 'Sick' | 'Casual' | 'Earned' | 'Unpaid';
  days: number;
  dateRange: string;
  status: 'Approved' | 'Pending' | 'Rejected';
}

export interface SalaryData {
  basic: number;
  hra: number;
  da: number;
  pf: number;
  tax: number;
  netPay: number;
  lastPaidDate: string;
  accountNo: string;
}

export interface AttendanceHistory {
  month: string;
  percentage: number;
}

export interface StaffMember {
  id: string;
  name: string;
  type: 'Teaching' | 'Non-Teaching';
  dept: string;
  designation: string;
  subjects?: string;
  classes?: string;
  rating?: number;
  status: 'Active' | 'On Leave' | 'Terminated';
  joining: string;
  contact: string;
  email: string;
  address: string;
  salary: SalaryData;
  attendanceData: {
    totalDays: number;
    present: number;
    absent: number;
    late: number;
    history: AttendanceHistory[];
  };
  leaves: Leave[];
  documents: Document[];
}

const firstNames = [
  'Aarav','Vivaan','Aditya','Vihaan','Arjun','Reyansh','Sai','Arnav','Dhruv','Kabir',
  'Ananya','Diya','Myra','Sara','Aadhya','Isha','Kiara','Riya','Anvi','Anika',
  'Rohan','Ishaan','Shaurya','Atharv','Advait','Pranav','Krish','Ritvik','Neil','Ayan',
  'Saanvi','Aanya','Navya','Pari','Avni','Mishti','Tara','Zara','Pihu','Mahira',
  'Yash','Dev','Om','Rudra','Daksh','Viraj','Parth','Harsh','Ayaan','Manav',
  'Nisha','Pooja','Sneha','Shruti','Tanvi','Kavya','Meera','Prisha','Aara','Ivaan',
];

const lastNames = [
  'Sharma','Patel','Gupta','Singh','Kumar','Reddy','Nair','Joshi','Desai','Iyer',
  'Verma','Rao','Menon','Bhatia','Chopra','Malhotra','Kapoor','Agarwal','Saxena','Mishra',
  'Chauhan','Tiwari','Sinha','Das','Bose','Mukherjee','Banerjee','Ghosh','Pillai','Hegde',
  'Kulkarni','Kamath','Shetty','Deshpande','Patil','Jain','Shah','Mehta','Thakur','Pandey',
];

const departments = [
  { dept: 'Mathematics', subjects: 'Algebra, Calculus, Geometry', classes: '9-A, 10-B, 11-A' },
  { dept: 'Science', subjects: 'Physics, Chemistry', classes: '10-A, 11-B, 12-A' },
  { dept: 'English', subjects: 'Literature, Grammar', classes: '8-A, 9-A, 10-C' },
  { dept: 'Social Studies', subjects: 'History, Geography', classes: '7-A, 8-B, 9-B' },
  { dept: 'Computer Science', subjects: 'Python, Web Dev', classes: '10-A, 11-C, 12-B' },
  { dept: 'Physical Education', subjects: 'Sports, Fitness', classes: 'All Classes' },
  { dept: 'Hindi', subjects: 'Hindi Literature', classes: '6-A, 7-B, 8-A' },
  { dept: 'Biology', subjects: 'Biology, Botany', classes: '11-B, 12-C' },
];

function generateMockData(isTeacher: boolean, seed: number): Partial<StaffMember> {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const history = months.map(m => ({ month: m, percentage: 85 + (seed % 15) }));
  
  const basic = isTeacher ? 45000 + (seed % 15) * 1000 : 25000 + (seed % 10) * 1000;
  const hra = basic * 0.2;
  const da = basic * 0.1;
  const pf = basic * 0.12;
  const tax = basic > 40000 ? basic * 0.05 : 0;
  
  return {
    email: `staff.${seed}@elevation.edu`,
    address: `${(seed % 100) + 1} Block, Tech Park, City`,
    salary: {
      basic,
      hra,
      da,
      pf,
      tax,
      netPay: basic + hra + da - pf - tax,
      lastPaidDate: '2026-05-31',
      accountNo: `XXXX-XXXX-${1000 + (seed % 8999)}`
    },
    attendanceData: {
      totalDays: 120,
      present: 105 + (seed % 10),
      absent: (seed % 5),
      late: (seed % 5),
      history
    },
    leaves: [
      { id: 'L1', type: 'Sick', days: (seed % 3) + 1, dateRange: '12 May - 13 May', status: 'Approved' },
      { id: 'L2', type: 'Casual', days: 1, dateRange: '20 Jun', status: 'Pending' }
    ],
    documents: [
      { id: 'D1', name: 'Identity Proof.pdf', type: 'PDF', size: '2.4 MB', date: '2022-01-10' },
      { id: 'D2', name: 'Degree Certificate.pdf', type: 'PDF', size: '4.1 MB', date: '2022-01-15' },
      { id: 'D3', name: 'Contract Agreement.pdf', type: 'PDF', size: '1.2 MB', date: '2022-01-20' },
    ]
  };
}

function generateTeachers(count: number): StaffMember[] {
  const teachers: StaffMember[] = [];
  for (let i = 0; i < count; i++) {
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[(i * 3) % lastNames.length];
    const deptInfo = departments[i % departments.length];
    
    teachers.push({
      id: `TCH-${String(i + 1).padStart(3, '0')}`,
      name: `${fn} ${ln}`,
      type: 'Teaching',
      dept: deptInfo.dept,
      designation: i % 10 === 0 ? 'Head of Dept' : (i % 5 === 0 ? 'Senior Teacher' : 'Teacher'),
      subjects: deptInfo.subjects,
      classes: deptInfo.classes,
      rating: Number((4.0 + (i % 10) * 0.1).toFixed(1)),
      status: i % 15 === 0 ? 'On Leave' : 'Active',
      joining: `201${5 + (i % 8)}-0${1 + (i % 9)}-15`,
      contact: `+91 98765 ${String(10000 + i).padStart(5, '0')}`,
      ...generateMockData(true, i)
    } as StaffMember);
  }
  return teachers;
}

export const staffDatabase: StaffMember[] = [
  ...generateTeachers(100),
  
  // Non-Teaching
  { id: 'NTS-001', name: 'Ramesh Yadav', type: 'Non-Teaching', dept: 'Administration', designation: 'Office Manager', status: 'Active', joining: '2018-04-15', contact: '+91 98712 34501', ...generateMockData(false, 1001) } as StaffMember,
  { id: 'NTS-002', name: 'Sunita Devi', type: 'Non-Teaching', dept: 'Accounts', designation: 'Accountant', status: 'Active', joining: '2019-07-20', contact: '+91 98712 34502', ...generateMockData(false, 1002) } as StaffMember,
  { id: 'NTS-003', name: 'Mukesh Kumar', type: 'Non-Teaching', dept: 'Security', designation: 'Head Guard', status: 'Active', joining: '2017-01-10', contact: '+91 98712 34503', ...generateMockData(false, 1003) } as StaffMember,
  { id: 'NTS-004', name: 'Lakshmi Bai', type: 'Non-Teaching', dept: 'Library', designation: 'Librarian', status: 'Active', joining: '2020-03-01', contact: '+91 98712 34504', ...generateMockData(false, 1004) } as StaffMember,
  { id: 'NTS-005', name: 'Ravi Shankar', type: 'Non-Teaching', dept: 'IT Support', designation: 'System Admin', status: 'Active', joining: '2021-06-15', contact: '+91 98712 34505', ...generateMockData(false, 1005) } as StaffMember,
];

export function getStaffById(id: string): StaffMember | undefined {
  return staffDatabase.find(s => s.id === id);
}

export function getAllTeachers(): StaffMember[] {
  return staffDatabase.filter(s => s.type === 'Teaching');
}

export function getAllNonTeachingStaff(): StaffMember[] {
  return staffDatabase.filter(s => s.type === 'Non-Teaching');
}
