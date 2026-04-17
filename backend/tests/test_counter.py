import pytest
import numpy as np
from analytics.counter import LineCounter
from models.schemas import Track, Zone

def test_line_crossing():
    zone = Zone(id="line1", name="line1", type="counting_line", points=[[0, 100], [100, 100]])
    counter = LineCounter()
    
    tracks_f1 = [Track(track_id=1, class_id=0, bbox=[50, 80, 60, 90], confidence=0.9, age=1, centroid=[55, 85], state="Confirmed", class_name="person", velocity_vector=[0, 0], history=[[55, 85], [55, 85]])]
    tracks_f2 = [Track(track_id=1, class_id=0, bbox=[50, 105, 60, 115], confidence=0.9, age=2, centroid=[55, 110], state="Confirmed", class_name="person", velocity_vector=[0, 25], history=[[55, 85], [55, 110]])]
    
    counter.update(tracks_f1, [zone])
    counter.update(tracks_f2, [zone])
    
    assert "line1" in counter.counts
    assert counter.counts["line1"]["IN"]["pedestrian"] == 1

