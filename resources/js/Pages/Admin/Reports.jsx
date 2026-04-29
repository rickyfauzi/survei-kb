import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { FiTrendingUp, FiUsers, FiPrinter, FiFilter, FiBarChart2, FiPieChart } from 'react-icons/fi';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
    AreaChart, Area
} from 'recharts';

export default function Reports({ monthlyStats, summary, responses, filters }) {
    const [selectedMonth, setSelectedMonth] = useState(filters.month || '');

    const handleFilter = (e) => {
        const value = e.target.value;
        setSelectedMonth(value);
        router.get(route('admin.reports.index'), { month: value }, { preserveState: true });
    };

    return (
        <AuthenticatedLayout 
            header={
                <div className="flex items-center justify-between w-full">
                    <span>Statistik Bulanan</span>
                    <button onClick={() => window.print()} className="flex items-center gap-1.5 bg-[#405189] text-white px-4 py-[8px] rounded-sm text-[13px] font-medium hover:bg-[#3a4a7d] transition-colors">
                        <FiPrinter size={14} /> Cetak Statistik
                    </button>
                </div>
            }
        >
            <Head title="Statistik" />

            <div className="space-y-4">

                {/* Row 1: Summary Cards + Filter */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="card">
                        <div className="card-body">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Total Responden</span>
                                <div className="w-8 h-8 bg-indigo-50 rounded-sm flex items-center justify-center text-indigo-500"><FiUsers size={16} /></div>
                            </div>
                            <h3 className="text-[22px] font-semibold text-slate-800">{summary.total}</h3>
                            <p className="text-[12px] text-slate-400 mt-1">Sepanjang periode</p>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-body">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Indeks Kepuasan</span>
                                <div className="w-8 h-8 bg-teal-50 rounded-sm flex items-center justify-center text-teal-500"><FiTrendingUp size={16} /></div>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <h3 className="text-[22px] font-semibold text-slate-800">{summary.avg}</h3>
                                <span className="text-slate-400 text-sm">/ 100</span>
                            </div>
                            <p className="text-[12px] text-slate-400 mt-1">Skor rata-rata</p>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-body">
                            <label className="text-[12px] font-medium text-slate-600 mb-1.5 block">Filter Periode</label>
                            <div className="relative">
                                <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                <select value={selectedMonth} onChange={handleFilter}
                                    className="w-full border border-slate-200 rounded-sm py-[7px] pl-9 pr-3 text-[13px] text-slate-700 focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 appearance-none bg-white">
                                    <option value="">Semua Waktu</option>
                                    {monthlyStats.map(stat => (<option key={stat.month} value={stat.month}>{stat.month}</option>))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Row 2: Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="card">
                        <div className="card-header flex items-center gap-2 pb-3 border-b border-slate-100" style={{ padding: '16px' }}>
                            <FiBarChart2 className="text-[#405189]" size={15} />
                            <h5 className="text-[13px] font-semibold text-slate-800 uppercase">Distribusi Kepuasan</h5>
                        </div>
                        <div className="card-body">
                            <div className="h-[320px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={monthlyStats} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eff2f7" />
                                        <XAxis dataKey="month" stroke="#878a99" fontSize={11} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#878a99" fontSize={11} tickLine={false} axisLine={false} />
                                        <Tooltip contentStyle={{ border: '1px solid #e9ebec', borderRadius: '4px', fontSize: '12px' }} />
                                        <Legend iconType="square" wrapperStyle={{ paddingTop: '12px', fontSize: '11px' }} />
                                        <Bar dataKey="sangatPuas" name="Sangat Puas" fill="#0ab39c" stackId="a" />
                                        <Bar dataKey="puas" name="Puas" fill="#405189" stackId="a" />
                                        <Bar dataKey="cukup" name="Cukup" fill="#f7b84b" stackId="a" />
                                        <Bar dataKey="kurang" name="Kurang" fill="#f06548" stackId="a" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header flex items-center gap-2 pb-3 border-b border-slate-100" style={{ padding: '16px' }}>
                            <FiTrendingUp className="text-teal-500" size={15} />
                            <h5 className="text-[13px] font-semibold text-slate-800 uppercase">Tren Skor Pelayanan</h5>
                        </div>
                        <div className="card-body">
                            <div className="h-[320px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={monthlyStats} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorAvgR" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#405189" stopOpacity={0.12}/>
                                                <stop offset="95%" stopColor="#405189" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eff2f7" />
                                        <XAxis dataKey="month" stroke="#878a99" fontSize={11} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#878a99" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} />
                                        <Tooltip contentStyle={{ border: '1px solid #e9ebec', borderRadius: '4px', fontSize: '12px' }} />
                                        <Area type="monotone" dataKey="avg" name="Rata-rata" stroke="#405189" strokeWidth={2} fillOpacity={1} fill="url(#colorAvgR)" dot={false} activeDot={{ r: 4, fill: '#405189', stroke: '#fff', strokeWidth: 2 }} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Row 3: Monthly Detail */}
                <div className="card">
                    <div className="card-header flex items-center gap-2 pb-3 border-b border-slate-100" style={{ padding: '16px' }}>
                        <FiPieChart className="text-amber-500" size={15} />
                        <h5 className="text-[13px] font-semibold text-slate-800 uppercase">Detail Persentase Bulanan</h5>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                        {monthlyStats.slice(-4).map((stat) => (
                            <div key={stat.month} className="p-4 hover:bg-slate-50/50 transition-colors">
                                <p className="text-[12px] font-semibold text-[#405189] uppercase tracking-wider mb-4">{stat.month}</p>
                                <div className="space-y-3">
                                    {[
                                        { label: 'Sangat Puas', key: 'sangatPuas', color: 'bg-teal-500', text: 'text-teal-600' },
                                        { label: 'Puas', key: 'puas', color: 'bg-indigo-500', text: 'text-indigo-600' },
                                        { label: 'Cukup', key: 'cukup', color: 'bg-amber-400', text: 'text-amber-600' },
                                        { label: 'Kurang', key: 'kurang', color: 'bg-red-500', text: 'text-red-600' },
                                    ].map(({ label, key, color, text }) => (
                                        <div key={key}>
                                            <div className="flex justify-between text-[11px] font-medium mb-1">
                                                <span className={text}>{label}</span>
                                                <span className="text-slate-600">{Math.round((stat[key] / stat.total) * 100 || 0)}%</span>
                                            </div>
                                            <div className="w-full h-[4px] bg-slate-100 rounded-full overflow-hidden">
                                                <div className={`h-full rounded-full ${color}`} style={{ width: `${(stat[key] / stat.total) * 100}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                                    <span className="text-[10px] font-medium text-slate-400 uppercase">Total</span>
                                    <span className="text-[13px] font-semibold text-slate-700">{stat.total}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`@media print { nav, header, select, button { display:none!important; } * { -webkit-print-color-adjust:exact!important; } }`}</style>
        </AuthenticatedLayout>
    );
}
