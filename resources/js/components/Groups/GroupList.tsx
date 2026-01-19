import { type Group } from '@/types';
import { Link } from '@inertiajs/react';

interface GroupListProps {
    groups: Group[];
}

export default function GroupList({ groups }: GroupListProps) {
    if (!groups || groups.length === 0) {
        return (
            <div className="text-center text-white/80 animate-fade-in-up">
                <p className="text-lg">Vous n'avez pas encore rejoint de groupe.</p>
            </div>
        );
    }

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-fade-in-up delay-100">
            {groups.map((group) => (
                <Link
                    href={`/groups/${group.id}`}
                    key={group.id}
                    className="group relative block overflow-hidden rounded-xl bg-white/10 backdrop-blur-md transition-all hover:-translate-y-1 hover:bg-white/20 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#F8B803]"
                >
                    <div className="p-6">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#165B33] text-2xl shadow-lg">
                            🎁
                        </div>
                        <h3 className="mb-2 text-xl font-bold text-white">
                            {group.name}
                        </h3>
                        <p className="mb-2 text-sm text-red-100">
                            Échange de cadeaux : {new Date(group.event_date).toLocaleDateString('fr-FR', { dateStyle: 'long' })}
                        </p>
                        {group.max_budget && (
                            <p className="mb-4 text-sm font-semibold text-[#F8B803]">
                                💰 Budget Max : {group.max_budget} €
                            </p>
                        )}
                        <div
                            className="inline-flex items-center gap-2 text-sm font-semibold text-[#F8B803] transition-colors group-hover:text-[#ffd666]"
                        >
                            Voir le Groupe
                            <span aria-hidden="true">→</span>
                        </div>
                    </div>
                    <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-[#D42426]/30 blur-2xl transition-all group-hover:bg-[#D42426]/50" />
                </Link>
            ))}
        </div>
    );
}
