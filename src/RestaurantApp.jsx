import { useState, useEffect } from "react";
import { ShoppingCart, LogOut, Search, Tag } from "lucide-react";

// ─── COUPONS ──────────────────────────────────────────────────────────────────
const COUPONS = {
  "VEERANJ10": { type:"percent", value:10,  min:0,   desc:"10% off on any order",           label:"Welcome Offer" },
  "FIRST50":   { type:"flat",    value:50,  min:199, desc:"₹50 off on orders above ₹199",   label:"First Order"   },
  "FEAST20":   { type:"percent", value:20,  min:499, desc:"20% off on orders above ₹499",   label:"Feast Deal"    },
  "CHAAP99":   { type:"flat",    value:99,  min:299, desc:"₹99 off on chaap orders ₹299+",  label:"Chaap Special" },
  "WEEKEND25": { type:"percent", value:25,  min:599, desc:"25% off on weekend orders ₹599+",label:"Weekend Special"},
  "ICECREAM":  { type:"flat",    value:49,  min:249, desc:"₹49 off when you add ice cream", label:"Dessert Offer"  },
};

const DELIVERY_FREE_ABOVE = 499;
const DELIVERY_CHARGE     = 49;
const HANDLING_FEE        = 10;

// ─── MENU ─────────────────────────────────────────────────────────────────────
const MENU_INIT = [
  { id:1,  name:"Samosa (2 pcs)",       cat:"Starters",  price:89,  desc:"Crispy pastry stuffed with spiced potatoes & peas, with mint & tamarind chutney",          emoji:"🥟", stars:4.9, avail:true },
  { id:2,  name:"Paneer Tikka",          cat:"Starters",  price:249, desc:"Tandoor-grilled cottage cheese in yogurt marinade — smoky, juicy & succulent",             emoji:"🧀", stars:4.8, avail:true },
  { id:3,  name:"Aloo Tikki Chaat",      cat:"Starters",  price:129, desc:"Crispy potato patties with chickpeas, yogurt, tamarind & coriander chutney",               emoji:"🥔", stars:4.9, avail:true },
  { id:4,  name:"Papdi Chaat",           cat:"Starters",  price:119, desc:"Crispy wafers with chickpeas, yogurt & tamarind — street food royalty",                    emoji:"🥗", stars:4.8, avail:true },
  { id:5,  name:"Hara Bhara Kebab",      cat:"Starters",  price:179, desc:"Spinach, peas & paneer patties, pan-seared, served with mint chutney",                     emoji:"🟢", stars:4.7, avail:true },
  { id:6,  name:"Veg Spring Rolls",      cat:"Starters",  price:149, desc:"Crispy rolls with spiced cabbage, carrots & bell peppers",                                 emoji:"🌯", stars:4.6, avail:true },
  { id:7,  name:"Tandoori Chaap",        cat:"Chaap",     price:229, desc:"Soya chaap marinated in tandoori spices, grilled to smoky perfection in the tandoor",      emoji:"🍡", stars:5.0, avail:true },
  { id:8,  name:"Malai Chaap",           cat:"Chaap",     price:249, desc:"Tender soya chaap in rich malai & cashew marinade — melt-in-mouth texture",                emoji:"🍡", stars:5.0, avail:true },
  { id:9,  name:"Achari Chaap",          cat:"Chaap",     price:239, desc:"Soya chaap in pickle spices — tangy, bold & utterly addictive",                            emoji:"🍡", stars:4.9, avail:true },
  { id:10, name:"Peri Peri Chaap",       cat:"Chaap",     price:249, desc:"Spicy peri peri glazed chaap — fiery, smoky & irresistible",                               emoji:"🌶️", stars:4.9, avail:true },
  { id:11, name:"Afghani Chaap",         cat:"Chaap",     price:259, desc:"Creamy yogurt & herb marinated chaap with delicate smoky aroma",                           emoji:"🍡", stars:4.8, avail:true },
  { id:12, name:"Seekh Chaap",           cat:"Chaap",     price:239, desc:"Minced soya on skewers with ginger, garlic & aromatic spices from the tandoor",            emoji:"🍢", stars:4.8, avail:true },
  { id:13, name:"Chaap Platter (4 pcs)", cat:"Chaap",     price:399, desc:"Chef's selection — Tandoori, Malai, Achari & Peri Peri chaap on one grand plate",         emoji:"🍽️", stars:5.0, avail:true },
  { id:14, name:"Shahi Paneer",          cat:"Mains",     price:299, desc:"Paneer in rich cashew-tomato gravy with saffron & whole spices",                           emoji:"🍛", stars:5.0, avail:true },
  { id:15, name:"Dal Makhani",           cat:"Mains",     price:249, desc:"Black lentils slow-cooked overnight in butter, cream & aromatic spices",                   emoji:"🫘", stars:4.9, avail:true },
  { id:16, name:"Palak Paneer",          cat:"Mains",     price:269, desc:"Cottage cheese in velvety spinach gravy with ginger, garlic & fresh cream",                emoji:"🥬", stars:4.8, avail:true },
  { id:17, name:"Paneer Butter Masala",  cat:"Mains",     price:299, desc:"Paneer in silky tomato-butter sauce with kasuri methi — the all-time classic",             emoji:"🧀", stars:5.0, avail:true },
  { id:18, name:"Chole Masala",          cat:"Mains",     price:219, desc:"Punjabi-style spiced chickpeas with onions, tomatoes & whole spices",                      emoji:"🥣", stars:4.8, avail:true },
  { id:19, name:"Veg Biryani",           cat:"Mains",     price:279, desc:"Dum-cooked basmati with seasonal vegetables, saffron & caramelized onions",                emoji:"🍚", stars:4.9, avail:true },
  { id:20, name:"Kadai Paneer",          cat:"Mains",     price:289, desc:"Paneer & peppers tossed in bold kadai masala with freshly ground spices",                  emoji:"🥘", stars:4.7, avail:true },
  { id:21, name:"Butter Naan",           cat:"Breads",    price:49,  desc:"Soft tandoor-baked flatbread slathered with generous butter",                              emoji:"🫓", stars:4.9, avail:true },
  { id:22, name:"Garlic Naan",           cat:"Breads",    price:59,  desc:"Fluffy naan brushed with butter, minced garlic & fresh coriander",                         emoji:"🫓", stars:4.8, avail:true },
  { id:23, name:"Stuffed Paratha",       cat:"Breads",    price:89,  desc:"Whole-wheat flatbread stuffed with spiced aloo or paneer, with pickle & curd",             emoji:"🥙", stars:4.9, avail:true },
  { id:24, name:"Laccha Paratha",        cat:"Breads",    price:69,  desc:"Flaky multi-layered flatbread roasted with desi ghee",                                     emoji:"🫓", stars:4.7, avail:true },
  { id:25, name:"Puri (4 pcs)",          cat:"Breads",    price:59,  desc:"Light, deep-fried whole-wheat bread — perfect with chole",                                 emoji:"⭕", stars:4.8, avail:true },
  { id:26, name:"Gulab Jamun",           cat:"Desserts",  price:99,  desc:"Soft milk-solid dumplings soaked in rose-cardamom syrup, served warm (2 pcs)",             emoji:"🟤", stars:5.0, avail:true },
  { id:27, name:"Mango Kulfi",           cat:"Desserts",  price:119, desc:"Dense creamy Indian ice cream with reduced milk & fresh Alphonso mangoes",                 emoji:"🥭", stars:4.9, avail:true },
  { id:28, name:"Kheer",                 cat:"Desserts",  price:99,  desc:"Slow-cooked rice pudding with cardamom, saffron, pistachios & rose water",                 emoji:"🍮", stars:4.8, avail:true },
  { id:29, name:"Jalebi",               cat:"Desserts",  price:89,  desc:"Crispy spirals soaked in saffron syrup — best enjoyed warm with rabdi",                    emoji:"🌀", stars:4.9, avail:true },
  { id:30, name:"Rasgulla",             cat:"Desserts",  price:99,  desc:"Spongy cottage cheese balls in light rose-flavoured sugar syrup (2 pcs)",                  emoji:"⚪", stars:4.8, avail:true },
  { id:31, name:"Mango Scoop",           cat:"Ice Cream", price:89,  desc:"Three scoops of rich Alphonso mango ice cream with fresh fruit topping",                   emoji:"🥭", stars:5.0, avail:true },
  { id:32, name:"Pista Badam Scoop",     cat:"Ice Cream", price:99,  desc:"Creamy pistachio & almond ice cream with saffron swirls — pure indulgence",               emoji:"🍦", stars:4.9, avail:true },
  { id:33, name:"Rose Kulfi Scoop",      cat:"Ice Cream", price:99,  desc:"Traditional kulfi with rose water, cardamom & silver varak garnish",                      emoji:"🌹", stars:4.9, avail:true },
  { id:34, name:"Gulab Jamun Sundae",    cat:"Ice Cream", price:149, desc:"Vanilla ice cream topped with warm gulab jamun, rose syrup & crushed pistachios",          emoji:"🍨", stars:5.0, avail:true },
  { id:35, name:"Choco Brownie Sundae",  cat:"Ice Cream", price:159, desc:"Dark chocolate brownie, 2 scoops vanilla, hot fudge & rainbow sprinkles",                 emoji:"🍫", stars:4.9, avail:true },
  { id:36, name:"Seasonal Fruit Scoop",  cat:"Ice Cream", price:79,  desc:"Refreshing seasonal fruit sorbet with fresh mint — light & guilt-free",                   emoji:"🍧", stars:4.7, avail:true },
  { id:37, name:"Ice Cream Platter",     cat:"Ice Cream", price:249, desc:"6 mini scoops — Mango, Pista, Rose, Chocolate, Strawberry & Vanilla",                    emoji:"🎠", stars:5.0, avail:true },
  { id:38, name:"Mango Lassi",           cat:"Drinks",    price:99,  desc:"Chilled blended yogurt with Alphonso mangoes & cardamom",                                  emoji:"🥭", stars:5.0, avail:true },
  { id:39, name:"Masala Chai",           cat:"Drinks",    price:49,  desc:"Spiced tea with ginger, cardamom, cinnamon & whole milk — the real deal",                  emoji:"☕", stars:4.9, avail:true },
  { id:40, name:"Rose Sharbat",          cat:"Drinks",    price:69,  desc:"Chilled rose syrup with basil seeds & lime — refreshing & aromatic",                      emoji:"🌹", stars:4.7, avail:true },
  { id:41, name:"Sweet Lassi",           cat:"Drinks",    price:79,  desc:"Thick cold yogurt with sugar, cardamom & a pinch of saffron",                             emoji:"🥛", stars:4.8, avail:true },
  { id:42, name:"Jaljeera",             cat:"Drinks",    price:59,  desc:"Chilled cumin-mint drink with tamarind & black salt — the ultimate Indian cooler",         emoji:"🧃", stars:4.7, avail:true },
  { id:43, name:"Virgin Mojito",         cat:"Drinks",    price:99,  desc:"Fresh lime, mint, soda & sugar syrup over crushed ice",                                   emoji:"🍹", stars:4.8, avail:true },
  { id:44, name:"Cold Coffee",           cat:"Drinks",    price:89,  desc:"Rich blended coffee with ice cream, chocolate syrup & whipped cream",                     emoji:"☕", stars:4.9, avail:true },
  { id:45, name:"Thandai",              cat:"Drinks",    price:109, desc:"Traditional festive drink with milk, almonds, rose & exotic spices",                       emoji:"🥛", stars:4.9, avail:true },
  { id:46, name:"Watermelon Juice",      cat:"Drinks",    price:79,  desc:"Fresh-pressed watermelon with mint & a pinch of black salt",                              emoji:"🍉", stars:4.8, avail:true },
  { id:47, name:"Fresh Lime Soda",       cat:"Drinks",    price:59,  desc:"Sparkling lime soda — sweet, salted or mixed — light & zesty",                           emoji:"🍋", stars:4.6, avail:true },
];

const ORDERS_INIT = [
  { id:"ORD-001", customer:"Rahul M.",  items:[{name:"Shahi Paneer",qty:1,price:299},{name:"Butter Naan",qty:2,price:49},{name:"Mango Lassi",qty:1,price:99}], total:496, status:"delivered",  time:"2:30 PM", addr:"12 Patel Nagar, New Delhi" },
  { id:"ORD-002", customer:"Priya S.",  items:[{name:"Malai Chaap",qty:2,price:249},{name:"Masala Chai",qty:2,price:49}],                                     total:596, status:"on_the_way", time:"3:15 PM", addr:"45 MG Road, Bengaluru"    },
  { id:"ORD-003", customer:"Ankit K.", items:[{name:"Tandoori Chaap",qty:1,price:229},{name:"Dal Makhani",qty:1,price:249}],                                   total:478, status:"preparing",  time:"3:45 PM", addr:"8 Civil Lines, Jaipur"    },
  { id:"ORD-004", customer:"Sneha R.", items:[{name:"Samosa (2 pcs)",qty:2,price:89},{name:"Masala Chai",qty:2,price:49}],                                     total:276, status:"pending",    time:"4:00 PM", addr:"22 Lajpat Nagar, Delhi"   },
];

const REVIEWS_INIT = [
  { id:1, name:"Ananya Sharma", avatar:"👩",   rating:5, text:"Malai Chaap is absolutely divine! The ambience is royal and staff so warm.", dish:"Malai Chaap",     date:"2 days ago" },
  { id:2, name:"Rohan Mehta",   avatar:"👨",   rating:5, text:"Gulab Jamun Sundae is two favourites in one bowl! Our family's go-to now.",  dish:"GJ Sundae",       date:"4 days ago" },
  { id:3, name:"Priya Kapoor",  avatar:"👩‍🦱", rating:5, text:"Tandoori Chaap with Garlic Naan is pure heaven. Unmatched quality!",         dish:"Tandoori Chaap",  date:"1 week ago" },
  { id:4, name:"Arjun Singh",   avatar:"🧔",   rating:5, text:"Booked for our anniversary — they surprised us with rose petals. 10/10!",    dish:"Chaap Platter",   date:"1 week ago" },
  { id:5, name:"Meera Joshi",   avatar:"👩‍🦰", rating:4, text:"Ice Cream Platter is a must! 6 flavours, all perfect. Kids loved it!",      dish:"Ice Cream Platter",date:"2 weeks ago"},
  { id:6, name:"Karan Verma",   avatar:"👦",   rating:5, text:"Achari Chaap is insane! Best veg food I've ever had. Highly recommend!",     dish:"Achari Chaap",    date:"2 weeks ago"},
];

const CREDS = [
  { name:"Admin", email:"admin@veeranj.com", pass:"admin123", role:"admin" },
  { name:"Guest", email:"user@veeranj.com",  pass:"user123",  role:"user"  },
];

const STEPS = ["pending","confirmed","preparing","on_the_way","delivered"];
const STEP_LABELS = { pending:"Order Placed", confirmed:"Confirmed", preparing:"Cooking", on_the_way:"On the Way", delivered:"Delivered" };
const STEP_EMOJI  = { pending:"📋", confirmed:"✅", preparing:"👨‍🍳", on_the_way:"🛵", delivered:"🏠" };
const fmt = n => `₹${Number(n).toLocaleString("en-IN")}`;

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  bg:"#070400", surface:"#0E0900", card:"#130C01", border:"#2A1A04", borderHi:"#4A3010",
  gold:"#C9922A", goldL:"#E8B84B", goldD:"#8A5F0A", goldGlow:"rgba(201,146,42,0.15)",
  cream:"#FDF6E8", muted:"#8A7055", faint:"#5A4535",
  green:"#2E7D32", red:"#B71C1C", blue:"#1565C0", lime:"#4A7A28",
};
const FONT = { serif:"'Cormorant Garamond','Playfair Display',serif", sans:"'Nunito',sans-serif" };
const SI = { background:C.card, border:`1px solid ${C.border}`, color:C.cream, padding:"11px 16px", borderRadius:10, fontFamily:FONT.sans, fontSize:14, width:"100%", boxSizing:"border-box", outline:"none", transition:"border-color .2s" };
const SC = { background:C.card, border:`1px solid ${C.border}`, borderRadius:16 };

const Btn = ({ children, onClick, style={}, variant="gold", disabled=false, size="md" }) => {
  const sz = { sm:"7px 16px", md:"11px 22px", lg:"14px 32px" };
  const base = { display:"inline-flex", alignItems:"center", justifyContent:"center", gap:6, border:"none", borderRadius:10, fontFamily:FONT.sans, fontWeight:700, cursor:disabled?"not-allowed":"pointer", fontSize:size==="sm"?12:size==="lg"?15:13, padding:sz[size], transition:"all .2s", userSelect:"none", opacity:disabled?.4:1, letterSpacing:.3 };
  const V = {
    gold:    { background:`linear-gradient(135deg,${C.goldL},${C.gold})`, color:"#050300", boxShadow:`0 4px 20px ${C.goldGlow}` },
    outline: { background:"transparent", color:C.goldL, border:`1.5px solid ${C.gold}` },
    ghost:   { background:C.surface, color:C.muted, border:`1px solid ${C.border}` },
    danger:  { background:"#200808", color:"#E57373", border:`1px solid #5A1010` },
    success: { background:"#082008", color:"#81C784", border:`1px solid #10501A` },
    dark:    { background:C.surface, color:C.cream, border:`1px solid ${C.borderHi}` },
  };
  return (
    <button onClick={disabled?undefined:onClick} disabled={disabled} style={{ ...base, ...V[variant], ...style }}
      onMouseEnter={e=>{ if(!disabled){e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.opacity=".88";} }}
      onMouseLeave={e=>{ e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.opacity="1"; }}
      onMouseDown={e=>{ if(!disabled)e.currentTarget.style.transform="scale(.97)"; }}
      onMouseUp={e=>{ e.currentTarget.style.transform="translateY(-1px)"; }}>
      {children}
    </button>
  );
};
const VegDot = ({ size=14 }) => (
  <span style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", width:size, height:size, border:`1.5px solid ${C.lime}`, borderRadius:2, flexShrink:0 }}>
    <span style={{ width:size*.52, height:size*.52, borderRadius:"50%", background:C.lime }}/>
  </span>
);
const GoldDivider = () => (
  <div style={{ display:"flex", alignItems:"center", gap:12, margin:"0 0 28px" }}>
    <div style={{ flex:1, height:1, background:`linear-gradient(to right,transparent,${C.goldD})` }}/>
    <span style={{ color:C.gold, fontSize:14 }}>✦</span>
    <div style={{ flex:1, height:1, background:`linear-gradient(to left,transparent,${C.goldD})` }}/>
  </div>
);
const Stars = ({ n, size=13 }) => (
  <span style={{ color:C.gold, fontSize:size, letterSpacing:1 }}>{"★".repeat(Math.floor(n))}{"☆".repeat(5-Math.floor(n))}</span>
);

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
function GlobalStyles() {
  useEffect(()=>{
    if(document.getElementById("vj-font")) return;
    const l=document.createElement("link"); l.id="vj-font";
    l.href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Nunito:wght@300;400;500;600;700&display=swap";
    l.rel="stylesheet"; document.head.appendChild(l);
  },[]);
  return (
    <style>{`
      *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
      body{background:${C.bg};font-family:${FONT.sans};overflow-x:hidden;color:${C.cream}}
      ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:${C.surface}}::-webkit-scrollbar-thumb{background:${C.goldD};border-radius:4px}
      input:focus,textarea:focus,select:focus{border-color:${C.gold}!important;box-shadow:0 0 0 3px ${C.goldGlow}}
      input::placeholder,textarea::placeholder{color:${C.faint}}
      select option{background:${C.card};color:${C.cream}}
      .dish-card{transition:transform .25s,box-shadow .25s,border-color .25s}
      .dish-card:hover{transform:translateY(-6px);box-shadow:0 16px 48px rgba(201,146,42,.18);border-color:${C.goldD}!important}
      @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
      @keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}
      @keyframes fadeIn{from{opacity:0}to{opacity:1}}
      @keyframes popIn{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:scale(1)}}
      @keyframes pulse{0%,100%{opacity:1}50%{opacity:.6}}
      .gold-text{background:linear-gradient(135deg,${C.goldL},${C.gold});-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
    `}</style>
  );
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
function Toast({ msg }) {
  return (
    <div style={{ position:"fixed", top:70, right:16, zIndex:9999, background:C.card, border:`1px solid ${C.gold}`, color:C.cream, padding:"13px 20px", borderRadius:12, fontSize:13, fontWeight:600, boxShadow:`0 8px 40px rgba(0,0,0,.8),0 0 20px ${C.goldGlow}`, animation:"fadeUp .3s ease", maxWidth:300, pointerEvents:"none" }}>
      <span style={{ color:C.gold, marginRight:6 }}>✦</span>{msg}
    </div>
  );
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar({ user, cartCount, onCart, onLogin, onLogout }) {
  return (
    <nav style={{ position:"sticky", top:0, zIndex:200, background:"rgba(7,4,0,.97)", backdropFilter:"blur(20px)", borderBottom:`1px solid ${C.border}`, padding:"0 20px", display:"flex", alignItems:"center", justifyContent:"space-between", height:62, gap:10 }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
        <div style={{ width:36, height:36, borderRadius:"50%", background:`linear-gradient(135deg,${C.goldL},${C.goldD})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, boxShadow:`0 4px 16px ${C.goldGlow}` }}>🪔</div>
        <div>
          <div style={{ fontFamily:FONT.serif, fontSize:20, fontWeight:700, letterSpacing:3, lineHeight:1 }} className="gold-text">VEERANJ</div>
          <div style={{ display:"flex", alignItems:"center", gap:4, marginTop:2 }}><VegDot size={10}/><span style={{ fontSize:8, color:C.lime, letterSpacing:3, fontWeight:700 }}>PURE VEG</span></div>
        </div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        <button onClick={onCart} style={{ position:"relative", background:`linear-gradient(135deg,${C.goldL},${C.gold})`, border:"none", color:"#050300", borderRadius:10, padding:"9px 16px", cursor:"pointer", display:"flex", alignItems:"center", gap:6, fontWeight:700, fontSize:13, fontFamily:FONT.sans, boxShadow:`0 4px 16px ${C.goldGlow}` }}>
          <ShoppingCart size={15}/> Cart
          {cartCount>0 && <span style={{ position:"absolute", top:-6, right:-6, background:C.red, color:"#fff", borderRadius:"50%", width:18, height:18, fontSize:10, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center" }}>{cartCount}</span>}
        </button>
        {user ? (
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ textAlign:"right" }}>
              <div style={{ color:C.cream, fontSize:12, fontWeight:600 }}>{user.name}</div>
              {user.role==="admin" && <div style={{ color:C.gold, fontSize:9, letterSpacing:2 }}>ADMIN</div>}
            </div>
            <button onClick={onLogout} style={{ background:C.surface, border:`1px solid ${C.border}`, color:C.muted, borderRadius:9, padding:"8px 10px", cursor:"pointer" }}><LogOut size={13}/></button>
          </div>
        ) : (
          <button onClick={onLogin} style={{ background:"transparent", border:`1.5px solid ${C.gold}`, color:C.goldL, borderRadius:10, padding:"8px 18px", cursor:"pointer", fontWeight:700, fontSize:13, fontFamily:FONT.sans }}>Login</button>
        )}
      </div>
    </nav>
  );
}

// ─── BOTTOM NAV ───────────────────────────────────────────────────────────────
function BottomNav({ view, setView, isAdmin }) {
  const tabs = [
    { id:"home", icon:"🏛️", label:"Home" },
    { id:"menu", icon:"🍽️", label:"Menu" },
    { id:"services", icon:"✨", label:"Services" },
    { id:"tracking", icon:"📦", label:"Track" },
    { id:"contact", icon:"📞", label:"Contact" },
    ...(isAdmin?[{ id:"admin", icon:"⚙️", label:"Admin" }]:[]),
  ];
  return (
    <nav style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:200, background:"rgba(7,4,0,.98)", backdropFilter:"blur(20px)", borderTop:`1px solid ${C.border}`, display:"flex", height:60 }}>
      {tabs.map(t=>(
        <button key={t.id} onClick={()=>setView(t.id)} style={{ flex:1, background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:2, padding:"4px 2px", position:"relative" }}>
          {view===t.id && <div style={{ position:"absolute", top:0, left:"20%", right:"20%", height:2, background:`linear-gradient(to right,${C.goldL},${C.gold})`, borderRadius:2 }}/>}
          <span style={{ fontSize:15, lineHeight:1 }}>{t.icon}</span>
          <span style={{ fontSize:9, fontWeight:700, color:view===t.id?C.goldL:C.faint, letterSpacing:.5, marginTop:1 }}>{t.label}</span>
        </button>
      ))}
    </nav>
  );
}

// ─── COUPON SECTION ───────────────────────────────────────────────────────────
function CouponSection({ subtotal, couponCode, setCouponCode, appliedCoupon, onApply, onRemove, discount }) {
  const [input, setInput] = useState(couponCode||"");
  const [err, setErr] = useState("");
  const apply = () => {
    const code = input.trim().toUpperCase();
    const c = COUPONS[code];
    if (!c) { setErr("Invalid coupon code"); return; }
    if (subtotal < c.min) { setErr(`Min order ₹${c.min} required for this coupon`); return; }
    setErr(""); setCouponCode(code); onApply(code, c);
  };
  const promos = Object.entries(COUPONS).slice(0,5);
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      {/* Coupon input */}
      <div style={{ display:"flex", gap:8 }}>
        <div style={{ flex:1, position:"relative" }}>
          <Tag size={13} style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:C.gold, pointerEvents:"none" }}/>
          <input value={input} onChange={e=>{ setInput(e.target.value.toUpperCase()); setErr(""); }} placeholder="Enter coupon code" style={{ ...SI, paddingLeft:34, fontSize:13 }}/>
        </div>
        {appliedCoupon
          ? <Btn onClick={onRemove} variant="danger" size="sm" style={{ flexShrink:0, padding:"11px 14px" }}>Remove</Btn>
          : <Btn onClick={apply} size="sm" style={{ flexShrink:0, padding:"11px 14px" }}>Apply</Btn>
        }
      </div>
      {err && <p style={{ color:"#E57373", fontSize:12, fontWeight:600 }}>{err}</p>}
      {appliedCoupon && (
        <div style={{ background:"#082008", border:`1px solid ${C.green}`, borderRadius:8, padding:"10px 14px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <span style={{ color:"#81C784", fontSize:12, fontWeight:700 }}>✅ {appliedCoupon} applied!</span>
            <p style={{ color:"#81C784", fontSize:11, marginTop:2 }}>{COUPONS[appliedCoupon]?.desc}</p>
          </div>
          <span style={{ color:"#81C784", fontWeight:700, fontSize:14 }}>-{fmt(discount)}</span>
        </div>
      )}
      {/* Promo codes strip */}
      <div>
        <p style={{ color:C.faint, fontSize:10, letterSpacing:2, marginBottom:8 }}>AVAILABLE OFFERS</p>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {promos.map(([code,c])=>(
            <button key={code} onClick={()=>{ setInput(code); setErr(""); }} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"5px 10px", cursor:"pointer", fontFamily:FONT.sans, transition:"border-color .2s" }}
              onMouseEnter={e=>e.currentTarget.style.borderColor=C.gold}
              onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
              <div style={{ color:C.goldL, fontSize:10, fontWeight:700, letterSpacing:1 }}>{code}</div>
              <div style={{ color:C.faint, fontSize:9, marginTop:1 }}>{c.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── BOOKING MODAL ────────────────────────────────────────────────────────────
function BookingModal({ onClose, onConfirm }) {
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({ name:"", phone:"", date:today, time:"19:00", guests:"2", special:"" });
  const [done, setDone] = useState(false);
  const set=(k,v)=>setForm(p=>({...p,[k]:v}));
  const submit=()=>{
    if(!form.name||!form.phone) return;
    setDone(true);
    setTimeout(()=>{ onConfirm(form); onClose(); },2400);
  };
  return (
    <div onClick={e=>e.target===e.currentTarget&&onClose()} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.92)", zIndex:600, display:"flex", alignItems:"center", justifyContent:"center", padding:16, animation:"fadeIn .2s" }}>
      <div style={{ ...SC, width:"min(430px,100%)", padding:32, position:"relative", animation:"popIn .28s ease", maxHeight:"90vh", overflowY:"auto", boxShadow:`0 32px 80px rgba(0,0,0,.8),0 0 40px ${C.goldGlow}` }}>
        <button onClick={onClose} style={{ position:"absolute", top:16, right:18, background:"none", border:"none", color:C.faint, cursor:"pointer", fontSize:20 }}>✕</button>
        {done?(
          <div style={{ textAlign:"center", padding:"32px 0", animation:"fadeUp .4s ease" }}>
            <div style={{ fontSize:60, marginBottom:16 }}>🎊</div>
            <h3 style={{ fontFamily:FONT.serif, fontSize:28, color:C.cream, marginBottom:10, fontWeight:600 }}>Table Reserved!</h3>
            <GoldDivider/>
            <p style={{ color:C.muted, fontSize:14, lineHeight:1.8 }}>Table for <span style={{ color:C.goldL, fontWeight:700 }}>{form.guests} guests</span><br/>on <span style={{ color:C.goldL, fontWeight:700 }}>{form.date}</span> at <span style={{ color:C.goldL, fontWeight:700 }}>{form.time}</span></p>
            <p style={{ color:C.faint, fontSize:12, marginTop:14 }}>We look forward to welcoming you, {form.name} 🙏</p>
          </div>
        ):(
          <>
            <div style={{ textAlign:"center", marginBottom:20 }}>
              <div style={{ fontFamily:FONT.serif, fontSize:10, color:C.gold, letterSpacing:6, marginBottom:8 }}>VEERANJ</div>
              <h2 style={{ fontFamily:FONT.serif, fontSize:26, color:C.cream, fontWeight:600 }}>Reserve Your Table</h2>
            </div>
            <GoldDivider/>
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {[["YOUR NAME *","name","Full name","text"],["PHONE *","phone","+91 98765 43210","tel"]].map(([lbl,key,ph,type])=>(
                <div key={key}><label style={{ color:C.gold, fontSize:10, letterSpacing:2, fontWeight:700, display:"block", marginBottom:6 }}>{lbl}</label><input value={form[key]} onChange={e=>set(key,e.target.value)} placeholder={ph} type={type} style={SI}/></div>
              ))}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <div><label style={{ color:C.gold, fontSize:10, letterSpacing:2, fontWeight:700, display:"block", marginBottom:6 }}>DATE</label><input value={form.date} onChange={e=>set("date",e.target.value)} type="date" min={today} style={SI}/></div>
                <div><label style={{ color:C.gold, fontSize:10, letterSpacing:2, fontWeight:700, display:"block", marginBottom:6 }}>TIME</label>
                  <select value={form.time} onChange={e=>set("time",e.target.value)} style={SI}>
                    {["11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00"].map(t=><option key={t} value={t}>{t} {parseInt(t)<12?"AM":"PM"}</option>)}
                  </select>
                </div>
              </div>
              <div><label style={{ color:C.gold, fontSize:10, letterSpacing:2, fontWeight:700, display:"block", marginBottom:6 }}>GUESTS</label>
                <select value={form.guests} onChange={e=>set("guests",e.target.value)} style={SI}>
                  {["1","2","3","4","5","6","7","8","9","10+"].map(g=><option key={g}>{g}</option>)}
                </select>
              </div>
              <div><label style={{ color:C.gold, fontSize:10, letterSpacing:2, fontWeight:700, display:"block", marginBottom:6 }}>SPECIAL REQUEST</label><textarea value={form.special} onChange={e=>set("special",e.target.value)} placeholder="Birthday, anniversary, dietary needs…" style={{ ...SI, minHeight:66, resize:"vertical", lineHeight:1.6 }}/></div>
            </div>
            <Btn onClick={submit} disabled={!form.name||!form.phone} size="lg" style={{ width:"100%", marginTop:20 }}>🪑 Confirm Reservation</Btn>
          </>
        )}
      </div>
    </div>
  );
}

// ─── REVIEW MODAL ─────────────────────────────────────────────────────────────
function AddReviewModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({ name:"", rating:5, text:"", dish:"" });
  const [done, setDone] = useState(false);
  const set=(k,v)=>setForm(p=>({...p,[k]:v}));
  const submit=()=>{ if(!form.name||!form.text) return; setDone(true); setTimeout(()=>{ onSubmit(form); onClose(); },1800); };
  return (
    <div onClick={e=>e.target===e.currentTarget&&onClose()} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.92)", zIndex:600, display:"flex", alignItems:"center", justifyContent:"center", padding:16, animation:"fadeIn .2s" }}>
      <div style={{ ...SC, width:"min(400px,100%)", padding:30, position:"relative", animation:"popIn .25s ease" }}>
        <button onClick={onClose} style={{ position:"absolute", top:16, right:18, background:"none", border:"none", color:C.faint, cursor:"pointer", fontSize:20 }}>✕</button>
        {done?(
          <div style={{ textAlign:"center", padding:"32px 0" }}>
            <div style={{ fontSize:52 }}>🙏</div>
            <h3 style={{ fontFamily:FONT.serif, fontSize:24, color:C.cream, marginTop:12 }}>Shukriya!</h3>
          </div>
        ):(
          <>
            <div style={{ textAlign:"center", marginBottom:18 }}>
              <div style={{ fontFamily:FONT.serif, fontSize:10, color:C.gold, letterSpacing:6 }}>VEERANJ</div>
              <h2 style={{ fontFamily:FONT.serif, fontSize:22, color:C.cream, marginTop:6, fontWeight:600 }}>Share Your Experience</h2>
            </div>
            <GoldDivider/>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <input value={form.name} onChange={e=>set("name",e.target.value)} placeholder="Your name *" style={SI}/>
              <input value={form.dish} onChange={e=>set("dish",e.target.value)} placeholder="Dish you loved" style={SI}/>
              <div>
                <label style={{ color:C.gold, fontSize:10, letterSpacing:2, fontWeight:700, display:"block", marginBottom:8 }}>YOUR RATING</label>
                <div style={{ display:"flex", gap:6 }}>
                  {[1,2,3,4,5].map(n=>(
                    <button key={n} onClick={()=>set("rating",n)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:30, color:n<=form.rating?C.gold:C.faint, transition:"all .15s", transform:n<=form.rating?"scale(1.2)":"scale(1)" }}>★</button>
                  ))}
                </div>
              </div>
              <textarea value={form.text} onChange={e=>set("text",e.target.value)} placeholder="Tell us about your experience… *" style={{ ...SI, minHeight:80, resize:"vertical", lineHeight:1.6 }}/>
            </div>
            <Btn onClick={submit} disabled={!form.name||!form.text} style={{ width:"100%", padding:"12px 0", marginTop:16 }}>Post Review ✦</Btn>
          </>
        )}
      </div>
    </div>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function HomePage({ setView, menuItems, onAddToCart, onBook }) {
  const featured = menuItems.filter(m=>m.stars===5.0).slice(0,3);
  return (
    <div>
      {/* Hero */}
      <div style={{ position:"relative", display:"flex", alignItems:"center", justifyContent:"center", textAlign:"center", overflow:"hidden", padding:"60px 20px 52px" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 80% 60% at 50% 40%,#1A0A00 0%,#070400 70%)" }}/>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 40% 40% at 50% 30%,rgba(201,146,42,.08) 0%,transparent 70%)" }}/>
        {[["2% 3%","60px 60px"],["96% 3%","60px 60px"],["2% 92%","60px 60px"],["96% 92%","60px 60px"]].map(([pos,sz],i)=>(
          <div key={i} style={{ position:"absolute", left:pos.split(" ")[0], top:pos.split(" ")[1], width:sz.split(" ")[0], height:sz.split(" ")[1], borderTop:i<2?`1px solid ${C.goldD}`:"none", borderBottom:i>=2?`1px solid ${C.goldD}`:"none", borderLeft:i%2===0?`1px solid ${C.goldD}`:"none", borderRight:i%2===1?`1px solid ${C.goldD}`:"none", pointerEvents:"none" }}/>
        ))}
        <div style={{ position:"relative", zIndex:1 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:`linear-gradient(135deg,${C.goldGlow},transparent)`, border:`1px solid ${C.goldD}`, borderRadius:30, padding:"7px 22px", marginBottom:20 }}>
            <VegDot/><span style={{ color:C.gold, fontSize:10, letterSpacing:5, fontWeight:700 }}>100% PURE VEGETARIAN</span>
          </div>
          <h1 style={{ fontFamily:FONT.serif, fontSize:"clamp(36px,8vw,76px)", fontWeight:300, color:C.cream, lineHeight:.95, marginBottom:6, letterSpacing:-1, animation:"fadeUp .5s ease" }}>Flavours of</h1>
          <h1 className="gold-text" style={{ fontFamily:FONT.serif, fontSize:"clamp(36px,8vw,76px)", fontWeight:700, lineHeight:1, marginBottom:10, letterSpacing:-1, animation:"fadeUp .6s ease" }}>Incredible India</h1>
          {/* Free delivery badge */}
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(46,125,50,.15)", border:"1px solid rgba(46,125,50,.4)", borderRadius:20, padding:"5px 16px", marginBottom:22 }}>
            <span style={{ fontSize:14 }}>🛵</span>
            <span style={{ color:"#81C784", fontSize:11, fontWeight:700 }}>FREE delivery on orders above {fmt(DELIVERY_FREE_ABOVE)}</span>
          </div>
          <p style={{ color:C.muted, fontSize:14, maxWidth:420, margin:"0 auto 32px", lineHeight:1.85, fontStyle:"italic" }}>
            "From the smoky tandoors of Punjab to the royal kitchens of Hyderabad — a vegetarian feast like no other."
          </p>
          <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap", position:"relative", zIndex:2 }}>
            <Btn onClick={()=>setView("menu")} size="lg">🍽️ Explore Menu</Btn>
            <Btn onClick={onBook} variant="dark" size="lg">🪑 Reserve a Table</Btn>
            <Btn onClick={()=>setView("tracking")} variant="outline" size="lg">📦 Track Order</Btn>
          </div>
        </div>
      </div>

      {/* Coupon Banner */}
      <div style={{ background:`linear-gradient(135deg,#0E0700,#1A0E00)`, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}`, padding:"14px 20px", overflowX:"auto" }}>
        <div style={{ display:"flex", gap:10, minWidth:"max-content", margin:"0 auto", justifyContent:"center" }}>
          {Object.entries(COUPONS).map(([code,c])=>(
            <div key={code} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:"8px 14px", display:"flex", alignItems:"center", gap:10, flexShrink:0, position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", left:0, top:0, bottom:0, width:3, background:`linear-gradient(${C.goldL},${C.gold})` }}/>
              <div style={{ paddingLeft:8 }}>
                <div style={{ color:C.goldL, fontSize:11, fontWeight:700, letterSpacing:1 }}>{code}</div>
                <div style={{ color:C.faint, fontSize:9, marginTop:1 }}>{c.desc}</div>
              </div>
              <div style={{ background:`${C.goldGlow}`, border:`1px dashed ${C.goldD}`, borderRadius:6, padding:"2px 8px" }}>
                <span style={{ color:C.gold, fontSize:9, fontWeight:700 }}>TAP TO USE</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}` }}>
        <div style={{ display:"flex", maxWidth:800, margin:"0 auto" }}>
          {[["🥗","Pure Veg","100%"],["🌶️","Spices","50+"],["🍽️","Dishes","47+"],["⭐","Rating","4.9"]].map(([ic,l,v],i)=>(
            <div key={i} style={{ flex:1, textAlign:"center", padding:"18px 6px", borderRight:i<3?`1px solid ${C.border}`:"none" }}>
              <div style={{ fontSize:18 }}>{ic}</div>
              <div style={{ fontFamily:FONT.serif, fontSize:24, fontWeight:700, marginBottom:2 }} className="gold-text">{v}</div>
              <div style={{ color:C.faint, fontSize:9, letterSpacing:2 }}>{l.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Chaap Spotlight */}
      <div style={{ padding:"48px 20px 0", maxWidth:960, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:8 }}>
          <div style={{ fontFamily:FONT.serif, fontSize:11, color:C.gold, letterSpacing:6, marginBottom:8 }}>SIGNATURE SPECIALTY</div>
          <h2 style={{ fontFamily:FONT.serif, fontSize:"clamp(26px,5vw,42px)", fontWeight:600, color:C.cream, marginBottom:16 }}>The Art of Chaap</h2>
          <GoldDivider/>
        </div>
        <div style={{ background:`linear-gradient(135deg,#130C01,#0E0900)`, border:`1px solid ${C.border}`, borderRadius:20, padding:"24px 20px", marginBottom:44 }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))", gap:10 }}>
            {menuItems.filter(m=>m.cat==="Chaap").slice(0,4).map(item=>(
              <div key={item.id} onClick={()=>onAddToCart(item)} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:"14px 10px", textAlign:"center", cursor:"pointer", transition:"all .2s" }}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor=C.gold; e.currentTarget.style.transform="translateY(-3px)"; }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.transform="translateY(0)"; }}>
                <div style={{ fontSize:28, marginBottom:6 }}>{item.emoji}</div>
                <div style={{ fontFamily:FONT.serif, fontSize:13, color:C.cream, fontWeight:600, marginBottom:4 }}>{item.name}</div>
                <div style={{ color:C.goldL, fontWeight:700, fontSize:14 }}>{fmt(item.price)}</div>
                <div style={{ color:C.lime, fontSize:9, marginTop:4, fontWeight:700 }}>TAP TO ADD</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign:"center", marginTop:18 }}>
            <Btn onClick={()=>setView("menu")} variant="outline" size="sm">View All Chaap Varieties →</Btn>
          </div>
        </div>
      </div>

      {/* Signature */}
      <div style={{ padding:"0 20px 0", maxWidth:960, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:8 }}>
          <div style={{ fontFamily:FONT.serif, fontSize:11, color:C.gold, letterSpacing:6, marginBottom:8 }}>CHEF'S SELECTION</div>
          <h2 style={{ fontFamily:FONT.serif, fontSize:"clamp(26px,5vw,42px)", fontWeight:600, color:C.cream, marginBottom:16 }}>Signature Creations</h2>
          <GoldDivider/>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:18 }}>
          {featured.map(item=>(
            <div key={item.id} className="dish-card" style={{ ...SC, padding:24 }}>
              <div style={{ position:"absolute" }}/>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                <span style={{ fontSize:44 }}>{item.emoji}</span><VegDot/>
              </div>
              <div style={{ fontFamily:FONT.serif, fontSize:9, color:C.gold, letterSpacing:4, marginBottom:5 }}>{item.cat.toUpperCase()}</div>
              <h3 style={{ fontFamily:FONT.serif, fontSize:19, color:C.cream, fontWeight:600, marginBottom:8 }}>{item.name}</h3>
              <p style={{ color:C.muted, fontSize:12, lineHeight:1.7, marginBottom:18 }}>{item.desc}</p>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div><div className="gold-text" style={{ fontWeight:700, fontSize:19, fontFamily:FONT.serif }}>{fmt(item.price)}</div><Stars n={item.stars} size={12}/></div>
                <Btn onClick={()=>onAddToCart(item)} size="sm">Add to Cart</Btn>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign:"center", margin:"28px 0 0" }}>
          <Btn onClick={()=>setView("menu")} variant="outline" size="lg">Explore Full Menu ✦</Btn>
        </div>
      </div>

      {/* Book Table Section */}
      <div style={{ background:`linear-gradient(135deg,${C.surface},${C.card})`, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}`, padding:"52px 20px", marginTop:48 }}>
        <div style={{ maxWidth:700, margin:"0 auto", textAlign:"center" }}>
          <div style={{ fontFamily:FONT.serif, fontSize:11, color:C.gold, letterSpacing:6, marginBottom:10 }}>FINE DINING</div>
          <h2 style={{ fontFamily:FONT.serif, fontSize:"clamp(26px,5vw,44px)", fontWeight:600, color:C.cream, marginBottom:16 }}>Reserve Your Table</h2>
          <GoldDivider/>
          <p style={{ color:C.muted, fontSize:14, lineHeight:1.85, marginBottom:28, maxWidth:460, margin:"0 auto 28px" }}>Experience the royal ambience of Veeranj. Book your table and let us craft an unforgettable evening.</p>
          <div style={{ display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap" }}>
            <Btn onClick={onBook} size="lg">🪑 Book a Table Now</Btn>
            <Btn onClick={()=>setView("contact")} variant="outline" size="lg">📞 Call Us</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MENU PAGE ────────────────────────────────────────────────────────────────
function MenuPage({ menuItems, onAddToCart, cart, onBook }) {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const cats = ["All","Chaap","Starters","Mains","Breads","Desserts","Ice Cream","Drinks"];
  const getQty = id => cart.find(c=>c.id===id)?.qty||0;
  const filtered = menuItems.filter(m =>
    (cat==="All"||m.cat===cat) &&
    (m.name.toLowerCase().includes(search.toLowerCase())||m.desc.toLowerCase().includes(search.toLowerCase()))
  );
  return (
    <div style={{ maxWidth:1100, margin:"0 auto", padding:"36px 20px 80px" }}>
      <div style={{ fontFamily:FONT.serif, fontSize:11, color:C.gold, letterSpacing:6, marginBottom:6 }}>THE MENU</div>
      <h2 style={{ fontFamily:FONT.serif, fontSize:"clamp(28px,5vw,44px)", fontWeight:600, color:C.cream, marginBottom:6 }}>Taste the Tradition</h2>
      {/* Free delivery note */}
      <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(46,125,50,.12)", border:"1px solid rgba(46,125,50,.35)", borderRadius:20, padding:"5px 14px", marginBottom:18 }}>
        <span>🛵</span><span style={{ color:"#81C784", fontSize:11, fontWeight:700 }}>FREE delivery on orders above {fmt(DELIVERY_FREE_ABOVE)}</span>
      </div>
      <GoldDivider/>
      {/* Book table CTA in menu */}
      <div style={{ background:`linear-gradient(135deg,#130C01,#1A0E00)`, border:`1px solid ${C.border}`, borderRadius:14, padding:"16px 20px", marginBottom:22, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:24 }}>🪑</span>
          <div><div style={{ color:C.cream, fontWeight:700, fontSize:14 }}>Want to dine in?</div><div style={{ color:C.faint, fontSize:12 }}>Reserve a table for a fine dining experience</div></div>
        </div>
        <Btn onClick={onBook} size="sm">Book a Table ✦</Btn>
      </div>
      <div style={{ position:"relative", marginBottom:14 }}>
        <Search size={14} style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", color:C.faint, pointerEvents:"none" }}/>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search dishes, ingredients…" style={{ ...SI, paddingLeft:40 }}/>
      </div>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:26 }}>
        {cats.map(c=>(
          <button key={c} onClick={()=>setCat(c)} style={{ background:cat===c?`linear-gradient(135deg,${C.goldL},${C.gold})`:"transparent", color:cat===c?"#050300":C.muted, border:`1px solid ${cat===c?C.gold:C.border}`, borderRadius:20, padding:"7px 18px", fontSize:12, fontWeight:700, cursor:"pointer", transition:"all .2s", fontFamily:FONT.sans }}>
            {c}
          </button>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:18 }}>
        {filtered.map(item=>(
          <div key={item.id} className="dish-card" style={{ ...SC, padding:22 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
              <span style={{ fontSize:36 }}>{item.emoji}</span>
              <div style={{ textAlign:"right", display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
                <VegDot/>
                <div className="gold-text" style={{ fontWeight:700, fontSize:17, fontFamily:FONT.serif }}>{fmt(item.price)}</div>
                <Stars n={item.stars} size={11}/>
              </div>
            </div>
            <div style={{ fontFamily:FONT.serif, fontSize:9, color:C.gold, letterSpacing:3, marginBottom:5 }}>{item.cat.toUpperCase()}</div>
            <h3 style={{ fontFamily:FONT.serif, fontSize:16, color:C.cream, fontWeight:600, marginBottom:6 }}>{item.name}</h3>
            <p style={{ color:C.muted, fontSize:12, lineHeight:1.6, marginBottom:16 }}>{item.desc}</p>
            {getQty(item.id)>0?(
              <div style={{ background:C.surface, borderRadius:8, padding:"8px 12px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <span style={{ color:C.muted, fontSize:12 }}>{getQty(item.id)} in cart</span>
                <Btn onClick={()=>onAddToCart(item)} size="sm">+ More</Btn>
              </div>
            ):(
              <Btn onClick={()=>onAddToCart(item)} style={{ width:"100%", padding:"9px 0" }}>Add to Cart</Btn>
            )}
          </div>
        ))}
      </div>
      {filtered.length===0 && <div style={{ textAlign:"center", padding:"60px 0", color:C.muted }}><div style={{ fontSize:40, marginBottom:12 }}>🔍</div><p>No dishes found</p></div>}
    </div>
  );
}

// ─── SERVICES PAGE ────────────────────────────────────────────────────────────
function ServicesPage({ onBook, reviews, onAddReview }) {
  const services = [
    { icon:"🍽️", title:"Royal Dine-In",     desc:"Luxurious seating, soft music, candlelight & a Mughal-inspired ambience. Dine like royalty." },
    { icon:"🛍️", title:"Quick Takeaway",    desc:"Eco-friendly packaging with freshness sealed in. Your favourite food ready in minutes." },
    { icon:"🛵", title:"Free Home Delivery",desc:`FREE delivery on orders above ${fmt(DELIVERY_FREE_ABOVE)}. Hot & fresh at your door in 45 mins.` },
    { icon:"🎂", title:"Private Events",    desc:"Birthdays, anniversaries & corporate events. We handle every detail for your special day." },
    { icon:"🙏", title:"Jain Friendly",     desc:"No onion, no garlic options available. We respect every dietary preference with equal care." },
    { icon:"👨‍🍳", title:"Live Open Kitchen", desc:"Watch our chefs craft your meal. Fresh, transparent & absolutely spectacular." },
  ];
  const avg=(reviews.reduce((s,r)=>s+r.rating,0)/reviews.length).toFixed(1);
  return (
    <div style={{ maxWidth:960, margin:"0 auto", padding:"36px 20px 80px" }}>
      <div style={{ fontFamily:FONT.serif, fontSize:11, color:C.gold, letterSpacing:6, marginBottom:6 }}>WHAT WE OFFER</div>
      <h2 style={{ fontFamily:FONT.serif, fontSize:"clamp(26px,5vw,42px)", fontWeight:600, color:C.cream, marginBottom:16 }}>Our Services</h2>
      <GoldDivider/>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(258px,1fr))", gap:18, marginBottom:44 }}>
        {services.map((s,i)=>(
          <div key={i} className="dish-card" style={{ ...SC, padding:26, textAlign:"center" }}>
            <div style={{ width:58, height:58, borderRadius:"50%", background:`linear-gradient(135deg,${C.goldGlow},transparent)`, border:`1px solid ${C.goldD}`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", fontSize:24 }}>{s.icon}</div>
            <h3 style={{ fontFamily:FONT.serif, fontSize:17, color:C.cream, fontWeight:600, marginBottom:10 }}>{s.title}</h3>
            <p style={{ color:C.muted, fontSize:12, lineHeight:1.75 }}>{s.desc}</p>
          </div>
        ))}
      </div>
      {/* Book CTA */}
      <div style={{ background:`linear-gradient(135deg,#130C01,#0E0900)`, border:`1px solid ${C.border}`, borderRadius:20, padding:"36px 24px", textAlign:"center", marginBottom:44 }}>
        <div style={{ fontFamily:FONT.serif, fontSize:11, color:C.gold, letterSpacing:6, marginBottom:10 }}>EXPERIENCE</div>
        <h3 style={{ fontFamily:FONT.serif, fontSize:28, color:C.cream, marginBottom:12, fontWeight:600 }}>Ready for a Royal Feast?</h3>
        <p style={{ color:C.muted, fontSize:14, marginBottom:22, maxWidth:400, margin:"0 auto 22px", lineHeight:1.8 }}>Book your table for the finest vegetarian dining in Delhi.</p>
        <Btn onClick={onBook} size="lg">🪑 Reserve a Table ✦</Btn>
      </div>
      {/* Reviews */}
      <div style={{ fontFamily:FONT.serif, fontSize:11, color:C.gold, letterSpacing:6, marginBottom:6 }}>GUEST LOVE</div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:16, flexWrap:"wrap", gap:10 }}>
        <h2 style={{ fontFamily:FONT.serif, fontSize:"clamp(22px,4vw,34px)", fontWeight:600, color:C.cream }}>What Our Guests Say</h2>
        <Btn onClick={onAddReview} variant="outline" size="sm">✍️ Write a Review</Btn>
      </div>
      <GoldDivider/>
      <div style={{ ...SC, padding:20, marginBottom:22, display:"flex", gap:22, alignItems:"center", flexWrap:"wrap" }}>
        <div style={{ textAlign:"center", flexShrink:0 }}>
          <div style={{ fontFamily:FONT.serif, fontSize:52, fontWeight:700, marginBottom:4 }} className="gold-text">{avg}</div>
          <Stars n={parseFloat(avg)} size={18}/>
          <p style={{ color:C.faint, fontSize:11, marginTop:4 }}>{reviews.length} reviews</p>
        </div>
        <div style={{ flex:1, minWidth:160 }}>
          {[5,4,3,2,1].map(n=>{ const c=reviews.filter(r=>r.rating===n).length; return (
            <div key={n} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
              <span style={{ color:C.faint, fontSize:11, width:8 }}>{n}</span>
              <span style={{ color:C.gold, fontSize:11 }}>★</span>
              <div style={{ flex:1, height:5, background:C.surface, borderRadius:3, overflow:"hidden" }}>
                <div style={{ width:`${reviews.length?(c/reviews.length)*100:0}%`, height:"100%", background:`linear-gradient(to right,${C.goldL},${C.gold})`, borderRadius:3 }}/>
              </div>
              <span style={{ color:C.faint, fontSize:11, width:12, textAlign:"right" }}>{c}</span>
            </div>
          );})}
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(268px,1fr))", gap:16 }}>
        {reviews.map(r=>(
          <div key={r.id} className="dish-card" style={{ ...SC, padding:22 }}>
            <div style={{ color:C.goldD, fontSize:32, lineHeight:1, marginBottom:10, fontFamily:FONT.serif }}>"</div>
            <p style={{ color:C.cream, fontSize:13, lineHeight:1.7, marginBottom:14, fontStyle:"italic" }}>{r.text}</p>
            {r.dish&&<div style={{ display:"inline-block", background:C.goldGlow, color:C.goldL, fontSize:10, padding:"3px 10px", borderRadius:12, marginBottom:14, fontWeight:700, border:`1px solid ${C.goldD}` }}>✦ {r.dish}</div>}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", borderTop:`1px solid ${C.border}`, paddingTop:12 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:20 }}>{r.avatar||"👤"}</span>
                <div><div style={{ color:C.cream, fontSize:12, fontWeight:700 }}>{r.name}</div><div style={{ color:C.faint, fontSize:10 }}>{r.date}</div></div>
              </div>
              <Stars n={r.rating} size={12}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── TRACKING PAGE ────────────────────────────────────────────────────────────
function TrackingPage({ orders, trackingId, setTrackingId }) {
  const [input, setInput] = useState(trackingId||"");
  const order = orders.find(o=>o.id===trackingId);
  const stepIdx = order?STEPS.indexOf(order.status):-1;
  return (
    <div style={{ maxWidth:620, margin:"0 auto", padding:"36px 20px 80px" }}>
      <div style={{ fontFamily:FONT.serif, fontSize:11, color:C.gold, letterSpacing:6, marginBottom:6 }}>TRACK ORDER</div>
      <h2 style={{ fontFamily:FONT.serif, fontSize:"clamp(26px,5vw,42px)", fontWeight:600, color:C.cream, marginBottom:16 }}>Order Status</h2>
      <GoldDivider/>
      <div style={{ display:"flex", gap:10, marginBottom:16 }}>
        <input value={input} onChange={e=>setInput(e.target.value.toUpperCase())} onKeyDown={e=>e.key==="Enter"&&setTrackingId(input.toUpperCase())} placeholder="Enter Order ID  e.g. ORD-001" style={{ ...SI, flex:1 }}/>
        <Btn onClick={()=>setTrackingId(input.toUpperCase())} style={{ padding:"10px 20px", whiteSpace:"nowrap", flexShrink:0 }}>Track</Btn>
      </div>
      <div style={{ marginBottom:20 }}>
        <p style={{ color:C.faint, fontSize:10, letterSpacing:2, marginBottom:8 }}>DEMO ORDERS</p>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {orders.map(o=>(
            <button key={o.id} onClick={()=>{ setInput(o.id); setTrackingId(o.id); }} style={{ background:trackingId===o.id?`linear-gradient(135deg,${C.goldL},${C.gold})`:"transparent", color:trackingId===o.id?"#050300":C.muted, border:`1px solid ${trackingId===o.id?C.gold:C.border}`, borderRadius:8, padding:"6px 14px", fontSize:11, fontWeight:700, cursor:"pointer", transition:"all .2s", fontFamily:FONT.sans }}>
              {o.id}
            </button>
          ))}
        </div>
      </div>
      {trackingId&&!order&&<div style={{ ...SC, padding:24, textAlign:"center", color:C.muted }}><div style={{ fontSize:36, marginBottom:10 }}>❓</div><p>Order not found. Try a demo order above.</p></div>}
      {order&&(
        <div style={{ ...SC, padding:26, animation:"popIn .3s ease" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", paddingBottom:18, marginBottom:20, borderBottom:`1px solid ${C.border}` }}>
            <div>
              <h3 style={{ fontFamily:FONT.serif, fontSize:22, color:C.cream }}>{order.id}</h3>
              <p style={{ color:C.muted, fontSize:12, marginTop:3 }}>{order.customer} · {order.time}</p>
              <p style={{ color:C.faint, fontSize:11, marginTop:2 }}>{order.addr}</p>
            </div>
            <div style={{ textAlign:"right" }}>
              <div className="gold-text" style={{ fontFamily:FONT.serif, fontSize:20, fontWeight:700 }}>{fmt(order.total)}</div>
              <div style={{ fontSize:10, color:C.faint, marginTop:2 }}>Total</div>
            </div>
          </div>
          {STEPS.map((step,i)=>{ const done=i<=stepIdx; const active=i===stepIdx; return (
            <div key={step} style={{ display:"flex", gap:14 }}>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
                <div style={{ width:36, height:36, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", background:active?"linear-gradient(135deg,#E8B84B,#C9922A)":done?"#0A200A":C.surface, border:done?"2px solid #C9922A":"2px solid #2A1A04", fontSize:15, color:active?"#050300":C.cream, transition:"all .3s" }}>
                  {active?STEP_EMOJI[step]:done?"✓":"○"}
                </div>
                {(i < STEPS.length-1) && <div style={{ width:2, height:24, background:done?"linear-gradient(#E8B84B,#8A5F0A)":C.border, margin:"4px 0" }}/>}
              </div>
              <div style={{ paddingTop:6, paddingBottom:20 }}>
                <div style={{ color:active?C.goldL:done?C.cream:C.faint, fontWeight:active?700:500, fontSize:13 }}>{STEP_LABELS[step]}</div>
                {active&&<div style={{ color:C.faint, fontSize:11, marginTop:2 }}>In progress…</div>}
              </div>
            </div>
          );})}
          <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:14 }}>
            {order.items.map((item,i)=>(
              <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:`1px solid ${C.border}` }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}><VegDot size={11}/><span style={{ color:C.cream, fontSize:13 }}>{item.name} × {item.qty}</span></div>
                <span className="gold-text" style={{ fontWeight:700, fontSize:13 }}>{fmt(item.price*item.qty)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {!trackingId&&<div style={{ textAlign:"center", padding:"48px 0", color:C.faint }}><div style={{ fontSize:48, marginBottom:14 }}>📦</div><p>Enter your Order ID above</p></div>}
    </div>
  );
}

// ─── CONTACT PAGE ─────────────────────────────────────────────────────────────
function ContactPage() {
  const [form, setForm] = useState({ name:"", email:"", msg:"" });
  const [sent, setSent] = useState(false);
  const set=(k,v)=>setForm(p=>({...p,[k]:v}));
  const send=()=>{ if(!form.name||!form.email||!form.msg) return; setSent(true); setTimeout(()=>setSent(false),4000); setForm({name:"",email:"",msg:""}); };
  return (
    <div style={{ maxWidth:900, margin:"0 auto", padding:"36px 20px 80px" }}>
      <div style={{ fontFamily:FONT.serif, fontSize:11, color:C.gold, letterSpacing:6, marginBottom:6 }}>GET IN TOUCH</div>
      <h2 style={{ fontFamily:FONT.serif, fontSize:"clamp(26px,5vw,42px)", fontWeight:600, color:C.cream, marginBottom:16 }}>Connect With Us</h2>
      <GoldDivider/>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:16, marginBottom:28 }}>
        {[{ icon:"📍", title:"Visit Us", lines:["Connaught Place, New Delhi","Open daily: 11 AM – 11 PM"] },{ icon:"📞", title:"Call Us", lines:["+91 98765 43210","+91 98765 43211"] },{ icon:"✉️", title:"Email Us", lines:["hello@veeranj.com","reservations@veeranj.com"] }].map((c,i)=>(
          <div key={i} className="dish-card" style={{ ...SC, padding:22, textAlign:"center" }}>
            <div style={{ width:50, height:50, borderRadius:"50%", background:C.goldGlow, border:`1px solid ${C.goldD}`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px", fontSize:20 }}>{c.icon}</div>
            <h4 style={{ fontFamily:FONT.serif, fontSize:15, color:C.cream, fontWeight:600, marginBottom:10 }}>{c.title}</h4>
            {c.lines.map((l,j)=><p key={j} style={{ color:C.muted, fontSize:12, lineHeight:1.9 }}>{l}</p>)}
          </div>
        ))}
      </div>
      <div style={{ ...SC, padding:22, marginBottom:26, textAlign:"center" }}>
        <p style={{ color:C.faint, fontSize:9, letterSpacing:4, marginBottom:16 }}>FOLLOW VEERANJ</p>
        <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
          {[["📸","Instagram","@veeranj.in"],["👍","Facebook","Veeranj Delhi"],["💬","WhatsApp","+91 98765 43210"],["▶️","YouTube","Veeranj Kitchen"]].map(([ic,nm,h])=>(
            <div key={nm} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 14px", textAlign:"center", minWidth:80, cursor:"pointer", transition:"border-color .2s" }}
              onMouseEnter={e=>e.currentTarget.style.borderColor=C.gold}
              onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
              <div style={{ fontSize:18, marginBottom:4 }}>{ic}</div>
              <div style={{ color:C.cream, fontSize:10, fontWeight:700 }}>{nm}</div>
              <div style={{ color:C.faint, fontSize:9, marginTop:1 }}>{h}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ ...SC, padding:26 }}>
        <h3 style={{ fontFamily:FONT.serif, fontSize:20, color:C.cream, marginBottom:6, fontWeight:600 }}>Send Us a Message</h3>
        <p style={{ color:C.faint, fontSize:12, marginBottom:18 }}>We reply within a few hours.</p>
        {sent&&<div style={{ background:"#082008", border:`1px solid ${C.green}`, borderRadius:10, padding:12, marginBottom:14, color:"#81C784", fontSize:13, fontWeight:600, textAlign:"center" }}>✅ Message sent! We'll get back soon.</div>}
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <input value={form.name} onChange={e=>set("name",e.target.value)} placeholder="Your name *" style={SI}/>
            <input value={form.email} onChange={e=>set("email",e.target.value)} placeholder="Email *" type="email" style={SI}/>
          </div>
          <textarea value={form.msg} onChange={e=>set("msg",e.target.value)} placeholder="Your message… *" style={{ ...SI, minHeight:100, resize:"vertical", lineHeight:1.6 }}/>
        </div>
        <Btn onClick={send} disabled={!form.name||!form.email||!form.msg} style={{ padding:"11px 26px", marginTop:14 }}>Send Message ✦</Btn>
      </div>
      <div style={{ marginTop:24, textAlign:"center", padding:"20px 0", borderTop:`1px solid ${C.border}` }}>
        <div className="gold-text" style={{ fontFamily:FONT.serif, fontSize:16, letterSpacing:3, marginBottom:6 }}>VEERANJ</div>
        <p style={{ color:C.faint, fontSize:11 }}>© 2026 Veeranj Restaurant · Pure Vegetarian · New Delhi</p>
      </div>
    </div>
  );
}

// ─── ADMIN PANEL ──────────────────────────────────────────────────────────────
function AdminPanel({ orders, setOrders, menuItems, setMenuItems }) {
  const [tab, setTab] = useState("orders");
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({ name:"", cat:"Starters", price:"", desc:"", emoji:"🍛" });
  const updateStatus=(id,dir)=>setOrders(prev=>prev.map(o=>{ if(o.id!==id) return o; const i=STEPS.indexOf(o.status); return {...o,status:STEPS[Math.max(0,Math.min(STEPS.length-1,i+dir))]}; }));
  const toggleAvail=id=>setMenuItems(prev=>prev.map(m=>m.id===id?{...m,avail:!m.avail}:m));
  const deleteItem=id=>setMenuItems(prev=>prev.filter(m=>m.id!==id));
  const addItem=()=>{ if(!newItem.name||!newItem.price) return; setMenuItems(prev=>[...prev,{...newItem,id:Date.now(),price:parseInt(newItem.price),stars:5.0,avail:true}]); setNewItem({name:"",cat:"Starters",price:"",desc:"",emoji:"🍛"}); setShowAdd(false); };
  const revenue=orders.reduce((s,o)=>s+o.total,0);
  const sc=s=>s==="delivered"?C.green:s==="pending"?C.gold:C.blue;
  return (
    <div style={{ maxWidth:1100, margin:"0 auto", padding:"36px 20px 80px" }}>
      <div style={{ fontFamily:FONT.serif, fontSize:11, color:C.gold, letterSpacing:6, marginBottom:6 }}>ADMIN</div>
      <h2 style={{ fontFamily:FONT.serif, fontSize:"clamp(26px,5vw,42px)", fontWeight:600, color:C.cream, marginBottom:16 }}>Dashboard</h2>
      <GoldDivider/>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:24 }}>
        {[["📦",orders.length,"Orders"],["⏳",orders.filter(o=>o.status==="pending").length,"Pending"],["✅",orders.filter(o=>o.status==="delivered").length,"Delivered"],["💰",fmt(revenue),"Revenue"]].map(([ic,v,l])=>(
          <div key={l} style={{ ...SC, padding:16, textAlign:"center" }}>
            <div style={{ fontSize:22, marginBottom:6 }}>{ic}</div>
            <div className="gold-text" style={{ fontFamily:FONT.serif, fontSize:22, fontWeight:700, marginBottom:2 }}>{v}</div>
            <div style={{ color:C.faint, fontSize:10, letterSpacing:1 }}>{l.toUpperCase()}</div>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", gap:8, marginBottom:18 }}>
        {[["orders","📦 Orders"],["menu","🍛 Menu"],["coupons","🏷️ Coupons"]].map(([t,l])=>(
          <button key={t} onClick={()=>setTab(t)} style={{ background:tab===t?`linear-gradient(135deg,${C.goldL},${C.gold})`:"transparent", color:tab===t?"#050300":C.muted, border:`1px solid ${tab===t?C.gold:C.border}`, borderRadius:10, padding:"9px 18px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:FONT.sans }}>{l}</button>
        ))}
      </div>
      {tab==="orders"&&(
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {orders.map(o=>{ const si=STEPS.indexOf(o.status); return (
            <div key={o.id} style={{ ...SC, padding:16, display:"flex", gap:14, alignItems:"center", flexWrap:"wrap" }}>
              <div style={{ flex:1, minWidth:180 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                  <span style={{ fontFamily:FONT.serif, fontSize:16, color:C.cream }}>{o.id}</span>
                  <span style={{ background:sc(o.status)+"20", color:sc(o.status), fontSize:10, padding:"2px 9px", borderRadius:20, fontWeight:700 }}>{o.status.replace("_"," ")}</span>
                </div>
                <p style={{ color:C.muted, fontSize:11 }}>{o.customer} · {o.time} · {o.addr}</p>
              </div>
              <div className="gold-text" style={{ fontFamily:FONT.serif, fontSize:16, fontWeight:700 }}>{fmt(o.total)}</div>
              <div style={{ display:"flex", gap:8 }}>
                <Btn onClick={()=>updateStatus(o.id,-1)} variant="ghost" style={{ padding:"7px 12px", opacity:si===0?.3:1 }}>←</Btn>
                <Btn onClick={()=>updateStatus(o.id,+1)} style={{ padding:"7px 12px", opacity:si===STEPS.length-1?.3:1 }}>→</Btn>
              </div>
            </div>
          );})}
        </div>
      )}
      {tab==="menu"&&(
        <div>
          <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:14 }}>
            <Btn onClick={()=>setShowAdd(p=>!p)} style={{ padding:"9px 20px" }}>+ Add Dish</Btn>
          </div>
          {showAdd&&(
            <div style={{ ...SC, padding:22, marginBottom:16 }}>
              <h3 style={{ fontFamily:FONT.serif, fontSize:18, color:C.cream, marginBottom:14, fontWeight:600 }}>New Dish</h3>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <input value={newItem.name} onChange={e=>setNewItem(p=>({...p,name:e.target.value}))} placeholder="Dish name" style={SI}/>
                <input value={newItem.price} onChange={e=>setNewItem(p=>({...p,price:e.target.value}))} placeholder="Price ₹" type="number" style={SI}/>
                <select value={newItem.cat} onChange={e=>setNewItem(p=>({...p,cat:e.target.value}))} style={SI}>
                  {["Starters","Chaap","Mains","Breads","Desserts","Ice Cream","Drinks"].map(c=><option key={c}>{c}</option>)}
                </select>
                <input value={newItem.emoji} onChange={e=>setNewItem(p=>({...p,emoji:e.target.value}))} placeholder="Emoji" style={SI}/>
                <input value={newItem.desc} onChange={e=>setNewItem(p=>({...p,desc:e.target.value}))} placeholder="Description" style={{ ...SI, gridColumn:"1/-1" }}/>
              </div>
              <div style={{ display:"flex", gap:10, marginTop:12 }}>
                <Btn onClick={addItem} style={{ padding:"9px 20px" }}>Add Dish</Btn>
                <Btn onClick={()=>setShowAdd(false)} variant="ghost" style={{ padding:"9px 20px" }}>Cancel</Btn>
              </div>
            </div>
          )}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))", gap:14 }}>
            {menuItems.map(item=>(
              <div key={item.id} style={{ ...SC, padding:16, opacity:item.avail?1:.5 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}><span style={{ fontSize:26 }}>{item.emoji}</span><VegDot/></div>
                  <div style={{ display:"flex", gap:6 }}>
                    <Btn onClick={()=>toggleAvail(item.id)} variant={item.avail?"success":"danger"} style={{ padding:"3px 9px", fontSize:10 }}>{item.avail?"Live":"Off"}</Btn>
                    <Btn onClick={()=>deleteItem(item.id)} variant="danger" style={{ padding:"3px 8px", fontSize:12 }}>✕</Btn>
                  </div>
                </div>
                <h4 style={{ fontFamily:FONT.serif, fontSize:14, color:C.cream, marginBottom:2, fontWeight:600 }}>{item.name}</h4>
                <p style={{ color:C.faint, fontSize:10, marginBottom:6 }}>{item.cat}</p>
                <div className="gold-text" style={{ fontFamily:FONT.serif, fontSize:16, fontWeight:700 }}>{fmt(item.price)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {tab==="coupons"&&(
        <div>
          <p style={{ color:C.muted, fontSize:13, marginBottom:20 }}>All active coupon codes for Veeranj:</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:14 }}>
            {Object.entries(COUPONS).map(([code,c])=>(
              <div key={code} style={{ ...SC, padding:18, position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", left:0, top:0, bottom:0, width:4, background:`linear-gradient(${C.goldL},${C.gold})` }}/>
                <div style={{ paddingLeft:8 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                    <div className="gold-text" style={{ fontFamily:FONT.serif, fontSize:18, fontWeight:700, letterSpacing:2 }}>{code}</div>
                    <span style={{ background:`${C.green}20`, color:"#81C784", fontSize:10, padding:"2px 8px", borderRadius:10, fontWeight:700 }}>ACTIVE</span>
                  </div>
                  <p style={{ color:C.muted, fontSize:12, marginBottom:6 }}>{c.desc}</p>
                  <div style={{ display:"flex", gap:10 }}>
                    <span style={{ color:C.faint, fontSize:11 }}>Min: {fmt(c.min)}</span>
                    <span style={{ color:C.goldL, fontSize:11, fontWeight:700 }}>{c.type==="percent"?`${c.value}% OFF`:`${fmt(c.value)} OFF`}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── CART DRAWER ──────────────────────────────────────────────────────────────
function CartDrawer({ cart, total, onClose, onUpdateQty, onCheckout, user, onLoginNeeded }) {
  const [step, setStep] = useState("cart");
  const [addr, setAddr] = useState("");
  const [cd, setCd] = useState({ num:"", exp:"", cvv:"", name:"" });
  const [busy, setBusy] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);

  const applyDiscount = (code, c) => {
    const d = c.type==="percent" ? Math.round(total*(c.value/100)) : c.value;
    setDiscount(d); setAppliedCoupon(code);
  };
  const removeCoupon = () => { setAppliedCoupon(null); setDiscount(0); setCouponCode(""); };

  const delivery = total >= DELIVERY_FREE_ABOVE ? 0 : DELIVERY_CHARGE;
  const gst = Math.round((total-discount)*.05);
  const grand = Math.max(0, total - discount) + delivery + gst + HANDLING_FEE;
  const isFreeDelivery = total >= DELIVERY_FREE_ABOVE;

  const pay=()=>{ if(!cd.num||!cd.exp||!cd.cvv||!cd.name) return; setBusy(true); setTimeout(()=>{ setBusy(false); onCheckout(addr); },2000); };

  return (
    <div onClick={e=>e.target===e.currentTarget&&onClose()} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.82)", zIndex:500, display:"flex", justifyContent:"flex-end", animation:"fadeIn .2s" }}>
      <div style={{ width:"min(420px,100vw)", background:C.surface, borderLeft:`1px solid ${C.border}`, display:"flex", flexDirection:"column", height:"100vh", animation:"slideIn .3s ease", boxShadow:`-20px 0 60px rgba(0,0,0,.6)` }}>
        {/* Header */}
        <div style={{ padding:"16px 20px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0, background:C.card }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            {step!=="cart"&&<button onClick={()=>setStep(step==="payment"?"checkout":"cart")} style={{ background:"none", border:"none", color:C.muted, cursor:"pointer", fontSize:20 }}>←</button>}
            <div>
              <div style={{ fontFamily:FONT.serif, fontSize:9, color:C.gold, letterSpacing:4, marginBottom:1 }}>VEERANJ</div>
              <span style={{ fontFamily:FONT.serif, fontSize:18, color:C.cream }}>{step==="cart"?"Your Cart":step==="checkout"?"Delivery Details":"Payment"}</span>
            </div>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", color:C.faint, cursor:"pointer", fontSize:22 }}>✕</button>
        </div>

        <div style={{ flex:1, padding:20, overflowY:"auto" }}>
          {/* CART STEP */}
          {step==="cart"&&(cart.length===0?(
            <div style={{ textAlign:"center", padding:"60px 0", color:C.faint }}>
              <div style={{ fontSize:44, marginBottom:14 }}>🛒</div>
              <p style={{ fontFamily:FONT.serif, fontSize:16 }}>Your cart is empty</p>
              <p style={{ fontSize:12, marginTop:6 }}>Explore our menu 🌿</p>
            </div>
          ):(
            <>
              {/* Free delivery progress */}
              {!isFreeDelivery && (
                <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 14px", marginBottom:16 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                    <span style={{ color:C.muted, fontSize:11 }}>🛵 Add {fmt(DELIVERY_FREE_ABOVE-total)} more for FREE delivery!</span>
                  </div>
                  <div style={{ height:4, background:C.surface, borderRadius:2, overflow:"hidden" }}>
                    <div style={{ width:`${Math.min((total/DELIVERY_FREE_ABOVE)*100,100)}%`, height:"100%", background:`linear-gradient(to right,${C.goldL},${C.gold})`, borderRadius:2, transition:"width .4s" }}/>
                  </div>
                </div>
              )}
              {isFreeDelivery && (
                <div style={{ background:"rgba(46,125,50,.12)", border:"1px solid rgba(46,125,50,.4)", borderRadius:10, padding:"10px 14px", marginBottom:16, textAlign:"center" }}>
                  <span style={{ color:"#81C784", fontSize:12, fontWeight:700 }}>🎉 Yay! You've unlocked FREE delivery!</span>
                </div>
              )}

              {/* Items */}
              {cart.map(item=>(
                <div key={item.id} style={{ display:"flex", gap:12, padding:"12px 0", borderBottom:`1px solid ${C.border}` }}>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                    <span style={{ fontSize:24 }}>{item.emoji}</span><VegDot size={11}/>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ color:C.cream, fontSize:13, fontWeight:600, marginBottom:2 }}>{item.name}</div>
                    <div className="gold-text" style={{ fontWeight:700, fontSize:14, fontFamily:FONT.serif }}>{fmt(item.price*item.qty)}</div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <button onClick={()=>onUpdateQty(item.id,-1)} style={{ background:C.card, border:`1px solid ${C.border}`, color:C.muted, borderRadius:6, width:28, height:28, cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>−</button>
                    <span style={{ color:C.cream, minWidth:16, textAlign:"center", fontWeight:700 }}>{item.qty}</span>
                    <button onClick={()=>onUpdateQty(item.id,+1)} style={{ background:`linear-gradient(135deg,${C.goldL},${C.gold})`, border:"none", color:"#050300", borderRadius:6, width:28, height:28, cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700 }}>+</button>
                  </div>
                </div>
              ))}

              {/* Coupon */}
              <div style={{ marginTop:16, marginBottom:16 }}>
                <p style={{ color:C.gold, fontSize:10, letterSpacing:2, fontWeight:700, marginBottom:10 }}>🏷️ APPLY COUPON</p>
                <CouponSection subtotal={total} couponCode={couponCode} setCouponCode={setCouponCode} appliedCoupon={appliedCoupon} onApply={applyDiscount} onRemove={removeCoupon} discount={discount}/>
              </div>

              {/* Bill */}
              <div style={{ background:C.card, borderRadius:12, padding:16, border:`1px solid ${C.border}` }}>
                <p style={{ color:C.faint, fontSize:9, letterSpacing:3, marginBottom:12 }}>BILL SUMMARY</p>
                <div style={{ display:"flex", justifyContent:"space-between", color:C.muted, fontSize:12, marginBottom:7 }}><span>Subtotal</span><span>{fmt(total)}</span></div>
                {discount>0 && <div style={{ display:"flex", justifyContent:"space-between", color:C.green, fontSize:12, marginBottom:7, fontWeight:700 }}><span>Discount ({appliedCoupon})</span><span>-{fmt(discount)}</span></div>}
                <div style={{ display:"flex", justifyContent:"space-between", color:C.muted, fontSize:12, marginBottom:7 }}>
                  <span>Delivery</span>
                  {isFreeDelivery ? <span style={{ color:"#81C784", fontWeight:700 }}>FREE 🎉</span> : <span>{fmt(DELIVERY_CHARGE)}</span>}
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", color:C.muted, fontSize:12, marginBottom:7 }}><span>Handling Fee</span><span>{fmt(HANDLING_FEE)}</span></div>
                <div style={{ display:"flex", justifyContent:"space-between", color:C.muted, fontSize:12, marginBottom:7 }}><span>GST (5%)</span><span>{fmt(gst)}</span></div>
                <div style={{ display:"flex", justifyContent:"space-between", borderTop:`1px solid ${C.border}`, paddingTop:12, marginTop:4 }}>
                  <span style={{ color:C.cream, fontWeight:700, fontSize:17 }}>Total</span>
                  <span className="gold-text" style={{ fontWeight:700, fontSize:17, fontFamily:FONT.serif }}>{fmt(grand)}</span>
                </div>
                {discount>0 && <p style={{ color:"#81C784", fontSize:11, marginTop:6, fontWeight:600, textAlign:"center" }}>You saved {fmt(discount)} on this order! 🎉</p>}
              </div>
            </>
          ))}

          {/* CHECKOUT STEP */}
          {step==="checkout"&&(
            <div>
              <p style={{ color:C.muted, fontSize:13, marginBottom:14 }}>Where should we deliver?</p>
              <textarea value={addr} onChange={e=>setAddr(e.target.value)} placeholder="House no., Street, Area, City, PIN code…" style={{ ...SI, minHeight:100, resize:"vertical", lineHeight:1.6 }}/>
            </div>
          )}

          {/* PAYMENT STEP */}
          {step==="payment"&&(
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <div style={{ background:`linear-gradient(135deg,#1A0E00,#2A1800)`, border:`1px solid ${C.goldD}`, borderRadius:14, padding:20 }}>
                <div style={{ fontSize:9, color:C.gold, letterSpacing:5, marginBottom:10 }}>PAYMENT CARD</div>
                <div style={{ color:C.cream, fontSize:16, letterSpacing:4, marginBottom:14, fontFamily:"monospace" }}>{cd.num?cd.num.replace(/(.{4})/g,"$1 ").trim():"•••• •••• •••• ••••"}</div>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <div><div style={{ color:C.faint, fontSize:8, letterSpacing:2 }}>CARDHOLDER</div><div style={{ color:C.cream, fontSize:11 }}>{cd.name||"Your Name"}</div></div>
                  <div><div style={{ color:C.faint, fontSize:8, letterSpacing:2 }}>EXPIRES</div><div style={{ color:C.cream, fontSize:11 }}>{cd.exp||"MM/YY"}</div></div>
                </div>
              </div>
              <input value={cd.name} onChange={e=>setCd(p=>({...p,name:e.target.value}))} placeholder="Cardholder name" style={SI}/>
              <input value={cd.num} onChange={e=>setCd(p=>({...p,num:e.target.value.replace(/\D/g,"").slice(0,16)}))} placeholder="Card number" style={SI}/>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                <input value={cd.exp} onChange={e=>setCd(p=>({...p,exp:e.target.value}))} placeholder="MM/YY" style={SI}/>
                <input value={cd.cvv} onChange={e=>setCd(p=>({...p,cvv:e.target.value.replace(/\D/g,"").slice(0,3)}))} placeholder="CVV" style={SI}/>
              </div>
              <p style={{ color:C.faint, fontSize:11, textAlign:"center" }}>🔒 Stripe Secured · 256-bit Encryption</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding:20, borderTop:`1px solid ${C.border}`, flexShrink:0, background:C.card }}>
          {step==="cart"&&cart.length>0&&(user?<Btn onClick={()=>setStep("checkout")} style={{ width:"100%", padding:"13px 0" }}>Proceed to Checkout →</Btn>:<Btn onClick={onLoginNeeded} style={{ width:"100%", padding:"13px 0" }}>Login to Checkout 🔐</Btn>)}
          {step==="checkout"&&<Btn onClick={()=>addr.trim()&&setStep("payment")} disabled={!addr.trim()} style={{ width:"100%", padding:"13px 0" }}>Continue to Payment →</Btn>}
          {step==="payment"&&<Btn onClick={pay} style={{ width:"100%", padding:"13px 0" }}>{busy?"Processing…":`Pay ${fmt(grand)} ✦`}</Btn>}
        </div>
      </div>
    </div>
  );
}

// ─── LOGIN MODAL ──────────────────────────────────────────────────────────────
function LoginModal({ onLogin, onClose }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name:"", email:"", pass:"" });
  const [err, setErr] = useState("");
  const submit=()=>{
    if(mode==="login"){ const u=CREDS.find(u=>u.email===form.email&&u.pass===form.pass); u?(onLogin(u),setErr("")):setErr("Invalid credentials. Please try again."); }
    else { if(!form.name||!form.email||!form.pass){setErr("All fields required");return;} onLogin({name:form.name,email:form.email,role:"user"}); }
  };
  return (
    <div onClick={e=>e.target===e.currentTarget&&onClose()} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.92)", zIndex:600, display:"flex", alignItems:"center", justifyContent:"center", padding:16, animation:"fadeIn .2s" }}>
      <div style={{ ...SC, width:"min(390px,100%)", padding:32, position:"relative", animation:"popIn .25s ease", boxShadow:`0 32px 80px rgba(0,0,0,.8),0 0 40px ${C.goldGlow}` }}>
        <button onClick={onClose} style={{ position:"absolute", top:16, right:18, background:"none", border:"none", color:C.faint, cursor:"pointer", fontSize:20 }}>✕</button>
        <div style={{ textAlign:"center", marginBottom:22 }}>
          <div style={{ width:50, height:50, borderRadius:"50%", background:`linear-gradient(135deg,${C.goldL},${C.goldD})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, margin:"0 auto 12px", boxShadow:`0 8px 24px ${C.goldGlow}` }}>🪔</div>
          <div className="gold-text" style={{ fontFamily:FONT.serif, fontSize:20, letterSpacing:3, marginBottom:4 }}>VEERANJ</div>
          <p style={{ color:C.faint, fontSize:12 }}>{mode==="login"?"Welcome back. Please sign in.":"Create your Veeranj account."}</p>
        </div>
        <GoldDivider/>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {mode==="signup"&&<input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="Full name" style={SI}/>}
          <input value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} placeholder="Email address" type="email" style={SI}/>
          <input value={form.pass} onChange={e=>setForm(p=>({...p,pass:e.target.value}))} placeholder="Password" type="password" style={SI} onKeyDown={e=>e.key==="Enter"&&submit()}/>
        </div>
        {err&&<p style={{ color:"#E57373", fontSize:12, marginTop:10, fontWeight:600 }}>{err}</p>}
        {mode==="login"&&<div style={{ marginTop:12, background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:12, fontSize:11, color:C.faint, lineHeight:2 }}><span style={{ color:C.gold }}>Admin:</span> admin@veeranj.com / admin123<br/><span style={{ color:C.gold }}>Guest:</span> user@veeranj.com / user123</div>}
        <Btn onClick={submit} style={{ width:"100%", padding:"13px 0", marginTop:18 }}>{mode==="login"?"Sign In ✦":"Create Account"}</Btn>
        <p style={{ textAlign:"center", color:C.faint, fontSize:12, marginTop:14 }}>
          {mode==="login"?"New here? ":"Have an account? "}
          <span onClick={()=>{setMode(m=>m==="login"?"signup":"login");setErr("");}} style={{ color:C.goldL, cursor:"pointer", fontWeight:700 }}>{mode==="login"?"Sign up":"Sign in"}</span>
        </p>
      </div>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function RestaurantApp() {
  const [view, setView]         = useState("home");
  const [cart, setCart]         = useState([]);
  const [user, setUser]         = useState(null);
  const [orders, setOrders]     = useState(ORDERS_INIT);
  const [menu, setMenu]         = useState(MENU_INIT);
  const [reviews, setReviews]   = useState(REVIEWS_INIT);
  const [showCart, setShowCart]     = useState(false);
  const [showLogin, setShowLogin]   = useState(false);
  const [showBook, setShowBook]     = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [trackingId, setTrackingId] = useState(null);
  const [toast, setToast]           = useState(null);

  const notify = msg=>{ setToast(msg); setTimeout(()=>setToast(null),3200); };
  const addToCart = item=>{ setCart(prev=>{ const ex=prev.find(c=>c.id===item.id); return ex?prev.map(c=>c.id===item.id?{...c,qty:c.qty+1}:c):[...prev,{...item,qty:1}]; }); notify(`${item.name} added ✦`); };
  const updateQty = (id,delta)=>setCart(prev=>prev.map(c=>c.id===id?{...c,qty:Math.max(0,c.qty+delta)}:c).filter(c=>c.qty>0));
  const placeOrder = addr=>{ const sub=cart.reduce((s,c)=>s+c.price*c.qty,0); const del=sub>=DELIVERY_FREE_ABOVE?0:DELIVERY_CHARGE; const ord={ id:`ORD-${String(orders.length+1).padStart(3,"0")}`, customer:user?.name||"Guest", items:cart.map(c=>({name:c.name,qty:c.qty,price:c.price})), total:sub+del+Math.round(sub*.05)+HANDLING_FEE, status:"pending", time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}), addr }; setOrders(p=>[ord,...p]); setCart([]); setTrackingId(ord.id); setView("tracking"); notify("Order placed! Khana aa raha hai 🎉"); };
  const addReview = r=>{ setReviews(prev=>[{...r,id:Date.now(),avatar:"😊",date:"Just now"},...prev]); notify("Review posted! Shukriya 🙏"); };

  const cartCount=cart.reduce((s,i)=>s+i.qty,0);
  const cartTotal=cart.reduce((s,i)=>s+i.price*i.qty,0);

  return (
    <div style={{ fontFamily:FONT.sans, background:C.bg, color:C.cream, minHeight:"100vh" }}>
      <GlobalStyles/>
      {toast&&<Toast msg={toast}/>}
      <Navbar user={user} cartCount={cartCount} onCart={()=>setShowCart(true)} onLogin={()=>setShowLogin(true)} onLogout={()=>{setUser(null);notify("Phir milenge! 🙏");}}/>
      <div>
        {view==="home"     && <HomePage     setView={setView} menuItems={menu} onAddToCart={addToCart} onBook={()=>setShowBook(true)}/>}
        {view==="menu"     && <MenuPage     menuItems={menu} onAddToCart={addToCart} cart={cart} onBook={()=>setShowBook(true)}/>}
        {view==="services" && <ServicesPage onBook={()=>setShowBook(true)} reviews={reviews} onAddReview={()=>setShowReview(true)}/>}
        {view==="tracking" && <TrackingPage orders={orders} trackingId={trackingId} setTrackingId={setTrackingId}/>}
        {view==="contact"  && <ContactPage/>}
        {view==="admin"    && user?.role==="admin" && <AdminPanel orders={orders} setOrders={setOrders} menuItems={menu} setMenuItems={setMenu}/>}
        {view==="admin"    && !user && <div style={{ textAlign:"center", padding:"80px 20px", color:C.faint }}><div style={{ fontSize:48, marginBottom:16 }}>🔐</div><p style={{ fontFamily:FONT.serif, fontSize:18, color:C.cream, marginBottom:16 }}>Admin Access Required</p><Btn onClick={()=>setShowLogin(true)} size="lg">Login as Admin ✦</Btn></div>}
      </div>
      <BottomNav view={view} setView={setView} isAdmin={user?.role==="admin"}/>
      {showCart   && <CartDrawer cart={cart} total={cartTotal} onClose={()=>setShowCart(false)} onUpdateQty={updateQty} onCheckout={addr=>{setShowCart(false);placeOrder(addr);}} user={user} onLoginNeeded={()=>{setShowCart(false);setShowLogin(true);}}/>}
      {showLogin  && <LoginModal onLogin={u=>{setUser(u);setShowLogin(false);notify(`Swagat hai, ${u.name}! ✦`);}} onClose={()=>setShowLogin(false)}/>}
      {showBook   && <BookingModal onClose={()=>setShowBook(false)} onConfirm={f=>{notify(`Table booked for ${f.guests} guests on ${f.date}! 🎉`);}}/>}
      {showReview && <AddReviewModal onClose={()=>setShowReview(false)} onSubmit={addReview}/>}
    </div>
  );
}
