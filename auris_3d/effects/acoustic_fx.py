"""
AURIS Sensor FX - Directional Acoustic Wave Propagation & DOA Vector
Generates expanding sound wave rings and microphone array beamforming cone.
"""

import bpy
from ..config import SCENARIO_COORDINATES

def create_acoustic_waves(collection):
    """Creates expanding sound ripple rings originating from the trapped victim."""
    mat_acoustic = bpy.data.materials.get("AURIS_GlowBlue")
    vic_loc = SCENARIO_COORDINATES["VICTIM_LOCATION"]
    
    acoustic_root = bpy.data.objects.new("Acoustic_Localization_FX", None)
    acoustic_root.location = vic_loc
    collection.objects.link(acoustic_root)
    
    rings = []
    for r in range(4):
        radius = 1.2 + (r * 1.5)
        bpy.ops.mesh.primitive_torus_add(
            major_radius=radius,
            minor_radius=0.03,
            location=(0, 0, 0.4 + (r * 0.2))
        )
        ring = bpy.context.active_object
        ring.name = f"SoundWave_Ring_{r+1}"
        if mat_acoustic: ring.data.materials.append(mat_acoustic)
        ring.parent = acoustic_root
        rings.append(ring)
        
    return acoustic_root, rings
