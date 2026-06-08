/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
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
  DollarSign
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
    title: "Atelier Chrono 'Aura'",
    description: "Highly structural luxury wristwatch. Cast in grade 5 titanium with an elegant satin finish, and a tourbillon movement reflecting custom cosmic coordinates.",
    price: "28,500.00",
    currency: "EUR",
    imgUrl: "1523275335652-32a74c7402a5", // Watch
    specs: ["Grade 5 Titanium", "60-Hour Power Reserve", "Tourbillon Calibre", "Saphire Crystall Case"]
  },
  {
    id: "KSD-02",
    title: "Avarice Obsidian Lounge Chair",
    description: "Monolithic accent chair hand-formed from aerospace-grade structural carbon fiber composite and finished in high-polish black lacquer. Elegant space-maximizing geometry.",
    price: "18,900.00",
    currency: "EUR",
    imgUrl: "1567538096630-e0c55bd6374c", // Modern chair
    specs: ["Aegean Architecture-inspired", "Structural Carbon Fiber", "High-Polish Black Lacquer", "Ergonomic Tension Shell"]
  },
  {
    id: "KSD-03",
    title: "Sovereign Coast Architectural Blueprint",
    description: "Complete spatial planning suite and physical blueprints for our cliffside Aegean residential compound. Complete with custom energy calculations and geothermal grids.",
    price: "450,000.00",
    currency: "EUR",
    imgUrl: "1513694203232-719a280e022f", // Luxurious architectural interior
    specs: ["Aegean Sea Coordinates", "Self-sustaining systems", "Geothermal power integration", "Complete digital Revit files"]
  },
  {
    id: "KSD-04",
    title: "The Kingshadp Horizon Yacht Cruise",
    description: "Exclusive charter of the 86M yacht 'Horizon'. 7 days in pristine Mediterranean international waters, accommodating up to 12 esteemed guests under total secure isolation.",
    price: "1,250,000.00",
    currency: "EUR",
    imgUrl: "1559136555-9303baea8ebd", // Yacht
    specs: ["86-Meter Hybrid propulsion", "Helipad & Sub-tender support", "18 Cabin crew inclusive", "Satellite Encryption Suite"]
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

      {/* CORE BOUTIQUE GALLERY DEEP CONTAINER GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 pb-20">
        {products.map((product, pIdx) => {
          // Detect if image is standard unsplash ID or live URL
          const srcUrl = product.imgUrl.startsWith("http") 
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

                <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-1 select-none">
                  <div className="font-mono text-sm tracking-widest text-[#c6b89e] font-bold">
                    {product.price}
                  </div>

                  <Tooltip message={`SYS_DIAG: Request allocation sequence for boutique product ID ${product.id}.`}>
                    <button
                      onClick={() => addToCart(product)}
                      className="font-mono text-[9px] text-white hover:text-[#ff4a00] hover:underline uppercase tracking-[2px] transition-all cursor-pointer flex items-center gap-1 bg-transparent border-0"
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
                        const cellUrl = item.product.imgUrl.startsWith("http") 
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

    </div>
  );
}
