"""
AURIS — Autonomous Uncertainty-aware Rescue Intelligence System
Master 3D Cinematic Video Generation Pipeline (Blender Python API)

Usage:
  blender --background --python auris_3d/main.py
  or open Blender, go to Scripting workspace, and run this script.
"""

import bpy
import sys
import os

# Add current folder to sys.path so relative imports work inside Blender
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if parent_dir not in sys.path:
    sys.path.append(parent_dir)

from auris_3d.config import FPS, WIDTH, HEIGHT, TOTAL_FRAMES, TIMELINE
from auris_3d.render.materials import setup_all_materials
from auris_3d.drone.drone_builder import create_auris_hexacopter
from auris_3d.environment.disaster_zone import build_disaster_zone
from auris_3d.effects.lidar_fx import create_lidar_sweep_fx
from auris_3d.effects.acoustic_fx import create_acoustic_waves
from auris_3d.effects.uncertainty_volume import create_uncertainty_volume
from auris_3d.effects.nbv_trajectory import create_nbv_trajectory_curve, create_risk_contours
from auris_3d.ui.hud_overlay import build_hud_elements
from auris_3d.animation.flight_controller import animate_drone_mission
from auris_3d.animation.camera_director import setup_cinematic_camera

def clear_existing_scene():
    """Removes all default starter objects, meshes, and lights."""
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    
    # Remove unused materials and meshes
    for block in bpy.data.meshes: bpy.data.meshes.remove(block)
    for block in bpy.data.materials: bpy.data.materials.remove(block)
    for block in bpy.data.cameras: bpy.data.cameras.remove(block)
    for block in bpy.data.lights: bpy.data.lights.remove(block)

def setup_render_engine():
    """Configures 1920x1080 @ 30 FPS rendering with cinematic color management."""
    scene = bpy.context.scene
    scene.render.fps = FPS
    scene.render.resolution_x = WIDTH
    scene.render.resolution_y = HEIGHT
    scene.render.resolution_percentage = 100
    
    scene.frame_start = 1
    scene.frame_end = TOTAL_FRAMES
    
    # Eevee-Next / Workbench / Cycles setup
    scene.render.engine = 'BLENDER_EEVEE_NEXT' if 'BLENDER_EEVEE_NEXT' in bpy.types.RenderSettings.bl_rna.properties['engine'].enum_items else 'BLENDER_EEVEE'
    
    # Color Management (High Contrast Cinematic Film)
    scene.view_settings.view_transform = 'Filmic' if 'Filmic' in [e.identifier for e in scene.view_settings.bl_rna.properties['view_transform'].enum_items] else 'Standard'
    scene.view_settings.look = 'High Contrast'

def setup_cinematic_lighting():
    """Creates realistic overcast disaster atmosphere with high-contrast sunbeam & sky fill."""
    world = bpy.context.scene.world
    if not world:
        world = bpy.data.worlds.new("AURIS_Disaster_World")
        bpy.context.scene.world = world
    world.use_nodes = True
    bg_node = world.node_tree.nodes.get("Background")
    if bg_node:
        bg_node.inputs['Color'].default_value = (0.05, 0.08, 0.12, 1.0) # Deep twilight slate
        bg_node.inputs['Strength'].default_value = 0.8
        
    # Cool Directional Sun Light (Moon/High Overcast)
    bpy.ops.object.light_add(type='SUN', radius=1.0, location=(30.0, -30.0, 50.0), rotation=(0.7, 0.3, 0.8))
    sun = bpy.context.active_object
    sun.name = "AURIS_SunLight"
    sun.data.color = (0.75, 0.85, 1.0)
    sun.data.energy = 4.5
    
    # Warm disaster rim light
    bpy.ops.object.light_add(type='SUN', radius=1.0, location=(-40.0, 30.0, 30.0), rotation=(-0.8, -0.2, 2.5))
    rim = bpy.context.active_object
    rim.name = "AURIS_RimLight"
    rim.data.color = (1.0, 0.55, 0.2)
    rim.data.energy = 1.8

def setup_timeline_markers():
    """Places named timeline markers corresponding to the 9 story scenes."""
    scene = bpy.context.scene
    scene.timeline_markers.clear()
    
    for scene_name, (start_frame, _) in TIMELINE.items():
        marker_name = scene_name.replace("SCENE_", "")
        scene.timeline_markers.new(name=marker_name, frame=start_frame)

def build_auris_production():
    """Master build pipeline creating the entire 90-second AURIS 3D technical video scene."""
    print("==================================================")
    print("AURIS 3D DISASTER RESPONSE VIDEO - BUILD START")
    print("==================================================")
    
    # 1. Clean & Init
    clear_existing_scene()
    setup_render_engine()
    setup_cinematic_lighting()
    setup_timeline_markers()
    
    # 2. Materials
    print("-> Compiling Procedural PBR Materials...")
    setup_all_materials()
    
    # 3. Environment
    print("-> Generating 120m x 120m Disaster Environment...")
    env = build_disaster_zone("AURIS_Disaster_Zone")
    
    # 4. Drone
    print("-> Constructing AURIS Hexacopter & Avionics Suite...")
    drone = create_auris_hexacopter("AURIS_Drone_Collection")
    drone_root = drone["root"]
    
    # 5. Sensor & AI Visual Effects
    print("-> Installing 360 LiDAR, Acoustic Waves, & Uncertainty Volumes...")
    fx_col = bpy.data.collections.new("AURIS_FX_Collection")
    bpy.context.scene.collection.children.link(fx_col)
    
    create_lidar_sweep_fx(drone_root, fx_col)
    create_acoustic_waves(fx_col)
    create_uncertainty_volume(fx_col)
    create_nbv_trajectory_curve(fx_col)
    create_risk_contours(fx_col)
    
    # 6. Technical HUD & 3D Typography
    print("-> Building 3D Cyber-HUD Typography & Labels...")
    build_hud_elements("AURIS_HUD_Collection")
    
    # 7. Flight Animation & Camera Director
    print("-> Baking Autonomous Mission Flight Controller (2700 Frames)...")
    animate_drone_mission(drone_root)
    
    print("-> Setting up Master Cinematic Camera...")
    setup_cinematic_camera(drone_root, "AURIS_Camera_Collection")
    
    print("==================================================")
    print("AURIS 3D VIDEO PRODUCTION COMPLETE!")
    print("Timeline: 2700 Frames @ 30 FPS (90 Seconds)")
    print("Core Loop: SENSE -> VERIFY -> DECIDE -> REPLAN")
    print("==================================================")

if __name__ == "__main__":
    build_auris_production()
