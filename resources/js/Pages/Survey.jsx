import { useState, useEffect } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiUser, 
    FiMessageSquare, 
    FiSliders, 
    FiCheckCircle, 
    FiChevronRight, 
    FiChevronLeft,
    FiShield,
    FiZap,
    FiLock,
    FiHome
} from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';

// ─── UTILS ───────────────────────────────────────────────────────────────────

const FadeUp = ({ children, delay = 0, className = "" }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
        className={className}
    >
        {children}
    </motion.div>
);

const SectionLabel = ({ children, className = "" }) => (
    <div className={`flex items-center gap-2 mb-6 ${className}`}>
        <div className="w-8 h-[2px] bg-amber-500/30"></div>
        <span className="text-amber-600 font-bold text-[10px] uppercase tracking-[0.3em]">
            {children}
        </span>
    </div>
);

const ScoreFeedback = ({ score }) => {
    const configs = [
        { min: 0, max: 0, emoji: "😶", label: "Belum Dinilai", color: "text-slate-400", bg: "bg-slate-50", border: "border-slate-100" },
        { min: 1, max: 20, emoji: "☹️", label: "Sangat Kecewa", color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100" },
        { min: 21, max: 40, emoji: "🙁", label: "Kurang Puas", color: "text-rose-500", bg: "bg-rose-50/50", border: "border-rose-100/50" },
        { min: 41, max: 60, emoji: "🙂", label: "Cukup Baik", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
        { min: 61, max: 85, emoji: "😊", label: "Sangat Puas", color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100" },
        { min: 86, max: 100, emoji: "🤩", label: "Luar Biasa!", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
    ];
    const config = configs.find(c => score >= c.min && score <= c.max) || configs[0];
    
    return (
        <AnimatePresence mode="wait">
            <motion.div 
                key={config.label}
                initial={{ opacity: 0, scale: 0.8, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.1, y: -5 }}
                className={`flex items-center gap-3 px-4 py-2 rounded-2xl border ${config.bg} ${config.border} transition-all duration-500`}
            >
                <span className="text-2xl">{config.emoji}</span>
                <span className={`text-[10px] font-black uppercase tracking-widest ${config.color}`}>{config.label}</span>
            </motion.div>
        </AnimatePresence>
    );
};

// ─── SURVEY COMPONENT ────────────────────────────────────────────────────────

export default function Survey({ questions, lokasi }) {
    const [step, setStep] = useState(1);
    const { data, setData, post, processing, errors } = useForm({
        nama: '',
        angkatan: '',
        no_wa: '',
        kritik_saran: '',
        lokasi: lokasi || '',
        answers: questions.map(q => ({ question_id: q.id, score: 0 }))
    });

    const isStep1Valid = data.nama.trim() !== '' && data.angkatan.trim() !== '';

    const handleNext = () => {
        if (step === 1 && !isStep1Valid) {
            toast.error('Mohon lengkapi data identitas Anda.');
            return;
        }
        
        if (step === 2) {
            const hasZero = data.answers.some(a => a.score === 0);
            if (hasZero) {
                toast.error('Mohon berikan penilaian untuk semua kriteria.');
                return;
            }
        }
        
        setStep(Math.min(4, step + 1));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    const handlePrev = () => setStep(Math.max(1, step - 1));

    const handleScoreChange = (questionId, score) => {
        setData('answers', data.answers.map(ans => 
            ans.question_id === questionId ? { ...ans, score: parseInt(score) } : ans
        ));
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('survey.store'), {
            onError: (err) => {
                if (err.message) toast.error(err.message);
                else toast.error('Terjadi kesalahan. Silakan cek kembali data Anda.');
            }
        });
    };

    const slideVariants = {
        initial: { opacity: 0, x: 50 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -50 }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-['Instrument_Sans',_sans-serif] text-slate-900 selection:bg-amber-600 selection:text-white">
            <Head title="Kuesioner Kepuasan Layanan — Balai KB Argapura" />
            <Toaster position="top-right" toastOptions={{
                className: 'rounded-2xl font-bold shadow-2xl border border-slate-100',
                duration: 4000
            }} />

            {/* Premium Background Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute inset-0 bg-[radial-gradient(#dfe1e5_1px,transparent_1px)] [background-size:32px_32px] opacity-40"></div>
                <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] bg-amber-100/30 rounded-full blur-[120px]"></div>
                <div className="absolute top-[40%] -left-[10%] w-[40%] h-[40%] bg-indigo-100/30 rounded-full blur-[100px]"></div>
            </div>

            {/* Full height container */}
            <div className="relative z-10 flex flex-col md:flex-row min-h-screen">
                
                {/* ─── LEFT SIDE: Context & Stats ─────────────────────────────────── */}
                <div className="w-full md:w-1/3 lg:w-1/4 bg-slate-900 md:h-screen md:sticky md:top-0 px-6 sm:px-8 py-10 md:py-20 flex flex-col justify-between overflow-hidden shadow-2xl">
                    {/* Background Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-600/10 via-amber-600/5 to-transparent -z-10 blur-3xl opacity-50" />
                    
                    <div>
                        <Link href="/" className="inline-flex items-center gap-2 mb-8 md:mb-12 group">
                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center transition-colors group-hover:bg-amber-500">
                                <FiHome className="text-white" size={18} />
                            </div>
                            <span className="font-bold text-white tracking-tight">Balai KB <span className="text-amber-500">Argapura</span></span>
                        </Link>

                        <div className="space-y-4 md:space-y-0">
                            <FadeUp>
                                <SectionLabel className="text-amber-400">Transformasi Layanan</SectionLabel>
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight mb-4 md:mb-6">
                                    Suara Anda, <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-indigo-300">
                                        Masa Depan Kami.
                                    </span>
                                </h1>
                                <p className="text-slate-400 text-xs sm:text-sm lg:text-base leading-relaxed mb-6 md:mb-10 max-w-md md:max-w-none">
                                    Partisipasi Anda membantu kami mewujudkan standarisasi pelayanan keluarga berencana yang lebih prima & transparan.
                                </p>
                            </FadeUp>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-3 md:space-y-4">
                                {[
                                    { icon: <FiLock />, text: "Data Dienkripsi & Anonim" },
                                    { icon: <FiShield />, text: "Standar BKKBN Terverifikasi" },
                                    { icon: <FiZap />, text: "Hanya Butuh 2 Menit" }
                                ].map((item, i) => (
                                    <FadeUp key={i} delay={0.2 + (i * 0.1)}>
                                        <div className="flex items-center gap-3 text-white/50 text-[10px] font-semibold uppercase tracking-wider">
                                            <span className="text-amber-500">{item.icon}</span>
                                            {item.text}
                                        </div>
                                    </FadeUp>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 md:mt-20 pt-6 md:pt-10 border-t border-white/5 hidden sm:block">
                        <div className="flex -space-x-3 mb-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 overflow-hidden shadow-xl">
                                    <img src={`https://ui-avatars.com/api/?name=U${i}&background=${i % 2 ? 'f59e0b' : '6366f1'}&color=fff&bold=true`} alt="User" />
                                </div>
                            ))}
                        </div>
                        <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest">Bergabunglah dengan ratusan responden lainnya</p>
                    </div>
                </div>

                {/* ─── RIGHT SIDE: Interactive Form ────────────────────────────── */}
                <div className="flex-1 px-4 sm:px-10 lg:px-24 py-8 md:py-20 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="w-full max-w-2xl bg-white rounded-[2rem] md:rounded-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-slate-100 overflow-hidden flex flex-col h-full md:min-h-[700px]">
                        
                        {/* Progress Header */}
                        <div className="bg-slate-50/50 px-6 sm:px-8 py-5 md:py-6 border-b border-slate-100 flex items-center justify-between shadow-sm">
                            <div className="flex gap-2 w-24 sm:w-32">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className={`h-1.5 rounded-full transition-all duration-500 flex-1 ${step >= i ? 'bg-amber-500' : 'bg-slate-200'}`}></div>
                                ))}
                            </div>
                            <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Tahap <span className="text-indigo-600">{step}</span> / 4</span>
                        </div>

                        {/* Slide Content */}
                        <div className="flex-1 p-6 sm:p-12 lg:p-16 overflow-y-auto max-h-[70vh] md:max-h-none">
                            <AnimatePresence mode="wait">
                                
                                {/* Step 1: Identity */}
                                {step === 1 && (
                                    <motion.div key="st1" {...slideVariants} className="space-y-8 md:space-y-10">
                                        <div>
                                            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">Siapa Anda?</h2>
                                            <p className="text-slate-500 text-sm font-medium">Bantu kami mengenal audiens pelayanan kami dengan lebih baik.</p>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="space-y-2 group">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Nama Lengkap*</label>
                                                <div className="relative">
                                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors">
                                                        <FiUser size={18} />
                                                    </div>
                                                    <input 
                                                        type="text" 
                                                        className="w-full pl-14 pr-6 py-4 rounded-xl md:rounded-2xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 transition-all font-semibold outline-none text-sm md:text-base"
                                                        value={data.nama}
                                                        onChange={e => setData('nama', e.target.value)}
                                                        placeholder="Ketik nama Anda di sini..."
                                                    />
                                                </div>
                                                {errors.nama && <p className="text-rose-500 text-[10px] font-bold uppercase tracking-widest mt-2">{errors.nama}</p>}
                                            </div>

                                            <div className="space-y-2 group">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Kategori Pelapor*</label>
                                                <select 
                                                    className="w-full px-6 py-4 rounded-xl md:rounded-2xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 transition-all font-semibold outline-none appearance-none text-sm md:text-base"
                                                    value={data.angkatan}
                                                    onChange={e => setData('angkatan', e.target.value)}
                                                >
                                                    <option value="" disabled>Pilih salah satu...</option>
                                                    <option value="Masyarakat Umum">Masyarakat Umum</option>
                                                    <option value="Kader Desa / PPKBD">Kader Desa/PPKBD</option>
                                                    <option value="Siswa / Kelompok PIK-R">Kelompok PIK-Remaja</option>
                                                    <option value="Kelompok Tribina">Tribina (BKB/BKR/BKL)</option>
                                                    <option value="Instansi Kecamatan">Lintas Sektor</option>
                                                </select>
                                                {errors.angkatan && <p className="text-rose-500 text-[10px] font-bold uppercase tracking-widest mt-2">{errors.angkatan}</p>}
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                <div className="space-y-2 group">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1 text-nowrap">Asal Desa (Opsional)</label>
                                                    <input 
                                                        type="text" 
                                                        className="w-full px-6 py-4 rounded-xl md:rounded-2xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 transition-all font-semibold outline-none text-sm md:text-base"
                                                        value={data.lokasi}
                                                        onChange={e => setData('lokasi', e.target.value)}
                                                        placeholder="Nama desa..."
                                                    />
                                                </div>
                                                <div className="space-y-2 group">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">WhatsApp (Opsional)</label>
                                                    <input 
                                                        type="tel" 
                                                        className="w-full px-6 py-4 rounded-xl md:rounded-2xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 transition-all font-semibold outline-none text-sm md:text-base"
                                                        value={data.no_wa}
                                                        onChange={e => setData('no_wa', e.target.value)}
                                                        placeholder="08..."
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Step 2: Scoring */}
                                {step === 2 && (
                                    <motion.div key="st2" {...slideVariants} className="space-y-12">
                                        <div>
                                            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">Beri Penilaian</h2>
                                            <p className="text-slate-500 text-sm font-medium italic">Geser indikator untuk menyesuaikan tingkat kepuasan Anda.</p>
                                        </div>

                                        <div className="space-y-12 pb-10">
                                            {questions.map((q, idx) => {
                                                const ans = data.answers.find(a => a.question_id === q.id);
                                                const score = ans ? ans.score : 0;

                                                return (
                                                    <div key={q.id} className="relative group/card pb-6 border-b border-slate-50 last:border-0 last:pb-0">
                                                        <div className="flex items-start gap-4 mb-8">
                                                            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center shrink-0 border border-indigo-100 group-hover/card:scale-110 transition-transform">
                                                                {idx + 1}
                                                            </div>
                                                            <p className="font-bold text-slate-800 text-base sm:text-xl leading-tight group-hover/card:text-indigo-900 transition-colors uppercase tracking-tight">{q.question}</p>
                                                        </div>
                                                        
                                                        <div className="px-1 relative h-6 flex items-center">
                                                            {/* Base Track */}
                                                            <div className="absolute inset-x-1 h-3 bg-slate-100 rounded-full shadow-inner pointer-events-none"></div>
                                                            
                                                            {/* Dynamic Color Track */}
                                                            <div 
                                                                className={`absolute left-1 h-3 rounded-full transition-all duration-300 pointer-events-none bg-gradient-to-r ${
                                                                    score === 0 ? 'from-slate-200 to-slate-200' :
                                                                    score <= 35 ? 'from-rose-500 to-rose-400' :
                                                                    score <= 70 ? 'from-amber-400 to-amber-500' :
                                                                    'from-emerald-400 to-emerald-600'
                                                                }`}
                                                                style={{ width: `calc(${score}%)`, opacity: score > 0 ? 1 : 0 }}
                                                            />

                                                            <input 
                                                                type="range" 
                                                                min="0" max="100" step="1"
                                                                value={score}
                                                                onChange={e => handleScoreChange(q.id, e.target.value)}
                                                                className="absolute inset-x-0 w-full h-8 bg-transparent appearance-none cursor-pointer outline-none z-10 accent-white"
                                                            />

                                                            {/* Custom Thumb Glow Effect (Sync with handle) */}
                                                            <div 
                                                                className="absolute h-6 w-1 rounded-full bg-white shadow-xl pointer-events-none z-20"
                                                                style={{ left: `calc(${score}% + (1px))` }}
                                                            ></div>
                                                        </div>

                                                        <div className="flex justify-between text-[8px] sm:text-[10px] font-bold text-slate-400 mt-4 uppercase tracking-[0.2em] px-2 italic">
                                                            <span className={score > 0 && score <= 35 ? 'text-rose-500' : ''}>Kecewa</span>
                                                            <span className={score > 35 && score <= 70 ? 'text-amber-500' : ''}>Biasa</span>
                                                            <span className={score > 70 ? 'text-emerald-600' : ''}>Luar Biasa</span>
                                                        </div>

                                                        <div className="mt-8 flex items-center justify-between gap-4">
                                                            <div className="flex items-baseline gap-1">
                                                                <motion.span 
                                                                    key={score}
                                                                    initial={{ opacity: 0, scale: 0.5 }}
                                                                    animate={{ opacity: 1, scale: 1 }}
                                                                    className={`text-3xl sm:text-4xl font-black tabular-nums transition-colors duration-500 ${
                                                                        score === 0 ? 'text-slate-200' :
                                                                        score <= 35 ? 'text-rose-600' :
                                                                        score <= 70 ? 'text-amber-600' :
                                                                        'text-emerald-600'
                                                                    }`}
                                                                >
                                                                    {score}
                                                                </motion.span>
                                                                <span className="text-[10px] font-bold text-slate-300">/100</span>
                                                            </div>
                                                            
                                                            <ScoreFeedback score={score} />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                )}

                                {/* Step 3: Message */}
                                {step === 3 && (
                                    <motion.div key="st3" {...slideVariants} className="space-y-8 md:space-y-10">
                                        <div>
                                            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">Kritik & Saran</h2>
                                            <p className="text-slate-500 text-sm font-medium">Jangan ragu memberikan masukan jujur untuk perbaikan kami.</p>
                                        </div>

                                        <div className="relative group">
                                            <div className="absolute right-6 top-6 text-slate-200 group-focus-within:text-amber-500 transition-colors pointer-events-none">
                                                <FiMessageSquare size={32} />
                                            </div>
                                            <textarea 
                                                rows="8"
                                                className="w-full rounded-2xl md:rounded-[2.5rem] border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 transition-all font-semibold outline-none p-6 md:p-10 leading-relaxed shadow-inner text-sm md:text-base"
                                                value={data.kritik_saran}
                                                onChange={e => setData('kritik_saran', e.target.value)}
                                                placeholder="Ketik masukan Anda di sini..."
                                            ></textarea>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Step 4: Finalization */}
                                {step === 4 && (
                                    <motion.div key="st4" {...slideVariants} className="space-y-8 md:space-y-10">
                                        <div className="text-center mb-2">
                                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-50 text-emerald-600 rounded-2xl md:rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner border border-emerald-100">
                                                <FiCheckCircle size={36} />
                                            </div>
                                            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">Selesai!</h2>
                                            <p className="text-slate-500 text-sm font-medium">Mohon cek ringkasan di bawah ini sebelum mengirim.</p>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="bg-slate-50/80 p-5 rounded-2xl md:rounded-[2rem] border border-slate-200/50">
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-4">Ringkasan Profil</p>
                                                <div className="flex flex-wrap gap-x-8 gap-y-4">
                                                    <div>
                                                        <p className="text-[8px] text-slate-400 font-medium uppercase tracking-tight">Nama</p>
                                                        <p className="font-bold text-slate-900 text-sm">{data.nama}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[8px] text-slate-400 font-medium uppercase tracking-tight">Kategori</p>
                                                        <p className="font-bold text-slate-900 text-sm">{data.angkatan}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-slate-50/80 p-5 rounded-2xl md:rounded-[2rem] border border-slate-200/50">
                                                <div className="flex justify-between items-center mb-6">
                                                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Kepuasan Rata-Rata</p>
                                                     <p className="text-2xl sm:text-3xl font-black text-indigo-600">
                                                        {(data.answers.reduce((acc, curr) => acc + curr.score, 0) / (data.answers.length || 1)).toFixed(1)}
                                                     </p>
                                                </div>
                                                {data.kritik_saran && (
                                                    <div className="bg-white/80 p-4 rounded-xl italic text-slate-600 text-xs sm:text-sm leading-relaxed border border-slate-100 line-clamp-3">
                                                        "{data.kritik_saran}"
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="p-5 bg-amber-50 rounded-xl border border-amber-100 flex gap-4 items-center">
                                            <FiZap className="text-amber-600 shrink-0" size={20} />
                                            <p className="text-[10px] font-semibold text-amber-800 leading-relaxed uppercase tracking-tight">Kontribusi Anda membantu standarisasi pelayanan nasional.</p>
                                        </div>
                                    </motion.div>
                                )}

                            </AnimatePresence>
                        </div>

                        {/* Footer Controls */}
                        <div className="bg-slate-50 px-6 sm:px-10 py-6 sm:py-10 border-t border-slate-100 flex items-center justify-between gap-4 uppercase tracking-widest text-[9px] sm:text-[10px] font-bold">
                            <button 
                                type="button"
                                onClick={handlePrev}
                                className={`flex items-center gap-2 px-6 py-4 rounded-xl sm:rounded-2xl bg-white border-2 border-slate-200 text-slate-600 hover:bg-slate-50 transition-all ${step === 1 ? 'opacity-0 pointer-events-none' : ''}`}
                            >
                                <FiChevronLeft size={18} /> <span className="hidden sm:inline">Kembali</span>
                            </button>

                            {step < 4 ? (
                                <button 
                                    type="button"
                                    onClick={handleNext}
                                    className="flex items-center gap-2 px-10 py-4 rounded-xl sm:rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all"
                                >
                                    <span>Selanjutnya</span> <FiChevronRight size={18} />
                                </button>
                            ) : (
                                <button 
                                    type="button"
                                    onClick={submit}
                                    disabled={processing}
                                    className="flex-1 flex items-center justify-center gap-3 px-8 py-5 rounded-xl sm:rounded-2xl bg-amber-500 text-amber-950 hover:bg-amber-600 shadow-2xl shadow-amber-200 transition-all text-[10px] sm:text-xs font-black"
                                >
                                    {processing ? 'MENGIRIM...' : 'KIRIM EVALUASI'} <FiCheckCircle size={20} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
