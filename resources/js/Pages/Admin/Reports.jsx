import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { FiTrendingUp, FiUsers, FiCalendar, FiPrinter, FiFilter, FiBarChart2, FiPieChart } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
    LineChart, Line, AreaChart, Area, Cell, PieChart, Pie
} from 'recharts';

export default function Reports({ monthlyStats, summary, responses, filters }) {
    const [selectedMonth, setSelectedMonth] = useState(filters.month || '');

    const handleFilter = (e) => {
        const value = e.target.value;
        setSelectedMonth(value);
        router.get(route('admin.reports.index'), { month: value }, { preserveState: true });
    };

    const handlePrint = () => {
        window.print();
    };

    const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'];

    return (
        <AuthenticatedLayout 
            header={
                <div className="flex justify-between items-center w-full">
                    <h2 className="font-semibold text-xl text-white leading-tight">Statistik & Analisis Bulanan</h2>
                    <button 
                        onClick={handlePrint}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg transition-all"
                    >
                        <FiPrinter size={18} /> Cetak Statistik
                    </button>
                </div>
            }
        >
            <Head title="Statistik Bulanan" />

            <div className="space-y-8 pb-12">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-[#111827] p-6 rounded-2xl border border-slate-800 shadow-xl"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
                                <FiUsers size={24} />
                            </div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total</span>
                        </div>
                        <h3 className="text-3xl font-black text-white">{summary.total}</h3>
                        <p className="text-slate-400 text-sm mt-1 font-medium">Total Responden Terdata</p>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="bg-[#111827] p-6 rounded-2xl border border-slate-800 shadow-xl"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                                <FiTrendingUp size={24} />
                            </div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Kepuasan</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-3xl font-black text-white">{summary.avg}</h3>
                            <span className="text-slate-500 font-bold">/ 100</span>
                        </div>
                        <p className="text-slate-400 text-sm mt-1 font-medium">Skor Rata-rata Pelayanan</p>
                    </motion.div>

                    <div className="bg-[#111827] p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-center">
                        <label className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em] mb-3 block">Filter Periode Bulan</label>
                        <div className="relative">
                            <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                            <select 
                                value={selectedMonth}
                                onChange={handleFilter}
                                className="w-full bg-[#1F2937] border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:ring-blue-500 focus:border-blue-500 transition-all font-medium appearance-none"
                            >
                                <option value="">Semua Waktu</option>
                                {monthlyStats.map(stat => (
                                    <option key={stat.month} value={stat.month}>{stat.month}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Main Statistical Chart */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sticky-container">
                    {/* 1. Bar Chart: Satisfaction Breakdown Per Month */}
                    <div className="bg-[#111827] rounded-3xl border border-slate-800 p-8 shadow-2xl">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                                <FiBarChart2 size={20} />
                            </div>
                            <h3 className="font-bold text-white uppercase tracking-wider text-sm">Distribusi Kepuasan Per Bulan</h3>
                        </div>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" />
                                    <XAxis dataKey="month" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#0b0f19', border: '1px solid #1f2937', borderRadius: '12px' }}
                                        itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                    />
                                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: 'bold' }} />
                                    <Bar dataKey="sangatPuas" name="Sangat Puas" fill="#10B981" radius={[4, 4, 0, 0]} stackId="a" />
                                    <Bar dataKey="puas" name="Puas" fill="#3B82F6" radius={[4, 4, 0, 0]} stackId="a" />
                                    <Bar dataKey="cukup" name="Cukup" fill="#F59E0B" radius={[4, 4, 0, 0]} stackId="a" />
                                    <Bar dataKey="kurang" name="Kurang" fill="#EF4444" radius={[4, 4, 0, 0]} stackId="a" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* 2. Line Chart: Average Score Trend */}
                    <div className="bg-[#111827] rounded-3xl border border-slate-800 p-8 shadow-2xl">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                                <FiTrendingUp size={20} />
                            </div>
                            <h3 className="font-bold text-white uppercase tracking-wider text-sm">Tren Skor Pelayanan</h3>
                        </div>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={monthlyStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" />
                                    <XAxis dataKey="month" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#0b0f19', border: '1px solid #1f2937', borderRadius: '12px' }}
                                        itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                    />
                                    <Area type="monotone" dataKey="avg" name="Rata-rata Skor" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorAvg)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Legend / Info per Month Section */}
                <div className="bg-[#111827] rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
                    <div className="p-6 border-b border-slate-800 bg-slate-800/10">
                        <div className="flex items-center gap-3">
                            <FiPieChart className="text-amber-500" size={20} />
                            <h3 className="font-bold text-white uppercase tracking-wider text-sm">Detail Persentase Bulanan</h3>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-800">
                        {monthlyStats.slice(-4).map((stat) => (
                            <div key={stat.month} className="p-6 hover:bg-slate-800/20 transition-all">
                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">{stat.month}</div>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-emerald-500">Sangat Puas</span>
                                        <span className="text-slate-300">{Math.round((stat.sangatPuas/stat.total)*100 || 0)}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500" style={{ width: `${(stat.sangatPuas/stat.total)*100}%` }} />
                                    </div>

                                    <div className="flex justify-between text-xs font-bold pt-1">
                                        <span className="text-blue-500">Puas</span>
                                        <span className="text-slate-300">{Math.round((stat.puas/stat.total)*100 || 0)}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500" style={{ width: `${(stat.puas/stat.total)*100}%` }} />
                                    </div>

                                    <div className="flex justify-between text-xs font-bold pt-1">
                                        <span className="text-amber-500">Cukup</span>
                                        <span className="text-slate-300">{Math.round((stat.cukup/stat.total)*100 || 0)}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-amber-500" style={{ width: `${(stat.cukup/stat.total)*100}%` }} />
                                    </div>
                                </div>
                                <div className="mt-6 flex items-center justify-between">
                                    <span className="text-[10px] font-black text-slate-500 uppercase">Total Responden</span>
                                    <span className="text-white font-black">{stat.total}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @media print {
                    nav, header, .no-print, .pb-12, .sticky-container button { display: none !important; }
                    body { background: white !important; color: black !important; }
                    .bg-[#111827] { background: white !important; color: black !important; border: 1px solid #eee !important; }
                    .text-white { color: black !important; }
                    .recharts-cartesian-grid-horizontal line { stroke: #eee !important; }
                    .recharts-text { fill: #000 !important; }
                }
            `}</style>
        </AuthenticatedLayout>
    );
}
