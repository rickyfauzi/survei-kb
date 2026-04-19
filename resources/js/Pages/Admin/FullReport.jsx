import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { FiMove, FiPrinter, FiDownload } from 'react-icons/fi';

export default function FullReport({ responses, questions }) {
    const handlePrint = () => {
        window.print();
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center w-full">
                    <div>
                        <h2 className="font-bold text-2xl text-white">Laporan Lengkap Responden</h2>
                        <p className="text-slate-400 text-sm mt-1">Seluruh rincian jawaban kuesioner dari setiap responden terdata.</p>
                    </div>
                    <button 
                        onClick={handlePrint}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-2xl text-sm font-black shadow-xl shadow-emerald-500/20 transition-all active:scale-95"
                    >
                        <FiPrinter size={18} /> Cetak Laporan
                    </button>
                </div>
            }
        >
            <Head title="Laporan Lengkap" />

            <div className="pb-12">
                <div className="bg-[#111827] rounded-[2.5rem] border border-slate-800 shadow-3xl overflow-hidden printable-area">
                    <div className="p-6 border-b border-slate-800 bg-slate-800/10 flex items-center justify-between no-print">
                        <div className="flex items-center gap-3 text-amber-500">
                             <FiMove size={18} />
                             <span className="text-xs font-bold uppercase tracking-[0.2em]">Geser horizontal untuk melihat rincian kuesioner</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse min-w-[1500px]">
                            <thead>
                                <tr className="bg-[#0B0F19]">
                                    <th className="sticky left-0 z-10 bg-[#0B0F19] px-6 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800 w-48">Info Responden</th>
                                    {questions.map((q, i) => (
                                        <th key={i} className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-800 border-l border-slate-800/50 min-w-[200px]">
                                            Q{i+1}: {q}
                                        </th>
                                    ))}
                                    <th className="px-6 py-6 text-[10px] font-black text-rose-500 uppercase tracking-widest border-b border-slate-800 border-l border-slate-800/50 min-w-[250px]">Kritik & Saran</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {responses.map((res) => (
                                    <tr key={res.id} className="hover:bg-slate-800/20 transition-colors">
                                        <td className="sticky left-0 z-10 bg-[#111827] px-6 py-6 border-b border-slate-800">
                                            <div className="font-black text-white text-base mb-1">{res.nama}</div>
                                            <div className="text-[10px] text-slate-500 font-mono flex flex-col gap-1">
                                                <span>📅 {res.tanggal}</span>
                                                <span>📍 {res.lokasi}</span>
                                            </div>
                                        </td>
                                        {questions.map((q, i) => {
                                            const answer = res.answers.find(a => a.q === q);
                                            const score = answer ? answer.s : '-';
                                            return (
                                                <td key={i} className="px-6 py-6 border-l border-slate-800/30 text-center">
                                                    <span className={`inline-flex items-center justify-center w-10 h-10 rounded-xl font-black text-sm ${
                                                        score >= 80 ? 'bg-emerald-500/10 text-emerald-500' :
                                                        score >= 60 ? 'bg-amber-500/10 text-amber-500' : 'bg-rose-500/10 text-rose-500'
                                                    }`}>
                                                        {score}
                                                    </span>
                                                </td>
                                            );
                                        })}
                                        <td className="px-6 py-6 border-l border-slate-800/30">
                                            <p className="text-slate-400 text-xs italic leading-relaxed">
                                                {res.kritik_saran || 'Tidak ada saran.'}
                                            </p>
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
                    nav, header, .no-print, .pb-12, .shadow-3xl { display: none !important; }
                    body { background: white !important; color: black !important; padding: 0 !important; margin: 0 !important; }
                    .printable-area { border: 1px solid #000 !important; border-radius: 0 !important; width: 100% !important; overflow: visible !important; }
                    table { border-collapse: collapse !important; width: 100% !important; table-layout: auto !important; }
                    th, td { border: 1px solid #ddd !important; padding: 8px !important; color: black !important; font-size: 8px !important; background: transparent !important; position: static !important; }
                    .text-white, .font-black { color: black !important; }
                    .sticky { position: static !important; background: transparent !important; }
                    .bg-[#111827], .bg-[#0B0F19] { background: transparent !important; }
                    .w-10, .h-10 { width: auto !important; height: auto !important; background: transparent !important; }
                }
                .shadow-3xl {
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                }
            `}</style>
        </AuthenticatedLayout>
    );
}
