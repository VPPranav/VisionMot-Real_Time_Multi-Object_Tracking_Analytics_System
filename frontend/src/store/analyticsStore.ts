import { create } from 'zustand';

export interface AnalyticsMessage {
    type: "analytics";
    camera_id: string;
    timestamp: string;
    fps: number;
    frame_idx: number;
    active_tracks: number;
    class_counts: Record<string, number>;
    crossing_counts: {
        IN: { vehicle: number; pedestrian: number };
        OUT: { vehicle: number; pedestrian: number };
    };
    density_score: number;
    zone_stats: any[];
    velocity_avg: number;
}

interface AnalyticsState {
    data: Record<string, AnalyticsMessage>;
    updateData: (camera_id: string, message: AnalyticsMessage) => void;
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
    data: {},
    updateData: (camera_id, message) => set((state) => ({
        data: { ...state.data, [camera_id]: message }
    })),
}));
