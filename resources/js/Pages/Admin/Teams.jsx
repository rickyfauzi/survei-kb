import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, router } from "@inertiajs/react";
import {
    FiPlus,
    FiEdit2,
    FiTrash2,
    FiUsers,
    FiSave,
    FiX,
    FiInfo,
    FiCamera,
    FiExternalLink,
} from "react-icons/fi";
import Modal from "@/Components/Modal";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import toast, { Toaster } from "react-hot-toast";

export default function Teams({ auth, teams }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            name: "",
            role: "",
            photo: null,
            facebook: "",
            instagram: "",
            twitter: "",
            order: 0,
            is_active: true,
            _method: "POST",
        });

    const openAddModal = () => {
        clearErrors();
        reset();
        setEditingId(null);
        setPreviewUrl(null);
        setData("_method", "POST");
        setIsModalOpen(true);
    };

    const openEditModal = (t) => {
        clearErrors();
        setData({
            name: t.name,
            role: t.role,
            photo: null,
            facebook: t.facebook || "",
            instagram: t.instagram || "",
            twitter: t.twitter || "",
            order: t.order,
            is_active: t.is_active,
            _method: "PUT",
        });
        setEditingId(t.id);
        setPreviewUrl(t.photo_url);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTimeout(() => reset(), 200);
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("photo", file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const submit = (e) => {
        e.preventDefault();

        if (editingId) {
            // Using post with _method: 'PUT' because Laravel/Inertia image upload needs POST multipart
            post(route("admin.teams.update", editingId), {
                onSuccess: () => {
                    closeModal();
                    toast.success("Team member updated!");
                },
            });
        } else {
            post(route("admin.teams.store"), {
                onSuccess: () => {
                    closeModal();
                    toast.success("Member added successfully!");
                },
            });
        }
    };

    const deleteMember = (id) => {
        if (confirm("Delete this team member?")) {
            router.delete(route("admin.teams.destroy", id), {
                onSuccess: () => toast.success("Deleted successfully."),
            });
        }
    };

    return (
        <AuthenticatedLayout header="Team Management">
            <Head title="Our Team" />
            <Toaster
                position="top-center"
                toastOptions={{
                    className: "font-medium rounded-lg",
                    style: {
                        background: "#1F2937",
                        color: "#fff",
                        border: "1px solid #374151",
                    },
                }}
            />

            <div className="pb-8">
                <div className="mb-12 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Manajemen Tim</h1>
                        <p className="text-slate-400 text-sm mt-1">Kelola anggota tim yang tampil di halaman beranda</p>
                    </div>
                    <button
                        onClick={openAddModal}
                        className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-500 px-4 py-2.5 rounded-lg font-medium shadow-md transition-all text-sm"
                    >
                        <FiPlus size={18} /> Add Member
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teams.length === 0 ? (
                        <div className="md:col-span-3 bg-[#111827] rounded-2xl border border-slate-800 p-16 text-center">
                            <FiUsers
                                size={48}
                                className="mx-auto text-slate-600 mb-4"
                            />
                            <h3 className="text-lg font-bold text-white">
                                No team members found
                            </h3>
                            <p className="text-slate-500 text-sm mt-1">
                                Start adding your professional team members.
                            </p>
                        </div>
                    ) : (
                        teams.map((t) => (
                            <div
                                key={t.id}
                                className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden group hover:border-slate-700 transition-all"
                            >
                                <div className="h-48 overflow-hidden relative">
                                    <img
                                        src={t.photo_url}
                                        alt={t.name}
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent opacity-60"></div>
                                    <div className="absolute top-4 right-4 flex gap-2">
                                        <button
                                            onClick={() => openEditModal(t)}
                                            className="p-2 bg-slate-900/80 backdrop-blur rounded-lg text-blue-400 hover:text-white transition-colors"
                                        >
                                            <FiEdit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => deleteMember(t.id)}
                                            className="p-2 bg-slate-900/80 backdrop-blur rounded-lg text-red-400 hover:text-white transition-colors"
                                        >
                                            <FiTrash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h4 className="text-white font-bold">
                                        {t.name}
                                    </h4>
                                    <p className="text-blue-400 text-xs font-medium uppercase tracking-wider mb-4">
                                        {t.role}
                                    </p>

                                    <div className="flex gap-4 items-center pt-4 border-t border-slate-800">
                                        {[
                                            "facebook",
                                            "instagram",
                                            "twitter",
                                        ].map(
                                            (platform) =>
                                                t[platform] && (
                                                    <a
                                                        key={platform}
                                                        href={t[platform]}
                                                        target="_blank"
                                                        className="text-slate-500 hover:text-white transition-colors"
                                                    >
                                                        <FiExternalLink
                                                            size={14}
                                                        />
                                                    </a>
                                                ),
                                        )}
                                        <span className="ml-auto text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                                            Order: {t.order}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <Modal show={isModalOpen} onClose={closeModal} maxWidth="lg">
                <div className="bg-[#111827] border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
                    <form onSubmit={submit} className="p-6">
                        <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
                            <h2 className="text-lg font-bold text-white">
                                {editingId
                                    ? "Edit Team Member"
                                    : "Add Team Member"}
                            </h2>
                            <button
                                type="button"
                                onClick={closeModal}
                                className="text-slate-400 hover:text-white"
                            >
                                <FiX size={20} />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2 flex justify-center mb-6">
                                <div
                                    className="relative group cursor-pointer"
                                    onClick={() =>
                                        document
                                            .getElementById("photo-upload")
                                            .click()
                                    }
                                >
                                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-800 border-2 border-dashed border-slate-700 flex items-center justify-center">
                                        {previewUrl ? (
                                            <img
                                                src={previewUrl}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <FiCamera
                                                className="text-slate-600"
                                                size={24}
                                            />
                                        )}
                                    </div>
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-2xl transition-opacity">
                                        <span className="text-[10px] text-white font-bold uppercase">
                                            Change
                                        </span>
                                    </div>
                                    <input
                                        id="photo-upload"
                                        type="file"
                                        className="hidden"
                                        onChange={handlePhotoChange}
                                        accept="image/*"
                                    />
                                </div>
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <InputLabel
                                    htmlFor="name"
                                    value="Full Name"
                                    className="text-slate-400 mb-1 text-sm"
                                />
                                <TextInput
                                    id="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    required
                                    className="w-full bg-[#1F2937] border-slate-700"
                                />
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <InputLabel
                                    htmlFor="role"
                                    value="Role / Title"
                                    className="text-slate-400 mb-1 text-sm"
                                />
                                <TextInput
                                    id="role"
                                    value={data.role}
                                    onChange={(e) =>
                                        setData("role", e.target.value)
                                    }
                                    required
                                    className="w-full bg-[#1F2937] border-slate-700"
                                />
                            </div>

                            <div className="col-span-1">
                                <InputLabel
                                    htmlFor="instagram"
                                    value="Instagram URL"
                                    className="text-slate-400 mb-1 text-sm"
                                />
                                <TextInput
                                    id="instagram"
                                    value={data.instagram}
                                    onChange={(e) =>
                                        setData("instagram", e.target.value)
                                    }
                                    className="w-full bg-[#1F2937] border-slate-700"
                                />
                            </div>

                            <div className="col-span-1">
                                <InputLabel
                                    htmlFor="twitter"
                                    value="Twitter URL"
                                    className="text-slate-400 mb-1 text-sm"
                                />
                                <TextInput
                                    id="twitter"
                                    value={data.twitter}
                                    onChange={(e) =>
                                        setData("twitter", e.target.value)
                                    }
                                    className="w-full bg-[#1F2937] border-slate-700"
                                />
                            </div>

                            <div className="col-span-1">
                                <InputLabel
                                    htmlFor="facebook"
                                    value="Facebook URL"
                                    className="text-slate-400 mb-1 text-sm"
                                />
                                <TextInput
                                    id="facebook"
                                    value={data.facebook}
                                    onChange={(e) =>
                                        setData("facebook", e.target.value)
                                    }
                                    className="w-full bg-[#1F2937] border-slate-700"
                                />
                            </div>

                            <div className="col-span-1">
                                <InputLabel
                                    htmlFor="order"
                                    value="Display Order"
                                    className="text-slate-400 mb-1 text-sm"
                                />
                                <TextInput
                                    id="order"
                                    type="number"
                                    value={data.order}
                                    onChange={(e) =>
                                        setData("order", e.target.value)
                                    }
                                    className="w-full bg-[#1F2937] border-slate-700"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-slate-800">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="text-sm font-medium text-slate-500 hover:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-lg shadow-lg disabled:opacity-50"
                            >
                                {processing
                                    ? "Uploading..."
                                    : editingId
                                      ? "Update Member"
                                      : "Save Member"}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
