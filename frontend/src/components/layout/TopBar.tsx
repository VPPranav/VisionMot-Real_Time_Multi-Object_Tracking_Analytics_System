import { useAlertStore } from '../../store/alertStore';
import { useCameraStore } from '../../store/cameraStore';
import { useAnalyticsStore } from '../../store/analyticsStore';
import { ShieldAlert, Activity, Camera } from 'lucide-react';
import clsx from 'clsx';

export default function TopBar() {
  const alerts = useAlertStore((state) => state.alerts);
  const activeAlerts = alerts.filter(a => !a.dismissed);
  const criticalCount = activeAlerts.filter(a => a.severity === 'CRITICAL').length;

  const cameras = useCameraStore((state) => state.cameras);

  const analyticsMap = useAnalyticsStore((state) => state.data);
  const analyticsData = Object.values(analyticsMap);
  const avgFps = analyticsData.length > 0
    ? analyticsData.reduce((acc, curr) => acc + curr.fps, 0) / analyticsData.length
    : 0;

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
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-info flex items-center justify-center shadow-lg">
          <span className="text-sm font-bold text-white">OP</span>
        </div>
      </div>
    </header>
  );
}
