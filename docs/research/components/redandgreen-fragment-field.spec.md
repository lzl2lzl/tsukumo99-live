# redandgreen Fragment Field Specification

- Target: `claude design/motion-elements/exact-04-redandgreen-fragments.html`
- Interaction model: time-driven fixed WebGL scene; original can amplify deformation from audio analyser data.
- Original geometry: 36 instances arranged `6×6`, each base plane `100×100`.
- Per-instance data: aligned position, random expanded XYZ position, random time scales `.3…1`, left/right edge position, color flag.
- Homepage MV parameters: `cameraZ=1000`, `oscRange=500`, `noiseRange=500`, `alignPositionLevel=0`, monochrome sampled video.
- Vertex displacement combines three-axis sine oscillation and 3D Simplex Noise.
- Texture X is distorted by `tan(tangentTime + uv.y*tangentCycle) * tangentAmp`.
- Recreation must remain a field of 36 independently moving rectangular samples, never a single blob.
