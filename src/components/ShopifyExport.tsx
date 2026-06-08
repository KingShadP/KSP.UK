/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import ProductWireframePortal from "./ProductWireframePortal";
import { 
  Store, 
  Key, 
  Database, 
  RefreshCw, 
  ShoppingBag, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight, 
  ExternalLink, 
  Sparkles, 
  Loader2, 
  Info, 
  Check, 
  ShoppingBag as CartIcon,
  Globe,
  DollarSign,
  Hammer,
  Cpu,
  Layers,
  Shield,
  Activity,
  RotateCw,
  Camera,
  Image as ImageIcon
} from "lucide-react";
import ScrambleText from "./ScrambleText";
import Tooltip from "./Tooltip";

interface Product {
  id: string;
  title: string;
  description: string;
  price: string;
  currency: string;
  imgUrl: string;
  specs: string[];
}

interface CartItem {
  product: Product;
  quantity: number;
}

// Highly stylized luxury boutique products matching the Kingshadp universe
const CURATED_DEFAULT_PRODUCTS: Product[] = [
  {
    id: "KSD-01",
    title: "ARMORED LS",
    description: "Built for the king. Japanese selvedge, custom reinforcement, hand-stitched. Only 25 units produced worldwide. [Connected to: 'Regal Echoes of GOD' era. Beautifully represents protective systems and high-end DIY encryption.]",
    price: "420.00",
    currency: "USD",
    imgUrl: "/ChatGPT Image May 16, 2026, 05_00_22 AM (4).png",
    specs: ["Japanese Selvedge Denim", "Hand-stitched detailing", "Protective Geometry cut", "Limited to 25 units"]
  },
  {
    id: "KSD-02",
    title: "CIPHER VEST",
    description: "The system made visible. Protective multi-pocket layout, rigid technical fabric, custom gold fire detailing. [Connected to: the initial mythology release. An ultimate uniform item for true believers of the empire.]",
    price: "580.00",
    currency: "USD",
    imgUrl: "/ChatGPT Image May 16, 2026, 04_32_03 AM (1).png",
    specs: ["Waterproof ballistic polymer", "Magnetic pocket triggers", "Gold-fire filament accents", "Individually numbered run"]
  },
  {
    id: "KSD-03",
    title: "SACRED CHRONO ATELIER",
    description: "Complete spatial timepiece engineered with orbital alignment paths. Cast in grade 5 titanium with an elegant satin finish, tourbillon movement reflecting Miami-to-Aegean coordinates.",
    price: "28,500.00",
    currency: "USD",
    imgUrl: "/ChatGPT Image May 5, 2026, 11_25_04 PM.png",
    specs: ["Grade 5 Brushed Titanium", "60-Hour orbital reserve", "Manual tourbillon calibre", "Anti-reflective sapphire face"]
  },
  {
    id: "KSD-04",
    title: "SOCIETY MASK // SHIELD L9",
    description: "A thermal-suppressive face protective guard. Crafted from matte carbon fiberglass composites. Connected to the 'STEALTH L9' electromagnetic total silence era.",
    price: "1,850.00",
    currency: "USD",
    imgUrl: "/ChatGPT Image May 16, 2026, 04_28_18 AM (4).png",
    specs: ["Molded aerospace carbon", "Thermal emission dampening", "Glow-suppressed mesh liner", "One-of-one collection piece"]
  }
];

interface ShopifyExportProps {
  isInline?: boolean;
}

export default function ShopifyExport({ isInline }: ShopifyExportProps) {
  // Connection states
  const [shopUrl, setShopUrl] = useState(() => localStorage.getItem("ksd_shopify_url") || "");
  const [token, setToken] = useState(() => localStorage.getItem("ksd_shopify_token") || "");
  const [isConnected, setIsConnected] = useState(() => localStorage.getItem("ksd_shopify_connected") === "true");
  const [products, setProducts] = useState<Product[]>(CURATED_DEFAULT_PRODUCTS);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Cart operations
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [checkoutSlip, setCheckoutSlip] = useState("");

  // AR HUD SYSTEM STATE PARAMETERS
  const [arProduct, setArProduct] = useState<Product | null>(null);
  const [arAngle, setArAngle] = useState(0);
  const [arColor, setArColor] = useState<"red" | "gold" | "emerald">("gold");
  const [arScale, setArScale] = useState(1.0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [scanStatus, setScanStatus] = useState<"calibrating" | "ready" | "projecting">("calibrating");
  const [calibrationProgress, setCalibrationProgress] = useState(0);

  // AR translation offsets & tactile drag positioning parameter hooks
  const [arTranslateX, setArTranslateX] = useState(0);
  const [arTranslateY, setArTranslateY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [flashActive, setFlashActive] = useState(false);

  // Webcam video elements state parameters
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streamActive, setStreamActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    let activeStream: MediaStream | null = null;
    if (arProduct && scanStatus === "projecting") {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then(stream => {
          activeStream = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(err => console.log("Video output interrupted", err));
          }
          setStreamActive(true);
          setCameraError(null);
          
          window.dispatchEvent(new CustomEvent("telemetry-log", {
            detail: { message: `Camera stream engaged successfully: FACING_ENVIRONMENT [ACTIVE]`, type: "CAMERA_RAW" }
          }));
        })
        .catch(err => {
          console.warn("Camera request blocked or failed", err);
          setStreamActive(false);
          setCameraError("Camera access denied or unsupported - using simulated environment plate");
          
          window.dispatchEvent(new CustomEvent("telemetry-log", {
            detail: { message: `Camera stream failed: Permission Denied or Unsupported. Reverting to environment map.`, type: "WARNING" }
          }));
        });
    }
    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
      setStreamActive(false);
    };
  }, [arProduct, scanStatus]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - arTranslateX, y: e.clientY - arTranslateY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setArTranslateX(e.clientX - dragStart.x);
    setArTranslateY(e.clientY - dragStart.y);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ 
        x: e.touches[0].clientX - arTranslateX, 
        y: e.touches[0].clientY - arTranslateY 
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setArTranslateX(e.touches[0].clientX - dragStart.x);
    setArTranslateY(e.touches[0].clientY - dragStart.y);
  };

  const handleCaptureSnapshot = () => {
    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 220);
    // Dispatch Telemetry Alert
    window.dispatchEvent(new CustomEvent("telemetry-log", {
      detail: { 
        message: `📸 [AR PORTAL] Tactile viewport freeze: Snapshot aligned to host at coordinates [X: ${Math.round(arTranslateX)}px, Y: ${Math.round(arTranslateY)}px, Space Zoom: ${Math.round(arScale * 100)}%]`, 
        type: "SYSTEM" 
      }
    }));
  };

  useEffect(() => {
    let animId: number;
    if (arProduct) {
      setScanStatus("calibrating");
      setCalibrationProgress(0);
      setArTranslateX(0);
      setArTranslateY(0);
      
      const interval = setInterval(() => {
        setCalibrationProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setScanStatus("ready");
            setTimeout(() => setScanStatus("projecting"), 1000);
            return 100;
          }
          return prev + 5;
        });
      }, 50);

      const rotateTick = () => {
        if (autoRotate) {
          setArAngle(prev => (prev + 0.5) % 360);
        }
        animId = requestAnimationFrame(rotateTick);
      };
      animId = requestAnimationFrame(rotateTick);

      return () => {
        clearInterval(interval);
        cancelAnimationFrame(animId);
      };
    }
  }, [arProduct, autoRotate]);

  // ATELIER FORGE STATE PARAMETERS
  const [forgeBase, setForgeBase] = useState<"watch" | "sanctuary" | "yacht" | "terminal">("watch");
  const [forgeMaterial, setForgeMaterial] = useState("Lunar Titanium x Deep Gold");
  const [forgeEngraving, setForgeEngraving] = useState("37.4262° N / MYK_STATION_01");
  const [forgeShielding, setForgeShielding] = useState("Faradic Cage Level 5");
  const [isForging, setIsForging] = useState(false);
  const [forgeProgress, setForgeProgress] = useState(0);
  const [forgeLog, setForgeLog] = useState("");

  // Auto-detect and fetch production Shopify credentials automatically from environment variables
  useEffect(() => {
    const autoLoadShopify = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/shopify-config");
        if (res.ok) {
          const config = await res.json();
          if (config.domain && config.token) {
            setShopUrl(config.domain);
            setToken(config.token);
            setIsConnected(true);
            await fetchShopifyProducts(config.domain, config.token);
          } else {
            // No credentials configured, silently back down to sleek defaults
            setIsConnected(false);
            setProducts(CURATED_DEFAULT_PRODUCTS);
            setIsLoading(false);
          }
        } else {
          setIsConnected(false);
          setProducts(CURATED_DEFAULT_PRODUCTS);
          setIsLoading(false);
        }
      } catch (e) {
        console.error("Failed to autoconfigure Shopify connection:", e);
        setIsConnected(false);
        setProducts(CURATED_DEFAULT_PRODUCTS);
        setIsLoading(false);
      }
    };
    autoLoadShopify();
  }, []);

  // Format Shopify GraphQL responses cleanly
  const fetchShopifyProducts = async (domain: string, publicToken: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    // Clean up domain URL formats
    let cleanDomain = domain.replace(/^https?:\/\//i, "").trim();
    cleanDomain = cleanDomain.split("/")[0]; // remove directories if any

    if (!cleanDomain.endsWith("myshopify.com") && cleanDomain.includes(".")) {
      // Allow custom domains but standard default endpoint is myshopify domain
    } else if (!cleanDomain.includes(".")) {
      cleanDomain = `${cleanDomain}.myshopify.com`;
    }

    const endpoint = `https://${cleanDomain}/api/2023-10/graphql.json`;

    const productQuery = `
      query getProducts {
        products(first: 6) {
          edges {
            node {
              id
              title
              description
              vendor
              productType
              images(first: 1) {
                edges {
                  node {
                    url
                  }
                }
              }
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    `;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": publicToken.trim()
        },
        body: JSON.stringify({ query: productQuery })
      });

      if (!response.ok) {
        throw new Error(`HTTP network failure: ${response.status} ${response.statusText}`);
      }

      const resJson = await response.json();
      
      if (resJson.errors && resJson.errors.length > 0) {
        throw new Error(resJson.errors[0].message);
      }

      const productEdges = resJson.data?.products?.edges || [];
      if (productEdges.length === 0) {
        throw new Error("Connected successfully, but no active public products were returned by your storefront.");
      }

      // Convert Shopify node structure to our high-fidelity layout schema
      const mapped: Product[] = productEdges.map((edge: any) => {
        const node = edge.node;
        const priceObj = node.priceRange?.minVariantPrice;
        const rawImg = node.images?.edges?.[0]?.node?.url;
        
        let displayImg = rawImg || "1555066931-4365d14bab8c"; // default placeholder

        return {
          id: node.id.split("/").pop() || Math.random().toString(),
          title: node.title,
          description: node.description || `Exquisite curation. Manufactured with deliberate, premium techniques by ${node.vendor || "ateliers"}.`,
          price: parseFloat(priceObj?.amount || "0").toLocaleString("en-US", { minimumFractionDigits: 2 }),
          currency: priceObj?.currencyCode || "USD",
          imgUrl: displayImg, // store full url or use placeholder if relative index
          specs: [
            `Vendor: ${node.vendor || "N/A"}`,
            `Type: ${node.productType || "Atelier product"}`
          ]
        };
      });

      setProducts(mapped);
      setIsConnected(true);
      setShopUrl(cleanDomain);
      localStorage.setItem("ksd_shopify_url", cleanDomain);
      localStorage.setItem("ksd_shopify_token", publicToken);
      localStorage.setItem("ksd_shopify_connected", "true");
      setSuccessMessage(`LIVE SECURE CONNECTION ESTABLISHED WITH ${cleanDomain.toUpperCase()}`);
    } catch (err: any) {
      console.error("Shopify storefront integration error:", err);
      setErrorMessage(`INTEGRATION REJECTED: ${err.message || "Is your token or domain correct?"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectStore = () => {
    localStorage.removeItem("ksd_shopify_url");
    localStorage.removeItem("ksd_shopify_token");
    localStorage.removeItem("ksd_shopify_connected");
    setIsConnected(false);
    setProducts(CURATED_DEFAULT_PRODUCTS);
    setShopUrl("");
    setToken("");
    setSuccessMessage("STOREFRONT DISCONNECTED. FALLBACK GUEST SUITE RESTORED.");
  };

  const handleTestConnect = () => {
    if (!shopUrl || !token) {
      setErrorMessage("Domain URL fields and Storefront tokens are required before secure sync.");
      return;
    }
    fetchShopifyProducts(shopUrl, token);
  };

  // Bespoke luxury item creation synthesizer
  const handleForgeBespoke = () => {
    setIsForging(true);
    setForgeProgress(0);
    setForgeLog("Initializing synthesis crucible engine...");
    
    const logs = [
      "Calibrating high-energy plasma cutter alignments...",
      "Extruding raw material block into structured matrix...",
      "Sub-atomic lattice shielding crystallization process on...",
      "Laser-engraving custom patronage tracking specs...",
      "Executing EM verification field tests. Shielding level checks green...",
      "Registering custom architectural prototype to system index...",
      "Sealing vacuum carbon gaskets, securing token signature..."
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      setForgeProgress((prev) => {
        const next = prev + 15;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            let title = "";
            let description = "";
            let basePrice = 0;
            let imgCode = "";
            let uniqueSpecs: string[] = [];

            if (forgeBase === "watch") {
              title = `Atelier Chrono Custom '${forgeEngraving || "Celestial"}'`;
              description = `A custom-commissioned titanium watch block structured by direct client request. Composed of ${forgeMaterial} with a high-end faradic cage outer shell. Custom laser coordinates: ${forgeEngraving}.`;
              basePrice = 45000;
              imgCode = "1523275335652-32a74c7402a5";
              uniqueSpecs = [forgeMaterial, `Shielding: ${forgeShielding}`, `Laser ID: ${forgeEngraving}`, "Power: 80hr Hydrokinetic"];
            } else if (forgeBase === "sanctuary") {
              title = `Atelier Sanctuary Compound '${forgeEngraving || "Aegis"}'`;
              description = `A supreme architectural concept commission crafted from raw geothermal rock slabs, ${forgeMaterial} columns, and ${forgeShielding} signal isolation. Pre-set coordinates: ${forgeEngraving}.`;
              basePrice = 850000;
              imgCode = "1513694203232-719a280e022f";
              uniqueSpecs = [`Materials: ${forgeMaterial}`, `Matrix: ${forgeShielding}`, `Geocoords: ${forgeEngraving}`, "Self-sustained reactor"];
            } else if (forgeBase === "yacht") {
              title = `Atelier Vessel Custom '${forgeEngraving || "Tethys"}'`;
              description = `A bespoke 68-meter explorer vessel layout engineered with ${forgeMaterial} reinforcement plates and robust ${forgeShielding} encryption bays. Transceiver ID: ${forgeEngraving}.`;
              basePrice = 1850000;
              imgCode = "1559136555-9303baea8ebd";
              uniqueSpecs = [forgeMaterial, forgeShielding, `Coords: ${forgeEngraving}`, "Propulsion: Jet-fuel Hybrid"];
            } else {
              title = `Sovereign Command Console '${forgeEngraving || "Monolith"}'`;
              description = `An architectural private console desk made of ${forgeMaterial}, equipped with integrated ${forgeShielding} and dual high-definition telemetry receivers. Transceiver ID: ${forgeEngraving}.`;
              basePrice = 120000;
              imgCode = "1507679799987-c73779587ccf";
              uniqueSpecs = [forgeMaterial, `Shielding: ${forgeShielding}`, `Ref ID: ${forgeEngraving}`, "Interface: Bio-metric holographic"];
            }

            const forgeId = `FORGE-${Math.floor(100 + Math.random() * 900)}`;
            const forgedProd: Product = {
              id: forgeId,
              title,
              description,
              price: basePrice.toLocaleString("en-US", { minimumFractionDigits: 2 }),
              currency: "EUR",
              imgUrl: imgCode,
              specs: uniqueSpecs
            };

            setProducts((prev) => [forgedProd, ...prev]);
            setIsForging(false);
            setForgeProgress(0);
            setSuccessMessage(`NEW IMMERSIVE COMMISSION [${forgeId}] INCORPORATED INTO ATELIER CATALOG`);
            
            // Auto append custom note to Scribe database
            const userOptions: Intl.DateTimeFormatOptions = {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            };
            const timestamp = new Date().toLocaleDateString("en-GB", userOptions).toUpperCase().replace(",", " /");
            const newNote = {
              id: `forge-${Date.now()}`,
              timestamp,
              title: `FORGE: BESPOKE COMMISSION [${forgeId}]`,
              text: `A premium bespoke item was successfully synthesized in the Atelier Creation Forge:\nID: ${forgeId}\nName: ${title}\nSpecs: ${uniqueSpecs.join(" // ")}\nValuation Price: €${basePrice.toLocaleString()}\n\nProduction pipeline has scheduled state compilation. Authorized by VIP User (KShadP).`
            };

            const saved = localStorage.getItem("sanctum_notes");
            let list = [];
            try {
              if (saved) list = JSON.parse(saved);
            } catch (e) {}
            localStorage.setItem("sanctum_notes", JSON.stringify([newNote, ...list]));
            window.dispatchEvent(new Event("sanctum_notes_updated"));
          }, 600);
          return 100;
        }
        
        if (currentStep < logs.length) {
          setForgeLog(logs[currentStep]);
          currentStep++;
        }
        return next;
      });
    }, 280);
  };

  // Cart operations
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setCartOpen(true);
    setCheckoutComplete(false);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const subtotal = cart.reduce((acc, item) => {
    const rawPrice = parseFloat(item.product.price.replace(/,/g, ""));
    return acc + rawPrice * item.quantity;
  }, 0);

  // Luxury checkout simulation
  const handleCheckout = () => {
    if (cart.length === 0) return;
    setIsLoading(true);

    setTimeout(() => {
      const code = `KSD-ORDER-${Math.floor(100000 + Math.random() * 900000)}`;
      setCheckoutSlip(code);
      setCheckoutComplete(true);
      setIsLoading(false);

      // Save order details to ScribeNotes database to feel ultra integrated!
      const userOptions: Intl.DateTimeFormatOptions = {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      };
      const timestamp = new Date().toLocaleDateString("en-GB", userOptions).toUpperCase().replace(",", " /");
      
      const shopDisplay = isConnected ? shopUrl : "Atelier Kingshadp Private Boutique";
      
      const orderNote = {
        id: `order-${Date.now()}`,
        timestamp,
        title: `SHOP ORDER: ${code}`,
        text: `Secure digital luxury receipt committed.\nShop Node: ${shopDisplay}\nInvoice ID: ${code}\nTotal Value: €${subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}\n\nITEMS ORDERED:\n${cart.map(item => `• ${item.product.title} x${item.quantity} (Total: ${item.product.currency} ${(parseFloat(item.product.price.replace(/,/g, "")) * item.quantity).toLocaleString()})`).join("\n")}\n\nClient has initiated settlement routing. Direct transport logs engaged.`
      };

      const saved = localStorage.getItem("sanctum_notes");
      let list = [];
      if (saved) {
        try {
          list = JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
      localStorage.setItem("sanctum_notes", JSON.stringify([orderNote, ...list]));
      window.dispatchEvent(new Event("sanctum_notes_updated")); // dispatch live event to synchronize components
      
      // Clear cart
      setCart([]);
    }, 1500);
  };

  return (
    <div className="relative w-full z-30 flex flex-col font-sans select-text">
      
      {/* HEADER CONTROLS INTERACTIVE PORT */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-12 gap-8 border-b border-[#c6b89e]/20 pb-8 relative">
        <div className="absolute top-0 right-0 w-32 h-[1px] bg-[#c6b89e]" />
        
        <div>
          <div className="inline-flex items-center gap-3 border border-[#ff4a00]/30 bg-[#ff4a00]/5 px-4 py-1.5 opacity-90 mb-4 select-none">
            <Store className="w-4 h-4 text-[#ff4a00]" />
            <span className="font-mono text-[9px] tracking-[4px] uppercase text-[#ff4a00] font-bold">
              <ScrambleText text="ACTIVE SHOPIFY STOREFRONT" />
            </span>
          </div>

          <h2 className="font-serif text-3xl md:text-5xl lg:text-7xl tracking-tighter text-[#c6b89e] font-light leading-none">
            <ScrambleText text="Atelier Boutique" duration={1200} />
          </h2>
          <p className="font-sans text-xs text-white/50 tracking-wider mt-3 max-w-xl">
            Welcome to the KingShadP Atelier Boutique. Our systemic boutique seamlessly reads live products to present them in our signature spatial layout. Shop secure acquisitions below.
          </p>
        </div>

        {/* Global Cart trigger button */}
        <div className="flex items-center gap-4 select-none">
          <Tooltip message="SYS_DIAG: Review active cart ledger, pending checkout authorizations, and cryptographic orders.">
            <motion.button
              onClick={() => setCartOpen(true)}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 border border-[#c6b89e]/30 px-6 py-3 hover:bg-[#c6b89e] hover:text-black hover:border-[#c6b89e] text-white tracking-[3px] text-[10px] font-mono font-bold uppercase transition-all duration-300 cursor-pointer relative"
            >
              <CartIcon className="w-4 h-4 text-[#ff4a00]" />
              Atelier Ledger
              {cart.length > 0 && (
                <span className="bg-[#ff4a00] text-black text-[9px] px-1.5 py-0.5 rounded-none font-sans font-bold shadow-[0_0_8px_#ff4a00]">
                  {cart.reduce((s, i) => s + i.quantity, 0)}
                </span>
              )}
            </motion.button>
          </Tooltip>
        </div>
      </div>

      {/* AUTOMATED STATUS HUD HEADER DISPLAY */}
      <div className="mb-12 bg-black/70 border border-[#c6b89e]/20 p-5 backdrop-blur-3xl relative select-none">
        <div className="absolute top-0 left-0 w-8 h-[1px] bg-[#ff4a00]" />
        <div className="absolute top-0 left-0 w-[1px] h-8 bg-[#ff4a00]" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <Database className="w-4 h-4 text-[#c6b89e]" />
            <div>
              <span className="font-serif text-[13px] text-[#c6b89e] uppercase tracking-wider block">
                Atelier Handshake Status
              </span>
              <span className="font-mono text-[8px] text-white/40 uppercase tracking-widest block mt-0.5">
                {isConnected ? `Secure Shopify Synchronizer: Active Handshake Established // Feed verified` : `Silently operating in high-fidelity standalone catalog mode.`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isLoading && (
              <div className="flex items-center gap-2 text-[9px] font-mono text-[#ff4a00] animate-pulse">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>CRYPT_SYNC IN PROGRESS...</span>
              </div>
            )}
            
            <div className="flex items-center gap-2 border border-white/10 bg-black/60 px-4 py-2 font-mono text-[9px] uppercase tracking-[2px]">
              <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-400 animate-pulse shadow-[0_0_6px_#22c55e]" : "bg-white/20"}`} />
              <span>
                {isConnected ? `NODE: ${shopUrl.toUpperCase()}` : "STATUS: STANDALONE SUITE"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* --- PREMIUM UPDATE: ATELIER CREATION FORGE --- */}
      <div className="mb-12 border border-[#c6b89e]/20 bg-black/95 backdrop-blur-3xl p-6 lg:p-8 relative overflow-hidden select-none">
        {/* Cinematic atmospheric glowing light behind */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-radial from-[#ff4a00]/5 to-transparent rounded-full -translate-y-1/2 blur-2xl pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-[#c6b89e]/60 to-transparent" />
        
        {/* Corner alignment markers */}
        <div className="absolute top-2 left-2 text-[#c6b89e]/30 font-mono text-[7px] tracking-[2px]">[SYS_FORGE_V1.1]</div>
        <div className="absolute bottom-2 right-2 text-[#c6b89e]/30 font-mono text-[7px] tracking-[2px]">[VAL_EST: AUTOMATED]</div>

        <div className="flex flex-col lg:flex-row gap-8 items-stretch relative z-10">
          
          {/* Controls form column (Left) */}
          <div className="w-full lg:w-1/2 flex flex-col justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2 text-[#ff4a00]">
                <Hammer className="w-4 h-4" />
                <span className="font-mono text-[8px] tracking-[4px] uppercase font-bold">CRUCIBLE SYNTHESIS TERMINAL</span>
              </div>
              <h3 className="font-serif text-xl md:text-2xl text-[#c6b89e] uppercase tracking-wide">
                Forge Bespoke Commission
              </h3>
              <p className="font-sans text-[11px] text-white/50 leading-relaxed max-w-md mt-1 font-extralight">
                Configure private structural blueprints below. Our state matrix will extrude, test, and register your personalized luxury acquisition physically into the virtual kingdom.
              </p>
            </div>

            {/* Customizer Interactive Parameters */}
            <div className="space-y-4">
              
              {/* Parameter 1: Base Archetype */}
              <div>
                <label className="block font-mono text-[8.5px] text-[#c6b89e]/50 tracking-[3px] uppercase mb-2">1. Base Archetype</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { id: "watch", label: "TIMEPIECE", icon: Cpu },
                    { id: "sanctuary", label: "SANCTUARY", icon: Globe },
                    { id: "yacht", label: "EXPLORER", icon: Activity },
                    { id: "terminal", label: "CONSOLE", icon: Layers }
                  ].map((base) => {
                    const isSelected = forgeBase === base.id;
                    return (
                      <button
                        key={base.id}
                        type="button"
                        onClick={() => {
                          setForgeBase(base.id as any);
                          // Suggest appropriate coordinates based on selection
                          if (base.id === "watch") {
                            setForgeEngraving("37.4262° N / MYK_STATION_01");
                            setForgeMaterial("Faceted Lunar Titanium x Gold");
                          } else if (base.id === "sanctuary") {
                            setForgeEngraving("36.4166° N / EX_SANCTUM_CLIFF");
                            setForgeMaterial("Ancient Thera Gneiss x Gilt");
                          } else if (base.id === "yacht") {
                            setForgeEngraving("37.2842° N / AEGEAN_CRUISE_NODE");
                            setForgeMaterial("Carbon Honeycomb & Alumax");
                          } else {
                            setForgeEngraving("46.2044° N / EXEC_TERMINUS_09");
                            setForgeMaterial("Faceted Black Obsidian Block");
                          }
                        }}
                        className={`py-2 px-3 border text-left flex flex-col justify-between h-14 cursor-pointer transition-all ${
                          isSelected 
                            ? "border-[#ff4a00] bg-[#ff4a00]/5 text-white" 
                            : "border-white/10 bg-black/40 text-white/55 hover:border-[#c6b89e]/40"
                        }`}
                      >
                        <base.icon className={`w-3.5 h-3.5 ${isSelected ? "text-[#ff4a00]" : "text-white/40"}`} />
                        <span className="font-mono text-[8px] tracking-[2px] font-bold mt-1">{base.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Parameter 2: Material Grid Selection */}
              <div>
                <label className="block font-mono text-[8.5px] text-[#c6b89e]/50 tracking-[3px] uppercase mb-1.5">2. Molecular Alloy Matrice</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Lunar Titanium x Deep Gold",
                    "Faceted Black Obsidian & Gold Leaf",
                    "Aerospace Carbon Fiber Grid",
                    "Sub-Zero Liquid Mercury Composite",
                    "Aethelgard Basalt Slab & Gilt"
                  ].map((mat) => {
                    const isSelected = forgeMaterial === mat;
                    return (
                      <button
                        key={mat}
                        type="button"
                        onClick={() => setForgeMaterial(mat)}
                        className={`text-[8px] font-mono tracking-[1px] px-3 py-1.5 border transition-all cursor-pointer ${
                          isSelected 
                            ? "border-[#c6b89e] bg-[#c6b89e] text-black font-semibold" 
                            : "border-white/10 bg-black/60 text-white/50 hover:border-white/20"
                        }`}
                      >
                        {mat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Parameter 3: Coordinate Laser Engraving */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[8.5px] text-[#c6b89e]/50 tracking-[3px] uppercase mb-1.5">3. Coordinates Inscription</label>
                  <input
                    type="text"
                    value={forgeEngraving}
                    onChange={(e) => setForgeEngraving(e.target.value)}
                    placeholder="Enter Custom Coords (e.g. coordinates / ID)"
                    className="w-full bg-[#050505] border border-white/15 px-3 py-2 text-[10px] font-mono text-white tracking-widest focus:outline-none focus:border-[#ff4a00] rounded-none uppercase"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[8.5px] text-[#c6b89e]/50 tracking-[3px] uppercase mb-1.5">4. Isolation Shield Factor</label>
                  <div className="grid grid-cols-3 gap-1">
                    {[
                      { id: "Faradic Cage Level 3", val: "L_03" },
                      { id: "Faradic Cage Level 5", val: "L_05 (MAX)" },
                      { id: "Zero Emission Void Block", val: "VOID" }
                    ].map((shield) => {
                      const isSelected = forgeShielding === shield.id;
                      return (
                        <button
                          key={shield.id}
                          type="button"
                          onClick={() => setForgeShielding(shield.id)}
                          className={`py-2 text-[8px] font-mono tracking-[1px] border transition-all cursor-pointer ${
                            isSelected ? "border-[#ff4a00] bg-[#ff4a00]/10 text-[#ff4a00] font-bold" : "border-white/10 bg-black/40 text-white/50"
                          }`}
                        >
                          {shield.val}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>

            {/* Submit synthesis trigger */}
            <Tooltip message="SYS_SYNTH: Initiate high-energy state laser crystallization." position="top">
              <button
                type="button"
                onClick={handleForgeBespoke}
                disabled={isForging}
                className="w-full h-11 border border-[#c6b89e] bg-gradient-to-r from-black via-[#0d0a07] to-black text-[#c6b89e] hover:text-white hover:border-white font-mono text-[9px] tracking-[4px] uppercase transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#ff4a00]" />
                [ AUTHORIZE CRUCIBLE SYNTHESIS ]
              </button>
            </Tooltip>
          </div>

          {/* Interactive Live Blueprint Schematic Projection Vector (Right) */}
          <div className="w-full lg:w-1/2 min-h-[250px] border border-white/10 bg-[#020202] p-5 relative overflow-hidden flex flex-col justify-between">
            {/* Blueprint Grid Lines background */}
            <div 
              className="absolute inset-0 z-0 pointer-events-none opacity-10"
              style={{
                backgroundImage: "linear-gradient(rgba(198,184,158,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(198,184,158,0.15) 1px, transparent 1px)",
                backgroundSize: "20px 20px"
              }}
            />

            <div className="flex justify-between items-start relative z-10 mb-2">
              <div className="font-mono text-[8px] text-[#c6b89e]/60 tracking-[2px] uppercase">PROJECTIVE VECTOR SCHEMATIC</div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                <span className="font-mono text-[7px] text-[#ff4a00] tracking-[2px] uppercase font-bold">STATE CRITICAL AREA</span>
              </div>
            </div>

            {/* Dynamic visual depending on active selecetd index archetype */}
            <div className="flex-grow flex items-center justify-center relative min-h-[160px] z-10 select-none pb-4">
              
              {/* Outer drafting rings */}
              <div className="absolute w-44 h-44 rounded-full border border-dashed border-[#c6b89e]/10 flex items-center justify-center animate-spin" style={{ animationDuration: "50s" }}>
                <div className="w-32 h-32 rounded-full border border-dashed border-[#ff4a00]/10" />
              </div>

              {/* Dynamic responsive graphics */}
              {forgeBase === "watch" ? (
                <svg viewBox="0 0 200 200" className="w-36 h-36 stroke-[#c6b89e] fill-none stroke-[0.8]">
                  {/* watch bezel/ring */}
                  <circle cx="100" cy="100" r="48" />
                  <circle cx="100" cy="100" r="40" strokeDasharray="3 3" />
                  <circle cx="100" cy="100" r="24" stroke="#ff4a00" />
                  {/* lugs */}
                  <path d="M 75 52 L 75 35 L 125 35 L 125 52" />
                  <path d="M 75 148 L 75 165 L 125 165 L 125 148" />
                  {/* crown */}
                  <rect x="148" y="94" width="8" height="12" />
                  {/* watch hands */}
                  <line x1="100" y1="100" x2="100" y2="72" strokeWidth="1.2" />
                  <line x1="100" y1="100" x2="118" y2="100" strokeWidth="0.8" />
                  <circle cx="100" cy="100" r="2.5" fill="#c6b89e" />
                </svg>
              ) : forgeBase === "sanctuary" ? (
                <svg viewBox="0 0 200 200" className="w-36 h-36 stroke-[#c6b89e] fill-none stroke-[0.8]">
                  {/* cliff and pillars layout */}
                  <path d="M 20 160 L 180 160 stroke-dasharray[2]" />
                  <rect x="50" y="80" width="10" height="80" />
                  <rect x="95" y="80" width="10" height="80" />
                  <rect x="140" y="80" width="10" height="80" />
                  {/* frieze / pediment architectural arch top */}
                  <polygon points="40,80 160,80 100,50" />
                  <polygon points="45,80 155,80 100,53" stroke="#ff4a00" strokeDasharray="2 1" />
                  {/* geothermal circle */}
                  <circle cx="100" cy="140" r="14" stroke="#ff4a00" strokeWidth="0.5" strokeDasharray="4 2" />
                </svg>
              ) : forgeBase === "yacht" ? (
                <svg viewBox="0 0 200 200" className="w-36 h-36 stroke-[#c6b89e] fill-none stroke-[0.8]">
                  {/* Hull of cruise vessel */}
                  <path d="M 20 110 L 150 110 Q 185 110 190 98 L 175 75 L 85 75 L 80 85 L 45 85 L 40 98 L 22 98 Z" />
                  <line x1="20" y1="110" x2="180" y2="110" strokeDasharray="4 4" strokeOpacity="0.3" />
                  <line x1="85" y1="75" x2="162" y2="75" stroke="#ff4a00" strokeWidth="1.2" />
                  {/* deck helipad indicator */}
                  <circle cx="62" cy="98" r="8" strokeDasharray="2 2" />
                  <circle cx="62" cy="98" r="2" fill="#ff4a00" />
                </svg>
              ) : (
                <svg viewBox="0 0 200 200" className="w-36 h-36 stroke-[#c6b89e] fill-none stroke-[0.8]">
                  {/* Monolith Console Desk */}
                  <rect x="50" y="60" width="100" height="80" rx="3" />
                  <rect x="55" y="65" width="90" height="42" strokeDasharray="4 3" />
                  <line x1="60" y1="125" x2="140" y2="125" strokeWidth="0.5" />
                  {/* Holographic glowing orb center */}
                  <circle cx="100" cy="85" r="12" stroke="#ff4a00" strokeDasharray="3 2" />
                  <circle cx="100" cy="85" r="2.5" fill="#ff4a00" />
                  {/* support frames */}
                  <line x1="50" y1="140" x2="40" y2="170" />
                  <line x1="150" y1="140" x2="160" y2="170" />
                </svg>
              )}

              {/* Real-time laser sweep scanner bars */}
              <div className="absolute left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-[#ff4a00]/70 to-transparent shadow-[0_0_8px_#ff4a00] top-1/2 animate-bounce flex-shrink-0" />
            </div>

            {/* Spec blueprint readouts bottom */}
            <div className="border-t border-white/5 pt-3.5 space-y-2 font-mono text-[8.5px] text-white/55 relative z-10">
              <div className="flex justify-between">
                <span className="text-white/30">COMP ALLOY:</span>
                <span className="text-[#c6b89e] font-semibold">{forgeMaterial.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/30">SHIELD COEFFICIENT:</span>
                <span className="text-red-400 font-bold">{forgeShielding.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/30">LASER INSCRIB_ID:</span>
                <span className="text-white font-medium">{forgeEngraving.toUpperCase() || "UNASSIGNED"}</span>
              </div>
            </div>
          </div>

        </div>

        {/* --- HIGH-FIDELITY ACTIVE FORGE SCANNING PROCESS MODAL SCREEN --- */}
        <AnimatePresence>
          {isForging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/98 z-40 flex flex-col items-center justify-center p-8 border border-[#ff4a00]/30"
            >
              {/* Spinning cyber lasers */}
              <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-dashed border-[#c6b89e]/30 animate-spin" style={{ animationDuration: "12s" }} />
                <div className="absolute inset-2 rounded-full border border-dashed border-[#ff4a00]/30 animate-spin" style={{ animationDuration: "6s" }} />
                <div className="absolute inset-6 rounded-full border border-[#c6b89e]/10 flex items-center justify-center">
                  <Activity className="w-8 h-8 text-[#ff4a00] animate-pulse" />
                </div>
              </div>

              <div className="text-center space-y-4 max-w-md select-text">
                <div className="font-serif text-lg md:text-xl text-[#c6b89e] uppercase tracking-[6px] animate-pulse">
                  CRUCIBLE COMPILING MATRIX
                </div>
                
                {/* Custom glowing dynamic state slider bar */}
                <div className="h-2 w-72 bg-white/10 relative overflow-hidden rounded-none border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${forgeProgress}%` }}
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#ff4a00] via-[#c6b89e] to-[#ff4a00] shadow-[0_0_12px_#ff4a00]"
                  />
                </div>

                <div className="font-mono text-[9px] text-[#ff4a00] tracking-[3px] uppercase mt-2 h-4 overflow-hidden">
                  <ScrambleText text={forgeLog} />
                </div>

                <div className="font-mono text-[10px] text-white/40 tracking-[3px]">
                  SYNTH_ESTIMATE // PROGRESS {forgeProgress}%
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CORE BOUTIQUE GALLERY DEEP CONTAINER GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 pb-20">
        {products.map((product, pIdx) => {
          // Detect if image is standard unsplash ID or live URL
          const srcUrl = (product.imgUrl.startsWith("http") || product.imgUrl.startsWith("/")) 
            ? product.imgUrl 
            : `https://images.unsplash.com/photo-${product.imgUrl}?q=80&w=800&auto=format&fit=crop`;

          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: pIdx * 0.1, duration: 0.6 }}
              className="bg-black/40 border border-white/5 hover:border-[#c6b89e]/30 flex flex-col justify-between relative group overflow-hidden transition-all duration-500 shadow-xl"
            >
              {/* Product interactive frame */}
              <div className="relative aspect-square overflow-hidden bg-black flex-shrink-0">
                
                {/* Tactical framing elements */}
                <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-white/20 group-hover:border-[#c6b89e]/60 transition-colors" />
                <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-white/20 group-hover:border-[#c6b89e]/60 transition-colors" />
                <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-white/20 group-hover:border-[#c6b89e]/60 transition-colors" />
                <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-white/20 group-hover:border-[#c6b89e]/60 transition-colors" />

                <img
                  src={srcUrl}
                  alt={product.title}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-85 group-hover:scale-105 transition-all duration-[1.2s] ease-out mix-blend-screen"
                />

                {/* Perspective-Corrected, Real-Time 3D Volumetric Portal Projection Overlay */}
                <ProductWireframePortal 
                  productId={product.id} 
                  themeColor={pIdx % 3 === 0 ? "red" : pIdx % 3 === 1 ? "gold" : "emerald"} 
                />

                {/* Laser hover horizontal line */}
                <div className="absolute top-0 bottom-0 left-0 right-0 pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-full h-[1px] bg-[#ff4a00]/30 shadow-[0_0_10px_#ff4a00] absolute animate-scanline" />
                </div>
              </div>

              {/* Specs parameters lists */}
              <div className="p-5 flex-grow flex flex-col justify-between gap-4">
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="font-serif text-lg tracking-wide text-white group-hover:text-[#c6b89e] transition-colors line-clamp-1">
                      {product.title}
                    </h3>
                    <span className="font-mono text-[9px] text-[#ff4a00]/80 tracking-normal inline-block bg-[#ff4a00]/5 px-1.5 border border-[#ff4a00]/15 select-none shrink-0 font-bold">
                      {product.currency}
                    </span>
                  </div>
                  
                  <p className="text-[11px] font-sans text-white/50 leading-relaxed font-extralight line-clamp-3">
                    {product.description}
                  </p>
                </div>

                {/* Technical specifics bullets */}
                <div className="border-t border-white/5 pt-3 space-y-1.5">
                  <div className="font-mono text-[7px] tracking-[3px] text-[#c6b89e]/45 uppercase mb-2 select-none">Atelier parameters</div>
                  {product.specs.slice(0, 3).map((spec, sIdx) => (
                    <div key={sIdx} className="flex gap-2 items-center text-[9px] font-mono text-white/45 truncate">
                      <span className="w-1 h-1 bg-[#ff4a00]/40 rounded-full" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-1 select-none gap-2">
                  <div className="flex flex-col items-start">
                    <div className="font-mono text-xs tracking-widest text-[#c6b89e] font-bold">
                      {product.price}
                    </div>
                    {/* Inline AR trigger button */}
                    <button
                      onClick={() => setArProduct(product)}
                      className="font-mono text-[7px] text-[#ff4a00] hover:text-white mt-1 uppercase tracking-[1.5px] cursor-pointer flex items-center gap-1 bg-transparent border border-[#ff4a00]/25 hover:border-[#c6b89e] px-1.5 py-0.5 transition-all text-left w-fit font-bold"
                    >
                      ▲ PROJ_AR_HUD
                    </button>
                  </div>

                  <Tooltip message={`SYS_DIAG: Request allocation sequence for boutique product ID ${product.id}.`}>
                    <button
                      onClick={() => addToCart(product)}
                      className="font-mono text-[9px] text-white hover:text-[#ff4a00] hover:underline uppercase tracking-[2px] transition-all cursor-pointer flex items-center gap-1 bg-transparent border-0 shrink-0"
                    >
                      Select Item <ArrowRight className="w-3 h-3 text-[#ff4a00]" />
                    </button>
                  </Tooltip>
                </div>
              </div>

            </motion.div>
          );
        })}
      </div>

      {/* REFINABLE COLLAPSIBLE ATHLETIC CART DRAWER COMPONENT */}
      <AnimatePresence>
        {cartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden select-none">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/85 backdrop-blur-xl transition-opacity animate-fade-in"
              onClick={() => setCartOpen(false)}
            />

            <div className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 220, damping: 28 }}
                className="w-screen max-w-md border-l border-white/10 bg-[#020202] text-white flex flex-col h-full font-sans shadow-2xl relative select-text"
              >
                {/* Top bar lines */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-[#ff4a00] to-transparent" />

                {/* Cart Drawer Header */}
                <div className="px-6 py-6 border-b border-white/10 flex justify-between items-center bg-black/80 select-none">
                  <div className="flex items-center gap-3">
                    <CartIcon className="w-5 h-5 text-[#ff4a00]" />
                    <h3 className="font-serif text-xl tracking-widest text-[#c6b89e] uppercase">
                      Atelier Ledger
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      setCartOpen(false);
                      setCheckoutComplete(false);
                    }}
                    className="font-mono text-[9px] uppercase tracking-[3px] text-white/40 hover:text-white border border-white/10 px-3 py-1 bg-[#050505] cursor-pointer"
                  >
                    [ Close ]
                  </button>
                </div>

                {/* Cart Drawer Contents scroll body */}
                <div className="flex-grow p-6 overflow-y-auto custom-scrollbar flex flex-col justify-between">
                  {checkoutComplete ? (
                    /* Checkout complete ticket! */
                    <div className="m-auto text-center py-8">
                      <div className="w-14 h-14 border border-green-400 rounded-full flex items-center justify-center text-green-400 m-auto mb-6 relative">
                        <motion.div
                          className="absolute inset-0 rounded-full border border-green-400"
                          animate={{ scale: [1, 1.4, 1], opacity: [1, 0, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                        <Check className="w-6 h-6" />
                      </div>

                      <h4 className="text-md font-bold tracking-[3px] uppercase mb-1 font-serif text-[#c6b89e]">
                        Atelier Ledger Cleared
                      </h4>
                      <p className="font-mono text-[8px] tracking-[3px] text-green-400 uppercase mb-8">
                        CRYPT_ORD APPROVED BY OPERATOR
                      </p>

                      <p className="text-[12px] text-white/50 leading-relaxed font-sans font-light max-w-sm m-auto mb-8">
                        The purchase authorization ticket is generated. The transaction specifications have registered securely onto your **Scribe Database**.
                      </p>

                      <div className="p-4 bg-black border border-white/5 rounded-none font-mono text-center select-all max-w-xs m-auto">
                        <span className="text-[7px] text-white/30 uppercase tracking-[3px] block mb-1">SETTILEMENT REFERENCE</span>
                        <strong className="text-sm font-bold text-[#c6b89e] tracking-widest">{checkoutSlip}</strong>
                      </div>
                    </div>
                  ) : cart.length === 0 ? (
                    <div className="m-auto text-center py-12 select-none">
                      <ShoppingBag className="w-10 h-10 text-white/15 m-auto mb-4" />
                      <p className="font-serif text-white/40 tracking-wider">Your Ledger basket is currently vacant.</p>
                      <button
                        onClick={() => setCartOpen(false)}
                        className="font-mono text-[9px] text-[#ff4a00] hover:underline uppercase tracking-[2px] mt-4"
                      >
                        Browse Curations &gt;
                      </button>
                    </div>
                  ) : (
                    /* Active Cart Items */
                    <div className="space-y-6">
                      {cart.map((item) => {
                        const cellUrl = (item.product.imgUrl.startsWith("http") || item.product.imgUrl.startsWith("/")) 
                          ? item.product.imgUrl 
                          : `https://images.unsplash.com/photo-${item.product.imgUrl}?q=80&w=300&auto=format&fit=crop`;

                        const itemTotal = parseFloat(item.product.price.replace(/,/g, "")) * item.quantity;

                        return (
                          <div key={item.product.id} className="flex gap-4 border-b border-white/5 pb-6 items-start relative group">
                            
                            <div className="w-20 h-20 bg-black border border-white/10 flex-shrink-0 overflow-hidden relative">
                              <img
                                src={cellUrl}
                                alt={item.product.title}
                                className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                              />
                            </div>

                            <div className="flex-grow flex flex-col justify-between min-h-[80px]">
                              <div>
                                <div className="flex justify-between items-start gap-1">
                                  <h4 className="font-serif text-sm tracking-wide text-white group-hover:text-[#c6b89e] transition-colors line-clamp-1">
                                    {item.product.title}
                                  </h4>
                                  <button
                                    onClick={() => removeFromCart(item.product.id)}
                                    aria-label="Remove item from cart"
                                    className="text-white/30 hover:text-red-400 transition-colors bg-transparent border-0 cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                <span className="text-[10px] font-mono text-white/40 tracking-wider block mt-0.5">
                                  Price: {item.product.currency} {item.product.price}
                                </span>
                              </div>

                              <div className="flex justify-between items-center mt-3 select-none">
                                {/* Quantity controls */}
                                <div className="flex items-center border border-white/15 bg-black">
                                  <button
                                    onClick={() => updateQuantity(item.product.id, -1)}
                                    className="px-2 py-1 text-white/50 hover:text-white transition-colors hover:bg-white/5 cursor-pointer border-0"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="px-3.5 font-mono text-[10px] text-white font-bold leading-none select-none">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => updateQuantity(item.product.id, 1)}
                                    className="px-2 py-1 text-white/50 hover:text-white transition-colors hover:bg-white/5 cursor-pointer border-0"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>

                                <div className="font-mono text-xs text-[#c6b89e]">
                                  € {itemTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                </div>
                              </div>

                            </div>

                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* BOTTOM SUB-GAUGES SETTLEMENT */}
                  {!checkoutComplete && cart.length > 0 && (
                    <div className="border-t border-white/15 pt-6 bg-[#020202] space-y-4">
                      
                      <div className="space-y-1.5 select-none font-mono">
                        <div className="flex justify-between items-center text-[10px] uppercase tracking-[2px] text-white/50">
                          <span>Subtotal Vault</span>
                          <span>€ {subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] uppercase tracking-[2px] text-white/30">
                          <span>Secure Delivery & Packing</span>
                          <span className="text-green-400">COMPLIMENTARY</span>
                        </div>
                        <div className="flex justify-between items-center text-xs uppercase tracking-[3px] text-[#c6b89e] pt-3 border-t border-dashed border-white/10 font-bold">
                          <span>Total Valuation</span>
                          <span>€ {subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                        </div>
                      </div>

                      <Tooltip message="SYS_DIAG: Clear pending ledger basket, serialize settlement keys and record transaction hash." position="top">
                        <button
                          onClick={handleCheckout}
                          disabled={isLoading}
                          className="w-full h-12 bg-[#ff4a00] hover:bg-white text-black font-sans font-bold text-[11px] tracking-[4px] uppercase transition-colors duration-300 cursor-pointer flex items-center justify-center gap-2 select-none"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              COMMITTING TRANSACTION KEY...
                            </>
                          ) : (
                            <>
                              CONFIRM AND SETTLE ROUTE <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </Tooltip>

                      <p className="text-[10px] font-sans text-center text-white/30 leading-relaxed font-extralight select-none">
                        By confirming, you authorize direct coordination sync between your custom Shopify Store integrations and Scribe direct historical receipt logs.
                      </p>

                    </div>
                  )}
                </div>

              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* IMMERSIVE 4D AUGMENTED REALITY VIEWPORT PORTAL (AR HUD SYSTEM) */}
      <AnimatePresence>
        {arProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-md select-none font-mono">
            {/* Ambient matrix style background grids */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:30px_30px]" />
            <div className="absolute inset-0 z-0 pointer-events-none opacity-40 bg-radial-gradient from-transparent via-[#050505] to-[#010101]" />

            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative w-full max-w-5xl h-[85vh] bg-[#020202] border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.95)] flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-white/5 overflow-hidden z-10 rounded-sm"
              id="ARProjectionViewportContainer"
            >
              {/* Outer corner frame brackets */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#ff4a00]/80" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#ff4a00]/80" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#ff4a00]/80" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#ff4a00]/80" />

              {/* LEFT CHANNEL: Interactive Spatial Hologram Viewport */}
              <div className="relative flex-grow h-1/2 md:h-full flex flex-col justify-between p-6 overflow-hidden">
                {/* User Active Video Feed Stream */}
                {streamActive ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen pointer-events-none z-0"
                  />
                ) : (
                  /* Ambient grid fallback placeholder of dynamic scanning visual spaces */
                  <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/90 opacity-80 pointer-events-none z-0 flex items-center justify-center">
                    <div className="text-[9px] tracking-[4px] uppercase text-[#ff4a00]/30 font-bold select-none text-center">
                      [ REAL_WORLD_FEED_STANDBY ]<br />
                      <span className="text-[7px] text-white/20 mt-1 block">ACTIVATE ACCESS MATRIX BY PERMISSION</span>
                      {cameraError && (
                        <span className="text-[6.5px] text-[#ff4a00] uppercase tracking-normal mt-2 block mx-8 font-mono">{cameraError}</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Coordinate scan alignment target borders */}
                <div className="absolute inset-5 border border-white/[0.03] pointer-events-none flex items-center justify-center z-10">
                  <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white/30" />
                  <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/30" />
                  <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white/30" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/30" />
                  
                  {/* Glowing camera lens target indicators */}
                  <div className="w-[1px] h-32 bg-white/[0.04] absolute" />
                  <div className="w-32 h-[1px] bg-white/[0.04] absolute" />
                  <div className="w-48 h-48 border border-dashed border-white/[0.04] rounded-full animate-spin-slow" />
                </div>

                {/* Top Telemetry Parameters */}
                <div className="flex justify-between items-start pointer-events-none z-10 text-[9px] text-[#c6b89e]/80">
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-white tracking-[2px] uppercase">
                      ▲ SPECTRAL ASSEMBLY PREVIEW
                    </div>
                    <div className="text-white/40 uppercase">VALUATION: {arProduct.currency} {arProduct.price}</div>
                  </div>
                  <div className="text-right space-y-0.5 text-white/50">
                    <div>RESOLUTION: VECTOR_4D_WIRE</div>
                    <div>ANCHOR: {scanStatus === 'projecting' ? 'LOCKED_FLR_CALIB' : 'ACQUIRING_MARKERS'}</div>
                  </div>
                </div>

                {/* CENTRAL ACTIVE HOLOGRAM VECTOR DISPLAY */}
                <div className="flex-grow flex items-center justify-center relative select-none">
                  <AnimatePresence mode="wait">
                    {scanStatus === 'calibrating' && (
                      <motion.div
                        key="calibration"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center gap-4 text-center z-10"
                      >
                        <RotateCw className="w-7 h-7 text-[#ff4a00] animate-spin" />
                        <div className="text-[10px] tracking-[4px] uppercase text-[#ff4a00] font-bold animate-pulse">
                          CALIBRATING GROUND COORDS...
                        </div>
                        <div className="w-48 h-1 bg-white/5 border border-white/10 relative overflow-hidden">
                          <div className="h-full bg-[#ff4a00] transition-all duration-[80ms]" style={{ width: `${calibrationProgress}%` }} />
                        </div>
                        <div className="text-[8px] text-white/30 tracking-[1.5px] uppercase">
                          MARKING DEPTH MATRICES // {calibrationProgress}%
                        </div>
                      </motion.div>
                    )}

                    {scanStatus === 'ready' && (
                      <motion.div
                        key="ready"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center gap-2 text-center z-10 text-green-400"
                      >
                        <Check className="w-8 h-8 p-1.5 border border-green-500 rounded-full animate-pulse" />
                        <div className="text-[10px] tracking-[5px] uppercase font-bold text-green-400">
                          CALIBRATION COMPLETE
                        </div>
                        <div className="text-[8px] text-white/40 tracking-[2px] uppercase mt-1">
                          SYNCHRONIZING SECURE HOLOGRAPHIC STREAM...
                        </div>
                      </motion.div>
                    )}

                    {scanStatus === 'projecting' && (
                      <motion.div
                        key="project"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="w-full h-full flex items-center justify-center absolute"
                      >
                        {/* Shutter Camera Flash Ambient Overlay */}
                        {flashActive && (
                          <div className="absolute inset-0 bg-white z-40 pointer-events-none transition-opacity duration-200" />
                        )}

                        {/* Floating Camera snap alignment controller */}
                        <div className="absolute top-16 right-6 flex flex-col items-center gap-1 pointer-events-auto z-45 select-none">
                          <button
                            onClick={handleCaptureSnapshot}
                            title="Capture aligned scene snapshot"
                            className="p-3.5 rounded-full border border-[#ff4a00]/40 hover:border-[#ff4a00] bg-black/90 hover:bg-[#ff4a00] text-[#ff4a00] hover:text-black shadow-[0_0_15px_rgba(255,74,0,0.3)] transition-all cursor-pointer flex items-center justify-center focus:outline-none"
                          >
                            <Camera className="w-4.5 h-4.5" />
                          </button>
                          <span className="text-[7.5px] text-[#ff4a00] tracking-[2px] uppercase font-bold bg-black/75 px-1.5 py-0.5 mt-1 border border-white/5">SNAP HUD</span>
                        </div>

                        {/* Immersive glowing laser scan wave */}
                        <div className="absolute w-[80%] h-0.5 bg-gradient-to-r from-transparent via-[#ff4a00]/30 to-transparent shadow-[0_0_12px_#ff4a00] animate-scanline pointer-events-none z-10" />

                        {/* Drag alignment coordinate track boundaries */}
                        <div
                          style={{
                            transform: `translate(${arTranslateX}px, ${arTranslateY}px)`,
                            transformStyle: "preserve-3d",
                            cursor: isDragging ? 'grabbing' : 'grab',
                          }}
                          onMouseDown={handleMouseDown}
                          onMouseMove={handleMouseMove}
                          onMouseUp={handleMouseUp}
                          onMouseLeave={handleMouseUp}
                          onTouchStart={handleTouchStart}
                          onTouchMove={handleTouchMove}
                          onTouchEnd={handleMouseUp}
                          className="relative flex items-center justify-center p-8 select-none z-20 group"
                        >
                          {/* Floating user guide instructions helper board */}
                          <div className="absolute -top-12 opacity-80 group-hover:opacity-100 transition-opacity bg-black/90 p-2.5 border border-white/10 rounded-sm text-[8px] text-[#c6b89e] uppercase tracking-[2px] pointer-events-none text-center whitespace-nowrap shadow-xl">
                            <span className="text-white font-bold text-[8.5px]">VISITOR GUIDE: ALIGN AR WIREFRAME IN YOUR SPACE</span>
                            <br /><span className="text-white/40 text-[7px] mt-0.5 block">DRAG MODEL WITH MOUSE/TOUCH TO SHIFT BASE LOCATION</span>
                          </div>

                          {/* Interactive wireframe SVG assembly drawing */}
                          <svg
                            viewBox="0 0 400 400"
                            className="w-[280px] h-[280px] filter drop-shadow-[0_0_20px_var(--ar-col)]"
                            style={{
                              transform: `rotateY(${arAngle}deg) scale(${arScale})`,
                              transformStyle: "preserve-3d",
                              color: arColor === 'red' ? '#ff4a00' : arColor === 'emerald' ? '#10b981' : '#c6b89e',
                              '--ar-col': arColor === 'red' ? '#ff4a00' : arColor === 'emerald' ? '#10b981' : '#c6b89e'
                            } as any}
                          >
                            {/* Outer architectural compass axis elements */}
                            <circle cx="200" cy="200" r="185" fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.1" />
                            <circle cx="200" cy="200" r="175" fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.2" strokeDasharray="4 4" />
                            <circle cx="200" cy="200" r="130" fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.15" />

                            {/* Dynamic SVG wireframe outline blueprint based on product type */}
                            {arProduct.id.includes("watch") || arProduct.title.toLowerCase().includes("watch") || arProduct.id.includes("forged") ? (
                              /* Planetary gear tourbillon watch */
                              <g stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="200" cy="200" r="95" strokeOpacity="0.6" />
                                <circle cx="200" cy="200" r="85" strokeOpacity="0.4" />
                                <circle cx="200" cy="200" r="30" strokeOpacity="0.75" />
                                {/* Internal tourbillon mechanics cages */}
                                <circle cx="200" cy="200" r="15" strokeDasharray="3 3" />
                                {[0, 60, 120, 180, 240, 300].map((deg) => {
                                  const angle = (deg * Math.PI) / 180;
                                  return (
                                    <line
                                      key={deg}
                                      x1={200 + Math.cos(angle) * 30}
                                      y1={200 + Math.sin(angle) * 30}
                                      x2={200 + Math.cos(angle) * 95}
                                      y2={200 + Math.sin(angle) * 95}
                                      strokeOpacity="0.3"
                                    />
                                  );
                                })}
                                {/* Glowing hands */}
                                <polyline points="200,200 240,140" strokeWidth="1.5" strokeOpacity="0.9" />
                                <polyline points="200,200 160,195" strokeWidth="1.2" strokeOpacity="0.7" />
                                {/* Outer gears */}
                                <circle cx="200" cy="200" r="110" strokeDasharray="3 6" strokeOpacity="0.15" />
                              </g>
                            ) : arProduct.id.includes("chair") || arProduct.title.toLowerCase().includes("chair") ? (
                              /* High-fidelity Lounge Chair mesh outline */
                              <g stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="120,110 280,110 260,220 140,220" strokeOpacity="0.6" />
                                <line x1="120" y1="110" x2="260" y2="220" strokeOpacity="0.2" />
                                <line x1="280" y1="110" x2="140" y2="220" strokeOpacity="0.2" />
                                <polygon points="130,220 270,220 290,260 110,260" strokeOpacity="0.7" />
                                <line x1="110" y1="260" x2="270" y2="220" strokeOpacity="0.3" />
                                <line x1="140" y1="260" x2="160" y2="330" strokeOpacity="0.8" />
                                <line x1="260" y1="260" x2="240" y2="330" strokeOpacity="0.8" />
                                <line x1="110" y1="220" x2="110" y2="260" strokeOpacity="0.5" />
                                <line x1="290" y1="220" x2="290" y2="260" strokeOpacity="0.5" />
                                <ellipse cx="200" cy="330" rx="60" ry="12" strokeOpacity="0.4" />
                              </g>
                            ) : arProduct.title.toLowerCase().includes("sanctuary") || arProduct.id.includes("house") ? (
                              /* Vault architectural rotunda */
                              <g stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <ellipse cx="200" cy="280" rx="90" ry="25" strokeOpacity="0.6" />
                                <ellipse cx="200" cy="220" rx="75" ry="20" strokeOpacity="0.4" />
                                <ellipse cx="200" cy="160" rx="50" ry="13" strokeOpacity="0.3" />
                                {[130, 160, 200, 240, 270].map((x) => (
                                  <line key={x} x1={x} y1={160} x2={x} y2={280} strokeOpacity="0.3" />
                                ))}
                                <rect x="90" y="280" width="220" height="15" strokeOpacity="0.8" />
                                <rect x="70" y="295" width="260" height="15" strokeOpacity="0.9" />
                              </g>
                            ) : (
                              /* Dual-hull yacht curves structural grid */
                              <g stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="200,80 290,260 110,260" strokeOpacity="0.6" />
                                <polyline points="200,80 200,285" strokeOpacity="0.7" />
                                <polygon points="100,260 300,260 270,312 130,312" strokeOpacity="0.7" />
                                <polygon points="150,200 250,200 240,240 160,240" strokeOpacity="0.6" />
                                <line x1="120" y1="312" x2="110" y2="340" />
                                <line x1="280" y1="312" x2="290" y2="340" />
                              </g>
                            )}
                          </svg>
                        </div>

                        {/* Orbit axis label overlay */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 p-2 bg-black/60 border border-white/5 font-mono text-[8px] uppercase tracking-[3px] text-white/50 inline-block pointer-events-auto">
                          PLANE_COORD: AXIS_Y_ROT // {Math.round(arAngle)}° // X: {Math.round(arTranslateX)} // Y: {Math.round(arTranslateY)}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Bottom Control buttons */}
                <div className="flex justify-between items-center z-10 pointer-events-auto">
                  <div className="space-y-0.5">
                    <span className="text-[7.5px] text-white/40 block uppercase tracking-wider">Calibration Matrix Status</span>
                    <div className="flex items-center gap-1.5 text-[9px] text-[#c6b89e] uppercase font-bold">
                      <span className={`w-1.5 h-1.5 rounded-full ${scanStatus === 'projecting' ? 'bg-[#ff4a00] animate-pulse' : 'bg-yellow-500 animate-spin'}`} />
                      STREAM_FEED: {scanStatus === 'projecting' ? 'ACTIVE' : 'COORDINATING_SENSORS'}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setScanStatus("calibrating");
                      setCalibrationProgress(0);
                      const interval = setInterval(() => {
                        setCalibrationProgress(prev => {
                          if (prev >= 100) {
                            clearInterval(interval);
                            setScanStatus("ready");
                            setTimeout(() => setScanStatus("projecting"), 1000);
                            return 100;
                          }
                          return prev + 5;
                        });
                      }, 50);
                    }}
                    className="font-mono text-[9px] text-white hover:text-[#ff4a00] hover:underline uppercase tracking-[2px] transition-all cursor-pointer bg-transparent border-0"
                  >
                    [ RE-CALIBRATE HUD ]
                  </button>
                </div>
              </div>

              {/* RIGHT CHANNEL: Diagnostics Controller Panel */}
              <div className="relative w-full md:w-[350px] flex flex-col justify-between p-6 bg-black/[0.45] font-mono shrink-0">
                
                {/* Diagnostics details */}
                <div className="space-y-6 flex-grow overflow-y-auto custom-scrollbar pr-1 select-text">
                  <div className="flex justify-between items-start border-b border-white/5 pb-4 select-none">
                    <div>
                      <h3 className="font-serif text-[17px] tracking-wide text-white font-bold leading-tight line-clamp-1">
                        {arProduct.title}
                      </h3>
                      <span className="text-[7px] text-[#ff4a00] uppercase tracking-[3px] block mt-1.5">
                        AUGMENTED DIAGNOSTICS KEY
                      </span>
                    </div>
                    <button
                      onClick={() => setArProduct(null)}
                      className="text-white/40 hover:text-white font-mono text-[10px] tracking-widest border border-white/10 hover:border-white px-2.5 py-1 bg-black/60 cursor-pointer select-none"
                    >
                      [ CLOSE ]
                    </button>
                  </div>

                  {/* Curated specifics parameters */}
                  <div className="space-y-4">
                    <div className="text-[8px] text-[#c6b89e] uppercase tracking-[4px] select-none">ATELIER PARAMETERS</div>
                    <div className="space-y-2 text-[10px] text-white/70">
                      {arProduct.specs.map((spec, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 border-b border-white/[0.03] pb-2 font-mono">
                          <span className="text-[#ff4a00] shrink-0">▸</span>
                          <span className="leading-normal">{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Calibration controller configurations */}
                  <div className="space-y-4 pt-1 select-none">
                    <div className="text-[8px] text-[#c6b89e] uppercase tracking-[4px]">SPECTRAL CONTROLLER HUD</div>
                    
                    {/* Size and Scale parameters */}
                    <div className="space-y-2.5 border border-white/5 px-3 py-3 bg-black/30">
                      <div className="flex justify-between items-center text-[9px] text-white/55">
                        <span>MAGNIFICATION SCALE</span>
                        <span className="font-bold text-[#ff4a00]">{Math.round(arScale * 100)}%</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setArScale(prev => Math.max(0.6, prev - 0.1))}
                          className="flex-grow py-1.5 bg-white/5 hover:bg-white/10 hover:text-[#ff4a00] border border-white/10 text-[9px] transition-all cursor-pointer"
                        >
                          [ ZOOM OUT ]
                        </button>
                        <button
                          onClick={() => setArScale(prev => Math.min(1.5, prev + 0.1))}
                          className="flex-grow py-1.5 bg-white/5 hover:bg-white/10 hover:text-[#ff4a00] border border-white/10 text-[9px] transition-all cursor-pointer"
                        >
                          [ ZOOM IN ]
                        </button>
                      </div>
                    </div>

                    {/* Laser Spectrum selectors */}
                    <div className="space-y-2.5 border border-white/5 px-3 py-3 bg-black/30">
                      <span className="text-[9px] text-white/55 block">LASER HARMONIC SPECTRUM</span>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'gold', label: 'ROYAL_GLD', col: '#c6b89e' },
                          { id: 'red', label: 'VERMILION', col: '#ff4a00' },
                          { id: 'emerald', label: 'EMERALD', col: '#10b981' }
                        ].map((cl) => (
                          <button
                            key={cl.id}
                            onClick={() => setArColor(cl.id as any)}
                            className={`py-1.5 border font-mono text-[8.5px] uppercase tracking-wider text-center cursor-pointer transition-all ${
                              arColor === cl.id 
                                ? "border-white bg-white/10 text-white font-bold" 
                                : "border-white/10 hover:border-white/30 text-white/50"
                            }`}
                          >
                            <span className="inline-block w-1.5 h-1.5 rounded-full mr-1" style={{ backgroundColor: cl.col }} />
                            {cl.id}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Auto rotation lock */}
                    <div className="flex justify-between items-center bg-black/35 py-2 px-3 border border-white/5">
                      <span className="text-[9px] text-white/55 uppercase tracking-wide">AUTO-ROTATE DIAGRAM</span>
                      <button
                        onClick={() => setAutoRotate(!autoRotate)}
                        className={`text-[9px] uppercase tracking-widest px-2 py-0.5 border cursor-pointer ${autoRotate ? 'bg-green-500/10 border-green-500/50 text-green-400 font-bold' : 'bg-transparent border-white/15 text-white/40'}`}
                      >
                        {autoRotate ? "[ ENABLED ]" : "[ PAUSED ]"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Secure inquiry gateway projection link */}
                <div className="border-t border-white/5 pt-4 mt-6 select-none bg-transparent">
                  <button
                    onClick={() => {
                      addToCart(arProduct);
                      setArProduct(null);
                    }}
                    className="w-full py-3.5 bg-white text-black font-sans font-bold text-[10px] tracking-[4px] uppercase hover:bg-[#ff4a00] hover:text-black transition-colors duration-300 cursor-pointer flex items-center justify-center gap-1.5 shadow-lg"
                  >
                    ALLOCATION PREFERENCE <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
