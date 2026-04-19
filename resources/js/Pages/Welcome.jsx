import { Head, Link } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import {
    motion,
    AnimatePresence,
    useScroll,
    useTransform,
    useSpring,
    useInView,
} from "framer-motion";
import { useState, useRef, useEffect } from "react";

// ─── SVG Icon Helper ──────────────────────────────────────────────────────────
const Icon = ({ d, size = 20, className = "" }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d={d} />
    </svg>
);

const DynamicText = ({ words }) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % words.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [words.length]);

    return (
        <span className="inline-flex min-w-[120px] sm:min-w-[140px] items-center justify-center relative bg-slate-900 text-white px-4 py-1.5 sm:px-5 sm:py-2 rounded-xl sm:rounded-2xl overflow-hidden shadow-xl shadow-indigo-400/30">
            <AnimatePresence mode="wait">
                <motion.span
                    key={words[index]}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="whitespace-nowrap"
                >
                    {words[index]}
                </motion.span>
            </AnimatePresence>
        </span>
    );
};

const Icons = {
    Arrow: (props) => <Icon {...props} d="M5 12h14M12 5l7 7-7 7" />,
    Check: (props) => <Icon {...props} d="M20 6L9 17l-5-5" />,
    Heart: (props) => (
        <Icon
            {...props}
            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        />
    ),
    Shield: (props) => (
        <Icon {...props} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    ),
    Users: (props) => (
        <Icon
            {...props}
            d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
        />
    ),
    Star: (props) => (
        <Icon
            {...props}
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        />
    ),
    Activity: (props) => <Icon {...props} d="M22 12h-4l-3 9L9 3l-3 9H2" />,
    Phone: (props) => (
        <Icon
            {...props}
            d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"
        />
    ),
    Book: (props) => (
        <Icon
            {...props}
            d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z"
        />
    ),
    Map: (props) => (
        <Icon
            {...props}
            d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4zM8 2v16M16 6v16"
        />
    ),
    X: (props) => <Icon {...props} d="M18 6L6 18M6 6l12 12" />,
    Baby: (props) => (
        <Icon
            {...props}
            d="M9 12h.01M15 12h.01M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z"
        />
    ),
    Globe: (props) => (
        <Icon
            {...props}
            d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
        />
    ),
    Award: (props) => (
        <Icon
            {...props}
            d="M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM8.21 13.89L7 23l5-3 5 3-1.21-9.12"
        />
    ),
    ChevDown: (props) => <Icon {...props} d="M6 9l6 6 6-6" />,
    ChevRight: (props) => <Icon {...props} d="M9 18l6-6-6-6" />,
    Mail: (props) => (
        <Icon
            {...props}
            d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6"
        />
    ),
    Leaf: (props) => (
        <Icon
            {...props}
            d="M2 22 16 8M15.4 6.6a9 9 0 0 1 2 10.06A9 9 0 0 1 2 22a9 9 0 0 1 4.26-15.98 9 9 0 0 1 9.14.58z"
        />
    ),
    Zap: (props) => <Icon {...props} d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />,
    Briefcase: (props) => (
        <Icon
            {...props}
            d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"
        />
    ),
    Lock: (props) => (
        <Icon
            {...props}
            d="M7 11V7a5 5 0 0 1 10 0v4M8 11h8a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2z"
        />
    ),
    Share: (props) => (
        <Icon
            {...props}
            d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"
        />
    ),
};

// ─── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = "", prefix = "" }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });
    useEffect(() => {
        if (!inView) return;
        const num = parseFloat(target) || 0;
        let start = 0;
        const duration = 2000;
        const step = 16;
        const increment = num / (duration / step);
        const timer = setInterval(() => {
            start += increment;
            if (start >= num) {
                setCount(num);
                clearInterval(timer);
            } else setCount(parseFloat(start.toFixed(1)));
        }, step);
        return () => clearInterval(timer);
    }, [inView, target]);
    return (
        <span ref={ref} className="font-['JetBrains_Mono',_monospace]">
            {prefix}
            {Number.isInteger(parseFloat(target)) ? Math.round(count) : count}
            {suffix}
        </span>
    );
}

// ─── FadeUp Wrapper ───────────────────────────────────────────────────────────
const FadeUp = ({ children, delay = 0, className = "" }) => (
    <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
        className={className}
    >
        {children}
    </motion.div>
);

// ─── Section Label ────────────────────────────────────────────────────────────
const SectionLabel = ({ children, className = "" }) => (
    <div
        className={`text-center underline underline-offset-8 w-fit mx-auto text-xl text-slate-900 relative inline-block px-2 py-1 font-['Caveat',_cursive] ${className}`}
    >
        <span className="relative z-10">{children}</span>
    </div>
);

// ─── Section Heading ──────────────────────────────────────────────────────────
const SectionHeading = ({ children, className = "" }) => (
    <h2
        className={`text-2xl lg:text-3xl font-semibold text-slate-900 tracking-tight leading-[30px] lg:leading-[36px] ${className}`}
    >
        {children}
    </h2>
);

// ─── Pill Badge ───────────────────────────────────────────────────────────────
const Pill = ({ children, color = "indigo" }) => {
    const map = {
        indigo: "bg-amber-50 text-amber-700 border-amber-100",
        amber: "bg-amber-50 text-amber-700 border-amber-100",
        emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
        rose: "bg-rose-50 text-rose-700 border-rose-100",
    };
    return (
        <span
            className={`inline-flex items-center px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${map[color]}`}
        >
            {children}
        </span>
    );
};

// ─── Underline Highlight ──────────────────────────────────────────────────────
const UnderlineHighlight = ({ children, className = "" }) => (
    <span className={`relative inline-block ${className}`}>
        <span className="relative z-10">{children}</span>
        <span className="absolute bottom-1 left-0 w-full h-3 bg-amber-600/10 -rotate-1" />
    </span>
);

// ─── Feature Card (3-col grid) ────────────────────────────────────────────────
function FeatureCard({
    icon: IconComp,
    title,
    desc,
    accent = "indigo",
    index,
}) {
    return (
        <FadeUp delay={index * 0.08}>
            <motion.div
                className="relative border border-slate-200 hover:border-amber-600 hover:shadow-lg rounded-lg p-8 flex flex-col items-center text-center group transition-all duration-300"
                whileHover={{ y: -4 }}
            >
                <div className="flex items-center justify-center w-12 h-12 rounded-full border border-slate-100 mb-6 bg-white group-hover:border-amber-100 transition-colors">
                    <IconComp
                        size={24}
                        className="text-slate-900 group-hover:text-amber-600 transition-colors"
                    />
                </div>
                <h3 className="font-bold text-slate-900 text-xl mb-3 tracking-tight group-hover:text-amber-600 transition-colors">
                    {title}
                </h3>
                <p className="text-slate-500 text-base leading-relaxed mb-6">
                    {desc}
                </p>
                <div className="mt-auto">
                    <button className="inline-flex items-center gap-2 text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors">
                        Explore Features <Icons.ChevRight size={16} />
                    </button>
                </div>
            </motion.div>
        </FadeUp>
    );
}

// ─── Program Card (larger, colored bg) ───────────────────────────────────────
function ProgramCard({ abbr, title, desc, from, to, icon: IconComp, index }) {
    return (
        <FadeUp delay={index * 0.1}>
            <motion.div
                className="group relative bg-white rounded-xl border border-slate-200 p-8 h-full hover:border-amber-600 hover:shadow-xl transition-all duration-500 overflow-hidden"
                whileHover={{ y: -4 }}
            >
                <div
                    className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${from} ${to} opacity-[0.03] group-hover:opacity-[0.08] transition-opacity rounded-bl-[60px]`}
                />

                <div className="flex items-start justify-between mb-6">
                    <div className="px-3 py-1 bg-slate-900 text-white rounded-full text-[10px] font-bold uppercase tracking-widest">
                        {abbr}
                    </div>
                    <div className="text-amber-600 p-2 bg-amber-50 rounded-xl group-hover:scale-110 transition-transform duration-500">
                        <IconComp size={22} />
                    </div>
                </div>
                <h3 className="font-bold text-slate-900 text-xl mb-4 leading-tight tracking-tight">
                    {title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
            </motion.div>
        </FadeUp>
    );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ value, suffix, label, icon: IconComp, delay }) {
    return (
        <FadeUp delay={delay}>
            <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center hover:border-amber-200 transition-colors">
                <div className="w-10 h-10 rounded-full bg-slate-50 text-amber-600 flex items-center justify-center mx-auto mb-6 border border-slate-100">
                    <IconComp size={20} />
                </div>
                <div className="text-4xl font-bold text-slate-900 mb-2 tabular-nums tracking-tight">
                    <AnimatedCounter target={value} suffix={suffix} />
                </div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                    {label}
                </p>
            </div>
        </FadeUp>
    );
}

// ─── Testimonial Card ─────────────────────────────────────────────────────────
function TestimonialCard({ name, role, text, avatar, featured, delay }) {
    return (
        <FadeUp delay={delay}>
            <motion.div
                className={`bg-white rounded-2xl p-8 border h-full transition-all duration-300 ${featured ? "border-amber-200 bg-amber-50/10 shadow-lg shadow-amber-500/5" : "border-slate-200 hover:border-slate-300"}`}
                whileHover={{ y: -2 }}
            >
                <div className="flex text-amber-400 gap-0.5 mb-6">
                    {[...Array(5)].map((_, i) => (
                        <svg
                            key={i}
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                    ))}
                </div>
                <p className="text-slate-700 leading-relaxed text-sm mb-6 italic">
                    "{text}"
                </p>
                <div className="flex items-center gap-3 border-t border-slate-100 pt-5">
                    <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=e0e7ff&color=4338ca&bold=true&size=80`}
                        alt={name}
                        className="w-11 h-11 rounded-full"
                    />
                    <div>
                        <p className="font-bold text-slate-900 text-sm">
                            {name}
                        </p>
                        <p className="text-xs text-slate-400">{role}</p>
                    </div>
                </div>
            </motion.div>
        </FadeUp>
    );
}

// ─── Team Member Card ─────────────────────────────────────────────────────────
function TeamCard({ name, role, desa, delay }) {
    return (
        <FadeUp delay={delay}>
            <motion.div
                className="text-center group"
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300 }}
            >
                <div className="relative w-32 h-32 mx-auto mb-4">
                    <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=e0e7ff&color=4338ca&bold=true&size=128`}
                        alt={name}
                        className="w-full h-full rounded-2xl object-cover"
                    />
                    <div className="absolute inset-0 rounded-2xl ring-2 ring-amber-200 ring-offset-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm">
                    {name}
                </h4>
                <p className="text-amber-600 text-xs font-bold mt-0.5">
                    {role}
                </p>
                <p className="text-slate-400 text-xs mt-0.5">{desa}</p>
            </motion.div>
        </FadeUp>
    );
}

// ─── FAQ Item ─────────────────────────────────────────────────────────────────
function FAQItem({ q, a, isOpen, onToggle }) {
    return (
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
            <button
                onClick={onToggle}
                className="w-full px-6 py-4 flex justify-between items-center font-bold text-slate-800 hover:text-amber-600 transition-colors text-left gap-4 text-sm"
            >
                <span>{q}</span>
                <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                >
                    <Icons.ChevDown />
                </motion.span>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="px-6 pb-5 text-slate-500 text-sm leading-relaxed border-t border-slate-100 pt-4">
                            {a}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ─── Scrolling Marquee (sponsor strip) ───────────────────────────────────────
function Marquee({ items, speed = 32 }) {
    return (
        <div className="overflow-hidden flex select-none">
            {[0, 1].map((i) => (
                <motion.div
                    key={i}
                    className="flex gap-14 shrink-0 pr-14"
                    animate={{ x: ["0%", "-100%"] }}
                    transition={{
                        duration: speed,
                        ease: "linear",
                        repeat: Infinity,
                    }}
                >
                    {items.map((item, idx) => (
                        <span
                            key={idx}
                            className="flex items-center gap-3 font-semibold text-sm tracking-widest uppercase whitespace-nowrap text-slate-600"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                            {item}
                        </span>
                    ))}
                </motion.div>
            ))}
        </div>
    );
}

// ─── Scroll Progress Bar ──────────────────────────────────────────────────────
function ProgressBar() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-500 to-violet-500 z-[9999] origin-left"
            style={{ scaleX }}
        />
    );
}

// ─── Gallery Components ──────────────────────────────────────────────────────
const ImageModal = ({ isOpen, onClose, image, title }) => {
    if (!isOpen) return null;
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="relative max-w-5xl w-full"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={onClose}
                        className="absolute -top-16 right-0 text-white/70 hover:text-white hover:scale-110 transition-all p-2 rounded-full bg-white/10"
                    >
                        <Icons.X size={32} />
                    </button>
                    <div className="overflow-hidden rounded-3xl shadow-2xl bg-slate-900 border border-white/10">
                        <img
                            src={image}
                            alt={title}
                            className="w-full h-full max-h-[75vh] object-contain"
                        />
                        <div className="p-8 bg-gradient-to-t from-slate-950 to-slate-950/50">
                            <h3 className="text-white font-bold text-2xl tracking-tight">{title}</h3>
                            <p className="text-slate-400 text-sm mt-1">Dokumentasi Kegiatan Balai KB Argapura</p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

const HorizontalMarquee = ({ items, speed = 40, reverse = false, onImageClick }) => {
    return (
        <div className="flex overflow-hidden gap-8 py-4">
            <motion.div
                initial={{ x: reverse ? "-50%" : "0%" }}
                animate={{ x: reverse ? "0%" : "-50%" }}
                transition={{
                    duration: speed,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="flex shrink-0 gap-8 min-w-full"
            >
                {[...items, ...items, ...items].map((item, idx) => (
                    <div
                        key={idx}
                        onClick={() => onImageClick(item)}
                        className="relative w-[300px] sm:w-[450px] aspect-[16/10] shrink-0 rounded-[2.5rem] overflow-hidden group/card cursor-pointer bg-white border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-2xl hover:border-amber-200 transition-all duration-700"
                    >
                        <img
                            src={`/storage/${item.image}`}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/10 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-amber-400 mb-2">Kegiatan</p>
                            <h3 className="text-white font-bold text-lg leading-tight">
                                {item.title}
                            </h3>
                        </div>
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function Welcome({
    totalResponden = 247,
    rataKepuasan = 89.4,
    persentasePuas = 94,
    galleries = [],
    teams = [],
}) {
    const [openFaq, setOpenFaq] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    const partners = [
        "BKKBN Pusat",
        "Kementerian Kesehatan",
        "BPJS Kesehatan",
        "Dinas PPKB Kab/Kota",
        "Puskesmas Mitra",
        "Posyandu Terpadu",
        "PKK Kecamatan",
        "KUA Setempat",
    ];

    const features = [
        {
            icon: Icons.Heart,
            title: "Konseling Pranikah",
            desc: "Bimbingan kesehatan reproduksi dan sertifikasi wajib calon pengantin via aplikasi Elsimil yang terintegrasi.",
            accent: "rose",
        },
        {
            icon: Icons.Shield,
            title: "Layanan Kontrasepsi",
            desc: "Pemberian kondom, pil KB, suntik, pemasangan IUD & Implan oleh bidan terlatih bersertifikat resmi.",
            accent: "indigo",
        },
        {
            icon: Icons.Activity,
            title: "Skrining Kesehatan",
            desc: "Pemeriksaan IVA untuk deteksi dini kanker serviks pada wanita usia produktif secara berkala.",
            accent: "emerald",
        },
        {
            icon: Icons.Baby,
            title: "Bina Tumbuh Kembang",
            desc: "Pemantauan gizi dan psikologi balita melalui Kartu Kembang Anak (KKA) secara terstruktur.",
            accent: "amber",
        },
        {
            icon: Icons.Book,
            title: "Penyuluhan Edukasi",
            desc: "Seminar dan kelas edukasi kesehatan reproduksi, keluarga berencana, dan ketahanan keluarga.",
            accent: "violet",
        },
        {
            icon: Icons.Globe,
            title: "Jejaring Mitra Terpadu",
            desc: "Koordinasi dengan puskesmas, bidan desa, dan posyandu untuk pelayanan menyeluruh di tiap desa.",
            accent: "sky",
        },
    ];

    const programs = [
        {
            abbr: "BKB",
            title: "Bina Keluarga Balita",
            desc: "Meningkatkan pemahaman orang tua dalam membina tumbuh kembang fisik dan mental anak sejak lahir lewat alat permainan edukatif dan stimulasi dini.",
            from: "from-amber-500",
            to: "to-amber-800",
            icon: Icons.Baby,
        },
        {
            abbr: "BKR",
            title: "Bina Keluarga Remaja",
            desc: "Memberi wadah diskusi seputar pubertas, pergaulan bebas, dan NAPZA. Bersinergi dengan PIK-Remaja untuk membentuk generasi tangguh.",
            from: "from-violet-500",
            to: "to-violet-800",
            icon: Icons.Users,
        },
        {
            abbr: "BKL",
            title: "Bina Keluarga Lansia",
            desc: "Menjadikan warga lanjut usia tetap Tangguh: Taqwa, Mandiri, Mampu berkarya, dan Berguna tanpa merasa tersisihkan.",
            from: "from-sky-500",
            to: "to-sky-800",
            icon: Icons.Award,
        },
    ];

    const faqs = [
        {
            q: "Apakah layanan pemasangan KB dikenakan biaya?",
            a: "TIDAK. Seluruh biaya GRATIS apabila dilakukan di Balai Penyuluhan atau Fasilitas Kesehatan Pemerintah yang ditunjuk, terlebih lagi dengan kepesertaan BPJS Kesehatan aktif.",
        },
        {
            q: "Apa saja syarat daftar calon pengantin di Elsimil?",
            a: "Cukup siapkan: KTP asli, surat pengantar dari kelurahan/KUA, dan hasil sertifikat Kursus Calon Pengantin (bila ada). Pendaftaran bisa dilakukan secara online via aplikasi Elsimil.",
        },
        {
            q: "Kapan jam operasional Balai KB Argapura?",
            a: "Senin sampai Jumat, pukul 08.00 – 16.00 WIB. Untuk pelayanan darurat atau kunjungan rumah oleh Penyuluh PLKB, silakan hubungi nomor kontak yang tertera.",
        },
        {
            q: "Apa perbedaan IUD dan Implan?",
            a: "IUD (spiral) dipasang di dalam rahim, efektif 5–10 tahun. Implan dipasang di bawah kulit lengan atas, efektif 3 tahun. Keduanya reversibel dan tidak memengaruhi kesuburan jangka panjang setelah pelepasan.",
        },
        {
            q: "Bagaimana cara mengakses konsultasi online?",
            a: "Anda dapat menghubungi kami melalui WhatsApp resmi Balai KB Argapura atau datang langsung ke kantor. Layanan konsultasi tatap muka diprioritaskan untuk keakuratan diagnosa.",
        },
    ];

    const team = [
        {
            name: "Bpk. Hendra S.",
            role: "Penyuluh Lapangan",
            desa: "Desa Suka Maju",
        },
        {
            name: "Ibu Rani Pertiwi",
            role: "Penyuluh Lapangan",
            desa: "Desa Harapan",
        },
        {
            name: "Bpk. Agus Santoso",
            role: "Penyuluh Lapangan",
            desa: "Desa Sejahtera",
        },
        {
            name: "Ibu Dewi Lestari",
            role: "Bidan Koordinator",
            desa: "Desa Melati",
        },
        {
            name: "Ibu Novia Rini",
            role: "Penyuluh Lapangan",
            desa: "Desa Bahagia",
        },
    ];

    const testimonials = [
        {
            name: "Siti Fatimah",
            role: "Akseptor KB IUD",
            text: "Penjelasan petugas soal IUD sangat mendalam dan menenangkan. Tidak ada rasa sakit berarti, dan semuanya gratis tanpa syarat rumit!",
            featured: true,
        },
        {
            name: "Kusuma Wijaya",
            role: "Peserta Kampung KB",
            text: "Pendampingan stunting di Kampung KB sangat terasa manfaatnya. BB anak saya kini masuk grafik hijau setelah 3 bulan program.",
            featured: false,
        },
        {
            name: "Anita Rahayu",
            role: "Peserta BKR / PIK-Remaja",
            text: "Diskusi di Balai KB Argapura seru banget! Jadi paham risiko nikah dini dan cara menjaga kesehatan reproduksi sejak dini.",
            featured: false,
        },
    ];

    return (
        <GuestLayout>
            <Head title="Keluarga Berkualitas — Masa Depan Indonesia Lebih Hebat" />
            <ProgressBar />

            {/* ══════════════════════════════════════════════════════
                1. HERO — ShadcnStore-inspired, clean centered layout
            ════════════════════════════════════════════════════════ */}
            <section
                id="beranda"
                className="relative min-h-[85vh] md:min-h-[90vh] flex flex-col items-center justify-start md:justify-center pt-28 pb-12 md:pt-32 md:pb-16 overflow-hidden bg-white"
            >
                {/* Background Grid Pattern with Pink/Indigo Glow */}
                <div className="absolute inset-0 h-full w-full bg-white pointer-events-none">
                    <div className="absolute inset-0 h-full w-full bg-[radial-gradient(#dfe1e5_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
                    <div className="absolute left-0 right-0 top-0 m-auto h-[400px] w-[400px] rounded-full bg-indigo-400 opacity-20 blur-[120px]"></div>
                </div>

                <div className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center">
                    {/* Badge */}
                    <FadeUp>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 sm:px-5 sm:py-2 mb-6 sm:mb-8 text-xs sm:text-sm font-medium border border-indigo-200/60 rounded-full text-indigo-600 bg-indigo-50/30 backdrop-blur-md">
                            <span className="text-sm sm:text-base">✨</span>
                            <span>
                                Baru: Layanan & Program Balai KB Argapura
                            </span>
                            <span className="text-sm sm:text-base">🚀</span>
                        </div>
                    </FadeUp>

                    {/* Stats Below Badge */}
                    <FadeUp delay={0.1}>
                        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-8 sm:mb-10 text-[11px] sm:text-sm md:text-base font-['JetBrains_Mono',_monospace]">
                            <div className="flex items-center gap-2 text-emerald-600 font-bold bg-emerald-50/50 px-3 py-1 rounded-full border border-emerald-100">
                                <span className="flex items-center gap-1.5 sm:gap-2">
                                    <span className="inline-block w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    <span>{totalResponden}+ Responden</span>
                                </span>
                            </div>
                            <div className="hidden sm:block w-px h-6 bg-slate-200 shadow-sm"></div>
                            <div className="flex items-center gap-2 text-slate-800 bg-slate-50 px-3 py-1 rounded-full border border-slate-100 sm:bg-transparent sm:p-0 sm:border-0">
                                <span className="font-bold">
                                    {persentasePuas}% Kepuasan
                                </span>
                            </div>
                            <div className="hidden sm:block w-px h-6 bg-slate-200 shadow-sm"></div>
                            <div className="flex items-center gap-2 text-slate-800 bg-slate-50 px-3 py-1 rounded-full border border-slate-100 sm:bg-transparent sm:p-0 sm:border-0">
                                <span className="font-bold">4.9★ Rating</span>
                            </div>
                        </div>
                    </FadeUp>

                    {/* Hero Title */}
                    <FadeUp delay={0.15}>
                        <h1 className="text-[26px] sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-[1.3] sm:leading-[1.1] tracking-tight text-balance">
                            Wujudkan Keluarga Sejahtera dengan <br className="hidden sm:block" />
                            <span className="inline-flex items-center justify-center gap-2 sm:gap-3 flex-wrap text-center mt-2 sm:mt-3">
                                <span>Layanan KB</span>
                                <DynamicText words={["Terpadu", "Modern", "Gratis", "Aman", "Mudah"]} />
                            </span>
                        </h1>
                    </FadeUp>

                    {/* Subtitle */}
                    <FadeUp delay={0.25}>
                        <p className="mt-6 sm:mt-10 text-base sm:text-lg lg:text-xl font-normal text-slate-600 leading-relaxed max-w-4xl mx-auto px-4 sm:px-0">
                            Akses{" "}
                            <span className="font-['JetBrains_Mono',_monospace] font-bold text-indigo-600 underline underline-offset-4 decoration-indigo-200">
                                {totalResponden}+
                            </span>{" "}
                            layanan kesehatan yang responsif,{" "}
                            <strong>
                                konseling berkualitas, kontrasepsi aman, dan
                                pembinaan keluarga.
                            </strong>{" "}
                            Wujudkan masa depan keluarga yang lebih sehat, terencana, dan bahagia bersama tim ahli kami.
                        </p>
                    </FadeUp>

                    {/* CTA Buttons */}
                    <FadeUp delay={0.35}>
                        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5">
                            <Link
                                href={route("survey.index")}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl px-12 py-5 text-base font-bold bg-slate-900 text-white hover:bg-slate-800 transition-all duration-300 shadow-2xl shadow-slate-300 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <Icons.Zap
                                    size={22}
                                    className="text-amber-400 fill-amber-400"
                                />
                                Isi Survei Kepuasan
                            </Link>
                            <a
                                href="#layanan"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl px-12 py-5 text-base font-bold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <Icons.Book size={22} />
                                Jelajahi Layanan
                            </a>
                        </div>
                    </FadeUp>
                    {/* Social Proof Section (Modified ShadcnStore Style) */}
                    <FadeUp delay={0.45}>
                        <div className="mt-16 flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-10 border-t border-slate-100 pt-10">
                            <div className="flex -space-x-3">
                                {[
                                    "Siti Fatimah",
                                    "Kusuma W.",
                                    "Anita R.",
                                    "Hendra S.",
                                    "Dewi L.",
                                ].map((name, i) => (
                                    <img
                                        key={i}
                                        className="w-11 h-11 rounded-full object-cover ring-4 ring-white shadow-sm"
                                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${["e0e7ff", "fef3c7", "d1fae5", "fce7f3", "e0e7ff"][i]}&color=${["4338ca", "92400e", "065f46", "9d174d", "4338ca"][i]}&bold=true&size=88`}
                                        alt={name}
                                    />
                                ))}
                            </div>
                            <div className="flex flex-col items-center lg:items-start gap-1">
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Icons.Star
                                                key={i}
                                                size={12}
                                                className="text-amber-400 fill-amber-400"
                                            />
                                        ))}
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-900">
                                        {rataKepuasan} / 100
                                    </span>
                                </div>
                                <p className="text-[10px] text-slate-500 font-medium">
                                    Dipercaya{" "}
                                    <span className="text-slate-900 font-bold">
                                        {totalResponden}+
                                    </span>{" "}
                                    masyarakat setiap bulan
                                </p>
                            </div>
                            <div className="hidden lg:block w-px h-8 bg-slate-200" />
                            <div className="flex items-center gap-6 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                                <span className="font-['JetBrains_Mono',_monospace] text-[9px] font-bold tracking-tighter uppercase">
                                    BKKBN
                                </span>
                                <span className="font-['JetBrains_Mono',_monospace] text-[9px] font-bold tracking-tighter uppercase">
                                    KEMENKES
                                </span>
                                <span className="font-['JetBrains_Mono',_monospace] text-[9px] font-bold tracking-tighter uppercase">
                                    BPJS
                                </span>
                            </div>
                        </div>
                    </FadeUp>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════
                STATS BAR — ShadcnStore-style bottom strip
            ════════════════════════════════════════════════════════ */}
            <section className="w-full border-y border-slate-200 bg-white">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                    {[
                        {
                            icon: <Icons.Heart />,
                            value: `${totalResponden}+`,
                            title: "Responden Puas",
                            desc: "Konseling, KB, Skrining",
                        },
                        {
                            icon: <Icons.Activity />,
                            value: `${persentasePuas}%`,
                            title: "Tingkat Kepuasan",
                            desc: "Pelayanan KB Terpadu",
                        },
                        {
                            icon: <Icons.Shield />,
                            value: "100%",
                            title: "Gratis Semua Layanan",
                            desc: "Kontrasepsi, Edukasi, Konseling",
                        },
                    ].map((stat, i) => (
                        <FadeUp key={i} delay={i * 0.1}>
                            <div className="flex flex-col items-center justify-center gap-3 px-6 py-10">
                                <div className="p-3 bg-amber-50 rounded-xl text-amber-600 mb-1">
                                    {stat.icon}
                                </div>
                                <div className="text-4xl font-bold text-slate-900 font-mono tabular-nums">
                                    <AnimatedCounter
                                        target={parseFloat(stat.value)}
                                        suffix={
                                            stat.value.includes("%") ? "%" : "+"
                                        }
                                    />
                                </div>
                                <div className="text-center">
                                    <p className="text-base font-semibold text-slate-900 mb-0.5">
                                        {stat.title}
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        {stat.desc}
                                    </p>
                                </div>
                            </div>
                        </FadeUp>
                    ))}
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════
                2. PARTNER / SPONSOR STRIP
            ════════════════════════════════════════════════════════ */}
            <section className="py-8 bg-slate-50/50 border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 mb-4 text-center">
                    <p className="text-slate-400 font-semibold text-xs uppercase tracking-widest">
                        Didukung &amp; Bermitra Dengan
                    </p>
                </div>
                <Marquee items={partners} speed={38} />
            </section>

            {/* ══════════════════════════════════════════════════════
                3. ABOUT — Clean centered story
            ════════════════════════════════════════════════════════ */}
            <section id="tentang" className="py-24 sm:py-32 bg-white">
                <div className="max-w-7xl mx-auto px-6 sm:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                        <div className="order-2 lg:order-1">
                            <FadeUp>
                                <SectionLabel className="justify-start">
                                    Tentang Balai KB Argapura
                                </SectionLabel>
                            </FadeUp>
                            <FadeUp delay={0.08}>
                                <SectionHeading className="mb-6">
                                    Mengawal Mutu Kesehatan{" "}
                                    <br className="hidden sm:block" />
                                    <UnderlineHighlight>
                                        Keluarga Indonesia.
                                    </UnderlineHighlight>
                                </SectionHeading>
                            </FadeUp>
                            <FadeUp delay={0.14}>
                                <p className="text-slate-600 text-lg leading-relaxed mb-10">
                                    Balai Penyuluhan KB merupakan garda terdepan{" "}
                                    <strong>BKKBN</strong> di tingkat kecamatan,
                                    hadir mendampingi masyarakat melalui setiap
                                    fase kehidupan penting.
                                </p>
                            </FadeUp>

                            <div className="space-y-4">
                                {[
                                    {
                                        title: "Informasi Kontrasepsi Terpadu",
                                        desc: "Penjelasan komprehensif mengenai pemilihan alat KB yang aman dan personal.",
                                        icon: <Icons.Shield size={18} />,
                                    },
                                    {
                                        title: "Ketahanan Keluarga Berkelanjutan",
                                        desc: "Edukasi pembentukan karakter, gizi, dan kesehatan mental anak bangsa.",
                                        icon: <Icons.Heart size={18} />,
                                    },
                                    {
                                        title: "Pendampingan Siklus Hidup",
                                        desc: "Layanan terintegrasi dari pra-nikah hingga pembinaan lansia produktif.",
                                        icon: <Icons.Users size={18} />,
                                    },
                                ].map((item, i) => (
                                    <FadeUp key={i} delay={0.2 + i * 0.1}>
                                        <div className="group flex gap-5 p-6 rounded-2xl border border-slate-100 hover:border-amber-100 hover:bg-slate-50/50 transition-all duration-300">
                                            <div className="w-10 h-10 bg-white border border-slate-200 text-amber-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300 shadow-sm">
                                                {item.icon}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-base mb-1 tracking-tight">
                                                    {item.title}
                                                </h4>
                                                <p className="text-slate-500 text-sm leading-relaxed">
                                                    {item.desc}
                                                </p>
                                            </div>
                                        </div>
                                    </FadeUp>
                                ))}
                            </div>
                        </div>

                        <div className="order-1 lg:order-2">
                            <FadeUp delay={0.2} className="relative">
                                {/* Decorative elements */}
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-50 rounded-full blur-3xl opacity-60" />
                                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-50 rounded-full blur-3xl opacity-60" />

                                <div className="relative grid grid-cols-2 gap-4">
                                    <div className="rounded-[2rem] overflow-hidden aspect-[3/4] shadow-2xl shadow-amber-100 border-4 border-white">
                                        <img
                                            src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=800"
                                            alt="Konsultasi"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-4 pt-12">
                                        <div className="rounded-[2rem] overflow-hidden aspect-square shadow-2xl shadow-slate-200 border-4 border-white">
                                            <img
                                                src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600"
                                                alt="Keluarga"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl">
                                            <p className="font-mono text-3xl font-bold mb-1">
                                                15+
                                            </p>
                                            <p className="text-amber-200 text-[10px] font-bold uppercase tracking-widest">
                                                Tahun Melayani
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating Achievement Card */}
                                <motion.div
                                    className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-slate-100 flex items-center gap-3"
                                    animate={{ y: [0, -4, 0] }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                    }}
                                >
                                    <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
                                        <Icons.Award size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm leading-none">
                                            BerAKHLAK
                                        </p>
                                        <p className="text-slate-400 text-[10px] uppercase font-bold mt-1 tracking-tighter">
                                            Value Utama BKKBN
                                        </p>
                                    </div>
                                </motion.div>
                            </FadeUp>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════
                4. LAYANAN UNGGULAN — Refined Grid
            ════════════════════════════════════════════════════════ */}
            <section
                id="layanan"
                className="py-24 sm:py-32 bg-slate-50/50 border-y border-slate-200"
            >
                <div className="max-w-7xl mx-auto px-6 sm:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-20">
                        <FadeUp>
                            <SectionLabel>Layanan Terbaik Kami</SectionLabel>
                        </FadeUp>
                        <FadeUp delay={0.08}>
                            <SectionHeading className="mb-6">
                                Fasilitas Pelayanan{" "}
                                <UnderlineHighlight>
                                    Ekstra &amp; Gratis
                                </UnderlineHighlight>
                            </SectionHeading>
                        </FadeUp>
                        <FadeUp delay={0.14}>
                            <p className="text-slate-500 text-lg">
                                Seluruh konsultasi dan pelayanan kependudukan di
                                Balai KB Argapura sepenuhnya gratis untuk masyarakat
                                umum.
                            </p>
                        </FadeUp>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((f, i) => (
                            <FeatureCard key={i} index={i} {...f} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════
                5. BANGGA KENCANA — Split Layout
            ════════════════════════════════════════════════════════ */}
            <section id="bangga-kencana" className="py-24 sm:py-32 bg-white">
                <div className="max-w-7xl mx-auto px-6 sm:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                        <FadeUp className="relative group">
                            <div className="relative rounded-[2.5rem] overflow-hidden aspect-[4/3] shadow-2xl border-4 border-white">
                                <img
                                    src="https://images.unsplash.com/photo-1543269664-56d93c1b41a6?q=80&w=800&auto=format&fit=crop"
                                    alt="Bangga Kencana"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                                />
                                {/* Glass Stats Card */}
                                <div className="absolute bottom-6 left-6 right-6 bg-slate-900/40 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                                    <div className="flex justify-between items-center">
                                        {[
                                            { v: "8", l: "Desa Binaan" },
                                            { v: "95%", l: "Cakupan KB" },
                                            { v: "42", l: "Poktan Aktif" },
                                        ].map((s, i) => (
                                            <div
                                                key={i}
                                                className="text-center px-4 border-r last:border-0 border-white/20"
                                            >
                                                <p className="font-mono text-2xl font-bold text-white leading-none mb-1">
                                                    {s.v}
                                                </p>
                                                <p className="text-amber-100 text-[9px] font-bold uppercase tracking-widest">
                                                    {s.l}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </FadeUp>

                        <div>
                            <FadeUp>
                                <SectionLabel className="justify-start">
                                    Program Nasional
                                </SectionLabel>
                            </FadeUp>
                            <FadeUp delay={0.08}>
                                <SectionHeading className="mb-6">
                                    Mengenal Program{" "}
                                    <span className="text-amber-600">
                                        Bangga Kencana
                                    </span>
                                </SectionHeading>
                            </FadeUp>
                            <FadeUp delay={0.14}>
                                <p className="text-slate-600 text-lg leading-relaxed mb-8">
                                    Program pembangunan keluarga berkelanjutan
                                    untuk menjadikan keluarga sebagai tiang
                                    negara yang mandiri secara holistik.
                                </p>
                            </FadeUp>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    "Usia Perkawinan",
                                    "Jarak Kelahiran",
                                    "Ketahanan Keluarga",
                                    "Kualitas SDM Muda",
                                ].map((item, i) => (
                                    <FadeUp key={i} delay={0.2 + i * 0.08}>
                                        <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-amber-100 transition-colors group">
                                            <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                                <Icons.Check />
                                            </div>
                                            <p className="font-bold text-slate-700 text-xs uppercase tracking-tight">
                                                {item}
                                            </p>
                                        </div>
                                    </FadeUp>
                                ))}
                            </div>
                            <FadeUp delay={0.4}>
                                <a
                                    href="#layanan"
                                    className="mt-10 inline-flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                                >
                                    Eksplorasi Program{" "}
                                    <Icons.ChevRight size={18} />
                                </a>
                            </FadeUp>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════
                6. STUNTING — Professional Alert layout
            ════════════════════════════════════════════════════════ */}
            <section
                id="stunting"
                className="py-24 sm:py-32 bg-slate-50/50 border-y border-slate-200"
            >
                <div className="max-w-7xl mx-auto px-6 sm:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                        <div className="lg:col-span-12 text-center mb-12">
                            <FadeUp>
                                <SectionLabel>Misi Nasional</SectionLabel>
                            </FadeUp>
                            <FadeUp delay={0.08}>
                                <SectionHeading>
                                    Bersama Kita{" "}
                                    <UnderlineHighlight>
                                        Stop Stunting!
                                    </UnderlineHighlight>
                                </SectionHeading>
                            </FadeUp>
                        </div>

                        <div className="lg:col-span-7">
                            <FadeUp delay={0.14}>
                                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 mb-8">
                                    <div className="flex gap-4 items-start">
                                        <div className="p-3 bg-amber-400 text-slate-900 rounded-xl">
                                            <Icons.Activity size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 text-xl mb-3 leading-tight tracking-tight">
                                                Ancaman Nyata Masa Depan
                                            </h3>
                                            <p className="text-slate-600 text-base leading-relaxed">
                                                Stunting bukan sekadar tinggi
                                                badan, tapi ancaman bagi
                                                perkembangan otak. Cegah sejak
                                                dini melalui{" "}
                                                <strong>
                                                    1.000 Hari Pertama Kehidupan
                                                    (HPK).
                                                </strong>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </FadeUp>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    {
                                        t: "Tablet Tambah Darah",
                                        d: "Rutin untuk remaja putri & ibu hamil.",
                                    },
                                    {
                                        t: "Pemeriksaan ANC",
                                        d: "Minimal 6x rutin di puskesmas.",
                                    },
                                    {
                                        t: "ASI Eksklusif",
                                        d: "Lanjut MPASI bergizi variasi.",
                                    },
                                    {
                                        t: "Sanitasi Bersih",
                                        d: "Cuci tangan pakai sabun rutin.",
                                    },
                                ].map((item, i) => (
                                    <FadeUp key={i} delay={0.2 + i * 0.08}>
                                        <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-amber-200 transition-colors">
                                            <div className="font-mono text-xl font-bold text-slate-300 mb-3">
                                                0{i + 1}
                                            </div>
                                            <h4 className="font-bold text-slate-900 text-sm uppercase tracking-tight mb-2">
                                                {item.t}
                                            </h4>
                                            <p className="text-slate-500 text-xs leading-relaxed">
                                                {item.d}
                                            </p>
                                        </div>
                                    </FadeUp>
                                ))}
                            </div>
                        </div>

                        <div className="lg:col-span-5 relative">
                            <FadeUp
                                delay={0.3}
                                className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white"
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?q=80&w=800"
                                    alt="Cegah Stunting"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-slate-900/80 to-transparent">
                                    <p className="text-white font-bold text-lg mb-1 leading-tight tracking-tight italic">
                                        "Cegah Stunting itu Penting!"
                                    </p>
                                    <p className="text-amber-200 text-[10px] font-bold uppercase tracking-widest">
                                        Kampanye Nasional 2024
                                    </p>
                                </div>
                            </FadeUp>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════
                7. TRIBINA — Modern Program Grid
            ════════════════════════════════════════════════════════ */}
            <section id="tribina" className="py-24 sm:py-32 bg-white">
                <div className="max-w-7xl mx-auto px-6 sm:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-20">
                        <FadeUp>
                            <SectionLabel>Kelompok Kegiatan</SectionLabel>
                        </FadeUp>
                        <FadeUp delay={0.08}>
                            <SectionHeading className="mb-6">
                                Bina Kelompok Masyarakat{" "}
                                <UnderlineHighlight>TRIBINA</UnderlineHighlight>
                            </SectionHeading>
                        </FadeUp>
                        <FadeUp delay={0.14}>
                            <p className="text-slate-500 text-lg">
                                Pendampingan ketahanan seluruh siklus hidup
                                manusia melalui kelompok kegiatan di lini
                                lapangan.
                            </p>
                        </FadeUp>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {programs.map((p, i) => (
                            <ProgramCard key={i} index={i} {...p} />
                        ))}
                    </div>

                    {/* Compact stats strip */}
                    <FadeUp
                        delay={0.3}
                        className="mt-12 flex flex-wrap justify-center gap-4 sm:gap-8 p-8 bg-slate-50 rounded-xl border border-slate-100"
                    >
                        {[
                            { v: "42", l: "Kelompok Aktif" },
                            { v: "860+", l: "Anggota" },
                            { v: "4x/bln", l: "Pertemuan" },
                            { v: "18", l: "Kader Ahli" },
                        ].map((s, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-3 px-2"
                            >
                                <span className="font-['JetBrains_Mono',_monospace] text-2xl font-bold text-slate-900">
                                    {s.v}
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                    {s.l}
                                </span>
                            </div>
                        ))}
                    </FadeUp>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════
                8. STATISTIK — Modern Analytics Style
            ════════════════════════════════════════════════════════ */}
            <section
                id="statistik"
                className="py-24 sm:py-32 bg-slate-900 relative overflow-hidden"
            >
                {/* Background light pulse */}
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px]" />

                <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
                    <div className="text-center mb-20">
                        <FadeUp>
                            <div className="flex items-center justify-center gap-2 mb-4">
                                <span className="w-8 h-[1px] bg-white/20" />
                                <p className="text-amber-400 font-bold text-[10px] uppercase tracking-[0.2em]">
                                    Data Real-Time
                                </p>
                                <span className="w-8 h-[1px] bg-white/20" />
                            </div>
                            <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">
                                Indikator Kepuasan Masyarakat
                            </h2>
                        </FadeUp>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard
                            value={totalResponden}
                            suffix="+"
                            label="Total Responden"
                            icon={Icons.Users}
                            delay={0}
                        />
                        <StatCard
                            value={rataKepuasan}
                            suffix=""
                            label="Indeks Kepuasan"
                            icon={Icons.Star}
                            delay={0.1}
                        />
                        <StatCard
                            value={persentasePuas}
                            suffix="%"
                            label="Rasio Sangat Puas"
                            icon={Icons.Heart}
                            delay={0.2}
                        />
                    </div>

                    {/* Analytics Dashboard Mockup style distribution */}
                    <FadeUp
                        delay={0.3}
                        className="mt-8 bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                            <div>
                                <h3 className="text-white font-bold text-lg tracking-tight mb-1">
                                    Distribusi Penilaian
                                </h3>
                                <p className="text-white/40 text-xs">
                                    Berdasarkan data kuesioner periode berjalan
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                                <span className="w-3 h-3 rounded-full bg-amber-500" />
                                <span className="w-3 h-3 rounded-full bg-amber-500" />
                            </div>
                        </div>

                        <div className="space-y-6">
                            {[
                                {
                                    label: "Sangat Puas",
                                    pct: 94,
                                    color: "bg-emerald-500",
                                },
                                {
                                    label: "Puas",
                                    pct: 4,
                                    color: "bg-amber-500",
                                },
                                {
                                    label: "Cukup",
                                        pct: 1.5,
                                    color: "bg-amber-500",
                                },
                                {
                                    label: "Kurang",
                                    pct: 0.5,
                                    color: "bg-rose-500",
                                },
                            ].map((row, i) => (
                                <div key={i} className="group">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest">
                                            {row.label}
                                        </span>
                                        <span className="text-white font-mono text-xs font-bold">
                                            {row.pct}%
                                        </span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${row.color} rounded-full`}
                                            style={{ width: `${row.pct}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </FadeUp>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════
                9. GALERI — Visual Storytelling
            ════════════════════════════════════════════════════════ */}
            <section id="galeri" className="py-24 sm:py-32 bg-white">
                <div className="max-w-7xl mx-auto px-6 sm:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-20">
                        <FadeUp>
                            <SectionLabel>Dokumentasi</SectionLabel>
                        </FadeUp>
                        <FadeUp delay={0.08}>
                            <SectionHeading className="mb-6">
                                Momen <span className="text-amber-600">Kegiatan</span>
                            </SectionHeading>
                        </FadeUp>
                    </div>

                    {galleries.length === 0 ? (
                        <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                                <Icons.Map size={32} className="text-slate-300" />
                            </div>
                            <p className="font-bold text-slate-800 text-lg mb-2">
                                Belum Ada Dokumentasi
                            </p>
                            <p className="text-slate-500 text-sm max-w-xs mx-auto">
                                Admin belum mengunggah foto kegiatan terbaru ke dalam sistem.
                            </p>
                        </div>
                    ) : (
                        <div className="relative overflow-hidden -mx-6 sm:-mx-8 lg:-mx-20 [mask-image:linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)]">
                            <div className="space-y-4 sm:space-y-8">
                                <HorizontalMarquee 
                                    items={galleries.slice(0, Math.ceil(galleries.length / 2))} 
                                    speed={60}
                                    onImageClick={(item) => setSelectedImage(item)}
                                />
                                {galleries.length > 1 && (
                                    <HorizontalMarquee 
                                        items={galleries.slice(Math.ceil(galleries.length / 2))} 
                                        speed={80} 
                                        reverse={true}
                                        onImageClick={(item) => setSelectedImage(item)}
                                    />
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <ImageModal 
                    isOpen={!!selectedImage} 
                    onClose={() => setSelectedImage(null)}
                    image={selectedImage ? `/storage/${selectedImage.image}` : ""}
                    title={selectedImage?.title || ""}
                />
            </section>

            {/* ══════════════════════════════════════════════════════
                11. TESTIMOMIALS — Clean social proof
            ════════════════════════════════════════════════════════ */}
            <section id="testimoni" className="py-24 sm:py-32 bg-white">
                <div className="max-w-7xl mx-auto px-6 sm:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-20">
                        <FadeUp>
                            <SectionLabel>Ulasan Masyarakat</SectionLabel>
                        </FadeUp>
                        <FadeUp delay={0.08}>
                            <SectionHeading className="mb-6">
                                Suara Hati{" "}
                                <span className="text-amber-600">
                                    Keluarga Sahabat
                                </span>
                            </SectionHeading>
                        </FadeUp>
                        <FadeUp delay={0.14}>
                            <p className="text-slate-500 text-lg">
                                Ulasan jujur dari masyarakat yang telah
                                merasakan manfaat pelayanan terpadu kami.
                            </p>
                        </FadeUp>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {testimonials.map((t, i) => (
                            <TestimonialCard key={i} delay={i * 0.1} {...t} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════
                12. MITOS VS FAKTA — Modern Grid Comparison
            ════════════════════════════════════════════════════════ */}
            <section className="py-24 sm:py-32 bg-slate-50 border-y border-slate-200">
                <div className="max-w-7xl mx-auto px-6 sm:px-8">
                    <div className="text-center mb-20">
                        <FadeUp>
                            <SectionLabel>Edukasi KB</SectionLabel>
                        </FadeUp>
                        <FadeUp delay={0.08}>
                            <SectionHeading className="mb-6">
                                Mitos <span className="text-amber-600">vs</span>{" "}
                                Fakta Alat KB
                            </SectionHeading>
                        </FadeUp>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
                        {[
                            {
                                myth: "KB Spiral (IUD) bisa berjalan sampai ke jantung dan paru-paru.",
                                fact: "IUD hanya berdiam di rahim dan terikat benang halus. Tidak memiliki akses ke aliran darah untuk berpindah organ.",
                                icon: <Icons.Shield />,
                            },
                            {
                                myth: "Suntik KB bikin rahim kering dan susah hamil lagi selamanya.",
                                fact: "Kesuburan segera kembali normal setelah efek obat hilang. Rahim kering hanyalah istilah keliru untuk siklus yang belum stabil.",
                                icon: <Icons.Activity />,
                            },
                            {
                                myth: "Pil KB bikin gemuk, jerawatan, dan membuat wajah kusam.",
                                fact: "Pil modern dosis rendah justru membantu menjaga kestabilan hormon dan sering digunakan untuk menghaluskan kulit.",
                                icon: <Icons.Star />,
                            },
                            {
                                myth: "KB Pria (Vasektomi) sama dengan kebiri dan menghilangkan kejantanan.",
                                fact: "Vasektomi hanya memutus saluran sperma. Tidak mempengaruhi hormon testosteron, gairah, maupun kemampuan seksual.",
                                icon: <Icons.Leaf />,
                            },
                            {
                                myth: "Ibu menyusui tidak akan hamil karena menyusui adalah KB alami.",
                                fact: "Hanya efektif jika menyusui eksklusif & belum haid. Risiko hamil tetap tinggi tanpa bantuan alat kontrasepsi.",
                                icon: <Icons.Baby />,
                            },
                            {
                                myth: "Alat kontrasepsi dapat menyebabkan kemandulan permanen.",
                                fact: "Semua metode KB bersifat reversibel (dapat dihentikan). Setelah berhenti, fungsi reproduksi akan normal kembali.",
                                icon: <Icons.Heart />,
                            },
                        ].map((item, i) => (
                            <FadeUp key={i} delay={i * 0.1}>
                                <div className="group relative bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden h-full">
                                    <div className="relative z-10 flex flex-col h-full">
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shrink-0 border border-amber-100 group-hover:scale-110 transition-transform">
                                                {item.icon}
                                            </div>
                                            <div className="h-px flex-1 bg-slate-100" />
                                        </div>
                                        
                                        <div className="space-y-6">
                                            <div className="relative pl-6 border-l-2 border-rose-200">
                                                <span className="absolute -left-1 top-0 w-2 h-2 rounded-full bg-rose-500" />
                                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-rose-500 mb-2">Mitos</p>
                                                <p className="text-slate-900 font-bold text-lg leading-tight tracking-tight italic">"{item.myth}"</p>
                                            </div>

                                            <div className="relative pl-6 border-l-2 border-emerald-200">
                                                <span className="absolute -left-1 top-0 w-2 h-2 rounded-full bg-emerald-500" />
                                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-500 mb-2">Fakta</p>
                                                <p className="text-slate-600 text-base leading-relaxed">{item.fact}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="absolute -bottom-8 -right-8 opacity-[0.03] rotate-12 scale-[3] text-slate-900">
                                        {item.icon}
                                    </div>
                                </div>
                            </FadeUp>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════
                13. TEAM — Clean & Professional Cards
            ══════════════════════════════════════════════════════ */}
            <section className="py-24 bg-slate-50 overflow-hidden relative">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-20">
                        <FadeUp>
                            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.4em] mb-4 block">
                                OUR TEAM
                            </span>
                            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 tracking-tighter">
                                Meet Our Team Members
                            </h2>
                            <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
                                Individu berdedikasi tinggi yang berkomitmen untuk memberikan pelayanan KB terbaik & pengabdian tulus bagi masyarakat.
                            </p>
                        </FadeUp>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {teams.length > 0 ? (
                            teams.map((member, i) => (
                                <FadeUp key={member.id} delay={i * 0.1}>
                                    <div className="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
                                        <div className="aspect-[4/5] overflow-hidden relative">
                                            <img 
                                                src={member.photo_url} 
                                                alt={member.name}
                                                className="w-full h-full object-cover transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        
                                        <div className="p-6 flex items-center justify-between border-t border-slate-100">
                                            <div>
                                                <h4 className="text-slate-900 font-bold text-lg mb-0.5 tracking-tight group-hover:text-amber-600 transition-colors uppercase">
                                                    {member.name}
                                                </h4>
                                                <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest leading-none">
                                                    {member.role}
                                                </p>
                                            </div>
                                            
                                            <div className="relative group/share">
                                                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover/share:bg-amber-100 group-hover/share:text-amber-600 transition-all cursor-pointer">
                                                    <Icons.Share size={16} />
                                                </div>
                                                
                                                <div className="absolute bottom-full right-0 mb-4 flex gap-2 opacity-0 translate-y-2 pointer-events-none group-hover/share:opacity-100 group-hover/share:translate-y-0 group-hover/share:pointer-events-auto transition-all duration-300">
                                                    {member.instagram && (
                                                        <a href={member.instagram} target="_blank" className="w-8 h-8 rounded-full bg-white shadow-xl flex items-center justify-center text-slate-600 hover:text-amber-600 transition-colors">
                                                            <Icons.Activity size={12} />
                                                        </a>
                                                    )}
                                                    {member.twitter && (
                                                        <a href={member.twitter} target="_blank" className="w-8 h-8 rounded-full bg-white shadow-xl flex items-center justify-center text-slate-600 hover:text-amber-600 transition-colors">
                                                            <Icons.Mail size={12} />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </FadeUp>
                            ))
                        ) : (
                            [1,2,3,4].map(i => (
                                <FadeUp key={i} delay={i * 0.1}>
                                    <div className="bg-white rounded-3xl p-8 border border-dashed border-slate-300 flex flex-col items-center justify-center h-48 sm:h-auto text-center grayscale opacity-50">
                                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                            <Icons.Users size={24} />
                                        </div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Team Member Slot</p>
                                    </div>
                                </FadeUp>
                            ))
                        )}
                    </div>
                </div>
            </section>


            {/* ══════════════════════════════════════════════════════
                14. FAQ — Clean Accordion Style
            ════════════════════════════════════════════════════════ */}
            <section id="faq" className="py-24 sm:py-32 bg-white">
                <div className="max-w-3xl mx-auto px-6 sm:px-8">
                    <div className="text-center mb-16">
                        <FadeUp>
                            <SectionLabel>Pertanyaan Umum</SectionLabel>
                        </FadeUp>
                        <FadeUp delay={0.08}>
                            <SectionHeading className="mb-6">
                                Tanya Jawab{" "}
                                <span className="text-amber-600">
                                    Seputar Layanan
                                </span>
                            </SectionHeading>
                        </FadeUp>
                    </div>
                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <FadeUp key={idx} delay={idx * 0.06}>
                                <FAQItem
                                    q={faq.q}
                                    a={faq.a}
                                    isOpen={openFaq === idx}
                                    onToggle={() =>
                                        setOpenFaq(openFaq === idx ? null : idx)
                                    }
                                />
                            </FadeUp>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════
                14. SURVEI CTA — High Conversion Dark Section
            ════════════════════════════════════════════════════════ */}
            <section id="survei" className="py-24 sm:py-40 relative overflow-hidden bg-white">
                <div className="max-w-7xl mx-auto px-6 sm:px-8">
                    <div className="relative isolate overflow-hidden bg-slate-900 px-8 py-20 lg:p-24 shadow-2xl rounded-[3rem] lg:rounded-[4rem] border border-white/10">
                        {/* High-end Radial Glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-amber-500/5 to-transparent -z-10 blur-3xl opacity-50" />
                        
                        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
                            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-amber-400 to-indigo-500 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'}}></div>
                        </div>

                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                            <div>
                                <FadeUp>
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 font-bold text-[10px] uppercase tracking-widest mb-8">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                                        Formulir Survei Kepuasan
                                    </div>
                                    <h2 className="text-4xl lg:text-6xl font-bold text-white mb-8 leading-[1.1] tracking-tight text-balance">
                                        Suara Anda Adalah{" "}
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-indigo-300">
                                            Prioritas Terdepan.
                                        </span>
                                    </h2>
                                    <p className="text-slate-400 text-lg sm:text-xl leading-relaxed mb-12 max-w-xl">
                                        Setiap aspirasi Anda adalah navigasi bagi kami untuk memberikan pelayanan kesehatan yang lebih prima & transparan.
                                    </p>
                                </FadeUp>

                                <FadeUp delay={0.2} className="flex flex-col sm:flex-row items-center gap-6">
                                    <div className="flex -space-x-4">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <div key={i} className="w-12 h-12 rounded-full border-4 border-slate-900 shadow-xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-300">
                                                <img src={`https://ui-avatars.com/api/?name=U${i}&background=${i % 2 ? 'f59e0b' : '6366f1'}&color=fff&bold=true`} alt="User" />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <p className="text-white font-bold text-lg mb-0.5 tracking-tight">
                                            {totalResponden}+ Responden Terdaftar
                                        </p>
                                        <p className="text-slate-500 text-sm font-medium">Telah berkontribusi memberikan masukan berharga</p>
                                    </div>
                                </FadeUp>
                            </div>

                            <FadeUp delay={0.3}>
                                <div className="relative p-1">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-amber-400 to-indigo-500 rounded-[2.5rem] blur opacity-20" />
                                    <div className="relative bg-white rounded-[2.5rem] p-8 lg:p-12 shadow-inner group">
                                        <div className="text-center mb-10">
                                            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-amber-600 shadow-sm transition-transform duration-500 group-hover:rotate-12">
                                                <Icons.Activity size={32} />
                                            </div>
                                            <h3 className="text-slate-900 font-bold text-2xl mb-2 tracking-tight">
                                                Isi Kuesioner Sekarang
                                            </h3>
                                            <p className="text-slate-500 text-sm font-medium">
                                                Data terjamin anonimitasnya & diolah secara profesional.
                                            </p>
                                        </div>

                                        <div className="space-y-4 mb-10">
                                            {[
                                                { icon: <Icons.Shield size={18} />, text: "Layanan Aman & Terpecaya" },
                                                { icon: <Icons.Star size={18} />, text: "Penilaian Kepuasan Terpadu" }
                                            ].map((row, i) => (
                                                <div key={row.text} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-slate-600 font-semibold text-sm">
                                                    <span className="text-amber-500">{row.icon}</span>
                                                    {row.text}
                                                </div>
                                            ))}
                                        </div>

                                        <Link
                                            href={route("survey.index")}
                                            className="relative flex items-center justify-center gap-3 w-full py-5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl transition-all shadow-2xl shadow-indigo-200 group/btn overflow-hidden"
                                        >
                                            <span className="relative z-10 flex items-center gap-3">
                                                Buka Lembar Kuesioner
                                                <Icons.ChevRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                                            </span>
                                            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                                        </Link>

                                        <div className="mt-8 flex justify-center items-center gap-6 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                                            <Icons.Lock size={16} />
                                            <div className="w-px h-4 bg-slate-300" />
                                            <Icons.Users size={16} />
                                            <div className="w-px h-4 bg-slate-300" />
                                            <Icons.Award size={16} />
                                        </div>
                                    </div>
                                </div>
                            </FadeUp>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer handles above by GuestLayout */}
        </GuestLayout>
    );
}
