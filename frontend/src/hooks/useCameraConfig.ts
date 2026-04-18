import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { CameraConfig, useCameraStore } from '../store/cameraStore';
import { API_URL } from '../utils/api';

export function useCameraConfig() {
    const queryClient = useQueryClient();
    const setCameras = useCameraStore(state => state.setCameras);

    const { data: cameras, isLoading, isError, error } = useQuery({
        queryKey: ['cameras'],
        queryFn: async () => {
            const { data } = await axios.get<CameraConfig[]>(`${API_URL}/cameras`);
            setCameras(data);
            return data;
        },
        retry: 3,
        retryDelay: (attempt) => Math.min(1000 * (attempt + 1), 5000),
    });

    const updateCamera = useMutation({
        mutationFn: async ({ id, config }: { id: string, config: Partial<CameraConfig> }) => {
            const { data } = await axios.patch(`${API_URL}/cameras/${id}/config`, config);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cameras'] });
        }
    });

    const addCamera = useMutation({
        mutationFn: async (config: CameraConfig) => {
            const { data } = await axios.post(`${API_URL}/cameras`, config);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cameras'] });
        }
    });

    return { cameras, isLoading, isError, error, updateCamera, addCamera };
}
