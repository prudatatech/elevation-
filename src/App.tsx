import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import ClassList from './pages/students/ClassList';
import SectionList from './pages/students/SectionList';
import StudentList from './pages/students/StudentList';
import StudentReport from './pages/students/StudentReport';
import TeachersPage from './pages/TeachersPage';
import StaffPage from './pages/StaffPage';
import StaffReport from './pages/StaffReport';
import TimetablePage from './pages/TimetablePage';
import AIPage from './pages/AIPage';
import TransportPage from './pages/TransportPage';
import BusTrackingPage from './pages/BusTrackingPage';
import AttendancePage from './pages/AttendancePage';
import FinancePage from './pages/FinancePage';
import HomeworkPage from './pages/HomeworkPage';
import ResultsPage from './pages/ResultsPage';
import CommunicationPage from './pages/CommunicationPage';
import EventsPage from './pages/EventsPage';
import ReportsPage from './pages/ReportsPage';
import VisitorsPage from './pages/VisitorsPage';
import IncidentsPage from './pages/IncidentsPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <BrowserRouter>
      <div className="flex h-screen overflow-hidden">
        <Sidebar isCollapsed={isSidebarCollapsed} />

        <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarCollapsed ? 'ml-[72px]' : 'ml-[260px]'}`}>
          <Header
            onMenuClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            isSidebarCollapsed={isSidebarCollapsed}
          />

          <main className="flex-1 overflow-y-auto mt-16 bg-[#F1F5F9]">
            <Routes>
              {/* Main */}
              <Route path="/" element={<Dashboard />} />

              {/* People */}
              <Route path="/students" element={<ClassList />} />
              <Route path="/students/:classNum" element={<SectionList />} />
              <Route path="/students/:classNum/:sectionName" element={<StudentList />} />
              <Route path="/students/:classNum/:sectionName/:studentId" element={<StudentReport />} />
              
              <Route path="/teachers" element={<TeachersPage />} />
              <Route path="/staff" element={<StaffPage />} />
              <Route path="/staff/:id" element={<StaffReport />} />
              
              <Route path="/attendance" element={<AttendancePage />} />

              {/* Academics */}
              <Route path="/ai-intelligence" element={<AIPage />} />
              <Route path="/homework" element={<HomeworkPage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/timetable" element={<TimetablePage />} />

              {/* Operations */}
              <Route path="/finance" element={<FinancePage />} />
              <Route path="/transport" element={<TransportPage />} />
              <Route path="/transport/:busId" element={<BusTrackingPage />} />
              <Route path="/communication" element={<CommunicationPage />} />
              <Route path="/events" element={<EventsPage />} />

              {/* Admin */}
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/visitors" element={<VisitorsPage />} />
              <Route path="/incidents" element={<IncidentsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
