import { NavLink } from 'react-router-dom';
import { useState } from 'react';

interface SidebarProps {
  isCollapsed: boolean;
  onLogout: () => void;
}

interface NavSection {
  label: string;
  items: { name: string; path: string; icon: string }[];
}

const navSections: NavSection[] = [
  {
    label: 'Main',
    items: [
      { name: 'Dashboard', path: '/', icon: 'dashboard' },
    ],
  },
  {
    label: 'People',
    items: [
      { name: 'Students', path: '/students', icon: 'school' },
      { name: 'Teachers', path: '/teachers', icon: 'person' },
      { name: 'Non-Teaching Staff', path: '/staff', icon: 'groups' },
      { name: 'Attendance & Leave', path: '/attendance', icon: 'event_available' },
    ],
  },
  {
    label: 'Academics',
    items: [
      { name: 'Nova AI Open Assistant', path: '/ai-intelligence', icon: 'auto_awesome' },
      { name: 'Homework & Assignments', path: '/homework', icon: 'assignment' },
      { name: 'Results & Grades', path: '/results', icon: 'grade' },
      { name: 'Timetable', path: '/timetable', icon: 'calendar_month' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { name: 'Finance & Fees', path: '/finance', icon: 'payments' },
      { name: 'Transport', path: '/transport', icon: 'directions_bus' },
      { name: 'Communication', path: '/communication', icon: 'forum' },
      { name: 'Events & Circulars', path: '/events', icon: 'campaign' },
    ],
  },
  {
    label: 'Admin',
    items: [
      { name: 'Reports & Analytics', path: '/reports', icon: 'analytics' },
      { name: 'Visitor Management', path: '/visitors', icon: 'badge' },
      { name: 'Incident Log', path: '/incidents', icon: 'report' },
      { name: 'Settings', path: '/settings', icon: 'settings' },
    ],
  },
];

export default function Sidebar({ isCollapsed, onLogout }: SidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
    Object.fromEntries(navSections.map(s => [s.label, true]))
  );

  const toggleSection = (label: string) => {
    if (isCollapsed) return;
    setExpandedSections(prev => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <aside
      className={`h-full fixed left-0 top-0 bg-surface border-r border-outline-variant flex flex-col z-50 overflow-hidden ${
        isCollapsed ? 'w-[72px]' : 'w-[260px]'
      }`}
      style={{ transition: 'width 0.35s cubic-bezier(0.4, 0, 0.2, 1)' }}
    >
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-4 border-b border-outline-variant shrink-0">
        <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-on-primary shrink-0">
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            account_balance
          </span>
        </div>
        <div
          className="overflow-hidden whitespace-nowrap"
          style={{
            opacity: isCollapsed ? 0 : 1,
            width: isCollapsed ? 0 : 'auto',
            transition: 'opacity 0.25s ease, width 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <h1 className="font-[Outfit] text-[17px] font-extrabold text-primary leading-tight">Elevation ERP</h1>
          <p className="text-[10px] font-semibold text-on-surface-variant tracking-[0.08em] uppercase">Super Admin Panel</p>
        </div>
      </div>

      {/* Scrollable Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2">
        {navSections.map((section) => (
          <div key={section.label} className="mb-1">
            {/* Section Label */}
            {!isCollapsed && (
              <button
                onClick={() => toggleSection(section.label)}
                className="w-full flex items-center justify-between px-3 py-1.5 mb-0.5 group"
              >
                <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-on-surface-variant/60">
                  {section.label}
                </span>
                <span
                  className="material-symbols-outlined text-[14px] text-on-surface-variant/40 group-hover:text-on-surface-variant"
                  style={{
                    transform: expandedSections[section.label] ? 'rotate(0deg)' : 'rotate(-90deg)',
                    transition: 'transform 0.2s ease',
                  }}
                >
                  expand_more
                </span>
              </button>
            )}

            {/* Nav Items */}
            <div
              style={{
                maxHeight: !isCollapsed && !expandedSections[section.label] ? '0px' : '500px',
                overflow: 'hidden',
                transition: 'max-height 0.3s ease-in-out',
              }}
            >
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg transition-all duration-200 mb-0.5 ${
                      isActive
                        ? 'text-primary font-semibold bg-primary/8'
                        : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
                    } ${isCollapsed ? 'justify-center px-0 py-2.5 mx-auto w-11' : 'px-3 py-2'}`
                  }
                  title={isCollapsed ? item.name : undefined}
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className="material-symbols-outlined text-[20px] shrink-0"
                        style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                      >
                        {item.icon}
                      </span>
                      <span
                        className="text-[13px] whitespace-nowrap"
                        style={{
                          opacity: isCollapsed ? 0 : 1,
                          width: isCollapsed ? 0 : 'auto',
                          overflow: 'hidden',
                          transition: 'opacity 0.2s ease, width 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                      >
                        {item.name}
                      </span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Nova AI Footer */}
      <div className="px-2 pb-3 shrink-0 space-y-2">
        <NavLink
          to="/ai-intelligence"
          className="rounded-xl relative overflow-hidden block group"
          style={{
            background: isCollapsed ? 'transparent' : 'var(--color-primary-container)',
            padding: isCollapsed ? '8px' : '14px',
            transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {isCollapsed ? (
            <div className="flex justify-center">
              <div className="w-9 h-9 rounded-lg bg-primary-container flex items-center justify-center text-on-primary-container">
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              </div>
            </div>
          ) : (
            <div className="relative z-10">
              <p className="text-[10px] font-semibold text-on-primary-container/70 mb-0.5">Nova AI</p>
              <p className="text-[13px] font-bold text-on-primary-container font-[Outfit] mb-2">Ask Anything</p>
              <div className="w-full bg-on-primary-container text-primary-container text-[12px] font-bold py-1.5 rounded-lg hover:opacity-90 transition-opacity text-center">
                Open Assistant
              </div>
            </div>
          )}
          {!isCollapsed && (
            <div className="absolute -right-3 -bottom-3 opacity-10 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[60px]">auto_awesome</span>
            </div>
          )}
        </NavLink>

        <button
          onClick={onLogout}
          className="w-full rounded-xl flex items-center gap-3 text-error hover:bg-error/10 transition-colors"
          style={{
            padding: isCollapsed ? '8px' : '12px 14px',
            justifyContent: isCollapsed ? 'center' : 'flex-start'
          }}
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          {!isCollapsed && <span className="text-[13px] font-bold">Secure Logout</span>}
        </button>
      </div>
    </aside>
  );
}
