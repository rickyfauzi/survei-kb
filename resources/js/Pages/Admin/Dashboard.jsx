import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { FiUsers, FiStar, FiBarChart2, FiPieChart, FiTrendingUp, FiActivity, FiArrowUpRight, FiZap } from 'react-icons/fi';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
    PieChart, Pie, Cell 
} from 'recharts';

export default function Dashboard({ auth, totalResponden, rataKepuasan, distribusi, perHari, perBulan, perQuestion }) {
    const PIE_COLORS = ['#EF4444', '#F59E0B', '#10B981'];

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };
    
    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#1F2937] border border-slate-700/50 p-4 rounded-xl shadow-2xl">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
                    <p className="text-white font-extrabold text-xl">
                        {payload[0].value} <span className="text-xs font-normal text-slate-500">Responses</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <AuthenticatedLayout header="Dashboard Overview">
            <Head title="Dashboard" />

            <motion.div variants={containerVariants} initial="hidden" animate="show" className="pb-6 space-y-6">
                
                {/* 1. HERO STATS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <motion.div variants={itemVariants} className="bg-[#111827] rounded-xl p-5 border border-slate-800 flex flex-col relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-slate-400 font-medium text-sm mb-1">Total Pageviews</h3>
                                <div className="flex items-end gap-3">
                                    <p className="text-3xl font-extrabold text-white">{totalResponden * 12}</p>
                                    <span className="flex items-center text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded"><FiTrendingUp className="mr-1"/> 24.5%</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="bg-[#111827] rounded-xl p-5 border border-slate-800 flex flex-col relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-slate-400 font-medium text-sm mb-1">Total Users (Responden)</h3>
                                <div className="flex items-end gap-3">
                                    <p className="text-3xl font-extrabold text-white">{totalResponden}</p>
                                    <span className="flex items-center text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded"><FiTrendingUp className="mr-1 rotate-180"/> 2.4%</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="bg-[#111827] rounded-xl p-5 border border-slate-800 flex flex-col relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-slate-400 font-medium text-sm mb-1">Satisfaction Index</h3>
                                <div className="flex items-end gap-3">
                                    <p className="text-3xl font-extrabold text-white">{rataKepuasan}</p>
                                    <span className="flex items-center text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded"><FiTrendingUp className="mr-1"/> 1.8%</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="bg-blue-600 rounded-xl p-5 border border-blue-500 flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <h3 className="text-blue-100 font-medium text-sm mb-1">Create Report</h3>
                                <p className="text-white text-lg font-bold">Generate monthly PDF</p>
                            </div>
                            <div className="mt-4">
                                <Link href="#" className="inline-flex text-xs font-bold text-blue-600 bg-white px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors">
                                    Export Data
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* 2. MAIN CHARTS */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Area Chart */}
                    <motion.div variants={itemVariants} className="bg-[#111827] rounded-xl border border-slate-800 p-6 lg:col-span-2 flex flex-col h-[400px]">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-white mb-1">Response Traffic</h3>
                                <div className="flex items-center gap-6">
                                    <span className="text-sm text-slate-400 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Value</span>
                                    <span className="text-sm text-slate-400 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-purple-500"></div> Target</span>
                                </div>
                            </div>
                            <select className="bg-[#1F2937] border-slate-700 text-slate-300 text-sm rounded-lg focus:ring-blue-500 py-1.5 h-auto">
                                <option>Last 30 Days</option>
                                <option>This Year</option>
                            </select>
                        </div>
                        <div className="flex-1 w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={perHari} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                                    <XAxis dataKey="tanggal" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6B7280'}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6B7280'}} allowDecimals={false} />
                                    <RechartsTooltip content={<CustomTooltip />} cursor={{ stroke: '#4B5563', strokeWidth: 1, strokeDasharray: '3 3' }} />
                                    <Area type="monotone" dataKey="total" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorBlue)" activeDot={{r: 5, fill: '#3B82F6', stroke: '#111827', strokeWidth: 3}} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Donut Chart */}
                    <motion.div variants={itemVariants} className="bg-[#111827] rounded-xl border border-slate-800 p-6 flex flex-col h-[400px]">
                        <h3 className="text-lg font-bold text-white mb-6">Device Usage / Satisfaction</h3>
                        <div className="flex-1 w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={distribusi}
                                        cx="50%" cy="45%" innerRadius={80} outerRadius={100}
                                        paddingAngle={5} dataKey="total" nameKey="label"
                                        stroke="none" cornerRadius={6}
                                    >
                                        {distribusi.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={
                                                entry.label === 'Tidak Memuaskan' ? PIE_COLORS[0] :
                                                entry.label === 'Cukup' ? PIE_COLORS[1] : PIE_COLORS[2]
                                            } />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip contentStyle={{ borderRadius: '12px', border: '1px solid #374151', backgroundColor: '#1F2937' }} itemStyle={{ color: '#F3F4F6' }} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-[-5%]">
                                <span className="text-3xl font-bold text-white">{totalResponden}</span>
                                <span className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">Users</span>
                            </div>
                        </div>
                        
                        {/* Legend */}
                        <div className="grid grid-cols-3 gap-2 mt-auto">
                            {distribusi.map((entry, idx) => (
                                <div key={idx} className="text-center">
                                    <div className="flex items-center justify-center gap-1.5 mb-1">
                                        <div className={`w-2 h-2 rounded-full ${
                                                entry.label === 'Tidak Memuaskan' ? 'bg-red-500' :
                                                entry.label === 'Cukup' ? 'bg-amber-500' : 'bg-emerald-500'
                                        }`}></div>
                                        <span className="text-xs font-bold text-slate-300">{entry.label}</span>
                                    </div>
                                    <span className="text-sm font-semibold text-slate-400">{entry.total}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* 3. TABLE / LIST */}
                <motion.div variants={itemVariants} className="bg-[#111827] rounded-xl border border-slate-800 overflow-hidden">
                    <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-white">Questions Metrics</h3>
                        <button className="text-sm text-blue-500 hover:text-blue-400 font-medium">View all</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#1F2937]/50">
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800 w-16">No</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">Question Item</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800 text-center w-32">Data Points</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800 text-right w-40">Avg Score</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {perQuestion.map((q, idx) => (
                                    <tr key={q.id} className="hover:bg-[#1F2937] transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-slate-500 text-center">#{idx + 1}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-300 w-full max-w-md">
                                            <div className="truncate" title={q.question}>{q.question}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-400 text-center">
                                            {q.answers_count}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                                                q.answers_avg_score >= 80 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                q.answers_avg_score >= 60 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                                'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                            }`}>
                                                {q.answers_avg_score} <span className="opacity-70 font-normal">/ 100</span>
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

            </motion.div>
        </AuthenticatedLayout>
    );
}
