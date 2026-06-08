import { useEffect, useRef, useState } from "react";

export default function SovereignWebGLStage() {
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

  // Set up listeners for resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: Math.max(200, rect.width),
          height: Math.max(200, rect.height),
        });
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    // Native mouse tracker
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse positions to -0.5 to 0.5 coordinate space
      const xNorm = e.clientX / window.innerWidth - 0.5;
      const yNorm = e.clientY / window.innerHeight - 0.5;
      mouseRef.current = { x: xNorm, y: yNorm };
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Native scroll and speed tracker
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
  }, []);

  // Set up the WebGL engine & compile the custom 4D depth buffer shader
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Use WebGL1/WebGL2 with alpha channel
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

    // Fragment Shader Source embodying a true 4D screen-space depth buffer corridor
    const fsSource = `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;
      uniform float u_scroll;
      uniform float u_mouse_velocity;
      uniform float u_scroll_speed;

      void main() {
        // Compute screen-space normalized coordinates
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        vec2 p = uv - 0.5;
        p.x *= u_resolution.x / u_resolution.y;

        // Spherical polar coordinate mappings mapping perspective
        float r = length(p);
        float theta = atan(p.y, p.x);

        // Simulated infinite depth corridor calculation (true virtual room entrance corridor)
        float depth = 1.0 / (r + 0.015);
        
        // Offset deep layers by scroll progression
        float depthLayers = depth - u_scroll * 5.5;

        // Perspective-based mouse parallax offsets
        vec2 mouseOffset = u_mouse * 0.12;
        p += mouseOffset;

        // Modulate depth and opacity based on user interactivity velocity (interstitial depth warp)
        float totalVelocity = mix(u_mouse_velocity, u_scroll_speed, 0.45);
        float velocityWarp = clamp(totalVelocity * 0.12, 0.0, 0.95);

        // Vector grid line divisions for stereoscopic depth buffer
        float radialSectors = step(0.92, sin(theta * 10.0)) * step(0.95 + velocityWarp * 0.03, fract(depthLayers));
        
        // Circular room transition threshold rings
        float portalBands = smoothstep(0.965, 0.992, sin(depthLayers * 1.5707));

        // Shift color profile dynamically between Room Stages (Deep space cobalt at start, Amber gold, searing Boutique orange at terminal depth)
        vec3 colAtrium = vec3(0.01, 0.15, 0.42);    // Blue Space
        vec3 colBoutique = vec3(0.99, 0.29, 0.0);   // Searing Orange Gold
        vec3 ambientColor = mix(colAtrium, colBoutique, u_scroll);

        // Draw structural wireframe contours with high light intensity
        vec3 wireframeGlow = ambientColor * (radialSectors * 1.6 + portalBands * 2.5);
        
        // Depth-dependent glow falloff
        float intensityFalloff = smoothstep(1.35, 0.05, r);
        float bufferOpacity = (0.05 + 0.14 * (1.0 - velocityWarp)) * intensityFalloff;

        // Consolidate final texture output showing WebGL spatial portal depth
        vec3 finalOutput = wireframeGlow + ambientColor * (0.045 / (r + 0.002));
        gl_FragColor = vec4(finalOutput, bufferOpacity);
      }
    `;

    // Shader Compile Utility
    const compileShader = (source: string, type: number): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compiles failed: ", gl.getShaderInfoLog(shader));
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
      console.error("WebGL linkage issue found:", gl.getProgramInfoLog(program));
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

      // Set viewport frame clear
      gl.viewport(0, 0, dimensions.width, dimensions.height);
      gl.clear(gl.COLOR_BUFFER_BIT);

      // Pass parameters to uniform hooks
      gl.uniform2f(resLoc, dimensions.width, dimensions.height);
      gl.uniform1f(timeLoc, (Date.now() - startTime) * 0.001);
      gl.uniform2f(mouseLoc, mX, mY);
      gl.uniform1f(scrollLoc, scrollProgressRef.current);
      gl.uniform1f(mVelLoc, mouseVelocityRef.current);
      gl.uniform1f(sSpdLoc, Math.min(scrollSpeedRef.current * 0.06, 3.5)); // Normalized scroll speed

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
  }, [dimensions]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen z-10"
    >
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full opacity-65 pointer-events-none block"
      />
    </div>
  );
}
