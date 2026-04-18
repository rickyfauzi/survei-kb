import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FiMenu, FiX, FiMapPin, FiMail, FiPhone } from 'react-icons/fi';

export default function Guest({ children }) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Beranda', href: '#beranda' },
        { name: 'Layanan', href: '#layanan' },
        { name: 'Tentang', href: '#tentang' },
        { name: 'Program', href: '#bangga-kencana' },
        { name: 'Stunting', href: '#stunting' },
        { name: 'Tanya Jawab', href: '#faq' },
    ];

    const scrollToSection = (e, id) => {
        e.preventDefault();
        const element = document.querySelector(id);
        if (element) {
            const offset = 100;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            setMobileMenuOpen(false);
        }
    };

    return (
        <div className="min-h-screen bg-white font-['Instrument_Sans',_sans-serif] selection:bg-amber-600 selection:text-white">
            
            {/* NAVIGASI — Clean Flat Style (ShadcnStore-inspired) */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-sm' : 'bg-transparent'}`}>
                <div className="max-w-7xl mx-auto px-6 sm:px-10">
                    <div className="flex justify-between items-center h-[72px]">
                        {/* Logo */}
                        <a href="#beranda" onClick={(e) => scrollToSection(e, '#beranda')} className="flex items-center gap-3 group cursor-pointer">
                            <div className="w-10 h-10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                                <img 
                                    src="/1000492763-removebg-preview.png" 
                                    alt="Balai KB Argapura" 
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <span className="font-extrabold text-lg text-slate-900 tracking-tight">
                                Balai KB <span className="text-amber-600">Argapura</span>
                            </span>
                        </a>

                        {/* Center Nav Links */}
                        <div className="hidden lg:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <a 
                                    key={link.name} 
                                    href={link.href} 
                                    onClick={(e) => scrollToSection(e, link.href)}
                                    className="px-4 py-2 rounded-lg text-[13px] font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all duration-200"
                                >
                                    {link.name}
                                </a>
                            ))}
                        </div>

                        {/* Right Side */}
                        <div className="hidden lg:flex gap-3 items-center">
                            <a 
                                href="#survei" 
                                onClick={(e) => scrollToSection(e, '#survei')} 
                                className="px-5 py-2.5 text-sm font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all duration-200"
                            >
                                Login
                            </a>
                            <a 
                                href="#survei" 
                                onClick={(e) => scrollToSection(e, '#survei')} 
                                className="px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-all duration-200"
                            >
                                Isi Survei
                            </a>
                        </div>

                        {/* Mobile Toggle */}
                        <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2.5 bg-white rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors">
                            <FiMenu size={22} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Nav Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-slate-900/20 backdrop-blur-md lg:hidden flex justify-end"
                    >
                        <motion.div 
                            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col pt-8 px-8"
                        >
                            <div className="flex justify-between items-center mb-10">
                                <span className="font-bold text-slate-900 text-2xl tracking-tighter">Navigasi <span className="text-amber-600">Terpadu</span></span>
                                <button onClick={() => setMobileMenuOpen(false)} className="p-3 bg-slate-100 rounded-2xl text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors"><FiX size={20}/></button>
                            </div>
                            <div className="flex flex-col gap-3">
                                {navLinks.map((link) => (
                                    <a key={link.name} onClick={(e) => scrollToSection(e, link.href)} href={link.href} className="text-slate-700 font-semibold p-5 bg-slate-50 rounded-[2rem] hover:bg-amber-50 hover:text-amber-600 transition-all border border-transparent hover:border-amber-100">
                                        {link.name}
                                    </a>
                                ))}
                            </div>
                            <div className="mt-auto pb-10 flex flex-col gap-5">
                                <a onClick={(e) => scrollToSection(e, '#survei')} href="#survei" className="w-full text-center bg-amber-400 text-amber-950 py-5 rounded-[2rem] font-bold shadow-xl shadow-amber-400/20 uppercase tracking-widest text-sm">Mulai Isi Survei</a>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <main>{children}</main>

            {/* 15. MEGA FOOTER BKKBN (Indigo & Amber) */}
            <footer className="bg-slate-50 border-t border-slate-100 relative overflow-hidden" id="kontak">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-50/50 rounded-full blur-[120px] pointer-events-none"></div>
                
                <div className="max-w-7xl mx-auto px-8 sm:px-10 lg:px-12 py-24 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
                        
                        <div className="lg:col-span-1">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-amber-600 text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-xl shadow-amber-100">
                                    KB
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-xl tracking-tighter leading-none mb-1">BALAI KB <span className="text-amber-600">ARGAPURA</span></h3>
                                    <p className="text-[10px] font-bold text-amber-500 tracking-[0.3em] uppercase">Bangga Kencana</p>
                                </div>
                            </div>
                            <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium">Lembaga terpercaya dalam mewujudkan keluarga sehat, berencana, dan berkualitas melalui pendampingan siklus hidup manusia.</p>
                        </div>

                        <div>
                            <h4 className="font-bold text-slate-900 text-sm uppercase tracking-widest mb-8 border-l-4 border-amber-400 pl-4">Akses Layanan</h4>
                            <ul className="space-y-4 font-semibold text-slate-500 text-sm">
                                <li><a href="#layanan" onClick={(e) => scrollToSection(e, '#layanan')} className="hover:text-amber-600 hover:translate-x-1 inline-flex transition-all">Layanan Unggulan</a></li>
                                <li><a href="#stunting" onClick={(e) => scrollToSection(e, '#stunting')} className="hover:text-amber-600 hover:translate-x-1 inline-flex transition-all">Cegah Stunting</a></li>
                                <li><a href="#faq" onClick={(e) => scrollToSection(e, '#faq')} className="hover:text-amber-600 hover:translate-x-1 inline-flex transition-all">Pusat Bantuan</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-slate-900 text-sm uppercase tracking-widest mb-8 border-l-4 border-amber-400 pl-4">Program Unggulan</h4>
                            <ul className="space-y-4 font-semibold text-slate-500 text-sm">
                                <li className="hover:text-amber-600 transition-colors cursor-pointer">Bina Keluarga Balita (BKB)</li>
                                <li className="hover:text-amber-600 transition-colors cursor-pointer">PIK Remaja & Elsimil</li>
                                <li className="hover:text-amber-600 transition-colors cursor-pointer">Bina Keluarga Lansia</li>
                                <li className="hover:text-amber-600 transition-colors cursor-pointer">Audit Kasus Stunting</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-slate-900 text-sm uppercase tracking-widest mb-8 border-l-4 border-amber-400 pl-4">Alamat Kantor</h4>
                            <ul className="space-y-5 font-semibold text-slate-500 text-sm">
                                <li className="flex items-start gap-4 leading-relaxed">
                                    <FiMapPin className="text-amber-600 mt-1 shrink-0" size={18} />
                                    <span>Jl. Raya Kencana No. 12, Komplek Perkantoran Terpadu, Indonesia 40001</span>
                                </li>
                                <li className="flex items-center gap-4">
                                    <FiPhone className="text-amber-600 shrink-0" size={18} />
                                    <span>+62 21-8899-7766</span>
                                </li>
                                <li className="flex items-center gap-4">
                                    <FiMail className="text-amber-600 shrink-0" size={18} />
                                    <span>info@balaikb.go.id</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-10 border-t border-slate-200 text-center flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-xs font-bold text-slate-400">© 2026 Badan Kependudukan dan Keluarga Berencana Nasional. Seluruh layanan gratis.</p>
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sertifikasi</span>
                            <div className="flex gap-2">
                                <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-[10px] font-black text-amber-600">ISO</div>
                                <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-[10px] font-black text-amber-600">WTP</div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
