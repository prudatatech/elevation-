import { getAllTeachers } from './staff';

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
export const PERIODS = [
  { id: 1, time: '08:00 AM - 08:45 AM' },
  { id: 2, time: '08:45 AM - 09:30 AM' },
  { id: 3, time: '09:30 AM - 10:15 AM' },
  { id: 4, time: '10:30 AM - 11:15 AM' }, // After Short Break
  { id: 5, time: '11:15 AM - 12:00 PM' },
  { id: 6, time: '12:00 PM - 12:45 PM' },
  { id: 7, time: '01:30 PM - 02:15 PM' }, // After Lunch Break
  { id: 8, time: '02:15 PM - 03:00 PM' }
];

export const CLASSES = [
  '10-A', '10-B', '10-C', '10-D', '10-E',
  '9-A', '9-B', '9-C', '9-D', '9-E',
  '11-A1', '11-A2', '11-B1', '11-B2',
  '12-A1', '12-A2', '12-B1', '12-B2'
];

export interface ScheduleBlock {
  classId: string;
  teacherId: string;
  subject: string;
}

export type TimetableGrid = {
  [day: string]: {
    [periodId: number]: ScheduleBlock[];
  };
};

let cachedTimetable: TimetableGrid | null = null;

export function getMasterTimetable(): TimetableGrid {
  if (cachedTimetable) return cachedTimetable;

  const teachers = getAllTeachers();
  const grid: TimetableGrid = {};

  DAYS.forEach(day => {
    grid[day] = {};
    PERIODS.forEach(period => {
      grid[day][period.id] = [];
      
      // For each period, assign a teacher to each class
      // In a real system, this is a complex constraint satisfaction problem.
      // We will generate a plausible mock mapping using pseudo-random logic.
      
      const availableTeachers = [...teachers];
      
      CLASSES.forEach((cls, classIndex) => {
        // Find a teacher who hasn't been assigned this period yet
        // and ideally teaches this class (based on pseudo-random assignment)
        
        // Simple hash to deterministically pick a teacher based on Day+Period+Class
        const seed = day.charCodeAt(0) + period.id * 10 + classIndex;
        const assignedIndex = seed % availableTeachers.length;
        const selectedTeacher = availableTeachers.splice(assignedIndex, 1)[0];
        
        if (selectedTeacher) {
          const subjects = selectedTeacher.subjects?.split(', ') || ['General'];
          const assignedSubject = subjects[seed % subjects.length];
          
          grid[day][period.id].push({
            classId: cls,
            teacherId: selectedTeacher.id,
            subject: assignedSubject
          });
        }
      });
    });
  });

  cachedTimetable = grid;
  return grid;
}

export function getTeacherSchedule(teacherId: string) {
  const timetable = getMasterTimetable();
  const schedule: Record<string, Record<number, ScheduleBlock | null>> = {};

  DAYS.forEach(day => {
    schedule[day] = {};
    PERIODS.forEach(p => {
      const block = timetable[day][p.id].find(b => b.teacherId === teacherId);
      schedule[day][p.id] = block || null;
    });
  });

  return schedule;
}

export function getClassSchedule(classId: string) {
  const timetable = getMasterTimetable();
  const schedule: Record<string, Record<number, ScheduleBlock | null>> = {};

  DAYS.forEach(day => {
    schedule[day] = {};
    PERIODS.forEach(p => {
      const block = timetable[day][p.id].find(b => b.classId === classId);
      schedule[day][p.id] = block || null;
    });
  });

  return schedule;
}

export function getFreeTeachersForPeriod(day: string, periodId: number) {
  const timetable = getMasterTimetable();
  const allTeachers = getAllTeachers();
  
  const occupiedTeacherIds = new Set(timetable[day][periodId].map(b => b.teacherId));
  
  return allTeachers.filter(t => !occupiedTeacherIds.has(t.id));
}
