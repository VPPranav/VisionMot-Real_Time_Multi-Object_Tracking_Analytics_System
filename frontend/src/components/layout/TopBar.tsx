import { useAlertStore } from '../../store/alertStore';
import { useCameraStore } from '../../store/cameraStore';
import { useAnalyticsStore } from '../../store/analyticsStore';
import { useAuthStore } from '../../store/authStore';
import { ShieldAlert, Activity, Camera, LogOut } from 'lucide-react';
import clsx from 'clsx';

export default function TopBar() {
  const alerts = useAlertStore((state) => state.alerts);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const activeAlerts = alerts.filter(a => !a.dismissed);
  const criticalCount = activeAlerts.filter(a => a.severity === 'CRITICAL').length;

  const cameras = useCameraStore((state) => state.cameras);

  const analyticsMap = useAnalyticsStore((state) => state.data);
  const analyticsData = Object.values(analyticsMap);
  const avgFps = analyticsData.length > 0
    ? analyticsData.reduce((acc, curr) => acc + curr.fps, 0) / analyticsData.length
    : 0;

  const getInitials = (name: string) => {
    return name ? name.substring(0, 2).toUpperCase() : 'OP';
  };

  return (
    <header className="h-16 bg-surface/50 backdrop-blur-md border-b border-border/50 flex items-center justify-between px-6 shadow-sm z-10 relative">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2 text-text-secondary">
          <Camera size={18} />
          <span className="text-sm font-medium">{cameras.length} Active Feeds</span>
        </div>
        <div className="flex items-center space-x-2 text-text-secondary">
          <Activity size={18} />
          <span className="text-sm font-medium">{avgFps.toFixed(1)} FPS (Avg)</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className={clsx(
          "flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
          criticalCount > 0 ? "bg-critical/20 text-critical border border-critical/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]" :
            activeAlerts.length > 0 ? "bg-warning/20 text-warning" : "bg-success/20 text-success"
        )}>
          <ShieldAlert size={16} />
          <span>{activeAlerts.length} Active Alerts</span>
        </div>
        <div className="flex items-center space-x-3 border-l border-border/50 pl-4">
           <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-info flex items-center justify-center shadow-lg">
             <span className="text-sm font-bold text-white">{getInitials(user || '')}</span>
           </div>
           <button 
             onClick={logout}
             className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-text-secondary hover:text-white hover:bg-critical/20 hover:border-critical/30 border border-transparent transition-all"
             title="Logout"
           >
             <LogOut size={16} />
             <span className="text-sm font-medium hidden sm:block">Logout</span>
           </button>
        </div>
      </div>
    </header>
  );
}
