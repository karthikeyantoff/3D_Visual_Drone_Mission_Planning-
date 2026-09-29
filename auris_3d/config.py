"""
AURIS 3D Disaster Response System - Master Configuration
Defines animation constants, colors, visual styling, and timeline markers.
"""

# Video & Render Settings
FPS = 30
WIDTH = 1920
HEIGHT = 1080
TOTAL_DURATION_SEC = 90
TOTAL_FRAMES = FPS * TOTAL_DURATION_SEC

# Scene Frame Ranges (30 FPS)
TIMELINE = {
    "SCENE_01_MISSION": (1, 240),        # 00-08s (Frames 1-240)
    "SCENE_02_SENSING": (241, 600),     # 08-20s (Frames 241-600)
    "SCENE_03_EDGE_AI": (601, 900),     # 20-30s (Frames 601-900)
    "SCENE_04_UNCERTAINTY": (901, 1260),# 30-42s (Frames 901-1260) - HERO SCENE
    "SCENE_05_NBV": (1261, 1590),       # 42-53s (Frames 1261-1590)
    "SCENE_06_VERIFY": (1591, 1890),    # 53-63s (Frames 1591-1890)
    "SCENE_07_RISK": (1891, 2160),      # 63-72s (Frames 1891-2160)
    "SCENE_08_DASHBOARD": (2161, 2460), # 72-82s (Frames 2161-2460)
    "SCENE_09_HERO": (2461, 2700),      # 82-90s (Frames 2461-2700)
}

# Color Palette (RGBA Normalized 0.0 - 1.0)
COLORS = {
    # Drone Materials
    "CARBON_FIBER": (0.04, 0.04, 0.05, 1.0),
    "ALUMINUM_DARK": (0.12, 0.12, 0.14, 1.0),
    "ALUMINUM_RAW": (0.7, 0.72, 0.75, 1.0),
    "ORANGE_ACCENT": (0.95, 0.35, 0.05, 1.0),
    "WHITE_CHASSIS": (0.88, 0.90, 0.92, 1.0),
    "PROP_CARBON": (0.02, 0.02, 0.03, 0.85),
    
    # Sensor & AI Glows
    "CYAN_GLOW": (0.0, 0.85, 1.0, 1.0),
    "BLUE_ACCENT": (0.05, 0.45, 0.95, 1.0),
    "THERMAL_HOT": (1.0, 0.2, 0.05, 1.0),
    "THERMAL_WARM": (1.0, 0.75, 0.1, 1.0),
    "LIDAR_GREEN": (0.1, 1.0, 0.35, 1.0),
    "ACOUSTIC_BLUE": (0.15, 0.65, 1.0, 1.0),
    
    # Tactical & Hazard Colors
    "UNCERTAINTY_YELLOW": (1.0, 0.75, 0.0, 1.0),
    "HAZARD_RED": (1.0, 0.08, 0.08, 1.0),
    "VERIFIED_GREEN": (0.05, 0.95, 0.35, 1.0),
    
    # Environment Colors
    "CONCRETE_DARK": (0.15, 0.15, 0.16, 1.0),
    "CONCRETE_LIGHT": (0.35, 0.35, 0.37, 1.0),
    "ASPHALT": (0.08, 0.08, 0.09, 1.0),
    "RUST_STEEL": (0.42, 0.18, 0.10, 1.0),
    "FLOOD_WATER": (0.05, 0.12, 0.15, 0.9),
}

# Drone Dimensions (Meters)
DRONE_DIMENSIONS = {
    "ARM_RADIUS": 0.48,           # 960mm motor-to-motor diameter
    "ARM_COUNT": 6,               # Hexacopter configuration (60 deg separation)
    "CENTRAL_BODY_RADIUS": 0.18,
    "CENTRAL_BODY_HEIGHT": 0.12,
    "PROP_DIAMETER": 0.38,        # 15-inch carbon props
    "LANDING_GEAR_HEIGHT": 0.22,
    "LANDING_GEAR_WIDTH": 0.44,
}

# Key Mission Geo Locations / Coordinates in 3D Scene
SCENARIO_COORDINATES = {
    "TAKEOFF_PAD": (0.0, -40.0, 0.5),
    "SEARCH_SECTOR_START": (0.0, -15.0, 8.0),
    "RUBBLE_COLLAPSE_ZONE": (15.0, 10.0, 1.2),
    "VICTIM_LOCATION": (16.2, 11.5, 0.4),
    "IMPERFECT_VIEWPOINT_01": (12.0, 4.0, 5.5),    # Occluded by concrete slab
    "NEXT_BEST_VIEWPOINT_02": (18.5, 15.0, 3.2),   # Direct line of sight
    "FIRE_HAZARD_ZONE": (-20.0, 5.0, 0.0),
    "FLOOD_ZONE": (-10.0, -15.0, 0.0),
    "POWERLINE_HAZARD": (5.0, -5.0, 6.0),
}
