import AppLayout from '@/layouts/app-layout';
import { Head, useForm, router } from '@inertiajs/react';
import { Trash2, Plus, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface WishlistItem {
    id: number;
    name: string;
    url?: string;
    description?: string;
}

interface Wishlist {
    id: number;
    title: string;
    items: WishlistItem[];
}

export default function Index({ wishlists }: { wishlists: Wishlist[] }) {
    const { data, setData, post, processing, reset } = useForm({
        title: '',
    });

    const [selectedWishlistId, setSelectedWishlistId] = useState<number | null>(wishlists.length > 0 ? wishlists[0].id : null);

    const selectedWishlist = wishlists.find((list: Wishlist) => list.id === selectedWishlistId) || (wishlists.length > 0 ? wishlists[0] : null);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/wishlists', {
            onSuccess: () => {
                reset();
                // Select the new list (assuming it's the last one or re-rendering handles it)
                // Ideally we'd select the newly created list, but for now defaulting is fine.
            },
        });
    };

    const deleteWishlist = (id: number) => {
        if (confirm('Are you sure?')) {
            router.delete(`/wishlists/${id}`);
            if (selectedWishlistId === id) {
                setSelectedWishlistId(null);
            }
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'My Wishlists', href: '/wishlists' },
            ]}
        >
            <Head title="Wishlists" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight mb-6">My Wishlists</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Sidebar: List of Wishlists */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-lg font-bold mb-4">Your Lists</h3>

                            <form onSubmit={submit} className="mb-6 flex gap-2">
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                    placeholder="New list name..."
                                    className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm w-full text-sm"
                                />
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </form>

                            <ul className="space-y-2">
                                {wishlists.map((list: Wishlist) => (
                                    <li
                                        key={list.id}
                                        className={`flex justify-between items-center p-3 rounded-md cursor-pointer ${selectedWishlist?.id === list.id ? 'bg-indigo-50 border border-indigo-200' : 'hover:bg-gray-50 border border-transparent'}`}
                                        onClick={() => setSelectedWishlistId(list.id)}
                                    >
                                        <span className="font-medium">{list.title}</span>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); deleteWishlist(list.id); }}
                                            className="text-red-400 hover:text-red-600"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Main Content: Items in Selected Wishlist */}
                        <div className="col-span-2 bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            {selectedWishlist ? (
                                <WishlistItems wishlist={selectedWishlist} />
                            ) : (
                                <p className="text-gray-500 text-center py-10">Select or create a wishlist to manage items.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function WishlistItems({ wishlist }: { wishlist: Wishlist }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        url: '',
        description: ''
    });

    const submitItem = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/wishlists/${wishlist.id}/items`, {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    const deleteItem = (itemId: number) => {
        if (confirm('Remove this item?')) {
            router.delete(`/wishlists/${wishlist.id}/items/${itemId}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">{wishlist.title}</h3>
                <span className="text-sm text-gray-500">{wishlist.items.length} items</span>
            </div>

            {/* Add Item Form */}
            <form onSubmit={submitItem} className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Item Name</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            required
                        />
                        {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Link (Optional)</label>
                        <input
                            type="url"
                            value={data.url}
                            onChange={e => setData('url', e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="https://..."
                        />
                        {errors.url && <div className="text-red-500 text-xs mt-1">{errors.url}</div>}
                    </div>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Description / Details</label>
                    <textarea
                        value={data.description}
                        onChange={e => setData('description', e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        rows="2"
                    ></textarea>
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm font-medium"
                    >
                        Add Item
                    </button>
                </div>
            </form>

            {/* Items List */}
            <div className="space-y-4">
                {wishlist.items.length === 0 && (
                    <p className="text-center text-gray-400 italic">No items yet. Add something you want!</p>
                )}

                {wishlist.items.map((item: WishlistItem) => (
                    <div key={item.id} className="border rounded-lg p-4 flex justify-between items-start hover:shadow-sm transition-shadow">
                        <div>
                            <h4 className="font-semibold text-lg flex items-center gap-2">
                                {item.name}
                                {item.url && (
                                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:text-indigo-700">
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                )}
                            </h4>
                            {item.description && <p className="text-gray-600 mt-1 text-sm">{item.description}</p>}
                        </div>
                        <button
                            onClick={() => deleteItem(Number(item.id))}
                            className="text-gray-400 hover:text-red-500 p-1"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
