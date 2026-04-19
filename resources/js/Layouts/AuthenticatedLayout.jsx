import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiHome, FiList, FiUsers, FiImage, FiSettings, 
    FiLogOut, FiMenu, FiX, FiSearch, FiBell, FiChevronRight
} from 'react-icons/fi';
import Dropdown from '@/Components/Dropdown';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 1024) setSidebarOpen(true);
            else setSidebarOpen(false);
        };
        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const menuItems = [
        { name: 'Dashboard', route: 'admin.dashboard', icon: <FiHome size={20} /> },
        { name: 'Kuesioner', route: 'admin.questions.index', icon: <FiList size={20} /> },
        { name: 'Data Responden', route: 'admin.responses.index', icon: <FiUsers size={20} /> },
        { name: 'Statistik', route: 'admin.reports.index', icon: <FiList size={20} /> },
        { name: 'Laporan Lengkap', route: 'admin.reports.full', icon: <FiList size={20} /> },
        { name: 'Manajemen Tim', route: 'admin.teams.index', icon: <FiUsers size={20} /> },
        { name: 'Galeri', route: 'admin.gallery.index', icon: <FiImage size={20} /> },
    ];

    const isCurrentRoute = (routeName) => route().current(routeName) || route().current(routeName.replace('.index', '.*'));

    return (
        <div className="min-h-screen flex font-sans text-slate-300" style={{ backgroundColor: '#0B0F19' }}>
            
            {/* MOBILE OVERLAY */}
            <AnimatePresence>
                {sidebarOpen && window.innerWidth < 1024 && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 bg-[#0B0F19]/80 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* SIDEBAR - DASHDARK X STYLE */}
            <motion.aside 
                initial={false}
                animate={{ 
                    x: sidebarOpen ? 0 : '-100%',
                    width: '260px'
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed lg:relative inset-y-0 left-0 bg-[#111827] border-r border-slate-800/80 z-50 flex flex-col shadow-2xl lg:shadow-none"
            >
                {/* Brand Logo */}
                <div className="h-20 flex items-center justify-between px-6 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded shrink-0 bg-blue-500 flex items-center justify-center">
                            <div className="w-4 h-4 bg-white rounded-sm rotate-45"></div>
                        </div>
                        <span className="font-bold text-xl tracking-wide text-white">
                            Survei<span className="text-blue-500">App</span>
                        </span>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
                        <FiX size={24} />
                    </button>
                </div>

                {/* Navbar Items */}
                <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
                    {/* Search Mockup */}
                    <div className="relative mb-6">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input type="text" placeholder="Search for..." className="w-full bg-[#1F2937] border border-slate-700/50 rounded-lg py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-200 placeholder-slate-500 transition-colors" />
                    </div>

                    {menuItems.map((item) => {
                        const active = isCurrentRoute(item.route);
                        return (
                            <Link 
                                key={item.name} 
                                href={route(item.route)}
                                className={`
                                    flex items-center justify-between px-3 py-3 rounded-lg font-medium transition-all duration-200 group
                                    ${active 
                                        ? 'bg-blue-600/10 text-blue-500 relative' 
                                        : 'text-slate-400 hover:bg-[#1F2937] hover:text-slate-200'
                                    }
                                `}
                            >
                                {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full"></div>}
                                <div className="flex items-center gap-3">
                                    <span className={active ? 'text-blue-500' : 'text-slate-500 group-hover:text-slate-300'}>{item.icon}</span>
                                    {item.name}
                                </div>
                                <FiChevronRight size={14} className={active ? 'text-blue-500' : 'text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity'} />
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer Sidebar */}
                <div className="p-4 border-t border-slate-800/80">
                    <Dropdown>
                        <Dropdown.Trigger>
                            <button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#1F2937] transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-[#374151] flex items-center justify-center font-bold text-white relative overflow-hidden shrink-0 border border-slate-600">
                                        <img src={`https://ui-avatars.com/api/?name=${user.name}&background=1F2937&color=ffffff&bold=true`} alt="Avatar" />
                                    </div>
                                    <div className="text-left max-w-[120px]">
                                        <p className="text-sm font-semibold text-slate-200 truncate group-hover:text-white transition-colors">{user.name}</p>
                                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                    </div>
                                </div>
                                <FiSettings size={16} className="text-slate-500 group-hover:text-slate-300" />
                            </button>
                        </Dropdown.Trigger>
                        <Dropdown.Content align="top" width="w-56" contentClasses="bg-[#1F2937] border border-slate-700 py-1">
                            <Dropdown.Link href={route('profile.edit')} className="flex items-center gap-2 py-2 text-slate-200 hover:bg-[#374151] hover:text-white">
                                <FiSettings size={16}/> Settings
                            </Dropdown.Link>
                            <Dropdown.Link href={route('home')} className="flex items-center gap-2 py-2 text-slate-200 hover:bg-[#374151] hover:text-white">
                                <FiHome size={16}/> Public View
                            </Dropdown.Link>
                            <div className="border-t border-slate-700 my-1"></div>
                            <Dropdown.Link href={route('logout')} method="post" as="button" className="flex items-center gap-2 text-red-400 hover:bg-slate-800 py-2 font-medium w-full text-left">
                                <FiLogOut size={16}/> Logout
                            </Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>
                </div>
            </motion.aside>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                
                {/* Header Topbar */}
                <header className="h-20 px-6 sm:px-8 flex items-center justify-between shrink-0 bg-[#0B0F19]/80 backdrop-blur-md sticky top-0 z-20 border-b border-slate-800/80">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-white rounded-lg hover:bg-[#1F2937]"
                        >
                            <FiMenu size={24} />
                        </button>
                        {header && (
                            <div className="font-semibold text-xl text-white tracking-wide">
                                {header}
                            </div>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-slate-400 hover:text-white rounded-full hover:bg-[#1F2937] transition-colors">
                            <FiBell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0B0F19]"></span>
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto px-4 sm:px-8 pb-10 custom-scrollbar">
                    <div className="h-full pt-4 max-w-[1400px]">
                        {children}
                    </div>
                </main>
            </div>

            {/* Custom CSS for slim scrollbars matched to dark theme */}
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #374151;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: #4B5563;
                }
            `}</style>
        </div>
    );
}
