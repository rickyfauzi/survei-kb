import { useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function ThankYou() {
    useEffect(() => {
        Swal.fire({
            title: '<strong>Evaluasi Terkirim!</strong>',
            html: `
                <div class="text-slate-600 font-medium leading-relaxed">
                    Terima kasih telah berkontribusi. Ulasan Anda sangat berharga bagi peningkatan kualitas layanan di 
                    <span class="text-indigo-600 font-bold">Balai KB Argapura</span>.
                </div>
                <div class="mt-4 pt-4 border-t border-slate-100 text-[10px] font-bold text-amber-600 uppercase tracking-widest">
                    #BerencanaItuKeren
                </div>
            `,
            icon: 'success',
            iconColor: '#f59e0b',
            showConfirmButton: true,
            confirmButtonText: 'Kembali ke Beranda',
            confirmButtonColor: '#6366f1',
            background: '#ffffff',
            borderRadius: '2rem',
            customClass: {
                popup: 'rounded-[2.5rem] p-8 shadow-2xl border border-slate-100',
                title: 'text-2xl font-bold text-slate-900 tracking-tight',
                confirmButton: 'px-10 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all hover:scale-105 active:scale-95 shadow-xl shadow-indigo-200'
            },
            allowOutsideClick: false,
            allowEscapeKey: true,
            didClose: () => {
                router.visit('/');
            }
        });
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <Head title="Terima Kasih — Balai KB Argapura" />
            {/* The page stays clean while the alert is active */}
            <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-indigo-600 animate-spin"></div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Memproses Data...</p>
            </div>
        </div>
    );
}
