"""
AURIS AI FX - Volumetric Uncertainty & "Not Detected ≠ Not Present" Indicator
Generates the 3D uncertainty bounding frustum and status callout.
"""

import bpy
from ..config import SCENARIO_COORDINATES

def create_uncertainty_volume(collection):
    """Creates a glowing yellow-orange bounding zone around the occluded target."""
    mat_uncertain = bpy.data.materials.get("AURIS_GlowUncertain")
    vic_loc = SCENARIO_COORDINATES["VICTIM_LOCATION"]
    
    unc_root = bpy.data.objects.new("AURIS_Uncertainty_Zone", None)
    unc_root.location = (vic_loc[0], vic_loc[1], vic_loc[2] + 0.6)
    collection.objects.link(unc_root)
    
    # 1. Wireframe / Bounding Box Corners
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0, 0))
    box = bpy.context.active_object
    box.name = "Uncertainty_Bounding_Cube"
    box.scale = (2.2, 2.2, 1.8)
    bpy.ops.object.transform_apply(scale=True)
    if mat_uncertain: box.data.materials.append(mat_uncertain)
    box.parent = unc_root
    
    # Set to Wireframe display so it looks like a tactical volumetric boundary
    box.display_type = 'WIRE'
    
    return unc_root
