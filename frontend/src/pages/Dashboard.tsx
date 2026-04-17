import { useState } from 'react';
import VideoFeed from '../components/video/VideoFeed';
import { useCameraStore } from '../store/cameraStore';
import { LayoutGrid, Maximize2, Columns } from 'lucide-react';
import clsx from 'clsx';

interface DashboardProps {
  onSelectCamera: (id: string) => void;
}

export default function Dashboard({ onSelectCamera }: DashboardProps) {
  const cameras = useCameraStore(state => state.cameras);
  const [layout, setLayout] = useState<1 | 2 | 4>(2);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Dashboard</h1>
          <p className="text-text-secondary mt-1">Real-time monitoring across all active camera feeds.</p>
        </div>
        
        <div className="flex bg-surface-elevated rounded-lg p-1 border border-border">
          <button 
            onClick={() => setLayout(1)} 
            className={clsx("p-2 rounded transition-colors hidden md:block", layout === 1 ? 'bg-primary text-white' : 'text-text-secondary hover:text-white')}
          >
            <Maximize2 size={18} />
          </button>
          <button 
            onClick={() => setLayout(2)} 
            className={clsx("p-2 rounded transition-colors", layout === 2 ? 'bg-primary text-white' : 'text-text-secondary hover:text-white')}
          >
            <Columns size={18} />
          </button>
          <button 
            onClick={() => setLayout(4)} 
            className={clsx("p-2 rounded transition-colors hidden sm:block", layout === 4 ? 'bg-primary text-white' : 'text-text-secondary hover:text-white')}
          >
            <LayoutGrid size={18} />
          </button>
        </div>
      </div>

      {cameras.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-2xl bg-surface/50 backdrop-blur-sm shadow-glass">
          <p className="text-text-secondary text-lg">No cameras configured.</p>
          <p className="text-text-secondary text-sm mt-2">Go to Configuration to add a camera source.</p>
        </div>
      ) : (
        <div className={clsx(
          "grid gap-4",
          layout === 1 ? "grid-cols-1" :
          layout === 2 ? "grid-cols-1 lg:grid-cols-2" :
          "grid-cols-1 md:grid-cols-2 xl:grid-cols-4"
        )}>
          {cameras.map(cam => (
            <div key={cam.camera_id} className="flex flex-col h-full">
              <VideoFeed 
                cameraId={cam.camera_id} 
                name={cam.name} 
                onClick={() => onSelectCamera(cam.camera_id)}
                className={clsx(
                  layout === 1 ? "h-[60vh]" :
                  layout === 2 ? "h-[45vh]" :
                  "h-[30vh]"
                )}
              />
              <div className="flex justify-between items-center mt-3">
                 <div className="flex space-x-2">
                    <button 
                       onClick={() => fetch(`http://localhost:8000/cameras/${cam.camera_id}/start`, { method: 'POST' })} 
                       className="px-3 py-1 bg-success/20 hover:bg-success/30 text-success text-sm rounded-lg border border-success/30 transition-colors cursor-pointer shadow-glass"
                    >
                       Start Feed
                    </button>
                    <button 
                       onClick={() => fetch(`http://localhost:8000/cameras/${cam.camera_id}/stop`, { method: 'POST' })} 
                       className="px-3 py-1 bg-critical/20 hover:bg-critical/30 text-critical text-sm rounded-lg border border-critical/30 transition-colors cursor-pointer shadow-glass"
                    >
                       Stop Feed
                    </button>
                 </div>
                 <div className="bg-surface/50 backdrop-blur-md px-3 py-1.5 rounded-xl border border-border text-sm shadow-sm transition-all hover:border-primary/50 cursor-pointer">
                    <span onClick={() => onSelectCamera(cam.camera_id)} className="text-text-secondary hover:text-white">Detailed Analytics &rarr;</span>
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
