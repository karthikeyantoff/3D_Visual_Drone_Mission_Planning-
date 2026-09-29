"""
AURIS Hexacopter Propulsion System
Creates 6 industrial BLDC motors and 15-inch carbon propellers (CW / CCW alternating).
"""

import bpy
import math
from ..config import DRONE_DIMENSIONS, TOTAL_FRAMES

def create_bldc_motor(name, location, parent=None):
    """Creates a detailed industrial brushless motor (stator, rotor bell, anodized top)."""
    mat_metal = bpy.data.materials.get("AURIS_DarkMetal")
    mat_orange = bpy.data.materials.get("AURIS_OrangeMetal")
    mat_raw = bpy.data.materials.get("AURIS_RawMetal")
    
    # Motor Base / Stator
    bpy.ops.mesh.primitive_cylinder_add(vertices=24, radius=0.024, depth=0.015, location=(location[0], location[1], location[2] + 0.01))
    base = bpy.context.active_object
    base.name = f"{name}_Base"
    if mat_metal: base.data.materials.append(mat_metal)
    if parent: base.parent = parent
    
    # Motor Bell / Rotating Housing
    bpy.ops.mesh.primitive_cylinder_add(vertices=24, radius=0.026, depth=0.022, location=(location[0], location[1], location[2] + 0.025))
    bell = bpy.context.active_object
    bell.name = f"{name}_RotorBell"
    if mat_orange: bell.data.materials.append(mat_orange)
    if parent: bell.parent = parent
    
    # Motor Shaft / Propeller Nut
    bpy.ops.mesh.primitive_cone_add(vertices=16, radius1=0.008, radius2=0.003, depth=0.015, location=(location[0], location[1], location[2] + 0.042))
    nut = bpy.context.active_object
    nut.name = f"{name}_PropNut"
    if mat_raw: nut.data.materials.append(mat_raw)
    if parent: nut.parent = parent
    
    return bell

def create_propeller(name, location, index, is_ccw=False, parent=None):
    """Creates an aerodynamic 2-blade carbon fiber propeller."""
    mat_prop = bpy.data.materials.get("AURIS_CarbonFiber")
    prop_dia = DRONE_DIMENSIONS["PROP_DIAMETER"]
    
    # Create propeller root empty for clean rotation animation
    prop_root = bpy.data.objects.new(name, None)
    prop_root.location = (location[0], location[1], location[2] + 0.038)
    bpy.context.collection.objects.link(prop_root)
    if parent:
        prop_root.parent = parent
        
    # Central Prop Hub
    bpy.ops.mesh.primitive_cylinder_add(vertices=16, radius=0.014, depth=0.008, location=(0, 0, 0))
    hub = bpy.context.active_object
    hub.name = f"{name}_Hub"
    if mat_prop: hub.data.materials.append(mat_prop)
    hub.parent = prop_root
    
    # Blade 1 and Blade 2 (Opposite sides)
    blade_half_len = prop_dia * 0.48
    for b_idx, angle_offset in enumerate([0, math.pi]):
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0, 0))
        blade = bpy.context.active_object
        blade.name = f"{name}_Blade_{b_idx+1}"
        
        # Aerodynamic taper & twist
        blade.scale = (0.022, blade_half_len, 0.002)
        bpy.ops.object.transform_apply(scale=True)
        
        # Position blade extending radially from hub
        b_x = (blade_half_len * 0.5) * math.sin(angle_offset)
        b_y = (blade_half_len * 0.5) * math.cos(angle_offset)
        blade.location = (b_x, b_y, 0.0)
        
        # Pitch angle (Airfoil angle of attack)
        pitch = 0.12 if not is_ccw else -0.12
        blade.rotation_euler = (pitch, 0, angle_offset)
        
        if mat_prop: blade.data.materials.append(mat_prop)
        blade.parent = prop_root

    # Animate Continuous High-Speed Rotation across all frames
    # 60 rad/frame = ~570 RPM visual motion blur effect
    spin_dir = -1.0 if is_ccw else 1.0
    prop_root.rotation_euler = (0, 0, 0)
    prop_root.keyframe_insert(data_path="rotation_euler", frame=1)
    
    # Set final frame rotation
    total_rotations = 250.0  # complete full 360-deg spins
    prop_root.rotation_euler = (0, 0, spin_dir * total_rotations * 2 * math.pi)
    prop_root.keyframe_insert(data_path="rotation_euler", frame=TOTAL_FRAMES)
    
    # Make F-Curve linear for smooth endless spin
    if prop_root.animation_data and prop_root.animation_data.action:
        for fcurve in prop_root.animation_data.action.fcurves:
            for kf in fcurve.keyframe_points:
                kf.interpolation = 'LINEAR'
                
    return prop_root

def build_propulsion(drone_root, motor_mount_positions):
    """Installs all 6 motors and counter-rotating propellers."""
    propellers = []
    for mount in motor_mount_positions:
        x, y, z, angle, idx = mount
        is_ccw = (idx % 2 == 0) # Alternating CW / CCW on adjacent arms
        
        motor = create_bldc_motor(f"BLDC_Motor_{idx}", (x, y, z), parent=drone_root)
        prop = create_propeller(f"AURIS_Prop_{idx}", (x, y, z), idx, is_ccw=is_ccw, parent=drone_root)
        propellers.append(prop)
        
    return propellers
