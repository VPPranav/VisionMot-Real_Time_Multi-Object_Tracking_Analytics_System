import { useState } from 'react';
import { useAlertStore } from '../store/alertStore';
import { format } from 'date-fns';
import { AlertTriangle, AlertCircle, Info, Trash2 } from 'lucide-react';
import clsx from 'clsx';

export default function AlertsLog() {
  const alerts = useAlertStore(state => state.alerts);
  const dismissAlert = useAlertStore(state => state.dismissAlert);
  const clearAlerts = useAlertStore(state => state.clearAlerts);
  const [filter, setFilter] = useState<string>('ALL');

  const filteredAlerts = alerts.filter(a => filter === 'ALL' ? true : a.severity === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Alerts</h1>
          <p className="text-text-secondary mt-1">Real-time log of anomalies and events.</p>
        </div>
        <button 
           onClick={clearAlerts}
           className="flex items-center space-x-2 px-4 py-2 bg-surface-elevated hover:bg-surface-elevated/80 text-text-primary rounded-lg border border-border transition-colors"
        >
          <Trash2 size={16} />
          <span>Clear All</span>
        </button>
      </div>

      <div className="flex space-x-2">
        {['ALL', 'CRITICAL', 'WARNING', 'INFO'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={clsx(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-colors border",
              filter === f 
                ? "bg-primary text-white border-primary shadow-[0_0_15px_rgba(99,102,241,0.5)]" 
                : "bg-surface/50 backdrop-blur-md border-border/50 text-text-secondary hover:text-text-primary hover:bg-surface-elevated/80"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="bg-surface/70 backdrop-blur-md rounded-2xl border border-border/50 overflow-hidden shadow-glass">
        {filteredAlerts.length === 0 ? (
          <div className="p-8 text-center text-text-secondary">
            No alerts found.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredAlerts.map(alert => (
              <div 
                key={alert.alert_id} 
                className={clsx(
                  "p-4 flex items-start justify-between transition-colors",
                  alert.severity === 'CRITICAL' && !alert.dismissed ? "bg-critical/5 border-l-4 border-l-critical" : "hover:bg-surface-elevated"
                )}
              >
                <div className="flex items-start space-x-4">
                  <div className={clsx(
                    "p-2 rounded-lg mt-1",
                    alert.severity === 'CRITICAL' ? 'bg-critical/20 text-critical' :
                    alert.severity === 'WARNING' ? 'bg-warning/20 text-warning' :
                    'bg-info/20 text-info'
                  )}>
                    {alert.severity === 'CRITICAL' ? <AlertTriangle size={20} /> :
                     alert.severity === 'WARNING' ? <AlertCircle size={20} /> :
                     <Info size={20} />}
                  </div>
                  <div>
                    <div className="flex items-center space-x-3">
                      <h4 className="font-semibold">{alert.alert_type.replace('_', ' ')}</h4>
                      <span className="text-xs text-text-secondary bg-surface border border-border px-2 py-0.5 rounded-md font-mono">
                        {format(new Date(alert.timestamp), 'HH:mm:ss')}
                      </span>
                    </div>
                    <p className="text-text-secondary text-sm mt-1">{alert.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs font-medium">
                       <span className="text-text-secondary">Camera: <span className="text-primary">{alert.camera_id}</span></span>
                       {alert.class_name && <span className="text-text-secondary">Class: <span className="text-text-primary uppercase">{alert.class_name}</span></span>}
                       {alert.track_id && <span className="text-text-secondary">Track ID: <span className="text-text-primary">{alert.track_id}</span></span>}
                    </div>
                  </div>
                </div>
                
                {!alert.dismissed && (
                  <button 
                    onClick={() => dismissAlert(alert.alert_id)}
                    className="text-sm font-medium text-text-secondary hover:text-text-primary px-3 py-1 bg-surface-elevated rounded-md border border-border"
                  >
                    Dismiss
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
