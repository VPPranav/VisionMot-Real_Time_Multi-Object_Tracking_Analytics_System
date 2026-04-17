import pytest
from analytics.anomaly_detector import AnomalyDetector
from models.schemas import Track, Zone

def test_anomaly_wrong_way():
    zones = [Zone(id="z1", name="z1", type="flow_zone", points=[[0,0], [100,0], [100,100], [0,100]])]
    detector = AnomalyDetector(camera_id="cam_0")
    
    t = Track(track_id=2, class_id=2, bbox=[10,10,20,20], confidence=0.9, age=1, centroid=[15,15], velocity_vector=[-10, -5], state="Confirmed", class_name="car", history=[[15, 20], [15, 15]])
    alerts = detector.update([t], zones=zones)
    
    assert isinstance(alerts, list)
    assert len(alerts) > 0
    assert alerts[0].alert_type == "WRONG_WAY"

