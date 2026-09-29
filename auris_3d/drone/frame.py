"""
AURIS Hexacopter Frame Generator
Constructs central carbon fiber chassis plates, 6 carbon arms, and landing gear.
"""

import bpy
import math
from mathutils import Vector, Euler
from ..config import DRONE_DIMENSIONS

def create_cylinder_mesh(name, radius, depth, location=(0,0,0), rotation=(0,0,0), material=None, parent=None):
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=32,
        radius=radius,
        depth=depth,
        location=location,
        rotation=rotation
    )
    obj = bpy.context.active_object
    obj.name = name
    if material:
        obj.data.materials.append(material)
    if parent:
        obj.parent = parent
    return obj

def create_cube_mesh(name, size=(1,1,1), location=(0,0,0), rotation=(0,0,0), material=None, parent=None):
    bpy.ops.mesh.primitive_cube_add(
        size=1.0,
        location=location,
        rotation=rotation
    )
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = size
    bpy.ops.object.transform_apply(scale=True)
    if material:
        obj.data.materials.append(material)
    if parent:
        obj.parent = parent
    return obj

def build_frame(drone_root):
    """Builds the 6-arm hexacopter structural frame."""
    mat_carbon = bpy.data.materials.get("AURIS_CarbonFiber")
    mat_metal = bpy.data.materials.get("AURIS_DarkMetal")
    mat_raw = bpy.data.materials.get("AURIS_RawMetal")
    mat_white = bpy.data.materials.get("AURIS_WhiteChassis")
    
    # 1. Top & Bottom Central Carbon Plates
    r_body = DRONE_DIMENSIONS["CENTRAL_BODY_RADIUS"]
    top_plate = create_cylinder_mesh("Plate_Top", radius=r_body, depth=0.003, location=(0, 0, 0.04), material=mat_carbon, parent=drone_root)
    bot_plate = create_cylinder_mesh("Plate_Bottom", radius=r_body * 0.95, depth=0.003, location=(0, 0, -0.04), material=mat_carbon, parent=drone_root)
    
    # Aerodynamic Top Shell / Canopy (Matte White with AURIS branding badge)
    bpy.ops.mesh.primitive_uv_sphere_add(segments=32, ring_count=16, radius=r_body * 0.85, location=(0, 0, 0.05))
    canopy = bpy.context.active_object
    canopy.name = "AURIS_Canopy"
    canopy.scale = (1.0, 1.1, 0.45)
    bpy.ops.object.transform_apply(scale=True)
    if mat_white:
        canopy.data.materials.append(mat_white)
    canopy.parent = drone_root
    
    # 2. Six Carbon Fiber Tubular Arms (60 deg angle spacing)
    arm_radius = DRONE_DIMENSIONS["ARM_RADIUS"]
    arm_tube_radius = 0.012  # 24mm diameter carbon tube
    
    arm_objects = []
    motor_mounts = []
    
    for i in range(6):
        angle = i * (math.pi / 3.0)  # 60 degrees
        cos_a = math.cos(angle)
        sin_a = math.sin(angle)
        
        # Center offset along arm
        arm_len = arm_radius - (r_body * 0.7)
        mid_dist = (r_body * 0.7) + (arm_len / 2.0)
        
        arm_x = mid_dist * cos_a
        arm_y = mid_dist * sin_a
        
        # Arm rotation: align cylinder along radial direction
        rot_z = angle
        rot_y = math.pi / 2.0
        
        arm = create_cylinder_mesh(
            f"Carbon_Arm_{i+1}",
            radius=arm_tube_radius,
            depth=arm_len,
            location=(arm_x, arm_y, 0.0),
            rotation=(0, rot_y, rot_z),
            material=mat_carbon,
            parent=drone_root
        )
        arm_objects.append(arm)
        
        # Aluminum Arm Clamps at chassis
        clamp_dist = r_body * 0.75
        create_cube_mesh(
            f"Arm_Clamp_{i+1}",
            size=(0.035, 0.035, 0.03),
            location=(clamp_dist * cos_a, clamp_dist * sin_a, 0.0),
            rotation=(0, 0, angle),
            material=mat_metal,
            parent=drone_root
        )
        
        # Motor Mount Plate at the tip of each arm
        tip_x = arm_radius * cos_a
        tip_y = arm_radius * sin_a
        
        mount = create_cylinder_mesh(
            f"Motor_Mount_{i+1}",
            radius=0.032,
            depth=0.008,
            location=(tip_x, tip_y, 0.005),
            material=mat_metal,
            parent=drone_root
        )
        motor_mounts.append((tip_x, tip_y, 0.005, angle, i+1))
        
        # Navigation Strobes on Arm Tips (Red on Left, Green on Right, White on Rear)
        mat_strobe = bpy.data.materials.get("AURIS_NavStrobe_White")
        if i in [1, 2]: # Left side
            mat_strobe = bpy.data.materials.get("AURIS_NavStrobe_Red")
        elif i in [4, 5]: # Right side
            mat_strobe = bpy.data.materials.get("AURIS_NavStrobe_Green")
            
        create_cylinder_mesh(
            f"Nav_LED_{i+1}",
            radius=0.006,
            depth=0.004,
            location=(tip_x, tip_y, -0.01),
            material=mat_strobe,
            parent=drone_root
        )

    # 3. High-Clearance Carbon Landing Gear
    lg_h = DRONE_DIMENSIONS["LANDING_GEAR_HEIGHT"]
    lg_w = DRONE_DIMENSIONS["LANDING_GEAR_WIDTH"]
    
    for side in [-1, 1]:
        # Vertical / Angled Struts
        strut1 = create_cylinder_mesh(
            f"Gear_Strut_Front_{side}",
            radius=0.009,
            depth=lg_h * 1.1,
            location=(side * 0.14, 0.12, -lg_h * 0.5),
            rotation=(0.2, side * 0.18, 0),
            material=mat_carbon,
            parent=drone_root
        )
        strut2 = create_cylinder_mesh(
            f"Gear_Strut_Rear_{side}",
            radius=0.009,
            depth=lg_h * 1.1,
            location=(side * 0.14, -0.12, -lg_h * 0.5),
            rotation=(-0.2, side * 0.18, 0),
            material=mat_carbon,
            parent=drone_root
        )
        # Horizontal Skid Tube
        skid = create_cylinder_mesh(
            f"Gear_Skid_{side}",
            radius=0.011,
            depth=lg_w,
            location=(side * (lg_w * 0.5), 0.0, -lg_h),
            rotation=(math.pi / 2.0, 0, 0),
            material=mat_carbon,
            parent=drone_root
        )

    return motor_mounts
