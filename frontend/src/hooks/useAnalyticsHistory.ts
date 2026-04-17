import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export function useAnalyticsHistory(cameraId: string, window: string = '60s') {
  return useQuery({
    queryKey: ['analytics-history', cameraId, window],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/analytics/${cameraId}/history?window=${window}`);
      return response.data;
    },
    enabled: !!cameraId,
    refetchInterval: 5000, // Refetch every 5 seconds
  });
}
