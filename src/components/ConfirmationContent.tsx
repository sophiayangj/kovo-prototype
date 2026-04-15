"use client";

import Image from "next/image";
import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const upsellItems = [
  { name: "Red Wine", price: "$9", image: "/images/red-wine.png" },
  { name: "Beer", price: "$9", image: "/images/beer.png" },
  { name: "Snack Mix", price: "$9", image: "/images/snack-mix.png" },
];

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.03, delayChildren: 0.05 } },
};
const fadeUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

type Step = 0 | 1 | 2;

const steps = [
  { label: "Preparing", icon: "/images/icon-status-preparing.svg" },
  { label: "On the way", icon: "/images/icon-status-ontheway.svg" },
  { label: "Delivered", icon: "/images/icon-status-delivered.svg" },
];

const statusMessages: Record<Step, { title: string; subtitle: string }> = {
  0: { title: "We're preparing your order", subtitle: "Delivers to seat 14A in 12 minutes" },
  1: { title: "Your order is on the way", subtitle: "Delivers to seat 14A in 5 minutes" },
  2: { title: "Enjoy your order", subtitle: "Delivers to seat 14A in 2 minutes" },
};

interface ConfirmationContentProps {
  selectedDrink: string;
  onBackHome: () => void;
}

export default function ConfirmationContent({ selectedDrink, onBackHome }: ConfirmationContentProps) {
  const [activeStep, setActiveStep] = useState<Step>(0);

  // Auto-advance through steps
  useEffect(() => {
    const t1 = setTimeout(() => setActiveStep(1), 3000);
    const t2 = setTimeout(() => setActiveStep(2), 6000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const editTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startEditTimer = useCallback(() => { if (editTimer.current) clearTimeout(editTimer.current); editTimer.current = setTimeout(() => setEditingItem(null), 2000); }, []);
  const openStepper = useCallback((key: string) => { setEditingItem(key); startEditTimer(); }, [startEditTimer]);
  const increment = (key: string) => { setQuantities((p) => ({ ...p, [key]: (p[key] || 0) + 1 })); startEditTimer(); };
  const decrement = (key: string) => { setQuantities((p) => { const n = { ...p }; if (n[key] > 1) n[key]--; else { delete n[key]; setEditingItem(null); if (editTimer.current) clearTimeout(editTimer.current); } return n; }); startEditTimer(); };

  // Countdown timer for "Add to order" window
  const [countdown, setCountdown] = useState(180); // 3 minutes
  useEffect(() => {
    if (activeStep > 0) return; // stop counting once past Preparing
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activeStep]);

  const msg = statusMessages[activeStep];
  const showUpsell = activeStep === 0 && countdown > 0;
  const countdownMin = Math.floor(countdown / 60);
  const countdownSec = countdown % 60;
  const countdownText = `${countdownMin}:${countdownSec.toString().padStart(2, "0")} left`;

  return (
    <div className="relative h-full bg-[#01061f] flex flex-col">
      <motion.div
        className="flex flex-col gap-6 px-4 py-6 overflow-y-auto flex-1 pb-40"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {/* Back arrow */}
        <motion.div variants={fadeUp}>
          <motion.button
            onClick={onBackHome}
            whileTap={{ scale: 0.9 }}
            className="w-5 h-5 flex items-center justify-center"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12 14L8 10L12 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.button>
        </motion.div>

        {/* Status card */}
        <motion.div
          variants={fadeUp}
          className="rounded-lg p-5 pb-6"
          style={{ backgroundImage: "linear-gradient(135deg, rgb(42, 58, 113) 0%, rgb(55, 70, 120) 50%, rgb(62, 78, 132) 100%)" }}
        >
          {/* Title */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-1.5 items-center pt-2 pb-5"
            >
              <span className="text-white text-[20px] font-medium leading-[1.3]">{msg.title}</span>
              <span className="text-white/70 text-[14px] leading-[1.4] text-center">{msg.subtitle}</span>
            </motion.div>
          </AnimatePresence>

          {/* Progress stepper */}
          <div className="relative flex items-start justify-between px-2">
            {/* Background track */}
            <div className="absolute top-[23px] left-[48px] right-[48px] h-[2px] bg-white/10 rounded-full" />
            {/* Active track fill */}
            <motion.div
              className="absolute top-[23px] left-[48px] h-[2px] rounded-full bg-[#e31837]"
              initial={{ width: 0 }}
              animate={{
                width: activeStep === 0 ? 0 : activeStep === 1 ? "calc(50% - 24px)" : "calc(100% - 96px)",
              }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            />

            {steps.map((step, i) => {
              const isActive = i <= activeStep;
              const isCurrent = i === activeStep;
              return (
                <div key={step.label} className="flex flex-col items-center gap-2.5 relative z-10" style={{ width: 80 }}>
                  {/* Outer glow ring for current step */}
                  <div className="relative w-[46px] h-[46px] flex items-center justify-center">
                    {isCurrent && (
                      <motion.div
                        className="absolute inset-[-3px] rounded-full"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ background: "radial-gradient(circle, rgba(227,24,55,0.25) 0%, transparent 70%)" }}
                        transition={{ duration: 0.4 }}
                      />
                    )}
                    <motion.div
                      className="w-[46px] h-[46px] rounded-full flex items-center justify-center"
                      animate={{
                        backgroundColor: isActive ? "#e31837" : "rgba(93,106,150,0.5)",
                        scale: isCurrent ? 1 : 0.95,
                      }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                      style={{
                        boxShadow: isActive
                          ? "0 0 0 3px rgba(102,52,100,0.6), 0 4px 12px rgba(227,24,55,0.3)"
                          : "none",
                      }}
                    >
                      <Image src={step.icon} alt="" width={16} height={16} className={isActive ? "opacity-100" : "opacity-40"} />
                    </motion.div>
                  </div>
                  <motion.span
                    className="text-[13px] font-medium leading-[1.3] text-center whitespace-nowrap"
                    animate={{
                      color: isActive ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.4)",
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {step.label}
                  </motion.span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Divider */}
        <div className="h-px bg-white/10" />

        {/* Order summary */}
        <motion.div variants={fadeUp} className="flex flex-col gap-6">
          <h2 className="text-white text-[20px] font-medium leading-[1.3]">Order summary</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-[52px] h-[52px] flex items-center justify-center">
                <Image
                  src={`/images/${selectedDrink.toLowerCase()}.png`}
                  alt={selectedDrink}
                  width={52}
                  height={52}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-white text-[16px] font-medium leading-[1.3]">{selectedDrink}</span>
                <span className="text-[#788284] text-[16px] leading-[1.3]">Quantity: 1</span>
              </div>
            </div>
            <span className="text-[#788284] text-[16px] leading-[1.3]">Free</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white text-[16px] font-medium leading-[1.3]">Total</span>
            <span className="text-white text-[16px] leading-[1.3]">Free</span>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="h-px bg-white/10" />

        {/* Add to order / upsell (hidden at delivered step) */}
        <AnimatePresence>
          {showUpsell && (
            <motion.div
              variants={fadeUp}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-col gap-4"
            >
              <div className="flex items-center gap-2">
                <Image src="/images/icon-clock.svg" alt="" width={16} height={16} />
                <span className="text-white text-[16px] font-medium leading-[1.3]">{countdownText} left to add items</span>
              </div>
              <div className="flex gap-3 overflow-x-auto">
                {upsellItems.map((item) => {
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
                          layoutId={`morph-confirm-${item.name}`}
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
          )}
        </AnimatePresence>
      </motion.div>

      {/* Back to home button — only at step 1+ */}
      <AnimatePresence>
        {activeStep >= 1 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="absolute bottom-[56px] left-4 right-4"
          >
            <motion.button
              onClick={onBackHome}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="w-full bg-[#323b62] border border-[#323b62] h-[56px] rounded flex items-center justify-center"
            >
              <span className="text-white text-[16px] font-bold leading-[1.3]">Back to home</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
