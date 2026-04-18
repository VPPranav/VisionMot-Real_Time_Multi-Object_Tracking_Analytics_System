import { useEffect, useRef, useState, useCallback } from 'react';
import { useAnalyticsStore } from '../../store/analyticsStore';
import { useCameraStore } from '../../store/cameraStore';
import { AlertTriangle, Activity, WifiOff } from 'lucide-react';
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
  const frameIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [error, setError] = useState(false);
  const [wsFrame, setWsFrame] = useState<string>('');
  const [wsConnected, setWsConnected] = useState(false);
  const [streamError, setStreamError] = useState(false);

  useAnalyticsWS(cameraId);
  const analytics = useAnalyticsStore(state => state.data[cameraId]);
  const cameraConfig = useCameraStore(state => state.cameras.find(c => c.camera_id === cameraId));

  const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const API_URL = rawApiUrl.replace(/\/$/, '');
  const streamUrl = `${API_URL}/stream/${cameraId}`;
  // Always use wss:// for deployed (https) backend, ws:// for localhost
  const WS_URL = API_URL.replace(/^https/, 'wss').replace(/^http/, 'ws') + `/ws/client-stream/${cameraId}`;

  const isClient = cameraConfig?.source === 'client';

  useEffect(() => {
    setError(false);
    setStreamError(false);
  }, [cameraId]);

  const stopStreaming = useCallback(() => {
    if (frameIntervalRef.current) {
      clearInterval(frameIntervalRef.current);
      frameIntervalRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.onclose = null; // Prevent reconnect loop on intentional stop
      wsRef.current.close();
      wsRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setWsConnected(false);
    setWsFrame('');
  }, []);

  // Handle client-side webcam streaming
  useEffect(() => {
    if (!isClient || !isRunning) {
      stopStreaming();
      return;
    }

    let destroyed = false;

    const startStreaming = () => {
      if (destroyed) return;

      navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 }, audio: false })
        .then(mediaStream => {
          if (destroyed) {
            mediaStream.getTracks().forEach(t => t.stop());
            return;
          }

          streamRef.current = mediaStream;
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
            videoRef.current.play().catch(() => { });
          }

          const ws = new WebSocket(WS_URL);
          wsRef.current = ws;

          ws.onopen = () => {
            if (destroyed) { ws.close(); return; }
            setWsConnected(true);
            setStreamError(false);
            console.log('[VideoFeed] WS connected:', WS_URL);

            frameIntervalRef.current = setInterval(() => {
              if (
                videoRef.current &&
                canvasRef.current &&
                ws.readyState === WebSocket.OPEN
              ) {
                const ctx = canvasRef.current.getContext('2d');
                if (ctx) {
                  ctx.drawImage(videoRef.current, 0, 0, 640, 480);
                  const dataURL = canvasRef.current.toDataURL('image/jpeg', 0.6);
                  ws.send(dataURL);
                }
              }
            }, 100); // 10 FPS upload
          };

          ws.onmessage = (event) => {
            if (typeof event.data === 'string' && event.data.startsWith('data:image')) {
              setWsFrame(event.data);
            }
          };

          ws.onerror = (err) => {
            console.error('[VideoFeed] WS error:', err);
          };

          ws.onclose = () => {
            if (destroyed) return;
            console.warn('[VideoFeed] WS closed, reconnecting in 3s...');
            setWsConnected(false);
            if (frameIntervalRef.current) {
              clearInterval(frameIntervalRef.current);
              frameIntervalRef.current = null;
            }
            // Reconnect after delay
            reconnectTimeoutRef.current = setTimeout(startStreaming, 3000);
          };
        })
        .catch(err => {
          console.error('[VideoFeed] Webcam error:', err);
          setStreamError(true);
        });
    };

    startStreaming();

    return () => {
      destroyed = true;
      stopStreaming();
    };
  }, [isClient, isRunning, WS_URL, stopStreaming]);

  // ---- Render logic ----
  // For MJPEG streams (non-client), show img tag pointing to /stream/{id}
  // For client streams, show the annotated frame received from WS (base64 data URL)

  const showClientFeed = isClient && isRunning;
  const showMjpegFeed = !isClient && isRunning;

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

      {/* Client webcam: show annotated frame from WS */}
      {showClientFeed && !streamError && (
        <>
          {wsFrame ? (
            <img
              src={wsFrame}
              className="w-full h-full object-cover"
              alt={`Stream ${name}`}
            />
          ) : (
            // While connecting / waiting for first frame
            <div className="w-full h-full flex flex-col items-center justify-center text-text-secondary bg-surface min-h-[200px]">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-sm">{wsConnected ? 'Waiting for frame…' : 'Connecting…'}</p>
              </div>
            </div>
          )}
        </>
      )}

      {/* Client webcam error (permission denied, etc) */}
      {showClientFeed && streamError && (
        <div className="w-full h-full flex flex-col items-center justify-center text-text-secondary bg-surface min-h-[200px]">
          <AlertTriangle size={32} className="mb-2 text-warning" />
          <p className="text-sm">Camera access denied</p>
          <p className="text-xs mt-1 opacity-60">Check browser permissions</p>
        </div>
      )}

      {/* MJPEG stream */}
      {showMjpegFeed && (
        <img
          ref={imgRef}
          src={streamUrl}
          onError={() => setError(true)}
          className="w-full h-full object-cover"
          alt={`Stream ${name}`}
        />
      )}

      {/* MJPEG stream error */}
      {showMjpegFeed && error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-text-secondary bg-surface">
          <WifiOff size={32} className="mb-2 text-warning" />
          <p>Stream Offline</p>
        </div>
      )}

      {/* Stopped / not running placeholder */}
      {!isRunning && (
        <div className="w-full h-full flex flex-col items-center justify-center bg-black/80 min-h-[200px]">
          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center mb-2">
            <span className="w-2 h-2 rounded-full bg-white/20" />
          </div>
          <p className="text-white/30 text-xs tracking-wide">Feed stopped</p>
        </div>
      )}

      {/* Overlay: name + analytics */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div>
          <h3 className="text-white font-semibold flex items-center space-x-2">
            <span className={clsx("w-2 h-2 rounded-full", isRunning ? "bg-success animate-pulse" : "bg-text-secondary")} />
            <span>{name}</span>
          </h3>
          {analytics && isRunning && (
            <div className="flex items-center space-x-3 mt-2 text-xs font-mono text-white/80">
              <span className="flex items-center space-x-1 bg-surface-elevated/80 px-2 py-1 rounded backdrop-blur border border-white/10">
                <Activity size={12} />
                <span>{analytics.fps?.toFixed(1) ?? '0.0'} FPS</span>
              </span>
              <span className="bg-surface-elevated/80 px-2 py-1 rounded backdrop-blur border border-white/10">
                Tracks: {analytics.active_tracks ?? 0}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}