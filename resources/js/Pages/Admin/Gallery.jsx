import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { FiTrash2, FiImage, FiUploadCloud, FiX } from 'react-icons/fi';
import Modal from '@/Components/Modal';
import toast, { Toaster } from 'react-hot-toast';

export default function Gallery({ auth, galleries }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [preview, setPreview] = useState(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({ title: '', image: null });

    const openModal = () => { clearErrors(); reset(); setPreview(null); setIsModalOpen(true); };
    const closeModal = () => { setIsModalOpen(false); setTimeout(() => { reset(); setPreview(null); }, 200); };
    const handleImageChange = (e) => { const file = e.target.files[0]; if (file) { setData('image', file); setPreview(URL.createObjectURL(file)); } };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.gallery.store'), { onSuccess: () => { closeModal(); toast.success('Media ditambahkan'); } });
    };

    const deleteGallery = (id) => {
        if (confirm('Hapus media ini?')) router.delete(route('admin.gallery.destroy', id), { preserveScroll: true, onSuccess: () => toast.success('Dihapus') });
    };

    return (
        <AuthenticatedLayout header="Galeri Media">
            <Head title="Galeri" />
            <Toaster position="top-right" toastOptions={{ style: { fontSize: '13px' } }} />

            <div className="space-y-4">
                {/* Action Bar */}
                <div className="card">
                    <div className="card-body flex items-center justify-between">
                        <span className="text-[13px] text-slate-500">{galleries.data.length} media</span>
                        <button onClick={openModal} className="flex items-center gap-2 bg-[#405189] text-white hover:bg-[#3a4a7d] px-4 py-[8px] rounded-sm text-[13px] font-medium transition-colors">
                            <FiUploadCloud size={15} /> Unggah Media
                        </button>
                    </div>
                </div>

                {/* Grid */}
                {galleries.data.length === 0 ? (
                    <div className="card">
                        <div className="card-body text-center py-12">
                            <FiImage size={28} className="mx-auto text-slate-300 mb-3" />
                            <p className="text-sm font-medium text-slate-500">Galeri kosong</p>
                            <p className="text-xs text-slate-400 mt-1">Unggah foto untuk halaman utama.</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {galleries.data.map((item) => (
                            <div key={item.id} className="card overflow-hidden group">
                                <div className="aspect-[4/3] w-full relative bg-slate-100 overflow-hidden">
                                    <img src={`/storage/${item.image}`} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button onClick={() => deleteGallery(item.id)} className="bg-white text-red-600 p-2 rounded-sm shadow-sm hover:bg-red-50"><FiTrash2 size={15} /></button>
                                    </div>
                                </div>
                                <div className="p-3">
                                    <h5 className="text-[13px] font-medium text-slate-700 truncate">{item.title}</h5>
                                    <p className="text-[11px] text-slate-400 mt-1">{new Date(item.created_at).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {galleries.links && galleries.links.length > 3 && (
                    <div className="flex justify-end">
                        <div className="inline-flex rounded-sm overflow-hidden border border-slate-200">
                            {galleries.links.map((link, idx) => (
                                <button key={idx} onClick={() => link.url && router.get(link.url, {}, { preserveState: true })} disabled={!link.url}
                                    className={`px-3 py-1.5 text-[12px] font-medium border-r border-slate-200 last:border-r-0 ${link.active ? 'bg-[#405189] text-white' : link.url ? 'bg-white text-slate-600 hover:bg-slate-50' : 'bg-slate-50 text-slate-300'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Modal */}
            <Modal show={isModalOpen} onClose={closeModal} maxWidth="md">
                <div className="bg-white rounded-sm overflow-hidden">
                    <form onSubmit={submit}>
                        <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                            <h5 className="text-[14px] font-semibold text-slate-800">Upload Media</h5>
                            <button type="button" onClick={closeModal} className="text-slate-400 hover:text-slate-600"><FiX size={18}/></button>
                        </div>
                        <div className="p-5 space-y-4">
                            <div>
                                <label className="text-[12px] font-medium text-slate-600 mb-1.5 block">Judul <span className="text-red-500">*</span></label>
                                <input type="text" className="w-full border border-slate-200 rounded-sm py-2 px-3 text-[13px] focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400"
                                    value={data.title} onChange={(e) => setData('title', e.target.value)} required placeholder="Keterangan foto..." />
                                {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
                            </div>
                            <div>
                                <label className="text-[12px] font-medium text-slate-600 mb-1.5 block">File Gambar <span className="text-red-500">*</span></label>
                                <div className="border border-dashed border-slate-300 rounded-sm p-6 text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer" onClick={() => document.getElementById('gallery-upload').click()}>
                                    {preview ? <img src={preview} alt="Preview" className="w-full max-w-[180px] mx-auto aspect-video object-cover border border-slate-200 rounded-sm mb-2" />
                                        : <FiUploadCloud size={24} className="mx-auto text-slate-400 mb-2" />}
                                    <p className="text-[12px] text-slate-500">{preview ? 'Klik untuk ganti' : 'Klik untuk pilih file'}</p>
                                    <p className="text-[10px] text-slate-400 mt-1">PNG, JPG, JPEG — maks 2MB</p>
                                    <input id="gallery-upload" type="file" className="hidden" onChange={handleImageChange} accept="image/*" required={!preview} />
                                </div>
                                {errors.image && <p className="mt-1 text-xs text-red-500">{errors.image}</p>}
                            </div>
                        </div>
                        <div className="px-5 py-3 border-t border-slate-200 flex justify-end gap-2 bg-slate-50">
                            <button type="button" onClick={closeModal} className="px-4 py-[7px] text-[13px] font-medium text-slate-600 border border-slate-200 rounded-sm bg-white hover:bg-slate-50">Batal</button>
                            <button type="submit" disabled={processing} className="px-4 py-[7px] bg-[#405189] hover:bg-[#3a4a7d] text-white text-[13px] font-medium rounded-sm disabled:opacity-50">{processing ? 'Mengunggah...' : 'Upload'}</button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
