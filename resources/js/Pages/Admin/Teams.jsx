import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, router } from "@inertiajs/react";
import { FiPlus, FiEdit2, FiTrash2, FiUsers, FiX, FiCamera, FiExternalLink, FiSearch } from "react-icons/fi";
import Modal from "@/Components/Modal";
import toast, { Toaster } from "react-hot-toast";

export default function Teams({ auth, teams }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: "", role: "", photo: null, facebook: "", instagram: "", twitter: "", order: 0, is_active: true, _method: "POST",
    });

    const openAddModal = () => { clearErrors(); reset(); setEditingId(null); setPreviewUrl(null); setData("_method", "POST"); setIsModalOpen(true); };
    const openEditModal = (t) => { clearErrors(); setData({ name: t.name, role: t.role, photo: null, facebook: t.facebook || "", instagram: t.instagram || "", twitter: t.twitter || "", order: t.order, is_active: t.is_active, _method: "PUT" }); setEditingId(t.id); setPreviewUrl(t.photo_url); setIsModalOpen(true); };
    const closeModal = () => { setIsModalOpen(false); setTimeout(() => reset(), 200); };
    const handlePhotoChange = (e) => { const file = e.target.files[0]; if (file) { setData("photo", file); setPreviewUrl(URL.createObjectURL(file)); } };

    const submit = (e) => {
        e.preventDefault();
        if (editingId) post(route("admin.teams.update", editingId), { onSuccess: () => { closeModal(); toast.success("Diperbarui"); } });
        else post(route("admin.teams.store"), { onSuccess: () => { closeModal(); toast.success("Ditambahkan"); } });
    };

    const deleteMember = (id) => { if (confirm("Hapus anggota ini?")) router.delete(route("admin.teams.destroy", id), { onSuccess: () => toast.success("Dihapus") }); };

    return (
        <AuthenticatedLayout header="Manajemen Tim">
            <Head title="Tim" />
            <Toaster position="top-right" toastOptions={{ style: { fontSize: '13px' } }} />

            <div className="space-y-4">
                {/* Action Bar */}
                <div className="card">
                    <div className="card-body flex items-center justify-between">
                        <span className="text-[13px] text-slate-500">{teams.length} anggota terdaftar</span>
                        <button onClick={openAddModal} className="flex items-center gap-2 bg-[#405189] text-white hover:bg-[#3a4a7d] px-4 py-[8px] rounded-sm text-[13px] font-medium transition-colors">
                            <FiPlus size={15} /> Tambah Anggota
                        </button>
                    </div>
                </div>

                {/* Grid */}
                {teams.length === 0 ? (
                    <div className="card">
                        <div className="card-body text-center py-12">
                            <FiUsers size={28} className="mx-auto text-slate-300 mb-3" />
                            <p className="text-sm font-medium text-slate-500">Belum ada anggota</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {teams.map((t) => (
                            <div key={t.id} className="card overflow-hidden group">
                                <div className="h-48 overflow-hidden relative bg-slate-100">
                                    <img src={t.photo_url} alt={t.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEditModal(t)} className="p-1.5 bg-white/90 text-indigo-600 hover:bg-indigo-50 rounded-sm shadow-sm"><FiEdit2 size={13} /></button>
                                        <button onClick={() => deleteMember(t.id)} className="p-1.5 bg-white/90 text-red-600 hover:bg-red-50 rounded-sm shadow-sm"><FiTrash2 size={13} /></button>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h5 className="text-[14px] font-semibold text-slate-800 truncate">{t.name}</h5>
                                    <p className="text-[12px] text-[#405189] font-medium mb-3">{t.role}</p>
                                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                        <div className="flex gap-1.5">
                                            {["facebook", "instagram", "twitter"].map((p) => t[p] && (
                                                <a key={p} href={t[p]} target="_blank" className="p-1 text-slate-400 hover:text-slate-600 bg-slate-50 rounded-sm"><FiExternalLink size={12} /></a>
                                            ))}
                                        </div>
                                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-sm ${t.is_active ? 'bg-teal-50 text-teal-600' : 'bg-slate-100 text-slate-400'}`}>{t.is_active ? 'Aktif' : 'Nonaktif'}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            <Modal show={isModalOpen} onClose={closeModal} maxWidth="xl">
                <div className="bg-white rounded-sm overflow-hidden">
                    <form onSubmit={submit}>
                        <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                            <h5 className="text-[14px] font-semibold text-slate-800">{editingId ? "Edit Anggota" : "Tambah Anggota"}</h5>
                            <button type="button" onClick={closeModal} className="text-slate-400 hover:text-slate-600"><FiX size={18}/></button>
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="flex justify-center">
                                <div className="relative group cursor-pointer" onClick={() => document.getElementById("photo-upload").click()}>
                                    <div className="w-20 h-20 overflow-hidden bg-slate-100 border border-dashed border-slate-300 rounded-sm flex items-center justify-center">
                                        {previewUrl ? <img src={previewUrl} className="w-full h-full object-cover" /> : <FiCamera className="text-slate-400" size={20} />}
                                    </div>
                                    <input id="photo-upload" type="file" className="hidden" onChange={handlePhotoChange} accept="image/*" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { label: 'Nama', key: 'name', type: 'text', req: true },
                                    { label: 'Jabatan', key: 'role', type: 'text', req: true },
                                    { label: 'Instagram', key: 'instagram', type: 'text' },
                                    { label: 'Facebook', key: 'facebook', type: 'text' },
                                    { label: 'Twitter', key: 'twitter', type: 'text' },
                                    { label: 'Urutan', key: 'order', type: 'number' },
                                ].map((f) => (
                                    <div key={f.key}>
                                        <label className="text-[12px] font-medium text-slate-600 mb-1.5 block">{f.label} {f.req && <span className="text-red-500">*</span>}</label>
                                        <input type={f.type} value={data[f.key]} onChange={(e) => setData(f.key, e.target.value)} required={f.req}
                                            className="w-full border border-slate-200 rounded-sm py-2 px-3 text-[13px] text-slate-700 focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400" />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="px-5 py-3 border-t border-slate-200 flex justify-end gap-2 bg-slate-50">
                            <button type="button" onClick={closeModal} className="px-4 py-[7px] text-[13px] font-medium text-slate-600 border border-slate-200 rounded-sm bg-white hover:bg-slate-50">Batal</button>
                            <button type="submit" disabled={processing} className="px-4 py-[7px] bg-[#405189] hover:bg-[#3a4a7d] text-white text-[13px] font-medium rounded-sm disabled:opacity-50">{processing ? 'Menyimpan...' : 'Simpan'}</button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
