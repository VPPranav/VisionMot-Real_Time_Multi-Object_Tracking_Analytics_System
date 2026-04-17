import cv2
import numpy as np
from typing import List
from models.schemas import Track, Zone, CameraConfig

class Annotator:
    @staticmethod
    def draw(frame: np.ndarray, tracks: List[Track], zones: List[Zone], fps: float, active_tracks: int):
        # Draw zones and lines
        for zone in zones:
            pts = np.array(zone.points, np.int32)
            if zone.type == "counting_line":
                cv2.polylines(frame, [pts], False, (0, 255, 255), 2)
                # optionally draw arrow or direction
            else:
                pts = pts.reshape((-1, 1, 2))
                overlay = frame.copy()
                color = (255, 0, 0)
                if zone.type == "loiter_zone":
                    color = (0, 165, 255)
                elif zone.type == "density_zone":
                    color = (0, 0, 255)
                cv2.fillPoly(overlay, [pts], color)
                cv2.addWeighted(overlay, 0.3, frame, 0.7, 0, frame)
                cv2.polylines(frame, [pts], True, color, 2)
        
        # Draw tracks
        for t in tracks:
            if t.state != "Confirmed":
                continue
                
            x1, y1, x2, y2 = map(int, t.bbox)
            # Track Color (Pseudo-random based on id)
            color = ((t.class_id * 50) % 255, (t.class_id * 80 + t.track_id * 20) % 255, (t.track_id * 60) % 255)
            
            # Box
            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
            
            # Label
            label = f"ID:{t.track_id} {t.class_name} {t.confidence:.2f}"
            (w, h), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 1)
            cv2.rectangle(frame, (x1, y1 - 20), (x1 + w, y1), color, -1)
            cv2.putText(frame, label, (x1, y1 - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
            
            # Trail
            if len(t.history) > 1:
                hist_pts = np.array(t.history, np.int32).reshape((-1, 1, 2))
                cv2.polylines(frame, [hist_pts], False, color, 2)
                
            # Velocity arrow
            if sum(abs(v) for v in t.velocity_vector) > 1:
                cx, cy = map(int, t.centroid)
                vx, vy = t.velocity_vector
                cv2.arrowedLine(frame, (cx, cy), (int(cx + vx * 2), int(cy + vy * 2)), (0, 255, 255), 2)
                
        # HUD Overlay
        cv2.putText(frame, f"FPS: {fps:.1f}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        cv2.putText(frame, f"Tracks: {active_tracks}", (10, 70), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        
        return frame
