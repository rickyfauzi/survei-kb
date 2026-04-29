import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { FiUsers, FiBarChart2, FiTrendingUp, FiActivity, FiDownload, FiArrowUpRight } from 'react-icons/fi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard({ auth, totalResponden, rataKepuasan, distribusi, perHari, perBulan, perQuestion }) {
    const PIE_COLORS = ['#ef4444', '#f7b84b', '#405189', '#0ab39c'];

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white border border-slate-200 rounded-sm p-3 shadow-lg text-xs">
                    <p className="text-slate-500 mb-1">{label}</p>
                    <p className="text-slate-900 font-semibold text-sm">{payload[0].value} Respon</p>
                </div>
            );
        }
        return null;
    };

    return (
        <AuthenticatedLayout header="Dashboard">
            <Head title="Dashboard" />

            <div className="space-y-6">
                
                {/* Row 1: Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Responden', value: totalResponden, icon: <FiUsers />, color: 'text-indigo-500', bg: 'bg-indigo-50', change: '+12.5%', changeColor: 'text-green-600' },
                        { label: 'Indeks Kepuasan', value: rataKepuasan, icon: <FiActivity />, color: 'text-amber-500', bg: 'bg-amber-50', change: 'Baik', changeColor: 'text-green-600' },
                        { label: 'Kuesioner Aktif', value: perQuestion.length, icon: <FiBarChart2 />, color: 'text-teal-500', bg: 'bg-teal-50', change: 'Aktif', changeColor: 'text-teal-600' },
                        { label: 'Respon Hari Ini', value: perHari.length > 0 ? perHari[perHari.length - 1]?.total || 0 : 0, icon: <FiTrendingUp />, color: 'text-blue-500', bg: 'bg-blue-50', change: 'Live', changeColor: 'text-blue-600' },
                    ].map((stat, idx) => (
                        <div key={idx} className="card">
                            <div className="card-body">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">{stat.label}</span>
                                    <span className={`text-[11px] font-semibold ${stat.changeColor} flex items-center gap-0.5`}><FiArrowUpRight size={12}/> {stat.change}</span>
                                </div>
                                <div className="flex items-end justify-between">
                                    <h3 className="text-[22px] font-semibold text-slate-800">{stat.value}</h3>
                                    <div className={`w-8 h-8 ${stat.bg} rounded-sm flex items-center justify-center ${stat.color}`}>{stat.icon}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Row 2: Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    
                    {/* Area Chart */}
                    <div className="card lg:col-span-2">
                        <div className="card-header flex items-center justify-between">
                            <h5 className="text-[13px] font-semibold text-slate-800 uppercase">Trafik Respon Harian</h5>
                        </div>
                        <div className="card-body">
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={perHari} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#405189" stopOpacity={0.15}/>
                                                <stop offset="95%" stopColor="#405189" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eff2f7" />
                                        <XAxis dataKey="tanggal" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#878a99' }} dy={8} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#878a99' }} allowDecimals={false} />
                                        <RechartsTooltip content={<CustomTooltip />} />
                                        <Area type="monotone" dataKey="total" stroke="#405189" strokeWidth={2} fillOpacity={1} fill="url(#colorPrimary)" dot={false} activeDot={{ r: 4, fill: '#405189', stroke: '#fff', strokeWidth: 2 }} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Donut Chart */}
                    <div className="card">
                        <div className="card-header">
                            <h5 className="text-[13px] font-semibold text-slate-800 uppercase">Proporsi Kepuasan</h5>
                        </div>
                        <div className="card-body">
                            <div className="h-[200px] w-full relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={distribusi} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="total" nameKey="label" stroke="none">
                                            {distribusi.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.label === 'Kurang Puas' ? PIE_COLORS[0] : entry.label === 'Cukup' ? PIE_COLORS[1] : entry.label === 'Puas' ? PIE_COLORS[2] : PIE_COLORS[3]} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip contentStyle={{ border: '1px solid #e9ebec', borderRadius: '4px', fontSize: '12px' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-xl font-semibold text-slate-800">{totalResponden}</span>
                                    <span className="text-[10px] text-slate-400">Total</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-slate-100">
                                {distribusi.map((entry, idx) => (
                                    <div key={idx} className="text-center">
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <div className={`w-2 h-2 rounded-full ${entry.label === 'Kurang Puas' ? 'bg-red-500' : entry.label === 'Cukup' ? 'bg-amber-400' : entry.label === 'Puas' ? 'bg-indigo-500' : 'bg-teal-500'}`}></div>
                                            <span className="text-[10px] text-slate-500">{entry.label}</span>
                                        </div>
                                        <span className="text-sm font-semibold text-slate-700">{entry.total}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Row 3: Questions Table */}
                <div className="card">
                    <div className="card-header flex items-center justify-between pb-3 border-b border-slate-100 mb-0" style={{ padding: '16px' }}>
                        <h5 className="text-[13px] font-semibold text-slate-800 uppercase">Kinerja Indikator Pelayanan</h5>
                        <Link href={route('admin.questions.index')} className="text-[12px] font-medium text-indigo-600 hover:text-indigo-700">Lihat Semua →</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-left w-12">#</th>
                                    <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-left">Indikator</th>
                                    <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-center w-28">Respon</th>
                                    <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-center w-40">Rata-rata</th>
                                </tr>
                            </thead>
                            <tbody>
                                {perQuestion.slice(0, 5).map((q, idx) => (
                                    <tr key={q.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                        <td className="px-4 py-3 text-sm text-slate-500">{idx + 1}</td>
                                        <td className="px-4 py-3 text-sm text-slate-700 font-medium max-w-md truncate">{q.question}</td>
                                        <td className="px-4 py-3 text-sm text-slate-500 text-center">{q.answers_count}</td>
                                        <td className="px-4 py-3 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-16 h-[5px] bg-slate-100 rounded-full overflow-hidden">
                                                    <div className={`h-full rounded-full ${q.answers_avg_score >= 80 ? 'bg-teal-500' : q.answers_avg_score >= 60 ? 'bg-amber-400' : 'bg-red-500'}`} style={{ width: `${q.answers_avg_score}%` }} />
                                                </div>
                                                <span className={`text-sm font-semibold ${q.answers_avg_score >= 80 ? 'text-teal-600' : q.answers_avg_score >= 60 ? 'text-amber-600' : 'text-red-600'}`}>{q.answers_avg_score}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
