"""
AURIS Disaster Environment - Damaged Urban Architecture & Collapsed Structures
Generates cracked concrete high-rises, collapsed floor slabs, and exposed rebar.
"""

import bpy
import random
import math

def create_damaged_tower(name, location, width=12.0, length=14.0, height=28.0, damage_side='FRONT', collection=None):
    """Creates an urban building with fractured concrete geometry."""
    mat_concrete = bpy.data.materials.get("AURIS_RubbleConcrete")
    mat_metal = bpy.data.materials.get("AURIS_DarkMetal")
    
    # Main Tower Shell
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(location[0], location[1], location[2] + height * 0.5))
    tower = bpy.context.active_object
    tower.name = name
    tower.scale = (width, length, height)
    bpy.ops.object.transform_apply(scale=True)
    if mat_concrete: tower.data.materials.append(mat_concrete)
    
    if collection:
        collection.objects.link(tower)
        bpy.context.scene.collection.objects.unlink(tower)
        
    # Exposed Steel Rebar protruding from collapsed edges
    rebar_count = 6
    for r in range(rebar_count):
        rx = location[0] + (random.random() - 0.5) * (width * 0.8)
        ry = location[1] + (random.random() - 0.5) * (length * 0.8)
        rz = location[2] + height * 0.95
        
        bpy.ops.mesh.primitive_cylinder_add(
            vertices=8,
            radius=0.03,
            depth=1.8,
            location=(rx, ry, rz),
            rotation=((random.random()-0.5)*0.8, (random.random()-0.5)*0.8, random.random()*3.14)
        )
        rebar = bpy.context.active_object
        rebar.name = f"{name}_Rebar_{r}"
        if mat_metal: rebar.data.materials.append(mat_metal)
        if collection:
            collection.objects.link(rebar)
            bpy.context.scene.collection.objects.unlink(rebar)
            
    return tower

def create_collapsed_slabs(name, location, count=5, collection=None):
    """Creates a realistic pile of shattered concrete slabs and rubble."""
    mat_concrete = bpy.data.materials.get("AURIS_RubbleConcrete")
    
    slabs = []
    for i in range(count):
        sx = 4.5 + random.random() * 3.0
        sy = 3.5 + random.random() * 2.5
        sz = 0.35 + random.random() * 0.25
        
        lx = location[0] + (random.random() - 0.5) * 4.0
        ly = location[1] + (random.random() - 0.5) * 4.0
        lz = location[2] + (i * 0.45)
        
        rot = (
            (random.random() - 0.5) * 0.45,
            (random.random() - 0.5) * 0.45,
            random.random() * 3.14
        )
        
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(lx, ly, lz), rotation=rot)
        slab = bpy.context.active_object
        slab.name = f"{name}_Slab_{i+1}"
        slab.scale = (sx, sy, sz)
        bpy.ops.object.transform_apply(scale=True)
        if mat_concrete: slab.data.materials.append(mat_concrete)
        
        if collection:
            collection.objects.link(slab)
            bpy.context.scene.collection.objects.unlink(slab)
        slabs.append(slab)
        
    return slabs

def build_buildings(collection):
    """Populates the 8 scenario zones with realistic urban disaster architecture."""
    # Sector A: High-Rise Damaged Urban District
    create_damaged_tower("Tower_A1", location=(-35.0, 25.0, 0), width=16.0, length=18.0, height=35.0, collection=collection)
    create_damaged_tower("Tower_A2", location=(-38.0, -10.0, 0), width=14.0, length=15.0, height=26.0, collection=collection)
    
    # Sector B: Collapsed Structure / Rubble Ground Zero (Where Victim is trapped)
    create_damaged_tower("Half_Collapsed_B1", location=(22.0, 20.0, 0), width=14.0, length=14.0, height=12.0, collection=collection)
    create_collapsed_slabs("Rubble_GroundZero", location=(16.0, 11.0, 0), count=7, collection=collection)
    create_collapsed_slabs("Rubble_Roadblock", location=(2.0, 8.0, 0), count=4, collection=collection)
    
    # Sector F: Peripheral Search Zone Structures
    create_damaged_tower("Tower_F1", location=(35.0, -25.0, 0), width=12.0, length=12.0, height=22.0, collection=collection)
    create_damaged_tower("Tower_F2", location=(-20.0, -35.0, 0), width=15.0, length=12.0, height=18.0, collection=collection)
