import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { FiPlus, FiEdit2, FiTrash2, FiList, FiSave, FiX, FiSearch } from 'react-icons/fi';
import Modal from '@/Components/Modal';
import toast, { Toaster } from 'react-hot-toast';

export default function Questions({ auth, questions }) {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({ question: '', order: '' });

    const openAddModal = () => { clearErrors(); reset(); setEditingId(null); setIsAddOpen(true); };
    const openEditModal = (q) => { clearErrors(); setData({ question: q.question, order: q.order }); setEditingId(q.id); setIsAddOpen(true); };
    const closeModal = () => { setIsAddOpen(false); setTimeout(() => reset(), 200); };

    const submit = (e) => {
        e.preventDefault();
        if (editingId) {
            put(route('admin.questions.update', editingId), { onSuccess: () => { closeModal(); toast.success('Pertanyaan diperbarui'); } });
        } else {
            post(route('admin.questions.store'), { onSuccess: () => { closeModal(); toast.success('Pertanyaan ditambahkan'); } });
        }
    };

    const toggleActive = (id) => { router.patch(route('admin.questions.toggle-active', id), {}, { preserveScroll: true, onSuccess: () => toast.success('Status diperbarui') }); };
    const deleteQuestion = (id) => { if (confirm('Hapus pertanyaan ini?')) router.delete(route('admin.questions.destroy', id), { preserveScroll: true, onSuccess: () => toast.success('Dihapus') }); };

    const filtered = questions.filter(q => q.question.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <AuthenticatedLayout header="Manajemen Kuesioner">
            <Head title="Kuesioner" />
            <Toaster position="top-right" toastOptions={{ style: { fontSize: '13px' } }} />

            <div className="space-y-4">
                {/* Action Bar Card */}
                <div className="card">
                    <div className="card-body flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="relative w-full sm:w-64">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <input type="text" placeholder="Cari pertanyaan..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                                className="w-full bg-white border border-slate-200 py-[7px] pl-9 pr-3 text-[13px] rounded-sm focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 placeholder:text-slate-400" />
                        </div>
                        <button onClick={openAddModal} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#405189] text-white hover:bg-[#3a4a7d] px-4 py-[8px] rounded-sm text-[13px] font-medium transition-colors">
                            <FiPlus size={15} /> Tambah Pertanyaan
                        </button>
                    </div>
                </div>

                {/* Table Card */}
                <div className="card">
                    <div className="card-header flex items-center justify-between pb-3 border-b border-slate-100" style={{ padding: '16px' }}>
                        <h5 className="text-[13px] font-semibold text-slate-800">Daftar Indikator Kuesioner</h5>
                        <span className="text-[12px] text-slate-400">{filtered.length} pertanyaan</span>
                    </div>
                    {filtered.length === 0 ? (
                        <div className="card-body text-center py-12">
                            <FiList size={28} className="mx-auto text-slate-300 mb-3" />
                            <p className="text-sm font-medium text-slate-500">Belum ada kuesioner</p>
                            <p className="text-xs text-slate-400 mt-1">Klik tombol tambah untuk memulai.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-100">
                                        <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-center w-16">Urutan</th>
                                        <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-left">Pernyataan</th>
                                        <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-center w-24">Status</th>
                                        <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-center w-24">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((q) => (
                                        <tr key={q.id} className={`border-b border-slate-50 hover:bg-slate-50/50 transition-colors ${!q.is_active ? 'opacity-50' : ''}`}>
                                            <td className="px-4 py-3 text-center">
                                                <span className="inline-flex items-center justify-center w-7 h-7 bg-slate-50 border border-slate-200 rounded-sm text-xs font-semibold text-slate-600">{q.order}</span>
                                            </td>
                                            <td className="px-4 py-3 text-[13px] text-slate-700">{q.question}</td>
                                            <td className="px-4 py-3 text-center">
                                                <button onClick={() => toggleActive(q.id)} className={`text-[11px] px-2 py-0.5 rounded-sm font-medium ${q.is_active ? 'bg-teal-50 text-teal-600 border border-teal-200' : 'bg-slate-50 text-slate-400 border border-slate-200'}`}>
                                                    {q.is_active ? 'Aktif' : 'Nonaktif'}
                                                </button>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-center gap-1">
                                                    <button onClick={() => openEditModal(q)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-sm transition-colors"><FiEdit2 size={14} /></button>
                                                    <button onClick={() => deleteQuestion(q.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-sm transition-colors"><FiTrash2 size={14} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            <Modal show={isAddOpen} onClose={closeModal} maxWidth="lg">
                <div className="bg-white rounded-sm overflow-hidden">
                    <form onSubmit={submit}>
                        <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                            <h5 className="text-[14px] font-semibold text-slate-800">{editingId ? 'Edit Pertanyaan' : 'Tambah Pertanyaan Baru'}</h5>
                            <button type="button" onClick={closeModal} className="text-slate-400 hover:text-slate-600"><FiX size={18}/></button>
                        </div>
                        <div className="p-5 space-y-4">
                            <div>
                                <label className="text-[12px] font-medium text-slate-600 mb-1.5 block">Pernyataan Pertanyaan <span className="text-red-500">*</span></label>
                                <textarea className="w-full border border-slate-200 rounded-sm py-2 px-3 text-[13px] text-slate-700 focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 resize-none" rows="3"
                                    value={data.question} onChange={(e) => setData('question', e.target.value)} required placeholder="Masukkan pernyataan indikator..." />
                                {errors.question && <p className="mt-1 text-xs text-red-500">{errors.question}</p>}
                            </div>
                            <div>
                                <label className="text-[12px] font-medium text-slate-600 mb-1.5 block">Urutan Tampil <span className="text-red-500">*</span></label>
                                <input type="number" className="w-full border border-slate-200 rounded-sm py-2 px-3 text-[13px] text-slate-700 focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400"
                                    value={data.order} onChange={(e) => setData('order', e.target.value)} required min="1" />
                                {errors.order && <p className="mt-1 text-xs text-red-500">{errors.order}</p>}
                            </div>
                        </div>
                        <div className="px-5 py-3 border-t border-slate-200 flex justify-end gap-2 bg-slate-50">
                            <button type="button" onClick={closeModal} className="px-4 py-[7px] text-[13px] font-medium text-slate-600 hover:text-slate-800 border border-slate-200 rounded-sm bg-white hover:bg-slate-50 transition-colors">Batal</button>
                            <button type="submit" disabled={processing} className="px-4 py-[7px] bg-[#405189] hover:bg-[#3a4a7d] text-white text-[13px] font-medium rounded-sm disabled:opacity-50 transition-colors">{processing ? 'Menyimpan...' : 'Simpan'}</button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
