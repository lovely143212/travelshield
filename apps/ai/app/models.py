from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class LocationData(BaseModel):
    latitude: float
    longitude: float
    altitude: Optional[float] = None
    timestamp: datetime

class SafetyRequest(BaseModel):
    tripId: str
    locations: List[LocationData]

class SafetyResponse(BaseModel):
    tripId: str
    safetyScore: float  # 0.0 to 1.0
    isAnomaly: bool
    reason: Optional[str] = None

class ChatRequest(BaseModel):
    message: str
    context: Optional[dict] = None

class ChatResponse(BaseModel):
    response: str
    suggestions: List[str] = []
