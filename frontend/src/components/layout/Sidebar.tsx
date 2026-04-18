import { Home, LayoutDashboard, Video, BarChart2, Bell, Settings, Info } from 'lucide-react';
import clsx from 'clsx';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'configuration', label: 'Configuration', icon: Settings },
    { id: 'about', label: 'About Us', icon: Info },
  ];

  return (
    <aside className="w-64 bg-surface/80 backdrop-blur-md border-r border-border flex flex-col h-full shadow-glass z-10 relative">
      <div className="p-6 flex items-center space-x-3 mb-2">
        <img src="/logo.png" alt="VisionMOT" className="w-8 h-8 rounded-lg shadow-glass border border-primary/20" />
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-info tracking-wider drop-shadow-sm">
          VisionMOT
        </h1>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id || (item.id === 'dashboard' && currentPage === 'camera');
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={clsx(
                'w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200',
                isActive
                  ? 'bg-primary/10 text-primary shadow-sm shadow-primary/5'
                  : 'text-text-secondary hover:bg-surface-elevated hover:text-text-primary'
              )}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
