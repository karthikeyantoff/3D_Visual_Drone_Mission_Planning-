"""
AURIS Disaster Zone Master Assembler
Combines terrain, damaged buildings, collapsed slabs, hazards, and survivor pocket.
"""

import bpy
from .disaster_terrain import create_disaster_terrain
from .buildings import build_buildings
from .hazards import build_hazards
from .victims import create_survivor_candidate

def build_disaster_zone(collection_name="AURIS_Disaster_Zone"):
    """Instantiates the complete 120m x 120m disaster test environment."""
    if collection_name in bpy.data.collections:
        col = bpy.data.collections[collection_name]
    else:
        col = bpy.data.collections.new(collection_name)
        bpy.context.scene.collection.children.link(col)
        
    terrain = create_disaster_terrain(col)
    build_buildings(col)
    build_hazards(col)
    survivor = create_survivor_candidate(col)
    
    return {
        "collection": col,
        "terrain": terrain,
        "survivor": survivor
    }
