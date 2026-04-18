import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiLock, FiMail } from 'react-icons/fi';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans overflow-hidden">
            <Head title="Log in Admin" />

            {/* Left Side: Image/Branding */}
            <div className="hidden md:flex md:w-1/2 lg:w-3/5 bg-slate-900 relative items-center justify-center p-12 overflow-hidden">
                <img 
                    src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
                    alt="Pusat Data" 
                    className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-primary-900/60 to-transparent"></div>
                
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 w-full max-w-lg text-white"
                >
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl font-black mb-8 border border-white/30 truncate">
                        KB
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
                        Pusat Kendali <br/>
                        <span className="text-primary-300">Survei Kepuasan</span>
                    </h1>
                    <p className="text-lg text-primary-100/80 leading-relaxed border-l-4 border-primary-500 pl-4 italic">
                        "Evaluasi berbasis data untuk pelayanan publik yang lebih terukur, transparan, dan dapat diandalkan oleh masyarakat."
                    </p>
                </motion.div>
            </div>

            {/* Right Side: Form Component */}
            <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 py-12 relative bg-white shadow-2xl">
                <Link href="/" className="absolute top-8 left-8 flex items-center text-sm font-semibold text-slate-500 hover:text-primary-600 transition-colors">
                    <FiArrowLeft className="mr-2" /> Kembali ke Web
                </Link>

                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="w-full max-w-md mx-auto"
                >
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Selamat Datang</h2>
                        <p className="mt-3 text-slate-500">Silakan login menggunakan kredensial admin Anda.</p>
                    </div>

                    {status && (
                        <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-xl text-sm font-medium border border-green-100 flex items-center">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <InputLabel htmlFor="email" value="Alamat Email" className="text-slate-700 font-bold mb-2 ml-1" />
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FiMail className="text-slate-400" />
                                </div>
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="pl-11 block w-full rounded-2xl border-slate-200 focus:border-primary-500 focus:ring-primary-500 bg-slate-50 py-3 shadow-sm transition-all"
                                    autoComplete="username"
                                    isFocused={true}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="admin@argapura.gov"
                                />
                            </div>
                            <InputError message={errors.email} className="mt-2 ml-1" />
                        </div>

                        <div>
                            <InputLabel htmlFor="password" value="Kata Sandi" className="text-slate-700 font-bold mb-2 ml-1" />
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FiLock className="text-slate-400" />
                                </div>
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="pl-11 block w-full rounded-2xl border-slate-200 focus:border-primary-500 focus:ring-primary-500 bg-slate-50 py-3 shadow-sm transition-all"
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                />
                            </div>
                            <InputError message={errors.password} className="mt-2 ml-1" />
                        </div>

                        <div className="flex items-center justify-between mt-6">
                            <label className="flex items-center">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded border-slate-300 text-primary-600 focus:ring-primary-500 w-5 h-5"
                                />
                                <span className="ms-3 text-sm text-slate-600 font-medium">Ingat Saya</span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-sm font-semibold text-primary-600 hover:text-primary-500 transition-colors"
                                >
                                    Lupa Kata Sandi?
                                </Link>
                            )}
                        </div>

                        <div className="pt-4">
                            <button 
                                disabled={processing} 
                                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-xl shadow-primary-500/20 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 hover:shadow-primary-500/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-75 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Memproses...' : 'Masuk ke Dashboard'}
                            </button>
                        </div>
                    </form>
                    
                    <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col items-center">
                        <p className="text-sm text-slate-400 font-medium text-center">&copy; {new Date().getFullYear()} Balai KB Kecamatan Argapura</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
