"""
AURIS Technical Cyber-HUD & 3D Typography Engine
Creates readable technical labels, bounding boxes, and evidence fusion UI.
"""

import bpy
import math

def create_3d_text(name, text_content, location, scale=0.4, rotation=(0,0,0), material=None, parent=None, collection=None):
    """Creates crisp 3D technical typography in Blender."""
    font_curve = bpy.data.curves.new(type="FONT", name=f"{name}_FontData")
    font_curve.body = text_content
    font_curve.extrude = 0.008
    font_curve.bevel_depth = 0.002
    font_curve.align_x = 'CENTER'
    font_curve.align_y = 'CENTER'
    
    text_obj = bpy.data.objects.new(name, font_curve)
    text_obj.location = location
    text_obj.rotation_euler = rotation
    text_obj.scale = (scale, scale, scale)
    
    if material:
        text_obj.data.materials.append(material)
    if parent:
        text_obj.parent = parent
        
    if collection:
        collection.objects.link(text_obj)
    else:
        bpy.context.scene.collection.objects.link(text_obj)
        
    return text_obj

def build_hud_elements(collection_name="AURIS_HUD_Collection"):
    """Instantiates the key animated 3D HUD typography and tactical callouts."""
    if collection_name in bpy.data.collections:
        col = bpy.data.collections[collection_name]
    else:
        col = bpy.data.collections.new(collection_name)
        bpy.context.scene.collection.children.link(col)
        
    mat_cyan = bpy.data.materials.get("AURIS_GlowCyan")
    mat_white = bpy.data.materials.get("AURIS_WhiteChassis")
    mat_yellow = bpy.data.materials.get("AURIS_GlowUncertain")
    mat_green = bpy.data.materials.get("AURIS_GlowLidar")
    mat_hazard = bpy.data.materials.get("AURIS_GlowHazard")

    hud_items = {}
    
    # Scene 1 Title
    hud_items["Title_AURIS"] = create_3d_text(
        "HUD_Title_AURIS",
        "AURIS",
        location=(0, -28.0, 14.0),
        scale=2.2,
        rotation=(1.1, 0, 0),
        material=mat_cyan,
        collection=col
    )
    hud_items["Subtitle_AURIS"] = create_3d_text(
        "HUD_Subtitle_AURIS",
        "Autonomous Uncertainty-aware Rescue Intelligence System\nSENSE • VERIFY • DECIDE • REPLAN",
        location=(0, -28.0, 11.5),
        scale=0.65,
        rotation=(1.1, 0, 0),
        material=mat_white,
        collection=col
    )
    
    # Scene 4 Uncertainty Hero Callout
    hud_items["Uncertainty_Warning"] = create_3d_text(
        "HUD_Uncertainty_Warning",
        "EVIDENCE CONFLICT\nRGB: 61% | THERMAL: 72% | ACOUSTIC: 58%\n\n\"NOT DETECTED ≠ NOT PRESENT\"",
        location=(16.0, 8.0, 7.2),
        scale=0.55,
        rotation=(0.9, 0, 0),
        material=mat_yellow,
        collection=col
    )
    
    # Scene 5 Next-Best-View Label
    hud_items["NBV_Label"] = create_3d_text(
        "HUD_NBV_Label",
        "NEXT-BEST-VIEW CALCULATED\nAUTONOMOUS REPOSITIONING",
        location=(15.0, 10.0, 8.5),
        scale=0.5,
        rotation=(0.8, 0, 0),
        material=mat_cyan,
        collection=col
    )

    # Scene 6 Verification Label
    hud_items["Verify_Label"] = create_3d_text(
        "HUD_Verify_Label",
        "EVIDENCE FUSION COMPLETE\nRGB: 89% | THERMAL: 91% | ACOUSTIC: 84%\n\nHIGH-CONFIDENCE SURVIVOR CANDIDATE (91%)",
        location=(18.5, 13.0, 5.8),
        scale=0.48,
        rotation=(0.7, 0, 0),
        material=mat_green,
        collection=col
    )

    # Scene 7 Risk Route Label
    hud_items["Risk_Label"] = create_3d_text(
        "HUD_Risk_Label",
        "RISK-AWARE MISSION REPLAN\nHAZARD CORRIDOR AVOIDANCE ACTIVE",
        location=(-5.0, 0.0, 12.0),
        scale=0.6,
        rotation=(0.9, 0, 0),
        material=mat_hazard,
        collection=col
    )

    return hud_items
