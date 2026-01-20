import { Link } from '@inertiajs/react';

interface GuestWelcomeProps {
    canRegister: boolean;
}

export default function GuestWelcome({ canRegister }: GuestWelcomeProps) {
    return (
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-6 text-center selection:bg-none">

            {/* Logo & Text Section */}
            <div className="flex flex-col items-center max-w-4xl w-full animate-fade-in-down">
                <img
                    src="/images/logo.png"
                    alt="My Secret Santa"
                    className="mb-8 w-80 md:w-[500px] h-auto drop-shadow-2xl transition-transform duration-500"
                />

                <p className="mx-auto max-w-2xl text-xl text-red-100 sm:text-2xl font-medium leading-relaxed mb-12 drop-shadow-sm">
                    Organisez l'échange de cadeaux le plus magique avec vos amis et votre famille !
                </p>

                {/* Action Button */}
                <div className="animate-fade-in-up delay-200">
                    {canRegister && (
                        <Link
                            href="/register"
                            className="group relative inline-flex min-w-[200px] items-center justify-center overflow-hidden rounded-full bg-[#F8B803] px-10 py-4 text-lg font-bold text-[#391800] shadow-[0_0_20px_rgba(248,184,3,0.3)] transition-all hover:scale-110 hover:bg-[#e0a602] hover:shadow-[0_0_30px_rgba(248,184,3,0.5)] focus:outline-none focus:ring-4 focus:ring-[#F8B803]/50"
                        >
                            <span className="relative z-10 uppercase tracking-wider">Commencer</span>
                            <div className="absolute inset-0 -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
