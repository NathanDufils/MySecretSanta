import AppLogoIcon from '@/components/app-logo-icon';
import { useSnowflakes } from '@/hooks/useSnowflakes';
import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    const snowflakes = useSnowflakes(20);

    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 overflow-hidden bg-gradient-to-b from-[#D42426] to-[#8C1819] p-6 md:p-10 text-foreground selection:bg-[#F8B803] selection:text-[#391800]">
            {/* Custom Styles for Snow */}
            <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Mountains+of+Christmas:wght@400;700&display=swap');
            .font-christmas { font-family: 'Mountains of Christmas', cursive; }

            .snowflake {
                position: absolute;
            top: -3vh;
            color: white;
            animation: fall linear infinite;
                }

            @keyframes fall {
                0 % { transform: translateY(-10vh) translateX(0px); opacity: 0; }
                    10% {opacity: 0.8; }
            100% {transform: translateY(100vh) translateX(20px); opacity: 0.3; }
                }
            `}</style>

            {/* Snow Animation Layer */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 select-none">
                {snowflakes.map((flake, i) => (
                    <div
                        key={i}
                        className="snowflake text-xl"
                        style={flake}
                    >
                        ❄
                    </div>
                ))}
            </div>

            <div className="relative z-10 w-full max-w-lg rounded-xl bg-background/95 p-8 shadow-2xl backdrop-blur-sm">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-2 font-medium"
                        >
                            <div className="mb-1 flex h-9 w-9 items-center justify-center rounded-md">
                                <AppLogoIcon className="size-9 fill-current text-[var(--foreground)]" />
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="text-3xl font-bold font-christmas text-[#D42426]">{title}</h1>
                            <p className="text-center text-sm text-muted-foreground">
                                {description}
                            </p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div >
    );
}
