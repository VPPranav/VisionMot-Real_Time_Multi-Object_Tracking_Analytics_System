import { useEffect, useRef, useState } from 'react';
import { useAnalyticsStore } from '../../store/analyticsStore';
import { useCameraStore } from '../../store/cameraStore';
import { AlertTriangle, Activity } from 'lucide-react';
import clsx from 'clsx';
import { useAnalyticsWS } from '../../hooks/useAnalyticsWS';

interface VideoFeedProps {
  cameraId: string;
  name: string;
  isRunning?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function VideoFeed({ cameraId, name, isRunning, onClick, className }: VideoFeedProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [error, setError] = useState(false);
  const [wsFrame, setWsFrame] = useState<string>('');
  
  useAnalyticsWS(cameraId);
  const analytics = useAnalyticsStore(state => state.data[cameraId]);
  const cameraConfig = useCameraStore(state => state.cameras.find(c => c.camera_id === cameraId));

  const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const API_URL = rawApiUrl.replace(/\/$/, ''); // Remove trailing slash
  const streamUrl = `${API_URL}/stream/${cameraId}`;
  const WS_URL = API_URL.replace(/^http/, 'ws') + `/ws/client-stream/${cameraId}`;

  useEffect(() => {
    setError(false);
  }, [cameraId]);

  // Handle client-side webcam streaming if configured
  useEffect(() => {
    const isClient = cameraConfig?.source === 'client';
    
    if (isClient && isRunning) {
      // Start webcam and WebSocket
      let stream: MediaStream | null = null;
      let frameInterval: NodeJS.Timeout;
      let reconnectTimeout: NodeJS.Timeout;

      const startStreaming = () => {
          navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } })
            .then(mediaStream => {
              stream = mediaStream;
              if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                videoRef.current.play();
              }

              wsRef.current = new WebSocket(WS_URL);
              wsRef.current.onopen = () => {
                console.log("Connected to stream WS");
                frameInterval = setInterval(() => {
                  if (videoRef.current && canvasRef.current && wsRef.current?.readyState === WebSocket.OPEN) {
                    const ctx = canvasRef.current.getContext('2d');
                    if (ctx) {
                      ctx.drawImage(videoRef.current, 0, 0, 640, 480);
                      // Send base64 frame
                      const dataURL = canvasRef.current.toDataURL('image/jpeg', 0.6);
                      wsRef.current.send(dataURL);
                    }
                  }
                }, 100); // 10 FPS upload
              };
              
              wsRef.current.onmessage = (event) => {
                 // Receive annotated frame
                 if (typeof event.data === 'string' && event.data.startsWith('data:image')) {
                     setWsFrame(event.data);
                 }
              };

              wsRef.current.onerror = (err) => {
                  console.error("Stream WebSocket error:", err);
              };

              wsRef.current.onclose = () => {
                  console.log("Stream WebSocket closed, reconnecting...");
                  if (frameInterval) clearInterval(frameInterval);
                  reconnectTimeout = setTimeout(startStreaming, 3000);
              };
            })
            .catch(err => {
              console.error("Error accessing webcam:", err);
              setError(true);
            });
      };

      startStreaming();

      return () => {
        if (stream) stream.getTracks().forEach(t => t.stop());
        if (frameInterval) clearInterval(frameInterval);
        if (reconnectTimeout) clearTimeout(reconnectTimeout);
        if (wsRef.current) {
            wsRef.current.onclose = null;
            wsRef.current.close();
        }
      };
    } else {
      setWsFrame(''); // clear when stopped
    }
  }, [cameraConfig, isRunning, WS_URL]);

  const isClient = cameraConfig?.source === 'client';
  const displaySrc = isClient ? (wsFrame || '') : (isRunning ? streamUrl : '');

  return (
    <div 
      className={clsx(
        "relative group rounded-2xl overflow-hidden bg-black border border-border shadow-md transition-all",
        onClick && "cursor-pointer hover:border-primary/50 hover:shadow-primary/20",
        className
      )}
      onClick={onClick}
    >
      {/* Hidden elements for client streaming */}
      <video ref={videoRef} className="hidden" muted playsInline />
      <canvas ref={canvasRef} width={640} height={480} className="hidden" />

      {!error ? (
        <img
          ref={imgRef}
          src={displaySrc}
          onError={() => { if(!isClient && isRunning) setError(true); }}
          className={clsx("w-full h-full object-cover", !isRunning && "opacity-20")}
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
            <span className={clsx("w-2 h-2 rounded-full", isRunning ? "bg-success animate-pulse" : "bg-text-secondary")}></span>
            <span>{name}</span>
          </h3>
          {analytics && isRunning && (
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
