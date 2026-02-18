import React from 'react';
import { Database, TrendingUp, Settings, Zap, UserPlus, Sun, Moon } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, isDarkMode, toggleTheme }) => {
  const menuItems = [
    { id: 'discover', label: 'Discover Viral', icon: Zap },
    { id: 'database', label: 'My Database', icon: Database },
    { id: 'influencer', label: 'AI Influencer', icon: UserPlus },
    { id: 'analytics', label: 'Trends & Stats', icon: TrendingUp },
  ];

  return (
    <div className="w-20 lg:w-64 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col fixed left-0 top-0 z-50 transition-all duration-300 shadow-xl lg:shadow-none">
      <div className="h-20 flex items-center justify-center lg:justify-start lg:px-8 border-b border-slate-200 dark:border-slate-800">
        <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center shadow-lg shadow-brand-500/30">
          <TrendingUp className="text-white" size={20} />
        </div>
        <span className="hidden lg:block ml-3 font-bold text-xl text-slate-900 dark:text-white tracking-tight">ViralVault</span>
      </div>

      <div className="flex-1 py-8 px-4 flex flex-col gap-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 shadow-[0_0_20px_rgba(56,189,248,0.1)] font-medium' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon size={22} className={`${isActive ? 'text-brand-600 dark:text-brand-400' : 'group-hover:text-slate-900 dark:group-hover:text-white'} transition-colors`} />
              <span className="hidden lg:block ml-3 text-sm">{item.label}</span>
              {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-500 hidden lg:block" />}
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
        <button 
            onClick={toggleTheme}
            className="w-full flex items-center p-3 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
          <span className="hidden lg:block ml-3 font-medium text-sm">
             {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </span>
        </button>

        <button 
            onClick={() => setCurrentView('settings')}
            className={`w-full flex items-center p-3 rounded-xl transition-colors ${
                currentView === 'settings' 
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
            }`}
        >
          <Settings size={22} />
          <span className="hidden lg:block ml-3 font-medium text-sm">Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;