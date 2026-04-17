import { useState, useMemo } from 'react';
import { useCameraStore } from '../store/cameraStore';
import { useAnalyticsStore } from '../store/analyticsStore';
import { useAnalyticsHistory } from '../hooks/useAnalyticsHistory';
import VideoFeed from '../components/video/VideoFeed';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import clsx from 'clsx';

interface CameraDetailProps {
  cameraId: string;
}

export default function CameraDetail({ cameraId }: CameraDetailProps) {
  const camera = useCameraStore(state => state.cameras.find(c => c.camera_id === cameraId));
  const analytics = useAnalyticsStore(state => state.data[cameraId]);
  const { data: history } = useAnalyticsHistory(cameraId, '5m');
  const [activeTab, setActiveTab] = useState<'counts' | 'tracks' | 'density'>('counts');

  if (!camera) return <div className="p-6 text-critical">Camera not found</div>;

  const chartData = useMemo(() => {
    if (!history) return [];
    return history.map((h: any) => ({
      time: format(new Date(h.timestamp), 'HH:mm:ss'),
      vehicles: (h.class_counts?.car || 0) + (h.class_counts?.motorcycle || 0) + (h.class_counts?.bus || 0) + (h.class_counts?.truck || 0),
      pedestrians: h.class_counts?.person || 0,
      active: h.active_tracks || 0
    }));
  }, [history]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{camera.name}</h1>
      </div>

      <div className="rounded-2xl border border-border/50 p-2 bg-surface/70 backdrop-blur-md shadow-glass">
        <VideoFeed cameraId={cameraId} name={camera.name} className="h-[50vh] w-full" />
      </div>

      <div className="bg-surface/50 backdrop-blur-md rounded-2xl border border-border/50 overflow-hidden shadow-glass">
        <div className="flex border-b border-border/50">
          {['counts', 'tracks', 'density'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={clsx(
                "px-6 py-3 font-medium capitalize transition-colors",
                activeTab === tab ? "border-b-2 border-primary text-primary bg-primary/5" : "text-text-secondary hover:text-text-primary hover:bg-white/5"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'counts' && (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               <div className="bg-surface/60 backdrop-blur-sm rounded-xl p-4 border border-border/50 h-64 shadow-inner">
                 <h3 className="text-sm font-medium text-text-secondary mb-4">Active Objects (Last 60s)</h3>
                 <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={chartData}>
                     <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} />
                     <YAxis stroke="#9CA3AF" fontSize={12} />
                     <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151' }} />
                     <Line type="monotone" dataKey="vehicles" stroke="#3B82F6" strokeWidth={2} dot={false} />
                     <Line type="monotone" dataKey="pedestrians" stroke="#10B981" strokeWidth={2} dot={false} />
                   </LineChart>
                 </ResponsiveContainer>
               </div>

               <div className="bg-surface/60 backdrop-blur-sm rounded-xl p-4 border border-border/50 shadow-inner">
                 <h3 className="text-sm font-medium text-text-secondary mb-4">Total Unique Objects Tracked</h3>
                 {analytics?.cumulative_classes ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                         <div className="text-success font-semibold text-sm">Vehicles</div>
                         <div className="text-2xl font-bold mt-1">{(analytics.cumulative_classes.car || 0) + (analytics.cumulative_classes.motorcycle || 0) + (analytics.cumulative_classes.truck || 0) + (analytics.cumulative_classes.bus || 0)}</div>
                      </div>
                      <div className="p-4 bg-info/10 rounded-lg border border-info/20">
                         <div className="text-info font-semibold text-sm">Pedestrians</div>
                         <div className="text-2xl font-bold mt-1">{analytics.cumulative_classes.person || 0}</div>
                      </div>
                    </div>
                 ) : (
                    <div className="text-text-secondary text-sm">Waiting for data...</div>
                 )}
               </div>
             </div>
          )}

          {activeTab === 'tracks' && (
            <div className="text-text-secondary text-sm flex items-center justify-center h-48 border border-dashed border-border rounded-xl">
               Track history view is currently under construction.
            </div>
          )}

          {activeTab === 'density' && (
            <div className="text-text-secondary text-sm flex items-center justify-center h-48 border border-dashed border-border rounded-xl">
               Density map overlay view is currently under construction.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
