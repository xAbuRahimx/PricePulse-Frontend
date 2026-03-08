const { useState, useEffect, useCallback } = React;

const API_BASE = "https://pricepulse-backend-production.up.railway.app";

const BRANDS = [
  { id: "noon", name: "Noon", logo: "🛍️", color: "#FEEE00", textColor: "#000", url: "https://www.noon.com" },
  { id: "amazon", name: "Amazon Egypt", logo: "📦", color: "#FF9900", textColor: "#000", url: "https://www.amazon.eg" },
  { id: "jumia", name: "Jumia", logo: "🏪", color: "#F68B1E", textColor: "#fff", url: "https://www.jumia.com.eg" },
  { id: "carrefour", name: "Carrefour", logo: "🛒", color: "#004899", textColor: "#fff", url: "https://www.carrefouregypt.com" },
  { id: "ikea", name: "IKEA", logo: "🪑", color: "#0058A3", textColor: "#fff", url: "https://www.ikea.com/eg" },
  { id: "lcwaikiki", name: "LC Waikiki", logo: "👔", color: "#E30613", textColor: "#fff", url: "https://www.lcwaikiki.com" },
  { id: "adidas", name: "Adidas", logo: "👟", color: "#000000", textColor: "#fff", url: "https://www.adidas.com.eg" },
  { id: "zara", name: "Zara", logo: "👗", color: "#1A1A1A", textColor: "#fff", url: "https://www.zara.com/eg" },
];

const MOCK_PRODUCTS = [
  {
    id: 1, name: "iPhone 15 Pro 256GB", brand: "noon", category: "Electronics",
    currentPrice: 45999, originalPrice: 52000, currency: "EGP",
    image: "📱", inStock: true, discount: 11,
    priceHistory: [
      { date: "2024-01-01", price: 52000 }, { date: "2024-01-15", price: 50000 },
      { date: "2024-02-01", price: 48500 }, { date: "2024-02-15", price: 47000 },
      { date: "2024-03-01", price: 45999 },
    ]
  },
  {
    id: 2, name: "Samsung 65\" QLED 4K TV", brand: "amazon", category: "Electronics",
    currentPrice: 28500, originalPrice: 35000, currency: "EGP",
    image: "📺", inStock: true, discount: 19,
    priceHistory: [
      { date: "2024-01-01", price: 35000 }, { date: "2024-01-20", price: 33000 },
      { date: "2024-02-10", price: 30000 }, { date: "2024-03-01", price: 28500 },
    ]
  },
  {
    id: 3, name: "Adidas Ultraboost 23", brand: "adidas", category: "Shoes",
    currentPrice: 3200, originalPrice: 4500, currency: "EGP",
    image: "👟", inStock: true, discount: 29,
    priceHistory: [
      { date: "2024-01-01", price: 4500 }, { date: "2024-02-01", price: 4000 },
      { date: "2024-02-20", price: 3500 }, { date: "2024-03-01", price: 3200 },
    ]
  },
  {
    id: 4, name: "IKEA KALLAX Shelf Unit", brand: "ikea", category: "Furniture",
    currentPrice: 1850, originalPrice: 2200, currency: "EGP",
    image: "🪑", inStock: false, discount: 16,
    priceHistory: [
      { date: "2024-01-01", price: 2200 }, { date: "2024-02-15", price: 2000 },
      { date: "2024-03-01", price: 1850 },
    ]
  },
  {
    id: 5, name: "Zara Men Slim Fit Jacket", brand: "zara", category: "Clothing",
    currentPrice: 1299, originalPrice: 1299, currency: "EGP",
    image: "🧥", inStock: true, discount: 0,
    priceHistory: [
      { date: "2024-01-01", price: 1299 }, { date: "2024-02-01", price: 1299 },
      { date: "2024-03-01", price: 1299 },
    ]
  },
  {
    id: 6, name: "Dyson V15 Vacuum Cleaner", brand: "jumia", category: "Appliances",
    currentPrice: 18900, originalPrice: 22000, currency: "EGP",
    image: "🌀", inStock: true, discount: 14,
    priceHistory: [
      { date: "2024-01-01", price: 22000 }, { date: "2024-01-25", price: 21000 },
      { date: "2024-02-20", price: 19500 }, { date: "2024-03-01", price: 18900 },
    ]
  },
];

const MOCK_NOTIFICATIONS = [
  { id: 1, type: "deal", brand: "noon", message: "عرض على آيفون 15 - خصم 11%", time: "منذ ساعتين", read: false, icon: "🔥" },
  { id: 2, type: "price_drop", product: "Samsung TV", message: "سعر التلفزيون نزل من 30,000 لـ 28,500 EGP", time: "منذ 5 ساعات", read: false, icon: "📉" },
  { id: 3, type: "deal", brand: "adidas", message: "تخفيضات على الأحذية تصل لـ 29%", time: "منذ يوم", read: true, icon: "🛍️" },
  { id: 4, type: "lowest_price", product: "Dyson Vacuum", message: "أقل سعر تاريخي! 18,900 EGP", time: "منذ يومين", read: true, icon: "⭐" },
];

function MiniChart({ history, color = "#00ff88" }) {
  if (!history || history.length < 2) return null;
  const prices = history.map(h => h.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  const W = 120, H = 40;

  const pointsStr = history.map((h, i) => {
    const x = (i / (history.length - 1)) * W;
    const y = ((max - h.price) / range) * (H - 8) + 4;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width={W} height={H} style={{ overflow: "visible" }}>
      <polyline points={pointsStr} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {history.map((h, i) => {
        const x = (i / (history.length - 1)) * W;
        const y = ((max - h.price) / range) * (H - 8) + 4;
        return <circle key={i} cx={x} cy={y} r="3" fill={color} />;
      })}
    </svg>
  );
}

function PriceTracker() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedBrands, setSelectedBrands] = useState(["noon", "amazon", "adidas"]);
  const [trackedProducts, setTrackedProducts] = useState([1, 2]);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [lastCheck, setLastCheck] = useState(new Date());
  const [nextCheck, setNextCheck] = useState(new Date(Date.now() + 6 * 60 * 60 * 1000));
  const [addProductUrl, setAddProductUrl] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [notifEmail, setNotifEmail] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [countdown, setCountdown] = useState("");
  const [userProducts, setUserProducts] = useState([]);
  const [importUrl, setImportUrl] = useState("");
  const [importLoading, setImportLoading] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [importError, setImportError] = useState("");

  // ─── Load data from Backend ───────────────────────────────────────────
  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsRes, notifsRes, brandsRes, statsRes] = await Promise.all([
          fetch(`${API_BASE}/products`),
          fetch(`${API_BASE}/notifications`),
          fetch(`${API_BASE}/brands`),
          fetch(`${API_BASE}/stats`),
        ]);
        if (productsRes.ok) {
          const prods = await productsRes.json();
          setUserProducts(prods.map(p => ({
            ...p,
            currentPrice: p.current_price,
            originalPrice: p.original_price,
            inStock: p.in_stock,
            priceHistory: (p.price_history || []).map(h => ({ date: h.checked_at?.split("T")[0], price: h.price }))
          })));
        }
        if (notifsRes.ok) {
          const notifs = await notifsRes.json();
          if (notifs.length > 0) setNotifications(notifs.map(n => ({
            ...n, icon: n.type === "price_drop" ? "📉" : n.type === "lowest_price" ? "⭐" : "🔔",
            time: new Date(n.created_at).toLocaleString("ar-EG"), read: n.read === 1
          })));
        }
        if (brandsRes.ok) {
          const brands = await brandsRes.json();
          const activeBrands = brands.filter(b => b.active === 1).map(b => b.id);
          if (activeBrands.length > 0) setSelectedBrands(activeBrands);
        }
        if (statsRes.ok) {
          const stats = await statsRes.json();
          if (stats.next_check) setNextCheck(new Date(stats.next_check));
        }
      } catch (e) {
        console.log("Backend not available, using demo data");
      }
    };
    loadData();
  }, []);

  const saveProductToBackend = async (product) => {
    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: product.name, url: product.url || "", brand: product.brand,
          category: product.category, image: product.image,
          current_price: product.currentPrice, original_price: product.originalPrice,
          currency: product.currency || "EGP", in_stock: product.inStock,
          discount: product.discount || 0
        })
      });
      if (res.ok) {
        const data = await res.json();
        return data.id;
      }
    } catch (e) { console.log("Could not save to backend"); }
    return null;
  };

  const trackInBackend = async (productId) => {
    if (!notifEmail) return;
    try {
      await fetch(`${API_BASE}/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId, user_email: notifEmail })
      });
    } catch (e) {}
  };

  const forceCheck = async () => {
    try {
      await fetch(`${API_BASE}/check-now`, { method: "POST" });
      setNotifications(prev => [{ id: Date.now(), icon: "🔍", message: "جاري فحص الأسعار الآن...", time: "دلوقتي", read: false }, ...prev]);
    } catch (e) {}
  };

  const allProducts = [...MOCK_PRODUCTS, ...userProducts];
  const unreadCount = notifications.filter(n => !n.read).length;
  const trackedProductsData = allProducts.filter(p => trackedProducts.includes(p.id));
  const deals = allProducts.filter(p => selectedBrands.includes(p.brand) && p.discount > 0);

  const detectBrandFromUrl = (url) => {
    for (const b of BRANDS) {
      if (url.includes(b.id) || url.includes(b.url.replace("https://www.", "").replace("https://", "").split("/")[0])) return b.id;
    }
    return "noon";
  };

  const extractSearchQuery = (url) => {
    try {
      // Amazon ASIN extraction
      const asinMatch = url.match(/\/dp\/([A-Z0-9]{10})|asin=([A-Z0-9]{10})|d\/([A-Za-z0-9]{8,12})/);
      if (asinMatch) {
        const asin = asinMatch[1] || asinMatch[2] || asinMatch[3];
        return `amazon product ASIN ${asin} egypt price`;
      }
      // Noon product
      if (url.includes("noon.com")) {
        const parts = url.split("/").filter(Boolean);
        return `noon egypt ${parts[parts.length - 1]?.replace(/-/g, " ")} price`;
      }
      // Generic - use URL path as search
      const urlObj = new URL(url.startsWith("http") ? url : "https://" + url);
      const path = urlObj.pathname.split("/").filter(Boolean).join(" ");
      return `${urlObj.hostname} ${path} product price egypt`;
    } catch {
      return url;
    }
  };

  const [importMode, setImportMode] = useState("url"); // "url" | "search"
  const [importSearchQuery, setImportSearchQuery] = useState("");

  const searchProductByName = async () => {
    if (!importSearchQuery.trim()) return;
    setImportLoading(true);
    setImportError("");
    setImportResult(null);
    try {
      const response = await fetch(`${API_BASE}/search-product`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: importSearchQuery })
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "فشل البحث");
      }
      const parsed = await response.json();
      const newProduct = {
        id: Date.now(), ...parsed,
        brand: parsed.brand || "amazon",
        url: "",
        priceHistory: [{ date: new Date().toISOString().split("T")[0], price: parsed.currentPrice }]
      };
      setImportResult(newProduct);
    } catch (e) {
      setImportError("خطأ: " + (e?.message || String(e)));
    }
    setImportLoading(false);
  };

  const importProductFromUrl = async () => {
    if (!importUrl.trim()) return;
    setImportLoading(true);
    setImportError("");
    setImportResult(null);
    try {
      const searchQuery = extractSearchQuery(importUrl);

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          tools: [{ type: "web_search_20250305", name: "web_search" }],
          system: "You are a product data extractor. You MUST always respond with ONLY a valid JSON object, no other text, no explanation, no markdown. Just the raw JSON.",
          messages: [{
            role: "user",
            content: `Search for this product and return its details as JSON.

Product URL or search: ${importUrl}
Search query to use: ${searchQuery}

Search for this product on the web, find its current price in Egypt (EGP), then respond with ONLY this JSON format (no other text at all):
{"name":"Product Name","currentPrice":12345,"originalPrice":15000,"currency":"EGP","category":"Electronics","image":"📱","inStock":true,"discount":18,"description":"brief description"}

Rules:
- Price must be a number only (no currency symbols)
- If price is in USD, multiply by 50 for EGP estimate  
- Choose appropriate emoji for the product type
- discount = round((originalPrice - currentPrice) / originalPrice * 100)
- If no original price found, set originalPrice = currentPrice and discount = 0
- ONLY output the JSON object, nothing else`
          }]
        })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      const text = data.content.filter(c => c.type === "text").map(c => c.text).join("");
      const jsonMatch = text.match(/\{[\s\S]*?\}/);
      if (!jsonMatch) throw new Error("لم يتم العثور على بيانات المنتج - حاول مع رابط مباشر من الموقع");
      const parsed = JSON.parse(jsonMatch[0]);
      if (!parsed.name || !parsed.currentPrice) throw new Error("البيانات ناقصة - جرب رابط مباشر للمنتج");
      const brand = detectBrandFromUrl(importUrl);
      const newProduct = {
        id: Date.now(),
        ...parsed,
        brand,
        url: importUrl,
        priceHistory: [{ date: new Date().toISOString().split("T")[0], price: parsed.currentPrice }]
      };
      setImportResult(newProduct);
    } catch (e) {
      setImportError("خطأ: " + (e?.message || String(e)));
    }
    setImportLoading(false);
  };

  const confirmAddProduct = async () => {
    if (!importResult) return;
    // Save to backend first
    const backendId = await saveProductToBackend(importResult);
    const finalProduct = { ...importResult, id: backendId || importResult.id };
    setUserProducts(prev => [...prev, finalProduct]);
    setTrackedProducts(prev => [...prev, finalProduct.id]);
    // Track in backend if email provided
    if (backendId) await trackInBackend(backendId);
    setNotifications(prev => [{
      id: Date.now(), type: "new_product", icon: "✅",
      message: `تم إضافة "${importResult.name}" لقائمة التتبع`,
      time: "دلوقتي", read: false
    }, ...prev]);
    setImportResult(null);
    setImportUrl("");
    setActiveTab("tracked");
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = nextCheck - new Date();
      if (diff <= 0) {
        setLastCheck(new Date());
        setNextCheck(new Date(Date.now() + 6 * 60 * 60 * 1000));
        setCountdown("جاري الفحص...");
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setCountdown(`${h}س ${m}د ${s}ث`);
    }, 1000);
    return () => clearInterval(timer);
  }, [nextCheck]);

  const toggleBrand = (id) => {
    setSelectedBrands(prev =>
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  const toggleTrack = (id) => {
    setTrackedProducts(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  const formatPrice = (p) => p.toLocaleString("ar-EG") + " EGP";
  const formatDate = (d) => new Date(d).toLocaleDateString("ar-EG", { month: "short", day: "numeric" });

  return (
    <div style={{
      fontFamily: "'Cairo', 'Tajawal', sans-serif",
      background: "#0A0A0F",
      minHeight: "100vh",
      color: "#E8E8F0",
      direction: "rtl",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet" />
      
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #12121A; }
        ::-webkit-scrollbar-thumb { background: #2A2A3E; border-radius: 2px; }
        .tab-btn { transition: all 0.2s; cursor: pointer; border: none; }
        .tab-btn:hover { opacity: 0.85; }
        .brand-card { transition: all 0.2s; cursor: pointer; }
        .brand-card:hover { transform: translateY(-2px); }
        .product-card { transition: all 0.25s; }
        .product-card:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(0,255,136,0.08); }
        .pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
        .slide-in { animation: slideIn 0.3s ease; }
        @keyframes slideIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        .glow { box-shadow: 0 0 20px rgba(0,255,136,0.15); }
        input, textarea { outline: none; }
        button { cursor: pointer; }
      `}</style>

      {/* Header */}
      <header style={{
        background: "linear-gradient(135deg, #12121A 0%, #1A1A2E 100%)",
        borderBottom: "1px solid #1E1E32",
        padding: "0 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 64, position: "sticky", top: 0, zIndex: 100,
        backdropFilter: "blur(10px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: "linear-gradient(135deg, #00ff88, #00ccff)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18
          }}>📡</div>
          <div>
            <div style={{ fontWeight: 900, fontSize: 16, letterSpacing: "-0.3px" }}>PricePulse</div>
            <div style={{ fontSize: 11, color: "#666", marginTop: -2 }}>تتبع الأسعار والعروض</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* Countdown */}
          <div style={{
            background: "#1A1A2E", border: "1px solid #2A2A3E",
            borderRadius: 8, padding: "6px 12px",
            display: "flex", alignItems: "center", gap: 8, fontSize: 12
          }}>
            <div className="pulse" style={{ width: 6, height: 6, borderRadius: "50%", background: "#00ff88" }} />
            <span style={{ color: "#888" }}>الفحص القادم:</span>
            <span style={{ color: "#00ff88", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{countdown}</span>
          </div>
          <button onClick={forceCheck} title="فحص فوري" style={{
            background: "#1A1A2E", border: "1px solid #2A2A3E",
            borderRadius: 10, width: 38, height: 38,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16
          }}>🔍</button>

          {/* Notifications Bell */}
          <div style={{ position: "relative", cursor: "pointer" }} onClick={() => setActiveTab("notifications")}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: "#1A1A2E", border: "1px solid #2A2A3E",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, transition: "all 0.2s"
            }}>🔔</div>
            {unreadCount > 0 && (
              <div style={{
                position: "absolute", top: -4, right: -4,
                background: "#FF4444", color: "#fff",
                borderRadius: "50%", width: 18, height: 18,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 700, border: "2px solid #0A0A0F"
              }}>{unreadCount}</div>
            )}
          </div>

          <button
            style={{
              background: "#1A1A2E", border: "1px solid #2A2A3E",
              borderRadius: 10, width: 38, height: 38,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18
            }}
            onClick={() => setShowSettings(!showSettings)}
          >⚙️</button>
        </div>
      </header>

      {/* Nav Tabs */}
      <nav style={{
        background: "#12121A", borderBottom: "1px solid #1E1E32",
        display: "flex", gap: 4, padding: "8px 24px", overflowX: "auto"
      }}>
        {[
          { id: "dashboard", icon: "🏠", label: "الرئيسية" },
          { id: "brands", icon: "🏷️", label: "البراندات" },
          { id: "products", icon: "📦", label: "المنتجات" },
          { id: "tracked", icon: "⭐", label: "قائمة التتبع" },
          { id: "notifications", icon: "🔔", label: "الإشعارات", badge: unreadCount },
        ].map(tab => (
          <button
            key={tab.id}
            className="tab-btn"
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600,
              background: activeTab === tab.id
                ? "linear-gradient(135deg, #00ff8820, #00ccff15)"
                : "transparent",
              color: activeTab === tab.id ? "#00ff88" : "#888",
              border: activeTab === tab.id ? "1px solid #00ff8840" : "1px solid transparent",
              whiteSpace: "nowrap", position: "relative",
              fontFamily: "'Cairo', sans-serif"
            }}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.badge > 0 && (
              <span style={{
                background: "#FF4444", color: "#fff",
                borderRadius: 10, padding: "1px 5px", fontSize: 10, fontWeight: 700
              }}>{tab.badge}</span>
            )}
          </button>
        ))}
      </nav>

      <main style={{ padding: "24px", maxWidth: 1100, margin: "0 auto" }}>

        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="slide-in">
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
              {[
                { icon: "🏷️", label: "براندات مراقبة", value: selectedBrands.length, color: "#00ff88" },
                { icon: "📦", label: "منتجات متتبعة", value: trackedProducts.length, color: "#00ccff" },
                { icon: "🔥", label: "عروض نشطة", value: deals.length, color: "#FF9900" },
                { icon: "🔔", label: "إشعارات جديدة", value: unreadCount, color: "#FF4444" },
              ].map((s, i) => (
                <div key={i} style={{
                  background: "linear-gradient(135deg, #12121A, #1A1A2E)",
                  border: "1px solid #1E1E32", borderRadius: 14,
                  padding: 20, display: "flex", flexDirection: "column", gap: 8
                }}>
                  <div style={{ fontSize: 28 }}>{s.icon}</div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: "#666" }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Active Deals */}
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                🔥 <span>العروض النشطة على براندات متابعة</span>
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                {deals.map(p => {
                  const brandInfo = BRANDS.find(b => b.id === p.brand);
                  const isTracked = trackedProducts.includes(p.id);
                  const minPrice = Math.min(...p.priceHistory.map(h => h.price));
                  const isLowest = p.currentPrice === minPrice;
                  return (
                    <div key={p.id} className="product-card" style={{
                      background: "linear-gradient(135deg, #12121A, #1A1A2E)",
                      border: isLowest ? "1px solid #00ff8840" : "1px solid #1E1E32",
                      borderRadius: 14, padding: 20,
                      boxShadow: isLowest ? "0 0 20px rgba(0,255,136,0.06)" : "none",
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                        <div style={{ display: "flex", gap: 10 }}>
                          <span style={{ fontSize: 32 }}>{p.image}</span>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 13, lineHeight: 1.3 }}>{p.name}</div>
                            <div style={{
                              display: "inline-flex", alignItems: "center", gap: 4,
                              background: brandInfo?.color + "20", color: brandInfo?.color || "#888",
                              padding: "2px 8px", borderRadius: 6, fontSize: 11, marginTop: 4, fontWeight: 600
                            }}>
                              {brandInfo?.logo} {brandInfo?.name}
                            </div>
                          </div>
                        </div>
                        <span style={{
                          background: "#FF444420", color: "#FF6666",
                          padding: "3px 8px", borderRadius: 8, fontSize: 12, fontWeight: 700
                        }}>-{p.discount}%</span>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                        <div>
                          <div style={{ fontSize: 20, fontWeight: 900, color: "#00ff88" }}>{formatPrice(p.currentPrice)}</div>
                          <div style={{ fontSize: 12, color: "#666", textDecoration: "line-through" }}>{formatPrice(p.originalPrice)}</div>
                        </div>
                        {isLowest && (
                          <span style={{
                            background: "#FFD70020", color: "#FFD700",
                            padding: "4px 10px", borderRadius: 8, fontSize: 11, fontWeight: 700
                          }}>⭐ أقل سعر</span>
                        )}
                      </div>

                      <MiniChart history={p.priceHistory} color="#00ff88" />

                      <button
                        onClick={() => toggleTrack(p.id)}
                        style={{
                          width: "100%", marginTop: 12,
                          background: isTracked ? "#1A2E1A" : "linear-gradient(135deg, #00ff8820, #00ccff10)",
                          border: `1px solid ${isTracked ? "#00ff8860" : "#2A2A3E"}`,
                          borderRadius: 8, padding: "8px",
                          color: isTracked ? "#00ff88" : "#888",
                          fontSize: 13, fontWeight: 600, fontFamily: "'Cairo', sans-serif"
                        }}
                      >
                        {isTracked ? "✓ يتم التتبع" : "+ تتبع السعر"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Notifications */}
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>🔔 آخر الإشعارات</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {notifications.slice(0, 3).map(n => (
                  <div key={n.id} style={{
                    background: n.read ? "#12121A" : "linear-gradient(135deg, #12121A, #1A1A28)",
                    border: n.read ? "1px solid #1E1E32" : "1px solid #2A2A4E",
                    borderRadius: 12, padding: "14px 18px",
                    display: "flex", alignItems: "center", gap: 14
                  }}>
                    <span style={{ fontSize: 24 }}>{n.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: n.read ? 400 : 600 }}>{n.message}</div>
                      <div style={{ fontSize: 11, color: "#555", marginTop: 3 }}>{n.time}</div>
                    </div>
                    {!n.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#00ff88" }} />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* BRANDS */}
        {activeTab === "brands" && (
          <div className="slide-in">
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>اختار البراندات اللي تتابعها</h2>
            <p style={{ color: "#666", fontSize: 13, marginBottom: 24 }}>
              هنفحص المواقع دي كل 6 ساعات ونبعتلك إشعار لما يكون في عروض
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
              {BRANDS.map(brand => {
                const isSelected = selectedBrands.includes(brand.id);
                const brandDeals = MOCK_PRODUCTS.filter(p => p.brand === brand.id && p.discount > 0);
                return (
                  <div
                    key={brand.id}
                    className="brand-card"
                    onClick={() => toggleBrand(brand.id)}
                    style={{
                      background: isSelected
                        ? `linear-gradient(135deg, ${brand.color}15, ${brand.color}08)`
                        : "#12121A",
                      border: isSelected ? `2px solid ${brand.color}60` : "2px solid #1E1E32",
                      borderRadius: 16, padding: 24,
                      position: "relative", overflow: "hidden",
                    }}
                  >
                    {isSelected && (
                      <div style={{
                        position: "absolute", top: 12, left: 12,
                        background: "#00ff88", color: "#000",
                        borderRadius: "50%", width: 22, height: 22,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 12, fontWeight: 900
                      }}>✓</div>
                    )}
                    <div style={{ fontSize: 40, marginBottom: 12 }}>{brand.logo}</div>
                    <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 6 }}>{brand.name}</div>
                    <div style={{ fontSize: 11, color: "#555", marginBottom: 16 }}>{brand.url}</div>
                    {brandDeals.length > 0 && (
                      <div style={{
                        display: "inline-flex", alignItems: "center", gap: 4,
                        background: "#FF444420", color: "#FF6666",
                        padding: "4px 10px", borderRadius: 8, fontSize: 11, fontWeight: 700
                      }}>
                        🔥 {brandDeals.length} عرض نشط
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div style={{
              marginTop: 32, background: "#12121A", border: "1px solid #1E1E32",
              borderRadius: 16, padding: 24
            }}>
              <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: 15 }}>➕ إضافة موقع مخصص</h3>
              <div style={{ display: "flex", gap: 12 }}>
                <input
                  value={addProductUrl}
                  onChange={e => setAddProductUrl(e.target.value)}
                  placeholder="https://example.com/brand"
                  style={{
                    flex: 1, background: "#0A0A0F", border: "1px solid #2A2A3E",
                    borderRadius: 10, padding: "10px 16px", color: "#E8E8F0",
                    fontSize: 13, fontFamily: "'Cairo', sans-serif"
                  }}
                />
                <button style={{
                  background: "linear-gradient(135deg, #00ff88, #00ccff)",
                  border: "none", borderRadius: 10, padding: "10px 20px",
                  color: "#000", fontWeight: 700, fontSize: 13, fontFamily: "'Cairo', sans-serif"
                }}>إضافة</button>
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTS */}
        {activeTab === "products" && (
          <div className="slide-in">

            {/* URL Import Box */}
            <div style={{
              background: "linear-gradient(135deg, #12121A, #1A1A2E)",
              border: "1px solid #2A2A4E", borderRadius: 16, padding: 22, marginBottom: 28
            }}>
              <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 4 }}>أضف منتج للتتبع</div>

              {/* Mode Toggle */}
              <div style={{ display: "flex", gap: 8, marginBottom: 16, marginTop: 10 }}>
                {[
                  { id: "search", icon: "🔍", label: "بحث بالاسم" },
                  { id: "url", icon: "🔗", label: "رابط مباشر" },
                ].map(m => (
                  <button key={m.id} onClick={() => { setImportMode(m.id); setImportError(""); setImportResult(null); }} style={{
                    flex: 1, padding: "10px", borderRadius: 10, fontFamily: "'Cairo', sans-serif",
                    fontWeight: 700, fontSize: 13, border: "none",
                    background: importMode === m.id ? "linear-gradient(135deg, #00ff8825, #00ccff15)" : "#0A0A0F",
                    color: importMode === m.id ? "#00ff88" : "#555",
                    outline: importMode === m.id ? "1px solid #00ff8840" : "1px solid #1E1E32",
                  }}>{m.icon} {m.label}</button>
                ))}
              </div>

              {importMode === "search" ? (
                <div>
                  <div style={{ fontSize: 12, color: "#555", marginBottom: 10 }}>
                    اكتب اسم المنتج وهنجيبلك السعر من Amazon وNoon وJumia
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <input
                      value={importSearchQuery}
                      onChange={e => setImportSearchQuery(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && searchProductByName()}
                      placeholder="مثال: iPhone 15 Pro 256GB أو Samsung Galaxy S24"
                      style={{
                        flex: 1, background: "#0A0A0F", border: "1px solid #2A2A3E",
                        borderRadius: 10, padding: "11px 16px", color: "#E8E8F0",
                        fontSize: 13, fontFamily: "'Cairo', sans-serif"
                      }}
                    />
                    <button
                      onClick={searchProductByName}
                      disabled={importLoading || !importSearchQuery.trim()}
                      style={{
                        background: importLoading ? "#1A1A2E" : "linear-gradient(135deg, #00ff88, #00ccff)",
                        border: "none", borderRadius: 10, padding: "11px 20px",
                        color: importLoading ? "#555" : "#000", fontWeight: 700, fontSize: 13,
                        fontFamily: "'Cairo', sans-serif", whiteSpace: "nowrap",
                        opacity: !importSearchQuery.trim() ? 0.5 : 1
                      }}
                    >{importLoading ? "⏳ جاري البحث..." : "ابحث 🔍"}</button>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: 12, color: "#555", marginBottom: 10 }}>
                    افتح المنتج في المتصفح وانسخ الرابط الكامل من شريط العنوان
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <input
                      value={importUrl}
                      onChange={e => setImportUrl(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && importProductFromUrl()}
                      placeholder="https://www.amazon.eg/dp/B0..."
                      style={{
                        flex: 1, background: "#0A0A0F", border: "1px solid #2A2A3E",
                        borderRadius: 10, padding: "11px 16px", color: "#E8E8F0",
                        fontSize: 13, direction: "ltr", fontFamily: "monospace"
                      }}
                    />
                    <button
                      onClick={importProductFromUrl}
                      disabled={importLoading || !importUrl.trim()}
                      style={{
                        background: importLoading ? "#1A1A2E" : "linear-gradient(135deg, #00ff88, #00ccff)",
                        border: "none", borderRadius: 10, padding: "11px 20px",
                        color: importLoading ? "#555" : "#000", fontWeight: 700, fontSize: 13,
                        fontFamily: "'Cairo', sans-serif", whiteSpace: "nowrap",
                        opacity: !importUrl.trim() ? 0.5 : 1
                      }}
                    >{importLoading ? "⏳ جاري الجلب..." : "جلب ✨"}</button>
                  </div>
                </div>
              )}

              {/* Supported brands hint */}
              <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                {BRANDS.map(b => (
                  <span key={b.id} style={{
                    fontSize: 11, color: "#444", background: "#0A0A0F",
                    border: "1px solid #1E1E32", borderRadius: 6, padding: "3px 8px"
                  }}>{b.logo} {b.name}</span>
                ))}
              </div>

              {/* Error */}
              {importError && (
                <div style={{
                  marginTop: 14, background: "#FF444415", border: "1px solid #FF444440",
                  borderRadius: 10, padding: "12px 16px", color: "#FF8888", fontSize: 13
                }}>⚠️ {importError}</div>
              )}

              {/* Preview Result */}
              {importResult && (
                <div style={{
                  marginTop: 16, background: "#0A0A0F", border: "1px solid #00ff8840",
                  borderRadius: 12, padding: 18
                }}>
                  <div style={{ fontSize: 12, color: "#00ff88", fontWeight: 700, marginBottom: 12 }}>✅ تم جلب المنتج — راجع البيانات وتأكد</div>
                  <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 14 }}>
                    <span style={{
                      fontSize: 36, width: 52, height: 52, display: "flex",
                      alignItems: "center", justifyContent: "center",
                      background: "#1A1A2E", borderRadius: 12, flexShrink: 0
                    }}>{importResult.image}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 4 }}>{importResult.name}</div>
                      <div style={{ fontSize: 12, color: "#555" }}>{importResult.category}</div>
                      {importResult.description && (
                        <div style={{ fontSize: 11, color: "#444", marginTop: 4, lineHeight: 1.5 }}>{importResult.description}</div>
                      )}
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
                    {[
                      { label: "السعر الحالي", value: importResult.currentPrice?.toLocaleString("ar-EG") + " EGP", color: "#00ff88" },
                      { label: "السعر الأصلي", value: importResult.originalPrice?.toLocaleString("ar-EG") + " EGP", color: "#888" },
                      { label: "الخصم", value: importResult.discount > 0 ? `-${importResult.discount}%` : "لا يوجد", color: "#FF6666" },
                    ].map((s, i) => (
                      <div key={i} style={{ background: "#12121A", borderRadius: 8, padding: "10px 12px", textAlign: "center" }}>
                        <div style={{ fontSize: 15, fontWeight: 800, color: s.color }}>{s.value}</div>
                        <div style={{ fontSize: 10, color: "#555", marginTop: 3 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      onClick={confirmAddProduct}
                      style={{
                        flex: 1, background: "linear-gradient(135deg, #00ff88, #00ccff)",
                        border: "none", borderRadius: 10, padding: "11px",
                        color: "#000", fontWeight: 700, fontSize: 13, fontFamily: "'Cairo', sans-serif"
                      }}
                    >⭐ أضفه لقائمة التتبع</button>
                    <button
                      onClick={() => setImportResult(null)}
                      style={{
                        background: "#1A1A2E", border: "1px solid #2A2A3E",
                        borderRadius: 10, padding: "11px 18px",
                        color: "#888", fontSize: 13, fontFamily: "'Cairo', sans-serif"
                      }}
                    >إلغاء</button>
                  </div>
                </div>
              )}
            </div>

            {/* Search + Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800 }}>المنتجات المحفوظة {userProducts.length > 0 && <span style={{fontSize:13, color:"#00ff88", fontWeight:600}}>+{userProducts.length} مضافة</span>}</h2>
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="🔍 ابحث عن منتج..."
                style={{
                  background: "#12121A", border: "1px solid #2A2A3E",
                  borderRadius: 10, padding: "10px 16px", color: "#E8E8F0",
                  fontSize: 13, width: 200, fontFamily: "'Cairo', sans-serif"
                }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
              {[...MOCK_PRODUCTS, ...userProducts].filter(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.brand.toLowerCase().includes(searchQuery.toLowerCase())
              ).map(p => {
                const brandInfo = BRANDS.find(b => b.id === p.brand);
                const isTracked = trackedProducts.includes(p.id);
                const minPrice = Math.min(...p.priceHistory.map(h => h.price));
                const maxPrice = Math.max(...p.priceHistory.map(h => h.price));
                const isLowest = p.currentPrice === minPrice;

                return (
                  <div key={p.id} className="product-card" style={{
                    background: "linear-gradient(135deg, #12121A, #1A1A2E)",
                    border: "1px solid #1E1E32", borderRadius: 16, padding: 22,
                    cursor: "pointer"
                  }} onClick={() => setSelectedProduct(selectedProduct?.id === p.id ? null : p)}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                      <span style={{ fontSize: 36 }}>{p.image}</span>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                        {p.discount > 0 && (
                          <span style={{
                            background: "#FF444420", color: "#FF6666",
                            padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700
                          }}>-{p.discount}%</span>
                        )}
                        {isLowest && (
                          <span style={{
                            background: "#FFD70015", color: "#FFD700",
                            padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700
                          }}>⭐ أقل سعر</span>
                        )}
                        {!p.inStock && (
                          <span style={{
                            background: "#FF444415", color: "#FF8888",
                            padding: "2px 8px", borderRadius: 6, fontSize: 11
                          }}>نفد المخزون</span>
                        )}
                      </div>
                    </div>

                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8, lineHeight: 1.4 }}>{p.name}</div>

                    <div style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      background: (brandInfo?.color || "#888") + "15",
                      color: brandInfo?.color || "#888",
                      padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, marginBottom: 14
                    }}>
                      {brandInfo?.logo} {brandInfo?.name}
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                      <div>
                        <div style={{ fontSize: 22, fontWeight: 900, color: "#00ff88" }}>{formatPrice(p.currentPrice)}</div>
                        {p.discount > 0 && (
                          <div style={{ fontSize: 12, color: "#555", textDecoration: "line-through" }}>{formatPrice(p.originalPrice)}</div>
                        )}
                      </div>
                      <div style={{ textAlign: "left", fontSize: 11, color: "#555" }}>
                        <div>أدنى: <span style={{ color: "#00ff88" }}>{formatPrice(minPrice)}</span></div>
                        <div>أعلى: <span style={{ color: "#FF6666" }}>{formatPrice(maxPrice)}</span></div>
                      </div>
                    </div>

                    {/* Chart */}
                    <div style={{ marginBottom: 14 }}>
                      <MiniChart history={p.priceHistory} color={isLowest ? "#00ff88" : "#4488ff"} />
                    </div>

                    {/* Expanded history */}
                    {selectedProduct?.id === p.id && (
                      <div style={{
                        borderTop: "1px solid #2A2A3E", paddingTop: 14, marginBottom: 14
                      }}>
                        <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 10, color: "#888" }}>📊 تاريخ الأسعار</div>
                        {p.priceHistory.map((h, i) => (
                          <div key={i} style={{
                            display: "flex", justifyContent: "space-between",
                            fontSize: 12, padding: "4px 0",
                            borderBottom: i < p.priceHistory.length - 1 ? "1px solid #1A1A2E" : "none",
                            color: h.price === minPrice ? "#00ff88" : h.price === maxPrice ? "#FF6666" : "#888"
                          }}>
                            <span>{formatDate(h.date)}</span>
                            <span style={{ fontWeight: 600 }}>{formatPrice(h.price)}</span>
                            {h.price === minPrice && <span>⭐ الأقل</span>}
                            {h.price === maxPrice && <span>📈 الأعلى</span>}
                          </div>
                        ))}
                      </div>
                    )}

                    <button
                      onClick={e => { e.stopPropagation(); toggleTrack(p.id); }}
                      style={{
                        width: "100%",
                        background: isTracked
                          ? "linear-gradient(135deg, #00ff8820, #00ccff10)"
                          : "#1A1A2E",
                        border: `1px solid ${isTracked ? "#00ff8860" : "#2A2A3E"}`,
                        borderRadius: 10, padding: "10px",
                        color: isTracked ? "#00ff88" : "#888",
                        fontSize: 13, fontWeight: 700, fontFamily: "'Cairo', sans-serif"
                      }}
                    >
                      {isTracked ? "✓ يتم تتبع السعر" : "⭐ تتبع السعر"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TRACKED */}
        {activeTab === "tracked" && (
          <div className="slide-in">
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>⭐ قائمة التتبع</h2>
            <p style={{ color: "#666", fontSize: 13, marginBottom: 24 }}>
              هنبعتلك إشعار فوري لما أي منتج فيهم ينزل سعره
            </p>

            {trackedProductsData.length === 0 ? (
              <div style={{
                background: "#12121A", border: "1px dashed #2A2A3E",
                borderRadius: 16, padding: 60, textAlign: "center"
              }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
                <div style={{ color: "#555", fontSize: 14 }}>مفيش منتجات في قائمة التتبع</div>
                <div style={{ color: "#333", fontSize: 12, marginTop: 8 }}>
                  روح تبويب المنتجات واضغط "تتبع السعر"
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {trackedProductsData.map(p => {
                  const brandInfo = BRANDS.find(b => b.id === p.brand);
                  const minPrice = Math.min(...p.priceHistory.map(h => h.price));
                  const maxPrice = Math.max(...p.priceHistory.map(h => h.price));
                  const priceDrop = maxPrice - p.currentPrice;
                  const dropPct = Math.round((priceDrop / maxPrice) * 100);
                  const isLowest = p.currentPrice === minPrice;

                  return (
                    <div key={p.id} style={{
                      background: "linear-gradient(135deg, #12121A, #1A1A2E)",
                      border: isLowest ? "1px solid #00ff8840" : "1px solid #1E1E32",
                      borderRadius: 16, padding: 20, overflow: "hidden",
                      boxShadow: isLowest ? "0 0 30px rgba(0,255,136,0.06)" : "none"
                    }}>
                      {/* Header row */}
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                        <span style={{
                          fontSize: 32, flexShrink: 0,
                          width: 50, height: 50, display: "flex", alignItems: "center", justifyContent: "center",
                          background: "#0A0A0F", borderRadius: 12
                        }}>{p.image}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                          <div style={{
                            display: "inline-flex", alignItems: "center", gap: 4,
                            background: (brandInfo?.color || "#888") + "20",
                            color: brandInfo?.color || "#888",
                            padding: "2px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600
                          }}>
                            {brandInfo?.logo} {brandInfo?.name}
                          </div>
                        </div>
                        <button
                          onClick={() => toggleTrack(p.id)}
                          style={{
                            flexShrink: 0,
                            background: "#FF444415", border: "1px solid #FF444440",
                            borderRadius: 8, padding: "6px 12px",
                            color: "#FF6666", fontSize: 12, fontFamily: "'Cairo', sans-serif"
                          }}
                        >إزالة</button>
                      </div>

                      <div style={{ flex: 1 }}>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, marginTop: 4 }}>
                            {[
                              { label: "السعر الحالي", value: formatPrice(p.currentPrice), color: "#00ff88" },
                              { label: "أقل سعر", value: formatPrice(minPrice), color: "#FFD700" },
                              { label: "أعلى سعر", value: formatPrice(maxPrice), color: "#FF6666" },
                              { label: "التوفير الكلي", value: `-${dropPct}%`, color: "#00ccff" },
                            ].map((stat, i) => (
                              <div key={i} style={{
                                background: "#0A0A0F", borderRadius: 10, padding: 14, textAlign: "center"
                              }}>
                                <div style={{ fontSize: 18, fontWeight: 900, color: stat.color }}>{stat.value}</div>
                                <div style={{ fontSize: 11, color: "#555", marginTop: 4 }}>{stat.label}</div>
                              </div>
                            ))}
                          </div>

                          <div style={{ marginTop: 16 }}>
                            <div style={{ fontSize: 12, color: "#666", marginBottom: 10 }}>📈 تاريخ السعر</div>
                            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
                              {p.priceHistory.map((h, i) => (
                                <div key={i} style={{
                                  background: h.price === minPrice ? "#00ff8815" : "#1A1A2E",
                                  border: h.price === minPrice ? "1px solid #00ff8840" : "1px solid #2A2A3E",
                                  borderRadius: 8, padding: "8px 12px", textAlign: "center",
                                  minWidth: 85, flexShrink: 0
                                }}>
                                  <div style={{ fontSize: 11, color: "#555", marginBottom: 4 }}>{formatDate(h.date)}</div>
                                  <div style={{
                                    fontSize: 12, fontWeight: 700,
                                    color: h.price === minPrice ? "#00ff88" : h.price === maxPrice ? "#FF6666" : "#888"
                                  }}>{formatPrice(h.price)}</div>
                                  {h.price === minPrice && <div style={{ fontSize: 10, color: "#00ff88", marginTop: 2 }}>⭐ الأقل</div>}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* NOTIFICATIONS */}
        {activeTab === "notifications" && (
          <div className="slide-in">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800 }}>🔔 الإشعارات</h2>
              <button
                onClick={markAllRead}
                style={{
                  background: "transparent", border: "1px solid #2A2A3E",
                  borderRadius: 8, padding: "8px 16px", color: "#888",
                  fontSize: 13, fontFamily: "'Cairo', sans-serif"
                }}
              >تعليم الكل كمقروء</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {notifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}
                  style={{
                    background: n.read ? "#0E0E18" : "linear-gradient(135deg, #12121A, #1A1A28)",
                    border: n.read ? "1px solid #1A1A28" : "1px solid #2A2A4E",
                    borderRadius: 14, padding: "16px 20px",
                    display: "flex", alignItems: "center", gap: 16,
                    cursor: "pointer", opacity: n.read ? 0.7 : 1
                  }}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: "#1A1A2E", display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: 22, flexShrink: 0
                  }}>{n.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: n.read ? 400 : 700, lineHeight: 1.4 }}>{n.message}</div>
                    <div style={{ fontSize: 12, color: "#444", marginTop: 4 }}>{n.time}</div>
                  </div>
                  {!n.read && (
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#00ff88", flexShrink: 0 }} />
                  )}
                </div>
              ))}
            </div>

            {/* Email Settings */}
            <div style={{
              marginTop: 32, background: "#12121A", border: "1px solid #1E1E32",
              borderRadius: 16, padding: 24
            }}>
              <h3 style={{ fontWeight: 700, marginBottom: 6, fontSize: 15 }}>📧 إعدادات الإشعارات</h3>
              <p style={{ color: "#555", fontSize: 12, marginBottom: 16 }}>
                ابعتلك إيميل لما يكون في عروض أو انخفاض في الأسعار
              </p>
              <div style={{ display: "flex", gap: 12 }}>
                <input
                  value={notifEmail}
                  onChange={e => setNotifEmail(e.target.value)}
                  placeholder="your@email.com"
                  type="email"
                  style={{
                    flex: 1, background: "#0A0A0F", border: "1px solid #2A2A3E",
                    borderRadius: 10, padding: "10px 16px", color: "#E8E8F0",
                    fontSize: 13, direction: "ltr", fontFamily: "'Cairo', sans-serif"
                  }}
                />
                <button style={{
                  background: "linear-gradient(135deg, #00ff88, #00ccff)",
                  border: "none", borderRadius: 10, padding: "10px 20px",
                  color: "#000", fontWeight: 700, fontSize: 13, fontFamily: "'Cairo', sans-serif"
                }}>حفظ</button>
              </div>

              <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { label: "إشعار لما يكون في عروض على براندات متابعة", checked: true },
                  { label: "إشعار لما ينزل سعر منتج متتبع", checked: true },
                  { label: "إشعار لما يوصل لأقل سعر تاريخي", checked: true },
                  { label: "تقرير أسبوعي بأفضل العروض", checked: false },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13 }}>{item.label}</span>
                    <div style={{
                      width: 44, height: 24, borderRadius: 12,
                      background: item.checked ? "#00ff88" : "#2A2A3E",
                      position: "relative", cursor: "pointer"
                    }}>
                      <div style={{
                        position: "absolute", top: 3,
                        right: item.checked ? 3 : "auto", left: item.checked ? "auto" : 3,
                        width: 18, height: 18, borderRadius: "50%",
                        background: "#fff", transition: "all 0.2s"
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid #1E1E32", padding: "16px 24px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        fontSize: 12, color: "#333", marginTop: 40
      }}>
        <span>آخر فحص: {lastCheck.toLocaleTimeString("ar-EG")}</span>
        <span>PricePulse • يفحص كل 6 ساعات</span>
        <span style={{ color: "#00ff88" }}>● نشط</span>
      </footer>
    </div>
  );
}


ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(PriceTracker));
