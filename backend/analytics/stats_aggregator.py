from typing import List, Dict
import numpy as np
from models.schemas import Track
from datetime import datetime, timezone
from collections import deque

class StatsAggregator:
    def __init__(self, history_len: int = 3600): # Default 1 hour at 1Hz
        self.history = deque(maxlen=history_len)
        
    def aggregate(self, tracks: List[Track]) -> Dict:
        class_counts = {}
        active_tracks = 0
        total_velocity = 0.0
        vehicle_count = 0
        
        for t in tracks:
            if t.state == "Confirmed":
                active_tracks += 1
                class_counts[t.class_name] = class_counts.get(t.class_name, 0) + 1
                
                if t.class_id != 0: # Vehicle
                    v_mag = np.linalg.norm(t.velocity_vector)
                    total_velocity += v_mag
                    vehicle_count += 1
                    
        stats = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "active_tracks": active_tracks,
            "class_counts": class_counts,
            "velocity_avg": total_velocity / vehicle_count if vehicle_count > 0 else 0.0,
            "density_score": class_counts.get("person", 0) / 100.0 # simple normalized score
        }
        
        self.history.append(stats)
        return stats
