"""
================================================================================
AURIS — Autonomous Uncertainty-aware Rescue Intelligence System
COMPLETE STANDALONE CINEMATIC 3D DISASTER RESPONSE VIDEO SCRIPT
================================================================================
Instructions:
1. Open Blender (v3.6, v4.0, v4.1, or v4.2+).
2. Switch to the 'Scripting' workspace tab at the top.
3. Click 'Open' and select this file (`auris_3d_standalone.py`).
4. Click 'Run Script' (Play button or Alt+P).
5. Hit SPACEBAR on the timeline to watch the complete 90-second animated mission!

To render the full video:
- In Blender: Render -> Render Animation (Ctrl+F12)
- Or via terminal: blender -b --python auris_3d_standalone.py -a
================================================================================
"""

import bpy
import bmesh
import math
import random
from mathutils import Vector, Euler

# ==============================================================================
# 1. CONFIGURATION & CONSTANTS
# ==============================================================================
FPS = 30
WIDTH = 1920
HEIGHT = 1080
TOTAL_DURATION_SEC = 90
TOTAL_FRAMES = FPS * TOTAL_DURATION_SEC

TIMELINE = {
    "SCENE_01_MISSION": (1, 240),        # 00-08s: Takeoff & Transit into Ruins
    "SCENE_02_SENSING": (241, 600),     # 08-20s: Multimodal Sensors (RGB, Thermal, LiDAR, Acoustic)
    "SCENE_03_EDGE_AI": (601, 900),     # 20-30s: RPi 5 + AI HAT+ 13 TOPS Edge Processing
    "SCENE_04_UNCERTAINTY": (901, 1260),# 30-42s: HERO SCENE: Occluded Victim & "Not Detected ≠ Not Present"
    "SCENE_05_NBV": (1261, 1590),       # 42-53s: Tactical Next-Best-View Repositioning Flight
    "SCENE_06_VERIFY": (1591, 1890),    # 53-63s: Evidence Fusion -> 91% High Confidence Confirmation
    "SCENE_07_RISK": (1891, 2160),      # 63-72s: Risk-Aware Planning & Hazard Avoidance
    "SCENE_08_DASHBOARD": (2161, 2460), # 72-82s: Rescue Intelligence Incident Packet Dispatch
    "SCENE_09_HERO": (2461, 2700),      # 82-90s: Final Ascent Orbit & Core Loop Closing Tagline
}

COLORS = {
    "CARBON_FIBER": (0.04, 0.04, 0.05, 1.0),
    "ALUMINUM_DARK": (0.12, 0.12, 0.14, 1.0),
    "ALUMINUM_RAW": (0.7, 0.72, 0.75, 1.0),
    "ORANGE_ACCENT": (0.95, 0.35, 0.05, 1.0),
    "WHITE_CHASSIS": (0.88, 0.90, 0.92, 1.0),
    "CYAN_GLOW": (0.0, 0.85, 1.0, 1.0),
    "BLUE_ACCENT": (0.05, 0.45, 0.95, 1.0),
    "THERMAL_HOT": (1.0, 0.2, 0.05, 1.0),
    "LIDAR_GREEN": (0.1, 1.0, 0.35, 1.0),
    "UNCERTAINTY_YELLOW": (1.0, 0.75, 0.0, 1.0),
    "HAZARD_RED": (1.0, 0.08, 0.08, 1.0),
    "CONCRETE_DARK": (0.15, 0.15, 0.16, 1.0),
}

COORDINATES = {
    "TAKEOFF_PAD": (0.0, -40.0, 0.4),
    "RUBBLE_ZONE": (15.0, 10.0, 1.2),
    "VICTIM_LOC": (16.2, 11.5, 0.4),
    "VIEWPOINT_01": (12.0, 4.0, 5.5),    # Imperfect viewpoint (Occluded by slab)
    "VIEWPOINT_02": (18.5, 15.0, 3.2),   # Next-Best-View (Direct Line of Sight)
    "FIRE_ZONE": (-20.0, 5.0, 0.0),
    "ELECTRICAL_ZONE": (5.0, -5.0, 0.0),
}

# ==============================================================================
# 2. SCENE INITIALIZATION & MATERIALS
# ==============================================================================
def clear_scene():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    for block in bpy.data.meshes: bpy.data.meshes.remove(block)
    for block in bpy.data.materials: bpy.data.materials.remove(block)
    for block in bpy.data.cameras: bpy.data.cameras.remove(block)
    for block in bpy.data.lights: bpy.data.lights.remove(block)

def create_mat(name, color, metallic=0.0, roughness=0.5, emission_strength=0.0):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()
    
    out = nodes.new(type='ShaderNodeOutputMaterial')
    if emission_strength > 0.0:
        ems = nodes.new(type='ShaderNodeEmission')
        ems.inputs['Color'].default_value = color
        ems.inputs['Strength'].default_value = emission_strength
        links.new(ems.outputs['Emission'], out.inputs['Surface'])
    else:
        bsdf = nodes.new(type='ShaderNodeBsdfPrincipled')
        bsdf.inputs['Base Color'].default_value = color
        bsdf.inputs['Metallic'].default_value = metallic
        bsdf.inputs['Roughness'].default_value = roughness
        links.new(bsdf.outputs['BSDF'], out.inputs['Surface'])
    return mat

def init_materials():
    create_mat("AURIS_Carbon", COLORS["CARBON_FIBER"], metallic=0.1, roughness=0.3)
    create_mat("AURIS_DarkMetal", COLORS["ALUMINUM_DARK"], metallic=0.9, roughness=0.2)
    create_mat("AURIS_RawMetal", COLORS["ALUMINUM_RAW"], metallic=0.9, roughness=0.2)
    create_mat("AURIS_OrangeMetal", COLORS["ORANGE_ACCENT"], metallic=0.8, roughness=0.3)
    create_mat("AURIS_WhiteChassis", COLORS["WHITE_CHASSIS"], metallic=0.0, roughness=0.4)
    create_mat("AURIS_Concrete", COLORS["CONCRETE_DARK"], metallic=0.0, roughness=0.9)
    create_mat("AURIS_GlowCyan", COLORS["CYAN_GLOW"], emission_strength=8.0)
    create_mat("AURIS_GlowBlue", COLORS["BLUE_ACCENT"], emission_strength=6.0)
    create_mat("AURIS_GlowLidar", COLORS["LIDAR_GREEN"], emission_strength=7.0)
    create_mat("AURIS_GlowThermal", COLORS["THERMAL_HOT"], emission_strength=7.0)
    create_mat("AURIS_GlowUncertain", COLORS["UNCERTAINTY_YELLOW"], emission_strength=6.0)
    create_mat("AURIS_GlowHazard", COLORS["HAZARD_RED"], emission_strength=8.0)
    create_mat("AURIS_Strobe_Red", (1.0, 0.0, 0.0, 1.0), emission_strength=12.0)
    create_mat("AURIS_Strobe_Green", (0.0, 1.0, 0.0, 1.0), emission_strength=12.0)

# ==============================================================================
# 3. AURIS HEXACOPTER GENERATOR
# ==============================================================================
def build_auris_drone():
    col = bpy.data.collections.new("AURIS_Drone")
    bpy.context.scene.collection.children.link(col)
    
    root = bpy.data.objects.new("AURIS_Drone_Root", None)
    root.empty_display_type = 'ARROWS'
    root.empty_display_size = 0.5
    col.objects.link(root)
    
    mat_carbon = bpy.data.materials.get("AURIS_Carbon")
    mat_dark = bpy.data.materials.get("AURIS_DarkMetal")
    mat_orange = bpy.data.materials.get("AURIS_OrangeMetal")
    mat_white = bpy.data.materials.get("AURIS_WhiteChassis")
    mat_cyan = bpy.data.materials.get("AURIS_GlowCyan")
    mat_lidar = bpy.data.materials.get("AURIS_GlowLidar")
    mat_thermal = bpy.data.materials.get("AURIS_GlowThermal")

    # Central Chassis & Canopy
    bpy.ops.mesh.primitive_cylinder_add(vertices=24, radius=0.18, depth=0.006, location=(0, 0, 0.03))
    top_p = bpy.context.active_object
    if mat_carbon: top_p.data.materials.append(mat_carbon)
    top_p.parent = root
    
    bpy.ops.mesh.primitive_uv_sphere_add(segments=24, ring_count=12, radius=0.15, location=(0, 0, 0.045))
    canopy = bpy.context.active_object
    canopy.scale = (1.0, 1.1, 0.45)
    bpy.ops.object.transform_apply(scale=True)
    if mat_white: canopy.data.materials.append(mat_white)
    canopy.parent = root

    # 6 Arms, Motors, and Animated Propellers (60 deg separation)
    arm_radius = 0.48
    for i in range(6):
        angle = i * (math.pi / 3.0)
        cos_a, sin_a = math.cos(angle), math.sin(angle)
        
        # Carbon Arm Tube
        mid_d = arm_radius * 0.55
        bpy.ops.mesh.primitive_cylinder_add(vertices=16, radius=0.012, depth=arm_radius * 0.75,
                                            location=(mid_d * cos_a, mid_d * sin_a, 0.0),
                                            rotation=(0, math.pi/2, angle))
        arm = bpy.context.active_object
        if mat_carbon: arm.data.materials.append(mat_carbon)
        arm.parent = root
        
        # Motor Mount & BLDC Motor
        tx, ty = arm_radius * cos_a, arm_radius * sin_a
        bpy.ops.mesh.primitive_cylinder_add(vertices=16, radius=0.026, depth=0.022, location=(tx, ty, 0.02))
        motor = bpy.context.active_object
        if mat_orange: motor.data.materials.append(mat_orange)
        motor.parent = root
        
        # Navigation Strobe
        strobe_mat = bpy.data.materials.get("AURIS_Strobe_Red" if i in [1,2] else "AURIS_Strobe_Green")
        bpy.ops.mesh.primitive_cylinder_add(vertices=12, radius=0.006, depth=0.004, location=(tx, ty, -0.01))
        strobe = bpy.context.active_object
        if strobe_mat: strobe.data.materials.append(strobe_mat)
        strobe.parent = root

        # Propeller Hub & Carbon Blades with Continuous Fast Spin
        prop_root = bpy.data.objects.new(f"Prop_{i+1}", None)
        prop_root.location = (tx, ty, 0.038)
        col.objects.link(prop_root)
        prop_root.parent = root
        
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0, 0))
        blade = bpy.context.active_object
        blade.scale = (0.022, 0.36, 0.002)
        bpy.ops.object.transform_apply(scale=True)
        if mat_carbon: blade.data.materials.append(mat_carbon)
        blade.parent = prop_root
        
        # Spin Animation
        is_ccw = (i % 2 == 0)
        s_dir = -1.0 if is_ccw else 1.0
        prop_root.rotation_euler = (0, 0, 0)
        prop_root.keyframe_insert(data_path="rotation_euler", frame=1)
        prop_root.rotation_euler = (0, 0, s_dir * 250.0 * 2 * math.pi)
        prop_root.keyframe_insert(data_path="rotation_euler", frame=TOTAL_FRAMES)
        if prop_root.animation_data and prop_root.animation_data.action:
            for fc in prop_root.animation_data.action.fcurves:
                for kf in fc.keyframe_points: kf.interpolation = 'LINEAR'

    # Landing Gear
    for side in [-1, 1]:
        bpy.ops.mesh.primitive_cylinder_add(vertices=12, radius=0.008, depth=0.24, location=(side * 0.14, 0, -0.11), rotation=(0, side * 0.2, 0))
        strut = bpy.context.active_object
        if mat_carbon: strut.data.materials.append(mat_carbon)
        strut.parent = root
        
        bpy.ops.mesh.primitive_cylinder_add(vertices=12, radius=0.01, depth=0.42, location=(side * 0.2, 0, -0.22), rotation=(math.pi/2, 0, 0))
        skid = bpy.context.active_object
        if mat_carbon: skid.data.materials.append(mat_carbon)
        skid.parent = root

    # Avionics Core (RPi 5 + AI HAT+ 13 TOPS Enclosure)
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0.02, 0.012))
    rpi = bpy.context.active_object
    rpi.scale = (0.09, 0.065, 0.02)
    bpy.ops.object.transform_apply(scale=True)
    if mat_dark: rpi.data.materials.append(mat_dark)
    rpi.parent = root

    # Sensors: Front Gimbal (RGB + Thermal), Top RPLIDAR
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0.18, -0.05), rotation=(0.25, 0, 0))
    gimbal = bpy.context.active_object
    gimbal.scale = (0.065, 0.04, 0.03)
    bpy.ops.object.transform_apply(scale=True)
    if mat_dark: gimbal.data.materials.append(mat_dark)
    gimbal.parent = root
    
    # Thermal Lens Glow
    bpy.ops.mesh.primitive_cylinder_add(vertices=16, radius=0.01, depth=0.006, location=(0.018, 0.205, -0.045), rotation=(1.82, 0, 0))
    th_lens = bpy.context.active_object
    if mat_thermal: th_lens.data.materials.append(mat_thermal)
    th_lens.parent = root

    # Top RPLIDAR Laser Core
    bpy.ops.mesh.primitive_cylinder_add(vertices=20, radius=0.032, depth=0.025, location=(0, 0.02, 0.085))
    lidar = bpy.context.active_object
    if mat_lidar: lidar.data.materials.append(mat_lidar)
    lidar.parent = root

    return root

# ==============================================================================
# 4. DISASTER ENVIRONMENT & HAZARDS
# ==============================================================================
def build_environment():
    col = bpy.data.collections.new("AURIS_Disaster_World")
    bpy.context.scene.collection.children.link(col)
    
    mat_conc = bpy.data.materials.get("AURIS_Concrete")
    mat_fire = bpy.data.materials.get("AURIS_GlowThermal")
    mat_cyan = bpy.data.materials.get("AURIS_GlowCyan")
    
    # Terrain with Fault Line Fracture
    bpy.ops.mesh.primitive_grid_add(x_subdivisions=30, y_subdivisions=30, size=130.0, location=(0, 0, -0.05))
    ground = bpy.context.active_object
    ground.name = "Ground_Terrain"
    if mat_conc: ground.data.materials.append(mat_conc)
    
    bm = bmesh.new()
    bm.from_mesh(ground.data)
    random.seed(42)
    for v in bm.verts:
        v.co.z += (random.random() - 0.5) * 0.35
        if abs(v.co.y - 8.0) < 6.0: v.co.z -= 0.6 + random.random() * 0.4
    bm.to_mesh(ground.data)
    bm.free()
    col.objects.link(ground)
    bpy.context.scene.collection.objects.unlink(ground)

    # Damaged Towers & Collapsed Structural Slabs
    def add_tower(name, loc, size):
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(loc[0], loc[1], loc[2] + size[2]*0.5))
        t = bpy.context.active_object
        t.name = name
        t.scale = size
        bpy.ops.object.transform_apply(scale=True)
        if mat_conc: t.data.materials.append(mat_conc)
        col.objects.link(t)
        bpy.context.scene.collection.objects.unlink(t)

    add_tower("Tower_Sector_A1", (-32.0, 22.0, 0), (16.0, 16.0, 32.0))
    add_tower("Tower_Sector_A2", (-35.0, -12.0, 0), (14.0, 14.0, 24.0))
    add_tower("Rubble_Building_B", (22.0, 18.0, 0), (12.0, 12.0, 10.0))
    add_tower("Tower_Sector_F", (32.0, -22.0, 0), (12.0, 12.0, 20.0))

    # Ground Zero Rubble Piles (Survivor Location)
    for s_idx in range(6):
        lx = 16.0 + (random.random() - 0.5) * 3.5
        ly = 11.0 + (random.random() - 0.5) * 3.5
        lz = s_idx * 0.4
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(lx, ly, lz), rotation=((random.random()-0.5)*0.4, (random.random()-0.5)*0.4, random.random()*3.14))
        slab = bpy.context.active_object
        slab.scale = (4.0, 3.0, 0.3)
        bpy.ops.object.transform_apply(scale=True)
        if mat_conc: slab.data.materials.append(mat_conc)
        col.objects.link(slab)
        bpy.context.scene.collection.objects.unlink(slab)

    # Partially Hidden Survivor Candidate (Thermal Heat Core)
    v_loc = COORDINATES["VICTIM_LOC"]
    bpy.ops.mesh.primitive_cylinder_add(vertices=16, radius=0.2, depth=0.55, location=(v_loc[0], v_loc[1], v_loc[2] + 0.2), rotation=(0, 1.2, 0.3))
    victim = bpy.context.active_object
    victim.name = "Survivor_Candidate_HeatCore"
    if mat_fire: victim.data.materials.append(mat_fire)
    col.objects.link(victim)
    bpy.context.scene.collection.objects.unlink(victim)

    # Active Fire Hazard & Orange Light
    f_loc = COORDINATES["FIRE_ZONE"]
    for fi in range(4):
        bpy.ops.mesh.primitive_cone_add(vertices=12, radius1=0.8, depth=2.2, location=(f_loc[0] + (random.random()-0.5)*2.5, f_loc[1] + (random.random()-0.5)*2.5, 1.1))
        flame = bpy.context.active_object
        if mat_fire: flame.data.materials.append(mat_fire)
        col.objects.link(flame)
        bpy.context.scene.collection.objects.unlink(flame)
        
    bpy.ops.object.light_add(type='POINT', radius=2.0, location=(f_loc[0], f_loc[1], 2.5))
    f_light = bpy.context.active_object
    f_light.data.color = (1.0, 0.35, 0.05)
    f_light.data.energy = 900.0
    col.objects.link(f_light)
    bpy.context.scene.collection.objects.unlink(f_light)

    # Electrical Arc Hazard
    e_loc = COORDINATES["ELECTRICAL_ZONE"]
    bpy.ops.mesh.primitive_cylinder_add(vertices=12, radius=0.15, depth=8.0, location=(e_loc[0], e_loc[1], 2.8), rotation=(0.55, 0.2, 0.3))
    pole = bpy.context.active_object
    if mat_dark: pole.data.materials.append(mat_dark)
    col.objects.link(pole)
    bpy.context.scene.collection.objects.unlink(pole)
    
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.25, location=(e_loc[0]+1.8, e_loc[1]+0.8, 0.3))
    spark = bpy.context.active_object
    if mat_cyan: spark.data.materials.append(mat_cyan)
    col.objects.link(spark)
    bpy.context.scene.collection.objects.unlink(spark)

# ==============================================================================
# 5. SENSOR FX, UNCERTAINTY & NEXT-BEST-VIEW VISUALIZATIONS
# ==============================================================================
def build_visual_fx(drone_root):
    col = bpy.data.collections.new("AURIS_Tactical_FX")
    bpy.context.scene.collection.children.link(col)
    
    mat_lidar = bpy.data.materials.get("AURIS_GlowLidar")
    mat_cyan = bpy.data.materials.get("AURIS_GlowCyan")
    mat_unc = bpy.data.materials.get("AURIS_GlowUncertain")
    mat_haz = bpy.data.materials.get("AURIS_GlowHazard")

    # 1. 360-Deg Rotating LiDAR Laser Sweep
    bpy.ops.mesh.primitive_cylinder_add(vertices=36, radius=11.0, depth=0.015, location=(0, 0, 0.08))
    scan_disk = bpy.context.active_object
    scan_disk.name = "LiDAR_Scan_Disk"
    if mat_lidar: scan_disk.data.materials.append(mat_lidar)
    scan_disk.parent = drone_root
    col.objects.link(scan_disk)
    bpy.context.scene.collection.objects.unlink(scan_disk)

    # 2. Acoustic Directional Rings at Survivor Location
    v_loc = COORDINATES["VICTIM_LOC"]
    for r_idx in range(3):
        bpy.ops.mesh.primitive_torus_add(major_radius=1.4 + (r_idx * 1.5), minor_radius=0.03, location=(v_loc[0], v_loc[1], 0.3 + (r_idx * 0.2)))
        ring = bpy.context.active_object
        if mat_cyan: ring.data.materials.append(mat_cyan)
        col.objects.link(ring)
        bpy.context.scene.collection.objects.unlink(ring)

    # 3. Hero Uncertainty Bounding Frustum (Yellow-Orange)
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(v_loc[0], v_loc[1], 1.2))
    unc_box = bpy.context.active_object
    unc_box.name = "Uncertainty_Bounding_Volume"
    unc_box.scale = (2.4, 2.4, 1.8)
    bpy.ops.object.transform_apply(scale=True)
    unc_box.display_type = 'WIRE'
    if mat_unc: unc_box.data.materials.append(mat_unc)
    col.objects.link(unc_box)
    bpy.context.scene.collection.objects.unlink(unc_box)

    # 4. Glowing Next-Best-View (NBV) Flight Trajectory Spline
    vp1 = COORDINATES["VIEWPOINT_01"]
    vp2 = COORDINATES["VIEWPOINT_02"]
    curve_d = bpy.data.curves.new(name="NBV_Spline", type='CURVE')
    curve_d.dimensions = '3D'
    curve_d.bevel_depth = 0.04
    spline = curve_d.splines.new(type='BEZIER')
    spline.bezier_points.add(1)
    spline.bezier_points[0].co = vp1
    spline.bezier_points[0].handle_right = (vp1[0] + 2.0, vp1[1] + 3.0, vp1[2] + 0.5)
    spline.bezier_points[1].co = vp2
    spline.bezier_points[1].handle_left = (vp2[0] - 2.0, vp2[1] - 3.0, vp2[2] + 0.5)
    
    nbv_ribbon = bpy.data.objects.new("AURIS_NBV_Flight_Corridor", curve_d)
    if mat_cyan: nbv_ribbon.data.materials.append(mat_cyan)
    col.objects.link(nbv_ribbon)

    # 5. Risk Avoidance Contour Ring
    f_loc = COORDINATES["FIRE_ZONE"]
    bpy.ops.mesh.primitive_torus_add(major_radius=8.5, minor_radius=0.06, location=(f_loc[0], f_loc[1], 0.2))
    risk_ring = bpy.context.active_object
    risk_ring.name = "Risk_Exclusion_Zone"
    if mat_haz: risk_ring.data.materials.append(mat_haz)
    col.objects.link(risk_ring)
    bpy.context.scene.collection.objects.unlink(risk_ring)

# ==============================================================================
# 6. 3D CYBER-HUD & TYPOGRAPHY
# ==============================================================================
def add_3d_text(name, text, loc, rot_deg, scale, mat, col):
    font_curve = bpy.data.curves.new(type="FONT", name=f"{name}_Font")
    font_curve.body = text
    font_curve.extrude = 0.008
    font_curve.align_x = 'CENTER'
    
    obj = bpy.data.objects.new(name, font_curve)
    obj.location = loc
    obj.rotation_euler = (math.radians(rot_deg[0]), math.radians(rot_deg[1]), math.radians(rot_deg[2]))
    obj.scale = (scale, scale, scale)
    if mat: obj.data.materials.append(mat)
    col.objects.link(obj)
    return obj

def build_hud():
    col = bpy.data.collections.new("AURIS_HUD")
    bpy.context.scene.collection.children.link(col)
    
    mat_cyan = bpy.data.materials.get("AURIS_GlowCyan")
    mat_white = bpy.data.materials.get("AURIS_WhiteChassis")
    mat_unc = bpy.data.materials.get("AURIS_GlowUncertain")
    mat_green = bpy.data.materials.get("AURIS_GlowLidar")
    mat_haz = bpy.data.materials.get("AURIS_GlowHazard")

    # Titles & Hero Callouts
    add_3d_text("HUD_Title", "AURIS", (0, -28.0, 14.0), (65, 0, 0), 2.2, mat_cyan, col)
    add_3d_text("HUD_Subtitle", "Autonomous Uncertainty-aware Rescue Intelligence System\nSENSE • VERIFY • DECIDE • REPLAN", (0, -28.0, 11.5), (65, 0, 0), 0.65, mat_white, col)
    
    add_3d_text("HUD_Uncertainty", "EVIDENCE CONFLICT\nRGB: 61% | THERMAL: 72% | ACOUSTIC: 58%\n\n\"NOT DETECTED ≠ NOT PRESENT\"", (16.0, 8.0, 7.2), (55, 0, 0), 0.55, mat_unc, col)
    add_3d_text("HUD_NBV", "NEXT-BEST-VIEW CALCULATED\nAUTONOMOUS REPOSITIONING", (15.0, 10.0, 8.5), (50, 0, 0), 0.5, mat_cyan, col)
    add_3d_text("HUD_Verify", "EVIDENCE FUSION COMPLETE\nRGB: 89% | THERMAL: 91% | ACOUSTIC: 84%\n\nHIGH-CONFIDENCE SURVIVOR CANDIDATE (91%)", (18.5, 13.0, 5.8), (45, 0, 0), 0.48, mat_green, col)
    add_3d_text("HUD_Risk", "RISK-AWARE MISSION REPLAN\nHAZARD CORRIDOR AVOIDANCE ACTIVE", (-5.0, 0.0, 12.0), (55, 0, 0), 0.6, mat_haz, col)

# ==============================================================================
# 7. MISSION FLIGHT & CAMERA ANIMATION SEQUENCING
# ==============================================================================
def animate_mission(drone_root):
    coords = COORDINATES
    drone_root.animation_data_clear()
    
    def set_kf(frame, loc, rot_deg=(0,0,0)):
        drone_root.location = loc
        drone_root.rotation_euler = (math.radians(rot_deg[0]), math.radians(rot_deg[1]), math.radians(rot_deg[2]))
        drone_root.keyframe_insert(data_path="location", frame=frame)
        drone_root.keyframe_insert(data_path="rotation_euler", frame=frame)

    set_kf(1, coords["TAKEOFF_PAD"], (0, 0, 0))
    set_kf(80, (0.0, -40.0, 6.5), (4, 0, 0))
    set_kf(240, (0.0, -18.0, 8.0), (8, 0, 0))
    set_kf(480, (8.0, 0.0, 6.8), (4, 2, -15))
    set_kf(600, (10.0, 2.0, 6.0), (0, 0, -10))
    set_kf(900, (11.0, 3.0, 5.8), (0, 0, -10))
    
    # Scene 4: Occluded Observation at Viewpoint 1
    vp1 = coords["VIEWPOINT_01"]
    set_kf(960, vp1, (0, 0, 25))
    set_kf(1260, vp1, (0, 0, 25))
    
    # Scene 5: Repositioning along NBV curve to Viewpoint 2
    set_kf(1320, (13.5, 6.5, 5.8), (-3, 8, 45))
    set_kf(1450, (16.0, 11.0, 4.5), (-2, 5, 85))
    vp2 = coords["VIEWPOINT_02"]
    set_kf(1590, vp2, (0, 0, 135))
    set_kf(1890, vp2, (0, 0, 135))
    
    # Scene 7 & 9: Safe Climb & Final Hero Ascent
    set_kf(2160, (0.0, 5.0, 14.0), (4, 0, -90))
    set_kf(2460, (0.0, -10.0, 16.0), (2, 0, -180))
    set_kf(2700, (0.0, 0.0, 24.0), (0, 0, -180))

    if drone_root.animation_data and drone_root.animation_data.action:
        for fc in drone_root.animation_data.action.fcurves:
            for kf in fc.keyframe_points: kf.interpolation = 'BEZIER'

def build_cinematic_camera():
    col = bpy.data.collections.new("AURIS_Camera")
    bpy.context.scene.collection.children.link(col)
    
    cam_d = bpy.data.cameras.new(name="Master_Cam_Data")
    cam_d.lens = 32.0
    cam = bpy.data.objects.new("AURIS_Master_Cam", cam_d)
    col.objects.link(cam)
    bpy.context.scene.camera = cam
    
    def set_c_kf(frame, loc, rot_deg, lens=32.0):
        cam.location = loc
        cam.rotation_euler = (math.radians(rot_deg[0]), math.radians(rot_deg[1]), math.radians(rot_deg[2]))
        cam_d.lens = lens
        cam.keyframe_insert(data_path="location", frame=frame)
        cam.keyframe_insert(data_path="rotation_euler", frame=frame)
        cam_d.keyframe_insert(data_path="lens", frame=frame)

    set_c_kf(1, (0.0, -65.0, 32.0), (62, 0, 0), 28.0)
    set_c_kf(240, (0.0, -32.0, 16.0), (68, 0, 0), 35.0)
    set_c_kf(600, (12.0, -4.0, 7.5), (82, 0, 35), 50.0)
    set_c_kf(900, (10.2, 4.1, 6.1), (84, 0, 115), 85.0)
    set_c_kf(1260, (14.0, 2.0, 6.2), (72, 0, 30), 45.0)
    set_c_kf(1590, (14.0, 10.0, 12.0), (55, 0, -15), 32.0)
    set_c_kf(1890, (19.0, 16.5, 3.8), (78, 0, -140), 60.0)
    set_c_kf(2160, (0.0, 0.0, 42.0), (0, 0, 10), 24.0)
    set_c_kf(2460, (-4.0, -16.0, 18.0), (68, 0, 15), 35.0)
    set_c_kf(2700, (8.0, -10.0, 27.0), (65, 0, -30), 28.0)

    if cam.animation_data and cam.animation_data.action:
        for fc in cam.animation_data.action.fcurves:
            for kf in fc.keyframe_points: kf.interpolation = 'BEZIER'

# ==============================================================================
# 8. MASTER PIPELINE EXECUTION
# ==============================================================================
def main():
    print(">>> Initializing AURIS 3D Cinematic Pipeline...")
    clear_scene()
    
    # Engine Settings
    scene = bpy.context.scene
    scene.render.fps = FPS
    scene.render.resolution_x = WIDTH
    scene.render.resolution_y = HEIGHT
    scene.frame_start = 1
    scene.frame_end = TOTAL_FRAMES
    
    # Lighting
    bpy.ops.object.light_add(type='SUN', radius=1.0, location=(30.0, -30.0, 50.0), rotation=(0.7, 0.3, 0.8))
    sun = bpy.context.active_object
    sun.data.color = (0.75, 0.85, 1.0)
    sun.data.energy = 4.5
    
    # Timeline Markers
    scene.timeline_markers.clear()
    for s_name, (f_start, _) in TIMELINE.items():
        scene.timeline_markers.new(name=s_name.replace("SCENE_", ""), frame=f_start)
        
    init_materials()
    env = build_environment()
    drone = build_auris_drone()
    build_visual_fx(drone)
    build_hud()
    animate_mission(drone)
    build_cinematic_camera()
    
    print(">>> AURIS 3D CINEMATIC GENERATION COMPLETE! (2700 Frames @ 30 FPS)")

if __name__ == "__main__":
    main()
