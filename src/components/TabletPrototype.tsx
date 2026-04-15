"use client";

import Image from "next/image";
import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type TabletScreen = "home" | "menu" | "cart" | "confirmation";
type Orientation = "portrait" | "landscape";

const drinks = [
  { name: "Water", image: "/images/water.png" },
  { name: "Coffee", image: "/images/coffee.png" },
  { name: "Tea", image: "/images/tea.png" },
  { name: "Juice", image: "/images/juice.png" },
  { name: "Cola", image: "/images/cola.png" },
];

const trending = [
  { name: "Red Wine", price: "$9", image: "/images/red-wine.png" },
  { name: "Beer", price: "$9", image: "/images/beer.png" },
  { name: "Snack Mix", price: "$9", image: "/images/snack-mix.png" },
];

const complimentaryDrinks = [
  { name: "Water", price: "Free", image: "/images/water.png" },
  { name: "Coffee", price: "Free", image: "/images/coffee.png" },
  { name: "Tea", price: "Free", image: "/images/tea.png" },
  { name: "Juice", price: "Free", image: "/images/juice.png" },
  { name: "Cola", price: "Free", image: "/images/cola.png" },
];

const beverages = [
  { name: "Red Wine", description: "Cabernet Sauvignon", price: "$9", badge: "#1 Most popular", image: "/images/red-wine-thumb.png" },
  { name: "Craft Beer", description: "Local IPA", price: "$8", badge: null, image: "/images/beer-thumb.png" },
  { name: "Red Wine", description: "Sonoma Chardonnay", price: "$11", badge: null, urgency: "Only 2 left", image: "/images/white-wine-thumb.png" },
];

const moreOnBoard = [
  { name: "Movies", icon: "/images/icon-tv.svg" },
  { name: "Wifi", icon: "/images/icon-wifi.svg" },
  { name: "Flight Info", icon: "/images/icon-plane-outline.svg" },
];

const navTabs = [
  { name: "Home", icon: "/images/icon-home.svg", screen: "home" as TabletScreen },
  { name: "Menu", icon: "/images/icon-menu.svg", screen: "menu" as TabletScreen },
  { name: "Movies", icon: "/images/icon-movies.svg", screen: null },
  { name: "My Flight", icon: "/images/icon-flight.svg", screen: null },
];

// --- Shared item card component ---
function ItemCard({ name, price, image, size = "md" }: { name: string; price: string; image: string; size?: "sm" | "md" | "lg" }) {
  const imgSize = size === "lg" ? 80 : size === "md" ? 66 : 52;
  return (
    <div className="bg-[#191c2f] rounded overflow-hidden flex-shrink-0">
      <div className="flex items-center justify-center py-3 bg-white/5" style={{ padding: size === "lg" ? "16px" : "12px" }}>
        <div style={{ width: imgSize, height: imgSize }} className="flex items-center justify-center">
          <Image src={image} alt={name} width={imgSize} height={imgSize} className="object-contain" />
        </div>
      </div>
      <div className="flex items-center p-3">
        <div className="flex flex-col gap-1">
          <span className="text-white text-[16px] font-medium leading-[1.3]">{name}</span>
          <span className="text-[#788284] text-[16px] leading-[1.3]">{price}</span>
        </div>
        <button className="ml-auto w-6 h-6 rounded-full border border-[#788284] flex items-center justify-center flex-shrink-0">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2V10M2 6H10" stroke="#788284" strokeWidth="1.5" strokeLinecap="round" /></svg>
        </button>
      </div>
    </div>
  );
}

// --- Navigation Rail (landscape) — matches Figma sidebar ---
function NavRail({ screen, onNavigate }: { screen: TabletScreen; onNavigate: (s: TabletScreen) => void }) {
  const activeScreen = screen === "cart" || screen === "confirmation" ? "menu" : screen;
  return (
    <div className="w-[232px] bg-[#191c2f] flex flex-col px-4 py-16 gap-8 flex-shrink-0">
      {/* Flight info card */}
      <div className="border border-[#323b62] rounded h-[66px] flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4">
          <Image src="/images/icon-plane-filled.svg" alt="" width={20} height={20} />
          <div className="flex flex-col">
            <span className="text-[#788284] text-[14px] leading-[1.3]">Arrives in</span>
            <span className="text-white text-[16px] font-medium leading-[1.3]">2hr 15m</span>
          </div>
        </div>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="rotate-[-90deg]">
          <path d="M6 8L10 12L14 8" stroke="#e31837" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Nav items */}
      <div className="flex flex-col gap-3">
        {navTabs.map((tab) => {
          const isActive = tab.screen ? tab.screen === activeScreen : false;
          return (
            <button
              key={tab.name}
              onClick={tab.screen ? () => onNavigate(tab.screen!) : undefined}
              className={`w-full h-[66px] flex items-center gap-3 px-6 py-3 rounded transition-colors ${
                isActive
                  ? "bg-[#323b62] border-l-2 border-[#e31837]"
                  : "hover:bg-white/5"
              }`}
            >
              <Image
                src={tab.icon}
                alt={tab.name}
                width={20}
                height={20}
                className={isActive ? "brightness-200" : "opacity-50"}
              />
              <span className={`text-[16px] leading-[1.3] ${
                isActive ? "text-white font-medium" : "text-[#788284]"
              }`}>
                {tab.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// --- Bottom Tab Bar (portrait) ---
function BottomTabBar({ screen, onNavigate }: { screen: TabletScreen; onNavigate: (s: TabletScreen) => void }) {
  const activeTab = screen === "cart" || screen === "confirmation" ? "menu" : screen;
  return (
    <nav className="h-[56px] flex items-center border-t border-white/5 bg-[#0a0f2e] px-8">
      {navTabs.map((tab) => {
        const isActive = tab.name.toLowerCase() === activeTab;
        return (
          <button
            key={tab.name}
            onClick={tab.screen ? () => onNavigate(tab.screen!) : undefined}
            className={`flex-1 flex flex-col items-center justify-center gap-1 h-full rounded ${
              isActive ? "bg-[#323b62] border-b-2 border-[#e31837]" : ""
            }`}
          >
            <Image src={tab.icon} alt={tab.name} width={20} height={20} className={isActive ? "brightness-200" : "opacity-50"} />
            <span className={`text-[13px] leading-[1.3] ${isActive ? "text-white font-medium" : "text-[#788284]"}`}>{tab.name}</span>
          </button>
        );
      })}
    </nav>
  );
}

// --- Home Screen ---
function TabletHome({ onDrinkSelect, onMenuTab, isLandscape }: { onDrinkSelect: (d: string) => void; onMenuTab: () => void; isLandscape: boolean }) {
  return (
    <div className="flex flex-col gap-8 p-6 overflow-y-auto h-full">
      <h1 className="text-white text-[28px] font-medium leading-[1.3]">Welcome, Sophia!</h1>

      {/* Drink selection */}
      <div
        className="rounded-lg p-5"
        style={{ backgroundImage: "linear-gradient(115deg, rgb(42, 58, 113) 0%, rgb(62, 78, 132) 100%)" }}
      >
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-white text-[22px] font-medium leading-[1.3]">Select drink</span>
                <span className="bg-[#01af3d] text-white text-[12px] font-medium px-1.5 py-0.5 rounded">Free</span>
              </div>
              <span className="text-white/70 text-[14px] leading-[1.3]">We will deliver to your seat</span>
            </div>
            <button onClick={onMenuTab} className="flex items-center gap-1">
              <span className="text-white text-[14px] font-medium">Full menu</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="rotate-[-90deg]">
                <path d="M6 8L10 12L14 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-5 gap-3">
            {drinks.map((drink) => (
              <button
                key={drink.name}
                onClick={() => onDrinkSelect(drink.name)}
                className="bg-[#191c2f] border-2 border-transparent rounded flex flex-col items-center justify-center gap-2 py-4 px-3 hover:border-[#4a7ff7]/30 transition-colors"
              >
                <div className="w-[66px] h-[66px] flex items-center justify-center">
                  <Image src={drink.image} alt={drink.name} width={52} height={66} className="object-contain" />
                </div>
                <span className="text-white text-[15px] font-medium leading-[1.3]">{drink.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Trending */}
      <div className="flex flex-col gap-4">
        <h2 className="text-white text-[20px] font-medium leading-[1.3]">Trending on this flight</h2>
        <div className="flex gap-3">
          {trending.map((item) => (
            <div key={item.name} className="w-[160px]">
              <ItemCard name={item.name} price={item.price} image={item.image} size="md" />
            </div>
          ))}
        </div>
      </div>

      {/* More on board */}
      <div className="flex flex-col gap-4">
        <h2 className="text-white text-[20px] font-medium leading-[1.3]">More on board</h2>
        <div className="flex gap-3">
          {moreOnBoard.map((item) => (
            <button
              key={item.name}
              className="flex-1 border border-[#323b62] rounded flex flex-col items-center justify-center gap-2 p-4 hover:bg-[#323b62]/20 transition-colors"
            >
              <Image src={item.icon} alt={item.name} width={20} height={20} />
              <span className="text-white text-[15px] leading-[1.3]">{item.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Menu Screen ---
function TabletMenu({ selectedDrink, onViewCart, isLandscape }: { selectedDrink?: string; onViewCart: () => void; isLandscape: boolean }) {
  const hasCart = !!selectedDrink;
  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="flex flex-col gap-8 p-6 flex-1">
        {/* Timer banner */}
        <div
          className="rounded px-4 py-3"
          style={{ background: "linear-gradient(153deg, rgb(42, 58, 113) 0%, rgb(62, 78, 132) 100%)" }}
        >
          <div className="flex items-center gap-2">
            <Image src="/images/icon-clock.svg" alt="" width={16} height={16} />
            <span className="text-white text-[16px] font-medium leading-[1.3]">45m left to order</span>
          </div>
        </div>

        {/* Complimentary drinks — grid */}
        <div className="flex flex-col gap-4">
          <h2 className="text-white text-[20px] font-medium leading-[1.3]">Complimentary drink</h2>
          <div className={`grid ${isLandscape ? "grid-cols-5" : "grid-cols-4"} gap-3`}>
            {complimentaryDrinks.map((drink) => (
              <ItemCard key={drink.name} name={drink.name} price={drink.price} image={drink.image} />
            ))}
          </div>
        </div>

        {/* Beverages list */}
        <div className="flex flex-col gap-4">
          <h2 className="text-white text-[20px] font-medium leading-[1.3]">Beverages</h2>
          <div className={`grid ${isLandscape ? "grid-cols-2" : "grid-cols-1"} gap-4`}>
            {beverages.map((item, i) => (
              <div key={`${item.name}-${i}`} className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white text-[16px] font-medium leading-[1.3]">{item.name}</span>
                    {item.badge && <span className="bg-[#191c2f] text-white text-[12px] font-medium px-1.5 py-1 rounded leading-[1.2]">{item.badge}</span>}
                  </div>
                  <span className="text-[#788284] text-[16px] leading-[1.3]">{item.description}</span>
                  <span className="text-white text-[16px] leading-[1.3]">{item.price}</span>
                  {item.urgency && <span className="text-[#e31837] text-[12px] font-medium leading-[1.2]">{item.urgency}</span>}
                </div>
                <div className="flex-shrink-0 w-[100px] h-[100px] bg-[#191c2f] rounded relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image src={item.image} alt={item.name} width={66} height={66} className="object-contain" />
                  </div>
                  <button className="absolute bottom-2 right-2 w-6 h-6 rounded-full border border-[#788284] bg-[#191c2f] flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2V10M2 6H10" stroke="#788284" strokeWidth="1.5" strokeLinecap="round" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* View cart */}
      {hasCart && (
        <div className="p-6 pt-0">
          <button onClick={onViewCart} className="w-full bg-[#e31837] rounded p-4 flex items-center justify-between">
            <Image src="/images/icon-cart.svg" alt="Cart" width={24} height={24} />
            <span className="text-white text-[16px] font-bold leading-[1.3]">View cart</span>
            <div className="w-5 h-5 rounded-full bg-white/30 flex items-center justify-center">
              <span className="text-white text-[14px] font-medium">1</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}

// --- Cart Screen ---
function TabletCart({ selectedDrink, onBack, onPlaceOrder, isLandscape }: { selectedDrink: string; onBack: () => void; onPlaceOrder: () => void; isLandscape: boolean }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col gap-6 p-6 flex-1 overflow-y-auto">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="w-5 h-5 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 14L8 10L12 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <h1 className="text-white text-[20px] font-medium leading-[1.3]">Review order</h1>
        </div>

        <div className={isLandscape ? "grid grid-cols-2 gap-8" : "flex flex-col gap-6"}>
          {/* Left: order details */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-[#788284] text-[14px] leading-[1.3]">Delivers to</span>
                <span className="text-white text-[20px] font-medium leading-[1.3]">Seat 14A</span>
              </div>
              <button onClick={onBack} className="bg-[#323b62] h-[32px] px-3 rounded flex items-center">
                <span className="text-white text-[14px] font-medium">Add items</span>
              </button>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="w-[52px] h-[52px] flex items-center justify-center">
                  <Image src={`/images/${selectedDrink.toLowerCase()}.png`} alt={selectedDrink} width={52} height={52} className="object-contain" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-white text-[16px] font-medium">{selectedDrink}</span>
                  <span className="text-[#788284] text-[16px]">Free</span>
                </div>
              </div>
              <div className="bg-white/[0.08] h-[36px] rounded flex items-center gap-3 px-3">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7H11" stroke="white" strokeOpacity="0.6" strokeWidth="1.5" strokeLinecap="round" /></svg>
                <span className="text-white text-[16px] font-medium">1</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 3V11M3 7H11" stroke="white" strokeOpacity="0.6" strokeWidth="1.5" strokeLinecap="round" /></svg>
              </div>
            </div>

            <div className="h-px bg-white/10" />

            <div className="flex flex-col gap-3">
              <div className="flex justify-between"><span className="text-[#788284] text-[14px]">Subtotal</span><span className="text-[#788284] text-[14px]">Free</span></div>
              <div className="flex justify-between"><span className="text-white text-[16px] font-medium">Total</span><span className="text-white text-[16px]">Free</span></div>
            </div>
          </div>

          {/* Right: upsell */}
          <div className="flex flex-col gap-4">
            <h2 className="text-white text-[20px] font-medium">Complement your order</h2>
            <div className="flex gap-3">
              {trending.map((item) => (
                <div key={item.name} className="w-[160px]">
                  <ItemCard name={item.name} price={item.price} image={item.image} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 pt-0">
        <button onClick={onPlaceOrder} className="w-full bg-[#e31837] h-[56px] rounded flex items-center justify-center">
          <span className="text-white text-[16px] font-bold">Place order</span>
        </button>
      </div>
    </div>
  );
}

// --- Confirmation Screen ---
function TabletConfirmation({ selectedDrink, onBackHome, isLandscape }: { selectedDrink: string; onBackHome: () => void; isLandscape: boolean }) {
  const [step, setStep] = useState(0);
  const steps = [
    { label: "Preparing", icon: "/images/icon-status-preparing.svg" },
    { label: "On the way", icon: "/images/icon-status-ontheway.svg" },
    { label: "Delivered", icon: "/images/icon-status-delivered.svg" },
  ];
  const messages = [
    { title: "We're preparing your order", subtitle: "Delivers to seat 14A in 12 minutes" },
    { title: "Your order is on the way", subtitle: "Delivers to seat 14A in 5 minutes" },
    { title: "Enjoy your order", subtitle: "Delivered to your seat" },
  ];

  // Auto-advance
  useState(() => {
    const t1 = setTimeout(() => setStep(1), 3000);
    const t2 = setTimeout(() => setStep(2), 6000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  });

  const msg = messages[step];

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="flex flex-col gap-6 p-6 flex-1">
        <button onClick={onBackHome} className="w-5 h-5 flex items-center justify-center self-start">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 14L8 10L12 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>

        {/* Status card */}
        <div
          className={`rounded-lg p-6 ${isLandscape ? "mx-auto w-[600px]" : ""}`}
          style={{ backgroundImage: "linear-gradient(135deg, rgb(42, 58, 113) 0%, rgb(55, 70, 120) 50%, rgb(62, 78, 132) 100%)" }}
        >
          <div className="flex flex-col gap-2 items-center py-3">
            <span className="text-white text-[22px] font-medium">{msg.title}</span>
            <span className="text-white/70 text-[15px] text-center">{msg.subtitle}</span>
          </div>
          <div className="relative flex items-start justify-between px-8 pt-4">
            <div className="absolute top-[27px] left-[80px] right-[80px] h-[2px] bg-white/10 rounded-full" />
            <motion.div
              className="absolute top-[27px] left-[80px] h-[2px] rounded-full bg-[#e31837]"
              animate={{ width: step === 0 ? 0 : step === 1 ? "calc(50% - 40px)" : "calc(100% - 160px)" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            />
            {steps.map((s, i) => (
              <div key={s.label} className="flex flex-col items-center gap-3 relative z-10 w-[80px]">
                <motion.div
                  className="w-[46px] h-[46px] rounded-full flex items-center justify-center"
                  animate={{
                    backgroundColor: i <= step ? "#e31837" : "rgba(93,106,150,0.5)",
                  }}
                  style={{ boxShadow: i <= step ? "0 0 0 3px rgba(102,52,100,0.6)" : "none" }}
                >
                  <Image src={s.icon} alt="" width={16} height={16} className={i <= step ? "opacity-100" : "opacity-40"} />
                </motion.div>
                <span className={`text-[14px] font-medium ${i <= step ? "text-white" : "text-white/40"}`}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="h-px bg-white/10" />

        {/* Order summary */}
        <div className={isLandscape ? "mx-auto w-[600px]" : ""}>
          <div className="flex flex-col gap-6">
            <h2 className="text-white text-[20px] font-medium">Order summary</h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-[52px] h-[52px] flex items-center justify-center">
                  <Image src={`/images/${selectedDrink.toLowerCase()}.png`} alt={selectedDrink} width={52} height={52} className="object-contain" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-white text-[16px] font-medium">{selectedDrink}</span>
                  <span className="text-[#788284] text-[16px]">Quantity: 1</span>
                </div>
              </div>
              <span className="text-[#788284] text-[16px]">Free</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white text-[16px] font-medium">Total</span>
              <span className="text-white text-[16px]">Free</span>
            </div>
          </div>
        </div>
      </div>

      {step >= 1 && (
        <div className={`p-6 pt-0 ${isLandscape ? "mx-auto w-[600px]" : ""}`}>
          <button onClick={onBackHome} className="w-full bg-[#323b62] h-[56px] rounded flex items-center justify-center">
            <span className="text-white text-[16px] font-bold">Back to home</span>
          </button>
        </div>
      )}
    </div>
  );
}

// --- Main Tablet Prototype ---
export default function TabletPrototype() {
  const [orientation, setOrientation] = useState<Orientation>("portrait");
  const [screen, setScreen] = useState<TabletScreen>("home");
  const [selectedDrink, setSelectedDrink] = useState<string | undefined>(undefined);

  const isLandscape = orientation === "landscape";
  const width = isLandscape ? 1194 : 834;
  const height = isLandscape ? 834 : 1194;

  const navigate = (target: TabletScreen, drink?: string) => {
    if (drink) setSelectedDrink(drink);
    else if (target === "menu" && screen === "home") setSelectedDrink(undefined);
    setScreen(target);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Orientation switcher */}
      <div className="flex items-center gap-2 bg-[var(--surface)] rounded-lg p-1">
        <button
          onClick={() => setOrientation("portrait")}
          className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
            orientation === "portrait" ? "bg-white text-[var(--foreground)] shadow-sm" : "text-[var(--muted)]"
          }`}
        >
          Portrait
        </button>
        <button
          onClick={() => setOrientation("landscape")}
          className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
            orientation === "landscape" ? "bg-white text-[var(--foreground)] shadow-sm" : "text-[var(--muted)]"
          }`}
        >
          Landscape
        </button>
      </div>

      {/* Tablet frame */}
      <div
        className="bg-[#01061f] rounded-[16px] overflow-hidden font-[system-ui] relative transition-all duration-300"
        style={{ width, height, maxWidth: "calc(100vw - 48px)" }}
      >
        {/* Status bar */}
        <div className="flex items-center justify-between px-6 pt-[14px] pb-[10px]">
          <span className="text-white text-[15px] font-medium leading-[22px]">9:41</span>
          <div className="flex items-center gap-[7px]">
            <svg width="19" height="12" viewBox="0 0 19 12" fill="white">
              <rect x="0" y="3" width="3" height="9" rx="1" opacity="0.3" /><rect x="4.5" y="2" width="3" height="10" rx="1" opacity="0.3" />
              <rect x="9" y="1" width="3" height="11" rx="1" opacity="0.6" /><rect x="13.5" y="0" width="3" height="12" rx="1" />
            </svg>
            <svg width="17" height="12" viewBox="0 0 17 12" fill="white">
              <path d="M8.5 2.8C10.7 2.8 12.7 3.7 14.1 5.1L15.5 3.7C13.7 1.9 11.2 0.8 8.5 0.8C5.8 0.8 3.3 1.9 1.5 3.7L2.9 5.1C4.3 3.7 6.3 2.8 8.5 2.8ZM8.5 6.8C9.8 6.8 11 7.3 11.9 8.1L13.3 6.7C12 5.5 10.3 4.8 8.5 4.8C6.7 4.8 5 5.5 3.7 6.7L5.1 8.1C6 7.3 7.2 6.8 8.5 6.8ZM8.5 10.8C9.1 10.8 9.5 10.4 9.5 9.8C9.5 9.2 9.1 8.8 8.5 8.8C7.9 8.8 7.5 9.2 7.5 9.8C7.5 10.4 7.9 10.8 8.5 10.8Z" />
            </svg>
            <svg width="27" height="13" viewBox="0 0 27 13" fill="none">
              <rect x="0.5" y="0.5" width="22" height="12" rx="2" stroke="white" strokeOpacity="0.35" />
              <rect x="2" y="2" width="19" height="9" rx="1" fill="white" />
              <rect x="24" y="4" width="2" height="5" rx="1" fill="white" opacity="0.4" />
            </svg>
          </div>
        </div>

        {/* Content area */}
        <div className="flex" style={{ height: "calc(100% - 46px)" }}>
          {/* Side nav rail — landscape only */}
          {isLandscape && <NavRail screen={screen} onNavigate={navigate} />}

          {/* Main content */}
          <div className="flex-1 flex flex-col" style={{ height: "100%" }}>
            <div className="flex-1 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={screen}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  {screen === "home" && (
                    <TabletHome
                      onDrinkSelect={(d) => navigate("menu", d)}
                      onMenuTab={() => navigate("menu")}
                      isLandscape={isLandscape}
                    />
                  )}
                  {screen === "menu" && (
                    <TabletMenu
                      selectedDrink={selectedDrink}
                      onViewCart={() => navigate("cart")}
                      isLandscape={isLandscape}
                    />
                  )}
                  {screen === "cart" && (
                    <TabletCart
                      selectedDrink={selectedDrink || "Coffee"}
                      onBack={() => navigate("menu")}
                      onPlaceOrder={() => navigate("confirmation")}
                      isLandscape={isLandscape}
                    />
                  )}
                  {screen === "confirmation" && (
                    <TabletConfirmation
                      selectedDrink={selectedDrink || "Coffee"}
                      onBackHome={() => navigate("home")}
                      isLandscape={isLandscape}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom tab bar — portrait only, hidden on cart/confirmation */}
            {!isLandscape && screen !== "cart" && screen !== "confirmation" && (
              <BottomTabBar screen={screen} onNavigate={navigate} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
