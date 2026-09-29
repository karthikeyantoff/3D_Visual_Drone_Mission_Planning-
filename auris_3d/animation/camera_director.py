"""
AURIS Camera Director - Cinematic Multi-Shot Automation
Coordinates 9 camera setups, focal lengths, depth-of-field, and tracking paths.
"""

import bpy
import math

def setup_cinematic_camera(drone_root, collection_name="AURIS_Camera_Collection"):
    """Creates and animates the primary cinematic master camera."""
    if collection_name in bpy.data.collections:
        col = bpy.data.collections[collection_name]
    else:
        col = bpy.data.collections.new(collection_name)
        bpy.context.scene.collection.children.link(col)
        
    cam_data = bpy.data.cameras.new(name="AURIS_Master_Cam_Data")
    cam_data.lens = 32.0  # 32mm wide-angle cinematic lens
    cam_data.clip_start = 0.1
    cam_data.clip_end = 500.0
    
    cam_obj = bpy.data.objects.new("AURIS_Master_Camera", cam_data)
    col.objects.link(cam_obj)
    bpy.context.scene.camera = cam_obj
    
    cam_obj.animation_data_clear()
    
    def set_cam_kf(frame, loc, rot_deg, lens=32.0):
        cam_obj.location = loc
        cam_obj.rotation_euler = (
            math.radians(rot_deg[0]),
            math.radians(rot_deg[1]),
            math.radians(rot_deg[2])
        )
        cam_data.lens = lens
        cam_obj.keyframe_insert(data_path="location", frame=frame)
        cam_obj.keyframe_insert(data_path="rotation_euler", frame=frame)
        cam_data.keyframe_insert(data_path="lens", frame=frame)

    # 1. SCENE 1 (Frames 1 - 240): High Aerial Establishing Tracking Shot
    set_cam_kf(1, (0.0, -65.0, 32.0), (62, 0, 0), lens=28.0)
    set_cam_kf(240, (0.0, -32.0, 16.0), (68, 0, 0), lens=35.0)

    # 2. SCENE 2 (Frames 241 - 600): Dynamic Drone Tracking Fly-By
    set_cam_kf(241, (4.0, -22.0, 9.5), (78, 0, 15), lens=42.0)
    set_cam_kf(600, (12.0, -4.0, 7.5), (82, 0, 35), lens=50.0)

    # 3. SCENE 3 (Frames 601 - 900): Exploded Payload Close-Up (RPi 5 & Sensors)
    set_cam_kf(601, (11.8, 3.2, 6.4), (88, 0, 75), lens=75.0)
    set_cam_kf(900, (10.2, 4.1, 6.1), (84, 0, 115), lens=85.0)

    # 4. SCENE 4 (Frames 901 - 1260): HERO SCENE - Occluded Survivor & Uncertainty Box
    set_cam_kf(901, (13.5, 0.5, 6.8), (75, 0, 25), lens=40.0)
    set_cam_kf(1260, (14.0, 2.0, 6.2), (72, 0, 30), lens=45.0)

    # 5. SCENE 5 (Frames 1261 - 1590): Tactical High-Angle Next-Best-View Repositioning
    set_cam_kf(1261, (10.0, 6.0, 15.0), (52, 0, -35), lens=28.0)
    set_cam_kf(1590, (14.0, 10.0, 12.0), (55, 0, -15), lens=32.0)

    # 6. SCENE 6 (Frames 1591 - 1890): High-Confidence Verification Inspection
    set_cam_kf(1591, (19.8, 17.2, 4.2), (75, 0, -145), lens=55.0)
    set_cam_kf(1890, (19.0, 16.5, 3.8), (78, 0, -140), lens=60.0)

    # 7. SCENE 7 (Frames 1891 - 2160): Tactical Risk Heatmap Top-Down View
    set_cam_kf(1891, (0.0, 0.0, 38.0), (0, 0, 0), lens=24.0)
    set_cam_kf(2160, (0.0, 0.0, 42.0), (0, 0, 10), lens=24.0)

    # 8. SCENE 8 (Frames 2161 - 2460): Telemetry Transmission Shot
    set_cam_kf(2161, (5.0, -18.0, 19.0), (65, 0, -25), lens=35.0)
    set_cam_kf(2460, (-4.0, -16.0, 18.0), (68, 0, 15), lens=35.0)

    # 9. SCENE 9 (Frames 2461 - 2700): Final Hero Orbit & Closing Ascent
    set_cam_kf(2461, (0.0, -12.0, 21.0), (75, 0, 0), lens=32.0)
    set_cam_kf(2700, (8.0, -10.0, 27.0), (65, 0, -30), lens=28.0)

    if cam_obj.animation_data and cam_obj.animation_data.action:
        for fcurve in cam_obj.animation_data.action.fcurves:
            for kf in fcurve.keyframe_points:
                kf.interpolation = 'BEZIER'
                
    return cam_obj
