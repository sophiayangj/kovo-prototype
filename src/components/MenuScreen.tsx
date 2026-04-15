"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const complimentaryDrinks = [
  { name: "Water", price: "Free", image: "/images/water.png" },
  { name: "Coffee", price: "Free", image: "/images/coffee.png" },
  { name: "Tea", price: "Free", image: "/images/tea.png" },
  { name: "Juice", price: "Free", image: "/images/juice.png" },
  { name: "Cola", price: "Free", image: "/images/cola.png" },
];

const beverages = [
  {
    name: "Red Wine",
    description: "Cabernet Sauvignon",
    price: "$9",
    badge: "#1 Most popular",
    image: "/images/red-wine-thumb.png",
  },
  {
    name: "Craft Beer",
    description: "Local IPA",
    price: "$8",
    badge: null,
    image: "/images/beer-thumb.png",
  },
  {
    name: "Red Wine",
    description: "Sonoma Chardonnay",
    price: "$11",
    badge: "Only 2 left",
    image: "/images/white-wine-thumb.png",
  },
];

const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.06, delayChildren: 0.08 },
  },
};

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
};

interface MenuScreenProps {
  selectedDrink?: string;
  onBack: () => void;
  onViewCart?: () => void;
}

export default function MenuScreen({ selectedDrink = "Coffee", onBack, onViewCart }: MenuScreenProps) {
  const cartCount = selectedDrink ? 1 : 0;

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
          { name: "Home", icon: "/images/icon-home.svg", active: false },
          { name: "Menu", icon: "/images/icon-menu.svg", active: true },
          { name: "Movies", icon: "/images/icon-movies.svg", active: false },
          { name: "My Flight", icon: "/images/icon-flight.svg", active: false },
        ].map((tab) => (
          <motion.button
            key={tab.name}
            onClick={tab.name === "Home" ? onBack : undefined}
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
        className="flex flex-col gap-6 px-4 py-5 overflow-y-auto h-[calc(100%-66px-62px-80px)] pb-24"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {/* Time left banner */}
        <motion.div
          variants={fadeUp}
          className="rounded p-4 overflow-hidden"
          style={{
            backgroundImage: "linear-gradient(153deg, rgb(42, 58, 113) 0%, rgb(62, 78, 132) 100%)",
          }}
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
              const isSelected = drink.name === selectedDrink;
              return (
                <motion.div
                  key={drink.name}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="flex-shrink-0 w-[138px] bg-[#191c2f] rounded overflow-hidden"
                >
                  <div className="flex items-center justify-center px-[36px] py-3 bg-white/5">
                    <div className="w-[66px] h-[66px] flex items-center justify-center">
                      <Image src={drink.image} alt={drink.name} width={52} height={66} className="object-contain" />
                    </div>
                  </div>
                  <div className="relative flex flex-col gap-1 p-3">
                    <span className="text-white text-[16px] font-medium leading-[1.3]">{drink.name}</span>
                    <span className="text-[#788284] text-[16px] leading-[1.3]">{drink.price}</span>
                    {isSelected ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 20, delay: 0.2 }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-[0px_4px_4px_0px_rgba(19,30,53,0.7)]"
                      >
                        <span className="text-[#01061f] text-[14px] leading-[1.3]">1</span>
                      </motion.div>
                    ) : (
                      <motion.button
                        whileTap={{ scale: 1.2 }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border border-[#788284] flex items-center justify-center"
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M6 2V10M2 6H10" stroke="#788284" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </motion.button>
                    )}
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
            {beverages.map((item, i) => (
              <div key={`${item.name}-${i}`}>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-white text-[16px] font-medium leading-[1.3]">{item.name}</span>
                      {item.badge && (
                        <span className="bg-[#191c2f] text-white text-[12px] font-medium px-1.5 py-1 rounded leading-[1.2]">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-[#788284] text-[16px] leading-[1.3]">{item.description}</span>
                    <span className="text-white text-[16px] leading-[1.3]">{item.price}</span>
                  </div>
                  <div className="relative">
                    <div className="w-[84px] bg-[#191c2f] rounded overflow-hidden">
                      <div
                        className="flex items-center justify-center p-3"
                        style={{
                          backgroundImage: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
                        }}
                      >
                        <div className="w-[60px] h-[60px] flex items-center justify-center">
                          <Image src={item.image} alt={item.name} width={60} height={60} className="object-contain" />
                        </div>
                      </div>
                    </div>
                    <motion.button
                      whileTap={{ scale: 1.2 }}
                      className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full border border-[#788284] bg-[#01061f] flex items-center justify-center"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M6 2V10M2 6H10" stroke="#788284" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </motion.button>
                  </div>
                </div>
                {i < beverages.length - 1 && <div className="h-px bg-[#191c2f] mt-4" />}
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* View cart button */}
      {cartCount > 0 && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.3 }}
          className="absolute bottom-[70px] left-4 right-4"
        >
          <motion.button
            onClick={onViewCart}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="w-full bg-[#e31837] rounded p-4 flex items-center justify-between"
          >
            <Image src="/images/icon-cart.svg" alt="Cart" width={24} height={24} />
            <span className="text-white text-[16px] font-bold leading-[1.3]">View cart</span>
            <div className="w-5 h-5 rounded-full bg-white/30 flex items-center justify-center">
              <span className="text-white text-[14px] font-medium leading-[1.3]">{cartCount}</span>
            </div>
          </motion.button>
        </motion.div>
      )}

      {/* URL pill */}
      <div className="absolute bottom-[14px] left-1/2 -translate-x-1/2 bg-white/70 backdrop-blur-[12px] border border-white rounded-full h-[32px] px-[18px] flex items-center justify-center shadow-[0px_2px_40px_0px_rgba(0,0,0,0.1)]">
        <span className="text-black text-[12px] font-medium tracking-[0.12px] whitespace-nowrap leading-none">
          delta.com
        </span>
      </div>
    </div>
  );
}
