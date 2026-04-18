import { useState, useEffect } from 'react';
import VideoFeed from '../components/video/VideoFeed';
import { useCameraStore } from '../store/cameraStore';
import { useAuthStore } from '../store/authStore';
import { useCameraConfig } from '../hooks/useCameraConfig';
import { LayoutGrid, Maximize2, Columns, Camera, Settings } from 'lucide-react';
import clsx from 'clsx';
import { API_URL } from '../utils/api';

interface DashboardProps {
  onSelectCamera: (id: string) => void;
  onGoToConfiguration: () => void;
}

export default function Dashboard({ onSelectCamera, onGoToConfiguration }: DashboardProps) {
  const { isLoading, isError } = useCameraConfig();
  const cameras = useCameraStore(state => state.cameras);
  const user = useAuthStore(state => state.user);
  const [layout, setLayout] = useState<1 | 2 | 4>(2);
  const [runningCameras, setRunningCameras] = useState<Record<string, boolean>>({});
  const [loadingCameras, setLoadingCameras] = useState<Record<string, boolean>>({});

  // Reset running state if cameras list changes
  useEffect(() => {
    setRunningCameras({});
    setLoadingCameras({});
  }, [cameras.length]);

  const handleStart = async (cam: { camera_id: string;[key: string]: any }) => {
    if (loadingCameras[cam.camera_id]) return;
    setLoadingCameras(prev => ({ ...prev, [cam.camera_id]: true }));
    try {
      const response = await fetch(`${API_URL}/cameras/${cam.camera_id}/start`, { method: 'POST' });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.detail || `Start failed (${response.status})`);
      }
      setRunningCameras(prev => ({ ...prev, [cam.camera_id]: true }));
    } catch (err) {
      console.error('Failed to start camera:', err);
      const message = err instanceof Error ? err.message : 'Unknown error while starting camera';
      window.alert(`Unable to start camera "${cam.name}". ${message}`);
    } finally {
      setLoadingCameras(prev => ({ ...prev, [cam.camera_id]: false }));
    }
  };

  const handleStop = async (cam: { camera_id: string;[key: string]: any }) => {
    if (loadingCameras[cam.camera_id]) return;
    setLoadingCameras(prev => ({ ...prev, [cam.camera_id]: true }));
    try {
      const response = await fetch(`${API_URL}/cameras/${cam.camera_id}/stop`, { method: 'POST' });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.detail || `Stop failed (${response.status})`);
      }
      setRunningCameras(prev => ({ ...prev, [cam.camera_id]: false }));
    } catch (err) {
      console.error('Failed to stop camera:', err);
      const message = err instanceof Error ? err.message : 'Unknown error while stopping camera';
      window.alert(`Unable to stop camera "${cam.name}". ${message}`);
    } finally {
      setLoadingCameras(prev => ({ ...prev, [cam.camera_id]: false }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-400 tracking-widest uppercase">Live Monitoring</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">
            Welcome, <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">{user}</span>
          </h1>
          <p className="text-text-secondary mt-1 text-sm">
            Real-time monitoring across {cameras.length} active camera{cameras.length !== 1 ? 's' : ''}.
          </p>
        </div>

        {/* Layout switcher */}
        <div className="flex items-center bg-white/5 rounded-xl p-1 border border-white/10 gap-0.5">
          <button
            onClick={() => setLayout(1)}
            title="Single view"
            className={clsx(
              "p-2 rounded-lg transition-all duration-200 hidden md:flex items-center justify-center",
              layout === 1
                ? 'bg-indigo-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]'
                : 'text-text-secondary hover:text-white hover:bg-white/5'
            )}
          >
            <Maximize2 size={16} />
          </button>
          <button
            onClick={() => setLayout(2)}
            title="2-column view"
            className={clsx(
              "p-2 rounded-lg transition-all duration-200 flex items-center justify-center",
              layout === 2
                ? 'bg-indigo-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]'
                : 'text-text-secondary hover:text-white hover:bg-white/5'
            )}
          >
            <Columns size={16} />
          </button>
          <button
            onClick={() => setLayout(4)}
            title="Grid view"
            className={clsx(
              "p-2 rounded-lg transition-all duration-200 hidden sm:flex items-center justify-center",
              layout === 4
                ? 'bg-indigo-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]'
                : 'text-text-secondary hover:text-white hover:bg-white/5'
            )}
          >
            <LayoutGrid size={16} />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="h-80 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl bg-white/2">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-text-secondary text-sm">Loading camera configurations...</p>
        </div>
      ) : isError ? (
        <div className="h-80 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl bg-white/2 px-6 text-center">
          <p className="text-white font-semibold text-lg mb-1">Cannot load cameras</p>
          <p className="text-text-secondary text-sm mb-6">Backend may be sleeping on Render. Wait 20-60 seconds and refresh.</p>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-xl text-sm font-semibold transition-all"
          >
            Retry
          </button>
        </div>
      ) : cameras.length === 0 ? (
      /* No cameras state */
        <div className="h-80 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl bg-white/2">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
            <Camera size={28} className="text-indigo-400" />
          </div>
          <p className="text-white font-semibold text-lg mb-1">No cameras configured</p>
          <p className="text-text-secondary text-sm mb-6">Add a camera source to start monitoring.</p>
          <button
            onClick={onGoToConfiguration}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-xl text-sm font-semibold transition-all"
          >
            <Settings size={16} />
            Go to Configuration
          </button>
        </div>
      ) : (
        <div className={clsx(
          "grid gap-4",
          layout === 1 ? "grid-cols-1" :
            layout === 2 ? "grid-cols-1 lg:grid-cols-2" :
              "grid-cols-1 md:grid-cols-2 xl:grid-cols-4"
        )}>
          {cameras.map(cam => (
            <div key={cam.camera_id} className="flex flex-col h-full group">
              {/* Feed wrapper */}
              <div className="relative rounded-2xl overflow-hidden border border-white/8 group-hover:border-indigo-500/30 transition-all duration-300 bg-black/40">
                {/* Live badge */}
                <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm border border-white/10 rounded-full px-2.5 py-1">
                  <span className={clsx(
                    "w-1.5 h-1.5 rounded-full",
                    runningCameras[cam.camera_id] ? "bg-emerald-400 animate-pulse" : "bg-white/20"
                  )} />
                  <span className="text-[10px] font-bold text-white/80 tracking-wide">
                    {runningCameras[cam.camera_id] ? 'LIVE' : 'IDLE'}
                  </span>
                </div>

                <VideoFeed
                  cameraId={cam.camera_id}
                  name={cam.name}
                  isRunning={runningCameras[cam.camera_id] || false}
                  onClick={() => onSelectCamera(cam.camera_id)}
                  className={clsx(
                    "w-full",
                    layout === 1 ? "h-[60vh]" :
                      layout === 2 ? "h-[45vh]" :
                        "h-[30vh]"
                  )}
                />
              </div>

              {/* Feed controls */}
              <div className="flex items-center justify-between mt-2.5 px-0.5">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleStart(cam)}
                    disabled={runningCameras[cam.camera_id] || loadingCameras[cam.camera_id]}
                    className={clsx(
                      "flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all",
                      runningCameras[cam.camera_id]
                        ? "opacity-40 cursor-not-allowed bg-emerald-500/5 text-emerald-400/50 border-emerald-500/10"
                        : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20 hover:border-emerald-500/30"
                    )}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {loadingCameras[cam.camera_id] && !runningCameras[cam.camera_id] ? 'Starting…' : 'Start'}
                  </button>
                  <button
                    onClick={() => handleStop(cam)}
                    disabled={!runningCameras[cam.camera_id] || loadingCameras[cam.camera_id]}
                    className={clsx(
                      "flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all",
                      !runningCameras[cam.camera_id]
                        ? "opacity-40 cursor-not-allowed bg-red-500/5 text-red-400/50 border-red-500/10"
                        : "bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/20 hover:border-red-500/30"
                    )}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    {loadingCameras[cam.camera_id] && runningCameras[cam.camera_id] ? 'Stopping…' : 'Stop'}
                  </button>
                </div>
                <button
                  onClick={() => onSelectCamera(cam.camera_id)}
                  className="text-xs text-text-secondary hover:text-indigo-300 font-medium transition-colors flex items-center gap-1"
                >
                  Analytics →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}