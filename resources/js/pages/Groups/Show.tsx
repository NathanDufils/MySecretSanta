import { Head, Link, usePage, router } from '@inertiajs/react';
import { type SharedData, type Group, type Wishlist, type Participant, type Draw } from '@/types';
import { useSnowflakes } from '@/hooks/useSnowflakes';
import { ChevronLeft, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

// Components
import SettingsDialog from '@/components/Groups/SettingsDialog';
import InviteDialog from '@/components/Groups/InviteDialog';
import MissionCard from '@/components/Groups/MissionCard';
import MyWishlistCard from '@/components/Groups/MyWishlistCard';
import ParticipantCard from '@/components/Groups/ParticipantCard';

interface GroupShowProps {
    group: Group;
    participants: Participant[];
    draw: Draw | null;
    userWishlists: Wishlist[];
}

export default function GroupShow({ group, participants, draw, userWishlists }: GroupShowProps) {
    const { auth } = usePage<SharedData>().props;
    const snowflakes = useSnowflakes(20);
    const isAdmin = group.admin_id === auth.user.id;

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);

    const handleAssign = (wishlistId: string) => {
        setWishlistLoading(true);

        router.post(`/groups/${group.id}/wishlist`, { wishlist_id: wishlistId }, {
            onFinish: () => setWishlistLoading(false),
            preserveScroll: true,
        });
    };

    const handleRemove = (userId: number) => {
        if (confirm('Êtes-vous sûr de vouloir retirer ce membre ?')) {
            router.delete(`/groups/${group.id}/participants/${userId}`);
        }
    };

    const handleDraw = () => {
        if (confirm('Lancer le tirage ? Cette action est irréversible.')) {
            router.post(`/groups/${group.id}/draw`);
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#D42426] to-[#8C1819] text-white selection:bg-[#F8B803] selection:text-[#391800] pb-20">
            <Head title={`${group.name} - Secret Santa`} />

            {/* Custom Styles */}


            {/* Snow Animation */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 select-none">
                {snowflakes.map((flake, i) => (
                    <div key={i} className="snowflake text-xl" style={flake}>❄</div>
                ))}
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-6 pt-10">
                {/* Header */}
                <div className="mb-10 flex flex-col items-center text-center">
                    <Link
                        href="/"
                        className="mb-6 flex items-center gap-2 self-start rounded-full bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-sm transition-colors hover:bg-white/20"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Retour à l'Accueil
                    </Link>

                    <h1 className="font-christmas mb-2 text-5xl font-bold text-white drop-shadow-md sm:text-7xl">
                        {group.name}
                    </h1>
                    <p className="text-red-100 mb-4">
                        Échange de cadeaux : {new Date(group.event_date).toLocaleDateString('fr-FR', { dateStyle: 'long' })}
                    </p>

                    {group.max_budget !== undefined && group.max_budget !== null && (
                        <p className="text-[#F8B803] font-bold text-lg mb-4">
                            Budget Maximum : {group.max_budget} €
                        </p>
                    )}

                    <div className="mb-6 inline-flex items-center gap-3 rounded-xl bg-white/20 px-6 py-3 backdrop-blur-md border border-white/30 shadow-lg">
                        <div className="text-right">
                            <p className="text-xs font-bold text-white/60 uppercase tracking-widest">Code Groupe</p>
                            <p className="text-2xl font-mono font-bold text-[#F8B803] tracking-wider select-all">{group.code}</p>
                        </div>
                    </div>

                    {group.description && <p className="text-white/80 max-w-2xl mb-6">{group.description}</p>}

                    {isAdmin && (
                        <div className="flex gap-4">
                            <SettingsDialog
                                group={group}
                                open={isSettingsOpen}
                                onOpenChange={setIsSettingsOpen}
                            />

                            <InviteDialog
                                group={group}
                                open={isInviteOpen}
                                onOpenChange={setIsInviteOpen}
                            />

                            {group.status === 'open' && (
                                <Button
                                    onClick={handleDraw}
                                    className="bg-[#F8B803] text-[#391800] hover:bg-[#e0a602] font-bold gap-2 dark:bg-yellow-600 dark:text-white dark:hover:bg-yellow-700"
                                    disabled={participants.length < 3}
                                >
                                    <Gift className="h-4 w-4" />
                                    Lancer le Tirage
                                </Button>
                            )}
                        </div>
                    )}
                </div>

                <div className="grid gap-8 lg:grid-cols-2">

                    {/* LEFT COLUMN: Mission & My Wishlist */}
                    <div className="flex flex-col gap-8">
                        <MissionCard draw={draw} participants={participants} />
                        <MyWishlistCard
                            participants={participants}
                            userWishlists={userWishlists}
                            onAssign={handleAssign}
                            isLoading={wishlistLoading}
                        />
                    </div>

                    {/* RIGHT COLUMN: Participants List */}
                    <div className="rounded-2xl bg-white/10 backdrop-blur-md p-8 shadow-lg border border-white/20">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-christmas text-3xl font-bold text-white">
                                Participants ({participants.length})
                            </h2>
                        </div>

                        <div className="grid gap-4">
                            {participants.map((participant: Participant) => (
                                <ParticipantCard
                                    key={participant.id}
                                    participant={participant}
                                    isAdmin={isAdmin}
                                    groupStatus={group.status}
                                    onRemove={handleRemove}
                                />
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
