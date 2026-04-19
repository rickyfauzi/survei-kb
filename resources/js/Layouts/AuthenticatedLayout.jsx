import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiHome, FiList, FiUsers, FiImage, FiSettings, 
    FiLogOut, FiMenu, FiX, FiSearch, FiBell, FiChevronDown, FiGrid, FiBarChart2
} from 'react-icons/fi';
import Dropdown from '@/Components/Dropdown';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 1024) setSidebarOpen(true);
            else setSidebarOpen(false);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const menuItems = [
        { name: 'Dashboard', route: 'admin.dashboard', icon: <FiHome size={17} /> },
        { name: 'Kuesioner', route: 'admin.questions.index', icon: <FiList size={17} /> },
        { name: 'Data Responden', route: 'admin.responses.index', icon: <FiUsers size={17} /> },
        { name: 'Statistik', route: 'admin.reports.index', icon: <FiBarChart2 size={17} /> },
        { name: 'Laporan Lengkap', route: 'admin.reports.full', icon: <FiGrid size={17} /> },
        { name: 'Manajemen Tim', route: 'admin.teams.index', icon: <FiUsers size={17} /> },
        { name: 'Galeri', route: 'admin.gallery.index', icon: <FiImage size={17} /> },
    ];

    const isCurrentRoute = (routeName) => route().current(routeName) || route().current(routeName.replace('.index', '.*'));

    return (
        <div className="min-h-screen flex font-['Instrument_Sans',_sans-serif] bg-[#f3f3f9] text-slate-700">
            
            {/* Mobile Overlay */}
            <AnimatePresence>
                {sidebarOpen && window.innerWidth < 1024 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/30 z-40 lg:hidden" />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside 
                initial={false}
                animate={{ x: sidebarOpen ? 0 : '-100%', width: '250px' }}
                transition={{ type: "spring", stiffness: 400, damping: 40 }}
                className="fixed lg:relative inset-y-0 left-0 z-50 flex flex-col print:hidden"
                style={{ minWidth: '250px', background: 'linear-gradient(to bottom, #405189, #2b3a6e)' }}
            >
                {/* Logo */}
                <div className="h-[70px] flex items-center px-6 shrink-0">
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-white/20 rounded-sm flex items-center justify-center text-white text-[11px] font-black">KB</div>
                        <span className="font-bold text-[15px] text-white tracking-tight">BALAI KB <span className="font-normal text-white/60 text-xs">Argapura</span></span>
                    </Link>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden ml-auto text-white/60 hover:text-white"><FiX size={20} /></button>
                </div>

                {/* Menu */}
                <nav className="flex-1 px-4 py-4 space-y-0.5 overflow-y-auto sidebar-scroll">
                    <p className="text-[10px] font-semibold text-white/40 uppercase tracking-widest px-3 mb-3 mt-2">Menu</p>
                    {menuItems.map((item) => {
                        const active = isCurrentRoute(item.route);
                        return (
                            <Link key={item.name} href={route(item.route)}
                                className={`flex items-center gap-3 px-3 py-[9px] text-[13px] rounded-sm transition-all ${
                                    active ? 'bg-white/15 text-white font-semibold' : 'text-white/60 hover:text-white hover:bg-white/8'
                                }`}>
                                <span className={active ? 'text-white' : 'text-white/50'}>{item.icon}</span>
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* User */}
                <div className="p-4 border-t border-white/10">
                    <Dropdown>
                        <Dropdown.Trigger>
                            <button className="w-full flex items-center gap-3 px-2 py-2 rounded-sm hover:bg-white/10 transition-all">
                                <img src={`https://ui-avatars.com/api/?name=${user.name}&background=ffffff&color=405189&bold=true&size=32`} alt="" className="w-8 h-8 rounded-sm" />
                                <div className="text-left flex-1 min-w-0">
                                    <p className="text-[12px] font-semibold text-white truncate">{user.name}</p>
                                    <p className="text-[10px] text-white/40">Administrator</p>
                                </div>
                                <FiChevronDown size={14} className="text-white/40 shrink-0" />
                            </button>
                        </Dropdown.Trigger>
                        <Dropdown.Content align="top" width="w-48" contentClasses="bg-white border border-slate-200 rounded-sm py-1 shadow-lg mb-2">
                            <Dropdown.Link href={route('profile.edit')} className="flex items-center gap-2 py-2 px-3 text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-900">
                                <FiSettings size={14}/> Pengaturan
                            </Dropdown.Link>
                            <Dropdown.Link href={route('home')} className="flex items-center gap-2 py-2 px-3 text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-900">
                                <FiHome size={14}/> Halaman Publik
                            </Dropdown.Link>
                            <div className="border-t border-slate-100 my-1"></div>
                            <Dropdown.Link href={route('logout')} method="post" as="button" className="flex items-center gap-2 py-2 px-3 text-xs text-red-600 hover:bg-red-50 w-full text-left">
                                <FiLogOut size={14}/> Keluar
                            </Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>
                </div>
            </motion.aside>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                
                {/* Header */}
                <header className="h-[70px] px-6 flex items-center justify-between shrink-0 bg-white border-b border-slate-200/80 sticky top-0 z-20 print:hidden shadow-sm">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-sm"><FiMenu size={20} /></button>
                        {header && <div className="text-base font-semibold text-slate-800">{typeof header === 'string' ? header : header}</div>}
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="hidden md:flex relative">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <input type="text" placeholder="Cari data..." className="bg-slate-50 border border-slate-200 px-8 py-[7px] text-[13px] focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 w-52 rounded-sm placeholder:text-slate-400" />
                        </div>
                        <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-sm">
                            <FiBell size={17} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-[1400px] mx-auto">
                        <AnimatePresence mode="wait">
                            <motion.div key={usePage().url} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}>
                                {children}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>
            </div>

            <style jsx global>{`
                .sidebar-scroll::-webkit-scrollbar { width: 3px; }
                .sidebar-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 10px; }
                .card { background: #fff; border: 1px solid #e9ebec; border-radius: 4px; box-shadow: 0 1px 2px rgba(56,65,74,0.03); }
                .card-header { padding: 16px 16px 0; }
                .card-body { padding: 16px; }
                @media print { .print\\:hidden { display: none !important; } }
            `}</style>
        </div>
    );
}
