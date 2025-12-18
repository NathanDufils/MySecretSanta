import { dashboard, login, register, logout } from '@/routes';
import ChristmasTree from '@/components/ChristmasTree';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

import { useSnowflakes } from '@/hooks/useSnowflakes';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;

    const snowflakes = useSnowflakes(20);
    const smallSnowflakes = useSnowflakes(15, 8);

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

                {/* User Dropdown */}
                {auth.user && (
                    <div className="absolute right-6 top-6 z-50">
                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus:outline-none">
                                <span className="font-semibold">{auth.user.name}</span>
                                <ChevronDown className="h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem asChild>
                                    <Link href={dashboard()} className="w-full cursor-pointer">
                                        Dashboard
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link
                                        href={logout()}
                                        method="post"
                                        as="button"
                                        className="w-full cursor-pointer"
                                    >
                                        Log Out
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )}

                {/* Main Content */}
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
                                Organize the most magical gift exchange with your friends and family!
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6 animate-fade-in-up delay-200">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-[#165B33] px-8 py-4 font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-[#124929] focus:outline-none focus:ring-4 focus:ring-[#F8B803]"
                                >
                                    <span className="relative z-10">Access Dashboard</span>
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="group relative inline-flex min-w-[160px] items-center justify-center overflow-hidden rounded-full bg-white px-8 py-3 font-bold text-[#D42426] shadow-lg transition-transform hover:scale-105 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-white/50"
                                    >
                                        <span className="relative z-10">Login</span>
                                    </Link>

                                    {canRegister && (
                                        <Link
                                            href={register()}
                                            className="group relative inline-flex min-w-[160px] items-center justify-center overflow-hidden rounded-full bg-[#F8B803] px-8 py-3 font-bold text-[#391800] shadow-lg transition-transform hover:scale-105 hover:bg-[#e0a602] focus:outline-none focus:ring-4 focus:ring-[#F8B803]/50"
                                        >
                                            <span className="relative z-10">Get Started</span>
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
