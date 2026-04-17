import { useEffect, useRef } from 'react';
import { useAlertStore, Alert } from '../store/alertStore';

export function useAlerts() {
    const ws = useRef<WebSocket | null>(null);
    const addAlert = useAlertStore((state) => state.addAlert);

    useEffect(() => {
        let reconnectTimeout: ReturnType<typeof setTimeout>;
        let backoff = 1000;

        const connect = () => {
            const url = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            const wsUrl = url.replace(/^http/, 'ws') + `/ws/alerts`;
            
            ws.current = new WebSocket(wsUrl);

            ws.current.onmessage = (event) => {
                try {
                    const message: Alert = JSON.parse(event.data);
                    if (message && message.alert_id) {
                        addAlert(message);
                    }
                } catch (e) {
                    console.error("Failed to parse alert message", e);
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
    }, [addAlert]);
}
