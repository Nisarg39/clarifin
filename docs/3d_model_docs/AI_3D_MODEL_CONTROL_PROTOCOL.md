# AI 3D Model Control Protocol

Version: 1.0

## Purpose

This document defines how the AI assistant must interact with React Three Fiber models generated using gltfjsx.

The AI must treat every model as a structured scene graph.

The AI must never guess.

Every modification must target a specific node, mesh, material, group, animation, camera, light, or transform.

---

# Model Architecture

All models are generated using:

```bash
npx gltfjsx model.glb --transform --keepnames --types
```

The generated component exposes:

```tsx
const { nodes, materials, animations } = useGLTF(...)
```

The AI must operate only through these exposed structures.

---

# Scene Graph Rules

The AI must first build a scene graph.

Example:

```json
{
  "Body": {
    "type": "mesh"
  },
  "Wheel_FL": {
    "type": "mesh"
  },
  "Wheel_FR": {
    "type": "mesh"
  }
}
```

Before performing any modification:

1. Identify target node.
2. Verify node exists.
3. Verify node type.
4. Apply change.

Never modify unidentified objects.

---

# Allowed Operations

## Transform

Allowed:

```tsx
position
rotation
scale
```

Examples:

```tsx
position={[x,y,z]}
rotation={[x,y,z]}
scale={1.5}
```

---

## Visibility

Allowed:

```tsx
visible={true}
visible={false}
```

---

## Material

Allowed:

```tsx
material
material-color
roughness
metalness
opacity
transparent
emissive
emissiveIntensity
```

Example:

```tsx
material-color="#ff0000"
```

---

## Geometry

Allowed:

```tsx
geometry={nodes.Mesh.geometry}
```

The AI may swap geometry only when explicitly requested.

---

## Shadows

Allowed:

```tsx
castShadow
receiveShadow
```

---

## Animation

Allowed:

```tsx
useAnimations()
actions["Animation"]
```

The AI may:

* play animation
* pause animation
* stop animation
* crossfade animation
* change animation speed

Example:

```tsx
actions.Run.play()
```

---

# Camera Controls

Allowed:

```tsx
camera.position
camera.rotation
camera.fov
camera.near
camera.far
```

Never recreate camera unless requested.

---

# Lighting Controls

Allowed:

```tsx
ambientLight
directionalLight
spotLight
pointLight
rectAreaLight
```

Properties:

```tsx
intensity
position
color
distance
angle
penumbra
```

---

# Hierarchy Rules

Always preserve hierarchy.

Bad:

```tsx
Move child mesh outside parent group
```

Good:

```tsx
Modify child transform
Keep parent relationship
```

Never destroy hierarchy unless requested.

---

# Mesh Selection Logic

If user says:

"make wheel bigger"

AI must:

1. Search scene graph.
2. Find nodes containing:

Wheel
wheel
tyre
tire

3. Return candidate list.
4. Choose most likely node.

Never edit random mesh.

---

# Screenshot Modification Workflow

If screenshot is provided:

Step 1:
Identify visual target.

Step 2:
Map visual target to scene graph node.

Step 3:
Generate modification plan.

Step 4:
Generate code change.

Step 5:
Describe expected result.

Never directly edit code from screenshot alone.

---

# Code Generation Rules

AI must produce minimal diffs.

Bad:

Rewrite entire component.

Good:

Modify only affected node.

Example:

```tsx
// BEFORE
<mesh
  geometry={nodes.Wheel.geometry}
  scale={1}
/>

// AFTER
<mesh
  geometry={nodes.Wheel.geometry}
  scale={1.3}
/>
```

---

# Forbidden Actions

Never:

* Delete entire model
* Rename nodes arbitrarily
* Break hierarchy
* Mutate GLTF source files
* Remove animations
* Remove materials
* Rewrite unrelated code
* Rebuild entire component

---

# Material Intelligence

AI should recognize:

```txt
Glass
Metal
Plastic
Fabric
Wood
Stone
Water
Emission
```

Suggested mappings:

Glass:

* transmission
* opacity
* thickness

Metal:

* metalness
* roughness

Plastic:

* low metalness
* medium roughness

---

# Performance Rules

Prefer:

```tsx
useMemo
Instances
Merged geometry
```

Avoid:

```tsx
Creating new geometry every render
Creating new material every render
```

---

# Validation Checklist

Before final response:

[ ] Target node identified

[ ] Node exists

[ ] Change isolated

[ ] Hierarchy preserved

[ ] Materials preserved

[ ] Animation preserved

[ ] Performance unaffected

[ ] Expected visual outcome described

If any item fails:
STOP and ask for clarification.

---

# AI Decision Tree

User Request
↓
Identify Object
↓
Locate Node
↓
Locate Material
↓
Locate Animation
↓
Generate Minimal Change
↓
Validate
↓
Return Patch

Never skip steps.
