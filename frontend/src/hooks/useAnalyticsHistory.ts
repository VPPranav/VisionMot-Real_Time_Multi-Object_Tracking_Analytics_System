import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '../utils/api';

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
