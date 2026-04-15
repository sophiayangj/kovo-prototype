"use client";

import Image from "next/image";
import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";

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

// Stagger children on mount
const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
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
    const next = Math.max(SHEET_COLLAPSED, Math.min(SHEET_EXPANDED, startHeight.current + dy));
    setSheetHeight(next);
  }, [dragging]);

  const onPointerUp = useCallback(() => {
    if (!dragging) return;
    setDragging(false);
    const mid = (SHEET_COLLAPSED + SHEET_EXPANDED) / 2;
    if (sheetHeight > mid) {
      setSheetHeight(SHEET_EXPANDED);
      setExpanded(true);
    } else {
      setSheetHeight(SHEET_COLLAPSED);
      setExpanded(false);
    }
  }, [dragging, sheetHeight]);

  const toggleSheet = () => {
    if (expanded) {
      setSheetHeight(SHEET_COLLAPSED);
      setExpanded(false);
    } else {
      setSheetHeight(SHEET_EXPANDED);
      setExpanded(true);
    }
  };

  return (
    <motion.div
      className="absolute bottom-0 left-0 right-0 z-10"
      animate={{ height: sheetHeight }}
      transition={dragging ? { duration: 0 } : { type: "spring", stiffness: 350, damping: 32 }}
    >
      <div className="bg-[#0f1847] rounded-t-[16px] shadow-[0px_-4px_32px_0px_rgba(1,6,31,0.6)] h-full flex flex-col">
        {/* Drag handle */}
        <div
          className="flex justify-center pt-2 pb-1 cursor-grab active:cursor-grabbing touch-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          <div className="w-9 h-[5px] rounded-full bg-white/20" />
        </div>

        {/* Collapsed content */}
        <div className="px-6 pt-2 pb-4 flex items-center justify-between">
          <div className="flex flex-col justify-between gap-2">
            <div className="relative h-[18px] w-[210px]">
              <div className="absolute left-0 top-[8px] w-[210px] h-[2px] bg-white/10 rounded-full" />
              <div className="absolute left-0 top-[8px] w-[50px] h-[2px] bg-[#4a7ff7] rounded-full" />
              <div className="absolute left-[40px] top-1/2 -translate-y-1/2">
                <Image src="/images/icon-plane-filled.svg" alt="Plane" width={20} height={20} />
              </div>
            </div>
            <div className="flex items-center justify-between w-[210px]">
              <span className="text-white text-[16px] font-medium">SFO</span>
              <span className="text-white text-[16px] font-medium">JFK</span>
            </div>
          </div>

          <motion.button
            onClick={toggleSheet}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2"
          >
            <div className="flex flex-col gap-1 text-right">
              <span className="text-[#788284] text-[14px] leading-[1.3]">Arrives in</span>
              <span className="text-white text-[16px] font-medium leading-[1.3]">2hr 15m</span>
            </div>
            <motion.svg
              width="20" height="20" viewBox="0 0 20 20" fill="none"
              animate={{ rotate: expanded ? 0 : 180 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <path d="M6 12L10 8L14 12" stroke="#e31837" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </motion.svg>
          </motion.button>
        </div>

        {/* Expanded content */}
        <motion.div
          className="overflow-hidden"
          animate={{ opacity: expanded ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
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

      {/* URL pill */}
      <div className="absolute bottom-[14px] left-1/2 -translate-x-1/2 bg-white/70 backdrop-blur-[12px] border border-white rounded-full px-[18px] py-[9px] shadow-[0px_2px_40px_0px_rgba(0,0,0,0.1)]">
        <span className="text-black text-[12px] font-medium tracking-[0.12px] whitespace-nowrap">
          delta.com
        </span>
      </div>
    </motion.div>
  );
}

interface HomeScreenProps {
  onDrinkSelect: (drink: string) => void;
  onMenuTab: () => void;
}

export default function HomeScreen({ onDrinkSelect, onMenuTab }: HomeScreenProps) {
  return (
    <div className="relative w-full h-full bg-[#01061f] rounded-[12px] overflow-hidden font-[system-ui]">
      {/* Status Bar */}
      <div className="flex items-center justify-between px-6 pt-[21px] pb-[19px]">
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

      {/* Bottom Tab Navigation */}
      <nav className="flex items-center h-[66px] px-4">
        {[
          { name: "Home", icon: "/images/icon-home.svg", active: true },
          { name: "Menu", icon: "/images/icon-menu.svg", active: false },
          { name: "Movies", icon: "/images/icon-movies.svg", active: false },
          { name: "My Flight", icon: "/images/icon-flight.svg", active: false },
        ].map((tab) => (
          <motion.button
            key={tab.name}
            onClick={tab.name === "Menu" ? onMenuTab : undefined}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className={`flex-1 flex flex-col items-center justify-center gap-1 h-full rounded ${
              tab.active ? "bg-[#323b62] border-b-2 border-[#e31837]" : ""
            }`}
          >
            <Image
              src={tab.icon}
              alt={tab.name}
              width={20}
              height={20}
              className={tab.active ? "brightness-200" : "opacity-50"}
            />
            <span className={`text-[14px] leading-[1.3] ${tab.active ? "text-white font-medium" : "text-[#788284]"}`}>
              {tab.name}
            </span>
          </motion.button>
        ))}
      </nav>

      {/* Scrollable Content */}
      <motion.div
        className="flex flex-col gap-6 px-4 py-5 overflow-y-auto h-[calc(100%-66px-62px-133px)]"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {/* Welcome */}
        <motion.h1 variants={fadeUp} className="text-white text-[24px] font-medium leading-[1.3]">
          Welcome, Sophia!
        </motion.h1>

        {/* Select Drink Card */}
        <motion.div
          variants={fadeUp}
          className="rounded p-4 overflow-visible"
          style={{
            backgroundImage: "linear-gradient(115deg, rgb(42, 58, 113) 0%, rgb(62, 78, 132) 100%)",
          }}
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
              <motion.button
                onClick={onMenuTab}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1"
              >
                <span className="text-white text-[14px] font-medium">Menu</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="rotate-[-90deg]">
                  <path d="M6 8L10 12L14 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.button>
            </div>

            {/* Drink options */}
            <div className="overflow-x-auto -mx-4 px-4">
              <div className="flex gap-3">
                {drinks.map((drink) => (
                  <motion.button
                    key={drink.name}
                    onClick={() => onDrinkSelect(drink.name)}
                    whileTap={{ scale: 0.93 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
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

        {/* Trending on this flight */}
        <motion.div variants={fadeUp} className="flex flex-col gap-4">
          <h2 className="text-white text-[20px] font-medium leading-[1.3]">Trending on this flight</h2>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {trending.map((item) => (
              <motion.div
                key={item.name}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="flex-shrink-0 w-[138px] bg-[#191c2f] rounded overflow-hidden"
              >
                <div className="flex items-center justify-center px-[36px] py-3 bg-white/5">
                  <div className="w-[66px] h-[66px] flex items-center justify-center">
                    <Image src={item.image} alt={item.name} width={66} height={66} className="object-contain" />
                  </div>
                </div>
                <div className="relative flex flex-col gap-1 p-3">
                  <span className="text-white text-[16px] font-medium leading-[1.3]">{item.name}</span>
                  <span className="text-[#788284] text-[16px] leading-[1.3]">{item.price}</span>
                  <motion.button
                    whileTap={{ scale: 1.2 }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border border-[#788284] flex items-center justify-center"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M6 2V10M2 6H10" stroke="#788284" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* More on board */}
        <motion.div variants={fadeUp} className="flex flex-col gap-4">
          <h2 className="text-white text-[20px] font-medium leading-[1.3]">More on board</h2>
          <div className="flex gap-3">
            {moreOnBoard.map((item) => (
              <motion.button
                key={item.name}
                whileTap={{ scale: 0.93 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="flex-1 border border-[#323b62] rounded flex flex-col items-center justify-center gap-2 p-[17px] active:bg-[#323b62]/30"
              >
                <Image src={item.icon} alt={item.name} width={20} height={20} />
                <span className="text-white text-[16px] leading-[1.3]">{item.name}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Flight Status Bottom Sheet */}
      <FlightSheet />
    </div>
  );
}
