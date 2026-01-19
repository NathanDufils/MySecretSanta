import { type Participant, type Draw, type WishlistItem } from '@/types';

interface MissionCardProps {
    draw: Draw | null;
    participants: Participant[];
}

export default function MissionCard({ draw, participants }: MissionCardProps) {
    if (!draw) {
        return (
            <div className="rounded-2xl bg-[#165B33] p-8 shadow-xl border-4 border-[#F8B803]/50 relative overflow-hidden group hover:scale-[1.02] transition-transform">
                <div className="relative z-10">
                    <h2 className="font-christmas mb-4 text-3xl font-bold text-[#F8B803]">
                        Votre Mission Secrète
                    </h2>
                    <p className="text-xl text-white">Le tirage n'a pas encore eu lieu ! Revenez plus tard.</p>
                </div>
                <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-white/10 blur-3xl opacity-50" />
            </div>
        );
    }

    const targetWishlist = participants.find((p: Participant) => p.id === draw.target_id)?.assigned_wishlist;

    return (
        <div className="rounded-2xl bg-[#165B33] p-8 shadow-xl border-4 border-[#F8B803]/50 relative overflow-hidden group hover:scale-[1.02] transition-transform">
            <div className="relative z-10">
                <h2 className="font-christmas mb-4 text-3xl font-bold text-[#F8B803]">
                    Votre Mission Secrète
                </h2>
                <div>
                    <p className="mb-2 text-lg text-green-100">Vous devez préparer un cadeau pour :</p>
                    <div className="text-4xl font-bold text-white mb-4">
                        {draw.target?.name}
                    </div>
                    <div className="rounded-lg bg-black/20 p-4">
                        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#F8B803]">
                            Sa Liste de Souhaits
                        </p>
                        <ul className="list-inside list-disc space-y-1 text-green-50">
                            {targetWishlist?.items?.length ? (
                                targetWishlist.items.map((item: WishlistItem) => (
                                    <li key={item.id}>
                                        <span className="font-medium">{item.name}</span>
                                        {item.url && (
                                            <a href={item.url} target="_blank" rel="noreferrer" className="ml-2 text-xs text-[#F8B803] underline">Lien</a>
                                        )}
                                    </li>
                                ))
                            ) : (
                                <li className="italic opacity-70">Aucun cadeau ajouté pour le moment...</li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
            {/* Decorative shimmer */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-white/10 blur-3xl opacity-50" />
        </div>
    );
}
