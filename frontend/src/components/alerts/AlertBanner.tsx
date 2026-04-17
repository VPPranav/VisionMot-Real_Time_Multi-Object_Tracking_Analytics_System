import { useAlertStore } from '../../store/alertStore';
import { X, AlertTriangle } from 'lucide-react';

export default function AlertBanner() {
  const alerts = useAlertStore(state => state.alerts);
  const dismissAlert = useAlertStore(state => state.dismissAlert);
  
  // Show only top critical alert that is not dismissed
  const criticalAlert = alerts.find(a => a.severity === 'CRITICAL' && !a.dismissed);

  if (!criticalAlert) return null;

  return (
    <div className="bg-critical/90 text-white px-4 py-3 flex items-center justify-between shadow-lg shadow-critical/20 animate-in slide-in-from-top border-b border-critical">
      <div className="flex items-center space-x-3">
        <AlertTriangle className="animate-pulse" />
        <span className="font-semibold">CRITICAL ALERT:</span>
        <span>{criticalAlert.description} (Camera: {criticalAlert.camera_id})</span>
      </div>
      <button 
        onClick={() => dismissAlert(criticalAlert.alert_id)}
        className="hover:bg-white/20 p-1 rounded-full transition-colors"
      >
        <X size={20} />
      </button>
    </div>
  );
}
