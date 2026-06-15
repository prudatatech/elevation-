import { useState } from 'react';

interface HeaderProps {
  onMenuClick: () => void;
  isSidebarCollapsed: boolean;
}

export default function Header({ onMenuClick, isSidebarCollapsed }: HeaderProps) {
  const [globalSearch, setGlobalSearch] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (globalSearch.trim()) {
      // In a real app, this would route to a global search page
      // For now, we will just alert to show it's active
      alert(`Global search triggered for: ${globalSearch}`);
    }
  };

  return (
    <header
      className="fixed top-0 right-0 h-16 bg-surface border-b border-outline-variant flex justify-between items-center px-6 z-40 shadow-sm transition-all"
      style={{
        left: isSidebarCollapsed ? '72px' : '260px',
        transition: 'left 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-surface-container-low rounded-full transition-transform active:scale-95 group"
        >
          <span 
            className="material-symbols-outlined text-on-surface-variant block transition-transform duration-300"
            style={{ transform: isSidebarCollapsed ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            {isSidebarCollapsed ? 'menu_open' : 'menu'}
          </span>
        </button>
        <form onSubmit={handleSearch} className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-3 text-outline">search</span>
          <input
            className="w-80 bg-surface-container-low border-none rounded-full pl-10 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
            placeholder="Search records, students, or reports..."
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
          />
          {globalSearch && (
            <button type="button" onClick={() => setGlobalSearch('')} className="absolute right-3 text-outline hover:text-on-surface-variant">
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </form>
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2 hover:bg-surface-container-low rounded-full transition-transform active:scale-95">
          <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
        </button>
        <button className="p-2 hover:bg-surface-container-low rounded-full transition-transform active:scale-95">
          <span className="material-symbols-outlined text-on-surface-variant">chat</span>
        </button>
        <button className="p-2 hover:bg-surface-container-low rounded-full transition-transform active:scale-95">
          <span className="material-symbols-outlined text-on-surface-variant">help</span>
        </button>
        <div className="h-8 w-[1px] bg-outline-variant mx-2"></div>
        <div className="flex items-center gap-3 cursor-pointer hover:bg-surface-container-low p-2 rounded-lg transition-colors">
          <div className="text-right">
            <p className="text-sm font-bold">Super Admin</p>
            <p className="text-xs text-on-surface-variant">ID: #88219</p>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-primary-container bg-primary flex items-center justify-center text-on-primary font-bold">
            SA
          </div>
        </div>
      </div>
    </header>
  );
}
