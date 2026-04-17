import { create } from 'zustand';

export interface Alert {
    alert_id: string;
    camera_id: string;
    timestamp: string;
    severity: "CRITICAL" | "WARNING" | "INFO";
    alert_type: string;
    track_id?: number | null;
    class_id?: number | null;
    class_name?: string | null;
    zone_id?: string | null;
    description: string;
    bbox?: number[] | null;
    dismissed: boolean;
}

interface AlertState {
    alerts: Alert[];
    addAlert: (alert: Alert) => void;
    dismissAlert: (id: string) => void;
    clearAlerts: () => void;
}

export const useAlertStore = create<AlertState>((set) => ({
    alerts: [],
    addAlert: (alert) => set((state) => ({ alerts: [alert, ...state.alerts].slice(0, 100) })), // Keep latest 100 in memory
    dismissAlert: (id) => set((state) => ({
        alerts: state.alerts.map(a => a.alert_id === id ? { ...a, dismissed: true } : a)
    })),
    clearAlerts: () => set({ alerts: [] }),
}));
