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
          <div style={{ display:"flex", alignItems:"center", gap:4,
