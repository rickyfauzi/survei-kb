import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { FiEye, FiTrash2, FiSearch, FiCalendar, FiMapPin, FiSmartphone, FiX, FiFilter, FiAward, FiPrinter, FiUsers, FiRefreshCw } from 'react-icons/fi';
import Modal from '@/Components/Modal';
import toast, { Toaster } from 'react-hot-toast';

export default function Responses({ auth, responses, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [dateStart, setDateStart] = useState(filters?.date_start || '');
    const [dateEnd, setDateEnd] = useState(filters?.date_end || '');
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isCertOpen, setIsCertOpen] = useState(false);
    const [selectedResponse, setSelectedResponse] = useState(null);

    const applyFilters = () => { router.get(route('admin.responses.index'), { search, date_start: dateStart, date_end: dateEnd }, { preserveState: true, preserveScroll: true }); };
    const clearFilters = () => { setSearch(''); setDateStart(''); setDateEnd(''); router.get(route('admin.responses.index')); };
    const deleteResponse = (id) => { if (confirm('Hapus data ini?')) router.delete(route('admin.responses.destroy', id), { preserveScroll: true, onSuccess: () => toast.success('Dihapus') }); };
    const openDetail = (r) => { setSelectedResponse(r); setIsDetailOpen(true); };
    const openCertificate = (r) => { setSelectedResponse(r); setIsCertOpen(true); };
    const closeDetail = () => { setIsDetailOpen(false); setTimeout(() => setSelectedResponse(null), 200); };
    const closeCert = () => { setIsCertOpen(false); setTimeout(() => setSelectedResponse(null), 200); };
    const contactWhatsApp = (num, name) => {
        const c = num.replace(/[^0-9]/g, ''); const f = c.startsWith('0') ? '62' + c.substring(1) : c;
        window.open(`https://wa.me/${f}?text=${encodeURIComponent(`Halo ${name}, terima kasih telah mengisi survei di Balai KB Argapura.`)}`, '_blank');
    };

    return (
        <AuthenticatedLayout header="Data Responden">
            <Head title="Responden" />
            <Toaster position="top-right" toastOptions={{ style: { fontSize: '13px' } }} />

            <div className="space-y-4 print:hidden">
                {/* Filter Card */}
                <div className="card">
                    <div className="card-header pb-3 border-b border-slate-100" style={{ padding: '16px' }}>
                        <h5 className="text-[13px] font-semibold text-slate-800">Filter Data</h5>
                    </div>
                    <div className="card-body">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                            <div className="md:col-span-4">
                                <label className="text-[12px] font-medium text-slate-600 mb-1.5 block">Cari Responden</label>
                                <div className="relative">
                                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                    <input type="text" placeholder="Nama, WA, lokasi..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && applyFilters()}
                                        className="w-full border border-slate-200 rounded-sm py-[7px] pl-9 pr-3 text-[13px] focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 placeholder:text-slate-400" />
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-[12px] font-medium text-slate-600 mb-1.5 block">Dari Tanggal</label>
                                <input type="date" value={dateStart} onChange={e => setDateStart(e.target.value)}
                                    className="w-full border border-slate-200 rounded-sm py-[7px] px-3 text-[13px] focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-[12px] font-medium text-slate-600 mb-1.5 block">Sampai Tanggal</label>
                                <input type="date" value={dateEnd} onChange={e => setDateEnd(e.target.value)}
                                    className="w-full border border-slate-200 rounded-sm py-[7px] px-3 text-[13px] focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400" />
                            </div>
                            <div className="md:col-span-4 flex gap-2">
                                <button onClick={applyFilters} className="flex-1 flex items-center justify-center gap-1.5 bg-[#405189] text-white py-[8px] rounded-sm text-[13px] font-medium hover:bg-[#3a4a7d] transition-colors">
                                    <FiFilter size={14}/> Terapkan
                                </button>
                                <button onClick={clearFilters} className="flex items-center justify-center gap-1.5 bg-white border border-slate-200 text-slate-600 py-[8px] px-3 rounded-sm text-[13px] hover:bg-slate-50 transition-colors">
                                    <FiRefreshCw size={13}/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Data Table Card */}
                <div className="card">
                    <div className="card-header flex items-center justify-between pb-3 border-b border-slate-100" style={{ padding: '16px' }}>
                        <h5 className="text-[13px] font-semibold text-slate-800">Database Responden</h5>
                        <span className="text-[12px] text-slate-400">{responses.data.length} data</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-left">Responden</th>
                                    <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-left hidden md:table-cell">Kontak</th>
                                    <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-left hidden lg:table-cell">Wilayah</th>
                                    <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-center w-20">Skor</th>
                                    <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-center w-28">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {responses.data.length === 0 ? (
                                    <tr><td colSpan="5" className="px-4 py-12 text-center text-slate-400 text-sm">Tidak ada data ditemukan.</td></tr>
                                ) : responses.data.map((r) => (
                                    <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 bg-indigo-50 rounded-sm flex items-center justify-center text-indigo-600 text-xs font-semibold shrink-0">{r.nama.charAt(0).toUpperCase()}</div>
                                                <div>
                                                    <p className="text-[13px] font-medium text-slate-700">{r.nama}</p>
                                                    <p className="text-[11px] text-slate-400">{new Date(r.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 hidden md:table-cell">
                                            <button onClick={() => contactWhatsApp(r.no_wa, r.nama)} className="text-[12px] text-green-600 font-medium hover:underline flex items-center gap-1"><FiSmartphone size={12}/> {r.no_wa}</button>
                                        </td>
                                        <td className="px-4 py-3 hidden lg:table-cell">
                                            <span className="text-[12px] text-slate-500">{r.lokasi}</span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`inline-block text-[12px] font-semibold px-2 py-0.5 rounded-sm ${r.rata_skor >= 80 ? 'bg-teal-50 text-teal-600' : r.rata_skor >= 60 ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'}`}>{r.rata_skor}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-0.5">
                                                <button onClick={() => openCertificate(r)} className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-sm" title="Piagam"><FiAward size={14} /></button>
                                                <button onClick={() => openDetail(r)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-sm" title="Detail"><FiEye size={14} /></button>
                                                <button onClick={() => deleteResponse(r.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-sm" title="Hapus"><FiTrash2 size={14} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    {responses.links && responses.links.length > 3 && (
                        <div className="p-4 border-t border-slate-100 flex justify-end">
                            <div className="inline-flex rounded-sm overflow-hidden border border-slate-200">
                                {responses.links.map((link, idx) => (
                                    <button key={idx} onClick={() => link.url && router.get(link.url, {}, { preserveState: true })} disabled={!link.url}
                                        className={`px-3 py-1.5 text-[12px] font-medium border-r border-slate-200 last:border-r-0 transition-colors ${link.active ? 'bg-[#405189] text-white' : link.url ? 'bg-white text-slate-600 hover:bg-slate-50' : 'bg-slate-50 text-slate-300'}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Detail Modal */}
            <Modal show={isDetailOpen} onClose={closeDetail} maxWidth="xl">
                {selectedResponse && (
                    <div className="bg-white rounded-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-[#405189] rounded-sm flex items-center justify-center text-white font-semibold">{selectedResponse.nama.charAt(0)}</div>
                                <div>
                                    <h5 className="text-[14px] font-semibold text-slate-800">{selectedResponse.nama}</h5>
                                    <p className="text-[11px] text-slate-400">{selectedResponse.lokasi} · {selectedResponse.no_wa}</p>
                                </div>
                            </div>
                            <button onClick={closeDetail} className="text-slate-400 hover:text-slate-600"><FiX size={18}/></button>
                        </div>
                        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-slate-50 border border-slate-100 rounded-sm p-4">
                                    <p className="text-[11px] text-slate-400 font-medium uppercase mb-1">Skor</p>
                                    <p className="text-2xl font-semibold text-slate-800">{selectedResponse.rata_skor}<span className="text-sm text-slate-400 font-normal"> / 100</span></p>
                                </div>
                                <div className="bg-slate-50 border border-slate-100 rounded-sm p-4">
                                    <p className="text-[11px] text-slate-400 font-medium uppercase mb-1">Klasifikasi</p>
                                    <p className={`text-lg font-semibold ${selectedResponse.rata_skor >= 80 ? 'text-teal-600' : selectedResponse.rata_skor >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                                        {selectedResponse.rata_skor >= 80 ? 'Sangat Puas' : selectedResponse.rata_skor >= 60 ? 'Puas' : 'Kurang Puas'}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <h6 className="text-[12px] font-semibold text-slate-600 uppercase tracking-wider mb-2">Rincian Jawaban</h6>
                                <div className="border border-slate-100 rounded-sm overflow-hidden divide-y divide-slate-50">
                                    {selectedResponse.answers && selectedResponse.answers.map((ans, idx) => (
                                        <div key={ans.id} className="px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors">
                                            <span className="text-[11px] font-semibold text-slate-400 w-5">{idx+1}.</span>
                                            <div className="flex-1">
                                                <p className="text-[13px] text-slate-600">{ans.question ? ans.question.question : '-'}</p>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <div className="w-14 h-1 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className={`h-full rounded-full ${ans.score >= 80 ? 'bg-teal-500' : ans.score >= 60 ? 'bg-amber-400' : 'bg-red-500'}`} style={{ width: `${ans.score}%` }} />
                                                </div>
                                                <span className="text-[12px] font-semibold text-slate-700 w-6 text-right">{ans.score}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {selectedResponse.kritik_saran && (
                                <div>
                                    <h6 className="text-[12px] font-semibold text-slate-600 uppercase tracking-wider mb-2">Kritik & Saran</h6>
                                    <div className="bg-slate-50 border border-slate-100 rounded-sm p-4">
                                        <p className="text-[13px] text-slate-600 italic leading-relaxed">"{selectedResponse.kritik_saran}"</p>
                                    </div>
                                </div>
                            )}
                            <div className="flex gap-2 pt-2">
                                <button onClick={() => contactWhatsApp(selectedResponse.no_wa, selectedResponse.nama)} className="flex-1 flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 text-white py-2 rounded-sm text-[13px] font-medium transition-colors"><FiSmartphone size={14}/> WhatsApp</button>
                                <button onClick={() => openCertificate(selectedResponse)} className="flex-1 flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-sm text-[13px] font-medium transition-colors"><FiAward size={14}/> Piagam</button>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Certificate Modal */}
            <Modal show={isCertOpen} onClose={closeCert} maxWidth="4xl">
                {selectedResponse && (
                    <div className="bg-white rounded-sm overflow-hidden">
                        <div className="print:hidden p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                            <h5 className="text-[13px] font-semibold text-slate-800 flex items-center gap-2"><FiAward className="text-amber-500"/> Preview Piagam</h5>
                            <div className="flex gap-2">
                                <button onClick={() => window.print()} className="flex items-center gap-1.5 bg-[#405189] text-white px-3 py-1.5 rounded-sm text-[12px] font-medium hover:bg-[#3a4a7d]"><FiPrinter size={13}/> Cetak</button>
                                <button onClick={closeCert} className="text-slate-400 hover:text-slate-600 p-1"><FiX size={18}/></button>
                            </div>
                        </div>
                        <div className="p-8 bg-white flex justify-center overflow-x-auto print:p-0">
                            <div className="w-[800px] h-[560px] border-[12px] border-double border-slate-800 p-10 relative bg-white flex flex-col items-center justify-between text-slate-900 shrink-0">
                                <div className="flex justify-between w-full items-center pb-6 border-b border-slate-200">
                                    <img src="/1000492763-removebg-preview.png" alt="BKKBN" className="h-14 object-contain" />
                                    <div className="text-center"><h2 className="text-xl font-bold uppercase tracking-tight">Survei Kepuasan Layanan</h2><p className="text-[10px] font-semibold text-amber-600 tracking-widest uppercase">Balai KB Argapura</p></div>
                                    <img src="/Logogram-Warna.png" alt="Logo" className="h-12 object-contain" />
                                </div>
                                <div className="text-center flex-1 flex flex-col justify-center gap-3">
                                    <h1 className="text-4xl font-serif">Piagam Penghargaan</h1>
                                    <p className="text-sm text-slate-500 italic">Diberikan sebagai tanda terima kasih kepada :</p>
                                    <h3 className="text-3xl font-bold uppercase tracking-tight border-b-2 border-amber-500 pb-1 inline-block mx-auto px-6">{selectedResponse.nama}</h3>
                                    <p className="max-w-lg mx-auto text-xs leading-relaxed text-slate-500 mt-2">Terima kasih atas partisipasi aktif dalam Survei Kepuasan Masyarakat Balai KB Argapura.</p>
                                </div>
                                <div className="w-full flex justify-between items-end pt-6 border-t border-slate-200">
                                    <div><p className="text-[9px] text-slate-400 font-semibold uppercase mb-1">ID</p><p className="text-xs font-mono font-bold">ARG-{selectedResponse.id}-{new Date(selectedResponse.created_at).getFullYear()}</p></div>
                                    <div className="text-center"><div className="w-28 border-b border-slate-900 mb-2 mx-auto h-12"></div><p className="text-xs font-bold uppercase">Admin Balai KB</p></div>
                                    <div className="text-right"><p className="text-xs font-semibold">{new Date(selectedResponse.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            <style>{`@media print { .print\\:hidden, nav, header { display:none!important; } * { -webkit-print-color-adjust:exact!important; print-color-adjust:exact!important; } }`}</style>
        </AuthenticatedLayout>
    );
}
