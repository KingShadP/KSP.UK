import { useEffect, useRef, useState } from "react";

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
  const [isHovered, setIsHovered] = useState(false);
  const scrollYRef = useRef(0);
  const [dimensions, setDimensions] = useState({ width: 280, height: 280 });

  // Get color code matching the system palette
  const getColor = (opacity = 1.0) => {
    if (themeColor === "red") return `rgba(255, 74, 0, ${opacity})`;
    if (themeColor === "emerald") return `rgba(16, 185, 129, ${opacity})`;
    return `rgba(198, 184, 158, ${opacity})`; // Champagne Gold
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
      // Ring 1 (Hour cage)
      const ring1Start = vertices.length;
      const steps1 = 12;
      for (let i = 0; i < steps1; i++) {
        const rad = (i * Math.PI * 2) / steps1;
        vertices.push({ x: Math.cos(rad) * 65, y: Math.sin(rad) * 65, z: 0 });
        if (i > 0) edges.push([ring1Start + i - 1, ring1Start + i]);
      }
      edges.push([ring1Start + steps1 - 1, ring1Start]);

      // Ring 2 (Outer bezel structure)
      const ring2Start = vertices.length;
      const steps2 = 24;
      for (let i = 0; i < steps2; i++) {
        const rad = (i * Math.PI * 2) / steps2;
        vertices.push({ x: Math.cos(rad) * 85, y: Math.sin(rad) * 85, z: 12 * Math.sin(rad * 3) });
        if (i > 0) edges.push([ring2Start + i - 1, ring2Start + i]);
      }
      edges.push([ring2Start + steps2 - 1, ring2Start]);

      // Gear teeth/Spokes linking Ring 1 to center node (0,0,0)
      const centerIdx = vertices.length;
      vertices.push({ x: 0, y: 0, z: -10 }); // Back axis node
      const frontCenterIdx = vertices.length;
      vertices.push({ x: 0, y: 0, z: 40 }); // Extended pointer node

      for (let i = 0; i < steps1; i += 2) {
        edges.push([ring1Start + i, centerIdx]);
        edges.push([ring1Start + i, frontCenterIdx]);
      }
      edges.push([centerIdx, frontCenterIdx]);

    } else if (pId.includes("chair") || pId.includes("lounge") || pId.includes("02")) {
      // LOUNGE CHAIR: Geodesic Saddle Contour space-frame
      // We will model the chair back support curving down to seat cushion base
      const rows = 5;
      const cols = 5;
      const startIndex = vertices.length;

      for (let r = 0; r < rows; r++) {
        const u = r / (rows - 1); // 0 to 1
        const theta = -Math.PI / 4 + u * (Math.PI * 1.1); // curve profile
        const zCoord = Math.sin(theta) * 50;
        const yBase = -Math.cos(theta) * 55;

        for (let c = 0; c < cols; c++) {
          const v = c / (cols - 1); // 0 to 1
          const xWidth = -65 + v * 130;
          
          // sculpt ergonomic taper
          const widthFactor = 1.0 - 0.25 * Math.sin(u * Math.PI);
          const finalX = xWidth * widthFactor;
          // scoop shape
          const finalY = yBase + (15 * Math.sin(v * Math.PI) * Math.sin(u * Math.PI));

          vertices.push({ x: finalX, y: finalY, z: zCoord });
        }
      }

      // Generate horizontal grid lines
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols - 1; c++) {
          const idx = startIndex + r * cols + c;
          edges.push([idx, idx + 1]);
        }
      }
      // Generate vertical grid lines
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
      vertices.push({ x: 0, y: -75, z: 0 }); // Apex Dome Point

      for (let f = 0; f < floors; f++) {
        const h = f / floors;
        const fy = -55 + h * 110;
        const rSize = 75 * (1.0 - 0.3 * h); // dome taper
        const startOfFloor = vertices.length;

        for (let r = 0; r < rafters; r++) {
          const rad = (r * Math.PI * 2) / rafters;
          vertices.push({ x: Math.cos(rad) * rSize, y: fy, z: Math.sin(rad) * rSize });
          
          // Connect to previous floor node (vertical rib)
          if (f === 0) {
            edges.push([centerNode, startOfFloor + r]);
          } else {
            const prevFloorIdx = startOfFloor - rafters + r;
            edges.push([prevFloorIdx, startOfFloor + r]);
          }

          // Connect around the ring
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
        const zCoord = -90 + zPct * 180; // aft to bow
        const beamWidth = Math.sin(zPct * Math.PI) * 55 + 10; // flare at midship
        const draftDepth = Math.sin(zPct * Math.PI) * 45;

        for (let p = 0; p < pointsPerStation; p++) {
          const t = p / (pointsPerStation - 1);
          const angle = -Math.PI + t * Math.PI; // bottom curve layout
          const px = Math.cos(angle) * (beamWidth / 2);
          const py = Math.sin(angle) * draftDepth + (s * 4); // raked deck line

          vertices.push({ x: px, y: py, z: zCoord });
        }
      }

      // Long structural rail lines (bow to stern)
      for (let s = 0; s < stations - 1; s++) {
        for (let p = 0; p < pointsPerStation; p++) {
          const idx = startIndex + s * pointsPerStation + p;
          edges.push([idx, idx + pointsPerStation]);
        }
      }

      // Transverse structural hulls
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
      const fieldOfView = 220; // focal length

      // Perspective correction offset using window scroll position to shift volumetric depth
      const scrollShift = scrollYRef.current * 0.0018;
      const zoomStrength = isHovered ? 1.25 : 1.0;
      const localAngleY = angleY + scrollShift + (isHovered ? 0.4 : 0);
      const localAngleX = angleX + (isHovered ? -0.2 : 0);

      // Increment rotation values gently
      angleY += isHovered ? 0.016 : 0.006;
      angleX += 0.002;

      // Draw background dynamic circular target portal rings
      ctx.strokeStyle = getColor(0.08);
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.arc(cx, cy, Math.min(cx, cy) - 10, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = getColor(0.03);
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

      // Rotate and project all vertices
      const projected: { x: number; y: number; originalZ: number }[] = [];

      for (let i = 0; i < vertices.length; i++) {
        const rot = rotateVertex(vertices[i], localAngleX, localAngleY, angleZ);
        
        // Volumetric depth modification based on scroll state
        const depthBuffer = 260 + rot.z + (Math.sin(scrollShift) * 40);
        
        // Perspective divide
        const scale = (fieldOfView / depthBuffer) * zoomStrength;
        const px = cx + rot.x * scale;
        const py = cy + rot.y * scale;

        projected.push({ x: px, y: py, originalZ: rot.z });
      }

      // Draw projected vector links
      ctx.lineWidth = isHovered ? 1.1 : 0.85;

      edges.forEach(([u, v]) => {
        const p1 = projected[u];
        const p2 = projected[v];

        // Skip clipping / extreme points Out-Of-Bounds
        if (p1.x < -100 || p1.x > dimensions.width + 100 || p2.x < -100 || p2.x > dimensions.width + 100) return;

        // Depth cueing opacity modulation (elements further back are dimmer)
        const avgZ = (p1.originalZ + p2.originalZ) / 2;
        const alpha = Math.max(0.15, Math.min(0.9, 0.6 + (avgZ / 120)));

        ctx.strokeStyle = getColor(isHovered ? alpha * 1.1 : alpha * 0.8);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      });

      // Draw projected coordinate telemetry text on hover for a military look
      if (isHovered) {
        ctx.fillStyle = getColor(0.55);
        ctx.font = "6px monospace";
        ctx.fillText(`SYS_PROJ_AR_DEPTH: ${Math.round(260 + (Math.sin(scrollShift) * 40))}M`, 15, 25);
        ctx.fillText(`ROT_ANGLE_Y: ${Math.round((localAngleY * 180) / Math.PI) % 360}°`, 15, 34);
        ctx.fillText(`VECTOR_VERTICES: ${vertices.length}`, 15, 43);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [dimensions, isHovered, productId, themeColor]);

  return (
    <div 
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="absolute inset-0 w-full h-full flex items-center justify-center transition-all duration-500 overflow-hidden mix-blend-screen bg-black/5"
    >
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full pointer-events-none drop-shadow-[0_0_12px_rgba(198,184,158,0.2)] block"
      />
    </div>
  );
}
