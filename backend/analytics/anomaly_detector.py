import numpy as np
import time
from typing import List, Dict, Optional
import cv2
from models.schemas import Track, Zone, Alert

class AnomalyDetector:
    def __init__(self, camera_id: str):
        self.camera_id = camera_id
        # track_id -> entry_time inside loiter zone
        self.loiter_entry_times: Dict[int, float] = {}
        # Avoid spamming alerts: alert_hash -> last_time
        self.last_alert_times: Dict[str, float] = {}
        
    def _fire_alert(self, alert_type: str, severity: str, desc: str, track: Optional[Track], zone_id: Optional[str] = None) -> Optional[Alert]:
        import uuid
        now = time.time()
        
        # Deduplication
        hash_key = f"{alert_type}_{track.track_id if track else 'none'}"
        if hash_key in self.last_alert_times and now - self.last_alert_times[hash_key] < 10.0:
            return None
            
        self.last_alert_times[hash_key] = now
        
        from datetime import datetime, timezone
        return Alert(
            alert_id=str(uuid.uuid4()),
            camera_id=self.camera_id,
            timestamp=datetime.now(timezone.utc).isoformat(),
            severity=severity,
            alert_type=alert_type,
            track_id=track.track_id if track else None,
            class_id=track.class_id if track else None,
            class_name=track.class_name if track else None,
            zone_id=zone_id,
            description=desc,
            bbox=track.bbox if track else None
        )
        
    def _is_inside_polygon(self, pt: List[float], points: List[List[float]]) -> bool:
        pts = np.array(points, np.int32)
        return cv2.pointPolygonTest(pts, (pt[0], pt[1]), False) >= 0

    def update(self, tracks: List[Track], zones: List[Zone]) -> List[Alert]:
        alerts = []
        now = time.time()
        
        # Setup density map
        density_counts = {z.id: 0 for z in zones if z.type == "density_zone"}
        
        for t in tracks:
            if t.state != "Confirmed":
                continue
                
            # 1. Sudden Stop
            if len(t.history) >= 4:
                old_v = t.history[-4]
                mid_v = t.history[-2]
                curr_v = t.centroid
                v_old = np.linalg.norm(np.array(mid_v) - np.array(old_v))
                v_curr = np.linalg.norm(np.array(curr_v) - np.array(mid_v))
                if v_old > 5.0 and v_curr < 1.0:
                    alert = self._fire_alert("SUDDEN_STOP", "INFO", f"{t.class_name} suddenly stopped", t)
                    if alert: alerts.append(alert)
                    
            in_loiter_zone = False
            for z in zones:
                if len(z.points) < 3:
                    continue
                    
                is_inside = self._is_inside_polygon(t.centroid, z.points)
                
                # 2. Crowd/Traffic Density
                if z.type == "density_zone" and is_inside:
                    density_counts[z.id] += 1
                    
                # 3. Loitering
                if z.type == "loiter_zone" and is_inside:
                    in_loiter_zone = True
                    if t.track_id not in self.loiter_entry_times:
                        self.loiter_entry_times[t.track_id] = now
                    else:
                        duration = now - self.loiter_entry_times[t.track_id]
                        threshold = z.threshold if z.threshold else 30.0
                        if duration > threshold:
                            alert = self._fire_alert("LOITERING", "WARNING", f"{t.class_name} loitering for {int(duration)}s", t, z.id)
                            if alert: alerts.append(alert)
                            self.loiter_entry_times[t.track_id] = now
                            
                # 4. Wrong Way (for vehicles and persons)
                if z.type == "flow_zone" and is_inside:
                    vx, vy = t.velocity_vector
                    # Assume positive Y is correct direction for now (downwards)
                    if vy < -2.0:
                        alert = self._fire_alert("WRONG_WAY", "CRITICAL", f"{t.class_name} traveling wrong way!", t, z.id)
                        if alert: alerts.append(alert)

            if not in_loiter_zone and t.track_id in self.loiter_entry_times:
                del self.loiter_entry_times[t.track_id]

        # Process density
        for z in zones:
            if z.type == "density_zone":
                count = density_counts.get(z.id, 0)
                thresh = z.threshold if z.threshold else 20
                if count > thresh:
                    alert = self._fire_alert("HIGH_DENSITY", "WARNING", f"High density spike: {count} objects", None, z.id)
                    if alert: alerts.append(alert)
                    
        return alerts
