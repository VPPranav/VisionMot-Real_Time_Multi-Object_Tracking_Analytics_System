import { useEffect, useRef, useState } from 'react';
import { useAnalyticsStore } from '../../store/analyticsStore';
import { AlertTriangle, Activity } from 'lucide-react';
import clsx from 'clsx';
import { useAnalyticsWS } from '../../hooks/useAnalyticsWS';

interface VideoFeedProps {
  cameraId: string;
  name: string;
  onClick?: () => void;
  className?: string;
}

export default function VideoFeed({ cameraId, name, onClick, className }: VideoFeedProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [error, setError] = useState(false);
  
  useAnalyticsWS(cameraId);
  const analytics = useAnalyticsStore(state => state.data[cameraId]);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const streamUrl = `${API_URL}/stream/${cameraId}`;

  useEffect(() => {
    // Reset error when cameraId changes
    setError(false);
  }, [cameraId]);

  return (
    <div 
      className={clsx(
        "relative group rounded-2xl overflow-hidden bg-black border border-border shadow-md transition-all",
        onClick && "cursor-pointer hover:border-primary/50 hover:shadow-primary/20",
        className
      )}
      onClick={onClick}
    >
      {!error ? (
        <img
          ref={imgRef}
          src={streamUrl}
          onError={() => setError(true)}
          className="w-full h-full object-cover"
          alt={`Stream ${name}`}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-text-secondary bg-surface">
          <AlertTriangle size={32} className="mb-2 text-warning" />
          <p>Stream Offline</p>
        </div>
      )}

      {/* Overlay */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity">
        <div>
          <h3 className="text-white font-semibold flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
            <span>{name}</span>
          </h3>
          {analytics && (
            <div className="flex items-center space-x-3 mt-2 text-xs font-mono text-white/80">
              <span className="flex items-center space-x-1 bg-surface-elevated/80 px-2 py-1 rounded backdrop-blur border border-white/10">
                <Activity size={12} />
                <span>{analytics.fps.toFixed(1)} FPS</span>
              </span>
              <span className="bg-surface-elevated/80 px-2 py-1 rounded backdrop-blur border border-white/10">
                Tracks: {analytics.active_tracks}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
