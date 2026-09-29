"""
AURIS Flight Controller - Autonomous Mission Keyframe Sequencer
Calculates and applies realistic hexacopter flight trajectory, pitch, roll, and hover.
"""

import bpy
import math
from ..config import TIMELINE, SCENARIO_COORDINATES

def animate_drone_mission(drone_root):
    """Bakes the complete 9-phase flight mission keyframes into the drone root object."""
    coords = SCENARIO_COORDINATES
    
    drone_root.animation_data_clear()
    
    # helper for clean keyframing
    def set_kf(frame, loc, rot_deg=(0,0,0)):
        drone_root.location = loc
        drone_root.rotation_euler = (
            math.radians(rot_deg[0]),
            math.radians(rot_deg[1]),
            math.radians(rot_deg[2])
        )
        drone_root.keyframe_insert(data_path="location", frame=frame)
        drone_root.keyframe_insert(data_path="rotation_euler", frame=frame)

    # 1. SCENE 1 (Frames 1 - 240): Takeoff & Transit
    set_kf(1, (0.0, -40.0, 0.4), (0, 0, 0))              # On ground
    set_kf(80, (0.0, -40.0, 6.5), (4, 0, 0))             # Takeoff vertical climb
    set_kf(240, (0.0, -18.0, 8.0), (8, 0, 0))            # Pitch forward transit

    # 2. SCENE 2 (Frames 241 - 600): Multimodal Sector Search
    set_kf(350, (5.0, -5.0, 7.5), (6, -4, -25))          # Search curve right
    set_kf(480, (8.0, 0.0, 6.8), (4, 2, -15))            # Sector sweep
    set_kf(600, (10.0, 2.0, 6.0), (2, 0, -10))

    # 3. SCENE 3 (Frames 601 - 900): Edge AI Processing Hover
    set_kf(750, (10.5, 2.5, 6.0), (0, 0, -10))           # Steady hover for internal view
    set_kf(900, (11.0, 3.0, 5.8), (0, 0, -10))

    # 4. SCENE 4 (Frames 901 - 1260): Imperfect Viewpoint 1 (Occluded Target)
    vp1 = coords["IMPERFECT_VIEWPOINT_01"]
    set_kf(960, vp1, (0, 0, 25))                         # Hover at Viewpoint 1
    set_kf(1260, vp1, (0, 0, 25))                        # Extended observation during uncertainty

    # 5. SCENE 5 (Frames 1261 - 1590): Next-Best-View Autonomous Repositioning
    # Banks left, climbs smoothly, and repositions to un-occluded Viewpoint 2
    set_kf(1320, (13.5, 6.5, 5.8), (-3, 8, 45))         # Bank into turn
    set_kf(1450, (16.0, 11.0, 4.5), (-2, 5, 85))        # Arc around rubble mound
    vp2 = coords["NEXT_BEST_VIEWPOINT_02"]
    set_kf(1590, vp2, (0, 0, 135))                       # Settle at Viewpoint 2 facing victim

    # 6. SCENE 6 (Frames 1591 - 1890): High-Confidence Verification Inspection
    set_kf(1890, vp2, (0, 0, 135))                       # Rock-solid hover facing survivor

    # 7. SCENE 7 (Frames 1891 - 2160): Risk-Aware Route Climb
    # Avoids Fire and Electrical zones while ascending
    set_kf(1980, (12.0, 10.0, 9.0), (6, -5, -45))        # Climb out
    set_kf(2160, (0.0, 5.0, 14.0), (4, 0, -90))          # High altitude safety corridor

    # 8. SCENE 8 (Frames 2161 - 2460): Telemetry Transmission Corridor
    set_kf(2460, (0.0, -10.0, 16.0), (2, 0, -180))

    # 9. SCENE 9 (Frames 2461 - 2700): Final Hero Orbit & Ascent
    set_kf(2550, (0.0, -5.0, 20.0), (0, 0, -180))
    set_kf(2700, (0.0, 0.0, 24.0), (0, 0, -180))

    # Smooth Bezier interpolation for realistic aerodynamics
    if drone_root.animation_data and drone_root.animation_data.action:
        for fcurve in drone_root.animation_data.action.fcurves:
            for kf in fcurve.keyframe_points:
                kf.interpolation = 'BEZIER'
