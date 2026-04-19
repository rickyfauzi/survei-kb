import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { 
    FiPrinter, FiSearch, FiCalendar, FiFilter, FiTrendingUp, 
    FiUsers, FiAward, FiArrowRight, FiCheckCircle 
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend 
} from 'recharts';

export default function FullReport({ responses, questions, stats, filters, monthlyOptions }) {
    const [search, setSearch] = useState(filters.search || '');
    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');
    const [month, setMonth] = useState(filters.month || '');

    const applyFilters = () => {
        router.get(route('admin.reports.full'), {
            search,
            start_date: startDate,
            end_date: endDate,
            month
        }, { preserveState: true, replace: true });
    };

    const resetFilters = () => {
        setSearch('');
        setStartDate('');
        setEndDate('');
        setMonth('');
        router.get(route('admin.reports.full'));
    };

    const handlePrint = () => window.print();

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-4">
                    <div>
                        <h2 className="font-black text-2xl text-white tracking-tight">Laporan & Statistik Lengkap</h2>
                        <p className="text-slate-400 text-sm font-medium mt-1 uppercase tracking-widest text-[10px]">Pusat Analisis Data Survei Kepuasan Masyarakat</p>
                    </div>
                    <div className="flex gap-3 no-print">
                        <button 
                            onClick={handlePrint}
                            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-2xl text-sm font-black shadow-xl shadow-emerald-500/20 transition-all active:scale-95"
                        >
                            <FiPrinter size={18} /> Cetak Dokumen
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Laporan Lengkap" />

            <div className="space-y-8 pb-12">
                
                {/* ─── FILTERS PANEL ────────────────────────────────────────────────── */}
                <div className="bg-[#111827] border border-slate-800 p-8 rounded-[2rem] shadow-2xl no-print">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                        <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block ml-1">Cari Responden</label>
                            <div className="relative group">
                                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                                <input 
                                    type="text" value={search} onChange={e => setSearch(e.target.value)}
                                    placeholder="Nama atau Lokasi..."
                                    className="w-full bg-[#0B0F19] border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-semibold placeholder:text-slate-600"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block ml-1">Periode Bulan</label>
                            <div className="relative group">
                                <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                                <select 
                                    value={month} onChange={e => setMonth(e.target.value)}
                                    className="w-full bg-[#0B0F19] border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-blue-500 transition-all font-semibold appearance-none cursor-pointer"
                                >
                                    <option value="">Semua Bulan</option>
                                    {monthlyOptions.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block ml-1">Rentang Tanggal</label>
                            <div className="flex items-center gap-2">
                                <input 
                                    type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                                    className="w-full bg-[#0B0F19] border-slate-800 rounded-xl py-3 px-4 text-white text-xs font-bold focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                                <span className="text-slate-700 font-black">—</span>
                                <input 
                                    type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
                                    className="w-full bg-[#0B0F19] border-slate-800 rounded-xl py-3 px-4 text-white text-xs font-bold focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button onClick={applyFilters} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-black text-sm transition-all flex-1 shadow-lg shadow-blue-500/20 active:scale-95">Terapkan</button>
                            <button onClick={resetFilters} className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-3 rounded-xl font-black text-sm transition-all shadow-lg active:scale-95">Reset</button>
                        </div>
                    </div>
                </div>

                {/* ─── ANALYTICS OVERVIEW ───────────────────────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Summary Cards */}
                    <div className="lg:col-span-1 space-y-6">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#111827] p-6 rounded-[2rem] border border-slate-800 shadow-xl border-l-4 border-l-blue-500">
                             <div className="flex items-center justify-between mb-2">
                                <FiUsers className="text-blue-500" size={20} />
                                <span className="text-[9px] font-black text-slate-500 uppercase">Volume Respon</span>
                             </div>
                             <h4 className="text-3xl font-black text-white">{stats.total}</h4>
                             <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Total Responden Terpilih</p>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-[#111827] p-6 rounded-[2rem] border border-slate-800 shadow-xl border-l-4 border-l-emerald-500">
                             <div className="flex items-center justify-between mb-2">
                                <FiAward className="text-emerald-500" size={20} />
                                <span className="text-[9px] font-black text-slate-500 uppercase">Indeks Kepuasan</span>
                             </div>
                             <div className="flex items-baseline gap-2">
                                <h4 className="text-3xl font-black text-white">{stats.avg}</h4>
                                <span className="text-slate-600 font-black text-xs">/ 100</span>
                             </div>
                             <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Skor Kinerja Rata-rata</p>
                        </motion.div>
                    </div>

                    {/* Satisfaction Pie Chart */}
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="lg:col-span-1 bg-[#111827] p-6 rounded-[2rem] border border-slate-800 shadow-xl">
                        <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                            Proporsi Kepuasan
                        </h5>
                        <div className="h-[180px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={stats.categories} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={5} dataKey="value">
                                        {stats.categories.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#0b0f19', border: 'none', borderRadius: '10px', fontSize: '10px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Question Specific Averages */}
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="lg:col-span-2 bg-[#111827] p-6 rounded-[2rem] border border-slate-800 shadow-xl">
                         <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                            Analisis Per Indikator (Rata-rata Skor)
                        </h5>
                        <div className="h-[180px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={questions.map((q, i) => ({ name: `Q${i+1}`, avg: q.avg }))}>
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#64748b" fontSize={10} />
                                    <YAxis hide domain={[0, 100]} />
                                    <Tooltip cursor={{ fill: '#1f2937'}} contentStyle={{ backgroundColor: '#0b0f19', border: 'none', borderRadius: '10px', fontSize: '10px' }} />
                                    <Bar dataKey="avg" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                </div>

                {/* ─── DATA TABLE ───────────────────────────────────────────────────── */}
                <div className="bg-[#111827] rounded-[2.5rem] border border-slate-800 shadow-3xl overflow-hidden printable-area">
                    <div className="p-8 border-b border-slate-800 bg-slate-800/10 flex items-center justify-between no-print">
                        <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500">
                                <FiCalendar size={20} />
                             </div>
                             <div>
                                <h3 className="font-black text-white text-base">Rincian Jawaban Responden</h3>
                                <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest">Total: {responses.length} Responden Terfilter</p>
                             </div>
                        </div>
                        <div className="bg-slate-900 border border-slate-800 rounded-full px-4 py-2 flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase">
                            <FiTrendingUp className="text-blue-500" />
                            Geser horizontal untuk detail pertanyaan
                        </div>
                    </div>

                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse min-w-[1600px]">
                            <thead>
                                <tr className="bg-[#0B0F19]">
                                    <th className="sticky left-0 z-10 bg-[#0B0F19] px-6 py-8 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800 w-64">Identitas Responden</th>
                                    {questions.map((q, i) => (
                                        <th key={q.id} className="px-6 py-8 text-[10px] font-black text-slate-400 border-b border-slate-800 border-l border-slate-800/30 max-w-[200px] align-top">
                                            <div className="mb-2 text-blue-500 text-xs font-black">INDIKATOR {i+1}</div>
                                            <span className="leading-relaxed block opacity-70">{q.text}</span>
                                        </th>
                                    ))}
                                    <th className="px-6 py-8 text-[10px] font-black text-rose-500 uppercase tracking-widest border-b border-slate-800 border-l border-slate-800/30 min-w-[300px]">Uraian Kritik & Saran</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {responses.length > 0 ? responses.map((res) => (
                                    <tr key={res.id} className="hover:bg-slate-800/30 transition-all group">
                                        <td className="sticky left-0 z-10 bg-[#111827] group-hover:bg-[#151d2e] px-6 py-8 border-b border-slate-800 shadow-2xl transition-colors">
                                            <div className="flex items-start gap-4">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white text-lg shadow-lg ${
                                                    res.avg >= 85 ? 'bg-emerald-500 shadow-emerald-500/20' : 
                                                    res.avg >= 70 ? 'bg-blue-500 shadow-blue-500/20' : 'bg-rose-500 shadow-rose-500/20'
                                                }`}>
                                                    {res.nama.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-extrabold text-white text-lg leading-tight mb-1">{res.nama}</div>
                                                    <div className="flex flex-col gap-1.5">
                                                        <span className="text-[10px] text-slate-500 font-black uppercase flex items-center gap-2"><FiCalendar className="text-blue-500"/> {res.tanggal}</span>
                                                        <span className="text-[10px] text-slate-500 font-black uppercase flex items-center gap-2"><FiSearch className="text-amber-500"/> {res.lokasi}</span>
                                                        <span className="text-[11px] text-emerald-500 font-black uppercase py-1 px-2 border border-emerald-500/20 rounded-lg inline-block text-center mt-2">SKOR: {res.avg} / 100</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        {questions.map((q) => {
                                            const answer = res.answers.find(a => a.q === q.text);
                                            const score = answer ? answer.s : '-';
                                            return (
                                                <td key={q.id} className="px-6 py-8 border-l border-slate-800/30 text-center">
                                                    <div className={`inline-flex flex-col items-center justify-center p-4 rounded-3xl min-w-[80px] transition-all duration-300 ${
                                                        score >= 85 ? 'bg-emerald-500/5 text-emerald-500 border border-emerald-500/20' : 
                                                        score >= 70 ? 'bg-blue-500/5 text-blue-500 border border-blue-500/20' : 
                                                        score >= 55 ? 'bg-amber-500/5 text-amber-500 border border-amber-100/10' : 'bg-rose-500/5 text-rose-500 border border-rose-500/20'
                                                    }`}>
                                                        <span className="text-2xl font-black mb-1 leading-none">{score}</span>
                                                        <span className="text-[9px] font-black uppercase tracking-widest opacity-80">Nilai</span>
                                                    </div>
                                                </td>
                                            );
                                        })}
                                        <td className="px-6 py-8 border-l border-slate-800/30">
                                            <div className="bg-[#0B0F19] p-6 rounded-[2rem] border border-slate-800/50 min-h-[120px] shadow-inner">
                                                <p className="text-slate-400 text-xs italic leading-relaxed font-medium">
                                                    "{res.kritik_saran || 'Responden tidak meninggalkan kritik atau saran spesifik pada survei ini.'}"
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={questions.length + 2} className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center text-slate-600">
                                                    <FiFilter size={32} />
                                                </div>
                                                <div className="text-slate-500 font-black text-lg uppercase tracking-widest">Data Tidak Ditemukan</div>
                                                <p className="text-slate-600 text-sm font-medium">Coba sesuaikan filter pencarian atau rentang tanggal Anda.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @media print {
                    nav, header, .no-print, .pb-12, .shadow-3xl { display: none !important; }
                    body { background: white !important; color: black !important; padding: 1.5cm !important; margin: 0 !important; font-size: 8px !important; }
                    .printable-area { border: 1px solid #000 !important; border-radius: 0 !important; width: 100% !important; overflow: visible !important; }
                    table { border-collapse: collapse !important; width: 100% !important; table-layout: auto !important; border: 1px solid #eee !important; }
                    th, td { border: 1px solid #ddd !important; padding: 10px !important; color: black !important; font-size: 7px !important; background: transparent !important; position: static !important; }
                    .text-white, .font-black, .font-extrabold { color: black !important; }
                    .sticky { position: static !important; background: transparent !important; }
                    .bg-[#111827], .bg-[#0B0F19], .bg-[#151d2e] { background: transparent !important; }
                    .shadow-2xl, .shadow-xl { box-shadow: none !important; }
                    .rounded-full, .rounded-xl, .rounded-[2.5rem], .rounded-[2rem] { border-radius: 4px !important; }
                }
                .shadow-3xl {
                    box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.6);
                }
                .custom-scrollbar::-webkit-scrollbar { height: 10px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #0B0F19; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #1f2937; border-radius: 10px; border: 2px solid #0B0F19; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #3B82F6; }
            `}</style>
        </AuthenticatedLayout>
    );
}
