import { useState } from 'react';
import { useCameraConfig } from '../hooks/useCameraConfig';
import { Plus, Trash2, Edit3, Settings, Camera, Cpu, Webcam } from 'lucide-react';
import clsx from 'clsx';

const SOURCE_OPTIONS = [
  { value: 'client', label: '🎥 Browser Webcam (client)', hint: 'Stream from this device\'s camera' },
  { value: '0', label: '💻 Local Device Cam 0', hint: 'Server-side webcam index 0' },
  { value: 'rtsp', label: '📡 RTSP / IP Camera', hint: 'Enter full rtsp:// URL' },
  { value: 'file', label: '🎞  Video File', hint: 'Enter path to video file on server' },
];

type SourceType = 'client' | '0' | 'rtsp' | 'file';

export default function Configuration() {
  const { cameras, addCamera, deleteCamera } = useCameraConfig();
  const [isAdding, setIsAdding] = useState(false);
  const [sourceType, setSourceType] = useState<SourceType>('client');
  const [customSource, setCustomSource] = useState('');
  const [newCam, setNewCam] = useState({
    id: `cam_${Date.now()}`,
    name: '',
  });

  const resolvedSource =
    sourceType === 'client' ? 'client' :
      sourceType === '0' ? '0' :
        customSource.trim();

  const handleAdd = () => {
    if (!resolvedSource) return;
    addCamera.mutate({
      camera_id: newCam.id,
      name: newCam.name.trim() || `Camera ${(cameras?.length ?? 0) + 1}`,
      source: resolvedSource,
      model_size: 'n',            // use nano — fastest, best for Render free tier
      confidence_threshold: 0.45,
      iou_threshold: 0.45,
      frame_skip: 1,
      classes: [0, 2, 3, 5, 7],
      zones: [],
    });
    // Reset form
    setIsAdding(false);
    setSourceType('client');
    setCustomSource('');
    setNewCam({ id: `cam_${Date.now()}`, name: '' });
  };

  const handleDelete = (cameraId: string) => {
    if (window.confirm('Remove this camera?')) {
      deleteCamera?.mutate(cameraId);
    }
  };

  const needsCustomInput = sourceType === 'rtsp' || sourceType === 'file';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Settings size={14} className="text-indigo-400" />
            <span className="text-xs font-semibold text-indigo-400 tracking-widest uppercase">System Config</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">Configuration</h1>
          <p className="text-text-secondary mt-1 text-sm">Manage camera sources, models, and detection settings.</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-all text-sm"
        >
          <Plus size={16} />
          <span>Add Camera</span>
        </button>
      </div>

      {/* ── Render free-tier notice ── */}
      <div className="flex items-start gap-3 bg-amber-500/8 border border-amber-500/20 rounded-xl px-4 py-3 text-sm">
        <span className="text-amber-400 mt-0.5 shrink-0">⚠️</span>
        <p className="text-amber-200/80 leading-relaxed">
          <span className="font-semibold text-amber-300">Render free tier note:</span> Camera configs are stored in{' '}
          <code className="font-mono text-xs bg-white/10 px-1 rounded">cameras.json</code> on the server.
          They reset when Render restarts the service. To make cameras permanent, commit{' '}
          <code className="font-mono text-xs bg-white/10 px-1 rounded">cameras.json</code> with your defaults to GitHub.
          <br />
          <span className="font-semibold text-amber-300">Tip:</span> Use <span className="font-semibold">Browser Webcam</span> source — it streams from your device, so no server camera is needed.
        </p>
      </div>

      {/* Add camera panel */}
      {isAdding && (
        <div className="bg-indigo-500/5 backdrop-blur-md rounded-2xl border border-indigo-500/20 p-6 shadow-[0_0_30px_rgba(99,102,241,0.08)]">
          <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
            <Camera size={18} className="text-indigo-400" />
            New Camera Source
          </h3>
          <p className="text-text-secondary text-xs mb-5">Configure a new camera feed to be tracked by the system.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={newCam.name}
                onChange={(e) => setNewCam({ ...newCam, name: e.target.value })}
                placeholder="e.g. Front Door"
                className="w-full bg-white/5 border border-white/10 focus:border-indigo-500/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-text-secondary/40 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all"
              />
            </div>

            {/* Source type selector */}
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                Source Type
              </label>
              <select
                value={sourceType}
                onChange={(e) => setSourceType(e.target.value as SourceType)}
                className="w-full bg-surface border border-white/10 focus:border-indigo-500/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all"
              >
                {SOURCE_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <p className="text-text-secondary/60 text-xs mt-1.5 pl-1">
                {SOURCE_OPTIONS.find(o => o.value === sourceType)?.hint}
              </p>
            </div>

            {/* Custom source input (only for rtsp/file) */}
            {needsCustomInput && (
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                  {sourceType === 'rtsp' ? 'RTSP URL' : 'File Path'}
                </label>
                <input
                  type="text"
                  value={customSource}
                  onChange={(e) => setCustomSource(e.target.value)}
                  placeholder={sourceType === 'rtsp' ? 'rtsp://user:pass@192.168.1.x:554/stream' : '/path/to/video.mp4'}
                  className="w-full bg-white/5 border border-white/10 focus:border-indigo-500/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-text-secondary/40 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all font-mono"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-5 pt-5 border-t border-white/8">
            <button
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 text-text-secondary hover:text-white text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={needsCustomInput && !customSource.trim()}
              className={clsx(
                "px-6 py-2 rounded-xl font-semibold text-sm shadow-lg transition-all text-white",
                needsCustomInput && !customSource.trim()
                  ? "bg-indigo-600/40 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-500"
              )}
            >
              Save Camera
            </button>
          </div>
        </div>
      )}

      {/* Camera list */}
      <div className="space-y-3">
        {cameras?.map((cam) => (
          <div
            key={cam.camera_id}
            className="group bg-white/[0.02] hover:bg-white/[0.04] backdrop-blur-md rounded-2xl border border-white/8 hover:border-indigo-500/20 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300"
          >
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-12 h-12 bg-indigo-500/10 rounded-xl border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-black text-lg group-hover:bg-indigo-500/15 transition-colors">
                  {cam.source === 'client' ? '🎥' : cam.name.charAt(0).toUpperCase()}
                </div>
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-background" />
              </div>

              <div>
                <h4 className="text-base font-bold text-white">{cam.name}</h4>
                <p className="text-text-secondary font-mono text-xs mt-0.5">
                  {cam.source === 'client' ? 'Browser Webcam (client)' : cam.source}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/8 text-xs text-text-secondary px-2.5 py-1 rounded-lg">
                    <Cpu size={11} />
                    YOLOv8{cam.model_size}
                  </span>
                  <span className="inline-flex items-center gap-1 bg-white/5 border border-white/8 text-xs text-text-secondary px-2.5 py-1 rounded-lg">
                    Conf: <span className="text-white font-semibold ml-0.5">{cam.confidence_threshold}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 bg-white/5 border border-white/8 text-xs text-text-secondary px-2.5 py-1 rounded-lg">
                    Classes: <span className="text-white font-semibold ml-0.5">{cam.classes.length}</span>
                  </span>
                  {cam.source === 'client' && (
                    <span className="inline-flex items-center gap-1.5 bg-indigo-500/8 border border-indigo-500/15 text-xs text-indigo-400 px-2.5 py-1 rounded-lg">
                      Browser Stream
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 md:shrink-0">
              <button
                onClick={() => handleDelete(cam.camera_id)}
                className="p-2.5 text-text-secondary hover:text-red-400 hover:bg-red-500/10 rounded-xl border border-transparent hover:border-red-500/20 transition-all"
                title="Remove camera"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}

        {cameras?.length === 0 && !isAdding && (
          <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl bg-white/2">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-4">
              <Camera size={24} className="text-indigo-400" />
            </div>
            <p className="text-white font-semibold mb-1">No cameras configured</p>
            <p className="text-text-secondary text-sm mb-5">Add a camera source to get started.</p>
            <button
              onClick={() => setIsAdding(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-xl text-sm font-semibold transition-all"
            >
              <Plus size={15} />
              Add Camera
            </button>
          </div>
        )}
      </div>
    </div>
  );
}