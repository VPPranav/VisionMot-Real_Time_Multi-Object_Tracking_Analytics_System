import numpy as np
from typing import List, Dict
from models.schemas import Track, Zone

def ccw(A, B, C):
    return (C[1]-A[1]) * (B[0]-A[0]) > (B[1]-A[1]) * (C[0]-A[0])

def intersect(A, B, C, D):
    return ccw(A, C, D) != ccw(B, C, D) and ccw(A, B, C) != ccw(A, B, D)

class LineCounter:
    def __init__(self):
        # track_id -> {zone_id -> has_crossed}
        self.crossed_tracks: Dict[int, set] = {}
        # zone_id -> {"IN": {"vehicle": 0, "pedestrian": 0}, "OUT": {"vehicle": 0, "pedestrian": 0}}
        self.counts: Dict[str, Dict[str, Dict[str, int]]] = {}
    
    def _init_zone_counts(self, zone_id: str):
        if zone_id not in self.counts:
            self.counts[zone_id] = {
                "IN": {"vehicle": 0, "pedestrian": 0},
                "OUT": {"vehicle": 0, "pedestrian": 0}
            }
            
    def update(self, tracks: List[Track], zones: List[Zone]):
        for zone in zones:
            if zone.type != "counting_line" or len(zone.points) < 2:
                continue
                
            self._init_zone_counts(zone.id)
            line_a = np.array(zone.points[0])
            line_b = np.array(zone.points[1])
            
            for t in tracks:
                if t.state != "Confirmed" or len(t.history) < 2:
                    continue
                    
                if t.track_id not in self.crossed_tracks:
                    self.crossed_tracks[t.track_id] = set()
                    
                if zone.id in self.crossed_tracks[t.track_id]:
                    continue
                    
                p1 = np.array(t.history[-2])
                p2 = np.array(t.centroid)
                
                if intersect(line_a, line_b, p1, p2):
                    self.crossed_tracks[t.track_id].add(zone.id)
                    
                    # Determine direction using cross product
                    cp = np.cross(line_b - line_a, p2 - line_a)
                    direction = "IN" if cp > 0 else "OUT"
                    
                    # Depending on how the user draws the line, direction could be arbitrary.
                    # We can use zone.direction to normalize if provided. We assume cp > 0 means IN.
                    
                    class_type = "pedestrian" if t.class_id == 0 else "vehicle"
                    self.counts[zone.id][direction][class_type] += 1
