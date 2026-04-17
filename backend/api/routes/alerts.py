from fastapi import APIRouter
from typing import List, Optional
from collections import deque
from models.schemas import Alert

router = APIRouter(prefix="/alerts", tags=["alerts"])

# In-memory storage for simplicity
global_alerts = deque(maxlen=10000)

@router.get("", response_model=List[Alert])
def get_alerts(severity: Optional[str] = None, camera_id: Optional[str] = None, limit: int = 100):
    result = []
    for alert in reversed(global_alerts):
        if severity and alert.severity != severity:
            continue
        if camera_id and alert.camera_id != camera_id:
            continue
        result.append(alert)
        if len(result) >= limit:
            break
    return result

@router.post("/{alert_id}/dismiss")
def dismiss_alert(alert_id: str):
    for alert in global_alerts:
        if alert.alert_id == alert_id:
            alert.dismissed = True
            return {"status": "dismissed"}
    return {"status": "not_found"}
