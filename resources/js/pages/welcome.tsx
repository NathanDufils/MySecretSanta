import ChristmasTree from '@/components/ChristmasTree';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Check, X, Bell, Heart, Plus } from 'lucide-react';
import { type SharedData, type Group, type Invitation } from '@/types';
import { Head, Link, usePage, router } from '@inertiajs/react';

import { useSnowflakes } from '@/hooks/useSnowflakes';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

// Components
import CreateGroupDialog from '@/components/Groups/CreateGroupDialog';
import JoinGroupForm from '@/components/Groups/JoinGroupForm';
import GroupList from '@/components/Groups/GroupList';

interface WelcomeProps {
    canRegister?: boolean;
    groups?: Group[];
    invitations?: Invitation[];
}

export default function Welcome({
    canRegister = true,
    groups = [],
    invitations = [],
}: WelcomeProps) {
    const { auth } = usePage<SharedData>().props;

    const snowflakes = useSnowflakes(20);
    const smallSnowflakes = useSnowflakes(15, 8);

    const [isCreateOpen, setIsCreateOpen] = useState(false);

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
            {/* Custom Styles for Snow and Fonts */}


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
                                                        <X className="w-3 h-3" /> Refuser
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
                                    <CreateGroupDialog
                                        open={isCreateOpen}
                                        onOpenChange={setIsCreateOpen}
                                    />

                                    {/* Join Group Form */}
                                    <JoinGroupForm />

                                </div>
                            </div>
                        </div>

                        <GroupList groups={groups} />
                    </div>
                )}
            </div>
        </>
    );
}
