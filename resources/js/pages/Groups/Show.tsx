import { Head, Link, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';
import { useSnowflakes } from '@/hooks/useSnowflakes';
import ChristmasTree from '@/components/ChristmasTree';
import { ChevronLeft } from 'lucide-react';

export default function GroupShow({ group, participants, draw }: { group: any, participants: any[], draw: any }) {
    const { auth } = usePage<SharedData>().props;
    const snowflakes = useSnowflakes(20);

    const myWishlist = participants.find((p: any) => p.id === auth.user.id)?.assigned_wishlist;

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
                <div className="mb-10 flex flex-col items-center">
                    <Link
                        href="/"
                        className="mb-6 flex items-center gap-2 self-start rounded-full bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-sm transition-colors hover:bg-white/20"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Back to Home
                    </Link>

                    <h1 className="font-christmas mb-2 text-5xl font-bold text-white drop-shadow-md sm:text-7xl">
                        {group.name}
                    </h1>
                    <p className="text-red-100">
                        Managed by {group.admin_id === auth.user.id ? 'You' : 'Admin'}
                    </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-2">

                    {/* LEFT COLUMN: Mission & My Wishlist */}
                    <div className="flex flex-col gap-8">

                        {/* SECRET MISSION CARD */}
                        <div className="rounded-2xl bg-[#165B33] p-8 shadow-xl border-4 border-[#F8B803]/50 relative overflow-hidden group hover:scale-[1.02] transition-transform">
                            <div className="relative z-10">
                                <h2 className="font-christmas mb-4 text-3xl font-bold text-[#F8B803]">
                                    🤫 Your Secret Mission
                                </h2>
                                {draw ? (
                                    <div>
                                        <p className="mb-2 text-lg text-green-100">You must prepare a gift for:</p>
                                        <div className="text-4xl font-bold text-white mb-4">
                                            {draw.target?.name}
                                        </div>
                                        <div className="rounded-lg bg-black/20 p-4">
                                            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#F8B803]">
                                                Their Wishlist
                                            </p>
                                            <ul className="list-inside list-disc space-y-1 text-green-50">
                                                {/* Find target in participants list to get their wishlist */}
                                                {participants.find((p: any) => p.id === draw.target_id)?.assigned_wishlist?.items?.length > 0 ? (
                                                    participants.find((p: any) => p.id === draw.target_id)?.assigned_wishlist?.items.map((item: any) => (
                                                        <li key={item.id}>
                                                            <span className="font-medium">{item.name}</span>
                                                            {item.url && (
                                                                <a href={item.url} target="_blank" rel="noreferrer" className="ml-2 text-xs text-[#F8B803] underline">Link</a>
                                                            )}
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li className="italic opacity-70">No gifts added yet...</li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-xl text-white">The draw hasn't happened yet! Check back later.</p>
                                )}
                            </div>
                            {/* Decorative shimmer */}
                            <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-white/10 blur-3xl opacity-50" />
                        </div>

                        {/* MY WISHLIST CARD */}
                        <div className="rounded-2xl bg-white/10 backdrop-blur-md p-8 shadow-lg border border-white/20">
                            <h2 className="font-christmas mb-4 text-3xl font-bold text-white">
                                📝 Your Wishlist
                            </h2>
                            {myWishlist?.items?.length > 0 ? (
                                <ul className="space-y-3">
                                    {myWishlist.items.map((item: any) => (
                                        <li key={item.id} className="flex items-center gap-3 rounded-lg bg-white/5 p-3">
                                            <span className="text-2xl">🎁</span>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold truncate">{item.name}</p>
                                                {item.url && <a href={item.url} target="_blank" className="text-xs text-[#F8B803] hover:underline truncate block">{item.url}</a>}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-red-100 italic">You haven't added any wishes yet.</p>
                            )}
                            <button className="mt-6 w-full rounded-full bg-white py-2 font-bold text-[#D42426] hover:bg-gray-100 transition-colors">
                                Edit My Wishlist
                            </button>
                        </div>

                    </div>

                    {/* RIGHT COLUMN: Participants List */}
                    <div className="rounded-2xl bg-white/10 backdrop-blur-md p-8 shadow-lg border border-white/20">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-christmas text-3xl font-bold text-white">
                                👥 Participants ({participants.length})
                            </h2>
                            <span className="text-2xl">🎄</span>
                        </div>

                        <div className="grid gap-4">
                            {participants.map((participant: any) => (
                                <div key={participant.id} className={`flex items-start gap-4 rounded-xl p-4 transition-all ${participant.id === auth.user.id ? 'bg-[#F8B803]/20 border border-[#F8B803]/50' : 'bg-white/5 border border-white/10'}`}>
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-lg font-bold">
                                        {participant.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-bold truncate text-lg">
                                                {participant.name} {participant.id === auth.user.id && '(You)'}
                                            </h3>
                                        </div>

                                        {/* Wishlist Preview */}
                                        <div className="mt-2">
                                            <p className="text-xs font-semibold uppercase tracking-wider text-white/60 mb-1">
                                                Wishlist:
                                            </p>
                                            {participant.assigned_wishlist?.items?.length > 0 ? (
                                                <ul className="text-sm space-y-1 text-red-50">
                                                    {participant.assigned_wishlist.items.map((item: any) => (
                                                        <li key={item.id} className="flex items-center gap-1.5 truncate">
                                                            <span className="block h-1.5 w-1.5 rounded-full bg-[#F8B803]" />
                                                            {item.name}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-sm italic text-white/40">Empty...</p>
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
