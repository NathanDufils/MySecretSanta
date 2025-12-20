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
import { Head, Link, useForm, usePage } from '@inertiajs/react';

import { useSnowflakes } from '@/hooks/useSnowflakes';
import { ChevronRight, Users, Gift, Snowflake, X } from 'lucide-react';
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

export default function Welcome({
    canRegister = true,
    groups = [],
}: {
    canRegister?: boolean;
    groups?: any[];
}) {
    const { auth } = usePage<SharedData>().props;

    const snowflakes = useSnowflakes(20);
    const smallSnowflakes = useSnowflakes(15, 8);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
    });

    const createGroup: FormEventHandler = (e) => {
        e.preventDefault();
        post('/groups', {
            onSuccess: () => {
                setIsCreateOpen(false);
                reset();
            },
        });
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
                                    Organize the most magical gift exchange with your friends and family!
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-4 sm:flex-row sm:gap-6 animate-fade-in-up delay-200">
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
                            </div>
                        </div>
                    </div>
                )}

                {/* Groups Section - Only for Logged In User */}
                {auth.user && (
                    <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-20">
                        <div className="mb-12 text-center animate-fade-in-down">
                            <h2 className="font-christmas text-5xl font-bold text-white drop-shadow-md sm:text-6xl">
                                Your Groups
                            </h2>
                            <p className="mt-4 text-xl text-red-100">
                                Connect with your Secret Santa events
                            </p>
                            <div className="mt-8 flex justify-center">
                                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="rounded-full bg-[#F8B803] px-8 py-6 text-lg font-bold text-[#391800] hover:bg-[#e0a602]">
                                            + Create New Group
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[480px] bg-transparent border-none shadow-none p-0 overflow-visible focus:outline-none">
                                        <div className="relative flex flex-col items-center">
                                            {/* The Globe */}
                                            <div className="relative w-full aspect-square rounded-full bg-gradient-to-b from-blue-50/50 to-white/40 backdrop-blur-md border-4 border-white/60 shadow-[0_0_50px_rgba(255,255,255,0.6)] flex flex-col items-center justify-center p-12 overflow-hidden z-10">

                                                {/* Close Button */}
                                                <DialogClose className="absolute top-4 text-white/80 hover:text-white transition-colors z-50 rounded-full p-2 bg-black/20 hover:bg-black/30">
                                                    <X className="w-6 h-6" />
                                                </DialogClose>

                                                {/* Internal Snow/Sparkle Effect (Static for performance) */}
                                                <div className="absolute inset-0 pointer-events-none">
                                                    <div className="absolute top-10 left-10 text-white/40 text-xs">❄</div>
                                                    <div className="absolute top-20 right-14 text-white/30 text-xl">❅</div>
                                                    <div className="absolute bottom-16 left-20 text-white/20 text-lg">❄</div>
                                                </div>

                                                <DialogHeader className="mb-6 text-center relative z-20">
                                                    <DialogTitle className="font-christmas text-4xl text-[#D42426] drop-shadow-sm">Create a New Group</DialogTitle>
                                                    <DialogDescription className="text-slate-700 font-medium">
                                                        Give your group a name to get started.
                                                    </DialogDescription>
                                                </DialogHeader>

                                                <form onSubmit={createGroup} className="w-full relative z-20">
                                                    <div className="grid gap-4 py-4">
                                                        <div className="flex flex-col gap-2">
                                                            <Label htmlFor="name" className="text-center text-[#165B33] font-bold">
                                                                Group Name
                                                            </Label>
                                                            <Input
                                                                id="name"
                                                                value={data.name}
                                                                onChange={(e) => setData('name', e.target.value)}
                                                                className="col-span-3 text-center bg-white/60 border-[#165B33]/30 focus:border-[#165B33] placeholder:text-slate-500 text-black"
                                                                placeholder="Family"
                                                            />
                                                        </div>
                                                        {errors.name && (
                                                            <div className="text-center text-sm text-[#D42426] font-bold bg-white/80 rounded-full px-2 py-0.5">{errors.name}</div>
                                                        )}
                                                    </div>
                                                    <DialogFooter className="justify-center sm:justify-center mt-2">
                                                        <Button type="submit" disabled={processing} className="bg-[#D42426] hover:bg-[#b01e20] text-white rounded-full px-8 shadow-lg hover:scale-105 transition-transform">
                                                            Create Group
                                                        </Button>
                                                    </DialogFooter>
                                                </form>
                                            </div>

                                            {/* The Base */}
                                            <div className="w-[80%] h-24 bg-gradient-to-r from-[#8C1819] via-[#D42426] to-[#8C1819] rounded-b-[3rem] -mt-12 pt-16 relative z-0 border-x-4 border-b-4 border-[#391800]/20 shadow-2xl flex items-end justify-center pb-4">
                                                <div className="text-[#F8B803] font-christmas text-xl opacity-80">Ho Ho Ho!</div>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
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
                                            <p className="mb-6 text-sm text-red-100">
                                                Gift Exchange: {new Date(group.event_date).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                            </p>
                                            <div
                                                className="inline-flex items-center gap-2 text-sm font-semibold text-[#F8B803] transition-colors group-hover:text-[#ffd666]"
                                            >
                                                Enter Group
                                                <span aria-hidden="true">→</span>
                                            </div>
                                        </div>
                                        <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-[#D42426]/30 blur-2xl transition-all group-hover:bg-[#D42426]/50" />
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-white/80 animate-fade-in-up">
                                <p className="text-lg">You haven't joined any groups yet.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
