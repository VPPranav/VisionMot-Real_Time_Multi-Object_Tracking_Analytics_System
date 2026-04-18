import { useState, useMemo } from 'react';
import { useCameraStore } from '../store/cameraStore';
import { useAnalyticsStore } from '../store/analyticsStore';
import { useAnalyticsHistory } from '../hooks/useAnalyticsHistory';
import VideoFeed from '../components/video/VideoFeed';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import clsx from 'clsx';
import { Car, User, Activity } from 'lucide-react';

interface CameraDetailProps {
  cameraId: string;
}

const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_URL = rawApiUrl.replace(/\/$/, '');

const CHART_STYLE = {
  tooltip: {
    contentStyle: {
      backgroundColor: 'rgba(10,10,20,0.95)',
      borderColor: 'rgba(255,255,255,0.08)',
      borderRadius: '12px',
      boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
      padding: '8px 12px',
    },
    itemStyle: { color: '#E5E7EB', fontSize: '12px' },
  },
};

export default function CameraDetail({ cameraId }: CameraDetailProps) {
  const camera = useCameraStore(state => state.cameras.find(c => c.camera_id === cameraId));
  const analytics = useAnalyticsStore(state => state.data[cameraId]);
  const { data: history } = useAnalyticsHistory(cameraId, '5m');
  const [activeTab, setActiveTab] = useState<'counts' | 'tracks' | 'density'>('counts');

  // Each CameraDetail manages its own running state independently from Dashboard
  const [isRunning, setIsRunning] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!camera) return (
    <div className="p-8 text-center">
      <div className="text-red-400 font-semibold">Camera not found</div>
    </div>
  );

  const handleStart = async () => {
    setLoading(true);
    try {
      await fetch(`${API_URL}/cameras/${camera.camera_id}/start`, { method: 'POST' });
      setIsRunning(true);
    } catch (e) {
      console.error('Failed to start camera', e);
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    setLoading(true);
    try {
      await fetch(`${API_URL}/cameras/${camera.camera_id}/stop`, { method: 'POST' });
      setIsRunning(false);
    } catch (e) {
      console.error('Failed to stop camera', e);
    } finally {
      setLoading(false);
    }
  };

  const chartData = useMemo(() => {
    if (!history) return [];
    return history.map((h: any) => ({
      time: format(new Date(h.timestamp), 'HH:mm:ss'),
      vehicles: (h.class_counts?.car || 0) + (h.class_counts?.motorcycle || 0) + (h.class_counts?.bus || 0) + (h.class_counts?.truck || 0),
      pedestrians: h.class_counts?.person || 0,
      active: h.active_tracks || 0,
    }));
  }, [history]);

  const vehicleTotal = analytics?.cumulative_classes
    ? (analytics.cumulative_classes.car || 0) + (analytics.cumulative_classes.motorcycle || 0)
    + (analytics.cumulative_classes.truck || 0) + (analytics.cumulative_classes.bus || 0)
    : null;
  const pedestrianTotal = analytics?.cumulative_classes?.person ?? null;

  const tabs = [
    { key: 'counts', label: 'Live Counts' },
    { key: 'tracks', label: 'Track History' },
    { key: 'density', label: 'Density Map' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={clsx(
              "w-2 h-2 rounded-full",
              isRunning ? "bg-emerald-400 animate-pulse" : "bg-white/20"
            )} />
            <span className="text-xs font-semibold text-emerald-400 tracking-widest uppercase">Camera Detail</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">{camera.name}</h1>
          <p className="text-text-secondary mt-1 text-sm font-mono">{camera.camera_id}</p>
        </div>

        {/* Start / Stop controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleStart}
            disabled={isRunning || loading}
            className={clsx(
              "flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl border transition-all",
              isRunning || loading
                ? "opacity-40 cursor-not-allowed bg-emerald-500/5 text-emerald-400/50 border-emerald-500/10"
                : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20"
            )}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            {loading && !isRunning ? 'Starting…' : 'Start'}
          </button>
          <button
            onClick={handleStop}
            disabled={!isRunning || loading}
            className={clsx(
              "flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl border transition-all",
              !isRunning || loading
                ? "opacity-40 cursor-not-allowed bg-red-500/5 text-red-400/50 border-red-500/10"
                : "bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/20"
            )}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            {loading && isRunning ? 'Stopping…' : 'Stop'}
          </button>
        </div>
      </div>

      {/* Video feed — isRunning is REQUIRED for client webcam to connect */}
      <div className="relative rounded-2xl overflow-hidden border border-white/8 bg-black/40">
        <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-black/70 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1.5">
          <span className={clsx(
            "w-1.5 h-1.5 rounded-full",
            isRunning ? "bg-emerald-400 animate-pulse" : "bg-white/20"
          )} />
          <span className="text-[10px] font-bold text-white/80 tracking-widest uppercase">
            {isRunning ? 'Live Feed' : 'Idle'}
          </span>
        </div>
        <VideoFeed
          cameraId={cameraId}
          name={camera.name}
          isRunning={isRunning}
          className="h-[50vh] w-full"
        />
      </div>

      {/* Tab panel */}
      <div className="bg-white/[0.02] backdrop-blur-md rounded-2xl border border-white/8 overflow-hidden">
        {/* Tab nav */}
        <div className="flex border-b border-white/8">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={clsx(
                "px-6 py-3.5 text-sm font-semibold transition-all duration-200 relative",
                activeTab === tab.key
                  ? "text-indigo-300"
                  : "text-text-secondary hover:text-white hover:bg-white/3"
              )}
            >
              {tab.label}
              {activeTab === tab.key && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full" />
              )}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'counts' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Chart */}
              <div className="bg-white/3 rounded-xl p-5 border border-white/8">
                <h3 className="text-sm font-semibold text-white mb-0.5">Active Objects (Last 5m)</h3>
                <p className="text-xs text-text-secondary mb-4">Real-time vehicle and pedestrian counts</p>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <XAxis dataKey="time" stroke="#374151" fontSize={10} />
                      <YAxis stroke="#374151" fontSize={10} />
                      <Tooltip {...CHART_STYLE.tooltip} />
                      <Line type="monotone" dataKey="vehicles" name="Vehicles" stroke="#6366F1" strokeWidth={2.5} dot={false} />
                      <Line type="monotone" dataKey="pedestrians" name="Pedestrians" stroke="#10B981" strokeWidth={2.5} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Cumulative stats */}
              <div className="bg-white/3 rounded-xl p-5 border border-white/8">
                <h3 className="text-sm font-semibold text-white mb-0.5">Total Unique Objects Tracked</h3>
                <p className="text-xs text-text-secondary mb-5">Cumulative unique identities since session start</p>
                {vehicleTotal !== null && pedestrianTotal !== null ? (
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center gap-4 p-4 bg-indigo-500/8 rounded-xl border border-indigo-500/15">
                      <div className="w-12 h-12 rounded-xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center">
                        <Car size={22} className="text-indigo-400" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Vehicles</div>
                        <div className="text-3xl font-black text-white mt-0.5">{vehicleTotal}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-emerald-500/8 rounded-xl border border-emerald-500/15">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">
                        <User size={22} className="text-emerald-400" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Pedestrians</div>
                        <div className="text-3xl font-black text-white mt-0.5">{pedestrianTotal}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 text-text-secondary text-sm gap-2">
                    <Activity size={20} className="opacity-50" />
                    {isRunning ? 'Waiting for data…' : 'Start the feed to see analytics'}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'tracks' && (
            <div className="flex flex-col items-center justify-center h-48 gap-3 border border-dashed border-white/10 rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <Activity size={20} className="text-text-secondary" />
              </div>
              <p className="text-text-secondary text-sm font-medium">Track history view is under construction</p>
            </div>
          )}

          {activeTab === 'density' && (
            <div className="flex flex-col items-center justify-center h-48 gap-3 border border-dashed border-white/10 rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <Activity size={20} className="text-text-secondary" />
              </div>
              <p className="text-text-secondary text-sm font-medium">Density map overlay is under construction</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}