import { useEffect, useRef, useState } from "react";

interface SovereignWebGLStageProps {
  isLowPerformance?: boolean;
}

export default function SovereignWebGLStage({ isLowPerformance = false }: SovereignWebGLStageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1000, height: 1000 });

  // Native refs to prevent high frequency React stale render cycles
  const mouseRef = useRef({ x: 0, y: 0 });
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const mouseVelocityRef = useRef(0);

  const scrollProgressRef = useRef(0);
  const lastScrollYRef = useRef(0);
  const scrollSpeedRef = useRef(0);

  // High-precision smooth trackers for jitter remediation
  const smoothScrollProgressRef = useRef(0);
  const depthScaleRef = useRef(1.0);

  // Set up listeners for resize and native tracking
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        // Conditionally downscale buffer width/height by 45% (which drops pixel burden by nearly 70%)
        const scale = isLowPerformance ? 0.55 : 1.0;
        setDimensions({
          width: Math.max(200, Math.round(rect.width * scale)),
          height: Math.max(200, Math.round(rect.height * scale)),
        });
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse positions to -0.5 to 0.5 coordinate space
      const xNorm = e.clientX / window.innerWidth - 0.5;
      const yNorm = e.clientY / window.innerHeight - 0.5;
      mouseRef.current = { x: xNorm, y: yNorm };
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = (document.documentElement.scrollHeight - window.innerHeight) || 1;
      scrollProgressRef.current = Math.min(1.0, Math.max(0.0, scrollY / maxScroll));

      // Calculate instant drag velocity
      const diff = Math.abs(scrollY - lastScrollYRef.current);
      scrollSpeedRef.current = scrollSpeedRef.current * 0.84 + diff * 0.16;
      lastScrollYRef.current = scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isLowPerformance]);

  // Set up the WebGL engine & compile the custom 4D depth buffer shader
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { alpha: true });
    if (!gl) {
      console.warn("WebGL not supported in host environment context.");
      return;
    }

    // Vertex Shader Source
    const vsSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Fragment Shader Source embodying a true 4D screen-space depth corridor with conditional optimizations
    const fsSource = `
      ${isLowPerformance ? "precision mediump float;" : "precision highp float;"}
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;
      uniform float u_scroll;
      uniform float u_mouse_velocity;
      uniform float u_scroll_speed;
      uniform float u_depth_scale;

      // Pseudo-random noise for volumetric drift simulation
      float noise(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      void main() {
        // Compute screen-space normalized coordinates
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        vec2 p = uv - 0.5;
        p.x *= u_resolution.x / u_resolution.y;

        // Perspective-based mouse parallax offset & drift
        vec2 mouseOffset = u_mouse * 0.15;
        
        // Volumetric drift cycle
        float driftAngle = u_time * 0.15;
        vec2 drift = vec2(sin(driftAngle), cos(driftAngle)) * 0.04;
        
        // Apply camera shift warp
        p += mouseOffset + drift;

        // Spherical polar coordinate mappings mapping perspective
        float r = length(p);
        float theta = atan(p.y, p.x);

        // Simulated infinite depth corridor calculation (true virtual room entrance corridor)
        // Guard against division by zero at the center point
        float depth = 1.0 / (r + 0.008);
        
        // Real-time interactive warp speed modulations
        float kineticImpact = mix(u_mouse_velocity * 0.8, u_scroll_speed * 1.5, 0.5);
        float accelerationFactor = clamp(kineticImpact * 0.12, 0.0, 0.85);
        
        // Offset deep layers by scroll progression + kinetic warp acceleration with high precision, mouse velocity guided depth scaling
        float depthLayers = (depth * u_depth_scale) - u_scroll * 6.5 - (u_time * 0.25) * (1.0 + accelerationFactor * 2.0);

        // Grid-based structural divisions mapping luxurious portal lines
        // 8-way architectural support ribs extending into depth center
        float ribGrid = step(0.965, cos(theta * 8.0)) * step(0.2, r);

        // Circular geometric portal rings pulsing through high accuracy depth coordinates
        float rings = step(0.94 - (accelerationFactor * 0.05), fract(depthLayers * 0.4));

        // Depth cueing opacity modulation to fade distant points to absolute blackness
        float depthCue = smoothstep(1.3, 0.04, r);

        // Shift color profile dynamically between Room Stages:
        // Section 1: Deep Aegean Blue -> Section 2-3: Gold -> Section 4: Searing Boutique Orange
        vec3 colAegean = vec3(0.06, 0.37, 0.71);    // Aegean Blue
        vec3 colGold = vec3(0.77, 0.72, 0.62);      // Champagne Gold
        vec3 colBoutique = vec3(1.0, 0.29, 0.0);    // Searing Boutique Orange

        vec3 currentSecColor;
        if (u_scroll < 0.33) {
          float t = u_scroll / 0.33;
          currentSecColor = mix(colAegean, colGold, t);
        } else if (u_scroll < 0.66) {
          float t = (u_scroll - 0.33) / 0.33;
          currentSecColor = mix(colGold, colGold * 1.1, t);
        } else {
          float t = (u_scroll - 0.66) / 0.34;
          currentSecColor = mix(colGold * 1.1, colBoutique, t);
        }

        // Add procedural light sweeps emitting from the central depth focal point
        float focalSweep = 0.045 / (r + 0.002);
        
        // Procedural volumetric drift fog using screen space noise patterns (skip noise math on low performance specs)
        float volumetricDrift = ${isLowPerformance ? "0.0" : "noise(uv * 12.0 + vec2(0.0, u_time * 0.8)) * 0.045 * (1.0 - r)"};

        // Final wireframe architecture glow intensities
        vec3 structureColor = currentSecColor * (ribGrid * 1.4 + rings * 2.2);
        vec3 combinedColor = structureColor + currentSecColor * (focalSweep + volumetricDrift);

        // Modulate buffer opacity dynamically with real-time mouse/scroll acceleration sparks
        float baseOpacity = 0.04 + (0.16 * (1.0 - accelerationFactor));
        float finalAlpha = baseOpacity * depthCue;

        gl_FragColor = vec4(combinedColor, finalAlpha);
      }
    `;

    // Shader Compile Utility
    const compileShader = (source: string, type: number): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compilation issue found: ", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compileShader(vsSource, gl.VERTEX_SHADER);
    const fs = compileShader(fsSource, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;

    // Link Program
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("WebGL linkage failed:", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Setup geometric full-screen plane buffer (two triangles mapping viewport)
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([
      -1, -1, 
       1, -1, 
      -1,  1, 
      -1,  1, 
       1, -1, 
       1,  1,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    // Retrieve uniform locations
    const resLoc = gl.getUniformLocation(program, "u_resolution");
    const timeLoc = gl.getUniformLocation(program, "u_time");
    const mouseLoc = gl.getUniformLocation(program, "u_mouse");
    const scrollLoc = gl.getUniformLocation(program, "u_scroll");
    const mVelLoc = gl.getUniformLocation(program, "u_mouse_velocity");
    const sSpdLoc = gl.getUniformLocation(program, "u_scroll_speed");
    const depthScaleLoc = gl.getUniformLocation(program, "u_depth_scale");

    let animId: number;
    let startTime = Date.now();

    const render = () => {
      const mX = mouseRef.current.x;
      const mY = mouseRef.current.y;

      // Calculate dynamic mouse velocity damping between animation frames
      const dx = mX - lastMouseRef.current.x;
      const dy = mY - lastMouseRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      // Decay previous velocity and add instant impulse
      mouseVelocityRef.current = mouseVelocityRef.current * 0.94 + dist * 0.06;
      lastMouseRef.current = { x: mX, y: mY };

      // Slow scroll speed decay
      scrollSpeedRef.current *= 0.94;

      // Higher precision linear interpolation function based on mouse velocity
      // to compute depth-scaling to avoid scrolling jitter.
      const targetDepthScale = 1.0 + scrollProgressRef.current * 2.5; 
      
      // Interpolation speed is dynamically shaped by mouse velocity to prevent high-frequency jitter
      const kLerp = Math.max(0.005, Math.min(0.15, 0.05 - mouseVelocityRef.current * 0.2));
      
      // Perform 64-bit precision linear interpolation
      depthScaleRef.current = depthScaleRef.current * (1.0 - kLerp) + targetDepthScale * kLerp;

      // High-precision smooth scroll tracking
      const targetScroll = scrollProgressRef.current;
      const scrollLerp = Math.max(0.01, Math.min(0.15, 0.06 - mouseVelocityRef.current * 0.15));
      smoothScrollProgressRef.current = smoothScrollProgressRef.current * (1.0 - scrollLerp) + targetScroll * scrollLerp;

      // Set viewport frame clear
      gl.viewport(0, 0, dimensions.width, dimensions.height);
      gl.clear(gl.COLOR_BUFFER_BIT);

      // Pass parameters to uniform hooks
      gl.uniform2f(resLoc, dimensions.width, dimensions.height);
      gl.uniform1f(timeLoc, (Date.now() - startTime) * 0.001);
      gl.uniform2f(mouseLoc, mX, mY);
      gl.uniform1f(scrollLoc, smoothScrollProgressRef.current);
      gl.uniform1f(mVelLoc, mouseVelocityRef.current);
      gl.uniform1f(sSpdLoc, Math.min(scrollSpeedRef.current * 0.06, 3.5)); // Normalized scroll speed
      gl.uniform1f(depthScaleLoc, depthScaleRef.current);

      // Execute vertex draw
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      gl.deleteBuffer(positionBuffer);
      gl.deleteProgram(program);
    };
  }, [dimensions, isLowPerformance]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen z-10"
    >
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full pointer-events-none block"
      />
    </div>
  );
}
