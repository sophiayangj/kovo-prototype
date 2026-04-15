"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ============================================================
// DESIGN TOKENS
// ============================================================

const colors = {
  bg: { primary: "#01061f", card: "#191c2f", button: "#323b62", stepper: "#252a45", navDark: "#0a0f2e", sheet: "#0f1847" },
  accent: { brand: "#e31837", blue: "#4a7ff7", green: "#01af3d" },
  text: { primary: "#ffffff", secondary: "#788284", inverse: "#01061f" },
  border: { default: "#323b62", subtle: "rgba(255,255,255,0.1)", input: "#788284" },
  surface: { overlay: "rgba(255,255,255,0.08)", glass: "rgba(255,255,255,0.05)", pillBg: "rgba(250,250,250,0.7)" },
};

const gradients = {
  card: "linear-gradient(115deg, rgb(42, 58, 113) 0%, rgb(62, 78, 132) 100%)",
  cardAlt: "linear-gradient(153deg, rgb(42, 58, 113) 0%, rgb(62, 78, 132) 100%)",
  statusCard: "linear-gradient(135deg, rgb(42, 58, 113) 0%, rgb(55, 70, 120) 50%, rgb(62, 78, 132) 100%)",
  thumbnail: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
};

// ============================================================
// SHARED UI
// ============================================================

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-[20px] font-semibold text-[var(--foreground)] mt-12 mb-1">{children}</h2>;
}
function SectionDesc({ children }: { children: React.ReactNode }) {
  return <p className="text-[14px] text-[var(--muted)] mb-6">{children}</p>;
}
function ComponentLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-[12px] font-mono text-[var(--muted)] uppercase tracking-wider">{children}</span>;
}
function ComponentRow({ label, children, dark = false }: { label: string; children: React.ReactNode; dark?: boolean }) {
  return (
    <div className="flex flex-col gap-2 mb-6">
      {!dark && <ComponentLabel>{label}</ComponentLabel>}
      {dark ? (
        <>
          <ComponentLabel>{label}</ComponentLabel>
          <div className="bg-[#01061f] rounded-lg p-6">
            <div className="flex items-end gap-4 overflow-x-auto">{children}</div>
          </div>
        </>
      ) : (
        <div className="flex items-end gap-4 overflow-x-auto">{children}</div>
      )}
    </div>
  );
}
function DarkStage({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-[#01061f] rounded-lg p-6 ${className}`}>
      {children}
    </div>
  );
}
function SpecTable({ rows }: { rows: [string, string][] }) {
  return (
    <table className="text-[13px] border-collapse w-full mb-6">
      <tbody>
        {rows.map(([prop, value], i) => (
          <tr key={i} className="border-b border-[var(--border)]">
            <td className="py-1.5 pr-4 font-mono text-[var(--muted)]">{prop}</td>
            <td className="py-1.5 text-[var(--foreground)]">{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ============================================================
// COMPONENT: Design System Page
// ============================================================

export default function DesignSystemPage() {
  return (
    <div className="max-w-[960px] mx-auto px-6 py-10 text-[var(--foreground)]">
      <h1 className="text-[28px] font-bold mb-1">Kovo Design System</h1>
      <p className="text-[14px] text-[var(--muted)] mb-2">In-flight entertainment prototype — component documentation for engineering handoff</p>
      <div className="h-px bg-[var(--border)] mt-4 mb-8" />

      {/* -------------------------------------------------------- */}
      {/* TOKENS */}
      {/* -------------------------------------------------------- */}
      <SectionTitle>Design Tokens</SectionTitle>
      <SectionDesc>Core values used across all components.</SectionDesc>

      <ComponentRow label="Colors — Background">
        <div className="flex gap-2 flex-wrap">
          {Object.entries(colors.bg).map(([name, value]) => (
            <div key={name} className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-lg border border-[var(--border)]" style={{ background: value }} />
              <span className="text-[11px] font-mono text-[var(--muted)]">{name}</span>
              <span className="text-[10px] font-mono text-[var(--muted)]">{value}</span>
            </div>
          ))}
        </div>
      </ComponentRow>

      <ComponentRow label="Colors — Accent">
        <div className="flex gap-2 flex-wrap">
          {Object.entries(colors.accent).map(([name, value]) => (
            <div key={name} className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-lg" style={{ background: value }} />
              <span className="text-[11px] font-mono text-[var(--muted)]">{name}</span>
              <span className="text-[10px] font-mono text-[var(--muted)]">{value}</span>
            </div>
          ))}
        </div>
      </ComponentRow>

      <ComponentRow label="Colors — Text">
        <div className="flex gap-2 flex-wrap">
          {Object.entries(colors.text).map(([name, value]) => (
            <div key={name} className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-lg border border-[var(--border)]" style={{ background: value }} />
              <span className="text-[11px] font-mono text-[var(--muted)]">{name}</span>
              <span className="text-[10px] font-mono text-[var(--muted)]">{value}</span>
            </div>
          ))}
        </div>
      </ComponentRow>

      <ComponentRow label="Gradients">
        <div className="flex gap-3 flex-wrap">
          {Object.entries(gradients).map(([name, value]) => (
            <div key={name} className="flex flex-col items-center gap-1">
              <div className="w-24 h-12 rounded-lg" style={{ background: value }} />
              <span className="text-[11px] font-mono text-[var(--muted)]">{name}</span>
            </div>
          ))}
        </div>
      </ComponentRow>

      <ComponentRow label="Typography Scale">
        <div className="flex flex-col gap-2">
          {[
            ["28px / Bold", "Page Title (tablet)"],
            ["24px / Medium", "Page Title (mobile)"],
            ["20px / Medium", "Section Header"],
            ["17px / Medium", "Status Bar Time"],
            ["16px / Medium", "Body Bold / Card Title / Price"],
            ["16px / Regular", "Body / Description"],
            ["14px / Medium", "Label / Subtitle"],
            ["14px / Regular", "Secondary Label"],
            ["13px / Medium", "Stepper Count (compact)"],
            ["12px / Medium", "Badge / Tag / Urgency"],
          ].map(([spec, usage]) => (
            <div key={spec} className="flex items-baseline gap-3">
              <span className="text-[13px] font-mono text-[var(--foreground)] w-[160px]">{spec}</span>
              <span className="text-[13px] text-[var(--muted)]">{usage}</span>
            </div>
          ))}
        </div>
      </ComponentRow>

      <ComponentRow label="Spacing & Radius">
        <SpecTable rows={[
          ["Content padding", "16px (mobile), 24px (tablet)"],
          ["Section gap", "24px"],
          ["Card gap", "12px"],
          ["Inner gap (compact)", "4px"],
          ["Border radius / card", "4px"],
          ["Border radius / card-lg", "8-16px (sheets, status card)"],
          ["Border radius / pill", "full (9999px)"],
          ["Border radius / stepper", "14px (card), full (beverage)"],
        ]} />
      </ComponentRow>

      <ComponentRow label="Motion (overview)">
        <p className="text-[13px] text-[var(--muted)] leading-[1.6] max-w-[600px]">
          All interactive elements use spring physics (framer-motion). Tap feedback scales elements to 0.97–0.98.
          Screen transitions slide horizontally with opacity crossfade. The add-to-cart button morphs between
          circle and pill states via shared <code className="text-[12px] font-mono bg-[var(--surface)] px-1 rounded">layoutId</code>.
          Quantity steppers auto-dismiss after 2 seconds of inactivity. Respect <code className="text-[12px] font-mono bg-[var(--surface)] px-1 rounded">prefers-reduced-motion</code>.
        </p>
      </ComponentRow>

      <div className="h-px bg-[var(--border)] my-8" />

      {/* -------------------------------------------------------- */}
      {/* BUTTONS */}
      {/* -------------------------------------------------------- */}
      <SectionTitle>Buttons</SectionTitle>
      <SectionDesc>Primary actions, secondary actions, and compact controls.</SectionDesc>

      <ComponentRow dark label="Button / Primary (Place Order)">
          <button className="bg-[#e31837] h-[56px] w-[361px] rounded flex items-center justify-center">
            <span className="text-white text-[16px] font-bold">Place order</span>
          </button>
        </ComponentRow>

        <ComponentRow dark label="Button / Primary with icons (View Cart)">
          <button className="bg-[#e31837] rounded p-4 flex items-center justify-between w-[361px]">
            <Image src="/images/icon-cart.svg" alt="" width={24} height={24} />
            <span className="text-white text-[16px] font-bold">View cart</span>
            <div className="w-5 h-5 rounded-full bg-white/30 flex items-center justify-center">
              <span className="text-white text-[14px] font-medium">1</span>
            </div>
          </button>
        </ComponentRow>

        <ComponentRow dark label="Button / Secondary (Back to Home)">
          <button className="bg-[#323b62] border border-[#323b62] h-[56px] w-[361px] rounded flex items-center justify-center">
            <span className="text-white text-[16px] font-bold">Back to home</span>
          </button>
        </ComponentRow>

        <ComponentRow dark label="Button / Compact (Add Items)">
          <button className="bg-[#323b62] h-[32px] px-3 rounded flex items-center">
            <span className="text-white text-[14px] font-medium">Add items</span>
          </button>
        </ComponentRow>

        <ComponentRow dark label="Button / Text Link (Menu >)">
          <button className="flex items-center gap-1">
            <span className="text-white text-[14px] font-medium">Menu</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="rotate-[-90deg]">
              <path d="M6 8L10 12L14 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </ComponentRow>

      <div className="h-px bg-[var(--border)] my-8" />

      {/* -------------------------------------------------------- */}
      {/* QUANTITY CONTROL */}
      {/* -------------------------------------------------------- */}
      <SectionTitle>Quantity Control</SectionTitle>
      <SectionDesc>Used in cart to adjust item quantity. Trash icon removes the item. Plus icon increments.</SectionDesc>

      <ComponentRow dark label="Quantity / One">
        <div className="h-9 px-3 bg-white/10 rounded inline-flex justify-center items-center gap-3">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="overflow-hidden">
            <path d="M5.83 6.42H5.83" stroke="#788284" strokeWidth="1.17" strokeLinecap="round" />
            <path d="M8.17 6.42H8.17" stroke="#788284" strokeWidth="1.17" strokeLinecap="round" />
            <rect x="2.92" y="3.5" width="8.17" height="9.33" rx="0.58" stroke="#788284" strokeWidth="1.17" />
            <path d="M1.75 3.5H12.25" stroke="#788284" strokeWidth="1.17" strokeLinecap="round" />
            <path d="M4.67 1.17H9.33" stroke="#788284" strokeWidth="1.17" strokeLinecap="round" />
          </svg>
          <span className="text-white text-[16px] font-medium leading-[1.3] text-center">1</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="overflow-hidden">
            <path d="M2.92 7H11.08" stroke="white" strokeWidth="1.17" strokeLinecap="round" />
            <path d="M7 2.92V11.08" stroke="white" strokeWidth="1.17" strokeLinecap="round" />
          </svg>
        </div>
      </ComponentRow>

      <ComponentRow dark label="Quantity / Multiple">
        <div className="h-9 px-3 bg-white/10 rounded inline-flex justify-center items-center gap-3">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="overflow-hidden">
            <path d="M2.92 7H11.08" stroke="#788284" strokeWidth="1.17" strokeLinecap="round" />
          </svg>
          <span className="text-white text-[16px] font-medium leading-[1.3] text-center">3</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="overflow-hidden">
            <path d="M2.92 7H11.08" stroke="white" strokeWidth="1.17" strokeLinecap="round" />
            <path d="M7 2.92V11.08" stroke="white" strokeWidth="1.17" strokeLinecap="round" />
          </svg>
        </div>
      </ComponentRow>

      <SpecTable rows={[
        ["Width", "Hug content (~85px)"],
        ["Height", "Fixed 36px"],
        ["Border radius", "4px"],
        ["Background", "rgba(255,255,255,0.10)"],
        ["Padding", "0 12px"],
        ["Gap", "12px"],
        ["Icon size", "14x14px"],
        ["Icon stroke width", "1.17px"],
        ["Count text", "16px medium, Helvetica Neue, white, leading-20px"],
        ["Left icon (qty=1)", "Trash outline, stroke #788284"],
        ["Left icon (qty>1)", "Minus, stroke #788284"],
        ["Right icon", "Plus, stroke white"],
      ]} />

      <div className="h-px bg-[var(--border)] my-4" />

      <SectionTitle>Add Button (Card)</SectionTitle>
      <SectionDesc>Circle button on product cards. Morphs between empty, badge, and inline stepper states. Auto-dismisses stepper after 2s.</SectionDesc>

      <ComponentRow dark label="State progression: Empty → Badge → Stepper">
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center gap-2 flex-shrink-0">
            <div className="w-6 h-6 rounded-full border border-[#788284] flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2V10M2 6H10" stroke="#788284" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </div>
            <span className="text-[11px] text-[#788284]">Empty</span>
          </div>
          <span className="text-[#788284] text-[11px]">→</span>
          <div className="flex flex-col items-center gap-2 flex-shrink-0">
            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-[0px_4px_4px_0px_rgba(19,30,53,0.7)]">
              <span className="text-[#01061f] text-[14px]">1</span>
            </div>
            <span className="text-[11px] text-[#788284]">Badge</span>
          </div>
          <span className="text-[#788284] text-[11px]">→</span>
          <div className="flex flex-col items-center gap-2 flex-shrink-0">
            <div className="h-9 px-3 bg-white/10 rounded inline-flex justify-center items-center gap-3">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5.83 6.42H5.83" stroke="#788284" strokeWidth="1.17" strokeLinecap="round" /><path d="M8.17 6.42H8.17" stroke="#788284" strokeWidth="1.17" strokeLinecap="round" /><rect x="2.92" y="3.5" width="8.17" height="9.33" rx="0.58" stroke="#788284" strokeWidth="1.17" /><path d="M1.75 3.5H12.25" stroke="#788284" strokeWidth="1.17" strokeLinecap="round" /><path d="M4.67 1.17H9.33" stroke="#788284" strokeWidth="1.17" strokeLinecap="round" /></svg>
              <span className="text-white text-[16px] font-medium">1</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.92 7H11.08" stroke="white" strokeWidth="1.17" strokeLinecap="round" /><path d="M7 2.92V11.08" stroke="white" strokeWidth="1.17" strokeLinecap="round" /></svg>
            </div>
            <span className="text-[11px] text-[#788284]">Stepper</span>
          </div>
        </div>
      </ComponentRow>

      <SpecTable rows={[
        ["Empty", "24x24px, rounded-full, border 1px #788284, + icon 12px"],
        ["Badge", "24x24px, rounded-full, bg white, shadow, text 14px #01061f"],
        ["Stepper (card)", "h-32px, rounded-14px, bg rgba(255,255,255,0.08)"],
        ["Stepper (compact)", "h-24px, rounded-full, bg #252a45"],
        ["Auto-dismiss", "2s → returns to badge"],
        ["Decrement at 1", "Removes item → returns to empty"],
      ]} />

      <div className="h-px bg-[var(--border)] my-8" />

      {/* -------------------------------------------------------- */}
      {/* PRODUCT CARDS */}
      {/* -------------------------------------------------------- */}
      <SectionTitle>Product Cards</SectionTitle>
      <SectionDesc>Two variants sharing the same visual language. Horizontal scroll cards and list-row thumbnails.</SectionDesc>

      {/* --- Scroll Card (138px) — all states --- */}
      <ComponentRow dark label="ItemCard / Scroll — Full State Progression">
          <div className="flex gap-3">
            {/* 1. Default / Empty */}
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <div className="w-[138px] bg-[#191c2f] rounded overflow-hidden">
                <div className="flex items-center justify-center px-[36px] py-3 bg-white/5">
                  <div className="w-[66px] h-[66px] flex items-center justify-center">
                    <Image src="/images/coffee.png" alt="" width={52} height={66} className="object-contain" />
                  </div>
                </div>
                <div className="h-[66px] p-3 flex items-center">
                  <div className="flex flex-col gap-1">
                    <span className="text-white text-[16px] font-medium leading-[1.3]">Coffee</span>
                    <span className="text-[#788284] text-[16px] leading-[1.3]">Free</span>
                  </div>
                  <div className="ml-auto w-6 h-6 rounded-full border border-[#788284] flex items-center justify-center flex-shrink-0">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2V10M2 6H10" stroke="#788284" strokeWidth="1.5" strokeLinecap="round" /></svg>
                  </div>
                </div>
              </div>
              <span className="text-[11px] text-[var(--muted)]">Default</span>
            </div>

            {/* 2. Qty = 1 (badge) */}
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <div className="w-[138px] bg-[#191c2f] rounded overflow-hidden">
                <div className="flex items-center justify-center px-[36px] py-3 bg-white/5">
                  <div className="w-[66px] h-[66px] flex items-center justify-center">
                    <Image src="/images/coffee.png" alt="" width={52} height={66} className="object-contain" />
                  </div>
                </div>
                <div className="h-[66px] p-3 flex items-center">
                  <div className="flex flex-col gap-1">
                    <span className="text-white text-[16px] font-medium leading-[1.3]">Coffee</span>
                    <span className="text-[#788284] text-[16px] leading-[1.3]">Free</span>
                  </div>
                  <div className="ml-auto w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-[0px_4px_4px_0px_rgba(19,30,53,0.7)]">
                    <span className="text-[#01061f] text-[14px]">1</span>
                  </div>
                </div>
              </div>
              <span className="text-[11px] text-[var(--muted)]">Qty: 1 (badge)</span>
            </div>

            {/* 3. Editing stepper — uses Quantity Control component */}
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <div className="w-[138px] bg-[#191c2f] rounded overflow-hidden">
                <div className="flex items-center justify-center px-[36px] py-3 bg-white/5">
                  <div className="w-[66px] h-[66px] flex items-center justify-center">
                    <Image src="/images/coffee.png" alt="" width={52} height={66} className="object-contain" />
                  </div>
                </div>
                <div className="h-[66px] p-3 flex items-center">
                  <div className="h-9 px-3 bg-white/10 rounded flex-1 flex justify-between items-center">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5.83 6.42H5.83" stroke="#788284" strokeWidth="1.17" strokeLinecap="round" /><path d="M8.17 6.42H8.17" stroke="#788284" strokeWidth="1.17" strokeLinecap="round" /><rect x="2.92" y="3.5" width="8.17" height="9.33" rx="0.58" stroke="#788284" strokeWidth="1.17" /><path d="M1.75 3.5H12.25" stroke="#788284" strokeWidth="1.17" strokeLinecap="round" /><path d="M4.67 1.17H9.33" stroke="#788284" strokeWidth="1.17" strokeLinecap="round" /></svg>
                    <span className="text-white text-[16px] font-medium">1</span>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.92 7H11.08" stroke="white" strokeWidth="1.17" strokeLinecap="round" /><path d="M7 2.92V11.08" stroke="white" strokeWidth="1.17" strokeLinecap="round" /></svg>
                  </div>
                </div>
              </div>
              <span className="text-[11px] text-[var(--muted)]">Qty: 1 (editing)</span>
            </div>

            {/* 4. Qty = 3 (badge) */}
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <div className="w-[138px] bg-[#191c2f] rounded overflow-hidden">
                <div className="flex items-center justify-center px-[36px] py-3 bg-white/5">
                  <div className="w-[66px] h-[66px] flex items-center justify-center">
                    <Image src="/images/coffee.png" alt="" width={52} height={66} className="object-contain" />
                  </div>
                </div>
                <div className="h-[66px] p-3 flex items-center">
                  <div className="flex flex-col gap-1">
                    <span className="text-white text-[16px] font-medium leading-[1.3]">Coffee</span>
                    <span className="text-[#788284] text-[16px] leading-[1.3]">Free</span>
                  </div>
                  <div className="ml-auto w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-[0px_4px_4px_0px_rgba(19,30,53,0.7)]">
                    <span className="text-[#01061f] text-[14px]">3</span>
                  </div>
                </div>
              </div>
              <span className="text-[11px] text-[var(--muted)]">Qty: 3 (badge)</span>
            </div>
          </div>
        </ComponentRow>

        <SpecTable rows={[
          ["Width", "138px (scroll card), 102px (drink select)"],
          ["Background", "#191c2f"],
          ["Image area bg", "rgba(255,255,255,0.05)"],
          ["Image container", "66x66px"],
          ["Image padding", "px-36px py-12px"],
          ["Bottom section", "h-66px, p-12px, fixed height across all states"],
          ["Border radius", "4px"],
          ["Name text", "16px medium, white"],
          ["Price text", "16px regular, #788284"],
          ["Editing state", "Uses Quantity Control component (see above), fills bottom section width"],
        ]} />

        {/* --- Thumbnail Card (100x110) — all states --- */}
        <ComponentRow dark label="ItemCard / Thumbnail — Full State Progression">
          <div className="flex gap-4">
            {/* 1. Default */}
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <div className="relative w-[100px] h-[110px]">
                <div className="absolute inset-0 bg-[#191c2f] rounded" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image src="/images/red-wine-thumb.png" alt="" width={66} height={66} className="object-contain" />
                </div>
                <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full border border-[#788284] bg-[#191c2f] flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2V10M2 6H10" stroke="#788284" strokeWidth="1.5" strokeLinecap="round" /></svg>
                </div>
              </div>
              <span className="text-[11px] text-[var(--muted)]">Default</span>
            </div>

            {/* 2. Qty = 1 (badge) */}
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <div className="relative w-[100px] h-[110px]">
                <div className="absolute inset-0 bg-[#191c2f] rounded" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image src="/images/red-wine-thumb.png" alt="" width={66} height={66} className="object-contain" />
                </div>
                <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-[0px_4px_4px_0px_rgba(19,30,53,0.7)]">
                  <span className="text-[#01061f] text-[14px]">1</span>
                </div>
              </div>
              <span className="text-[11px] text-[var(--muted)]">Qty: 1 (badge)</span>
            </div>

            {/* 3. Editing stepper — uses Quantity Control (compact) */}
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <div className="relative w-[100px] h-[110px]">
                <div className="absolute inset-0 bg-[#191c2f] rounded" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image src="/images/red-wine-thumb.png" alt="" width={66} height={66} className="object-contain" />
                </div>
                <div className="absolute bottom-2 left-2 right-2 bg-white/10 rounded h-9 px-3 flex items-center justify-between">
                  <svg width="10" height="10" viewBox="0 0 14 14" fill="none"><path d="M5.83 6.42H5.83" stroke="#788284" strokeWidth="1.17" strokeLinecap="round" /><path d="M8.17 6.42H8.17" stroke="#788284" strokeWidth="1.17" strokeLinecap="round" /><rect x="2.92" y="3.5" width="8.17" height="9.33" rx="0.58" stroke="#788284" strokeWidth="1.17" /><path d="M1.75 3.5H12.25" stroke="#788284" strokeWidth="1.17" strokeLinecap="round" /><path d="M4.67 1.17H9.33" stroke="#788284" strokeWidth="1.17" strokeLinecap="round" /></svg>
                  <span className="text-white text-[13px] font-medium">1</span>
                  <svg width="10" height="10" viewBox="0 0 14 14" fill="none"><path d="M2.92 7H11.08" stroke="white" strokeWidth="1.17" strokeLinecap="round" /><path d="M7 2.92V11.08" stroke="white" strokeWidth="1.17" strokeLinecap="round" /></svg>
                </div>
              </div>
              <span className="text-[11px] text-[var(--muted)]">Qty: 1 (editing)</span>
            </div>

            {/* 4. Qty = 2 (badge) */}
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <div className="relative w-[100px] h-[110px]">
                <div className="absolute inset-0 bg-[#191c2f] rounded" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image src="/images/red-wine-thumb.png" alt="" width={66} height={66} className="object-contain" />
                </div>
                <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-[0px_4px_4px_0px_rgba(19,30,53,0.7)]">
                  <span className="text-[#01061f] text-[14px]">2</span>
                </div>
              </div>
              <span className="text-[11px] text-[var(--muted)]">Qty: 2 (badge)</span>
            </div>
          </div>
        </ComponentRow>

        <SpecTable rows={[
          ["Size", "100 x 110px"],
          ["Background", "#191c2f"],
          ["Border radius", "4px"],
          ["Image", "66x66px, centered vertically and horizontally"],
          ["+ button position", "bottom-8px right-8px (inside card)"],
          ["+ button size", "24x24px, rounded-full"],
          ["+ button border", "1px #788284, bg #191c2f"],
          ["Badge position", "Same as + button"],
          ["Badge bg", "white, shadow 0 4px 4px rgba(19,30,53,0.7)"],
          ["Stepper position", "bottom-8px left-8px right-8px"],
          ["Stepper height", "24px, rounded-full, bg #252a45"],
          ["Stepper count text", "13px medium, white"],
        ]} />

      <div className="h-px bg-[var(--border)] my-8" />

      {/* -------------------------------------------------------- */}
      {/* BEVERAGE LIST ITEM */}
      {/* -------------------------------------------------------- */}
      <SectionTitle>Beverage List Item</SectionTitle>
      <SectionDesc>Row layout for paid items with metadata badges and stock indicators.</SectionDesc>

      <ComponentRow dark label="State: Available + Popular">
          <div className="flex items-center justify-between w-[361px] flex-shrink-0">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-white text-[16px] font-medium">Red Wine</span>
                <span className="bg-[#191c2f] text-white text-[12px] font-medium px-1.5 py-1 rounded">#1 Most popular</span>
              </div>
              <span className="text-[#788284] text-[16px]">Cabernet Sauvignon</span>
              <span className="text-white text-[16px]">$9</span>
            </div>
            <div className="relative w-[100px] h-[110px] flex-shrink-0">
              <div className="absolute inset-0 bg-[#191c2f] rounded" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Image src="/images/red-wine-thumb.png" alt="" width={66} height={66} className="object-contain" />
              </div>
              <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full border border-[#788284] bg-[#191c2f] flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2V10M2 6H10" stroke="#788284" strokeWidth="1.5" strokeLinecap="round" /></svg>
              </div>
            </div>
          </div>
        </ComponentRow>

        <ComponentRow dark label="State: Low Stock">
          <div className="flex items-center justify-between w-[361px] flex-shrink-0">
            <div className="flex flex-col gap-1">
              <span className="text-white text-[16px] font-medium">Red Wine</span>
              <span className="text-[#788284] text-[16px]">Sonoma Chardonnay</span>
              <span className="text-white text-[16px]">$11</span>
              <span className="text-[#e31837] text-[12px] font-medium">Only 2 left</span>
            </div>
            <div className="relative w-[100px] h-[110px] flex-shrink-0">
              <div className="absolute inset-0 bg-[#191c2f] rounded" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Image src="/images/white-wine-thumb.png" alt="" width={66} height={66} className="object-contain" />
              </div>
              <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full border border-[#788284] bg-[#191c2f] flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2V10M2 6H10" stroke="#788284" strokeWidth="1.5" strokeLinecap="round" /></svg>
              </div>
            </div>
          </div>
        </ComponentRow>

        <SpecTable rows={[
          ["Divider", "h-px bg-[#191c2f] mt-4 between items"],
          ["Badge (popular)", "bg-[#191c2f] text-white 12px px-1.5 py-1 rounded"],
          ["Urgency text", "text-[#e31837] 12px font-medium"],
          ["Unavailable items", "Removed from menu silently — no sold-out state in menu"],
        ]} />

      <div className="h-px bg-[var(--border)] my-8" />

      {/* -------------------------------------------------------- */}
      {/* BADGES & TAGS */}
      {/* -------------------------------------------------------- */}
      <SectionTitle>Badges & Tags</SectionTitle>
      <SectionDesc>Inline metadata indicators.</SectionDesc>

      <ComponentRow dark label="All badge variants">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="bg-[#01af3d] text-white text-[12px] font-medium px-1.5 py-0.5 rounded">Free</span>
            <span className="bg-[#191c2f] text-white text-[12px] font-medium px-1.5 py-1 rounded">#1 Most popular</span>
            <span className="text-[#e31837] text-[12px] font-medium">Only 2 left</span>
            <span className="text-[#e31837] text-[12px] font-medium">Sold out</span>
            <div className="w-5 h-5 rounded-full bg-white/30 flex items-center justify-center">
              <span className="text-white text-[14px] font-medium">1</span>
            </div>
          </div>
        </ComponentRow>

      <div className="h-px bg-[var(--border)] my-8" />

      {/* -------------------------------------------------------- */}
      {/* NAVIGATION */}
      {/* -------------------------------------------------------- */}
      <SectionTitle>Navigation</SectionTitle>
      <SectionDesc>Bottom tab bar (mobile + tablet portrait) and side rail (tablet landscape).</SectionDesc>

      <ComponentRow dark label="Bottom Tab / Active">
          <div className="bg-[#323b62] border-b-2 border-[#e31837] flex flex-col items-center justify-center gap-1 h-[66px] w-[90px] rounded">
            <Image src="/images/icon-home.svg" alt="" width={20} height={20} className="brightness-200" />
            <span className="text-white text-[14px] font-medium">Home</span>
          </div>
        </ComponentRow>
        <ComponentRow dark label="Bottom Tab / Inactive">
          <div className="flex flex-col items-center justify-center gap-1 h-[66px] w-[90px]">
            <Image src="/images/icon-menu.svg" alt="" width={20} height={20} className="opacity-50" />
            <span className="text-[#788284] text-[14px]">Menu</span>
          </div>
        </ComponentRow>
        <ComponentRow dark label="Side Rail Tab / Active (tablet landscape)">
          <div className="bg-[#323b62] border-l-2 border-[#e31837] flex items-center gap-3 h-[66px] px-6 w-[200px] rounded">
            <Image src="/images/icon-home.svg" alt="" width={20} height={20} className="brightness-200" />
            <span className="text-white text-[16px] font-medium">Home</span>
          </div>
        </ComponentRow>
        <ComponentRow dark label="Side Rail Tab / Inactive">
          <div className="flex items-center gap-3 h-[66px] px-6 w-[200px]">
            <Image src="/images/icon-menu.svg" alt="" width={20} height={20} className="opacity-50" />
            <span className="text-[#788284] text-[16px]">Menu</span>
          </div>
        </ComponentRow>

      <div className="h-px bg-[var(--border)] my-8" />

      {/* -------------------------------------------------------- */}
      {/* BANNERS & CARDS */}
      {/* -------------------------------------------------------- */}
      <SectionTitle>Banners & Info Cards</SectionTitle>
      <SectionDesc>Gradient cards for announcements, timers, and drink selection.</SectionDesc>

      <ComponentRow dark label="Banner / Timer">
          <div className="rounded-[4px] px-4 py-3 w-[361px]" style={{ background: gradients.cardAlt }}>
            <div className="flex items-center gap-2">
              <Image src="/images/icon-clock.svg" alt="" width={16} height={16} />
              <span className="text-white text-[16px] font-medium">45m left to order</span>
            </div>
          </div>
        </ComponentRow>

        <ComponentRow dark label="Banner / Drink Selection (collapsed header)">
          <div className="rounded p-4 w-[361px]" style={{ background: gradients.card }}>
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-white text-[20px] font-medium">Select drink</span>
                  <span className="bg-[#01af3d] text-white text-[12px] font-medium px-1.5 py-0.5 rounded">Free</span>
                </div>
                <span className="text-white text-[14px]">We will deliver to your seat</span>
              </div>
              <button className="flex items-center gap-1">
                <span className="text-white text-[14px] font-medium">Menu</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="rotate-[-90deg]">
                  <path d="M6 8L10 12L14 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </ComponentRow>

      <div className="h-px bg-[var(--border)] my-8" />

      {/* -------------------------------------------------------- */}
      {/* ORDER STATUS TRACKER */}
      {/* -------------------------------------------------------- */}
      <SectionTitle>Order Status Tracker</SectionTitle>
      <SectionDesc>Three-step progress indicator. Auto-advances on confirmation screen. Also appears on home screen after order is placed.</SectionDesc>

      {/* Step circle states */}
      <ComponentRow dark label="Step Circle States">
        <div className="flex items-center gap-6">
          {/* Completed */}
          <div className="flex flex-col items-center gap-2 flex-shrink-0">
            <div className="w-[46px] h-[46px] rounded-full bg-[#e31837] flex items-center justify-center" style={{ border: "3px solid #663464" }}>
              <Image src="/images/icon-status-preparing.svg" alt="" width={16} height={16} />
            </div>
            <span className="text-[11px] text-[#788284]">Completed</span>
          </div>
          {/* Current */}
          <div className="flex flex-col items-center gap-2 flex-shrink-0">
            <div className="w-[46px] h-[46px] rounded-full flex items-center justify-center" style={{ backgroundColor: "#5d6a96", border: "3px solid #e31837" }}>
              <Image src="/images/icon-status-ontheway.svg" alt="" width={16} height={16} />
            </div>
            <span className="text-[11px] text-[#788284]">Current</span>
          </div>
          {/* Upcoming */}
          <div className="flex flex-col items-center gap-2 flex-shrink-0">
            <div className="w-[46px] h-[46px] rounded-full flex items-center justify-center" style={{ backgroundColor: "#5d6a96", border: "3px solid rgba(227,24,55,0)" }}>
              <Image src="/images/icon-status-delivered.svg" alt="" width={16} height={16} className="opacity-40" />
            </div>
            <span className="text-[11px] text-[#788284]">Upcoming</span>
          </div>
        </div>
      </ComponentRow>

      {/* Full tracker — matching Figma frame */}
      <ComponentRow dark label="Tracker / Step 1 Active (Figma reference)">
        <div className="flex items-start justify-between w-[329px] relative">
          {/* Track background */}
          <div className="absolute top-[22px] left-[36px] right-[36px] h-[2px] bg-[#5d6a96] rounded-full" />
          {/* Track fill — halfway */}
          <div className="absolute top-[22px] left-[36px] h-[2px] bg-[#e31837] rounded-full" style={{ width: "calc(50% - 18px)" }} />

          {/* Preparing — completed */}
          <div className="flex flex-col items-center gap-3 relative z-10 w-[72px]">
            <div className="w-[46px] h-[46px] rounded-full bg-[#e31837] flex items-center justify-center" style={{ border: "3px solid #663464" }}>
              <Image src="/images/icon-status-preparing.svg" alt="" width={16} height={16} />
            </div>
            <span className="text-white text-[16px] font-medium text-center">Preparing</span>
          </div>
          {/* On the way — current */}
          <div className="flex flex-col items-center gap-3 relative z-10 w-[72px]">
            <div className="w-[46px] h-[46px] rounded-full flex items-center justify-center" style={{ backgroundColor: "#5d6a96", border: "3px solid #e31837" }}>
              <Image src="/images/icon-status-ontheway.svg" alt="" width={16} height={16} />
            </div>
            <span className="text-white text-[16px] font-medium text-center">On the way</span>
          </div>
          {/* Delivered — upcoming */}
          <div className="flex flex-col items-center gap-3 relative z-10 w-[72px]">
            <div className="w-[46px] h-[46px] rounded-full flex items-center justify-center" style={{ backgroundColor: "#5d6a96", border: "3px solid rgba(227,24,55,0)" }}>
              <Image src="/images/icon-status-delivered.svg" alt="" width={16} height={16} className="opacity-40" />
            </div>
            <span className="text-white/40 text-[16px] font-medium text-center">Delivered</span>
          </div>
        </div>
      </ComponentRow>

        <SpecTable rows={[
          ["Circle size", "46px"],
          ["Completed circle", "bg #e31837, border 3px #663464"],
          ["Current circle", "bg #5d6a96, border 3px #e31837"],
          ["Upcoming circle", "bg #5d6a96, border 3px transparent"],
          ["Icon size", "16px"],
          ["Icon opacity (upcoming)", "40%"],
          ["Label text", "16px medium"],
          ["Label color (active)", "white"],
          ["Label color (upcoming)", "rgba(255,255,255,0.4)"],
          ["Track height", "2px"],
          ["Track bg (inactive)", "#5d6a96"],
          ["Track bg (active)", "#e31837"],
          ["Track position", "Centered on circles, left-36px to right-36px"],
          ["Steps", "Preparing → On the way → Delivered"],
          ["Step column width", "72px, evenly distributed"],
        ]} />

      <div className="h-px bg-[var(--border)] my-8" />

      {/* -------------------------------------------------------- */}
      {/* CART ITEM */}
      {/* -------------------------------------------------------- */}
      <SectionTitle>Cart Item</SectionTitle>
      <SectionDesc>Displays selected item with quantity controls in the review order screen. Sold out state appears when an item becomes unavailable after being added to cart.</SectionDesc>

      <ComponentRow dark label="Cart Item / Default">
          <div className="flex items-center justify-between w-[361px] flex-shrink-0 py-3">
            <div className="flex items-center gap-3">
              <div className="w-[52px] h-[52px] flex items-center justify-center">
                <Image src="/images/coffee.png" alt="" width={52} height={52} className="object-contain" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-white text-[16px] font-medium">Coffee</span>
                <span className="text-[#788284] text-[16px]">Free</span>
              </div>
            </div>
            <div className="h-9 px-3 bg-white/10 rounded inline-flex justify-center items-center gap-3">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5.83 6.42H5.83" stroke="#788284" strokeWidth="1.17" strokeLinecap="round" /><path d="M8.17 6.42H8.17" stroke="#788284" strokeWidth="1.17" strokeLinecap="round" /><rect x="2.92" y="3.5" width="8.17" height="9.33" rx="0.58" stroke="#788284" strokeWidth="1.17" /><path d="M1.75 3.5H12.25" stroke="#788284" strokeWidth="1.17" strokeLinecap="round" /><path d="M4.67 1.17H9.33" stroke="#788284" strokeWidth="1.17" strokeLinecap="round" /></svg>
              <span className="text-white text-[16px] font-medium">1</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.92 7H11.08" stroke="white" strokeWidth="1.17" strokeLinecap="round" /><path d="M7 2.92V11.08" stroke="white" strokeWidth="1.17" strokeLinecap="round" /></svg>
            </div>
          </div>
        </ComponentRow>

      <ComponentRow dark label="Cart Item / Sold Out">
          <div className="flex items-center justify-between w-[361px] flex-shrink-0 py-3 opacity-50">
            <div className="flex items-center gap-3">
              <div className="w-[52px] h-[52px] flex items-center justify-center grayscale">
                <Image src="/images/beer.png" alt="" width={52} height={52} className="object-contain" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-white text-[16px] font-medium">Craft Beer</span>
                <span className="text-white text-[16px] line-through">$8</span>
                <span className="text-[#e31837] text-[12px] font-medium">No longer available</span>
              </div>
            </div>
            <button className="bg-white/[0.08] h-[32px] px-3 rounded flex items-center">
              <span className="text-white/60 text-[14px] font-medium">Remove</span>
            </button>
          </div>
        </ComponentRow>

        <SpecTable rows={[
          ["Image size", "52x52px"],
          ["Stepper bg", "rgba(255,255,255,0.08)"],
          ["Stepper height", "36px"],
          ["Stepper radius", "4px (rounded)"],
          ["Icon size", "14px"],
          ["Icon stroke", "white, opacity 0.6"],
          ["Sold out", "opacity-50, grayscale image, strikethrough price, Remove button replaces stepper"],
          ["Sold out label", "text-[#e31837] 12px font-medium, 'No longer available'"],
          ["Trigger", "Item becomes unavailable after user adds to cart but before checkout"],
        ]} />

      <div className="h-px bg-[var(--border)] my-8" />

      <div className="h-px bg-[var(--border)] my-8" />

      {/* -------------------------------------------------------- */}
      {/* MORE ON BOARD */}
      {/* -------------------------------------------------------- */}
      <SectionTitle>More on Board</SectionTitle>
      <SectionDesc>Quick-access grid for secondary features.</SectionDesc>

      <ComponentRow dark label="Board Item / Default">
          <div className="flex gap-3">
            {[
              { name: "Movies", icon: "/images/icon-tv.svg" },
              { name: "Wifi", icon: "/images/icon-wifi.svg" },
              { name: "Flight Info", icon: "/images/icon-plane-outline.svg" },
            ].map((item) => (
              <div key={item.name} className="flex-1 border border-[#323b62] rounded flex flex-col items-center justify-center gap-2 p-[17px] min-w-[100px]">
                <Image src={item.icon} alt={item.name} width={20} height={20} />
                <span className="text-white text-[16px] whitespace-nowrap">{item.name}</span>
              </div>
            ))}
          </div>
        </ComponentRow>
        <SpecTable rows={[
          ["Border", "1px solid #323b62"],
          ["Padding", "17px"],
          ["Icon size", "20px"],
          ["Active state", "bg-[#323b62]/30"],
          ["Layout", "flex-1 equal width, 3 columns"],
        ]} />

      <div className="h-px bg-[var(--border)] my-8" />

      <p className="text-[13px] text-[var(--muted)] text-center py-8">
        Kovo Design System v1.0 — Last updated {new Date().toLocaleDateString()}
      </p>
    </div>
  );
}
