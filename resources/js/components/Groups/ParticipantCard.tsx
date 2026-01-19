import { Trash2 } from 'lucide-react';
import { type Participant, type WishlistItem } from '@/types';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

interface ParticipantCardProps {
    participant: Participant;
    isAdmin: boolean;
    groupStatus: string;
    onRemove: (userId: number) => void;
}

export default function ParticipantCard({ participant, isAdmin, groupStatus, onRemove }: ParticipantCardProps) {
    const { auth } = usePage<SharedData>().props;
    const isMe = participant.id === auth.user.id;

    return (
        <div className={`flex items-start gap-4 rounded-xl p-4 transition-all ${isMe ? 'bg-[#F8B803]/20 border border-[#F8B803]/50' : 'bg-white/5 border border-white/10'}`}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-lg font-bold">
                {participant.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold truncate text-lg">
                        {participant.name} {isMe && '(Vous)'}
                    </h3>
                    {isAdmin && !isMe && groupStatus === 'open' && (
                        <button
                            onClick={() => onRemove(participant.id)}
                            className="text-white/50 hover:text-red-300 transition-colors"
                            title="Retirer le membre"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* Wishlist Preview */}
                <div className="mt-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-white/60 mb-1">
                        Liste :
                    </p>
                    {participant.assigned_wishlist?.items && participant.assigned_wishlist.items.length > 0 ? (
                        <ul className="text-sm space-y-1 text-red-50">
                            {participant.assigned_wishlist?.items.map((item: WishlistItem) => (
                                <li key={item.id} className="flex items-center gap-1.5 truncate">
                                    <span className="block h-1.5 w-1.5 rounded-full bg-[#F8B803]" />
                                    {item.name}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm italic text-white/40">Vide...</p>
                    )}
                </div>
            </div>
        </div>
    );
}
