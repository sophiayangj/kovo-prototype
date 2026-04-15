"use client";

import Image from "next/image";
import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const complimentaryDrinks = [
  { name: "Water", price: "Free", image: "/images/water.png" },
  { name: "Coffee", price: "Free", image: "/images/coffee.png" },
  { name: "Tea", price: "Free", image: "/images/tea.png" },
  { name: "Juice", price: "Free", image: "/images/juice.png" },
  { name: "Cola", price: "Free", image: "/images/cola.png" },
];

const beverages = [
  { name: "Red Wine", description: "Cabernet Sauvignon", price: "$9", badge: "#1 Most popular", urgency: null, image: "/images/red-wine-thumb.png" },
  { name: "Craft Beer", description: "Local IPA", price: "$8", badge: null, urgency: null, image: "/images/beer-thumb.png" },
  { name: "Red Wine", description: "Sonoma Chardonnay", price: "$11", badge: null, urgency: "Only 2 left", image: "/images/white-wine-thumb.png" },
];

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.03, delayChildren: 0.05 } },
};
const fadeUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } },
};

export type CartItem = { name: string; price: string; image: string; qty: number };

// All items lookup for building cart
const allItems: Record<string, { price: string; image: string }> = {};
complimentaryDrinks.forEach((d) => { allItems[d.name] = { price: d.price, image: d.image }; });
beverages.forEach((b, i) => { allItems[`bev-${b.name}-${i}`] = { price: b.price, image: b.image }; });

interface MenuContentProps {
  selectedDrink?: string;
  onViewCart?: (items: CartItem[]) => void;
}

export default function MenuContent({ selectedDrink, onViewCart }: MenuContentProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    if (selectedDrink) init[selectedDrink] = 1;
    return init;
  });
  const [editingDrink, setEditingDrink] = useState<string | null>(null);
  const editTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalItems = Object.values(quantities).reduce((sum, q) => sum + q, 0);

  const startEditTimer = useCallback(() => {
    if (editTimer.current) clearTimeout(editTimer.current);
    editTimer.current = setTimeout(() => setEditingDrink(null), 2000);
  }, []);

  const openStepper = useCallback((name: string) => {
    setEditingDrink(name);
    startEditTimer();
  }, [startEditTimer]);

  const increment = (name: string) => {
    setQuantities((prev) => ({ ...prev, [name]: (prev[name] || 0) + 1 }));
    startEditTimer();
  };
  const decrement = (name: string) => {
    setQuantities((prev) => {
      const next = { ...prev };
      if (next[name] && next[name] > 1) {
        next[name] = next[name] - 1;
      } else {
        delete next[name];
        setEditingDrink(null);
        if (editTimer.current) clearTimeout(editTimer.current);
        return next;
      }
      return next;
    });
    startEditTimer();
  };

  return (
    <div className="relative h-full bg-[#01061f]">
      <motion.div
        className="flex flex-col gap-6 px-4 py-5 overflow-y-auto h-full pb-36"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {/* Time left banner */}
        <motion.div
          variants={fadeUp}
          className="rounded-[4px] px-4 py-3"
          style={{ background: "linear-gradient(153deg, rgb(42, 58, 113) 0%, rgb(62, 78, 132) 100%)" }}
        >
          <div className="flex items-center gap-2">
            <Image src="/images/icon-clock.svg" alt="" width={16} height={16} />
            <span className="text-white text-[16px] font-medium leading-[1.3]">45m left to order</span>
          </div>
        </motion.div>

        {/* Complimentary drink section */}
        <motion.div variants={fadeUp} className="flex flex-col gap-4">
          <h2 className="text-white text-[20px] font-medium leading-[1.3]">Complimentary drink</h2>
          <div className="flex gap-3 overflow-x-auto">
            {complimentaryDrinks.map((drink) => {
              const qty = quantities[drink.name] || 0;
              const isEditing = editingDrink === drink.name;
              return (
                <motion.div
                  key={drink.name}
                  whileTap={isEditing ? undefined : { scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="flex-shrink-0 w-[138px] bg-[#191c2f] rounded overflow-hidden"
                >
                  <div className="flex items-center justify-center px-[36px] py-3 bg-white/5">
                    <div className="w-[66px] h-[66px] flex items-center justify-center">
                      <Image src={drink.image} alt={drink.name} width={52} height={66} className="object-contain" />
                    </div>
                  </div>
                  {/* Bottom section with morphing button */}
                  <div className="relative h-[66px] p-3 flex items-center">
                    {/* Text — fades out when stepper is open */}
                    <motion.div
                      className="flex flex-col gap-1"
                      animate={{ opacity: isEditing && qty > 0 ? 0 : 1 }}
                      transition={{ duration: 0.15 }}
                    >
                      <span className="text-white text-[16px] font-medium leading-[1.3]">{drink.name}</span>
                      <span className="text-[#788284] text-[16px] leading-[1.3]">{drink.price}</span>
                    </motion.div>

                    {/* Morphing button/stepper — shares layoutId for shape animation */}
                    <motion.div
                      layoutId={`morph-${drink.name}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (qty === 0) increment(drink.name);
                        else if (!isEditing) openStepper(drink.name);
                      }}
                      className={`ml-auto flex items-center justify-center flex-shrink-0 cursor-pointer ${
                        qty > 0 && isEditing
                          ? "bg-white/[0.08] rounded-[14px] h-[32px] px-3 gap-3"
                          : qty > 0
                          ? "w-6 h-6 rounded-full bg-white shadow-[0px_4px_4px_0px_rgba(19,30,53,0.7)]"
                          : "w-6 h-6 rounded-full border border-[#788284]"
                      }`}
                      transition={{ type: "spring", stiffness: 500, damping: 32 }}
                      style={{ position: qty > 0 && isEditing ? "absolute" : "relative", right: qty > 0 && isEditing ? 12 : undefined, left: qty > 0 && isEditing ? 12 : undefined }}
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        {qty > 0 && isEditing ? (
                          <motion.div
                            key="stepper-inner"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.1 }}
                            className="flex items-center justify-between w-full"
                          >
                            <motion.button whileTap={{ scale: 1.15 }} onClick={(e) => { e.stopPropagation(); decrement(drink.name); }} className="w-5 h-5 flex items-center justify-center">
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6H10" stroke="white" strokeOpacity="0.6" strokeWidth="1.5" strokeLinecap="round" /></svg>
                            </motion.button>
                            <span className="text-white text-[16px] font-medium leading-none min-w-[14px] text-center">{qty}</span>
                            <motion.button whileTap={{ scale: 1.15 }} onClick={(e) => { e.stopPropagation(); increment(drink.name); }} className="w-5 h-5 flex items-center justify-center">
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2V10M2 6H10" stroke="white" strokeOpacity="0.6" strokeWidth="1.5" strokeLinecap="round" /></svg>
                            </motion.button>
                          </motion.div>
                        ) : qty > 0 ? (
                          <motion.span
                            key="badge-inner"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.1 }}
                            className="text-[#01061f] text-[14px] leading-[1.3]"
                          >{qty}</motion.span>
                        ) : (
                          <motion.div
                            key="add-inner"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.1 }}
                          >
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

        {/* Beverages section */}
        <motion.div variants={fadeUp} className="flex flex-col gap-4">
          <h2 className="text-white text-[20px] font-medium leading-[1.3]">Beverages</h2>
          <div className="flex flex-col gap-4">
            {beverages.map((item, i) => {
              const bevKey = `bev-${item.name}-${i}`;
              const qty = quantities[bevKey] || 0;
              const isEditing = editingDrink === bevKey;
              return (
                <div key={bevKey}>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-white text-[16px] font-medium leading-[1.3]">{item.name}</span>
                        {item.badge && (
                          <span className="bg-[#191c2f] text-white text-[12px] font-medium px-1.5 py-1 rounded leading-[1.2]">{item.badge}</span>
                        )}
                      </div>
                      <span className="text-[#788284] text-[16px] leading-[1.3]">{item.description}</span>
                      <span className="text-white text-[16px] leading-[1.3]">{item.price}</span>
                      {item.urgency && (
                        <span className="text-[#e31837] text-[12px] font-medium leading-[1.2]">{item.urgency}</span>
                      )}
                    </div>
                    {/* Image card */}
                    <div className="relative flex-shrink-0 w-[100px] h-[110px]">
                      {/* Card background + image */}
                      <div className="absolute inset-0 bg-[#191c2f] rounded" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-[66px] h-[66px] flex items-center justify-center">
                          <Image src={item.image} alt={item.name} width={66} height={66} className="object-contain" />
                        </div>
                      </div>
                      {/* Morphing button — z-10 so stepper overlaps image */}
                      <motion.div
                        layoutId={`morph-bev-${bevKey}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (qty === 0) increment(bevKey);
                          else if (!isEditing) openStepper(bevKey);
                        }}
                        className={`absolute z-10 flex items-center justify-center cursor-pointer ${
                          qty > 0 && isEditing
                            ? "bottom-2 left-2 right-2 bg-[#252a45] rounded-full h-6 px-2"
                            : qty > 0
                            ? "bottom-2 right-2 w-6 h-6 rounded-full bg-white shadow-[0px_4px_4px_0px_rgba(19,30,53,0.7)]"
                            : "bottom-2 right-2 w-6 h-6 rounded-full border border-[#788284] bg-[#191c2f]"
                        }`}
                        transition={{ type: "spring", stiffness: 500, damping: 32 }}
                      >
                        <AnimatePresence mode="wait" initial={false}>
                          {qty > 0 && isEditing ? (
                            <motion.div key="s" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.1 }} className="flex items-center justify-between w-full">
                              <motion.button whileTap={{ scale: 1.15 }} onClick={(e) => { e.stopPropagation(); decrement(bevKey); }} className="w-4 h-4 flex items-center justify-center">
                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5H8" stroke="white" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" /></svg>
                              </motion.button>
                              <span className="text-white text-[13px] font-medium leading-none">{qty}</span>
                              <motion.button whileTap={{ scale: 1.15 }} onClick={(e) => { e.stopPropagation(); increment(bevKey); }} className="w-4 h-4 flex items-center justify-center">
                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 2V8M2 5H8" stroke="white" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" /></svg>
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
                  </div>
                  {i < beverages.length - 1 && <div className="h-px bg-[#191c2f] mt-4" />}
                </div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>

      {/* View cart button */}
      {totalItems > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30, delay: 0.3 }}
          className="absolute bottom-[56px] left-4 right-4"
        >
          <motion.button
            onClick={() => {
              const items: CartItem[] = [];
              Object.entries(quantities).forEach(([key, qty]) => {
                const info = allItems[key];
                if (info && qty > 0) {
                  const displayName = key.startsWith("bev-") ? key.replace(/^bev-/, "").replace(/-\d+$/, "") : key;
                  items.push({ name: displayName, price: info.price, image: info.image, qty });
                }
              });
              onViewCart?.(items);
            }}
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
    </div>
  );
}
