import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { FiPlus, FiTrash2, FiImage, FiUploadCloud, FiX } from 'react-icons/fi';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import toast, { Toaster } from 'react-hot-toast';

export default function Gallery({ auth, galleries }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [preview, setPreview] = useState(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        title: '',
        image: null,
    });

    const openModal = () => {
        clearErrors();
        reset();
        setPreview(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTimeout(() => {
            reset();
            setPreview(null);
        }, 200);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.gallery.store'), {
            onSuccess: () => {
                closeModal();
                toast.success('Media added successfully');
            },
        });
    };

    const deleteGallery = (id) => {
        if (confirm('Permanently delete this image?')) {
            router.delete(route('admin.gallery.destroy', id), {
                preserveScroll: true,
                onSuccess: () => toast.success('Media deleted')
            });
        }
    };

    return (
        <AuthenticatedLayout header="Media Gallery">
            <Head title="Gallery" />
            <Toaster position="top-center" toastOptions={{
                className: 'font-medium rounded-lg text-sm',
                style: { background: '#1F2937', color: '#fff', border: '1px solid #374151' }
            }} />

            <div className="pb-8">
                <div className="mb-6 flex justify-end">
                    <button onClick={openModal} className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-500 px-4 py-2.5 rounded-lg text-sm font-medium shadow-lg hover:shadow-blue-500/20 transition-all border border-blue-500/50">
                        <FiUploadCloud size={16} /> Upload New Media
                    </button>
                </div>

                {galleries.data.length === 0 ? (
                    <div className="bg-[#111827] rounded-xl border border-slate-800 p-16 text-center text-slate-500 flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-[#1F2937] border border-slate-700 rounded-full flex items-center justify-center mb-4">
                            <FiImage size={24} className="text-slate-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">No media available</h3>
                        <p className="text-slate-500 text-sm font-medium">Upload photos to display on the public landing page.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {galleries.data.map((item) => (
                            <div key={item.id} className="bg-[#111827] rounded-xl border border-slate-800 overflow-hidden group flex flex-col relative transition-all duration-300 hover:border-slate-600">
                                <div className="aspect-[4/3] w-full relative bg-[#1F2937] overflow-hidden border-b border-slate-800">
                                    <img 
                                        src={`/storage/${item.image}`} 
                                        alt={item.title} 
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300" 
                                    />
                                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                                        <button 
                                            onClick={() => deleteGallery(item.id)}
                                            className="bg-red-500/90 hover:bg-red-500 text-white p-3 rounded-full shadow-lg transition-transform hover:scale-110"
                                            title="Delete Media"
                                        >
                                            <FiTrash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-4 bg-[#111827]">
                                    <h3 className="text-sm font-semibold text-slate-200 truncate" title={item.title}>{item.title}</h3>
                                    <p className="text-xs font-medium text-slate-500 mt-1">
                                        {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {galleries.links && galleries.links.length > 3 && (
                    <div className="mt-8 flex justify-center">
                        <div className="inline-flex gap-1 bg-[#111827] p-1 rounded-lg border border-slate-800">
                            {galleries.links.map((link, idx) => (
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

            {/* Dashdark Styled Upload Modal */}
            <Modal show={isModalOpen} onClose={closeModal} maxWidth="md">
                <div className="bg-[#111827] border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
                    <form onSubmit={submit} className="p-6">
                        <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
                            <h2 className="text-lg font-bold text-white">Upload New Media</h2>
                            <button type="button" onClick={closeModal} className="text-slate-400 hover:text-white transition-colors"><FiX size={20}/></button>
                        </div>

                        <div className="mb-5">
                            <InputLabel htmlFor="title" value="Image Title / Description *" className="text-slate-300 mb-1 text-sm font-medium" />
                            <input
                                type="text"
                                id="title"
                                className="block w-full bg-[#1F2937] border border-slate-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg shadow-sm py-2 text-sm"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                required
                            />
                            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
                        </div>

                        <div className="mb-8">
                            <InputLabel value="Image File (Max 2MB) *" className="text-slate-300 mb-1 text-sm font-medium" />
                            
                            <div className="mt-2 flex justify-center px-6 pt-6 pb-6 border border-dashed rounded-xl relative transition-colors border-slate-700 bg-[#1F2937]/50 hover:bg-[#1F2937]">
                                <div className="space-y-2 text-center w-full">
                                    {preview ? (
                                        <div className="mb-4 mx-auto w-full max-w-[200px] aspect-video relative rounded-lg overflow-hidden border border-slate-700">
                                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                            <label htmlFor="file-upload" className="cursor-pointer text-white font-medium text-xs bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-600">Change Image</label>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-12 h-12 bg-[#374151] border border-slate-600 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <FiUploadCloud size={20} />
                                        </div>
                                    )}
                                    
                                    <div className="flex text-sm text-slate-400 justify-center">
                                        <label htmlFor="file-upload" className="relative cursor-pointer text-sm font-medium text-blue-500 hover:text-blue-400 focus-within:outline-none transition-colors">
                                            <span>{!preview && 'Click to browse files'}</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/jpeg,image/png,image/jpg" required={!preview} />
                                        </label>
                                    </div>
                                    {!preview && <p className="text-xs text-slate-500 mt-1">PNG, JPG, JPEG up to 2MB</p>}
                                </div>
                            </div>
                            {errors.image && <p className="mt-1 text-xs text-red-500">{errors.image}</p>}
                        </div>

                        <div className="flex items-center justify-end gap-3 w-full">
                            <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
                                Cancel
                            </button>
                            <button type="submit" disabled={processing} className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg shadow-lg disabled:opacity-50 transition-colors">
                                {processing ? 'Uploading...' : 'Confirm Upload'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
