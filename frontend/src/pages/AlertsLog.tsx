import { useState } from 'react';
import { useAlertStore } from '../store/alertStore';
import { format } from 'date-fns';
import { AlertTriangle, AlertCircle, Info, Trash2, Bell, CheckCircle } from 'lucide-react';
import clsx from 'clsx';

export default function AlertsLog() {
  const alerts = useAlertStore(state => state.alerts);
  const dismissAlert = useAlertStore(state => state.dismissAlert);
  const clearAlerts = useAlertStore(state => state.clearAlerts);
  const [filter, setFilter] = useState<string>('ALL');

  const filteredAlerts = alerts.filter(a => filter === 'ALL' ? true : a.severity === filter);

  const counts = {
    ALL: alerts.length,
    CRITICAL: alerts.filter(a => a.severity === 'CRITICAL').length,
    WARNING: alerts.filter(a => a.severity === 'WARNING').length,
    INFO: alerts.filter(a => a.severity === 'INFO').length,
  };

  const filterConfig = [
    { key: 'ALL', label: 'All', color: 'text-text-secondary', activeColor: 'bg-indigo-600 text-white border-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.4)]' },
    { key: 'CRITICAL', label: 'Critical', color: 'text-red-400', activeColor: 'bg-red-600/20 text-red-300 border-red-500/50' },
    { key: 'WARNING', label: 'Warning', color: 'text-amber-400', activeColor: 'bg-amber-600/20 text-amber-300 border-amber-500/50' },
    { key: 'INFO', label: 'Info', color: 'text-sky-400', activeColor: 'bg-sky-600/20 text-sky-300 border-sky-500/50' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bell size={14} className="text-amber-400" />
            <span className="text-xs font-semibold text-amber-400 tracking-widest uppercase">Alert Center</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">System Alerts</h1>
          <p className="text-text-secondary mt-1 text-sm">Real-time log of anomalies and security events.</p>
        </div>
        <button
          onClick={clearAlerts}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/8 text-text-secondary hover:text-white rounded-xl border border-white/10 hover:border-white/20 transition-all text-sm font-medium"
        >
          <Trash2 size={15} />
          <span>Clear All</span>
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {filterConfig.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={clsx(
              "flex items-center gap-2 px-4 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 border",
              filter === f.key
                ? f.activeColor
                : `bg-white/3 border-white/8 ${f.color} hover:bg-white/6 hover:border-white/15`
            )}
          >
            {f.label}
            <span className={clsx(
              "text-xs font-bold px-1.5 py-0.5 rounded-md",
              filter === f.key ? 'bg-white/20' : 'bg-white/8'
            )}>
              {counts[f.key as keyof typeof counts]}
            </span>
          </button>
        ))}
      </div>

      {/* Alerts list */}
      <div className="bg-white/[0.02] backdrop-blur-md rounded-2xl border border-white/8 overflow-hidden">
        {filteredAlerts.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={24} className="text-emerald-400" />
            </div>
            <p className="text-white font-semibold mb-1">All clear</p>
            <p className="text-text-secondary text-sm">No alerts found for the selected filter.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filteredAlerts.map((alert, idx) => (
              <div
                key={alert.alert_id}
                className={clsx(
                  "p-4 sm:p-5 flex items-start justify-between gap-4 transition-all duration-200",
                  alert.severity === 'CRITICAL' && !alert.dismissed
                    ? "bg-red-500/5 border-l-2 border-l-red-500"
                    : "hover:bg-white/[0.02]"
                )}
              >
                <div className="flex items-start gap-4">
                  {/* Severity icon */}
                  <div className={clsx(
                    "p-2.5 rounded-xl shrink-0 mt-0.5",
                    alert.severity === 'CRITICAL' ? 'bg-red-500/15 text-red-400 border border-red-500/20' :
                      alert.severity === 'WARNING' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' :
                        'bg-sky-500/15 text-sky-400 border border-sky-500/20'
                  )}>
                    {alert.severity === 'CRITICAL' ? <AlertTriangle size={18} /> :
                      alert.severity === 'WARNING' ? <AlertCircle size={18} /> :
                        <Info size={18} />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={clsx(
                        "text-xs font-bold px-2 py-0.5 rounded-md border",
                        alert.severity === 'CRITICAL' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                          alert.severity === 'WARNING' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                            'bg-sky-500/10 text-sky-400 border-sky-500/20'
                      )}>
                        {alert.severity}
                      </span>
                      <h4 className="font-bold text-white text-sm">{alert.alert_type.replace('_', ' ')}</h4>
                      <span className="text-xs text-text-secondary bg-white/5 border border-white/8 px-2 py-0.5 rounded-lg font-mono">
                        {format(new Date(alert.timestamp), 'HH:mm:ss')}
                      </span>
                    </div>
                    <p className="text-text-secondary text-sm leading-relaxed">{alert.description}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs">
                      <span className="text-text-secondary">
                        Camera: <span className="text-indigo-400 font-medium">{alert.camera_id}</span>
                      </span>
                      {alert.class_name && (
                        <span className="text-text-secondary">
                          Class: <span className="text-white font-medium uppercase">{alert.class_name}</span>
                        </span>
                      )}
                      {alert.track_id && (
                        <span className="text-text-secondary">
                          Track: <span className="text-white font-medium">#{alert.track_id}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {!alert.dismissed && (
                  <button
                    onClick={() => dismissAlert(alert.alert_id)}
                    className="shrink-0 text-xs font-semibold text-text-secondary hover:text-white px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg border border-white/8 hover:border-white/20 transition-all"
                  >
                    Dismiss
                  </button>
                )}
                {alert.dismissed && (
                  <span className="shrink-0 text-xs font-medium text-emerald-500/60 flex items-center gap-1">
                    <CheckCircle size={12} />
                    Done
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}