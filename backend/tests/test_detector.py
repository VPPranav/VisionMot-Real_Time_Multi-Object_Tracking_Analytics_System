def test_detector_initialization():
    from core.detector import Detector
    detector = Detector()
    assert detector is not None

def test_detector_model_names():
    from core.detector import Detector
    detector = Detector()
    names = detector.model.names
    assert len(names) > 0
    assert names[0] == "person"
