import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { FiPlus, FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight, FiList, FiSave, FiX } from 'react-icons/fi';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import toast, { Toaster } from 'react-hot-toast';

export default function Questions({ auth, questions }) {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        question: '',
        order: '',
    });

    const openAddModal = () => {
        clearErrors();
        reset();
        setEditingId(null);
        setIsAddOpen(true);
    };

    const openEditModal = (q) => {
        clearErrors();
        setData({ question: q.question, order: q.order });
        setEditingId(q.id);
        setIsAddOpen(true);
    };

    const closeModal = () => {
        setIsAddOpen(false);
        setTimeout(() => reset(), 200);
    };

    const submit = (e) => {
        e.preventDefault();
        if (editingId) {
            put(route('admin.questions.update', editingId), {
                onSuccess: () => {
                    closeModal();
                    toast.success('Question updated successfully!');
                },
            });
        } else {
            post(route('admin.questions.store'), {
                onSuccess: () => {
                    closeModal();
                    toast.success('Question added successfully!');
                },
            });
        }
    };

    const toggleActive = (id) => {
        router.patch(route('admin.questions.toggle-active', id), {}, {
            preserveScroll: true,
            onSuccess: () => toast.success('Status updated!')
        });
    };

    const deleteQuestion = (id) => {
        if (confirm('Are you sure you want to delete this question? Responses tied to it will also be deleted.')) {
            router.delete(route('admin.questions.destroy', id), {
                preserveScroll: true,
                onSuccess: () => toast.success('Question deleted.')
            });
        }
    };

    return (
        <AuthenticatedLayout header="Question Setup">
            <Head title="Questions" />
            <Toaster position="top-center" toastOptions={{
                className: 'font-medium rounded-lg',
                style: { background: '#1F2937', color: '#fff', border: '1px solid #374151' }
            }} />

            <div className="pb-6">
                <div className="mb-6 flex justify-end">
                    <button onClick={openAddModal} className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-500 px-4 py-2.5 rounded-lg font-medium shadow-md hover:shadow-blue-500/20 transition-all text-sm">
                        <FiPlus size={18} /> Create new question
                    </button>
                </div>

                <div className="bg-[#111827] rounded-xl border border-slate-800 overflow-hidden">
                    {questions.length === 0 ? (
                        <div className="p-16 text-center">
                            <div className="w-16 h-16 bg-[#1F2937] text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
                                <FiList size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">No questions defined</h3>
                            <p className="text-slate-500 text-sm">Create your first survey question by clicking the button above.</p>
                        </div>
                    ) : (
                        <div className="w-full">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#1F2937]/50">
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800 w-16 text-center">Order</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">Statement</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800 w-32">Status</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800 w-40 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/50">
                                    {questions.map((q) => (
                                        <tr key={q.id} className={`hover:bg-[#1F2937] transition-colors ${!q.is_active ? 'opacity-50' : ''}`}>
                                            <td className="px-6 py-5 text-center">
                                                <div className="w-8 h-8 rounded shrink-0 bg-[#1F2937] flex items-center justify-center text-sm font-bold text-slate-300 border border-slate-700 mx-auto">
                                                    {q.order}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <h4 className="text-sm font-medium text-slate-200">{q.question}</h4>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`text-[10px] px-2 py-1 rounded bg-opacity-10 border font-bold uppercase tracking-wider ${q.is_active ? 'bg-emerald-500 border-emerald-500/20 text-emerald-400' : 'bg-slate-500 border-slate-500/20 text-slate-400'}`}>
                                                    {q.is_active ? 'Active' : 'Hidden'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button 
                                                        onClick={() => toggleActive(q.id)}
                                                        title={q.is_active ? "Hide" : "Show"}
                                                        className={`p-2 rounded-md transition-colors ${q.is_active ? 'text-amber-400 hover:bg-amber-400/10' : 'text-emerald-400 hover:bg-emerald-400/10'}`}
                                                    >
                                                        {q.is_active ? <FiToggleLeft size={18} /> : <FiToggleRight size={18} />}
                                                    </button>
                                                    <button 
                                                        onClick={() => openEditModal(q)}
                                                        className="p-2 rounded-md text-blue-400 hover:bg-blue-400/10 transition-colors"
                                                    >
                                                        <FiEdit2 size={18} />
                                                    </button>
                                                    <button 
                                                        onClick={() => deleteQuestion(q.id)}
                                                        className="p-2 rounded-md text-red-400 hover:bg-red-400/10 transition-colors"
                                                    >
                                                        <FiTrash2 size={18} />
                                                    </button>
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

            {/* Dashdark Styled Modal */}
            <Modal show={isAddOpen} onClose={closeModal} maxWidth="md">
                <div className="bg-[#111827] border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
                    <form onSubmit={submit} className="p-6">
                        <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
                            <h2 className="text-lg font-bold text-white">
                                {editingId ? 'Edit Question' : 'Add New Question'}
                            </h2>
                            <button type="button" onClick={closeModal} className="text-slate-400 hover:text-white transition-colors"><FiX size={20}/></button>
                        </div>

                        <div className="mb-5">
                            <InputLabel htmlFor="question" value="Question Statement" className="text-slate-300 mb-1 text-sm font-medium" />
                            <textarea
                                id="question"
                                className="block w-full bg-[#1F2937] border-slate-700 text-white focus:border-blue-500 focus:ring-blue-500 rounded-lg shadow-sm text-sm"
                                rows="3"
                                value={data.question}
                                onChange={(e) => setData('question', e.target.value)}
                                required
                                placeholder="Type the indicator parameter..."
                            />
                            {errors.question && <p className="mt-1 text-xs text-red-500">{errors.question}</p>}
                        </div>

                        <div className="mb-8">
                            <InputLabel htmlFor="order" value="Display Order" className="text-slate-300 mb-1 text-sm font-medium" />
                            <TextInput
                                id="order"
                                type="number"
                                className="block w-full bg-[#1F2937] border-slate-700 text-white focus:border-blue-500 focus:ring-blue-500 rounded-lg shadow-sm text-sm"
                                value={data.order}
                                onChange={(e) => setData('order', e.target.value)}
                                required
                                min="1"
                            />
                            {errors.order && <p className="mt-1 text-xs text-red-500">{errors.order}</p>}
                        </div>

                        <div className="flex items-center justify-end gap-3 w-full">
                            <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
                                Cancel
                            </button>
                            <button type="submit" disabled={processing} className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg shadow-lg disabled:opacity-50 transition-colors">
                                {processing ? 'Saving...' : 'Save Question'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
