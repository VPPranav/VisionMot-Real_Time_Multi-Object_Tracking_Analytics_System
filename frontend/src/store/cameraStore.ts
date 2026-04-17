import { create } from 'zustand';

export interface CameraConfig {
    camera_id: string;
    name: string;
    source: string;
    model_size: string;
    confidence_threshold: number;
    iou_threshold: number;
    frame_skip: number;
    classes: number[];
    zones: any[];
}

interface CameraState {
    cameras: CameraConfig[];
    setCameras: (cameras: CameraConfig[]) => void;
    addCamera: (camera: CameraConfig) => void;
}

export const useCameraStore = create<CameraState>((set) => ({
    cameras: [],
    setCameras: (cameras) => set({ cameras }),
    addCamera: (camera) => set((state) => ({ cameras: [...state.cameras, camera] })),
}));
