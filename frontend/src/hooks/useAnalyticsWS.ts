import { useEffect, useRef } from 'react';
import { useAnalyticsStore, AnalyticsMessage } from '../store/analyticsStore';
import { WS_BASE_URL } from '../utils/api';

export function useAnalyticsWS(cameraId: string) {
    const ws = useRef<WebSocket | null>(null);
    const updateData = useAnalyticsStore((state) => state.updateData);

    useEffect(() => {
        if (!cameraId) return;

        let reconnectTimeout: ReturnType<typeof setTimeout>;
        let backoff = 1000;

        const connect = () => {
            const wsUrl = `${WS_BASE_URL}/ws/analytics/${cameraId}`;
            
            ws.current = new WebSocket(wsUrl);

            ws.current.onmessage = (event) => {
                try {
                    const message: AnalyticsMessage = JSON.parse(event.data);
                    if (message && message.type === 'analytics') {
                        updateData(cameraId, message);
                    }
                } catch (e) {
                    console.error("Failed to parse analytics message", e);
                }
            };

            ws.current.onclose = () => {
                backoff = Math.min(backoff * 2, 30000);
                reconnectTimeout = setTimeout(connect, backoff);
            };
        };

        connect();

        return () => {
            clearTimeout(reconnectTimeout);
            if (ws.current) {
                ws.current.onclose = null;
                ws.current.close();
            }
        };
    }, [cameraId, updateData]);
}
