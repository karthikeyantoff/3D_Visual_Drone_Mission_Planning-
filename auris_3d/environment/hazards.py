"""
AURIS Disaster Hazards - Fire, Smoke, Flooding, and Electrical Arcs
Generates interactive hazard zones used by the Risk-Aware Mission Planning engine.
"""

import bpy
import math
import random
from ..config import COLORS

def create_fire_hazard(name, location, radius=3.5, collection=None):
    """Creates a glowing fire hazard core with dynamic point light."""
    mat_fire = bpy.data.materials.get("AURIS_GlowThermal")
    
    # Flame cluster cones
    fire_root = bpy.data.objects.new(name, None)
    fire_root.location = location
    collection.objects.link(fire_root)
    
    for i in range(5):
        fx = (random.random() - 0.5) * radius
        fy = (random.random() - 0.5) * radius
        h = 1.8 + random.random() * 1.5
        
        bpy.ops.mesh.primitive_cone_add(vertices=12, radius1=0.7, depth=h, location=(fx, fy, h*0.5))
        flame = bpy.context.active_object
        flame.name = f"{name}_FlameCone_{i+1}"
        if mat_fire: flame.data.materials.append(mat_fire)
        flame.parent = fire_root
        
    # High-intensity orange point light
    bpy.ops.object.light_add(type='POINT', radius=1.5, location=(0, 0, 2.0))
    light = bpy.context.active_object
    light.name = f"{name}_PointLight"
    light.data.color = (1.0, 0.35, 0.05)
    light.data.energy = 800.0  # High brightness for night/overcast glow
    light.parent = fire_root
    
    return fire_root

def create_electrical_hazard(name, location, collection=None):
    """Creates downed high-voltage powerline poles with glowing electric arc sparks."""
    mat_metal = bpy.data.materials.get("AURIS_DarkMetal")
    mat_spark = bpy.data.materials.get("AURIS_GlowCyan")
    
    hazard_root = bpy.data.objects.new(name, None)
    hazard_root.location = location
    collection.objects.link(hazard_root)
    
    # Broken utility pole tilted over
    bpy.ops.mesh.primitive_cylinder_add(vertices=16, radius=0.18, depth=9.0, location=(0, 0, 3.2), rotation=(0.55, 0.2, 0.4))
    pole = bpy.context.active_object
    pole.name = f"{name}_TiltedPole"
    if mat_metal: pole.data.materials.append(mat_metal)
    pole.parent = hazard_root
    
    # Dangling electrical cable
    bpy.ops.mesh.primitive_torus_add(major_radius=1.8, minor_radius=0.02, location=(1.2, 0.8, 1.4), rotation=(0.8, 0.4, 0))
    wire = bpy.context.active_object
    wire.name = f"{name}_DanglingWire"
    if mat_metal: wire.data.materials.append(mat_metal)
    wire.parent = hazard_root
    
    # Voltage spark emitter orb
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.25, location=(2.2, 1.1, 0.3))
    spark = bpy.context.active_object
    spark.name = f"{name}_VoltageArc"
    if mat_spark: spark.data.materials.append(mat_spark)
    spark.parent = hazard_root
    
    # Electric blue flashing light
    bpy.ops.object.light_add(type='POINT', radius=0.8, location=(2.2, 1.1, 0.6))
    spark_light = bpy.context.active_object
    spark_light.name = f"{name}_ArcLight"
    spark_light.data.color = (0.0, 0.85, 1.0)
    spark_light.data.energy = 500.0
    spark_light.parent = hazard_root
    
    return hazard_root

def create_flood_zone(name, location, size=(25.0, 35.0), collection=None):
    """Creates a reflective floodwater reservoir plane."""
    mat_water = bpy.data.materials.get("AURIS_RubbleConcrete") # Will use reflective glass/water shader
    
    bpy.ops.mesh.primitive_plane_add(size=1.0, location=(location[0], location[1], 0.05))
    water = bpy.context.active_object
    water.name = name
    water.scale = (size[0], size[1], 1.0)
    bpy.ops.object.transform_apply(scale=True)
    
    # Water shader
    mat = bpy.data.materials.new(name="AURIS_FloodWaterShader")
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs['Base Color'].default_value = (0.04, 0.12, 0.18, 1.0)
        bsdf.inputs['Roughness'].default_value = 0.08
        bsdf.inputs['Metallic'].default_value = 0.4
        bsdf.inputs['Transmission Weight'].default_value = 0.6
    water.data.materials.append(mat)
    
    collection.objects.link(water)
    bpy.context.scene.collection.objects.unlink(water)
    return water

def build_hazards(collection):
    """Installs all active hazards across the disaster zone."""
    create_fire_hazard("Fire_Hazard_Sector_D", (-20.0, 5.0, 0.0), radius=4.0, collection=collection)
    create_electrical_hazard("Electrical_Hazard_Sector_E", (5.0, -5.0, 0.0), collection=collection)
    create_flood_zone("Flood_Zone_Sector_C", (-12.0, -18.0), size=(24.0, 30.0), collection=collection)
