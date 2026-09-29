"""
AURIS Disaster Environment - Terrain & Roads
Generates ground elevation, cracked asphalt, road markings, and debris textures.
"""

import bpy
import bmesh
import random
from ..config import COLORS

def create_disaster_terrain(collection):
    """Creates a 120m x 120m disaster ground terrain with elevation fractures."""
    mat_asphalt = bpy.data.materials.get("AURIS_RubbleConcrete")
    
    # Base terrain grid
    bpy.ops.mesh.primitive_grid_add(x_subdivisions=40, y_subdivisions=40, size=140.0, location=(0, 0, -0.05))
    ground = bpy.context.active_object
    ground.name = "Disaster_Ground_Terrain"
    if mat_asphalt:
        ground.data.materials.append(mat_asphalt)
        
    # Deform terrain procedurally to create seismic fractures and earthquake bumps
    bm = bmesh.new()
    bm.from_mesh(ground.data)
    
    random.seed(42)
    for vert in bm.verts:
        dist_from_center = (vert.co.x**2 + vert.co.y**2)**0.5
        # Add subtle natural terrain roughness
        noise_z = (random.random() - 0.5) * 0.4
        
        # Earthquake fault line fracture along X axis
        if abs(vert.co.y - 8.0) < 6.0:
            noise_z -= (random.random() * 0.8) + 0.3
            
        vert.co.z += noise_z
        
    bm.to_mesh(ground.data)
    bm.free()
    
    # Smooth shading
    for poly in ground.data.polygons:
        poly.use_smooth = True
        
    collection.objects.link(ground)
    bpy.context.scene.collection.objects.unlink(ground)
    return ground
