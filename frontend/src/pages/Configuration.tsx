import { useState } from 'react';
import { useCameraConfig } from '../hooks/useCameraConfig';
import { Plus, Trash2, Edit3, Settings } from 'lucide-react';

export default function Configuration() {
  const { cameras, addCamera, updateCamera } = useCameraConfig();
  const [isAdding, setIsAdding] = useState(false);
  const [newCam, setNewCam] = useState({ id: `cam_${Date.now()}`, name: '', source: '0' });

  const handleAdd = () => {
    addCamera.mutate({
      camera_id: newCam.id,
      name: newCam.name || `Camera ${cameras?.length || 0 + 1}`,
      source: newCam.source,
      model_size: 's',
      confidence_threshold: 0.55,
      iou_threshold: 0.45,
      frame_skip: 1,
      classes: [0, 2, 3, 5, 7],
      zones: []
    });
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuration</h1>
          <p className="text-text-secondary mt-1">Manage camera sources, models, and zone settings.</p>
        </div>
        <button 
           onClick={() => setIsAdding(true)}
           className="flex items-center space-x-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg shadow-lg shadow-primary/20 transition-all"
        >
          <Plus size={18} />
          <span>Add Camera</span>
        </button>
      </div>

      {isAdding && (
        <div className="bg-surface/80 backdrop-blur-md rounded-xl border border-primary/50 p-6 shadow-glass slide-in-from-top animate-in z-10 relative">
           <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
              <Settings size={20} className="text-primary"/> 
              <span>New Camera Source</span>
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                 <label className="block text-sm font-medium text-text-secondary mb-1">Display Name</label>
                 <input 
                    type="text" 
                    value={newCam.name}
                    onChange={(e) => setNewCam({...newCam, name: e.target.value})}
                    placeholder="e.g. Main Intersection"
                    className="w-full bg-surface border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary text-text-primary"
                 />
              </div>
              <div>
                 <label className="block text-sm font-medium text-text-secondary mb-1">Source (Webcam ID or RTSP URL)</label>
                 <input 
                    type="text" 
                    value={newCam.source}
                    onChange={(e) => setNewCam({...newCam, source: e.target.value})}
                    placeholder="e.g. 0 or rtsp://..."
                    className="w-full bg-surface border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary text-text-primary"
                 />
              </div>
           </div>
           <div className="flex justify-end space-x-3 mt-6">
              <button 
                 onClick={() => setIsAdding(false)}
                 className="px-4 py-2 text-text-secondary hover:text-text-primary"
              >
                Cancel
              </button>
              <button 
                 onClick={handleAdd}
                 className="px-6 py-2 bg-primary text-white rounded-lg font-medium shadow-md"
              >
                Save Camera
              </button>
           </div>
        </div>
      )}

      <div className="space-y-4">
        {cameras?.map((cam) => (
          <div key={cam.camera_id} className="bg-surface/70 backdrop-blur-md rounded-xl border border-border/50 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-glass hover:border-primary/30 transition-all group">
             <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl border border-primary/20 flex items-center justify-center text-primary font-bold">
                   {cam.name.charAt(0)}
                </div>
                <div>
                   <h4 className="text-lg font-bold">{cam.name}</h4>
                   <p className="text-text-secondary font-mono text-sm mt-1">{cam.source} • YOLOv8{cam.model_size}</p>
                   <div className="flex space-x-3 mt-3 text-xs">
                      <span className="bg-surface-elevated px-2 py-1 rounded">Conf: {cam.confidence_threshold}</span>
                      <span className="bg-surface-elevated px-2 py-1 rounded">Classes: {cam.classes.length}</span>
                      <span className="bg-surface-elevated px-2 py-1 rounded flex items-center"><div className="w-1.5 h-1.5 bg-success rounded-full mr-1"></div>Active</span>
                   </div>
                </div>
             </div>
             
             <div className="flex items-center space-x-2">
               <button className="p-2 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                 <Edit3 size={18} />
               </button>
               {/* Note: Delete API might exist but not implemented in useCameraConfig yet */}
               <button className="p-2 text-text-secondary hover:text-critical hover:bg-critical/10 rounded-lg transition-colors">
                 <Trash2 size={18} />
               </button>
             </div>
          </div>
        ))}
        {cameras?.length === 0 && !isAdding && (
          <div className="text-center p-8 text-text-secondary border border-dashed border-border rounded-xl">
             No cameras available. Add one to get started.
          </div>
        )}
      </div>
    </div>
  );
}
