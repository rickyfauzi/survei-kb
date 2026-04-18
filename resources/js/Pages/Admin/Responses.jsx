import { useState, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { FiEye, FiTrash2, FiSearch, FiCalendar, FiMapPin, FiMessageSquare, FiUser, FiSmartphone, FiX, FiFilter, FiAward, FiPrinter, FiSend } from 'react-icons/fi';
import Modal from '@/Components/Modal';
import toast, { Toaster } from 'react-hot-toast';

export default function Responses({ auth, responses, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [dateStart, setDateStart] = useState(filters?.date_start || '');
    const [dateEnd, setDateEnd] = useState(filters?.date_end || '');
    
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isCertOpen, setIsCertOpen] = useState(false);
    const [selectedResponse, setSelectedResponse] = useState(null);

    const certificateRef = useRef();

    const handleSearch = (e) => {
        if (e.key === 'Enter') applyFilters();
    };

    const applyFilters = () => {
        router.get(route('admin.responses.index'), { search, date_start: dateStart, date_end: dateEnd }, { preserveState: true, preserveScroll: true });
    };

    const clearFilters = () => {
        setSearch(''); setDateStart(''); setDateEnd('');
        router.get(route('admin.responses.index'));
    };

    const deleteResponse = (id) => {
        if (confirm('Delete this response record? This action cannot be undone.')) {
            router.delete(route('admin.responses.destroy', id), {
                preserveScroll: true,
                onSuccess: () => toast.success('Response deleted successfully')
            });
        }
    };

    const openDetail = (resp) => {
        setSelectedResponse(resp);
        setIsDetailOpen(true);
    };

    const openCertificate = (resp) => {
        setSelectedResponse(resp);
        setIsCertOpen(true);
    };

    const closeDetail = () => {
        setIsDetailOpen(false);
        setTimeout(() => setSelectedResponse(null), 300);
    };

    const closeCert = () => {
        setIsCertOpen(false);
        setTimeout(() => setSelectedResponse(null), 300);
    };

    const handlePrint = () => {
        window.print();
    };

    const contactWhatsApp = (num, name) => {
        const cleanNum = num.replace(/[^0-9]/g, '');
        const finalNum = cleanNum.startsWith('0') ? '62' + cleanNum.substring(1) : cleanNum;
        const msg = encodeURIComponent(`Halo Ibu/Bapak ${name},\n\nTerima kasih telah mengisi Survei Kepuasan di Balai KB Argapura. Masukan Anda sangat berarti bagi kami.`);
        window.open(`https://wa.me/${finalNum}?text=${msg}`, '_blank');
    };

    return (
        <AuthenticatedLayout header="Responses Data">
            <Head title="Data Responden" />
            <Toaster position="top-center" toastOptions={{
                className: 'font-medium rounded-lg text-sm transition-all',
                style: { background: '#1F2937', color: '#fff', border: '1px solid #374151' }
            }} />

            <div className="pb-8 print:hidden">
                
                {/* Dashdark Advanced Filter Bar */}
                <div className="bg-[#111827] rounded-xl border border-slate-800 p-4 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-1/3">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16}/>
                        <input
                            type="text"
                            placeholder="Search user, WhatsApp..."
                            className="w-full bg-[#1F2937] border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg py-2 pl-9 pr-4 text-sm text-white placeholder-slate-500"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={handleSearch}
                        />
                    </div>
                    
                    <div className="flex w-full md:w-auto gap-3 items-center bg-[#1F2937] border border-slate-700 px-3 py-1.5 rounded-lg">
                        <FiCalendar className="text-slate-500" size={16}/>
                        <input
                            type="date"
                            className="border-none bg-transparent text-slate-300 text-sm focus:ring-0 p-0 hover:text-white transition-colors"
                            value={dateStart}
                            onChange={(e) => setDateStart(e.target.value)}
                        />
                        <span className="text-slate-600">-</span>
                        <input
                            type="date"
                            className="border-none bg-transparent text-slate-300 text-sm focus:ring-0 p-0 hover:text-white transition-colors"
                            value={dateEnd}
                            onChange={(e) => setDateEnd(e.target.value)}
                        />
                    </div>

                    <div className="flex w-full md:w-auto gap-3">
                        <button onClick={applyFilters} className="flex items-center gap-2 flex-1 md:flex-none bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-500 transition-colors shadow-lg">
                            <FiFilter size={16}/> Filter
                        </button>
                        {(search || dateStart || dateEnd) && (
                            <button onClick={clearFilters} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-700 hover:text-white transition-colors border border-slate-700">
                                Reset
                            </button>
                        )}
                    </div>
                </div>

                {/* Table Data Container */}
                <div className="bg-[#111827] rounded-xl border border-slate-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#1F2937]/50">
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">Respondent</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800 hidden md:table-cell">Contact & Area</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800 text-center">Score</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {responses.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-16 text-center text-slate-500 text-sm">
                                            No responses found matching criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    responses.data.map((resp) => (
                                        <tr key={resp.id} className="hover:bg-[#1F2937] transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded shadow-sm bg-[#1F2937] flex items-center justify-center font-bold text-white border border-slate-700 shrink-0">
                                                        {resp.nama.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-slate-200 text-sm">{resp.nama}</h4>
                                                        <p className="text-xs text-slate-500 mt-0.5">
                                                            {new Date(resp.created_at).toLocaleString('en-US', {month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute:'2-digit'})}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 hidden md:table-cell text-nowrap">
                                                <div className="text-xs">
                                                    <button 
                                                        onClick={() => contactWhatsApp(resp.no_wa, resp.nama)}
                                                        className="text-emerald-400 font-bold hover:text-emerald-300 flex items-center gap-1.5 transition-colors group/wa"
                                                    >
                                                        <FiSmartphone className="text-emerald-500 group-hover/wa:scale-110 transition-transform"/> {resp.no_wa}
                                                        <FiSend className="opacity-0 group-hover/wa:opacity-100 transition-opacity ml-1" size={10}/>
                                                    </button>
                                                    <p className="text-slate-500 mt-1 flex items-center gap-1.5"><FiMapPin className="text-slate-600"/> {resp.lokasi} • {resp.angkatan}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-2.5 py-1 rounded text-xs font-bold border ${
                                                    resp.rata_skor >= 80 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                    resp.rata_skor >= 60 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                    'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                                }`}>
                                                    {resp.rata_skor}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button onClick={() => openCertificate(resp)} className="p-2 text-amber-400 hover:text-amber-300 hover:bg-amber-400/10 rounded border border-transparent hover:border-amber-400/20 transition-all" title="Generate Certificate">
                                                        <FiAward size={16} />
                                                    </button>
                                                    <button onClick={() => openDetail(resp)} className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded border border-transparent hover:border-blue-400/20 transition-all" title="View details">
                                                        <FiEye size={16} />
                                                    </button>
                                                    <button onClick={() => deleteResponse(resp.id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded border border-transparent hover:border-red-400/20 transition-all" title="Delete record">
                                                        <FiTrash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {responses.links && responses.links.length > 3 && (
                    <div className="mt-6 flex justify-center">
                        <div className="inline-flex gap-1 bg-[#111827] p-1 rounded-lg border border-slate-800">
                            {responses.links.map((link, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                    disabled={!link.url}
                                    className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                                        link.active ? 'bg-blue-600 text-white' : 
                                        link.url ? 'text-slate-400 hover:bg-[#1F2937] hover:text-white' : 'text-slate-600 cursor-not-allowed hidden md:block'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Certificate Modal */}
            <Modal show={isCertOpen} onClose={closeCert} maxWidth="4xl">
                {selectedResponse && (
                    <div className="bg-[#111827] border border-slate-700 rounded-2xl overflow-hidden shadow-2xl flex flex-col items-center">
                        <div className="print:hidden w-full p-6 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#1F2937]/50">
                            <h3 className="text-white font-bold flex items-center gap-2"><FiAward className="text-amber-500"/> Certificate Management</h3>
                            <div className="flex gap-2 w-full sm:w-auto">
                                <button 
                                    onClick={() => contactWhatsApp(selectedResponse.no_wa, selectedResponse.nama)}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-900/20"
                                >
                                    <FiSend size={16}/> KIRIM KE WA
                                </button>
                                <button 
                                    onClick={handlePrint} 
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-amber-500 text-amber-950 px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-amber-400 transition-all shadow-lg shadow-amber-900/20"
                                >
                                    <FiPrinter size={16}/> DOWNLOAD / CETAK
                                </button>
                                <button onClick={closeCert} className="text-slate-400 hover:text-white bg-slate-800 p-2.5 rounded-lg border border-slate-700"><FiX size={18}/></button>
                            </div>
                        </div>

                        <div className="p-10 bg-white w-full flex justify-center overflow-x-auto print:p-0">
                            {/* Certificate Design */}
                            <div id="certificate-print-area" className="w-[800px] h-[580px] border-[16px] border-double border-indigo-900 p-10 relative bg-white flex flex-col items-center justify-between text-slate-900 shrink-0">
                                {/* Corners */}
                                <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-amber-500"></div>
                                <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-amber-500"></div>
                                <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-amber-500"></div>
                                <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-amber-500"></div>

                                {/* Logos */}
                                <div className="flex justify-between w-full items-center mb-4">
                                    <img src="/1000492763-removebg-preview.png" alt="BKKBN Logo" className="h-14 object-contain" />
                                    <div className="text-center">
                                        <h2 className="text-2xl font-black text-indigo-950 uppercase tracking-tighter">SURVEI KEPUASAN LAYANAN</h2>
                                        <p className="text-[10px] font-bold text-amber-600 tracking-[0.3em] uppercase">Balai KB Argapura</p>
                                    </div>
                                    <img src="/Logogram-Warna.png" alt="Logo" className="h-14 object-contain" />
                                </div>

                                <div className="text-center flex-1 flex flex-col justify-center gap-4">
                                    <h1 className="text-5xl font-serif text-indigo-900 border-b-2 border-slate-100 pb-4 mb-2">Piagam Penghargaan</h1>
                                    <p className="font-medium text-slate-500 italic">Diberikan Sebagai Tanda Terima Kasih Kepada :</p>
                                    
                                    <div className="py-2">
                                        <h3 className="text-4xl font-bold text-slate-900 uppercase tracking-tight underline decoration-amber-500 decoration-offset-4">{selectedResponse.nama}</h3>
                                        <p className="text-sm text-slate-400 mt-2 font-semibold">Responden - {selectedResponse.angkatan}</p>
                                    </div>

                                    <p className="max-w-xl mx-auto text-sm leading-relaxed text-slate-600 px-8">
                                        Terima kasih yang sebesar-besarnya atas partisipasi aktif Anda dalam memberikan evaluasi dan masukan yang konstruktif melalui Survei Indeks Kepuasan Masyarakat (IKM) pada pelayanan Balai KB Argapura. Kontribusi Anda merupakan fondasi utama bagi peningkatan kualitas pelayanan keluarga berencana kami.
                                    </p>
                                </div>

                                <div className="w-full flex justify-between items-end mt-10">
                                    <div className="text-left">
                                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1">ID SERTIFIKAT</p>
                                        <p className="text-xs font-mono font-bold text-slate-600">ARG-{selectedResponse.id}-{new Date(selectedResponse.created_at).getFullYear()}</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-32 h-20 border-b border-indigo-900 mb-2 mx-auto relative">
                                            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                                                <img src="/Logogram-Warna.png" className="h-16 grayscale" alt="Stamp" />
                                            </div>
                                        </div>
                                        <p className="text-sm font-bold text-slate-900 uppercase">Admin Balai KB</p>
                                        <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Petugas Pelaksana</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">{new Date(selectedResponse.created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}</p>
                                        <p className="text-[9px] text-slate-400 font-bold">TANGGAL PENERBITAN</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Detail View Modal Dashdark Style */}
            <Modal show={isDetailOpen} onClose={closeDetail} maxWidth="2xl">
                {selectedResponse && (
                    <div className="bg-[#111827] border border-slate-700 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="p-6 border-b border-slate-800 bg-[#1F2937]/50 flex justify-between items-start shrink-0">
                            <div className="flex gap-4 items-center">
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-2xl text-white shadow-lg">
                                    {selectedResponse.nama.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">{selectedResponse.nama}</h2>
                                    <div className="flex gap-3 text-sm mt-1 text-slate-400">
                                        <span className="flex items-center gap-1.5"><FiMapPin size={14}/> {selectedResponse.lokasi}</span>
                                        <button 
                                            onClick={() => contactWhatsApp(selectedResponse.no_wa, selectedResponse.nama)}
                                            className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors font-medium border-b border-emerald-400/20"
                                        >
                                            <FiSmartphone size={14}/> {selectedResponse.no_wa}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <button onClick={closeDetail} className="text-slate-500 hover:text-white bg-slate-800 p-2 rounded-lg transition-colors"><FiX size={18}/></button>
                        </div>

                        {/* Body Scrollable */}
                        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
                            
                            {/* Score Card */}
                            <div className="bg-[#1F2937] border border-slate-700/50 p-4 rounded-xl flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-1">Final Index Score</p>
                                    <p className="text-3xl font-extrabold text-white">{selectedResponse.rata_skor}</p>
                                </div>
                                <div className="w-16 h-16 rounded-full border-4 flex items-center justify-center border-slate-800 relative">
                                    <div className={`absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent transform rotate-45 opacity-50`}></div>
                                    <span className="text-white font-bold text-sm">/ 100</span>
                                </div>
                            </div>

                            <button onClick={() => openCertificate(selectedResponse)} className="w-full flex items-center justify-center gap-3 bg-amber-500/10 text-amber-500 border border-amber-500/20 py-3 rounded-xl font-bold text-sm hover:bg-amber-500 hover:text-amber-950 transition-all">
                                <FiAward size={18}/> GENERATE OFFICIAL CERTIFICATE
                            </button>

                            {/* Itemized Questions */}
                            <div>
                                <h3 className="font-semibold text-slate-300 text-sm mb-3">Itemized Evaluaton</h3>
                                <div className="border border-slate-800 rounded-xl divide-y divide-slate-800 overflow-hidden bg-[#1F2937]/30">
                                    {selectedResponse.answers && selectedResponse.answers.map((ans, idx) => (
                                        <div key={ans.id} className="p-4 flex items-start gap-4 hover:bg-[#1F2937] transition-colors">
                                            <span className="text-xs font-bold text-slate-500 w-4 text-right pt-0.5">{idx + 1}.</span>
                                            <div className="flex-1">
                                                <p className="text-sm text-slate-200 mb-2">{ans.question ? ans.question.question : 'Archived Question'}</p>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                        <div 
                                                            className={`h-full rounded-full transition-all duration-1000 ${
                                                                ans.score >= 80 ? 'bg-emerald-500' :
                                                                ans.score >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                                                            }`} 
                                                            style={{ width: `${ans.score}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-400 w-6">{ans.score}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Feedback */}
                            {selectedResponse.kritik_saran && (
                                <div>
                                    <h3 className="font-semibold text-slate-300 text-sm mb-3">Feedback & Notes</h3>
                                    <div className="bg-[#1F2937]/50 border border-slate-700/50 p-5 rounded-xl">
                                        <FiMessageSquare className="text-slate-600 mb-2" size={20} />
                                        <p className="text-sm text-slate-400 leading-relaxed italic">
                                            "{selectedResponse.kritik_saran}"
                                        </p>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                )}
            </Modal>

            <style>{`
                @media print {
                    .print\\:hidden { display: none !important; }
                    body { margin: 0; padding: 0; background: white !important; }
                    #certificate-print-area { 
                        width: 100%; 
                        height: auto; 
                        border: 10px double #1E1B4B !important;
                        position: static !important;
                        margin: 0 !important;
                    }
                }
            `}</style>
        </AuthenticatedLayout>
    );
}
