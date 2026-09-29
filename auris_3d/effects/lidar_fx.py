"""
AURIS Sensor FX - 360-Degree LiDAR Laser Sweep & Point Cloud
Generates spinning laser scan fan and obstacle impact points.
"""

import bpy
import math
from ..config import TOTAL_FRAMES

def create_lidar_sweep_fx(parent_drone, collection):
    """Creates a 360-deg rotating laser sweep cone with glowing green emission."""
    mat_lidar = bpy.data.materials.get("AURIS_GlowLidar")
    
    # 1. 360-deg Thin Laser Scan Disk
    bpy.ops.mesh.primitive_cylinder_add(vertices=48, radius=12.0, depth=0.015, location=(0, 0, 0.08))
    scan_disk = bpy.context.active_object
    scan_disk.name = "LiDAR_Scan_Field"
    if mat_lidar: scan_disk.data.materials.append(mat_lidar)
    scan_disk.parent = parent_drone
    collection.objects.link(scan_disk)
    bpy.context.scene.collection.objects.unlink(scan_disk)

    # 2. Rotating Focused Laser Ray
    bpy.ops.mesh.primitive_cylinder_add(vertices=12, radius=0.018, depth=14.0, location=(0, 7.0, 0.08), rotation=(math.pi/2, 0, 0))
    laser_beam = bpy.context.active_object
    laser_beam.name = "LiDAR_HighIntensity_Ray"
    if mat_lidar: laser_beam.data.materials.append(mat_lidar)
    laser_beam.parent = parent_drone
    collection.objects.link(laser_beam)
    bpy.context.scene.collection.objects.unlink(laser_beam)

    # Animate Laser Beam Rotation (360 deg sweep at 10 Hz)
    laser_beam.rotation_euler = (math.pi/2, 0, 0)
    laser_beam.keyframe_insert(data_path="rotation_euler", frame=1)
    
    total_rotations = 180.0
    laser_beam.rotation_euler = (math.pi/2, 0, total_rotations * 2 * math.pi)
    laser_beam.keyframe_insert(data_path="rotation_euler", frame=TOTAL_FRAMES)
    
    if laser_beam.animation_data and laser_beam.animation_data.action:
        for fcurve in laser_beam.animation_data.action.fcurves:
            for kf in fcurve.keyframe_points:
                kf.interpolation = 'LINEAR'
                
    return scan_disk, laser_beam
