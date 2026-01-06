import ChristmasTree from '@/components/ChristmasTree';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Check, X as XIcon, Bell, Heart, Plus } from 'lucide-react';
import { type SharedData } from '@/types';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';

import { useSnowflakes } from '@/hooks/useSnowflakes';
import { X } from 'lucide-react';
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
import { FormEventHandler, useState } from 'react';

interface Group {
    id: number;
    name: string;
    description: string;
    event_date: string;
    max_budget?: number;
    admin_id: number;
    status: string;
    admin?: { name: string };
}



interface Invitation {
    id: number;
    group: Group;
}

export default function Welcome({
    canRegister = true,
    groups = [],
    invitations = [],

}: {
    canRegister?: boolean;
    groups?: Group[];
    invitations?: Invitation[];

}) {
    const { auth } = usePage<SharedData>().props;

    const snowflakes = useSnowflakes(20);
    const smallSnowflakes = useSnowflakes(15, 8);

    const [isCreateOpen, setIsCreateOpen] = useState(false);

    // Create Group Form
    const createForm = useForm({
        name: '',
    });

    // Join Group Form
    const joinForm = useForm({
        code: '',
    });

    const createGroup: FormEventHandler = (e) => {
        e.preventDefault();
        createForm.post('/groups', {
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
            },
        });
    };

    const handleJoin = (e: React.FormEvent) => {
        e.preventDefault();
        joinForm.post('/groups/join', {
            onSuccess: () => {
                joinForm.reset();
            }
        });
    };

    const handleAcceptInvitation = (invitationId: number) => {
        router.post(`/invitations/${invitationId}/accept`, {}, {
            preserveScroll: true,
        });
    };

    const handleDeclineInvitation = (invitationId: number) => {
        if (confirm('Voulez-vous vraiment refuser cette invitation ?')) {
            router.post(`/invitations/${invitationId}/decline`, {}, {
                preserveScroll: true,
            });
        }
    };

    return (
        <>
            <Head title="Secret Santa - Ho Ho Ho!" />

            {/* Custom Styles for Snow and Fonts */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Mountains+of+Christmas:wght@400;700&display=swap');

                .font-christmas {
                    font-family: 'Mountains of Christmas', cursive;
                }

                .snowflake {
                    position: absolute;
                    top: -3vh;
                    color: white;
                    animation: fall linear infinite;
                }

                @keyframes fall {
                    0% { transform: translateY(-10vh) translateX(0px); opacity: 0; }
                    10% { opacity: 0.8; }
                    100% { transform: translateY(100vh) translateX(20px); opacity: 0.3; }
                }
            `}</style>

            <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#D42426] to-[#8C1819] text-white selection:bg-[#F8B803] selection:text-[#391800]">
                {/* Snow Animation Layer */}
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 select-none">
                    {/* Generating random snowflakes positions */}
                    {snowflakes.map((flake, i) => (
                        <div
                            key={i}
                            className="snowflake text-xl"
                            style={flake}
                        >
                            ❄
                        </div>
                    ))}
                    {smallSnowflakes.map((flake, i) => (
                        <div
                            key={i + 20}
                            className="snowflake text-sm"
                            style={flake}
                        >
                            ❅
                        </div>
                    ))}
                </div>

                {/* User Dropdown & Notifications */}
                {auth.user && (
                    <div className="absolute right-6 top-6 z-50 flex items-center gap-4">

                        {/* Notifications */}
                        <DropdownMenu>
                            <DropdownMenuTrigger className="relative flex w-11 h-11 items-center justify-center rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus:outline-none">
                                <span className="sr-only">Notifications</span>
                                <div className="relative">
                                    <Bell className="w-5 h-5 text-white" />
                                    {invitations && invitations.length > 0 && (
                                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#F8B803] text-[10px] font-bold text-[#391800]">
                                            {invitations.length}
                                        </span>
                                    )}
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-80 p-0 overflow-hidden bg-white/90 dark:bg-gray-900/95 backdrop-blur-xl border-none shadow-2xl rounded-2xl">
                                <div className="bg-[#D42426] dark:bg-red-800 p-4 text-white">
                                    <h3 className="font-bold flex items-center gap-2">
                                        💌 Invitations {invitations?.length ? `(${invitations.length})` : ''}
                                    </h3>
                                </div>
                                <div className="max-h-[300px] overflow-y-auto p-2 space-y-2">
                                    {invitations && invitations.length > 0 ? (
                                        invitations.map((invite: Invitation) => (
                                            <div key={invite.id} className="bg-white/50 dark:bg-gray-800/70 rounded-xl p-3 border border-gray-100 dark:border-gray-700 shadow-sm">
                                                <div className="mb-2">
                                                    <p className="font-bold text-gray-800 dark:text-white text-sm">
                                                        {invite.group?.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        Invité par {invite.group?.admin?.name}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        onClick={() => handleAcceptInvitation(invite.id)}
                                                        size="sm"
                                                        className="flex-1 bg-[#165B33] hover:bg-[#0f4224] text-white rounded-lg h-8 text-xs gap-1"
                                                    >
                                                        <Check className="w-3 h-3" /> Accepter
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleDeclineInvitation(invite.id)}
                                                        variant="destructive"
                                                        size="sm"
                                                        className="flex-1 rounded-lg h-8 text-xs gap-1"
                                                    >
                                                        <XIcon className="w-3 h-3" /> Refuser
                                                    </Button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm italic">
                                            Aucune nouvelle invitation.
                                        </div>
                                    )}
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Wishlist Button */}
                        <Link
                            href="/wishlists"
                            className="relative flex w-11 h-11 items-center justify-center rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus:outline-none"
                        >
                            <span className="sr-only">Mes Wishlists</span>
                            <Heart className="w-5 h-5 text-red-200 fill-current" />
                        </Link>

                        {/* User Menu */}
                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex h-11 items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus:outline-none">
                                <span className="font-semibold">{auth.user.name}</span>
                                <ChevronDown className="h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">

                                <DropdownMenuItem asChild>
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="w-full cursor-pointer"
                                    >
                                        Déconnexion
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )}

                {/* Main Content - Only for Guests */}
                {!auth.user && (
                    <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-6 md:flex-row md:justify-around text-center md:text-left selection:bg-none">
                        {/* Christmas Tree Section */}
                        <div className="mb-10 md:mb-0 md:w-1/2 flex justify-center">
                            <div className="w-full max-w-[400px] md:max-w-full">
                                <ChristmasTree />
                            </div>
                        </div>

                        {/* Text & Buttons Section */}
                        <div className="flex flex-col items-center md:items-start md:w-1/2 md:pl-10">
                            {/* Header / Logo Area */}
                            <div className="mb-10 animate-fade-in-down">
                                <div className="mb-4 text-6xl md:hidden">🎅</div>
                                <h1 className="font-christmas mb-2 text-6xl font-bold tracking-wide text-white drop-shadow-md sm:text-8xl">
                                    Secret Santa
                                </h1>
                                <p className="mx-auto md:mx-0 max-w-lg text-lg text-red-100 sm:text-xl">
                                    Organisez l'échange de cadeaux le plus magique avec vos amis et votre famille !
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-4 sm:flex-row sm:gap-6 animate-fade-in-up delay-200">
                                <Link
                                    href="/login"
                                    className="group relative inline-flex min-w-[160px] items-center justify-center overflow-hidden rounded-full bg-white px-8 py-3 font-bold text-[#D42426] shadow-lg transition-transform hover:scale-105 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-white/50"
                                >
                                    <span className="relative z-10">Connexion</span>
                                </Link>

                                {canRegister && (
                                    <Link
                                        href="/register"
                                        className="group relative inline-flex min-w-[160px] items-center justify-center overflow-hidden rounded-full bg-[#F8B803] px-8 py-3 font-bold text-[#391800] shadow-lg transition-transform hover:scale-105 hover:bg-[#e0a602] focus:outline-none focus:ring-4 focus:ring-[#F8B803]/50"
                                    >
                                        <span className="relative z-10">Commencer</span>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Groups Section - Only for Logged In User */}
                {auth.user && (
                    <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-20">
                        <div className="mb-12 text-center animate-fade-in-down">
                            <h2 className="font-christmas text-5xl font-bold text-white drop-shadow-md sm:text-6xl">
                                Vos Groupes
                            </h2>
                            <p className="mt-4 text-xl text-red-100">
                                Retrouvez vos événements Secret Santa
                            </p>

                            <div className="mt-8 flex flex-col items-center gap-6">
                                {/* Actions Row */}
                                <div className="flex flex-wrap items-center justify-center gap-4">
                                    {/* Create Group Dialog */}
                                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                                        <DialogTrigger asChild>
                                            <Button className="rounded-full bg-[#F8B803] px-8 py-6 text-lg font-bold text-[#391800] hover:bg-[#e0a602] shadow-lg gap-1 dark:bg-yellow-600 dark:text-white dark:hover:bg-yellow-700">
                                                <Plus className="h-6 w-6" strokeWidth={3} /> Créer un Groupe
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[480px] bg-transparent dark:bg-transparent border-none shadow-none p-0 overflow-visible focus:outline-none">
                                            <div className="relative flex flex-col items-center">
                                                {/* The Globe */}
                                                <div className="relative w-full aspect-square rounded-full bg-gradient-to-b from-blue-50/50 to-white/40 dark:from-blue-900/30 dark:to-gray-800/40 backdrop-blur-md border-4 border-white/60 dark:border-gray-500/60 shadow-[0_0_50px_rgba(255,255,255,0.6)] dark:shadow-[0_0_50px_rgba(100,100,255,0.4)] flex flex-col items-center justify-center p-12 overflow-hidden z-10">
                                                    {/* Close Button */}
                                                    <DialogClose className="absolute top-4 text-white/80 hover:text-white transition-colors z-50 rounded-full p-2 bg-black/20 hover:bg-black/30">
                                                        <X className="w-6 h-6" />
                                                    </DialogClose>

                                                    {/* Internal Snow/Sparkle Effect */}
                                                    <div className="absolute inset-0 pointer-events-none">
                                                        <div className="absolute top-10 left-10 text-white/40 text-xs">❄</div>
                                                        <div className="absolute top-20 right-14 text-white/30 text-xl">❅</div>
                                                        <div className="absolute bottom-16 left-20 text-white/20 text-lg">❄</div>
                                                    </div>

                                                    <DialogHeader className="mb-6 text-center relative z-20">
                                                        <DialogTitle className="font-christmas text-4xl text-[#D42426] dark:text-red-400 drop-shadow-sm">Créer un Nouveau Groupe</DialogTitle>
                                                        <DialogDescription className="text-slate-700 dark:text-gray-300 font-medium">
                                                            Donnez un nom à votre groupe pour commencer.
                                                        </DialogDescription>
                                                    </DialogHeader>

                                                    <form onSubmit={createGroup} className="w-full relative z-20">
                                                        <div className="grid gap-4 py-4">
                                                            <div className="flex flex-col gap-2">
                                                                <Label htmlFor="name" className="text-center text-[#165B33] dark:text-green-400 font-bold">
                                                                    Nom du Groupe
                                                                </Label>
                                                                <Input
                                                                    id="name"
                                                                    value={createForm.data.name}
                                                                    onChange={(e) => createForm.setData('name', e.target.value)}
                                                                    className="col-span-3 text-center bg-white/60 dark:bg-gray-700/80 border-[#165B33]/30 dark:border-green-500/30 focus:border-[#165B33] dark:focus:border-green-400 placeholder:text-slate-500 dark:placeholder:text-gray-400 text-black dark:text-white"
                                                                    placeholder="Famille"
                                                                />
                                                            </div>
                                                            {createForm.errors.name && (
                                                                <div className="text-center text-sm text-[#D42426] dark:text-red-400 font-bold bg-white/80 dark:bg-gray-800/80 rounded-full px-2 py-0.5">{createForm.errors.name}</div>
                                                            )}
                                                        </div>
                                                        <DialogFooter className="justify-center sm:justify-center mt-2">
                                                            <Button type="submit" disabled={createForm.processing} className="bg-[#D42426] hover:bg-[#b01e20] text-white rounded-full px-8 shadow-lg hover:scale-105 transition-transform dark:bg-red-700 dark:hover:bg-red-600">
                                                                Créer le Groupe
                                                            </Button>
                                                        </DialogFooter>
                                                    </form>
                                                </div>

                                                {/* The Base */}
                                                <div className="w-[80%] h-24 bg-gradient-to-r from-[#8C1819] via-[#D42426] to-[#8C1819] dark:from-red-900 dark:via-red-700 dark:to-red-900 rounded-b-[3rem] -mt-12 pt-16 relative z-0 border-x-4 border-b-4 border-[#391800]/20 dark:border-gray-900/40 shadow-2xl flex items-end justify-center pb-4">
                                                    <div className="text-[#F8B803] dark:text-yellow-300 font-christmas text-xl opacity-80">Ho Ho Ho !</div>
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>

                                    {/* Join Group Form */}
                                    <form onSubmit={handleJoin} className="flex items-center gap-2 rounded-full bg-white/10 dark:bg-gray-800/50 p-1 pl-4 backdrop-blur-sm border border-white/20 dark:border-gray-600/40 shadow-lg">
                                        <Label htmlFor="code" className="sr-only">Code du Groupe</Label>
                                        <Input
                                            id="code"
                                            placeholder="Code..."
                                            className="bg-transparent border-0 text-white placeholder:text-white/60 dark:placeholder:text-gray-400 w-24 uppercase font-mono font-bold focus-visible:ring-0 px-0"
                                            value={joinForm.data.code}
                                            onChange={e => joinForm.setData('code', e.target.value)}
                                            maxLength={6}
                                        />
                                        <Button type="submit" disabled={joinForm.processing} className="rounded-full bg-[#165B33] hover:bg-[#124d2b] dark:bg-green-700 dark:hover:bg-green-600 text-white h-10 px-6">
                                            Rejoindre
                                        </Button>
                                    </form>

                                </div>
                                {joinForm.errors.code && <p className="text-sm font-bold text-[#F8B803] dark:text-yellow-300 bg-black/20 dark:bg-gray-800/40 px-3 py-1 rounded-full">{joinForm.errors.code}</p>}
                            </div>
                        </div>

                        {groups && groups.length > 0 ? (
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
                        ) : (
                            <div className="text-center text-white/80 animate-fade-in-up">
                                <p className="text-lg">Vous n'avez pas encore rejoint de groupe.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
