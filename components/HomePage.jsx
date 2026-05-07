"use client";
// ============================================================
// HomePage.jsx  — تقني في الثانوية
// Apple-inspired, glass-morphism, Framer Motion scroll animations.
// Requires: framer-motion, @supabase/supabase-js
// ============================================================

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";

// ─── Design Tokens ───────────────────────────────────────────
const T = {
  pearl:    "#F5F5F7",
  graphite: "#1D1D1F",
  green:    "#E8F5E9",
  blue:     "#0A84FF",
  cyan:     "#30D5C8",
  border:   "rgba(0,0,0,0.08)",
  glass:    "rgba(255,255,255,0.72)",
  shadow:   "0 8px 40px rgba(0,0,0,0.10)",
};

// ─── Jaker Bot – Fixed Response Map ──────────────────────────
const BOT_RESPONSES = [
  {
    id: "price",
    label: "💰 السعر",
    en: "Price",
    answer: "300 جنيه مصري فقط — وللأوائل خصم 50% باستخدام كود: BO2435M50 🎉",
  },
  {
    id: "devices",
    label: "📱 الأجهزة المدعومة",
    en: "Devices",
    answer: "Tab A7 (T505/T509) و Tab A9+ 5G (X216B)",
  },
  {
    id: "tools",
    label: "🛠 الأدوات المطلوبة",
    en: "Tools",
    answer: "كابل USB للمشاركة + برنامج UltraViewer + كابل EDL معدّل",
  },
  {
    id: "trust",
    label: "🔒 من يشرف؟",
    en: "Trust",
    answer: "يشرف على العملية محمود وفريق تقني محترف",
  },
  {
    id: "payment",
    label: "💳 طرق الدفع",
    en: "Payment",
    answer: "Mastercard · Telda · Fawry · InstaPay · جميع المحافظ الإلكترونية",
  },
  {
    id: "duration",
    label: "⏱ المدة",
    en: "Duration",
    answer: "حوالي 20 دقيقة — يحتاج اتصال إنترنت مستقر",
  },
];

const HUMAN_NUMBERS = ["+459199617", "+459070754", "+459192206"];
const FALLBACK_NUM  = "+201094536778";

// ─── Tiny helpers ─────────────────────────────────────────────
function VerifiedBadge({ size = 18 }) {
  return (
    <motion.span
      animate={{ scale: [1, 1.15, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      title="حساب موثّق"
      style={{ display: "inline-flex", marginInlineStart: 6, verticalAlign: "middle" }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="12" fill={T.blue} />
        <path d="M7 12.5l3.5 3.5 6-7" stroke="#fff" strokeWidth="2.2"
              strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </motion.span>
  );
}

function GlassCard({ children, style = {} }) {
  return (
    <div style={{
      background: T.glass,
      backdropFilter: "blur(24px) saturate(180%)",
      WebkitBackdropFilter: "blur(24px) saturate(180%)",
      border: `1px solid ${T.border}`,
      borderRadius: 20,
      boxShadow: T.shadow,
      ...style,
    }}>
      {children}
    </div>
  );
}

// ─── Jaker Chat Bot ───────────────────────────────────────────
function JakerBot({ lang }) {
  const [open,     setOpen]     = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: lang === "ar"
        ? "مرحباً! أنا Jaker، مساعدك الذكي 🎧 اختر سؤالك:"
        : "Hi! I'm Jaker, your smart assistant 🎧 Pick a question:" }
  ]);
   const bottomRef = useRef(null);

   useEffect(() => {
     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
   }, [messages]);

   function handleOption(opt) {
     setMessages(prev => [
       ...prev,
       { from: "user", text: opt.label },
       { from: "bot",  text: opt.answer },
     ]);
   }

   function requestHuman() {
     setMessages(prev => [
       ...prev,
       { from: "user", text: "أريد تحدث مع شخص حقيقي" },
       {
         from: "bot",
         text: `يمكنك التواصل عبر:\n${HUMAN_NUMBERS.join("  |  ")}\nأو الدعم العام: ${FALLBACK_NUM}`,
       },
     ]);
   }

   return (
    <>
      {/* Floating trigger */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        aria-label="Jaker AI Support"
        style={{
          position: "fixed", bottom: 88, right: 24,
          width: 52, height: 52, borderRadius: "50%",
          background: `linear-gradient(135deg, ${T.graphite}, #3A3A3C)`,
          boxShadow: "0 4px 20px rgba(0,0,0,0.22)",
          border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000,
        }}
      >
        <span style={{ fontSize: 22 }}>🎧</span>
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            style={{
              position: "fixed", bottom: 152, right: 20,
              width: "min(360px, 92vw)",
              maxHeight: 500,
              display: "flex", flexDirection: "column",
              zIndex: 1001,
              borderRadius: 20,
              overflow: "hidden",
              boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
            }}
          >
            {/* Header */}
            <div style={{
              background: T.graphite, padding: "14px 18px",
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: `linear-gradient(135deg, ${T.blue}, ${T.cyan})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18,
              }}>🎧</div>
              <div>
                <div style={{ color: "#fff", fontWeight: 600, fontSize: 15,
                              fontFamily: "-apple-system, 'SF Pro Text', sans-serif" }}>
                  Jaker
                </div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>
                  {lang === "ar" ? "مساعد ذكي" : "AI Support"}
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{
                  marginInlineStart: "auto", background: "none", border: "none",
                  color: "rgba(255,255,255,0.6)", fontSize: 20, cursor: "pointer",
                }}
              >×</button>
            </div>

            {/* Messages */}
            <div style={{
              flex: 1, overflowY: "auto", padding: "14px 14px 8px",
              background: T.glass,
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              display: "flex", flexDirection: "column", gap: 10,
            }}>
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: m.from === "bot" ? -10 : 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{
                    alignSelf: m.from === "bot" ? "flex-start" : "flex-end",
                    maxWidth: "82%",
                    background: m.from === "bot"
                      ? "rgba(0,0,0,0.06)"
                      : `linear-gradient(135deg, ${T.blue}, #0066CC)`,
                    color: m.from === "bot" ? T.graphite : "#fff",
                    padding: "10px 14px",
                    borderRadius: m.from === "bot" ? "16px 16px 16px 4px" : "16px 16px 4px 16px",
                    fontSize: 13.5,
                    lineHeight: 1.5,
                    fontFamily: "-apple-system, 'SF Pro Text', sans-serif",
                    whiteSpace: "pre-line",
                    direction: "auto",
                  }}
                >
                  {m.text}
                </motion.div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Quick reply buttons */}
            <div style={{
              background: T.glass,
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              borderTop: `1px solid ${T.border}`,
              padding: "10px 12px",
              display: "flex", flexWrap: "wrap", gap: 7,
            }}>
              {BOT_RESPONSES.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => handleOption(opt)}
                  style={{
                    background: "rgba(10,132,255,0.08)",
                    border: `1px solid rgba(10,132,255,0.25)`,
                    borderRadius: 24, padding: "5px 12px",
                    fontSize: 12, cursor: "pointer",
                    color: T.blue,
                    fontFamily: "-apple-system, 'SF Pro Text', sans-serif",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={e => e.target.style.background = "rgba(10,132,255,0.16)"}
                  onMouseLeave={e => e.target.style.background = "rgba(10,132,255,0.08)"}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Footer CTAs */}
            <div style={{
              background: T.glass,
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              borderTop: `1px solid ${T.border}`,
              padding: "10px 14px",
              display: "flex", gap: 8,
            }}>
              <button
                onClick={() => setMessages(prev => [...prev,
                  { from: "bot", text: "اختر أي سؤال من القائمة أعلاه وسأجيبك فوراً 😊" }
                ])}
                style={{
                  flex: 1,
                  background: "rgba(0,0,0,0.05)",
                  border: `1px solid ${T.border}`,
                  borderRadius: 12, padding: "9px 0",
                  fontSize: 13, cursor: "pointer",
                  fontFamily: "-apple-system, 'SF Pro Text', sans-serif",
                  color: T.graphite,
                }}
              >
                {lang === "ar" ? "المزيد من الأسئلة" : "More Questions"}
              </button>
              <button
                onClick={requestHuman}
                style={{
                  flex: 1,
                  background: `linear-gradient(135deg, ${T.blue}, #0055BB)`,
                  border: "none",
                  borderRadius: 12, padding: "9px 0",
                  fontSize: 13, cursor: "pointer",
                  fontFamily: "-apple-system, 'SF Pro Text', sans-serif",
                  color: "#fff", fontWeight: 600,
                }}
              >
                {lang === "ar" ? "دعم بشري" : "Human Support"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Main HomePageContent (rendered after entry animation) ───
export default function HomePage() {
  const [lang, setLang]       = useState("ar");
  const [navSolid, setNavSolid] = useState(false);
  const [discountCount] = useState(12); // placeholder discount count until Supabase integration
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const heroY  = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const heroOp = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const isAr = lang === "ar";

  // Fetch discount counter from Supabase in real-time
  useEffect(() => {
    // In production replace this block with Supabase real-time subscription:
    // const { createClient } = await import("@supabase/supabase-js");
    // const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    // const { data } = await supabase.from("discount_counter").select("count").single();
    // setDiscountCount(data?.count ?? 0);
  }, []);

  useEffect(() => {
    const handler = () => setNavSolid(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // ── Text content (bilingual) ──────────────────────────────
  const copy = {
    nav: {
      home:      isAr ? "الرئيسية"       : "Home",
      order:     isAr ? "الطلب"          : "Order",
      finance:   isAr ? "الدعم المالي"   : "Financial Support",
      account:   isAr ? "الحساب"         : "Account",
    },
    hero: {
      badge:     isAr ? "خدمة موثّقة ومُختبَرة" : "Verified & Tested Service",
      title:     isAr ? "تقني في الثانوية"       : "Technical in High School",
      sub:       isAr ? "تحسين احترافي وآمن لجهازك — بأيدٍ خبيرة" :
                        "Professional, safe device optimization — by expert hands",
      cta1:      isAr ? "ابدأ الطلب الآن" : "Start Your Order",
      cta2:      isAr ? "تعرّف أكثر"      : "Learn More",
    },
    discount: {
      label:     isAr ? `تبقّى ${50 - discountCount} مقعداً للخصم 50%!`
                       : `${50 - discountCount} slots left for 50% OFF!`,
    },
    disclaimer: {
      stamp:     isAr ? "إقرار رسمي" : "Official Disclaimer",
      text:      isAr
        ? "يُقرّ المستخدم بتحمّله المسؤولية الكاملة عن جهازه بعد إتمام عملية التحسين. لا يتحمل الفريق الفني أي مسؤولية عن سوء الاستخدام أو الأعطال الناتجة عن عوامل خارجية."
        : "The user acknowledges full personal responsibility for their device post-optimization. The technical team bears no liability for misuse or faults caused by external factors.",
    },
    features: [
      { icon: "⚡", ar: "سرعة تنفيذ 20 دقيقة", en: "20-Minute Execution" },
      { icon: "🛡", ar: "نظام مؤمّن بالكامل",   en: "Fully Secured System" },
      { icon: "📱", ar: "أجهزة سامسونج مدعومة", en: "Samsung Devices Supported" },
      { icon: "💳", ar: "دفع مرن ومتعدد",       en: "Flexible Multi-Payment" },
    ],
  };

  return (
    <div dir={isAr ? "rtl" : "ltr"} style={{
      fontFamily: isAr
        ? "'Noto Sans Arabic', 'SF Arabic', -apple-system, sans-serif"
        : "-apple-system, 'SF Pro Display', sans-serif",
      background: T.pearl,
      color: T.graphite,
      minHeight: "100vh",
      overflowX: "hidden",
    }}>

      {/* ── Navbar ─────────────────────────────────────────── */}
      <motion.nav
        animate={{ backdropFilter: navSolid ? "blur(20px)" : "none" }}
        style={{
          position: "fixed", top: 0, insetInline: 0,
          zIndex: 900,
          transition: "background 0.3s",
          background: navSolid ? T.glass : "transparent",
          borderBottom: navSolid ? `1px solid ${T.border}` : "none",
          padding: "0 clamp(16px, 4vw, 48px)",
          height: 58,
          display: "flex", alignItems: "center", gap: 32,
        }}
      >
        {/* Logo */}
        <Link href="/" style={{
          display: "flex", alignItems: "center", gap: 8,
          textDecoration: "none", color: T.graphite,
          fontWeight: 700, fontSize: 17,
          letterSpacing: isAr ? 0 : "-0.02em",
        }}>
          {copy.nav.home === "الرئيسية" ? "تقني في الثانوية" : "Taqni | HS"}
          <VerifiedBadge size={16} />
        </Link>

        {/* Nav links */}
        <div style={{ display: "flex", gap: 24, marginInlineStart: "auto", alignItems: "center" }}>
          {[
            { label: copy.nav.home,    href: "/" },
            { label: copy.nav.order,   href: "/order" },
            { label: copy.nav.finance, href: "/donate" },
            { label: copy.nav.account, href: "/account" },
          ].map(link => (
            <Link key={link.href} href={link.href} style={{
              textDecoration: "none", color: T.graphite,
              fontSize: 14, fontWeight: 500, opacity: 0.75,
              transition: "opacity 0.2s",
            }}
              onMouseEnter={e => e.target.style.opacity = "1"}
              onMouseLeave={e => e.target.style.opacity = "0.75"}
            >
              {link.label}
            </Link>
          ))}

          {/* Language Toggle */}
          <button
            onClick={() => setLang(l => l === "ar" ? "en" : "ar")}
            style={{
              background: "rgba(0,0,0,0.05)",
              border: `1px solid ${T.border}`,
              borderRadius: 20, padding: "4px 14px",
              fontSize: 13, cursor: "pointer",
              fontWeight: 600, color: T.graphite,
              transition: "background 0.2s",
            }}
          >
            {isAr ? "EN" : "AR"}
          </button>
        </div>
      </motion.nav>

      {/* ── Hero ───────────────────────────────────────────── */}
      <section ref={heroRef} style={{
        minHeight: "100vh",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        paddingTop: 80,
        background: "radial-gradient(ellipse at 50% 30%, #E8F5E9 0%, #F5F5F7 60%)",
        position: "relative", overflow: "hidden",
      }}>
        {/* Background decoration */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: `radial-gradient(ellipse 60% 50% at 80% 80%, rgba(10,132,255,0.06) 0%, transparent 70%),
                       radial-gradient(ellipse 40% 40% at 20% 20%, rgba(48,213,200,0.06) 0%, transparent 60%)`,
        }} />

        <motion.div style={{ y: heroY, opacity: heroOp, display: "flex", flexDirection: "column",
          alignItems: "center", textAlign: "center",
          gap: 20, maxWidth: 700, padding: "0 24px",
          zIndex: 2,
        }}>
          {/* Verified service badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <GlassCard style={{ padding: "6px 18px", display: "inline-flex", alignItems: "center", gap: 6 }}>
              <VerifiedBadge size={14} />
              <span style={{ fontSize: 12.5, fontWeight: 600, color: T.blue }}>
                {copy.hero.badge}
              </span>
            </GlassCard>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            style={{
              fontSize: "clamp(36px, 7vw, 72px)",
              fontWeight: 700,
              letterSpacing: isAr ? "0" : "-0.04em",
              lineHeight: 1.08,
              margin: 0,
              background: `linear-gradient(135deg, ${T.graphite} 0%, #555 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {copy.hero.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.7 }}
            style={{
              fontSize: "clamp(15px, 2.2vw, 20px)",
              color: "#636366",
              maxWidth: 520,
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {copy.hero.sub}
          </motion.p>

          {/* Discount counter pill */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.44, type: "spring", stiffness: 280 }}
          >
            <div style={{
              background: `linear-gradient(135deg, ${T.blue}, #0055CC)`,
              color: "#fff", borderRadius: 24,
              padding: "8px 22px", fontSize: 13.5, fontWeight: 600,
            }}>
              🎉 {copy.discount.label} — كود: <code style={{ letterSpacing: "0.1em" }}>BO2435M50</code>
            </div>
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.54, duration: 0.6 }}
            style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}
          >
            <Link href="/order" style={{
              background: T.graphite, color: "#fff",
              padding: "14px 36px", borderRadius: 14,
              fontWeight: 600, fontSize: 16, textDecoration: "none",
              boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.24)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.2)";
              }}
            >
              {copy.hero.cta1}
            </Link>
            <Link href="#features" style={{
              background: T.glass,
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              color: T.graphite,
              border: `1px solid ${T.border}`,
              padding: "14px 36px", borderRadius: 14,
              fontWeight: 500, fontSize: 16, textDecoration: "none",
              transition: "background 0.2s",
            }}>
              {copy.hero.cta2}
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", bottom: 32,
            display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
            opacity: 0.35,
          }}
        >
          <span style={{ fontSize: 11, letterSpacing: "0.15em",
                         textTransform: "uppercase" }}>SCROLL</span>
          <svg width="14" height="20" viewBox="0 0 14 20" fill="none">
            <rect x="1" y="1" width="12" height="18" rx="6" stroke={T.graphite} strokeWidth="1.5"/>
            <motion.rect x="5.5" y="4" width="3" height="5" rx="1.5" fill={T.graphite}
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>
        </motion.div>
      </section>

      {/* ── Feature Cards ───────────────────────────────────── */}
      <section id="features" style={{
        padding: "80px clamp(16px, 5vw, 80px)",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 20, maxWidth: 1100, margin: "0 auto",
      }}>
        {copy.features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
          >
            <GlassCard style={{ padding: "28px 24px", height: "100%" }}>
              <div style={{ fontSize: 32, marginBottom: 14 }}>{f.icon}</div>
              <div style={{ fontWeight: 600, fontSize: 16 }}>
                {isAr ? f.ar : f.en}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </section>

      {/* ── Official Disclaimer ─────────────────────────────── */}
      <section style={{
        padding: "0 clamp(16px, 5vw, 80px) 80px",
        display: "flex", justifyContent: "center",
      }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7 }}
          style={{ maxWidth: 700, width: "100%" }}
        >
          <GlassCard style={{ padding: "28px 32px", position: "relative", overflow: "hidden" }}>
            {/* Watermark stamp */}
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%,-50%) rotate(-18deg)",
              fontSize: "clamp(40px, 8vw, 80px)", fontWeight: 900,
              color: "rgba(10,132,255,0.07)",
              letterSpacing: isAr ? 0 : "-0.03em",
              userSelect: "none", whiteSpace: "nowrap",
              pointerEvents: "none",
            }}>
              {copy.disclaimer.stamp}
            </div>

            <div style={{
              borderInlineStart: `3px solid ${T.blue}`,
              paddingInlineStart: 16,
              position: "relative", zIndex: 1,
            }}>
              <h3 style={{ margin: "0 0 10px", fontSize: 15, fontWeight: 700, color: T.blue }}>
                {copy.disclaimer.stamp}
              </h3>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: "#636366" }}>
                {copy.disclaimer.text}
              </p>
            </div>
          </GlassCard>
        </motion.div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer style={{
        borderTop: `1px solid ${T.border}`,
        padding: "24px clamp(16px, 5vw, 80px)",
        display: "flex", alignItems: "center",
        justifyContent: "space-between", flexWrap: "wrap", gap: 12,
      }}>
        <div style={{ fontSize: 13, color: "#636366" }}>
          Copyright © 2026 — {isAr ? "جميع الحقوق محفوظة · لا يُسمح بالتقليد" : "All rights reserved · No imitation"}
          &nbsp;
          <VerifiedBadge size={13} />
        </div>
        <div style={{ fontSize: 13, color: "#636366" }}>
          {isAr ? "بقلم 7oda" : "By 7oda"}
        </div>
      </footer>

      {/* ── Floating WhatsApp ──────────────────────────────── */}
      <motion.a
        href="https://wa.me/201114123709"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        aria-label="WhatsApp Support"
        style={{
          position: "fixed", bottom: 24, right: 24,
          width: 52, height: 52, borderRadius: "50%",
          background: "#25D366",
          boxShadow: "0 4px 20px rgba(37,211,102,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 999, textDecoration: "none",
        }}
      >
        <svg viewBox="0 0 24 24" width="26" height="26" fill="#fff">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.287 7.045L.784 23.127a.75.75 0 00.917.979l4.238-1.37A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22.5a10.44 10.44 0 01-5.37-1.487l-.38-.228-3.943 1.274 1.11-3.83-.25-.396A10.44 10.44 0 011.5 12C1.5 6.21 6.21 1.5 12 1.5S22.5 6.21 22.5 12 17.79 22.5 12 22.5z"/>
        </svg>
      </motion.a>

      {/* ── Jaker AI Bot ───────────────────────────────────── */}
      <JakerBot lang={lang} />
    </div>
  );
}
