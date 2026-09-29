"""
AURIS Disaster Environment - Survivor Candidate
Models the partially occluded survivor candidate located in the rubble pocket.
"""

import bpy
from ..config import SCENARIO_COORDINATES

def create_survivor_candidate(collection):
    """Creates a stylized human figure partially trapped beneath collapsed concrete slabs."""
    mat_thermal = bpy.data.materials.get("AURIS_GlowThermal")
    mat_cloth = bpy.data.materials.get("AURIS_WhiteChassis")
    
    vic_loc = SCENARIO_COORDINATES["VICTIM_LOCATION"]
    
    survivor_root = bpy.data.objects.new("Survivor_Candidate_Pocket", None)
    survivor_root.location = vic_loc
    collection.objects.link(survivor_root)
    
    # 1. Torso / Jacket (With localized thermal heat signature)
    bpy.ops.mesh.primitive_cylinder_add(vertices=16, radius=0.22, depth=0.6, location=(0, 0, 0.2), rotation=(0, 1.2, 0.4))
    torso = bpy.context.active_object
    torso.name = "Survivor_Torso_HeatCore"
    if mat_thermal: torso.data.materials.append(mat_thermal)
    torso.parent = survivor_root
    
    # 2. Head
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.14, location=(-0.35, -0.15, 0.32))
    head = bpy.context.active_object
    head.name = "Survivor_Head"
    if mat_cloth: head.data.materials.append(mat_cloth)
    head.parent = survivor_root
    
    # 3. Occluding Concrete Rubble Slab (Blocks direct view from Viewpoint 1)
    mat_concrete = bpy.data.materials.get("AURIS_RubbleConcrete")
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-0.4, -0.6, 0.8), rotation=(0.4, -0.3, 0.2))
    occluding_slab = bpy.context.active_object
    occluding_slab.name = "Occluding_Rubble_Slab"
    occluding_slab.scale = (1.8, 1.4, 0.25)
    bpy.ops.object.transform_apply(scale=True)
    if mat_concrete: occluding_slab.data.materials.append(mat_concrete)
    occluding_slab.parent = survivor_root
    
    return survivor_root
