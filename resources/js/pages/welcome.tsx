import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Heart } from 'lucide-react';
import { type SharedData, type Group, type Invitation } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

import { useSnowflakes } from '@/hooks/useSnowflakes';

// Components
import GuestWelcome from '@/components/Welcome/GuestWelcome';
import UserDashboard from '@/components/Dashboard/UserDashboard';
import NotificationsDropdown from '@/components/Dashboard/NotificationsDropdown';

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

    return (
        <>
            <Head title="Secret Santa - Ho Ho Ho!" />

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
                        <NotificationsDropdown invitations={invitations} />

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

                {/* Main Content */}
                {!auth.user ? (
                    <GuestWelcome canRegister={canRegister} />
                ) : (
                    <UserDashboard groups={groups} />
                )}
            </div>
        </>
    );
}
