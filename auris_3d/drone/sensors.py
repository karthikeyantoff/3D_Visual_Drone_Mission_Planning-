"""
AURIS Multi-Modal Sensor Suite Generator
Models RGB Camera, MLX90640 Thermal, RPLIDAR A1M8, MEMS Mic Array, and TFMini.
"""

import bpy
import math

def build_sensors(drone_root):
    """Mounts all multimodal sensing payloads to the hexacopter."""
    mat_metal = bpy.data.materials.get("AURIS_DarkMetal")
    mat_raw = bpy.data.materials.get("AURIS_RawMetal")
    mat_carbon = bpy.data.materials.get("AURIS_CarbonFiber")
    mat_glass = bpy.data.materials.get("AURIS_CameraGlass")
    mat_thermal = bpy.data.materials.get("AURIS_GlowThermal")
    mat_lidar = bpy.data.materials.get("AURIS_GlowLidar")
    mat_acoustic = bpy.data.materials.get("AURIS_GlowBlue")
    
    sensor_root = bpy.data.objects.new("AURIS_Sensor_Suite", None)
    sensor_root.location = (0, 0, 0)
    bpy.context.collection.objects.link(sensor_root)
    sensor_root.parent = drone_root

    # ==========================================
    # 1. 2-AXIS FRONT PERCEPTION GIMBAL (RGB + THERMAL)
    # ==========================================
    gimbal_base_loc = (0, 0.16, -0.04)
    
    # Gimbal Pitch/Yaw Mount
    bpy.ops.mesh.primitive_cylinder_add(vertices=16, radius=0.016, depth=0.012, location=gimbal_base_loc)
    gimbal_yaw = bpy.context.active_object
    gimbal_yaw.name = "Gimbal_Yaw_Motor"
    if mat_metal: gimbal_yaw.data.materials.append(mat_metal)
    gimbal_yaw.parent = sensor_root
    
    # Dual-Sensor Enclosure Box (Pitched down slightly 15 deg)
    cam_box_loc = (0, 0.19, -0.065)
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=cam_box_loc, rotation=(0.26, 0, 0))
    cam_box = bpy.context.active_object
    cam_box.name = "Sensor_Gimbal_Head"
    cam_box.scale = (0.07, 0.045, 0.035)
    bpy.ops.object.transform_apply(scale=True)
    if mat_metal: cam_box.data.materials.append(mat_metal)
    cam_box.parent = sensor_root

    # 1A. RGB Camera Optical Lens (Left Eye)
    bpy.ops.mesh.primitive_cylinder_add(vertices=20, radius=0.012, depth=0.008, location=(-0.02, 0.215, -0.06), rotation=(1.83, 0, 0))
    rgb_lens = bpy.context.active_object
    rgb_lens.name = "Sensor_RGB_4K_Lens"
    if mat_glass: rgb_lens.data.materials.append(mat_glass)
    rgb_lens.parent = sensor_root

    # 1B. MLX90640 Far-Infrared Thermal Sensor (Right Eye - Germanium Germanium Lens with Thermal Glow)
    bpy.ops.mesh.primitive_cylinder_add(vertices=20, radius=0.01, depth=0.006, location=(0.02, 0.215, -0.06), rotation=(1.83, 0, 0))
    thermal_lens = bpy.context.active_object
    thermal_lens.name = "Sensor_MLX90640_Thermal_Lens"
    if mat_thermal: thermal_lens.data.materials.append(mat_thermal)
    thermal_lens.parent = sensor_root

    # ==========================================
    # 2. RPLIDAR A1M8 360-DEGREE 2D/3D LASER TURRET
    # ==========================================
    lidar_loc = (0, 0.02, 0.08)
    
    # Lidar Base
    bpy.ops.mesh.primitive_cylinder_add(vertices=24, radius=0.035, depth=0.02, location=lidar_loc)
    lidar_base = bpy.context.active_object
    lidar_base.name = "RPLIDAR_Base"
    if mat_metal: lidar_base.data.materials.append(mat_metal)
    lidar_base.parent = sensor_root
    
    # Lidar Spinning Optical Core
    bpy.ops.mesh.primitive_cylinder_add(vertices=24, radius=0.032, depth=0.016, location=(lidar_loc[0], lidar_loc[1], lidar_loc[2] + 0.015))
    lidar_rotor = bpy.context.active_object
    lidar_rotor.name = "RPLIDAR_Rotating_Core"
    if mat_lidar: lidar_rotor.data.materials.append(mat_lidar)
    lidar_rotor.parent = sensor_root

    # ==========================================
    # 3. 4-ELEMENT MEMS MICROPHONE ARRAY (ACOUSTIC LOCALIZATION)
    # ==========================================
    # Positioned at 4 cardinal corners on vibration-damped silicone mounts
    mic_offsets = [
        (-0.06, 0.08, -0.025),  # Front-Left
        (0.06, 0.08, -0.025),   # Front-Right
        (-0.06, -0.08, -0.025), # Rear-Left
        (0.06, -0.08, -0.025)   # Rear-Right
    ]
    
    for m_idx, m_loc in enumerate(mic_offsets):
        bpy.ops.mesh.primitive_cylinder_add(vertices=12, radius=0.005, depth=0.004, location=m_loc)
        mic = bpy.context.active_object
        mic.name = f"MEMS_Acoustic_Mic_{m_idx+1}"
        if mat_acoustic: mic.data.materials.append(mat_acoustic)
        mic.parent = sensor_root

    # ==========================================
    # 4. DOWNWARD RANGING TFMINI LIDAR & OPTICAL FLOW
    # ==========================================
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, -0.02, -0.06))
    tfmini = bpy.context.active_object
    tfmini.name = "Sensor_TFMini_Downward_Lidar"
    tfmini.scale = (0.02, 0.035, 0.015)
    bpy.ops.object.transform_apply(scale=True)
    if mat_metal: tfmini.data.materials.append(mat_metal)
    tfmini.parent = sensor_root

    return sensor_root
