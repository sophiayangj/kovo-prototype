"use client";

import Image from "next/image";
import { useState, useRef, useCallback } from "react";
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
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } },
};

type CartItem = { name: string; price: string; image: string; qty: number };

interface CartContentProps {
  cartItems: CartItem[];
  onCartChange: (items: CartItem[]) => void;
  onBack: () => void;
  onAddItems: () => void;
  onPlaceOrder?: () => void;
}

type PaymentMethod = "apple-pay" | "card" | "miles" | "paypal" | null;

function PaymentSheet({ total, onPay, onClose }: { total: number; onPay: () => void; onClose: () => void }) {
  const [selected, setSelected] = useState<PaymentMethod>("apple-pay");
  const [cardExpanded, setCardExpanded] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  const methods: { id: PaymentMethod; label: string; sublabel?: string; icon: React.ReactNode }[] = [
    {
      id: "apple-pay",
      label: "Apple Pay",
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
          <path d="M14.5 3.5c-.8.9-2.1 1.6-3.3 1.5-.2-1.2.4-2.5 1.1-3.3C13.1.8 14.5.1 15.5 0c.2 1.3-.4 2.6-1 3.5zM15.5 4c-1.8-.1-3.4 1-4.2 1s-2.2-1-3.6-1C5.8 4.1 4 5.2 3 7c-2.1 3.6-.5 9 1.5 12 1 1.4 2.2 3 3.8 3 1.5-.1 2.1-1 3.9-1s2.3 1 3.9 1 2.6-1.5 3.6-2.9c.6-.8 1.1-1.7 1.4-2.6-3.5-1.4-3.2-6.5.3-8.4-1-1.2-2.4-2-4-2.1z" />
        </svg>
      ),
    },
    {
      id: "card",
      label: "Credit or debit card",
      sublabel: "Visa, Mastercard, Amex",
      icon: (
        <svg width="20" height="16" viewBox="0 0 20 16" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="1" width="18" height="14" rx="2" />
          <line x1="1" y1="6" x2="19" y2="6" />
        </svg>
      ),
    },
    {
      id: "miles",
      label: "Airline miles",
      sublabel: `${Math.ceil(total * 100)} miles needed`,
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.5 10L11 3.5V7C6 7 3 9 2 14C3.5 11.5 6 10.5 11 10.5V14L17.5 10Z" />
        </svg>
      ),
    },
    {
      id: "paypal",
      label: "PayPal",
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
          <path d="M15.4 4.2C14.8 3.4 13.6 3 12 3H7.5c-.4 0-.7.3-.8.6L5 14.4c0 .3.2.5.5.5h2.8l.7-4.3v.1c.1-.3.4-.6.8-.6h1.6c3.2 0 5.7-1.3 6.4-5 0-.1 0-.2.1-.3-.1 0-.1 0 0 0 .2-1.3 0-2.1-.5-2.6z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 z-20"
        onClick={onClose}
      />
      {/* Sheet */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 400, damping: 35 }}
        className="absolute bottom-0 left-0 right-0 z-30 bg-[#0f1847] rounded-t-[16px] max-h-[85%] overflow-y-auto"
      >
        {/* Handle */}
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-9 h-[5px] rounded-full bg-white/20" />
        </div>

        <div className="px-5 pb-8 flex flex-col gap-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-white text-[20px] font-medium">Payment</h2>
            <span className="text-white text-[20px] font-medium">${total}</span>
          </div>

          {/* Payment methods */}
          <div className="flex flex-col gap-2">
            {methods.map((method) => (
              <div key={method.id}>
                <button
                  onClick={() => {
                    setSelected(method.id);
                    setCardExpanded(method.id === "card");
                  }}
                  className={`w-full flex items-center gap-3 p-4 rounded-lg transition-colors ${
                    selected === method.id
                      ? "bg-[#323b62] border border-[#e31837]"
                      : "bg-[#191c2f] border border-transparent"
                  }`}
                >
                  <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 opacity-70">
                    {method.icon}
                  </div>
                  <div className="flex flex-col items-start gap-0.5">
                    <span className="text-white text-[15px] font-medium">{method.label}</span>
                    {method.sublabel && (
                      <span className="text-[#788284] text-[13px]">{method.sublabel}</span>
                    )}
                  </div>
                  {/* Radio */}
                  <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    selected === method.id ? "border-[#e31837]" : "border-[#788284]"
                  }`}>
                    {selected === method.id && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#e31837]" />
                    )}
                  </div>
                </button>

                {/* Card form — inline expand */}
                <AnimatePresence>
                  {method.id === "card" && selected === "card" && cardExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col gap-3 pt-3 px-1">
                        <input
                          type="text"
                          placeholder="Card number"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="bg-[#191c2f] border border-[#323b62] rounded-lg h-[44px] px-4 text-white text-[15px] placeholder-[#788284] outline-none focus:border-[#4a7ff7]"
                        />
                        <div className="flex gap-3">
                          <input
                            type="text"
                            placeholder="MM / YY"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="flex-1 bg-[#191c2f] border border-[#323b62] rounded-lg h-[44px] px-4 text-white text-[15px] placeholder-[#788284] outline-none focus:border-[#4a7ff7]"
                          />
                          <input
                            type="text"
                            placeholder="CVC"
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value)}
                            className="w-[100px] bg-[#191c2f] border border-[#323b62] rounded-lg h-[44px] px-4 text-white text-[15px] placeholder-[#788284] outline-none focus:border-[#4a7ff7]"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Secure note */}
          <div className="flex items-center justify-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#788284" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2.5" y="5" width="7" height="5.5" rx="1" />
              <path d="M4 5V3.5C4 2.1 5.1 1 6 1s2 1.1 2 2.5V5" />
            </svg>
            <span className="text-[#788284] text-[12px]">Secure and encrypted</span>
          </div>

          {/* Pay button */}
          <motion.button
            onClick={onPay}
            whileTap={{ scale: 0.97 }}
            className={`w-full h-[56px] rounded-lg flex items-center justify-center gap-2 ${
              selected === "apple-pay" ? "bg-white" : "bg-[#e31837]"
            }`}
          >
            {selected === "apple-pay" ? (
              <div className="flex items-center gap-1">
                <svg width="16" height="20" viewBox="0 0 16 20" fill="black">
                  <path d="M12.5 3.5c-.7.8-1.8 1.4-2.8 1.3-.1-1.1.4-2.2 1-3C11.3.9 12.5.3 13.4 0c.1 1.1-.3 2.2-.9 3.5zM13.4 4c-1.5-.1-2.8.9-3.5.9s-1.8-.8-3-.8C5.3 4.1 3.8 5 3 6.5 1.2 9.6 2.5 14 4.3 16.5c.8 1.2 1.8 2.5 3.2 2.5 1.3-.1 1.7-.8 3.2-.8s1.9.8 3.2.8 2.2-1.2 3-2.4c.5-.7.9-1.4 1.2-2.2-3-1.1-2.7-5.4.3-7-1-.9-2-1.6-3.3-1.8z" />
                </svg>
                <span className="text-black text-[16px] font-bold">Pay</span>
              </div>
            ) : (
              <span className="text-white text-[16px] font-bold">
                {selected === "miles" ? `Pay with ${Math.ceil(total * 100)} miles` : `Pay $${total}`}
              </span>
            )}
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}

export default function CartContent({ cartItems, onCartChange, onBack, onAddItems, onPlaceOrder }: CartContentProps) {
  const [showPayment, setShowPayment] = useState(false);

  const orderTotal = cartItems.reduce((sum, item) => {
    const num = parseFloat(item.price.replace("$", ""));
    return sum + (isNaN(num) ? 0 : num * item.qty);
  }, 0);
  const isFree = orderTotal === 0;
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const editTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startEditTimer = useCallback(() => { if (editTimer.current) clearTimeout(editTimer.current); editTimer.current = setTimeout(() => setEditingItem(null), 2000); }, []);
  const openStepper = useCallback((key: string) => { setEditingItem(key); startEditTimer(); }, [startEditTimer]);
  const increment = (key: string) => { setQuantities((p) => ({ ...p, [key]: (p[key] || 0) + 1 })); startEditTimer(); };
  const decrement = (key: string) => { setQuantities((p) => { const n = { ...p }; if (n[key] > 1) n[key]--; else { delete n[key]; setEditingItem(null); if (editTimer.current) clearTimeout(editTimer.current); } return n; }); startEditTimer(); };
  return (
    <div className="relative h-full bg-[#01061f] flex flex-col">
      <motion.div
        className="flex flex-col gap-6 px-4 py-6 overflow-y-auto flex-1 pb-52"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {/* Header */}
        <motion.div variants={fadeUp} className="flex items-center gap-2">
          <motion.button
            onClick={onBack}
            whileTap={{ scale: 0.9 }}
            className="w-5 h-5 flex items-center justify-center"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12 14L8 10L12 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.button>
          <h1 className="text-white text-[20px] font-medium leading-[1.3]">Review order</h1>
        </motion.div>

        {/* Delivery info */}
        <motion.div variants={fadeUp} className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-[#788284] text-[14px] leading-[1.3]">Delivers to</span>
            <span className="text-white text-[20px] font-medium leading-[1.3]">Seat 14A</span>
          </div>
          <motion.button
            onClick={onAddItems}
            whileTap={{ scale: 0.98 }}
            className="bg-[#323b62] h-[32px] px-3 rounded flex items-center"
          >
            <span className="text-white text-[14px] font-medium leading-[1.3]">Add items</span>
          </motion.button>
        </motion.div>

        {/* Cart items */}
        {cartItems.map((item, i) => (
          <motion.div key={`${item.name}-${i}`} variants={fadeUp} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="w-[52px] h-[52px] flex items-center justify-center">
                <Image src={item.image} alt={item.name} width={52} height={52} className="object-contain" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-white text-[16px] font-medium leading-[1.3]">{item.name}</span>
                <span className="text-[#788284] text-[16px] leading-[1.3]">{item.price}</span>
              </div>
            </div>
            <div className="bg-white/[0.08] h-[36px] rounded flex items-center gap-3 px-3">
              <motion.button
                whileTap={{ scale: 1.15 }}
                onClick={() => {
                  if (item.qty > 1) {
                    const updated = [...cartItems];
                    updated[i] = { ...item, qty: item.qty - 1 };
                    onCartChange(updated);
                  } else {
                    const updated = cartItems.filter((_, idx) => idx !== i);
                    onCartChange(updated);
                    if (updated.length === 0) onBack();
                  }
                }}
                className="w-5 h-5 flex items-center justify-center"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7H11" stroke="white" strokeOpacity="0.6" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </motion.button>
              <span className="text-white text-[16px] font-medium min-w-[16px] text-center">{item.qty}</span>
              <motion.button
                whileTap={{ scale: 1.15 }}
                onClick={() => {
                  const updated = [...cartItems];
                  updated[i] = { ...item, qty: item.qty + 1 };
                  onCartChange(updated);
                }}
                className="w-5 h-5 flex items-center justify-center"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 3V11M3 7H11" stroke="white" strokeOpacity="0.6" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        ))}

        {/* Divider */}
        <div className="h-px bg-white/10" />

        {/* Complement your order */}
        <motion.div variants={fadeUp} className="flex flex-col gap-4">
          <h2 className="text-white text-[20px] font-medium leading-[1.3]">Complement your order</h2>
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
                      layoutId={`morph-cart-${item.name}`}
                      onClick={() => {
                        if (qty === 0) increment(item.name);
                        else if (!isEditing) openStepper(item.name);
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
      </motion.div>

      {/* Order summary — fixed bottom */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 30, delay: 0.25 }}
        className="absolute bottom-[56px] left-4 right-4 flex flex-col gap-6"
      >
        <div className="h-px bg-white/10" />
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[#788284] text-[14px] leading-[1.3]">Subtotal</span>
            <span className="text-[#788284] text-[14px] leading-[1.3]">
              {(() => {
                const total = cartItems.reduce((sum, item) => {
                  const num = parseFloat(item.price.replace("$", ""));
                  return sum + (isNaN(num) ? 0 : num * item.qty);
                }, 0);
                return total === 0 ? "Free" : `$${total}`;
              })()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white text-[16px] font-medium leading-[1.3]">Total</span>
            <span className="text-white text-[16px] leading-[1.3]">
              {(() => {
                const total = cartItems.reduce((sum, item) => {
                  const num = parseFloat(item.price.replace("$", ""));
                  return sum + (isNaN(num) ? 0 : num * item.qty);
                }, 0);
                return total === 0 ? "Free" : `$${total}`;
              })()}
            </span>
          </div>
        </div>
        <motion.button
          onClick={() => isFree ? onPlaceOrder?.() : setShowPayment(true)}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="w-full bg-[#e31837] h-[56px] rounded flex items-center justify-center"
        >
          <span className="text-white text-[16px] font-bold leading-[1.3]">
            {isFree ? "Place order" : `Pay $${orderTotal}`}
          </span>
        </motion.button>
      </motion.div>

      {/* Payment sheet for paid orders */}
      <AnimatePresence>
        {showPayment && (
          <PaymentSheet
            total={orderTotal}
            onPay={() => { setShowPayment(false); onPlaceOrder?.(); }}
            onClose={() => setShowPayment(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
