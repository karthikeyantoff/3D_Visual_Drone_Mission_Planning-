"""
AURIS Hexacopter Assembly Orchestrator
Constructs the complete industrial rescue hexacopter with all subsystems.
"""

import bpy
from .frame import build_frame
from .propulsion import build_propulsion
from .payload import build_payload
from .sensors import build_sensors

def create_auris_hexacopter(collection_name="AURIS_Drone_Collection"):
    """Instantiates the full AURIS Hexacopter hierarchy."""
    # Ensure or create specific collection
    if collection_name in bpy.data.collections:
        col = bpy.data.collections[collection_name]
    else:
        col = bpy.data.collections.new(collection_name)
        bpy.context.scene.collection.children.link(col)
        
    # Master Drone Root Empty
    drone_root = bpy.data.objects.new("AURIS_Hexacopter_Root", None)
    drone_root.empty_display_type = 'ARROWS'
    drone_root.empty_display_size = 0.5
    drone_root.location = (0, 0, 0)
    col.objects.link(drone_root)
    
    # 1. Structural Frame & Landing Gear
    motor_mount_positions = build_frame(drone_root)
    
    # 2. Propulsion System (6 BLDC Motors + Counter-rotating carbon props)
    propellers = build_propulsion(drone_root, motor_mount_positions)
    
    # 3. Onboard Edge-AI Computing & Avionics Suite
    payload = build_payload(drone_root)
    
    # 4. Multi-modal Sensor Suite (RGB, Thermal, RPLIDAR, MEMS Mics)
    sensors = build_sensors(drone_root)
    
    return {
        "root": drone_root,
        "propellers": propellers,
        "payload": payload,
        "sensors": sensors
    }
