// Student data generator for Elevation ERP
// Classes 1-10 with sections A-E, 11-12 with streams

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
  'Dubey','Chandra','Bajaj','Luthra','Arora','Ahuja','Khanna','Anand','Bhatt','Rajan',
  'Nayak','Yadav','Prasad','Mohan','Suri','Tandon','Sethi','Bhat','Khatri','Grover',
];

const subjects = ['Mathematics', 'Science', 'English', 'Social Studies', 'Second Language', 'Computer Science'];

export interface SubjectMarks {
  subject: string;
  marks: number;
  total: number;
}

export interface Performance {
  cgpa: number;
  percentage: number;
  attentiveness: number;
  assignmentsCompleted: number;
  marks: SubjectMarks[];
  behaviorScore: number;
  participationScore: number;
}

export interface Student {
  id: string;
  name: string;
  rollNo: number;
  parentName: string;
  contact: string;
  status: 'Active' | 'Inactive';
  attendance: number;
  lastGrade: string;
  feeStatus: 'Paid' | 'Pending' | 'Overdue';
  dob: string;
  gender: 'Male' | 'Female';
  address: string;
  performance: Performance;
}

export interface Section {
  name: string;
  stream?: string;
  students: Student[];
}

export interface ClassGroup {
  className: string;
  classNum: number;
  sections: Section[];
  icon: string;
  color: string;
}

function calculateGrade(percentage: number): string {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B+';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C';
  return 'D';
}

function generateStudents(count: number, classLabel: string, section: string): Student[] {
  const students: Student[] = [];
  const seed = classLabel.length + section.charCodeAt(0);
  for (let i = 0; i < count; i++) {
    const fn = firstNames[(i * 7 + seed) % firstNames.length];
    const ln = lastNames[(i * 3 + seed + 5) % lastNames.length];
    const gender: 'Male' | 'Female' = i % 3 === 0 ? 'Female' : 'Male';
    const parentFn = firstNames[(i * 5 + 11) % firstNames.length];
    const statuses: ('Active' | 'Inactive')[] = ['Active','Active','Active','Active','Active','Active','Active','Active','Active','Inactive'];
    const feeStatuses: ('Paid' | 'Pending' | 'Overdue')[] = ['Paid','Paid','Paid','Paid','Paid','Paid','Paid','Pending','Pending','Overdue'];
    
    const year = 2010 + (i % 6);
    const month = String(1 + (i % 12)).padStart(2, '0');
    const day = String(1 + (i % 28)).padStart(2, '0');

    // Generate performance data
    const basePerformance = 60 + ((i * 13 + seed) % 40); // 60 to 100
    const marks: SubjectMarks[] = subjects.map((sub, idx) => ({
      subject: sub,
      marks: Math.min(100, Math.max(0, basePerformance + ((idx * 7) % 20) - 10)),
      total: 100
    }));
    
    const totalMarks = marks.reduce((sum, m) => sum + m.marks, 0);
    const percentage = Math.round((totalMarks / (marks.length * 100)) * 100);
    const cgpa = Number((percentage / 9.5).toFixed(1));
    const attendance = 72 + (i * 3 + seed) % 28;

    students.push({
      id: `STU-${classLabel}${section}-${String(i + 1).padStart(3, '0')}`,
      name: `${fn} ${ln}`,
      rollNo: i + 1,
      parentName: `${parentFn} ${ln}`,
      contact: `+91 ${98700 + i * 11} ${10000 + i * 7}`,
      status: statuses[i % statuses.length],
      attendance,
      lastGrade: calculateGrade(percentage),
      feeStatus: feeStatuses[i % feeStatuses.length],
      dob: `${year}-${month}-${day}`,
      gender,
      address: `${100 + i}, Sector ${10 + (i % 20)}, City`,
      performance: {
        cgpa,
        percentage,
        attentiveness: Math.min(100, attendance + ((i % 5) * 2)),
        assignmentsCompleted: Math.min(100, percentage + ((i % 3) * 4) - 2),
        marks,
        behaviorScore: 80 + (i % 20),
        participationScore: 75 + (i % 25)
      }
    });
  }
  return students;
}

const colors = ['#2563EB','#7C3AED','#059669','#D97706','#DC2626','#0891B2','#4F46E5','#BE185D','#15803D','#9333EA','#E11D48','#0284C7'];

const sectionsAtoE = ['A','B','C','D','E'];

export const classData: ClassGroup[] = [
  // Primary (1-5)
  { className: 'Class 1', classNum: 1, icon: 'child_care', color: colors[0],
    sections: sectionsAtoE.map(s => ({ name: s, students: generateStudents(40, '1', s) })) },
  { className: 'Class 2', classNum: 2, icon: 'child_care', color: colors[1],
    sections: sectionsAtoE.map(s => ({ name: s, students: generateStudents(40, '2', s) })) },
  { className: 'Class 3', classNum: 3, icon: 'child_care', color: colors[2],
    sections: sectionsAtoE.map(s => ({ name: s, students: generateStudents(40, '3', s) })) },
  { className: 'Class 4', classNum: 4, icon: 'school', color: colors[3],
    sections: sectionsAtoE.map(s => ({ name: s, students: generateStudents(45, '4', s) })) },
  { className: 'Class 5', classNum: 5, icon: 'school', color: colors[4],
    sections: sectionsAtoE.map(s => ({ name: s, students: generateStudents(45, '5', s) })) },
  // Middle (6-8)
  { className: 'Class 6', classNum: 6, icon: 'menu_book', color: colors[5],
    sections: sectionsAtoE.map(s => ({ name: s, students: generateStudents(50, '6', s) })) },
  { className: 'Class 7', classNum: 7, icon: 'menu_book', color: colors[6],
    sections: sectionsAtoE.map(s => ({ name: s, students: generateStudents(50, '7', s) })) },
  { className: 'Class 8', classNum: 8, icon: 'menu_book', color: colors[7],
    sections: sectionsAtoE.map(s => ({ name: s, students: generateStudents(50, '8', s) })) },
  // Secondary (9-10)
  { className: 'Class 9', classNum: 9, icon: 'psychology', color: colors[8],
    sections: sectionsAtoE.map(s => ({ name: s, students: generateStudents(60, '9', s) })) },
  { className: 'Class 10', classNum: 10, icon: 'psychology', color: colors[9],
    sections: sectionsAtoE.map(s => ({ name: s, students: generateStudents(60, '10', s) })) },
  // Senior Secondary (11-12)
  { className: 'Class 11', classNum: 11, icon: 'biotech', color: colors[10],
    sections: [
      { name: 'A1', stream: 'Science (PCM)', students: generateStudents(60, '11', 'A1') },
      { name: 'A2', stream: 'Science (PCB)', students: generateStudents(60, '11', 'A2') },
      { name: 'B1', stream: 'Commerce', students: generateStudents(60, '11', 'B1') },
      { name: 'B2', stream: 'Commerce', students: generateStudents(60, '11', 'B2') },
      { name: 'Arts', stream: 'Arts / Humanities', students: generateStudents(60, '11', 'Arts') },
    ],
  },
  { className: 'Class 12', classNum: 12, icon: 'workspace_premium', color: colors[11],
    sections: [
      { name: 'A1', stream: 'Science (PCM)', students: generateStudents(60, '12', 'A1') },
      { name: 'A2', stream: 'Science (PCB)', students: generateStudents(60, '12', 'A2') },
      { name: 'B1', stream: 'Commerce', students: generateStudents(60, '12', 'B1') },
      { name: 'B2', stream: 'Commerce', students: generateStudents(60, '12', 'B2') },
      { name: 'Arts', stream: 'Arts / Humanities', students: generateStudents(60, '12', 'Arts') },
    ],
  },
];

export function getClassByNum(num: number): ClassGroup | undefined {
  return classData.find(c => c.classNum === num);
}

export function getTotalStudents(): number {
  return classData.reduce((sum, c) => sum + c.sections.reduce((s2, sec) => s2 + sec.students.length, 0), 0);
}

export function getActiveStudents(): number {
  return classData.flatMap(c => c.sections.flatMap(s => s.students)).filter(s => s.status === 'Active').length;
}

export function getStudentById(id: string): { student: Student, classNum: number, sectionName: string } | null {
  for (const cls of classData) {
    for (const sec of cls.sections) {
      const student = sec.students.find(s => s.id === id);
      if (student) {
        return { student, classNum: cls.classNum, sectionName: sec.name };
      }
    }
  }
  return null;
}

export function getAllStudentsFlat(): { student: Student, classNum: number, sectionName: string }[] {
  return classData.flatMap(cls => 
    cls.sections.flatMap(sec => 
      sec.students.map(student => ({ student, classNum: cls.classNum, sectionName: sec.name }))
    )
  );
}
