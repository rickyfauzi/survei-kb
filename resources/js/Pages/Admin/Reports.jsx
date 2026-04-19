import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { FiTrendingUp, FiUsers, FiCalendar, FiPrinter, FiFilter, FiDownload } from 'react-icons/fi';
import { motion } from 'framer-motion';

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

    return (
        <AuthenticatedLayout 
            header={
                <div className="flex justify-between items-center w-full">
                    <h2 className="font-semibold text-xl text-white leading-tight">Analisis & Laporan Survei</h2>
                    <button 
                        onClick={handlePrint}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg transition-all"
                    >
                        <FiPrinter size={18} /> Cetak Laporan
                    </button>
                </div>
            }
        >
            <Head title="Laporan Survei" />

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
                        <p className="text-slate-400 text-sm mt-1 font-medium">Skor Rata-rata Kinerja</p>
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

                {/* Monthly Statistics Table */}
                <div className="bg-[#111827] rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
                    <div className="p-6 border-b border-slate-800 bg-slate-800/20 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <FiCalendar className="text-blue-500" size={20} />
                            <h3 className="font-bold text-white uppercase tracking-wider text-sm">Statistik Bulanan (12 Bulan Terakhir)</h3>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#0B0F19]">
                                    <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">Periode Bulan</th>
                                    <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">Jumlah Responden</th>
                                    <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">Rata-rata Skor</th>
                                    <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800 text-center">Trend Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {monthlyStats.map((stat, i) => (
                                    <tr key={stat.month} className="hover:bg-slate-800/30 transition-colors group">
                                        <td className="px-6 py-5">
                                            <span className="text-white font-bold">{stat.month}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 h-2 bg-slate-800 rounded-full max-w-[100px] overflow-hidden">
                                                    <div 
                                                        className="h-full bg-blue-500 rounded-full" 
                                                        style={{ width: `${Math.min((stat.total / 100) * 100, 100)}%` }}
                                                    />
                                                </div>
                                                <span className="text-slate-300 font-bold">{stat.total}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-slate-300 font-mono font-bold">
                                            {parseFloat(stat.avg_score || 0).toFixed(1)}
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                parseFloat(stat.avg_score) >= 80 ? 'bg-emerald-500/10 text-emerald-500' :
                                                parseFloat(stat.avg_score) >= 60 ? 'bg-amber-500/10 text-amber-500' : 'bg-rose-500/10 text-rose-500'
                                            }`}>
                                                {parseFloat(stat.avg_score) >= 80 ? 'Sangat Puas' : 'Cukup Puas'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Detailed Table for Export/Reference */}
                <div className="bg-[#111827] rounded-3xl border border-slate-800 overflow-hidden shadow-2xl printable-area">
                    <div className="p-6 border-b border-slate-800 bg-slate-800/20">
                        <div className="flex items-center gap-3">
                            <FiUsers className="text-amber-500" size={20} />
                            <h3 className="font-bold text-white uppercase tracking-wider text-sm">Data Detail Responden</h3>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#0B0F19]">
                                    <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">Tanggal</th>
                                    <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">Nama Lengkap</th>
                                    <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">No. WhatsApp</th>
                                    <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">Lokasi</th>
                                    <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">Skor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {responses.map((res) => (
                                    <tr key={res.id} className="border-b border-slate-800 text-sm">
                                        <td className="px-6 py-4 text-slate-400 font-mono">{res.tanggal}</td>
                                        <td className="px-6 py-4 font-bold text-white">{res.nama}</td>
                                        <td className="px-6 py-4 text-slate-400">{res.no_wa}</td>
                                        <td className="px-6 py-4 text-slate-400">{res.lokasi}</td>
                                        <td className="px-6 py-4">
                                            <span className="font-black text-blue-500">{res.rata_rata}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @media print {
                    nav, header, .no-print, .pb-12 { display: none !important; }
                    body { background: white !important; color: black !important; }
                    .printable-area { border: none !important; shadow: none !important; color: black !important; }
                    table { border: 1px solid #eee !important; width: 100% !important; }
                    th, td { border: 1px solid #eee !important; padding: 10px !important; color: black !important; }
                    .text-white { color: black !important; }
                    .bg-[#111827] { background: white !important; }
                }
            `}</style>
        </AuthenticatedLayout>
    );
}
