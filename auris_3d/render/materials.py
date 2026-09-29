"""
AURIS 3D Materials Library
Creates procedural PBR materials using Blender's Shader Nodes.
"""

import bpy
from ..config import COLORS

def get_or_create_material(name: str):
    """Retrieves existing material or creates a new node-enabled material."""
    if name in bpy.data.materials:
        return bpy.data.materials[name]
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    return mat

def create_carbon_fiber_mat():
    mat = get_or_create_material("AURIS_CarbonFiber")
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()
    
    output = nodes.new(type='ShaderNodeOutputMaterial')
    bsdf = nodes.new(type='ShaderNodeBsdfPrincipled')
    bsdf.inputs['Base Color'].default_value = COLORS["CARBON_FIBER"]
    bsdf.inputs['Roughness'].default_value = 0.28
    bsdf.inputs['Metallic'].default_value = 0.15
    
    # Procedural weave wave texture
    tex_wave = nodes.new(type='ShaderNodeTexWave')
    tex_wave.inputs['Scale'].default_value = 80.0
    tex_wave.inputs['Distortion'].default_value = 1.2
    
    bump = nodes.new(type='ShaderNodeBump')
    bump.inputs['Strength'].default_value = 0.15
    
    links.new(tex_wave.outputs['Color'], bump.inputs['Height'])
    links.new(bump.outputs['Normal'], bsdf.inputs['Normal'])
    links.new(bsdf.outputs['BSDF'], output.inputs['Surface'])
    return mat

def create_anodized_metal_mat(name="AURIS_DarkMetal", color=COLORS["ALUMINUM_DARK"]):
    mat = get_or_create_material(name)
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()
    
    output = nodes.new(type='ShaderNodeOutputMaterial')
    bsdf = nodes.new(type='ShaderNodeBsdfPrincipled')
    bsdf.inputs['Base Color'].default_value = color
    bsdf.inputs['Metallic'].default_value = 0.92
    bsdf.inputs['Roughness'].default_value = 0.22
    
    links.new(bsdf.outputs['BSDF'], output.inputs['Surface'])
    return mat

def create_white_chassis_mat():
    mat = get_or_create_material("AURIS_WhiteChassis")
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()
    
    output = nodes.new(type='ShaderNodeOutputMaterial')
    bsdf = nodes.new(type='ShaderNodeBsdfPrincipled')
    bsdf.inputs['Base Color'].default_value = COLORS["WHITE_CHASSIS"]
    bsdf.inputs['Roughness'].default_value = 0.35
    bsdf.inputs['Metallic'].default_value = 0.05
    
    links.new(bsdf.outputs['BSDF'], output.inputs['Surface'])
    return mat

def create_emission_mat(name: str, color, strength=5.0):
    mat = get_or_create_material(name)
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()
    
    output = nodes.new(type='ShaderNodeOutputMaterial')
    emission = nodes.new(type='ShaderNodeEmission')
    emission.inputs['Color'].default_value = color
    emission.inputs['Strength'].default_value = strength
    
    links.new(emission.outputs['Emission'], output.inputs['Surface'])
    return mat

def create_glass_lens_mat(name="AURIS_CameraGlass"):
    mat = get_or_create_material(name)
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()
    
    output = nodes.new(type='ShaderNodeOutputMaterial')
    bsdf = nodes.new(type='ShaderNodeBsdfPrincipled')
    bsdf.inputs['Base Color'].default_value = (0.9, 0.95, 1.0, 1.0)
    bsdf.inputs['Roughness'].default_value = 0.02
    bsdf.inputs['Transmission Weight'].default_value = 0.98
    bsdf.inputs['IOR'].default_value = 1.52
    
    links.new(bsdf.outputs['BSDF'], output.inputs['Surface'])
    return mat

def create_rubble_concrete_mat():
    mat = get_or_create_material("AURIS_RubbleConcrete")
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()
    
    output = nodes.new(type='ShaderNodeOutputMaterial')
    bsdf = nodes.new(type='ShaderNodeBsdfPrincipled')
    bsdf.inputs['Base Color'].default_value = COLORS["CONCRETE_DARK"]
    bsdf.inputs['Roughness'].default_value = 0.88
    
    noise = nodes.new(type='ShaderNodeTexNoise')
    noise.inputs['Scale'].default_value = 25.0
    noise.inputs['Detail'].default_value = 6.0
    
    bump = nodes.new(type='ShaderNodeBump')
    bump.inputs['Strength'].default_value = 0.6
    
    links.new(noise.outputs['Fac'], bump.inputs['Height'])
    links.new(bump.outputs['Normal'], bsdf.inputs['Normal'])
    links.new(bsdf.outputs['BSDF'], output.inputs['Surface'])
    return mat

def setup_all_materials():
    """Initializes and registers all core materials in the blend file."""
    create_carbon_fiber_mat()
    create_anodized_metal_mat("AURIS_DarkMetal", COLORS["ALUMINUM_DARK"])
    create_anodized_metal_mat("AURIS_RawMetal", COLORS["ALUMINUM_RAW"])
    create_anodized_metal_mat("AURIS_OrangeMetal", COLORS["ORANGE_ACCENT"])
    create_white_chassis_mat()
    create_glass_lens_mat()
    create_rubble_concrete_mat()
    
    # Glowing Technical materials
    create_emission_mat("AURIS_GlowCyan", COLORS["CYAN_GLOW"], strength=8.0)
    create_emission_mat("AURIS_GlowBlue", COLORS["BLUE_ACCENT"], strength=6.0)
    create_emission_mat("AURIS_GlowLidar", COLORS["LIDAR_GREEN"], strength=7.0)
    create_emission_mat("AURIS_GlowThermal", COLORS["THERMAL_HOT"], strength=6.0)
    create_emission_mat("AURIS_GlowUncertain", COLORS["UNCERTAINTY_YELLOW"], strength=5.0)
    create_emission_mat("AURIS_GlowHazard", COLORS["HAZARD_RED"], strength=8.0)
    create_emission_mat("AURIS_NavStrobe_Red", (1.0, 0.05, 0.05, 1.0), strength=12.0)
    create_emission_mat("AURIS_NavStrobe_Green", (0.05, 1.0, 0.1, 1.0), strength=12.0)
    create_emission_mat("AURIS_NavStrobe_White", (1.0, 1.0, 1.0, 1.0), strength=15.0)
