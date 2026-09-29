"""
AURIS AI FX - Next-Best-View (NBV) Tactical Flight Corridor & Risk Contours
Generates glowing flight trajectory splines and hazard exclusion zones.
"""

import bpy
from ..config import SCENARIO_COORDINATES

def create_nbv_trajectory_curve(collection):
    """Generates a smooth glowing 3D flight trajectory from Viewpoint 1 to Viewpoint 2."""
    mat_cyan = bpy.data.materials.get("AURIS_GlowCyan")
    
    vp1 = SCENARIO_COORDINATES["IMPERFECT_VIEWPOINT_01"]
    vp2 = SCENARIO_COORDINATES["NEXT_BEST_VIEWPOINT_02"]
    
    # Create Curve Data
    curve_data = bpy.data.curves.new(name="NBV_Flight_Path_Data", type='CURVE')
    curve_data.dimensions = '3D'
    curve_data.bevel_depth = 0.04
    curve_data.bevel_resolution = 4
    
    # Add Spline
    spline = curve_data.splines.new(type='BEZIER')
    spline.bezier_points.add(1) # Total 2 points
    
    # Point 1 (Current View)
    p0 = spline.bezier_points[0]
    p0.co = vp1
    p0.handle_left = (vp1[0] - 1.0, vp1[1] - 1.0, vp1[2])
    p0.handle_right = (vp1[0] + 2.0, vp1[1] + 3.0, vp1[2] + 0.5)
    
    # Point 2 (Next Best View)
    p1 = spline.bezier_points[1]
    p1.co = vp2
    p1.handle_left = (vp2[0] - 2.0, vp2[1] - 3.0, vp2[2] + 0.5)
    p1.handle_right = (vp2[0] + 1.0, vp2[1] + 1.0, vp2[2])
    
    # Curve Object
    curve_obj = bpy.data.objects.new("AURIS_NBV_Trajectory_Ribbon", curve_data)
    if mat_cyan: curve_obj.data.materials.append(mat_cyan)
    
    collection.objects.link(curve_obj)
    return curve_obj

def create_risk_contours(collection):
    """Creates glowing red risk exclusion perimeter circles around fire & electrical hazard zones."""
    mat_hazard = bpy.data.materials.get("AURIS_GlowHazard")
    
    fire_loc = SCENARIO_COORDINATES["FIRE_HAZARD_ZONE"]
    
    bpy.ops.mesh.primitive_torus_add(
        major_radius=9.0,
        minor_radius=0.06,
        location=(fire_loc[0], fire_loc[1], 0.25)
    )
    risk_ring = bpy.context.active_object
    risk_ring.name = "Fire_Hazard_Exclusion_Zone"
    if mat_hazard: risk_ring.data.materials.append(mat_hazard)
    
    collection.objects.link(risk_ring)
    bpy.context.scene.collection.objects.unlink(risk_ring)
    return risk_ring
