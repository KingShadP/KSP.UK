import { useEffect, useRef, useState } from "react";
import { Camera, CameraOff } from "lucide-react";

interface ProductWireframePortalProps {
  productId: string;
  themeColor?: "red" | "gold" | "emerald";
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

export default function ProductWireframePortal({ productId, themeColor = "gold" }: ProductWireframePortalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [isHovered, setIsHovered] = useState(false);
  const scrollYRef = useRef(0);
  const [dimensions, setDimensions] = useState({ width: 280, height: 280 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Camera portal projection states
  const [cameraActive, setCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState(false);

  // Get color code matching the system palette
  const getColor = (opacity = 1.0) => {
    if (themeColor === "red") return `rgba(255, 74, 0, ${opacity})`;
    if (themeColor === "emerald") return `rgba(16, 185, 129, ${opacity})`;
    return `rgba(198, 184, 158, ${opacity})`; // Champagne Gold
  };

  // Mouse coordinate tracker for perspective modulation
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // range: -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // range: -0.5 to 0.5
    setMousePos({ x, y });
  };

  // Listen to window scroll & resize events
  useEffect(() => {
    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
    };

    const handleResize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: Math.max(150, rect.width),
          height: Math.max(150, rect.height),
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    
    // Initial resize trigger
    handleResize();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Web camera activation controller for Portal Projection Mode
  useEffect(() => {
    let activeStream: MediaStream | null = null;
    if (cameraActive) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then((s) => {
          activeStream = s;
          setStream(s);
          setCameraError(false);
          
          if (videoRef.current) {
            videoRef.current.srcObject = s;
            videoRef.current.play().catch(err => console.log("Video preview interrupted", err));
          }
          
          window.dispatchEvent(new CustomEvent("telemetry-log", {
            detail: { 
              message: `📡 [PORTAL PROJECTION] Activated live lens tracking on product [${productId}] with camera resolution feed mapping.`, 
              type: "CAMERA_RAW" 
            }
          }));
        })
        .catch((err) => {
          console.warn("Card portrait camera denied", err);
          setCameraError(true);
          window.dispatchEvent(new CustomEvent("telemetry-log", {
            detail: { 
              message: `⚠️ [PORTAL PROJECTION] Access blocked on [${productId}]. Camera busy or permissions restricted. Reverting to static mock geometry grid.`, 
              type: "WARNING" 
            }
          }));
        });
    } else {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      setStream(null);
    }

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraActive, productId]);

  // Main canvas 3D render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let angleX = 0.3;
    let angleY = 0.5;
    let angleZ = 0.1;

    // Generate customizable 3D coordinate vertices based on product IDs
    const vertices: Point3D[] = [];
    const edges: [number, number][] = [];

    const pId = productId.toLowerCase();

    if (pId.includes("chrono") || pId.includes("watch") || pId.includes("01")) {
      // TIMEPIECE: Concentric planetary gears structure with radiating coordinate nodes
      const ring1Start = vertices.length;
      const steps1 = 12;
      for (let i = 0; i < steps1; i++) {
        const rad = (i * Math.PI * 2) / steps1;
        vertices.push({ x: Math.cos(rad) * 65, y: Math.sin(rad) * 65, z: 0 });
        if (i > 0) edges.push([ring1Start + i - 1, ring1Start + i]);
      }
      edges.push([ring1Start + steps1 - 1, ring1Start]);

      const ring2Start = vertices.length;
      const steps2 = 24;
      for (let i = 0; i < steps2; i++) {
        const rad = (i * Math.PI * 2) / steps2;
        vertices.push({ x: Math.cos(rad) * 85, y: Math.sin(rad) * 85, z: 12 * Math.sin(rad * 3) });
        if (i > 0) edges.push([ring2Start + i - 1, ring2Start + i]);
      }
      edges.push([ring2Start + steps2 - 1, ring2Start]);

      const centerIdx = vertices.length;
      vertices.push({ x: 0, y: 0, z: -10 });
      const frontCenterIdx = vertices.length;
      vertices.push({ x: 0, y: 0, z: 40 });

      for (let i = 0; i < steps1; i += 2) {
        edges.push([ring1Start + i, centerIdx]);
        edges.push([ring1Start + i, frontCenterIdx]);
      }
      edges.push([centerIdx, frontCenterIdx]);

    } else if (pId.includes("chair") || pId.includes("lounge") || pId.includes("02")) {
      // LOUNGE CHAIR: Geodesic Saddle Contour space-frame
      const rows = 5;
      const cols = 5;
      const startIndex = vertices.length;

      for (let r = 0; r < rows; r++) {
        const u = r / (rows - 1);
        const theta = -Math.PI / 4 + u * (Math.PI * 1.1);
        const zCoord = Math.sin(theta) * 50;
        const yBase = -Math.cos(theta) * 55;

        for (let c = 0; c < cols; c++) {
          const v = c / (cols - 1);
          const xWidth = -65 + v * 130;
          const widthFactor = 1.0 - 0.25 * Math.sin(u * Math.PI);
          const finalX = xWidth * widthFactor;
          const finalY = yBase + (15 * Math.sin(v * Math.PI) * Math.sin(u * Math.PI));

          vertices.push({ x: finalX, y: finalY, z: zCoord });
        }
      }

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols - 1; c++) {
          const idx = startIndex + r * cols + c;
          edges.push([idx, idx + 1]);
        }
      }
      for (let r = 0; r < rows - 1; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = startIndex + r * cols + c;
          edges.push([idx, idx + cols]);
        }
      }

    } else if (pId.includes("blueprint") || pId.includes("sanctuary") || pId.includes("03")) {
      // ARCHITECTURAL DOME: Rotunda sanctuary plan with radial rafters and layers
      const floors = 3;
      const rafters = 8;
      const centerNode = vertices.length;
      vertices.push({ x: 0, y: -75, z: 0 });

      for (let f = 0; f < floors; f++) {
        const h = f / floors;
        const fy = -55 + h * 110;
        const rSize = 75 * (1.0 - 0.3 * h);
        const startOfFloor = vertices.length;

        for (let r = 0; r < rafters; r++) {
          const rad = (r * Math.PI * 2) / rafters;
          vertices.push({ x: Math.cos(rad) * rSize, y: fy, z: Math.sin(rad) * rSize });
          
          if (f === 0) {
            edges.push([centerNode, startOfFloor + r]);
          } else {
            const prevFloorIdx = startOfFloor - rafters + r;
            edges.push([prevFloorIdx, startOfFloor + r]);
          }

          if (r > 0) {
            edges.push([startOfFloor + r - 1, startOfFloor + r]);
          }
        }
        edges.push([startOfFloor + rafters - 1, startOfFloor]);
      }

    } else {
      // SHIP_YACHT / VESSEL: Fluid dual-hull contoured bulkheads with rib rails
      const stations = 6;
      const pointsPerStation = 6;
      const startIndex = vertices.length;

      for (let s = 0; s < stations; s++) {
        const zPct = s / (stations - 1);
        const zCoord = -90 + zPct * 180;
        const beamWidth = Math.sin(zPct * Math.PI) * 55 + 10;
        const draftDepth = Math.sin(zPct * Math.PI) * 45;

        for (let p = 0; p < pointsPerStation; p++) {
          const t = p / (pointsPerStation - 1);
          const angle = -Math.PI + t * Math.PI;
          const px = Math.cos(angle) * (beamWidth / 2);
          const py = Math.sin(angle) * draftDepth + (s * 4);

          vertices.push({ x: px, y: py, z: zCoord });
        }
      }

      for (let s = 0; s < stations - 1; s++) {
        for (let p = 0; p < pointsPerStation; p++) {
          const idx = startIndex + s * pointsPerStation + p;
          edges.push([idx, idx + pointsPerStation]);
        }
      }

      for (let s = 0; s < stations; s++) {
        for (let p = 0; p < pointsPerStation - 1; p++) {
          const idx = startIndex + s * pointsPerStation + p;
          edges.push([idx, idx + 1]);
        }
      }
    }

    // 3D Matrix Rotation Utility Function
    const rotateVertex = (v: Point3D, rx: number, ry: number, rz: number): Point3D => {
      // Y-axis rotation
      let cosVal = Math.cos(ry);
      let sinVal = Math.sin(ry);
      let x1 = v.x * cosVal - v.z * sinVal;
      let z1 = v.x * sinVal + v.z * cosVal;

      // X-axis rotation
      cosVal = Math.cos(rx);
      sinVal = Math.sin(rx);
      let y1 = v.y * cosVal - z1 * sinVal;
      let z2 = v.y * sinVal + z1 * cosVal;

      // Z-axis rotation
      cosVal = Math.cos(rz);
      sinVal = Math.sin(rz);
      let x2 = x1 * cosVal - y1 * sinVal;
      let y2 = x1 * sinVal + y1 * cosVal;

      return { x: x2, y: y2, z: z2 };
    };

    const render = () => {
      if (!canvas) return;
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      // Core viewport dimensions setup
      const cx = dimensions.width / 2;
      const cy = dimensions.height / 2;
      const fieldOfView = 220;

      // Perspective correction offset using window scroll position & mouse translation
      const scrollShift = scrollYRef.current * 0.0018;
      const zoomStrength = isHovered ? 1.3 : 1.0;
      
      // Shift product 3D rotation based on mouse coordinates to feel perspective-corrected
      const localAngleY = angleY + scrollShift + (isHovered ? mousePos.x * 1.5 : 0);
      const localAngleX = angleX + (isHovered ? mousePos.y * -1.2 : 0);

      // Rotate vectors gently over time
      angleY += isHovered ? 0.012 : 0.004;
      angleX += 0.0015;

      // Draw background circular target portal rings
      ctx.strokeStyle = getColor(cameraActive ? 0.25 : 0.08);
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.arc(cx, cy, Math.min(cx, cy) - 10, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = getColor(cameraActive ? 0.15 : 0.03);
      ctx.beginPath();
      ctx.arc(cx, cy, Math.min(cx, cy) - 25, 0, Math.PI * 2);
      ctx.stroke();

      // Quick dynamic telemetry crosshair marks
      ctx.strokeStyle = getColor(0.12);
      ctx.beginPath();
      ctx.moveTo(cx - 15, cy); ctx.lineTo(cx - 5, cy);
      ctx.moveTo(cx + 5, cy); ctx.lineTo(cx + 15, cy);
      ctx.moveTo(cx, cy - 15); ctx.lineTo(cx, cy - 5);
      ctx.moveTo(cx, cy + 5); ctx.lineTo(cx, cy + 15);
      ctx.stroke();

      // Draw horizontal scanning laser when camera is active
      if (cameraActive) {
        const sweepY = cy + Math.sin(Date.now() * 0.004) * (Math.min(cx, cy) - 15);
        ctx.strokeStyle = "rgba(255, 74, 0, 0.45)";
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.moveTo(cx - (Math.min(cx, cy) - 20), sweepY);
        ctx.lineTo(cx + (Math.min(cx, cy) - 20), sweepY);
        ctx.stroke();
      }

      // Rotate and project all vertices
      const projected: { x: number; y: number; originalZ: number }[] = [];

      for (let i = 0; i < vertices.length; i++) {
        const rot = rotateVertex(vertices[i], localAngleX, localAngleY, angleZ);
        
        // Volumetric depth modification based on scroll state & mouse depth perspective
        const depthBuffer = 260 + rot.z + (Math.sin(scrollShift) * 40) + (isHovered ? mousePos.y * -20 : 0);
        
        const scale = (fieldOfView / depthBuffer) * zoomStrength;
        const px = cx + rot.x * scale;
        const py = cy + rot.y * scale;

        projected.push({ x: px, y: py, originalZ: rot.z });
      }

      // Draw projected vector links
      ctx.lineWidth = isHovered ? 1.25 : 0.85;

      edges.forEach(([u, v]) => {
        const p1 = projected[u];
        const p2 = projected[v];

        if (p1.x < -100 || p1.x > dimensions.width + 100 || p2.x < -100 || p2.x > dimensions.width + 100) return;

        // Depth cueing opacity modulation
        const avgZ = (p1.originalZ + p2.originalZ) / 2;
        const alpha = Math.max(0.15, Math.min(0.9, 0.6 + (avgZ / 120)));

        ctx.strokeStyle = getColor(isHovered ? alpha * 1.2 : alpha * 0.75);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      });

      // Draw projected coordinate telemetry text on hover for a high-end interface
      if (isHovered) {
        ctx.fillStyle = getColor(0.7);
        ctx.font = "6px monospace";
        ctx.fillText(`PROJ_AR_DEPTH: ${Math.round(260 + (Math.sin(scrollShift) * 40))}M`, 15, 25);
        ctx.fillText(`ROT_ANGLE_Y: ${Math.round((localAngleY * 180) / Math.PI) % 360}°`, 15, 34);
        ctx.fillText(`LENS: ${cameraActive ? "L_CAMERA_ON" : "STANDBY_FEED"}`, 15, 43);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [dimensions, isHovered, productId, themeColor, cameraActive, mousePos]);

  return (
    <div 
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      className={`absolute inset-0 w-full h-full flex items-center justify-center transition-all duration-500 overflow-hidden bg-black/10 select-none ${
        cameraActive ? "mix-blend-normal" : "mix-blend-screen"
      }`}
    >
      {/* 3D Circular Camera Portal Projection Backdrop Mask */}
      {cameraActive && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          {!cameraError && stream ? (
            <div 
              className="w-[82%] h-[82%] relative rounded-full overflow-hidden border transition-all duration-300"
              style={{
                borderColor: getColor(0.5),
                // Parallax 3D camera drift driven by mouse velocity and hovering
                transform: `scale(${isHovered ? 1.05 : 1.0}) translate(${mousePos.x * 18}px, ${mousePos.y * 18}px)`,
                boxShadow: `0 0 30px ${getColor(0.4)}`,
              }}
            >
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-110 grayscale brightness-75 contrast-125"
                style={{
                  clipPath: "circle(50% at 50% 50%)",
                }}
              />
              <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black pointer-events-none" />
              {/* Scanline pattern overlay inside camera */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] pointer-events-none opacity-40 ml-[-5px]" />
            </div>
          ) : (
            /* Immersive fallback geo grid if camera denied or errored */
            <div 
              className="w-[82%] h-[82%] rounded-full bg-[#050505] border flex flex-col items-center justify-center text-center p-4 transition-all duration-300 relative overflow-hidden"
              style={{
                borderColor: getColor(0.4),
                transform: `scale(${isHovered ? 1.05 : 1.0}) translate(${mousePos.x * 12}px, ${mousePos.y * 12}px)`,
                boxShadow: `0 0 25px ${getColor(0.3)}`,
              }}
            >
              {/* Spinning compass ticks */}
              <div 
                className="absolute inset-0 border border-dashed opacity-10 animate-spin" 
                style={{ 
                  borderColor: getColor(1.0),
                  animationDuration: "25s",
                  clipPath: "circle(48% at 50% 50%)",
                }} 
              />
              <Camera className="w-5 h-5 text-amber-500/80 mb-1" />
              <div className="text-[7.5px] font-mono text-white/55 tracking-[1.5px] uppercase font-bold">
                [ CAMERA_STANDBY ]
              </div>
              <div className="text-[5.5px] font-mono text-[#c6b89e]/40 tracking-normal uppercase leading-tight mt-1 max-w-[85%] select-none">
                LOCKED PORTAL PROJECTION. CALIBRATING IMAGINARY ROOM MATRICES.
              </div>
            </div>
          )}
        </div>
      )}

      {/* Camera Activator button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setCameraActive(!cameraActive);
        }}
        className="absolute top-2.5 right-2.5 z-30 p-1.5 rounded-full border bg-black/85 hover:bg-white text-white hover:text-black transition-all cursor-pointer shadow-xl flex items-center justify-center focus:outline-none focus:ring-1 focus:ring-[#ff4a00]"
        style={{
          borderColor: cameraActive ? "#ff4a00" : "rgba(198, 184, 158, 0.3)",
          boxShadow: cameraActive ? "0 0 10px rgba(255, 74, 0, 0.3)" : "none"
        }}
        title={cameraActive ? "Deactivate live portal projection camera" : "Activate live camera portal projection"}
      >
        {cameraActive ? (
          <CameraOff className="w-3.5 h-3.5" style={{ color: cameraActive ? "#ff4a00" : "currentColor" }} />
        ) : (
          <Camera className="w-3.5 h-3.5" />
        )}
      </button>

      {/* Main 3D wireframe outline rendering overlay canvas */}
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full pointer-events-none drop-shadow-[0_0_12px_rgba(198,184,158,0.25)] block z-10"
      />
    </div>
  );
}
