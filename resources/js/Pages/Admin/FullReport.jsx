import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { FiPrinter, FiSearch, FiCalendar, FiFilter, FiTrendingUp, FiUsers, FiAward, FiRefreshCw } from 'react-icons/fi';
import { 
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
    BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

export default function FullReport({ responses, questions, stats, filters, monthlyOptions }) {
    const [search, setSearch] = useState(filters.search || '');
    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');
    const [month, setMonth] = useState(filters.month || '');

    const applyFilters = () => {
        router.get(route('admin.reports.full'), { search, start_date: startDate, end_date: endDate, month }, { preserveState: true, replace: true });
    };
    const resetFilters = () => {
        setSearch(''); setStartDate(''); setEndDate(''); setMonth('');
        router.get(route('admin.reports.full'));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between w-full">
                    <span>Laporan Lengkap</span>
                    <button onClick={() => window.print()} className="flex items-center gap-1.5 bg-teal-600 text-white px-4 py-[8px] rounded-sm text-[13px] font-medium hover:bg-teal-700 transition-colors no-print">
                        <FiPrinter size={14} /> Cetak Dokumen
                    </button>
                </div>
            }
        >
            <Head title="Laporan Lengkap" />

            <div className="space-y-4">

                {/* Filter Card */}
                <div className="card no-print">
                    <div className="card-header pb-3 border-b border-slate-100" style={{ padding: '16px' }}>
                        <h5 className="text-[13px] font-semibold text-slate-800">Filter & Pencarian</h5>
                    </div>
                    <div className="card-body">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                            <div className="md:col-span-3">
                                <label className="text-[12px] font-medium text-slate-600 mb-1.5 block">Cari Responden</label>
                                <div className="relative">
                                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                    <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Nama atau lokasi..."
                                        className="w-full border border-slate-200 rounded-sm py-[7px] pl-9 pr-3 text-[13px] focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 placeholder:text-slate-400" />
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-[12px] font-medium text-slate-600 mb-1.5 block">Periode Bulan</label>
                                <div className="relative">
                                    <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                    <select value={month} onChange={e => setMonth(e.target.value)}
                                        className="w-full border border-slate-200 rounded-sm py-[7px] pl-9 pr-3 text-[13px] focus:ring-1 focus:ring-indigo-400 appearance-none bg-white">
                                        <option value="">Semua Bulan</option>
                                        {monthlyOptions.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-[12px] font-medium text-slate-600 mb-1.5 block">Dari Tanggal</label>
                                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                                    className="w-full border border-slate-200 rounded-sm py-[7px] px-3 text-[13px] focus:ring-1 focus:ring-indigo-400" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-[12px] font-medium text-slate-600 mb-1.5 block">Sampai Tanggal</label>
                                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
                                    className="w-full border border-slate-200 rounded-sm py-[7px] px-3 text-[13px] focus:ring-1 focus:ring-indigo-400" />
                            </div>
                            <div className="md:col-span-3 flex gap-2">
                                <button onClick={applyFilters} className="flex-1 flex items-center justify-center gap-1.5 bg-[#405189] text-white py-[8px] rounded-sm text-[13px] font-medium hover:bg-[#3a4a7d] transition-colors">
                                    <FiFilter size={14}/> Terapkan
                                </button>
                                <button onClick={resetFilters} className="flex items-center justify-center gap-1.5 bg-white border border-slate-200 text-slate-500 py-[8px] px-3 rounded-sm text-[13px] hover:bg-slate-50 transition-colors">
                                    <FiRefreshCw size={13}/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Analytics Row */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    {/* Stats */}
                    <div className="space-y-4">
                        <div className="card border-l-[3px] border-l-[#405189]">
                            <div className="card-body">
                                <div className="flex items-center justify-between mb-2">
                                    <FiUsers className="text-[#405189]" size={16} />
                                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Volume</span>
                                </div>
                                <h4 className="text-xl font-semibold text-slate-800">{stats.total}</h4>
                                <p className="text-[11px] text-slate-400 mt-0.5">Total Responden</p>
                            </div>
                        </div>
                        <div className="card border-l-[3px] border-l-teal-500">
                            <div className="card-body">
                                <div className="flex items-center justify-between mb-2">
                                    <FiAward className="text-teal-500" size={16} />
                                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Indeks</span>
                                </div>
                                <div className="flex items-baseline gap-1">
                                    <h4 className="text-xl font-semibold text-slate-800">{stats.avg}</h4>
                                    <span className="text-slate-400 text-xs">/ 100</span>
                                </div>
                                <p className="text-[11px] text-slate-400 mt-0.5">Skor Rata-rata</p>
                            </div>
                        </div>
                    </div>

                    {/* Pie */}
                    <div className="card">
                        <div className="card-header pb-2 border-b border-slate-100" style={{ padding: '14px 16px 10px' }}>
                            <h6 className="text-[12px] font-semibold text-slate-700 uppercase tracking-wider">Proporsi Kepuasan</h6>
                        </div>
                        <div className="card-body">
                            <div className="h-[170px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={stats.categories} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value" stroke="none">
                                            {stats.categories.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                                        </Pie>
                                        <Tooltip contentStyle={{ border: '1px solid #e9ebec', borderRadius: '4px', fontSize: '11px' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Bar */}
                    <div className="card lg:col-span-2">
                        <div className="card-header pb-2 border-b border-slate-100" style={{ padding: '14px 16px 10px' }}>
                            <h6 className="text-[12px] font-semibold text-slate-700 uppercase tracking-wider">Rata-rata Per Indikator</h6>
                        </div>
                        <div className="card-body">
                            <div className="h-[170px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={questions.map((q, i) => ({ name: `Q${i+1}`, avg: q.avg }))}>
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#878a99" fontSize={11} />
                                        <YAxis hide domain={[0, 100]} />
                                        <Tooltip cursor={{ fill: '#f8f9fa' }} contentStyle={{ border: '1px solid #e9ebec', borderRadius: '4px', fontSize: '11px' }} />
                                        <Bar dataKey="avg" fill="#405189" radius={[2, 2, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Data Table Card */}
                <div className="card printable-area">
                    <div className="card-header flex items-center justify-between pb-3 border-b border-slate-100 no-print" style={{ padding: '16px' }}>
                        <div>
                            <h5 className="text-[13px] font-semibold text-slate-800">Rincian Jawaban Responden</h5>
                            <p className="text-[11px] text-slate-400 mt-0.5">Total: {responses.length} responden</p>
                        </div>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1.5"><FiTrendingUp className="text-[#405189]" size={13}/> Geser horizontal untuk detail</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1400px]">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50">
                                    <th className="sticky left-0 z-10 bg-slate-50 px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-left w-56 border-r border-slate-100">Responden</th>
                                    {questions.map((q, i) => (
                                        <th key={q.id} className="px-3 py-3 text-[10px] font-semibold text-slate-400 text-left border-r border-slate-100 max-w-[160px] align-top">
                                            <span className="text-[#405189] font-bold text-[11px]">Q{i+1}</span>
                                            <span className="block mt-0.5 leading-snug font-normal text-slate-400">{q.text}</span>
                                        </th>
                                    ))}
                                    <th className="px-3 py-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider text-left min-w-[220px]">Kritik & Saran</th>
                                </tr>
                            </thead>
                            <tbody>
                                {responses.length > 0 ? responses.map((res) => (
                                    <tr key={res.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                                        <td className="sticky left-0 z-10 bg-white group-hover:bg-slate-50 px-4 py-3 border-r border-slate-100 transition-colors">
                                            <div className="font-medium text-[13px] text-slate-700 mb-1">{res.nama}</div>
                                            <p className="text-[10px] text-slate-400 flex items-center gap-1"><FiCalendar size={10}/> {res.tanggal}</p>
                                            <p className="text-[10px] text-slate-400">{res.lokasi}</p>
                                            <span className={`inline-block mt-1.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-sm ${
                                                res.avg >= 80 ? 'bg-teal-50 text-teal-600' : res.avg >= 60 ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                                            }`}>Skor: {res.avg}</span>
                                        </td>
                                        {questions.map((q) => {
                                            const answer = res.answers.find(a => a.q === q.text);
                                            const score = answer ? answer.s : '-';
                                            return (
                                                <td key={q.id} className="px-3 py-3 border-r border-slate-50 text-center">
                                                    <span className={`inline-block text-[13px] font-semibold px-2 py-0.5 rounded-sm ${
                                                        score >= 80 ? 'bg-teal-50 text-teal-600' :
                                                        score >= 60 ? 'bg-amber-50 text-amber-600' :
                                                        score >= 40 ? 'bg-orange-50 text-orange-600' :
                                                        score === '-' ? 'text-slate-300' : 'bg-red-50 text-red-600'
                                                    }`}>{score}</span>
                                                </td>
                                            );
                                        })}
                                        <td className="px-3 py-3">
                                            <p className="text-[12px] text-slate-500 italic leading-relaxed bg-slate-50 border border-slate-100 rounded-sm p-2.5 min-h-[50px]">
                                                "{res.kritik_saran || 'Tidak ada komentar.'}"
                                            </p>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={questions.length + 2} className="px-4 py-12 text-center">
                                            <FiFilter size={22} className="mx-auto text-slate-300 mb-2" />
                                            <p className="text-[13px] font-medium text-slate-500">Data Tidak Ditemukan</p>
                                            <p className="text-[12px] text-slate-400 mt-1">Sesuaikan filter pencarian Anda.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <style>{`
                @media print {
                    nav, header, .no-print { display: none !important; }
                    body { background: white !important; padding: 1cm !important; font-size: 8px !important; }
                    .printable-area { border: 1px solid #ddd !important; width: 100% !important; overflow: visible !important; }
                    table { border-collapse: collapse !important; width: 100% !important; table-layout: auto !important; }
                    th, td { border: 1px solid #ddd !important; padding: 5px !important; color: #000 !important; font-size: 7px !important; background: #fff !important; position: static !important; }
                    .sticky { position: static !important; }
                    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                }
            `}</style>
        </AuthenticatedLayout>
    );
}
