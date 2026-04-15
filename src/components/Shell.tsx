"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import HomeContent from "./HomeContent";
import MenuContent from "./MenuContent";
import CartContent from "./CartContent";
import ConfirmationContent from "./ConfirmationContent";
import TabletPrototype from "./TabletPrototype";
import DesignSystemPage from "./DesignSystemPage";

type Tab = "mobile" | "tablet" | "design-systems";
type Screen = "home" | "menu" | "cart" | "confirmation";

const shellTabs: { id: Tab; label: string }[] = [
  { id: "mobile", label: "Mobile Prototype" },
  { id: "tablet", label: "Tablet Prototype" },
  { id: "design-systems", label: "Design Systems" },
];

const screenOrder: Screen[] = ["home", "menu", "cart", "confirmation"];

const contentVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
  }),
};

const contentTransition = {
  x: { type: "spring" as const, stiffness: 500, damping: 38 },
  opacity: { duration: 0.15 },
};

// Bottom tab config per screen
const bottomTabs = [
  { name: "Home", icon: "/images/icon-home.svg", screen: "home" as Screen },
  { name: "Menu", icon: "/images/icon-menu.svg", screen: "menu" as Screen },
  { name: "Movies", icon: "/images/icon-movies.svg", screen: null },
  { name: "My Flight", icon: "/images/icon-flight.svg", screen: null },
];

export default function Shell() {
  const [activeTab, setActiveTab] = useState<Tab>("mobile");
  const [navOpen, setNavOpen] = useState(false);
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedDrink, setSelectedDrink] = useState<string | undefined>(undefined);
  const [cartItems, setCartItems] = useState<Array<{ name: string; price: string; image: string; qty: number }>>([]);
  const [hasActiveOrder, setHasActiveOrder] = useState(false);
  const [orderedDrink, setOrderedDrink] = useState<string>("Coffee");
  const direction = useRef(1);

  const navigate = (target: Screen, drink?: string) => {
    const from = screenOrder.indexOf(screen);
    const to = screenOrder.indexOf(target);
    direction.current = to >= from ? 1 : -1;
    // Only set selectedDrink if explicitly provided; clear it when navigating to menu without one
    if (drink !== undefined) {
      setSelectedDrink(drink);
    } else if (target === "menu" && screen === "home") {
      setSelectedDrink(undefined);
    }
    setScreen(target);
  };

  // Which bottom tab is active
  const activeBottomTab = screen === "cart" ? "menu" : screen;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Shell Header — menu icon with dropdown */}
      <header className="absolute top-0 left-0 z-30 flex items-center gap-3 px-4 h-12">
        <div className="relative">
          <button
            onClick={() => setNavOpen(!navOpen)}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[var(--surface)] transition-colors"
            aria-label="Open navigation"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="3" y1="5" x2="17" y2="5" />
              <line x1="3" y1="10" x2="17" y2="10" />
              <line x1="3" y1="15" x2="17" y2="15" />
            </svg>
          </button>

          {/* Dropdown */}
          <AnimatePresence>
            {navOpen && (
              <>
                <motion.div
                  className="fixed inset-0 z-40"
                  onClick={() => setNavOpen(false)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 mt-1 z-50 bg-white rounded-lg shadow-lg border border-[var(--border)] py-1 min-w-[180px]"
                >
                  {shellTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => { setActiveTab(tab.id); setNavOpen(false); }}
                      className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                        activeTab === tab.id
                          ? "bg-[var(--surface)] font-medium text-[var(--foreground)]"
                          : "text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        {activeTab === "mobile" && (
          <div className="relative w-[393px] h-[852px] bg-[#01061f] rounded-[12px] overflow-hidden font-[system-ui]">
            {/* === STATIC: Status Bar === */}
            <div className="relative z-20 flex items-center justify-between px-6 pt-[21px] pb-[19px]">
              <span className="text-white text-[17px] font-medium leading-[22px]">9:41</span>
              <div className="flex items-center gap-[7px]">
                <svg width="19" height="12" viewBox="0 0 19 12" fill="white">
                  <rect x="0" y="3" width="3" height="9" rx="1" opacity="0.3" />
                  <rect x="4.5" y="2" width="3" height="10" rx="1" opacity="0.3" />
                  <rect x="9" y="1" width="3" height="11" rx="1" opacity="0.6" />
                  <rect x="13.5" y="0" width="3" height="12" rx="1" />
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

            {/* === STATIC: Bottom Tab Nav (hidden on cart/confirmation) === */}
            {screen !== "cart" && screen !== "confirmation" && (
              <nav className="relative z-20 flex items-center h-[66px] px-4">
                {bottomTabs.map((tab) => {
                  const isActive = tab.name.toLowerCase() === activeBottomTab;
                  return (
                    <motion.button
                      key={tab.name}
                      onClick={tab.screen ? () => navigate(tab.screen!) : undefined}
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className={`flex-1 flex flex-col items-center justify-center gap-1 h-full rounded ${
                        isActive ? "bg-[#323b62] border-b-2 border-[#e31837]" : ""
                      }`}
                    >
                      <Image
                        src={tab.icon}
                        alt={tab.name}
                        width={20}
                        height={20}
                        className={isActive ? "brightness-200" : "opacity-50"}
                      />
                      <span className={`text-[14px] leading-[1.3] ${isActive ? "text-white font-medium" : "text-[#788284]"}`}>
                        {tab.name}
                      </span>
                    </motion.button>
                  );
                })}
              </nav>
            )}

            {/* === ANIMATED: Screen Content === */}
            <div className="relative flex-1 overflow-hidden" style={{ height: (screen === "cart" || screen === "confirmation") ? "calc(100% - 62px)" : "calc(100% - 62px - 66px)" }}>
              <AnimatePresence initial={false} custom={direction.current} mode="popLayout">
                <motion.div
                  key={screen}
                  custom={direction.current}
                  variants={contentVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={contentTransition}
                  className="absolute inset-0"
                >
                  {screen === "home" && (
                    <HomeContent
                      onDrinkSelect={(drink) => navigate("menu", drink)}
                      onMenuTab={() => navigate("menu")}
                      onViewCart={(items) => {
                        setCartItems(items);
                        navigate("cart");
                      }}
                      hasActiveOrder={hasActiveOrder}
                      orderedDrink={orderedDrink}
                    />
                  )}
                  {screen === "menu" && (
                    <MenuContent
                      selectedDrink={selectedDrink}
                      onViewCart={(items) => {
                        setCartItems(items);
                        navigate("cart");
                      }}
                    />
                  )}
                  {screen === "cart" && (
                    <CartContent
                      cartItems={cartItems}
                      onCartChange={setCartItems}
                      onBack={() => navigate("menu")}
                      onAddItems={() => navigate("menu")}
                      onPlaceOrder={() => {
                        setHasActiveOrder(true);
                        setOrderedDrink(cartItems[0]?.name || "Coffee");
                        navigate("confirmation");
                      }}
                    />
                  )}
                  {screen === "confirmation" && (
                    <ConfirmationContent
                      selectedDrink={selectedDrink || "Coffee"}
                      onBackHome={() => navigate("home")}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* === STATIC: URL pill === */}
            <div className="absolute bottom-[14px] left-1/2 -translate-x-1/2 z-30 bg-white/70 backdrop-blur-[12px] border border-white rounded-full h-[32px] px-[18px] flex items-center justify-center shadow-[0px_2px_40px_0px_rgba(0,0,0,0.1)]">
              <span className="text-black text-[12px] font-medium tracking-[0.12px] whitespace-nowrap leading-none">
                delta.com
              </span>
            </div>
          </div>
        )}

        {activeTab === "tablet" && <TabletPrototype />}

        {activeTab === "design-systems" && <DesignSystemPage />}
      </main>

    </div>
  );
}
