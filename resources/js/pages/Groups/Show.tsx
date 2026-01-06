import { Head, Link, usePage, useForm, router } from '@inertiajs/react';
import { type SharedData } from '@/types';
import { useSnowflakes } from '@/hooks/useSnowflakes';

import { ChevronLeft, Trash2, Settings, UserPlus, Gift, X } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

interface Group {
    id: number;
    name: string;
    description: string;
    event_date: string;
    admin_id: number;
    status: string;
    code: string;
}

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

interface Participant {
    id: number;
    name: string;
    assigned_wishlist?: Wishlist;
}

interface Draw {
    target_id: number;
    target?: Participant;
}

export default function GroupShow({ group, participants, draw, userWishlists }: { group: Group, participants: Participant[], draw: Draw, userWishlists: Wishlist[] }) {
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

    const updateForm = useForm<{
        description: string;
        event_date: string;
    }>({
        description: group.description || '',
        event_date: group.event_date ? new Date(group.event_date).toISOString().split('T')[0] : '',
    });

    const inviteForm = useForm<{
        email: string;
    }>({
        email: '',
    });

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        updateForm.put(`/groups/${group.id}`, {
            onSuccess: () => setIsSettingsOpen(false),
        });
    };

    const handleInvite = (e: React.FormEvent) => {
        e.preventDefault();
        inviteForm.post(`/groups/${group.id}/participants`, {
            onSuccess: () => {
                setIsInviteOpen(false);
                inviteForm.reset();
            },
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

    const myWishlist = participants.find((p: Participant) => p.id === auth.user.id)?.assigned_wishlist;

    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#D42426] to-[#8C1819] text-white selection:bg-[#F8B803] selection:text-[#391800] pb-20">
            <Head title={`${group.name} - Secret Santa`} />

            {/* Custom Styles */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Mountains+of+Christmas:wght@400;700&display=swap');
                .font-christmas { font-family: 'Mountains of Christmas', cursive; }
                .snowflake { position: absolute; top: -3vh; color: white; animation: fall linear infinite; }
                @keyframes fall {
                    0% { transform: translateY(-10vh) translateX(0px); opacity: 0; }
                    10% { opacity: 0.8; }
                    100% { transform: translateY(100vh) translateX(20px); opacity: 0.3; }
                }
            `}</style>

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

                    <div className="mb-6 inline-flex items-center gap-3 rounded-xl bg-white/20 px-6 py-3 backdrop-blur-md border border-white/30 shadow-lg">
                        <div className="text-right">
                            <p className="text-xs font-bold text-white/60 uppercase tracking-widest">Code Groupe</p>
                            <p className="text-2xl font-mono font-bold text-[#F8B803] tracking-wider select-all">{group.code}</p>
                        </div>
                    </div>

                    {group.description && <p className="text-white/80 max-w-2xl mb-6">{group.description}</p>}

                    {isAdmin && (
                        <div className="flex gap-4">
                            <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="secondary" className="gap-2">
                                        <Settings className="h-4 w-4" /> Paramètres
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="text-black sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Paramètres du Groupe</DialogTitle>
                                        <DialogDescription>Modifier les détails du groupe.</DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleUpdate}>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="date" className="text-right">Date</Label>
                                                <Input id="date" type="date" className="col-span-3" value={updateForm.data.event_date} onChange={e => updateForm.setData('event_date', e.target.value)} />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="desc" className="text-right">Description</Label>
                                                <Input id="desc" className="col-span-3" value={updateForm.data.description} onChange={e => updateForm.setData('description', e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="mt-4 border-t border-gray-100 pt-4">
                                            <h4 className="text-sm font-semibold text-red-600 mb-2">Zone Danger</h4>
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                className="w-full bg-red-100 text-red-600 hover:bg-red-200"
                                                onClick={() => {
                                                    if (confirm('Êtes-vous ABSOLUMENT sûr ? Cette action supprimera le groupe et toutes les données associées.')) {
                                                        // Using hardcoded path since Ziggy/Wayfinder setup is uncertain
                                                        router.delete(`/groups/${group.id}`);
                                                    }
                                                }}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Supprimer ce Groupe
                                            </Button>
                                        </div>
                                        <DialogFooter>
                                            <Button type="submit" className="bg-[#D42426] text-white hover:bg-[#b01e20]">Enregistrer</Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>

                            <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="secondary" className="gap-2" disabled={group.status !== 'open'}>
                                        <UserPlus className="h-4 w-4" /> Inviter un Membre
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[480px] bg-transparent border-none shadow-none p-0 overflow-visible focus:outline-none">
                                    <div className="relative flex flex-col items-center">
                                        {/* The Globe */}
                                        <div className="relative w-full aspect-square rounded-full bg-gradient-to-b from-blue-50/50 to-white/40 backdrop-blur-md border-4 border-white/60 shadow-[0_0_50px_rgba(255,255,255,0.6)] flex flex-col items-center justify-center p-12 overflow-hidden z-10">

                                            {/* Close Button */}
                                            <DialogClose className="absolute top-10 text-white/80 hover:text-white transition-colors z-50 rounded-full p-2 bg-black/20 hover:bg-black/30">
                                                <X className="w-6 h-6" />
                                            </DialogClose>

                                            {/* Internal Snow/Sparkle Effect (Static for performance) */}
                                            <div className="absolute inset-0 pointer-events-none">
                                                <div className="absolute top-10 left-10 text-white/40 text-xs">❄</div>
                                                <div className="absolute top-20 right-14 text-white/30 text-xl">❅</div>
                                                <div className="absolute bottom-16 left-20 text-white/20 text-lg">❄</div>
                                            </div>

                                            <DialogHeader className="mb-6 text-center relative z-20">
                                                <DialogTitle className="font-christmas text-4xl text-[#D42426] drop-shadow-sm">Inviter un Membre</DialogTitle>
                                                <DialogDescription className="text-slate-700 font-medium">
                                                    Envoyez une invitation par email pour rejoindre le groupe.
                                                </DialogDescription>
                                            </DialogHeader>

                                            <form onSubmit={handleInvite} className="w-full relative z-20">
                                                <div className="grid gap-4 py-4">
                                                    <div className="flex flex-col gap-2">
                                                        <Label htmlFor="email" className="text-center text-[#165B33] font-bold">
                                                            Adresse Email
                                                        </Label>
                                                        <Input
                                                            id="email"
                                                            type="email"
                                                            required
                                                            value={inviteForm.data.email}
                                                            onChange={e => inviteForm.setData('email', e.target.value)}
                                                            className="col-span-3 text-center bg-white/60 border-[#165B33]/30 focus:border-[#165B33] placeholder:text-slate-500 text-black"
                                                            placeholder="santa@northpole.com"
                                                        />
                                                    </div>
                                                    {inviteForm.errors.email && (
                                                        <p className="text-center text-sm text-[#D42426] font-bold bg-white/80 rounded-full px-2 py-0.5">{inviteForm.errors.email}</p>
                                                    )}
                                                </div>
                                                <DialogFooter className="justify-center sm:justify-center mt-2">
                                                    <Button type="submit" disabled={inviteForm.processing} className="bg-[#D42426] hover:bg-[#b01e20] text-white rounded-full px-8 shadow-lg hover:scale-105 transition-transform">
                                                        Envoyer l'invitation
                                                    </Button>
                                                </DialogFooter>
                                            </form>
                                        </div>

                                        {/* The Base */}
                                        <div className="w-[80%] h-24 bg-gradient-to-r from-[#8C1819] via-[#D42426] to-[#8C1819] rounded-b-[3rem] -mt-12 pt-16 relative z-0 border-x-4 border-b-4 border-[#391800]/20 shadow-2xl flex items-end justify-center pb-4">
                                            <div className="text-[#F8B803] font-christmas text-xl opacity-80">Ho Ho Ho !</div>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>

                            {group.status === 'open' && (
                                <Button
                                    onClick={handleDraw}
                                    className="bg-[#F8B803] text-[#391800] hover:bg-[#e0a602] font-bold gap-2"
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

                        {/* SECRET MISSION CARD */}
                        <div className="rounded-2xl bg-[#165B33] p-8 shadow-xl border-4 border-[#F8B803]/50 relative overflow-hidden group hover:scale-[1.02] transition-transform">
                            <div className="relative z-10">
                                <h2 className="font-christmas mb-4 text-3xl font-bold text-[#F8B803]">
                                    Votre Mission Secrète
                                </h2>
                                {draw ? (
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
                                                {/* Find target in participants list to get their wishlist */}
                                                {participants.find((p: Participant) => p.id === draw.target_id)?.assigned_wishlist?.items?.length ? (
                                                    participants.find((p: Participant) => p.id === draw.target_id)?.assigned_wishlist?.items.map((item: WishlistItem) => (
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
                                ) : (
                                    <p className="text-xl text-white">Le tirage n'a pas encore eu lieu ! Revenez plus tard.</p>
                                )}
                            </div>
                            {/* Decorative shimmer */}
                            <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-white/10 blur-3xl opacity-50" />
                        </div>

                        {/* MY WISHLIST CARD */}
                        <div className="rounded-2xl bg-white/10 backdrop-blur-md p-8 shadow-lg border border-white/20">
                            <h2 className="font-christmas mb-4 text-3xl font-bold text-white">
                                Votre Liste de Souhaits
                            </h2>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-white/80 mb-2">Choisir la liste pour ce groupe :</label>
                                <select
                                    className="w-full rounded-lg bg-white/20 border-white/10 text-white focus:ring-[#F8B803] focus:border-[#F8B803] focus:bg-white/30 transition-colors"
                                    value={myWishlist?.id || ''}
                                    onChange={(e) => handleAssign(e.target.value)}
                                    disabled={wishlistLoading}
                                >
                                    <option value="" className="text-black">-- Aucune liste sélectionnée --</option>
                                    {userWishlists.map((list: Wishlist) => (
                                        <option key={list.id} value={list.id} className="text-black">{list.title} ({list.items?.length || 0} objets)</option>
                                    ))}
                                </select>
                            </div>

                            {myWishlist?.items && myWishlist.items.length > 0 ? (
                                <ul className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent">
                                    {myWishlist.items.map((item: WishlistItem) => (
                                        <li key={item.id} className="flex items-center gap-3 rounded-lg bg-white/5 p-3 hover:bg-white/10 transition-colors">
                                            <span className="text-2xl">🎁</span>
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



                            <Link href="/wishlists" className="block w-full text-center rounded-full bg-white py-3 font-bold text-[#D42426] hover:bg-gray-100 transition-colors shadow-md hover:scale-[1.02] active:scale-95">
                                Gérer mes Listes
                            </Link>
                        </div>

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
                                <div key={participant.id} className={`flex items-start gap-4 rounded-xl p-4 transition-all ${participant.id === auth.user.id ? 'bg-[#F8B803]/20 border border-[#F8B803]/50' : 'bg-white/5 border border-white/10'}`}>
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-lg font-bold">
                                        {participant.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-bold truncate text-lg">
                                                {participant.name} {participant.id === auth.user.id && '(Vous)'}
                                            </h3>
                                            {isAdmin && participant.id !== auth.user.id && group.status === 'open' && (
                                                <button
                                                    onClick={() => handleRemove(participant.id)}
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
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
