"""
AURIS Onboard Avionics & Edge-AI Payload Suite
Models Raspberry Pi 5 + AI HAT+ (13 TOPS), Pixhawk 4, GPS mast, and Battery pack.
"""

import bpy
import math

def build_payload(drone_root):
    """Installs Edge-AI computing core, avionics, battery, and antennas."""
    mat_metal = bpy.data.materials.get("AURIS_DarkMetal")
    mat_raw = bpy.data.materials.get("AURIS_RawMetal")
    mat_carbon = bpy.data.materials.get("AURIS_CarbonFiber")
    mat_glow_blue = bpy.data.materials.get("AURIS_GlowBlue")
    mat_glow_cyan = bpy.data.materials.get("AURIS_GlowCyan")
    
    # Payload Sub-root
    payload_root = bpy.data.objects.new("AURIS_Payload_Core", None)
    payload_root.location = (0, 0, 0)
    bpy.context.collection.objects.link(payload_root)
    payload_root.parent = drone_root
    
    # 1. Raspberry Pi 5 + AI HAT+ Enclosure (Onboard Edge-AI 13 TOPS)
    # CNC Machined Aluminum Case with Active Cooling Fins
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0.03, 0.015))
    rpi_case = bpy.context.active_object
    rpi_case.name = "Payload_RPi5_AI_HAT_Plus"
    rpi_case.scale = (0.09, 0.065, 0.024)
    bpy.ops.object.transform_apply(scale=True)
    if mat_metal: rpi_case.data.materials.append(mat_metal)
    rpi_case.parent = payload_root
    
    # AI HAT+ Neural Accelerator Indicator LED (Glowing Cyan)
    bpy.ops.mesh.primitive_cylinder_add(vertices=12, radius=0.003, depth=0.002, location=(0.03, 0.045, 0.028))
    ai_led = bpy.context.active_object
    ai_led.name = "AI_NPU_Active_LED"
    if mat_glow_cyan: ai_led.data.materials.append(mat_glow_cyan)
    ai_led.parent = payload_root

    # 2. Pixhawk 4 Flight Controller
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, -0.05, 0.012))
    pixhawk = bpy.context.active_object
    pixhawk.name = "Avionics_Pixhawk_4"
    pixhawk.scale = (0.045, 0.045, 0.018)
    bpy.ops.object.transform_apply(scale=True)
    if mat_metal: pixhawk.data.materials.append(mat_metal)
    pixhawk.parent = payload_root
    
    # Pixhawk Main Safety Switch / Arming LED
    bpy.ops.mesh.primitive_uv_sphere_add(segments=12, ring_count=8, radius=0.004, location=(0, -0.05, 0.022))
    px_led = bpy.context.active_object
    px_led.name = "Pixhawk_Safety_LED"
    if mat_glow_blue: px_led.data.materials.append(mat_glow_blue)
    px_led.parent = payload_root

    # 3. High-Capacity 6S Smart Battery Pack (Underslung)
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0, -0.075))
    battery = bpy.context.active_object
    battery.name = "Battery_6S_16000mAh"
    battery.scale = (0.075, 0.16, 0.055)
    bpy.ops.object.transform_apply(scale=True)
    if mat_carbon: battery.data.materials.append(mat_carbon)
    battery.parent = payload_root

    # 4. Folding GPS / Compass Elevated Mast
    # Vertical Carbon Mast
    bpy.ops.mesh.primitive_cylinder_add(vertices=16, radius=0.004, depth=0.09, location=(0, -0.11, 0.08))
    gps_mast = bpy.context.active_object
    gps_mast.name = "GPS_Mast_Tube"
    if mat_carbon: gps_mast.data.materials.append(mat_carbon)
    gps_mast.parent = payload_root
    
    # Disc-shaped GNSS Antenna Puck
    bpy.ops.mesh.primitive_cylinder_add(vertices=24, radius=0.024, depth=0.012, location=(0, -0.11, 0.125))
    gps_puck = bpy.context.active_object
    gps_puck.name = "GPS_Compass_Puck"
    if mat_metal: gps_puck.data.materials.append(mat_metal)
    gps_puck.parent = payload_root

    # 5. Dual SIYI HM30 High-Gain Dipole Antennas
    for ant_side in [-0.07, 0.07]:
        bpy.ops.mesh.primitive_cylinder_add(vertices=12, radius=0.003, depth=0.11, location=(ant_side, -0.12, 0.04), rotation=(0.2, 0, 0))
        antenna = bpy.context.active_object
        antenna.name = f"Comm_Antenna_{ant_side}"
        if mat_metal: antenna.data.materials.append(mat_metal)
        antenna.parent = payload_root

    return payload_root
