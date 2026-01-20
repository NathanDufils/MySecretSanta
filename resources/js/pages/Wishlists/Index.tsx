import { Head, router, Link } from '@inertiajs/react';
import { Trash2, ExternalLink, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useSnowflakes } from '@/hooks/useSnowflakes';
import { type Wishlist, type WishlistItem } from '@/types';

// Components
import CreateWishlistDialog from '@/components/Wishlists/CreateWishlistDialog';
import AddItemDialog from '@/components/Wishlists/AddItemDialog';

interface WishlistIndexProps {
    wishlists: Wishlist[];
}

export default function Index({ wishlists }: WishlistIndexProps) {
    const snowflakes = useSnowflakes(20);
    const smallSnowflakes = useSnowflakes(15, 8);

    const [selectedWishlistId, setSelectedWishlistId] = useState<number | null>(wishlists.length > 0 ? wishlists[0].id : null);

    const selectedWishlist = wishlists.find((list: Wishlist) => list.id === selectedWishlistId) || (wishlists.length > 0 ? wishlists[0] : null);

    const deleteWishlist = (id: number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette liste ?')) {
            router.delete(`/wishlists/${id}`);
            if (selectedWishlistId === id) {
                setSelectedWishlistId(null);
            }
        }
    };

    return (
        <>
            <Head title="Mes Listes de Souhaits" />

            <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#D42426] to-[#8C1819] text-white selection:bg-[#F8B803] selection:text-[#391800]">
                {/* Snow Animation Layer */}
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 select-none">
                    {snowflakes.map((flake, i) => (
                        <div key={i} className="snowflake text-xl" style={flake}>❄</div>
                    ))}
                    {smallSnowflakes.map((flake, i) => (
                        <div key={i + 20} className="snowflake text-sm" style={flake}>❅</div>
                    ))}
                </div>

                <div className="relative z-10 mx-auto max-w-7xl px-6 py-10">
                    {/* Header with Back Button */}
                    <div className="mb-8 flex items-center gap-6">
                        <Link href="/" className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-white hover:bg-white/20 transition-colors backdrop-blur-md border border-white/20">
                            <ArrowLeft className="w-5 h-5" />
                            <span className="font-bold">Retour</span>
                        </Link>
                        <h1 className="font-christmas text-4xl font-bold drop-shadow-md">Mes Listes de Souhaits</h1>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Sidebar: List of Wishlists */}
                        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 text-gray-800 border border-white/50">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-[#D42426] font-christmas">Vos Listes</h3>
                                <CreateWishlistDialog />
                            </div>

                            <ul className="space-y-2">
                                {wishlists.map((list: Wishlist) => (
                                    <li
                                        key={list.id}
                                        className={`flex justify-between items-center p-3 rounded-xl cursor-pointer transition-all ${selectedWishlist?.id === list.id ? 'bg-[#F8B803]/20 border border-[#F8B803] text-[#391800]' : 'hover:bg-gray-50 border border-transparent'}`}
                                        onClick={() => setSelectedWishlistId(list.id)}
                                    >
                                        <span className="font-semibold">{list.title}</span>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); deleteWishlist(list.id); }}
                                            className="text-red-400 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Main Content: Items in Selected Wishlist */}
                        <div className="col-span-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 text-gray-800 border border-white/50">
                            {selectedWishlist ? (
                                <WishlistItems wishlist={selectedWishlist} />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center py-10 opacity-60">
                                    <p className="text-lg">Sélectionnez ou créez une liste pour commencer.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function WishlistItems({ wishlist }: { wishlist: Wishlist }) {
    const deleteItem = (itemId: number) => {
        if (confirm('Supprimer cet article ?')) {
            router.delete(`/wishlists/${wishlist.id}/items/${itemId}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <div className="flex items-baseline gap-3">
                    <h3 className="text-3xl font-bold text-[#D42426] font-christmas">{wishlist.title}</h3>
                    <span className="text-sm font-medium bg-gray-100 px-3 py-1 rounded-full">{wishlist.items.length} articles</span>
                </div>
                <AddItemDialog wishlist={wishlist} />
            </div>

            {/* Items List */}
            <div className="space-y-4">
                {wishlist.items.length === 0 && (
                    <div className="text-center py-8 rounded-xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-400 italic">Cette liste est vide. Ajoutez vos idées cadeaux !</p>
                    </div>
                )}

                {wishlist.items.map((item: WishlistItem) => (
                    <div key={item.id} className="group bg-white border border-gray-100 rounded-xl p-4 flex justify-between items-start hover:shadow-md transition-all hover:border-[#F8B803]/50">
                        <div className="flex-1">
                            <h4 className="font-bold text-lg flex items-center gap-2 text-gray-800">
                                {item.name}
                                {item.url && (
                                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-[#165B33] hover:text-[#124d2b] transition-colors p-1 hover:bg-green-50 rounded-full">
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                )}
                            </h4>
                            {item.description && <p className="text-gray-600 mt-1 text-sm bg-gray-50 p-2 rounded-md inline-block">{item.description}</p>}
                        </div>
                        <button
                            onClick={() => deleteItem(Number(item.id))}
                            className="text-gray-300 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
