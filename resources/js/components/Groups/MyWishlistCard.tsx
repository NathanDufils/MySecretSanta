import { type Participant, type WishlistItem, type Wishlist } from '@/types';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Gift } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface MyWishlistCardProps {
    participants: Participant[];
    userWishlists: Wishlist[];
    onAssign: (wishlistId: string) => void;
    isLoading: boolean;
}

export default function MyWishlistCard({ participants, userWishlists, onAssign, isLoading }: MyWishlistCardProps) {
    const { auth } = usePage<SharedData>().props;
    const myWishlist = participants.find((p: Participant) => p.id === auth.user.id)?.assigned_wishlist;

    return (
        <div className="rounded-2xl bg-white/10 backdrop-blur-md p-8 shadow-lg border border-white/20">
            <h2 className="font-christmas mb-4 text-3xl font-bold text-white">
                Votre Liste de Souhaits
            </h2>

            <div className="mb-6">
                <label className="block text-sm font-medium text-white/80 dark:text-gray-300 mb-2">Choisir la liste pour ce groupe :</label>
                <Select
                    value={myWishlist?.id?.toString() || ""}
                    onValueChange={(value) => onAssign(value)}
                    disabled={isLoading}
                >
                    <SelectTrigger className="w-full rounded-lg bg-white/20 dark:bg-gray-800/80 border-white/10 dark:border-gray-600 text-white px-5 py-2 focus:ring-[#F8B803] dark:focus:ring-blue-500 focus:border-[#F8B803] dark:focus:border-blue-500 focus:bg-white/30 dark:focus:bg-gray-700/90 transition-colors [&>span]:line-clamp-1">
                        <SelectValue placeholder="-- Aucune liste sélectionnée --" />
                    </SelectTrigger>
                    <SelectContent
                        side="bottom"
                        sideOffset={0}
                        className="bg-[#D42426] dark:bg-gray-900 border-white/20 text-white dark:text-gray-200"
                    >
                        <SelectItem value="none" className="hover:bg-white/10 focus:bg-white/10 cursor-pointer">-- Aucune liste sélectionnée --</SelectItem>
                        {userWishlists.map((list: Wishlist) => (
                            <SelectItem key={list.id} value={String(list.id)} className="hover:bg-white/10 focus:bg-white/10 cursor-pointer">
                                {list.title} ({list.items?.length || 0} objets)
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {myWishlist?.items && myWishlist.items.length > 0 ? (
                <ul className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent">
                    {myWishlist.items.map((item: WishlistItem) => (
                        <li key={item.id} className="flex items-center gap-3 rounded-lg bg-white/5 p-3 hover:bg-white/10 transition-colors">
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold truncate">{item.name}</p>
                                {item.url && <a href={item.url} target="_blank" rel="noreferrer" className="text-xs text-[#F8B803] hover:underline truncate block flex items-center gap-1">
                                    <Gift className="w-3 h-3 inline" /> Voir le lien
                                </a>}
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="text-center py-6 mb-4">
                    <p className="text-red-100 italic mb-2">Aucune liste active.</p>
                    <p className="text-sm text-white/60">Sélectionnez une liste ci-dessus ou créez-en une nouvelle.</p>
                </div>
            )}

            <Link href="/wishlists" className="block w-full text-center rounded-full bg-white py-3 font-bold text-[#D42426] hover:bg-gray-100 transition-colors shadow-md hover:scale-[1.02] active:scale-95 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700">
                Gérer mes Listes
            </Link>
        </div>
    );
}
