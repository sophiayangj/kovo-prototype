"use client";

import Image from "next/image";
import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STEPPER_TIMEOUT = 2000;

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

const moreOnBoard = [
  { name: "Movies", icon: "/images/icon-tv.svg" },
  { name: "Wifi", icon: "/images/icon-wifi.svg" },
  { name: "Flight Info", icon: "/images/icon-plane-outline.svg" },
];

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.03, delayChildren: 0.05 } },
};
const fadeUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const SHEET_COLLAPSED = 133;
const SHEET_EXPANDED = 420;

function FlightSheet() {
  const [expanded, setExpanded] = useState(false);
  const [sheetHeight, setSheetHeight] = useState(SHEET_COLLAPSED);
  const [dragging, setDragging] = useState(false);
  const startY = useRef(0);
  const startHeight = useRef(SHEET_COLLAPSED);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    setDragging(true);
    startY.current = e.clientY;
    startHeight.current = sheetHeight;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [sheetHeight]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging) return;
    const dy = startY.current - e.clientY;
    setSheetHeight(Math.max(SHEET_COLLAPSED, Math.min(SHEET_EXPANDED, startHeight.current + dy)));
  }, [dragging]);

  const onPointerUp = useCallback(() => {
    if (!dragging) return;
    setDragging(false);
    const mid = (SHEET_COLLAPSED + SHEET_EXPANDED) / 2;
    if (sheetHeight > mid) { setSheetHeight(SHEET_EXPANDED); setExpanded(true); }
    else { setSheetHeight(SHEET_COLLAPSED); setExpanded(false); }
  }, [dragging, sheetHeight]);

  const toggleSheet = () => {
    if (expanded) { setSheetHeight(SHEET_COLLAPSED); setExpanded(false); }
    else { setSheetHeight(SHEET_EXPANDED); setExpanded(true); }
  };

  return (
    <motion.div
      className="absolute bottom-0 left-0 right-0 z-10"
      animate={{ height: sheetHeight }}
      transition={dragging ? { duration: 0 } : { type: "spring", stiffness: 350, damping: 32 }}
    >
      <div className="bg-[#0f1847] rounded-t-[16px] shadow-[0px_-4px_32px_0px_rgba(1,6,31,0.6)] h-full flex flex-col">
        <div
          className="flex justify-center pt-2 pb-1 cursor-grab active:cursor-grabbing touch-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          <div className="w-9 h-[5px] rounded-full bg-white/20" />
        </div>
        <div className="px-6 pt-2 pb-4 flex items-center justify-between">
          <div className="flex flex-col justify-between gap-2">
            <div className="relative h-[18px] w-[210px]">
              <div className="absolute left-0 top-[8px] w-[210px] h-[2px] bg-white/10 rounded-full" />
              <div className="absolute left-0 top-[8px] w-[50px] h-[2px] bg-[#4a7ff7] rounded-full" />
              <div className="absolute left-[40px] top-1/2 -translate-y-1/2">
                <Image src="/images/icon-plane-filled.svg" alt="" width={20} height={20} />
              </div>
            </div>
            <div className="flex items-center justify-between w-[210px]">
              <span className="text-white text-[16px] font-medium">SFO</span>
              <span className="text-white text-[16px] font-medium">JFK</span>
            </div>
          </div>
          <motion.button onClick={toggleSheet} whileTap={{ scale: 0.98 }} className="flex items-center gap-2">
            <div className="flex flex-col gap-1 text-right">
              <span className="text-[#788284] text-[14px] leading-[1.3]">Arrives in</span>
              <span className="text-white text-[16px] font-medium leading-[1.3]">2hr 15m</span>
            </div>
            <motion.svg
              width="20" height="20" viewBox="0 0 20 20" fill="none"
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <path d="M6 12L10 8L14 12" stroke="#e31837" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </motion.svg>
          </motion.button>
        </div>
        <motion.div className="overflow-hidden" animate={{ opacity: expanded ? 1 : 0 }} transition={{ duration: 0.2 }}>
          <div className="px-6 pb-6 flex flex-col gap-5">
            <div className="h-px bg-white/10" />
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-[#788284] text-[13px] leading-[1.3]">Departure</span>
                <span className="text-white text-[15px] font-medium leading-[1.3]">10:30 AM</span>
                <span className="text-[#788284] text-[13px] leading-[1.3]">San Francisco (SFO)</span>
              </div>
              <div className="flex flex-col gap-1 text-right">
                <span className="text-[#788284] text-[13px] leading-[1.3]">Arrival</span>
                <span className="text-white text-[15px] font-medium leading-[1.3]">6:45 PM</span>
                <span className="text-[#788284] text-[13px] leading-[1.3]">New York (JFK)</span>
              </div>
            </div>
            <div className="h-px bg-white/10" />
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-[#788284] text-[13px] leading-[1.3]">Flight</span>
                <span className="text-white text-[15px] font-medium leading-[1.3]">DL 582</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[#788284] text-[13px] leading-[1.3]">Gate</span>
                <span className="text-white text-[15px] font-medium leading-[1.3]">B42</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[#788284] text-[13px] leading-[1.3]">Seat</span>
                <span className="text-white text-[15px] font-medium leading-[1.3]">14A</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

const orderSteps = [
  { label: "Preparing", icon: "/images/icon-status-preparing.svg" },
  { label: "On the way", icon: "/images/icon-status-ontheway.svg" },
  { label: "Delivered", icon: "/images/icon-status-delivered.svg" },
];

const orderMessages = [
  { title: "Your order is being prepared", subtitle: "Delivers to your seat in 12 minutes" },
  { title: "Your order is on the way", subtitle: "Delivers to your seat in 5 minutes" },
  { title: "Enjoy your order!", subtitle: "Delivered to your seat" },
];

function HomeOrderTracker() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 4000);
    const t2 = setTimeout(() => setStep(2), 8000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const msg = orderMessages[step];

  return (
    <motion.div
      variants={fadeUp}
      className="rounded-lg p-5 pb-6"
      style={{ backgroundImage: "linear-gradient(135deg, rgb(42, 58, 113) 0%, rgb(55, 70, 120) 50%, rgb(62, 78, 132) 100%)" }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col gap-1.5 items-center pt-1 pb-4"
        >
          <span className="text-white text-[18px] font-medium leading-[1.3]">{msg.title}</span>
          <span className="text-white/70 text-[14px] leading-[1.4] text-center">{msg.subtitle}</span>
        </motion.div>
      </AnimatePresence>

      <div className="relative flex items-start justify-between px-2">
        <div className="absolute top-[23px] left-[48px] right-[48px] h-[2px] bg-white/10 rounded-full" />
        <motion.div
          className="absolute top-[23px] left-[48px] h-[2px] rounded-full bg-[#e31837]"
          initial={{ width: 0 }}
          animate={{
            width: step === 0 ? 0 : step === 1 ? "calc(50% - 24px)" : "calc(100% - 96px)",
          }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        />
        {orderSteps.map((s, i) => {
          const isActive = i <= step;
          const isCurrent = i === step;
          return (
            <div key={s.label} className="flex flex-col items-center gap-2.5 relative z-10" style={{ width: 80 }}>
              <div className="relative w-[42px] h-[42px] flex items-center justify-center">
                {isCurrent && (
                  <motion.div
                    className="absolute inset-[-3px] rounded-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ background: "radial-gradient(circle, rgba(227,24,55,0.25) 0%, transparent 70%)" }}
                    transition={{ duration: 0.4 }}
                  />
                )}
                <motion.div
                  className="w-[42px] h-[42px] rounded-full flex items-center justify-center"
                  animate={{
                    backgroundColor: isActive ? "#e31837" : "rgba(93,106,150,0.5)",
                    scale: isCurrent ? 1 : 0.95,
                  }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                  style={{
                    boxShadow: isActive ? "0 0 0 3px rgba(102,52,100,0.6), 0 4px 12px rgba(227,24,55,0.3)" : "none",
                  }}
                >
                  <Image src={s.icon} alt="" width={14} height={14} className={isActive ? "opacity-100" : "opacity-40"} />
                </motion.div>
              </div>
              <motion.span
                className="text-[12px] font-medium leading-[1.3] text-center whitespace-nowrap"
                animate={{ color: isActive ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.4)" }}
                transition={{ duration: 0.3 }}
              >
                {s.label}
              </motion.span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

type CartItem = { name: string; price: string; image: string; qty: number };

interface HomeContentProps {
  onDrinkSelect: (drink: string) => void;
  onMenuTab: () => void;
  onViewCart?: (items: CartItem[]) => void;
  hasActiveOrder?: boolean;
  orderedDrink?: string;
}

export default function HomeContent({ onDrinkSelect, onMenuTab, onViewCart, hasActiveOrder, orderedDrink }: HomeContentProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const editTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startEditTimer = useCallback(() => {
    if (editTimer.current) clearTimeout(editTimer.current);
    editTimer.current = setTimeout(() => setEditingItem(null), STEPPER_TIMEOUT);
  }, []);

  const openStepper = useCallback((key: string) => {
    setEditingItem(key);
    startEditTimer();
  }, [startEditTimer]);

  const increment = (key: string) => {
    setQuantities((prev) => ({ ...prev, [key]: (prev[key] || 0) + 1 }));
    startEditTimer();
  };
  const decrement = (key: string) => {
    setQuantities((prev) => {
      const next = { ...prev };
      if (next[key] && next[key] > 1) next[key]--;
      else { delete next[key]; setEditingItem(null); if (editTimer.current) clearTimeout(editTimer.current); }
      return next;
    });
    startEditTimer();
  };

  const totalItems = Object.values(quantities).reduce((sum, q) => sum + q, 0);

  const buildCartItems = (): CartItem[] => {
    return Object.entries(quantities)
      .filter(([, qty]) => qty > 0)
      .map(([key, qty]) => {
        const t = trending.find((t) => t.name === key);
        return { name: key, price: t?.price || "Free", image: t?.image || "", qty };
      });
  };

  return (
    <div className="relative h-full bg-[#01061f]">
      <motion.div
        className={`flex flex-col gap-6 px-4 py-5 overflow-y-auto h-[calc(100%-133px)] ${totalItems > 0 ? "pb-24" : "pb-4"}`}
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.h1 variants={fadeUp} className="text-white text-[24px] font-medium leading-[1.3]">
          {hasActiveOrder ? "Welcome aboard, Sophia!" : "Welcome, Sophia!"}
        </motion.h1>

        {/* Order status tracker — shown after placing an order */}
        {hasActiveOrder && <HomeOrderTracker />}

        <motion.div
          variants={fadeUp}
          className="rounded p-4"
          style={{ backgroundImage: "linear-gradient(115deg, rgb(42, 58, 113) 0%, rgb(62, 78, 132) 100%)" }}
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-white text-[20px] font-medium leading-[1.3]">Select drink</span>
                  <span className="bg-[#01af3d] text-white text-[12px] font-medium px-1.5 py-0.5 rounded">Free</span>
                </div>
                <span className="text-white text-[14px] leading-[1.3]">We will deliver to your seat</span>
              </div>
              <motion.button onClick={onMenuTab} whileTap={{ scale: 0.98 }} className="flex items-center gap-1">
                <span className="text-white text-[14px] font-medium">Menu</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="rotate-[-90deg]">
                  <path d="M6 8L10 12L14 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.button>
            </div>
            <div className="overflow-x-auto -mx-4 px-4">
              <div className="flex gap-3">
                {drinks.map((drink) => (
                  <motion.button
                    key={drink.name}
                    onClick={() => onDrinkSelect(drink.name)}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="flex-shrink-0 w-[102px] bg-[#191c2f] border-2 border-transparent rounded flex flex-col items-center justify-center gap-1.5 py-3 px-[18px] active:border-[#4a7ff7]/40"
                  >
                    <div className="w-[66px] h-[66px] flex items-center justify-center">
                      <Image src={drink.image} alt={drink.name} width={52} height={66} className="object-contain" />
                    </div>
                    <span className="text-white text-[16px] font-medium leading-[1.3]">{drink.name}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="flex flex-col gap-4">
          <h2 className="text-white text-[20px] font-medium leading-[1.3]">Trending on this flight</h2>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {trending.map((item) => {
              const qty = quantities[item.name] || 0;
              const isEditing = editingItem === item.name;
              return (
                <motion.div
                  key={item.name}
                  whileTap={isEditing ? undefined : { scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="flex-shrink-0 w-[138px] bg-[#191c2f] rounded overflow-hidden"
                >
                  <div className="flex items-center justify-center px-[36px] py-3 bg-white/5">
                    <div className="w-[66px] h-[66px] flex items-center justify-center">
                      <Image src={item.image} alt={item.name} width={66} height={66} className="object-contain" />
                    </div>
                  </div>
                  {/* Bottom section with morphing button */}
                  <div className="relative h-[66px] p-3 flex items-center">
                    <motion.div
                      className="flex flex-col gap-1"
                      animate={{ opacity: isEditing && qty > 0 ? 0 : 1 }}
                      transition={{ duration: 0.15 }}
                    >
                      <span className="text-white text-[16px] font-medium leading-[1.3]">{item.name}</span>
                      <span className="text-[#788284] text-[16px] leading-[1.3]">{item.price}</span>
                    </motion.div>
                    <motion.div
                      layoutId={`morph-home-${item.name}`}
                      onClick={() => {
                        if (qty === 0) increment(item.name);
                        else if (!isEditing) openStepper(item.name);
                      }}
                      className={`ml-auto flex items-center justify-center flex-shrink-0 cursor-pointer ${
                        qty > 0 && isEditing
                          ? "bg-[#252a45] rounded h-9 px-3 gap-3"
                          : qty > 0
                          ? "w-6 h-6 rounded-full bg-white shadow-[0px_4px_4px_0px_rgba(19,30,53,0.7)]"
                          : "w-6 h-6 rounded-full border border-[#788284]"
                      }`}
                      transition={{ type: "spring", stiffness: 500, damping: 32 }}
                      style={{ position: qty > 0 && isEditing ? "absolute" : "relative", right: qty > 0 && isEditing ? 12 : undefined, left: qty > 0 && isEditing ? 12 : undefined }}
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        {qty > 0 && isEditing ? (
                          <motion.div key="s" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.1 }} className="flex items-center justify-between w-full">
                            <motion.button whileTap={{ scale: 1.15 }} onClick={(e) => { e.stopPropagation(); decrement(item.name); }} className="w-5 h-5 flex items-center justify-center">
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6H10" stroke="white" strokeOpacity="0.6" strokeWidth="1.5" strokeLinecap="round" /></svg>
                            </motion.button>
                            <span className="text-white text-[16px] font-medium leading-none min-w-[14px] text-center">{qty}</span>
                            <motion.button whileTap={{ scale: 1.15 }} onClick={(e) => { e.stopPropagation(); increment(item.name); }} className="w-5 h-5 flex items-center justify-center">
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2V10M2 6H10" stroke="white" strokeOpacity="0.6" strokeWidth="1.5" strokeLinecap="round" /></svg>
                            </motion.button>
                          </motion.div>
                        ) : qty > 0 ? (
                          <motion.span key="b" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.1 }} className="text-[#01061f] text-[14px] leading-[1.3]">{qty}</motion.span>
                        ) : (
                          <motion.div key="a" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.1 }}>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2V10M2 6H10" stroke="#788284" strokeWidth="1.5" strokeLinecap="round" /></svg>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="flex flex-col gap-4">
          <h2 className="text-white text-[20px] font-medium leading-[1.3]">More on board</h2>
          <div className="flex gap-3">
            {moreOnBoard.map((item) => (
              <motion.button
                key={item.name}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="flex-1 border border-[#323b62] rounded flex flex-col items-center justify-center gap-2 p-[17px] active:bg-[#323b62]/30"
              >
                <Image src={item.icon} alt={item.name} width={20} height={20} />
                <span className="text-white text-[16px] leading-[1.3]">{item.name}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Floating View Cart button */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="absolute bottom-[140px] left-4 right-4 z-10"
          >
            <motion.button
              onClick={() => onViewCart?.(buildCartItems())}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="w-full bg-[#e31837] rounded p-4 flex items-center justify-between"
            >
              <Image src="/images/icon-cart.svg" alt="Cart" width={24} height={24} />
              <span className="text-white text-[16px] font-bold leading-[1.3]">View cart</span>
              <div className="w-5 h-5 rounded-full bg-white/30 flex items-center justify-center">
                <span className="text-white text-[14px] font-medium leading-[1.3]">{totalItems}</span>
              </div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <FlightSheet />
    </div>
  );
}
