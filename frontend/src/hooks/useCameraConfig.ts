import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { CameraConfig, useCameraStore } from '../store/cameraStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export function useCameraConfig() {
    const queryClient = useQueryClient();
    const setCameras = useCameraStore(state => state.setCameras);

    const { data: cameras, isLoading } = useQuery({
        queryKey: ['cameras'],
        queryFn: async () => {
            const { data } = await axios.get<CameraConfig[]>(`${API_URL}/cameras`);
            setCameras(data);
            return data;
        }
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

    return { cameras, isLoading, updateCamera, addCamera };
}
