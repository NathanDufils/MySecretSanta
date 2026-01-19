import ChristmasTree from '@/components/ChristmasTree';
import { Link } from '@inertiajs/react';

interface GuestWelcomeProps {
    canRegister: boolean;
}

export default function GuestWelcome({ canRegister }: GuestWelcomeProps) {
    return (
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
    );
}
