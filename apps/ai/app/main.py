from fastapi import FastAPI, HTTPException
from .models import SafetyRequest, SafetyResponse, ChatRequest, ChatResponse
from typing import List, Optional
import math

app = FastAPI(title="Smart Tourist Safety AI")

# ... (calculate_distance and other existing code)

@app.post("/chat", response_model=ChatResponse)
def travel_chat(request: ChatRequest):
    msg = request.message.lower()
    
    # Simple rule-based safety advisor
    if "safe" in msg or "safety" in msg:
        return ChatResponse(
            response="Currently, the Himalayan regions are stable. However, always check for sudden weather changes (NH5 is prone to landslides). Do you want me to check the local emergency contacts for your current region?",
            suggestions=["Local SOS numbers", "Weather alert map", "Safe routes"]
        )
    elif "budget" in msg or "money" in msg or "spent" in msg:
        return ChatResponse(
            response="Based on typical trekking costs in this area, you're doing well! Top tip: Local homestays in Spiti offer great value and authentic experiences compared to hotels. Are you looking for meal budget tips?",
            suggestions=["Cheap homestays", "Food cost breakdown", "Transportation hacks"]
        )
    elif "weather" in msg or "rain" in msg or "snow" in msg:
        return ChatResponse(
            response="High altitude regions are expecting light snow tonight. Ensure you have thermal gear if staying above 3,500m. Would you like a point-to-point weather forecast?",
            suggestions=["Forecast for Leh", "Gear checklist", "Road conditions"]
        )
    else:
        return ChatResponse(
            response="I'm your Kavach Safety Assistant. I can help with real-time safety alerts, budget optimization, and Himalayan weather updates. What's on your mind?",
            suggestions=["Safety check", "Budget tips", "Weather update"]
        )

def calculate_distance(lat1, lon1, lat2, lon2):
    # Haversine formula
    R = 6371.0  # Earth radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.asin(math.sqrt(a))
    return R * c

@app.get("/")
def read_root():
    return {"status": "ok", "service": "Smart Tourist Safety AI"}

@app.post("/analyze-safety", response_model=SafetyResponse)
def analyze_safety(request: SafetyRequest):
    if len(request.locations) < 2:
        return SafetyResponse(
            tripId=request.tripId,
            safetyScore=1.0,
            isAnomaly=False,
            reason="Insufficient data for anomaly detection"
        )

    # Sort locations by timestamp
    sorted_locations = sorted(request.locations, key=lambda x: x.timestamp)
    
    anomalies = []
    total_score = 1.0
    
    # Mock Restricted Zones (e.g., sensitive border areas or high-risk landslide zones)
    # Format: (lat, lon, radius_km)
    RESTRICTED_ZONES = [
        (32.45, 77.24, 2.0), # Example: Restricted area near Rohtang
        (31.10, 77.17, 1.5)  # Example: Dangerous cliff area near Shimla
    ]

    for i in range(1, len(sorted_locations)):
        loc1 = sorted_locations[i-1]
        loc2 = sorted_locations[i]
        
        distance = calculate_distance(loc1.latitude, loc1.longitude, loc2.latitude, loc2.longitude)
        time_diff = (loc2.timestamp - loc1.timestamp).total_seconds() / 3600.0  # in hours
        
        # 1. High Speed Anomaly
        if time_diff > 0:
            speed = distance / time_diff
            if speed > 150:
                anomalies.append(f"High speed: {speed:.1f} km/h (Potential vehicle accident or signal spoofing)")
                total_score *= 0.7

        # 2. Stationary Anomaly (Potential injury or getting lost)
        # If moved < 0.05km (50m) in more than 2 hours
        if time_diff > 2.0 and distance < 0.05:
            anomalies.append(f"Stationary for {time_diff:.1f} hours in remote area (Potential emergency)")
            total_score *= 0.5

        # 3. Geofence Anomaly (Restricted/Dangerous zones)
        for r_lat, r_lon, r_radius in RESTRICTED_ZONES:
            dist_to_zone = calculate_distance(loc2.latitude, loc2.longitude, r_lat, r_lon)
            if dist_to_zone < r_radius:
                anomalies.append(f"Entered restricted/dangerous zone: {dist_to_zone:.2f}km from restricted point")
                total_score *= 0.4

    is_anomaly = len(anomalies) > 0
    reason = "; ".join(anomalies) if is_anomaly else "Normal activity detected"

    return SafetyResponse(
        tripId=request.tripId,
        safetyScore=max(0.0, total_score),
        isAnomaly=is_anomaly,
        reason=reason
    )
