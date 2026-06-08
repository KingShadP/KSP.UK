import { useEffect, useRef, useState } from "react";

interface SovereignWebGLStageProps {
  isLowPerformance?: boolean;
  paradoxMode?: boolean;
}

export default function SovereignWebGLStage({ isLowPerformance = false, paradoxMode = false }: SovereignWebGLStageProps) {
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

  const targetParadoxRatioRef = useRef(0.0);
  const currentParadoxRatioRef = useRef(0.0);

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
      uniform float u_paradox_ratio;

      // Pseudo-random noise for volumetric space mist and star distribution
      float noise(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      void main() {
        // Compute screen-space normalized coordinates
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        vec2 p = uv - 0.5;
        p.x *= u_resolution.x / u_resolution.y;

        // Perspective-based mouse parallax offset & celestial drift
        vec2 mouseOffset = u_mouse * 0.12;
        
        // Soft gravity pull celestial drift cycle
        float driftAngle = u_time * 0.08;
        vec2 drift = vec2(sin(driftAngle), cos(driftAngle)) * 0.03;
        
        // Apply camera shift warp
        p += mouseOffset + drift;

        // Spherical polar coordinate mappings for space geometries
        float r = length(p);
        float theta = atan(p.y, p.x);

        // Real-time interactive cosmic velocity effects
        float kineticImpact = mix(u_mouse_velocity * 0.5, u_scroll_speed * 1.0, 0.4);
        float accelerationFactor = clamp(kineticImpact * 0.10, 0.0, 0.70);

        // 1. STARFIELD GENERATION (Aesthetic, glittering stardust space)
        float stars = 0.0;
        
        // First background layer: Micro-stardust
        vec2 st1 = p * 15.0;
        vec2 ip1 = floor(st1);
        vec2 fp1 = fract(st1) - 0.5;
        float h1 = noise(ip1);
        if (h1 > 0.91) {
          float twinkle = sin(u_time * 1.5 + h1 * 6.28) * 0.5 + 0.5;
          stars += smoothstep(0.05, 0.0, length(fp1)) * twinkle * 0.22;
        }

        // Second background layer: Mid-distance stars
        vec2 st2 = p * 28.0;
        vec2 ip2 = floor(st2);
        vec2 fp2 = fract(st2) - 0.5;
        float h2 = noise(ip2 + vec2(37.4, 82.1));
        if (h2 > 0.955) {
          float twinkle = sin(u_time * 2.8 + h2 * 6.28) * 0.5 + 0.5;
          stars += smoothstep(0.11, 0.0, length(fp2)) * twinkle * 0.38;
        }

        // Third background layer: Closer sparkling stellar points
        vec2 st3 = p * 45.0;
        vec2 ip3 = floor(st3);
        vec2 fp3 = fract(st3) - 0.5;
        float h3 = noise(ip3 + vec2(13.9, 44.8));
        if (h3 > 0.985) {
          float twinkle = sin(u_time * 4.2 + h3 * 6.28) * 0.5 + 0.5;
          stars += smoothstep(0.16, 0.0, length(fp3)) * twinkle * 0.55;
        }

        // 2. SOVEREIGN COSMIC SYSTEM (Concentric Hairline Planetary Orbits)
        // 4 elegant concentric blueprint circles mapping luxurious planetary paths
        float orbit1 = smoothstep(0.0016, 0.0, abs(r - 0.16));
        float orbit2 = smoothstep(0.0013, 0.0, abs(r - 0.30));
        float orbit3 = smoothstep(0.0010, 0.0, abs(r - 0.46));
        float orbit4 = smoothstep(0.0008, 0.0, abs(r - 0.65));
        float orbits = (orbit1 * 0.07) + (orbit2 * 0.05) + (orbit3 * 0.04) + (orbit4 * 0.03);

        // 3. CELESTIAL PLANETARY BODIES (Glow node planets revolving on orbits)
        // Orbit 1: Inner Gold Node
        vec2 planetPos1 = vec2(cos(u_time * 0.32 + 1.5) * 0.16, sin(u_time * 0.32 + 1.5) * 0.16);
        float planetGlow1 = 0.0012 / (length(p - planetPos1) + 0.0010);

        // Orbit 2: Companion Platinum Node
        vec2 planetPos2 = vec2(cos(-u_time * 0.22 + 4.2) * 0.30, sin(-u_time * 0.22 + 4.2) * 0.30);
        float planetGlow2 = 0.0016 / (length(p - planetPos2) + 0.0010);

        // Orbit 3: Primary Crimson Overlord Planet
        vec2 planetPos3 = vec2(cos(u_time * 0.13 + 0.8) * 0.46, sin(u_time * 0.13 + 0.8) * 0.46);
        float planetGlow3 = 0.0022 / (length(p - planetPos3) + 0.0014);

        // Orbit 4: Distant Muted Star Node
        vec2 planetPos4 = vec2(cos(-u_time * 0.07 + 5.9) * 0.65, sin(-u_time * 0.07 + 5.9) * 0.65);
        float planetGlow4 = 0.0018 / (length(p - planetPos4) + 0.0016);

        float allPlanets = planetGlow1 + planetGlow2 + planetGlow3 + planetGlow4;

        // Depth cueing opacity modulation to fade distant points gracefully
        float depthCue = smoothstep(1.5, 0.02, r);

        // Universe Alpha Luxury Theme Colors: Oxblood Red (#93000a), Muted Gold (#dcc57b), Platinum (#c9c6c5)
        vec3 colOxblood = vec3(0.58, 0.00, 0.04);   // Deep Luxury Oxblood
        vec3 colGold = vec3(0.86, 0.77, 0.48);      // Muted Golden Glow
        vec3 colPlatinum = vec3(0.79, 0.78, 0.77);  // Polished Platinum

        // Universe Omega Alternate Paradox Cosmology: Deep Cobalt Indigo, Quantum Teal, Spectrometer Purple
        vec3 colCobaltIdx = vec3(0.04, 0.18, 0.46); // Royal Quantum Cobalt Deep
        vec3 colTealIdx = vec3(0.24, 0.72, 0.68);   // Luminous Emerald/Teal Ion Node
        vec3 colVioletIdx = vec3(0.54, 0.36, 0.72); // Spectra Aether Violet-Lilac

        // Smoothly warp universes using u_paradox_ratio
        vec3 finalOxblood = mix(colOxblood, colCobaltIdx, u_paradox_ratio);
        vec3 finalGold = mix(colGold, colTealIdx, u_paradox_ratio);
        vec3 finalPlatinum = mix(colPlatinum, colVioletIdx, u_paradox_ratio);

        vec3 currentSecColor;
        if (u_scroll < 0.33) {
          float t = u_scroll / 0.33;
          currentSecColor = mix(finalOxblood, finalGold, t);
        } else if (u_scroll < 0.66) {
          float t = (u_scroll - 0.33) / 0.33;
          currentSecColor = mix(finalGold, finalPlatinum, t);
        } else {
          float t = (u_scroll - 0.66) / 0.34;
          currentSecColor = mix(finalPlatinum, finalOxblood, t);
        }

        // 4. CENTRAL LUXURY SOLAR CORE Flare glow emitting from focus
        float solarCore = 0.0065 / (r + 0.0015);
        
        // Procedural cosmic nebula drift fog using coordinate scale noise
        float volumetricDrift = ${isLowPerformance ? "0.0" : "noise(uv * 8.0 + vec2(0.0, u_time * 0.3)) * 0.012 * (1.0 - r)"};

        // Combine celestial systems
        float spaceStructures = stars * 1.5 + orbits * 1.1 + allPlanets;
        vec3 combinedColor = currentSecColor * spaceStructures + currentSecColor * (solarCore + volumetricDrift);

        // Modulate buffer opacity dynamically with real-time mouse/scroll variables
        float baseOpacity = 0.009 + (0.011 * (1.0 - accelerationFactor));
        // Amplify opacity in Universe Omega for a slightly more immersive dreamlike field
        baseOpacity += 0.004 * u_paradox_ratio;

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
    const paradoxLoc = gl.getUniformLocation(program, "u_paradox_ratio");

    let animId: number;
    let startTime = Date.now();

    const render = () => {
      const mX = mouseRef.current.x;
      const mY = mouseRef.current.y;

      // Update smooth paradox interpolation state
      targetParadoxRatioRef.current = paradoxMode ? 1.0 : 0.0;
      currentParadoxRatioRef.current = currentParadoxRatioRef.current * 0.92 + targetParadoxRatioRef.current * 0.08;

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
      gl.uniform1f(paradoxLoc, currentParadoxRatioRef.current);

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
